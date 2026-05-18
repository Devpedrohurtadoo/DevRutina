/* Mi Rutina — lógica principal */
const STORAGE = 'mr_';
const HABIT_COUNT = 8;
const RING_CIRC = 175.9;
const memStore = {};

let wakeHour = null;
let wakeMinute = 0;
let timerSeconds = 120;
let timerInterval = null;
let timerRunning = false;

const gymDays = ['Push hipertrofia (5×5 banca)', 'Pull hipertrofia (remo 4×6)', 'Pierna (5×5 sentadilla)', 'Push 2 (inclinado 4×6)', 'Pull 2 (peso muerto 3×5)', 'Descanso activo', 'Descanso activo'];

function pad(n) { return n < 10 ? '0' + n : n; }

function todayKey() {
  const n = new Date();
  return n.getFullYear() + '-' + pad(n.getMonth() + 1) + '-' + pad(n.getDate());
}

function loadJSON(key, def) {
  try {
    const v = localStorage.getItem(STORAGE + key);
    if (v !== null && v !== undefined) return JSON.parse(v);
  } catch (e) {}
  if (Object.prototype.hasOwnProperty.call(memStore, key)) return memStore[key];
  return def;
}

function saveJSON(key, val) {
  try { localStorage.setItem(STORAGE + key, JSON.stringify(val)); } catch (e) {}
  memStore[key] = val;
}

function getProfile() {
  return loadJSON('profile', { proteinGoal: 160, waterGoal: 3000, dayMode: 'normal' });
}

function saveProfile(p) { saveJSON('profile', p); }

function getDayState() {
  const k = todayKey();
  const all = loadJSON('days', {});
  if (!all[k]) all[k] = { water: 0, protein: 0, habits: [], wakeHour: null, wakeMinute: 0, snoozeUntil: null, browseMode: false };
  return all[k];
}

function saveDayState(st) {
  const all = loadJSON('days', {});
  all[todayKey()] = st;
  saveJSON('days', all);
}

function getWakeToday() {
  const st = getDayState();
  if (st.wakeHour === null || st.wakeHour === undefined) return null;
  return { h: st.wakeHour, m: st.wakeMinute || 0 };
}

function isAwakeToday() {
  const w = getWakeToday();
  return w !== null;
}

function hideWakeOverlay() {
  const o = document.getElementById('wake-overlay');
  if (o) o.classList.add('hidden');
}

function showWakeOverlay() {
  const o = document.getElementById('wake-overlay');
  if (o) o.classList.remove('hidden');
}

function confirmWake() {
  const now = new Date();
  wakeHour = now.getHours();
  wakeMinute = now.getMinutes();
  const st = getDayState();
  st.wakeHour = wakeHour;
  st.wakeMinute = wakeMinute;
  st.snoozeUntil = null;
  st.browseMode = false;
  saveDayState(st);
  hideWakeOverlay();
  updateWakeUI();
  buildTimelines();
  updateAhoraToca();
  updateTrackers();
  /* Pasos: activar manualmente al caminar (bolsillo) — evita falsos al usar el móvil en la cama */
}

function browseAppNow() {
  const st = getDayState();
  st.browseMode = true;
  saveDayState(st);
  hideWakeOverlay();
  updateWakeUI();
}

function scheduleSnooze(minutes) {
  const st = getDayState();
  st.snoozeUntil = Date.now() + minutes * 60 * 1000;
  saveDayState(st);
  hideWakeOverlay();
  updateWakeUI();
}

function toggleSnoozePanel() {
  const p = document.getElementById('snooze-panel');
  if (p) p.classList.toggle('open');
}

function checkMidnightReset() {
  const last = loadJSON('lastDay', null);
  const today = todayKey();
  if (last && last !== today) {
    document.querySelectorAll('.habit-item').forEach(h => {
      h.classList.remove('done');
      const c = h.querySelector('.habit-check');
      if (c) c.textContent = '';
    });
    if (typeof StepCounter !== 'undefined') StepCounter.setSteps(0);
  }
  saveJSON('lastDay', today);
}

