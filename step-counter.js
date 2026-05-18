/* Contador de pasos — detección por picos + umbral adaptativo (anti-falsos) */
const StepCounter = (function () {
  const GOAL = 10000;
  const MIN_STEP_MS = 500;       /* máx ~120 pasos/min */
  const WARMUP_MS = 2500;        /* calibrar ruido antes de contar */
  const HISTORY_LEN = 48;
  const MIN_PEAK_DELTA = 1.15;   /* m/s² mínimo sobre la media */
  const ALPHA = 0.86;

  let listening = false;
  let sessionSteps = 0;
  let lastStepAt = 0;
  let calStart = 0;
  let calibrated = false;
  let gravity = { x: 0, y: 0, z: 0 };
  let samples = [];
  let lastMag = 0;
  let peakMag = 0;
  let inStride = false;

  function todayKey() {
    const n = new Date();
    const pad = function (x) { return (x < 10 ? '0' : '') + x; };
    return n.getFullYear() + '-' + pad(n.getMonth() + 1) + '-' + pad(n.getDate());
  }

  function getSteps() {
    try {
      const v = localStorage.getItem('mr_steps_' + todayKey());
      return v ? parseInt(v, 10) : 0;
    } catch (e) { return 0; }
  }

  function setSteps(n) {
    const val = Math.max(0, Math.min(99999, Math.round(n)));
    try { localStorage.setItem('mr_steps_' + todayKey(), String(val)); } catch (e) {}
    updateUI(val);
    return val;
  }

  function addSteps(n) {
    return setSteps(getSteps() + (n || 0));
  }

  function mean(arr) {
    if (!arr.length) return 0;
    return arr.reduce(function (a, b) { return a + b; }, 0) / arr.length;
  }

  function stdDev(arr, m) {
    if (arr.length < 2) return 0;
    const v = arr.reduce(function (a, b) { return a + (b - m) * (b - m); }, 0) / arr.length;
    return Math.sqrt(v);
  }

  function getLinearMagnitude(e) {
    if (e.acceleration && e.acceleration.x != null) {
      const ax = e.acceleration.x;
      const ay = e.acceleration.y;
      const az = e.acceleration.z;
      return Math.sqrt(ax * ax + ay * ay + az * az);
    }
    const a = e.accelerationIncludingGravity;
    if (!a || a.x == null) return 0;
    gravity.x = ALPHA * gravity.x + (1 - ALPHA) * a.x;
    gravity.y = ALPHA * gravity.y + (1 - ALPHA) * a.y;
    gravity.z = ALPHA * gravity.z + (1 - ALPHA) * a.z;
    const dx = a.x - gravity.x;
    const dy = a.y - gravity.y;
    const dz = a.z - gravity.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  function updateUI(total) {
    const val = document.getElementById('steps-val');
    const fill = document.getElementById('steps-fill');
    const stat = document.getElementById('stat-steps');
    const status = document.getElementById('steps-status');
    const pct = Math.min(100, (total / GOAL) * 100);
    if (val) val.textContent = total.toLocaleString('es') + ' / ' + GOAL.toLocaleString('es');
    if (fill) fill.style.width = pct + '%';
    if (stat) stat.textContent = total.toLocaleString('es');
    if (!status) return;
    if (!listening) {
      status.textContent = '';
      return;
    }
    if (!calibrated) {
      status.textContent = '⏳ Calibrando sensor (' + Math.max(0, Math.ceil((WARMUP_MS - (Date.now() - calStart)) / 1000)) + 's)...';
      return;
    }
    status.textContent = '● Caminando — ' + sessionSteps + ' pasos esta sesión';
  }

  function setStatusHint() {
    const status = document.getElementById('steps-status');
    if (status && listening) {
      status.textContent = '● Activo — lleva el móvil en el bolsillo al caminar';
    }
  }

  function onMotion(e) {
    if (!listening) return;
    const mag = getLinearMagnitude(e);
    if (mag === 0) return;
    const now = Date.now();

    if (!calibrated) {
      if (!calStart) calStart = now;
      samples.push(mag);
      if (samples.length > HISTORY_LEN) samples.shift();
      updateUI(getSteps());
      if (now - calStart >= WARMUP_MS) {
        calibrated = true;
        setStatusHint();
      }
      return;
    }

    samples.push(mag);
    if (samples.length > HISTORY_LEN) samples.shift();

    const m = mean(samples);
    const s = stdDev(samples, m);
    const threshHigh = m + Math.max(MIN_PEAK_DELTA, s * 2.1);
    const threshLow = m + Math.max(0.45, s * 0.9);

    /* Ignorar vibraciones cuando el móvil está quieto (varianza muy baja) */
    if (s < 0.08 && !inStride) {
      lastMag = mag;
      return;
    }

    if (!inStride) {
      if (mag > threshHigh && mag > lastMag) {
        inStride = true;
        peakMag = mag;
      }
    } else {
      if (mag > peakMag) peakMag = mag;
      if (mag < threshLow) {
        const peakDelta = peakMag - m;
        const intervalOk = now - lastStepAt >= MIN_STEP_MS;
        const peakOk = peakDelta >= MIN_PEAK_DELTA && peakDelta >= s * 1.4;
        if (intervalOk && peakOk) {
          lastStepAt = now;
          sessionSteps++;
          addSteps(1);
        }
        inStride = false;
        peakMag = 0;
      }
    }

    lastMag = mag;
    updateUI(getSteps());
  }

  function resetCalibration() {
    calibrated = false;
    calStart = 0;
    samples = [];
    inStride = false;
    peakMag = 0;
    lastMag = 0;
  }

  function beginListen() {
    resetCalibration();
    sessionSteps = 0;
    listening = true;
    try { localStorage.setItem('mr_steps_active', '1'); } catch (e) {}
    window.addEventListener('devicemotion', onMotion, true);
    const btn = document.getElementById('steps-toggle-btn');
    if (btn) btn.textContent = '⏸ Pausar contador';
    updateUI(getSteps());
  }

  function start() {
    if (listening) return Promise.resolve(true);
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      return DeviceMotionEvent.requestPermission().then(function (r) {
        if (r === 'granted') { beginListen(); return true; }
        alert('Activa "Movimiento y orientación" para contar pasos al caminar.');
        return false;
      }).catch(function () { return false; });
    }
    beginListen();
    return Promise.resolve(true);
  }

  function stop() {
    listening = false;
    try { localStorage.setItem('mr_steps_active', '0'); } catch (e) {}
    window.removeEventListener('devicemotion', onMotion, true);
    const btn = document.getElementById('steps-toggle-btn');
    if (btn) btn.textContent = '▶ Activar contador';
    const status = document.getElementById('steps-status');
    if (status) status.textContent = '';
  }

  function toggle() {
    if (listening) stop();
    else return start();
  }

  function resetToday() {
    setSteps(0);
    sessionSteps = 0;
    lastStepAt = 0;
  }

  function syncFromURL() {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('sync_steps');
    if (s && !isNaN(parseInt(s, 10))) {
      const n = parseInt(s, 10);
      setSteps(Math.max(getSteps(), n));
      if (window.history.replaceState) {
        params.delete('sync_steps');
        const q = params.toString();
        window.history.replaceState({}, '', window.location.pathname + (q ? '?' + q : ''));
      }
    }
  }

  function tryResume() {
    try {
      if (localStorage.getItem('mr_steps_active') === '1') start();
    } catch (e) {}
  }

  function init() {
    syncFromURL();
    updateUI(getSteps());
    tryResume();
  }

  return {
    init: init,
    start: start,
    stop: stop,
    toggle: toggle,
    getSteps: getSteps,
    addSteps: addSteps,
    setSteps: setSteps,
    resetToday: resetToday,
    updateUI: updateUI,
    isListening: function () { return listening; },
  };
})();
