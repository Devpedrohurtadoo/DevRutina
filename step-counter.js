/* Contador automático de pasos — sensor + sync Salud vía URL */
const StepCounter = (function () {
  let listening = false;
  let lastStepAt = 0;
  let sessionSteps = 0;
  let gravity = { x: 0, y: 0, z: 0 };
  const ALPHA = 0.88;
  const MIN_GAP = 280;
  const STEP_THRESH = 1.05;
  const GOAL = 10000;

  function todayKey() {
    const n = new Date();
    const pad = x => (x < 10 ? '0' : '') + x;
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

  function updateUI(total) {
    const val = document.getElementById('steps-val');
    const fill = document.getElementById('steps-fill');
    const stat = document.getElementById('stat-steps');
    const status = document.getElementById('steps-status');
    const pct = Math.min(100, (total / GOAL) * 100);
    if (val) val.textContent = total.toLocaleString('es') + ' / ' + GOAL.toLocaleString('es');
    if (fill) fill.style.width = pct + '%';
    if (stat) stat.textContent = total.toLocaleString('es');
    if (status && listening) status.textContent = '● Contando (' + sessionSteps + ' esta sesión)';
    else if (status) status.textContent = '';
  }

  function onMotion(e) {
    const a = e.accelerationIncludingGravity;
    if (!a) return;
    gravity.x = ALPHA * gravity.x + (1 - ALPHA) * a.x;
    gravity.y = ALPHA * gravity.y + (1 - ALPHA) * a.y;
    gravity.z = ALPHA * gravity.z + (1 - ALPHA) * a.z;
    const dx = a.x - gravity.x;
    const dy = a.y - gravity.y;
    const dz = a.z - gravity.z;
    const mag = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const now = Date.now();
    if (mag > STEP_THRESH && now - lastStepAt > MIN_GAP) {
      lastStepAt = now;
      sessionSteps++;
      addSteps(1);
    }
  }

  function start() {
    if (listening) return true;
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      return DeviceMotionEvent.requestPermission().then(function (r) {
        if (r === 'granted') { beginListen(); return true; }
        alert('Permite "Movimiento y orientación" para contar pasos automáticamente.');
        return false;
      }).catch(function () { return false; });
    }
    beginListen();
    return Promise.resolve(true);
  }

  function beginListen() {
    listening = true;
    sessionSteps = 0;
    window.addEventListener('devicemotion', onMotion, true);
    const btn = document.getElementById('steps-toggle-btn');
    if (btn) btn.textContent = '⏸ Pausar contador';
    const status = document.getElementById('steps-status');
    if (status) status.textContent = '● Contando pasos...';
  }

  function stop() {
    listening = false;
    window.removeEventListener('devicemotion', onMotion, true);
    const btn = document.getElementById('steps-toggle-btn');
    if (btn) btn.textContent = '▶ Activar contador';
    const status = document.getElementById('steps-status');
    if (status) status.textContent = '';
  }

  function toggle() {
    if (listening) stop();
    else start();
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

  function init() {
    syncFromURL();
    updateUI(getSteps());
  }

  return { init, start, stop, toggle, getSteps, addSteps, setSteps, updateUI, isListening: () => listening };
})();