function updateWakeUI() {
  const st = getDayState();
  const w = getWakeToday();
  const bar = document.getElementById('wake-bar');
  const info = document.getElementById('wake-info');
  const overlay = document.getElementById('wake-overlay');

  if (st.browseMode && !w) {
    if (bar) bar.style.display = 'block';
    if (info) info.textContent = 'Modo exploración — confirma cuando te despiertes';
    if (overlay) overlay.classList.add('hidden');
    return;
  }

  if (st.snoozeUntil && Date.now() < st.snoozeUntil && !w) {
    if (bar) bar.style.display = 'block';
    const left = Math.ceil((st.snoozeUntil - Date.now()) / 60000);
    if (info) info.textContent = 'Recordatorio en ~' + left + ' min';
    if (overlay) overlay.classList.add('hidden');
    return;
  }

  if (!w) {
    if (bar) bar.style.display = 'none';
    if (overlay) overlay.classList.remove('hidden');
    wakeHour = null;
    return;
  }

  wakeHour = w.h;
  wakeMinute = w.m;
  if (bar) bar.style.display = 'block';
  if (info) info.textContent = 'Despertaste a las ' + pad(w.h) + ':' + pad(w.m);
  if (overlay) overlay.classList.add('hidden');
}

function tick() {
  const now = new Date();
  const el = document.getElementById('clock');
  if (el) el.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes());
  const st = getDayState();
  if (st.snoozeUntil && Date.now() >= st.snoozeUntil && !isAwakeToday()) showWakeOverlay();
}

function setHeroDate() {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const now = new Date();
  const wd = now.getDay();
  const hd = document.getElementById('hero-date');
  const hg = document.getElementById('habit-gym-day');
  if (hd) hd.textContent = days[wd] + ', ' + now.getDate() + ' de ' + months[now.getMonth()];
  if (hg) hg.textContent = gymDays[wd];
}

function fmt(h, m) {
  let hh = h, mm = m || 0;
  if (mm >= 60) { hh += Math.floor(mm / 60); mm = mm % 60; }
  hh = ((hh % 24) + 24) % 24;
  return pad(hh) + ':' + pad(mm);
}

function tli(time, title, desc) {
  return '<motion.div class="timeline-item"><div class="tl-time">' + time + '</div><motion.div class="tl-dot"></div><div class="tl-content"><div class="tl-title">' + title + '</div><div class="tl-desc">' + desc + '</div></div></motion.div>'.replace(/motion\.motion.div/g, 'motion.div').replace(/<motion\.div/g, '<div').replace(/<\/motion\.motion.div>/g, '</motion.div>').replace(/motion\.div/g, 'motion.div');
}

function tliFixed(time, title, desc) {
  return '<div class="timeline-item"><motion.div class="tl-time">' + time + '</div><div class="tl-dot"></div><div class="tl-content"><div class="tl-title">' + title + '</div><div class="tl-desc">' + desc + '</div></div></div>'.replace(/motion\.div/g, 'div');
}

