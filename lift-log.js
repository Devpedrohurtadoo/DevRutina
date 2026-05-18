/* Registro de pesos por ejercicio — NUNCA se borra al reiniciar el día */
const LiftLog = (function () {
  const KEY = 'mr_lift_log_v1';

  function load() {
    try {
      const v = localStorage.getItem(KEY);
      if (v) return JSON.parse(v);
    } catch (e) {}
    return { sessions: [], byExercise: {} };
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      alert('No se pudo guardar. Libera espacio en el móvil.');
    }
  }

  function todayKey() {
    const n = new Date();
    const pad = x => (x < 10 ? '0' + x : '' + x);
    return n.getFullYear() + '-' + pad(n.getMonth() + 1) + '-' + pad(n.getDate());
  }

  function getLastSession(exId) {
    const d = load();
    const list = d.byExercise[exId] || [];
    return list.length ? list[list.length - 1] : null;
  }

  function getBestWeight(exId) {
    const d = load();
    let best = 0;
    (d.byExercise[exId] || []).forEach(function (s) {
      (s.sets || []).forEach(function (set) {
        const w = parseFloat(set.weight);
        if (!isNaN(w) && w > best) best = w;
      });
    });
    return best;
  }

  function renderLogForm(exId) {
    const ex = typeof Exercises !== 'undefined' ? Exercises.get(exId) : null;
    const last = getLastSession(exId);
    const best = getBestWeight(exId);
    let rows = '';
    for (let i = 1; i <= 3; i++) {
      const prev = last && last.sets && last.sets[i - 1] ? last.sets[i - 1] : {};
      rows +=
        '<div class="set-row">' +
        '<span class="set-num">S' + i + '</span>' +
        '<input type="number" step="0.5" class="set-input set-weight" data-set="' + i + '" placeholder="kg" value="' + (prev.weight != null ? prev.weight : '') + '">' +
        '<input type="number" class="set-input set-reps" data-set="' + i + '" placeholder="reps" value="' + (prev.reps != null ? prev.reps : '') + '">' +
        '</div>';
    }
    const name = ex ? ex.name : exId;
    const lastTxt = last
      ? 'Última: ' + last.date + ' — ' + (last.sets || []).map(function (s, i) {
          return 'S' + (i + 1) + ' ' + s.weight + 'kg×' + s.reps;
        }).join(', ')
      : 'Sin registros aún';
  return (
      '<div class="lift-form" data-ex="' + exId + '">' +
      '<div class="lift-form-title">📝 ' + name + '</div>' +
      '<p class="lift-last">' + lastTxt + (best ? ' · PR: <b>' + best + ' kg</b>' : '') + '</p>' +
      '<div class="set-header"><span></span><span>kg</span><span>reps</span></div>' +
      rows +
      '<button type="button" class="save-btn lift-save-btn" data-action="save-lift" data-ex="' + exId + '">Guardar series de hoy</button>' +
      '</div>'
    );
  }

  function fillAllLogBlocks() {
    if (typeof Exercises === 'undefined') return;
    Exercises.getAllIds().forEach(function (id) {
      const el = document.getElementById('ex-log-' + id);
      if (el) el.innerHTML = renderLogForm(id);
    });
  }

  function saveSession(exId) {
    const block = document.querySelector('.lift-form[data-ex="' + exId + '"]');
    if (!block) return;
    const sets = [];
    block.querySelectorAll('.set-row').forEach(function (row) {
      const wEl = row.querySelector('.set-weight');
      const rEl = row.querySelector('.set-reps');
      const w = parseFloat(wEl && wEl.value);
      const r = parseInt(rEl && rEl.value, 10);
      if (!isNaN(w) && w > 0 && !isNaN(r) && r > 0) sets.push({ weight: w, reps: r });
    });
    if (!sets.length) {
      alert('Escribe al menos una serie con peso y reps.');
      return;
    }
    const d = load();
    const entry = { date: todayKey(), sets: sets };
    if (!d.byExercise[exId]) d.byExercise[exId] = [];
    const sameDay = d.byExercise[exId].findIndex(function (e) { return e.date === entry.date; });
    if (sameDay >= 0) d.byExercise[exId][sameDay] = entry;
    else d.byExercise[exId].push(entry);
    d.sessions.push({ exId: exId, date: entry.date, sets: sets });
    if (d.sessions.length > 2000) d.sessions = d.sessions.slice(-2000);
    save(d);
    fillAllLogBlocks();
    const el = document.getElementById('ex-log-' + exId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    try { navigator.vibrate && navigator.vibrate(80); } catch (e) {}
  }

  function renderProgressPage() {
    const el = document.getElementById('lift-progress-list');
    if (!el || typeof Exercises === 'undefined') return;
    const d = load();
    let html = '';
    Exercises.getAllIds().forEach(function (id) {
      const ex = Exercises.get(id);
      const hist = d.byExercise[id] || [];
      if (!hist.length) return;
      const best = getBestWeight(id);
      const last = hist[hist.length - 1];
      html +=
        '<div class="lift-history-card">' +
        '<div class="lift-history-name">' + ex.name + '</div>' +
        '<div class="lift-history-pr">PR: <b>' + best + ' kg</b></div>' +
        '<div class="lift-history-rows">';
      hist.slice(-6).reverse().forEach(function (s) {
        html += '<div class="log-row"><span>' + s.date + '</span><span>' +
          (s.sets || []).map(function (x, i) { return 'S' + (i + 1) + ' ' + x.weight + '×' + x.reps; }).join(' · ') +
          '</span></div>';
      });
      html += '</div></div>';
    });
    el.innerHTML = html || '<p style="color:var(--muted);font-size:13px;">Aún no hay pesos guardados. Regístralos en cada ejercicio del Gym.</p>';
  }

  function getSummaryForCoach() {
    const d = load();
    const lines = [];
    Object.keys(d.byExercise || {}).slice(0, 12).forEach(function (id) {
      const ex = typeof Exercises !== 'undefined' ? Exercises.get(id) : null;
      const name = ex ? ex.name : id;
      const last = getLastSession(id);
      const best = getBestWeight(id);
      if (last) lines.push(name + ': último ' + last.date + ', PR ' + best + 'kg');
    });
    return lines;
  }

  function exportBackup() {
    return JSON.stringify(load());
  }

  return {
    load, save, getLastSession, getBestWeight, renderLogForm, fillAllLogBlocks,
    saveSession, renderProgressPage, getSummaryForCoach, exportBackup, todayKey,
  };
})();