function buildTimelines() {
  const w = wakeHour;
  if (w === null || w === undefined) return;
  const ms = document.getElementById('morning-sub');
  if (ms) ms.textContent = 'Desde las ' + fmt(w, 0);

  const morning = [
    [fmt(w, 0), '💧 Despierta + agua', 'Bebe 400-500ml de agua inmediatamente.'],
    [fmt(w, 5), '🦷 Higiene bucal completa', 'Rascador → cepillo 2 min → hilo → clorhexidina.'],
    [fmt(w, 15), '✨ Skincare mañana', 'Limpiador → Vitamina C → SPF 30.'],
    [fmt(w, 20), '☀️ 10 minutos de sol', 'Vitamina D + aspecto. Ya llevas SPF.'],
    [fmt(w, 32), '🚿 Ducha', 'Jabón antibacterial en axilas 30-40 seg.'],
    [fmt(w, 35), '🍳 Desayuno proteico', 'Ver sección Dieta.'],
  ];
  const mt = document.getElementById('morning-timeline');
  if (mt) mt.innerHTML = morning.map(a => tliFixed(a[0], a[1], a[2])).join('');

  const afternoon = [
    [fmt(w + 2, 30), '🥗 Media mañana', 'Yogur griego + frutos secos.'],
    [fmt(w + 4, 30), '🍚 Comida principal', 'Proteína + carbos + verduras.'],
    [fmt(w + 7, 30), '🏋️ Pre-gym snack', '30-45 min antes del gym.'],
    [fmt(w + 8, 0), '💪 Gimnasio', '60-75 min. Rutina PPL del día.'],
    [fmt(w + 9, 30), '🥤 Post-gym', 'Whey + carbos en 30-60 min.'],
  ];
  const at = document.getElementById('afternoon-timeline');
  if (at) at.innerHTML = afternoon.map(a => tliFixed(a[0], a[1], a[2])).join('');

  const night = [
    [fmt(w + 12, 0), '🍽️ Cena', 'Proteína + verduras.'],
    [fmt(w + 13, 30), '🌙 Skincare noche', 'Limpiador → Niacinamida → Hidratante.'],
    [fmt(w + 13, 45), '🦷 Higiene bucal noche', 'Rascador + cepillo + hilo + clorhexidina.'],
    [fmt(w + 14, 0), '🛡️ Antitranspirante de noche', 'Axilas secas. Aplicar de noche.'],
    [fmt(w + 15, 0), '😴 A dormir', '8-9h mínimo. Teléfono boca abajo.'],
  ];
  const nt = document.getElementById('night-timeline');
  if (nt) nt.innerHTML = night.map(a => tliFixed(a[0], a[1], a[2])).join('');

  ['d0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6'].forEach(d => {
    const el = document.getElementById(d + '-des');
    if (el) el.textContent = fmt(w, 30);
    const mm = document.getElementById(d + '-mm');
    if (mm) mm.textContent = fmt(w + 2, 30);
    const pg = document.getElementById(d + '-pg');
    if (pg) pg.textContent = fmt(w + 10, 0);
  });
}

function getWater() { return getDayState().water || 0; }
function getProtein() { return getDayState().protein || 0; }

function addWater(ml) {
  const st = getDayState();
  st.water = (st.water || 0) + ml;
  saveDayState(st);
  updateTrackers();
}

function addProtein(g) {
  const st = getDayState();
  st.protein = (st.protein || 0) + g;
  saveDayState(st);
  updateTrackers();
}

function updateTrackers() {
  const p = getProfile();
  const water = getWater();
  const protein = getProtein();
  const wGoal = p.waterGoal || 3000;
  const pGoal = p.proteinGoal || 160;

  const wv = document.getElementById('water-val');
  const wf = document.getElementById('water-fill');
  if (wv) wv.textContent = (water / 1000).toFixed(1) + 'L / ' + (wGoal / 1000).toFixed(1) + 'L';
  if (wf) wf.style.width = Math.min(100, (water / wGoal) * 100) + '%';
  const sw = document.getElementById('stat-water');
  if (sw) sw.textContent = (water / 1000).toFixed(1) + 'L';

  const pv = document.getElementById('protein-val');
  const pf = document.getElementById('protein-fill');
  if (pv) pv.textContent = protein + 'g / ' + pGoal + 'g';
  if (pf) pf.style.width = Math.min(100, (protein / pGoal) * 100) + '%';
  const sp = document.getElementById('stat-protein');
  if (sp) sp.textContent = protein + 'g';

  if (typeof StepCounter !== 'undefined') StepCounter.updateUI(StepCounter.getSteps());
  updateRing();
}

function getHabitsDone() {
  return document.querySelectorAll('.habit-item.done').length;
}

function updateRing() {
  const done = getHabitsDone();
  const offset = RING_CIRC - (done / HABIT_COUNT) * RING_CIRC;
  const ring = document.getElementById('ring-progress');
  const rv = document.getElementById('ring-val');
  if (ring) ring.style.strokeDashoffset = offset;
  if (rv) rv.textContent = done + '/' + HABIT_COUNT;
}

function updateStreak() {
  let streak = loadJSON('streak', { count: 0, last: null });
  const today = todayKey();
  const done = getHabitsDone();
  if (done >= 4) {
    if (streak.last !== today) {
      if (streak.last) {
        const y = new Date(streak.last);
        const t = new Date(today);
        const diff = (t - y) / 86400000;
        streak.count = diff === 1 ? streak.count + 1 : 1;
      } else streak.count = 1;
      streak.last = today;
      saveJSON('streak', streak);
    }
  }
  const el = document.getElementById('streak-val');
  if (el) el.textContent = streak.count;
  return streak.count;
}

function updateAhoraToca() {
  const el = document.getElementById('ahora-toca');
  if (!el) return;
  const w = getWakeToday();
  if (!w) { el.textContent = 'Confirma tu despertar para ver qué toca ahora.'; return; }
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const wakeMins = w.h * 60 + w.m;
  const diff = mins - wakeMins;
  const wd = now.getDay();
  let msg = '';
  if (diff < 30) msg = '💧 Agua + higiene bucal + skincare';
  else if (diff < 90) msg = '☀️ 10 min de sol (con SPF ya puesto)';
  else if (diff < 120) msg = '🍳 Desayuno proteico';
  else if (diff < 300) msg = '🥗 Comida o media mañana';
  else if (wd >= 1 && wd <= 5 && diff < 480) msg = '🏋️ Pre-gym o gym — ' + gymDays[wd];
  else if (diff < 720) msg = '🍽️ Cena + skincare noche';
  else msg = '😴 Prepárate para dormir. Antitranspirante de noche.';
  el.textContent = msg;
}

function loadHabits() {
  const st = getDayState();
  const items = document.querySelectorAll('.habit-item');
  items.forEach((el, i) => {
    const done = st.habits && st.habits.indexOf(i) >= 0;
    el.classList.toggle('done', done);
    const c = el.querySelector('.habit-check');
    if (c) c.textContent = done ? '✓' : '';
  });
}

function saveHabits() {
  const st = getDayState();
  st.habits = [];
  document.querySelectorAll('.habit-item').forEach((el, i) => {
    if (el.classList.contains('done')) st.habits.push(i);
  });
  saveDayState(st);
}

function toggleHabit(el) {
  el.classList.toggle('done');
  const check = el.querySelector('.habit-check');
  if (check) check.textContent = el.classList.contains('done') ? '✓' : '';
  saveHabits();
  updateRing();
  updateStreak();
}

function resetHabits() {
  document.querySelectorAll('.habit-item').forEach(h => {
    h.classList.remove('done');
    const c = h.querySelector('.habit-check');
    if (c) c.textContent = '';
  });
  saveHabits();
  updateRing();
}

function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const sec = document.getElementById('sec-' + name);
  const nav = document.getElementById('nav-' + name);
  if (sec) sec.classList.add('active');
  if (nav) nav.classList.add('active');
  const back = document.getElementById('back-bar');
  if (back) back.classList.toggle('visible', ['dieta', 'progreso', 'productos', 'ajustes'].indexOf(name) >= 0);
  window.scrollTo(0, 0);
}

function showMas() {
  showSection('mas');
}

function showGymDay(i) {
  document.querySelectorAll('.gym-day').forEach(d => d.classList.remove('active'));
  const g = document.getElementById('gym-' + i);
  if (g) g.classList.add('active');
  document.querySelectorAll('#gym-tabs .day-tab').forEach((t, ti) => t.classList.toggle('active', ti === i));
}

function showDietDay(i) {
  document.querySelectorAll('.diet-day').forEach(d => d.classList.remove('active'));
  const d = document.getElementById('diet-' + i);
  if (d) d.classList.add('active');
  document.querySelectorAll('.day-tabs:not(#gym-tabs) .day-tab').forEach((t, ti) => t.classList.toggle('active', ti === i));
}

function formatCoachText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

function sendCoachMessage(text) {
  const input = document.getElementById('coach-input');
  const msg = (text || (input && input.value) || '').trim();
  if (!msg) return;
  const chat = document.getElementById('coach-chat');
  if (!chat) return;
  const p = getProfile();
  const st = getDayState();
  const w = getWakeToday();
  const state = {
    wakeStr: w ? pad(w.h) + ':' + pad(w.m) : 'no registrada',
    water: st.water || 0,
    protein: st.protein || 0,
    habitsDone: getHabitsDone(),
    streak: loadJSON('streak', { count: 0 }).count || 0,
  };
  chat.innerHTML += '<div class="coach-msg user">' + msg.replace(/</g, '&lt;') + '</div>';
  const reply = typeof Coach !== 'undefined' ? Coach.getReply(msg, p, state) : 'Coach no disponible.';
  chat.innerHTML += '<div class="coach-msg bot">' + formatCoachText(reply) + '</div>';
  chat.scrollTop = chat.scrollHeight;
  if (input) input.value = '';
}

function renderCoachQuick() {
  const el = document.getElementById('coach-quick');
  if (!el || typeof Coach === 'undefined') return;
  el.innerHTML = Coach.getQuickReplies().map(q =>
    '<button type="button" class="coach-quick-btn" data-coach="' + q.replace(/"/g, '&quot;') + '">' + q + '</button>'
  ).join('');
}

function timerDisplay() {
  const m = Math.floor(timerSeconds / 60);
  const s = timerSeconds % 60;
  const el = document.getElementById('timer-display');
  if (el) el.textContent = pad(m) + ':' + pad(s);
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  timerInterval = setInterval(function () {
    if (timerSeconds > 0) {
      timerSeconds--;
      timerDisplay();
    } else {
      clearInterval(timerInterval);
      timerRunning = false;
      try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) {}
    }
  }, 1000);
}

function pauseTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
}

function resetTimer() {
  pauseTimer();
  timerSeconds = parseInt(document.getElementById('timer-preset')?.value || 120, 10);
  timerDisplay();
}

function saveWeight() {
  const inp = document.getElementById('weight-input');
  if (!inp || !inp.value) return;
  const logs = loadJSON('weightLog', []);
  logs.push({ date: todayKey(), kg: parseFloat(inp.value) });
  saveJSON('weightLog', logs.slice(-52));
  inp.value = '';
  renderWeightLog();
}

function renderWeightLog() {
  const el = document.getElementById('weight-log');
  if (!el) return;
  const logs = loadJSON('weightLog', []);
  if (!logs.length) { el.innerHTML = '<p style="color:var(--muted);font-size:13px;">Sin registros aún.</p>'; return; }
  el.innerHTML = logs.slice(-8).reverse().map(l =>
    '<div class="log-row"><span>' + l.date + '</span><strong>' + l.kg + ' kg</strong></div>'
  ).join('');
}

function saveMeasures() {
  const c = document.getElementById('meas-chest');
  const w = document.getElementById('meas-waist');
  const a = document.getElementById('meas-arms');
  if (!c || !c.value) return;
  const logs = loadJSON('measureLog', []);
  logs.push({
    date: todayKey(),
    chest: parseFloat(c.value),
    waist: w && w.value ? parseFloat(w.value) : null,
    arms: a && a.value ? parseFloat(a.value) : null,
  });
  saveJSON('measureLog', logs.slice(-26));
  c.value = ''; if (w) w.value = ''; if (a) a.value = '';
  alert('Medidas guardadas ✓');
}

function saveGoals() {
  const p = getProfile();
  const pg = document.getElementById('goal-protein');
  const wg = document.getElementById('goal-water');
  if (pg) p.proteinGoal = parseInt(pg.value, 10) || 160;
  if (wg) p.waterGoal = parseInt(wg.value, 10) || 3000;
  saveProfile(p);
  updateTrackers();
  alert('Metas guardadas ✓');
}

function bindEvents() {
  document.body.addEventListener('click', function (e) {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const act = t.getAttribute('data-action');
    if (act === 'wake') { e.preventDefault(); confirmWake(); return; }
    if (act === 'snooze-toggle') { e.preventDefault(); toggleSnoozePanel(); return; }
    if (act === 'browse') { e.preventDefault(); browseAppNow(); return; }
    if (act === 'snooze') { e.preventDefault(); scheduleSnooze(parseInt(t.getAttribute('data-min'), 10)); return; }
    if (act === 'water') { e.preventDefault(); addWater(parseInt(t.getAttribute('data-ml'), 10)); return; }
    if (act === 'protein') { e.preventDefault(); addProtein(parseInt(t.getAttribute('data-g'), 10)); return; }
    if (act === 'steps-toggle') {
      e.preventDefault();
      if (typeof StepCounter !== 'undefined') {
        const r = StepCounter.toggle();
        if (r && typeof r.then === 'function') r.catch(function () {});
      }
      return;
    }
    if (act === 'steps-add') {
      e.preventDefault();
      if (typeof StepCounter !== 'undefined') StepCounter.addSteps(parseInt(t.getAttribute('data-steps'), 10) || 0);
      return;
    }
    if (act === 'steps-reset') {
      e.preventDefault();
      if (typeof StepCounter !== 'undefined' && confirm('¿Reiniciar los pasos de hoy a 0?')) StepCounter.resetToday();
      return;
    }
    if (act === 'timer-start') { e.preventDefault(); startTimer(); return; }
    if (act === 'timer-pause') { e.preventDefault(); pauseTimer(); return; }
    if (act === 'timer-reset') { e.preventDefault(); resetTimer(); return; }
    if (act === 'save-weight') { e.preventDefault(); saveWeight(); return; }
    if (act === 'save-measures') { e.preventDefault(); saveMeasures(); return; }
    if (act === 'save-goals') { e.preventDefault(); saveGoals(); return; }
    if (act === 'coach-send') { e.preventDefault(); sendCoachMessage(); return; }
    if (act === 'reset-habits') { e.preventDefault(); resetHabits(); return; }
    if (act === 'gym-day') { e.preventDefault(); showGymDay(parseInt(t.getAttribute('data-day'), 10)); return; }
    if (act === 'diet-day') { e.preventDefault(); showDietDay(parseInt(t.getAttribute('data-day'), 10)); return; }
    if (act === 'nav') { e.preventDefault(); showSection(t.getAttribute('data-section')); return; }
    if (act === 'mas-item') { e.preventDefault(); showSection(t.getAttribute('data-section')); return; }
  });

  document.body.addEventListener('touchend', function (e) {
    const t = e.target.closest('[data-action="wake"]');
    if (t) { e.preventDefault(); confirmWake(); }
  }, { passive: false });

  const coachInput = document.getElementById('coach-input');
  if (coachInput) {
    coachInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); sendCoachMessage(); }
    });
  }

  document.body.addEventListener('click', function (e) {
    const q = e.target.closest('[data-coach]');
    if (q) { e.preventDefault(); sendCoachMessage(q.getAttribute('data-coach')); }
  });

  document.querySelectorAll('.habit-item').forEach(function (el) {
    el.onclick = function () { toggleHabit(el); };
  });

  const timerPreset = document.getElementById('timer-preset');
  if (timerPreset) {
    timerPreset.addEventListener('change', function () {
      if (!timerRunning) {
        timerSeconds = parseInt(timerPreset.value, 10) || 120;
        timerDisplay();
      }
    });
  }
}

function init() {
  checkMidnightReset();
  setHeroDate();
  tick();
  setInterval(tick, 10000);
  setInterval(function () { updateAhoraToca(); updateWakeUI(); }, 60000);
  loadHabits();
  updateTrackers();
  updateRing();
  updateStreak();
  updateWakeUI();
  updateAhoraToca();
  const w = getWakeToday();
  if (w) { wakeHour = w.h; wakeMinute = w.m; buildTimelines(); }
  renderCoachQuick();
  renderWeightLog();
  timerDisplay();
  bindEvents();

  if (typeof StepCounter !== 'undefined') StepCounter.init();

  const wd = new Date().getDay();
  const gymMap = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 };
  if (gymMap[wd] !== undefined) showGymDay(gymMap[wd]);
  showDietDay(wd === 0 ? 6 : wd - 1);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }

  const p = getProfile();
  const pg = document.getElementById('goal-protein');
  const wg = document.getElementById('goal-water');
  if (pg) pg.value = p.proteinGoal || 160;
  if (wg) wg.value = p.waterGoal || 3000;
}

window.confirmWake = confirmWake;
window.browseAppNow = browseAppNow;
window.showSection = showSection;
window.showGymDay = showGymDay;
window.showDietDay = showDietDay;
window.toggleHabit = toggleHabit;
window.resetHabits = resetHabits;

document.addEventListener('DOMContentLoaded', init);
