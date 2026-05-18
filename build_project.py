# -*- coding: utf-8 -*-
"""Integra todas las funcionalidades en mi_rutina.html"""
import re

PATH = r'c:\Users\Usuario\Desktop\mi_rutina\mi_rutina.html'

with open(PATH, 'r', encoding='utf-8') as f:
    h = f.read()

# --- HEAD PWA ---
PWA_HEAD = '''<meta name="theme-color" content="#6366f1">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icon-192.png">
<meta name="mobile-web-app-capable" content="yes">
'''
if 'manifest.webmanifest' not in h:
    h = h.replace('<title>Mi Rutina</title>', '<title>Mi Rutina</title>\n' + PWA_HEAD)

# --- CSS ---
EXTRA_CSS = '''
.wake-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(10,10,15,0.97);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 24px; text-align: center;
}
.wake-overlay.hidden { display: none !important; visibility: hidden; pointer-events: none; }
.wake-overlay h2 { font-size: 22px; margin-bottom: 8px; }
.wake-overlay p { color: var(--muted); font-size: 14px; margin-bottom: 20px; line-height: 1.5; max-width: 320px; }
.wake-overlay-actions { width: 100%; max-width: 320px; display: flex; flex-direction: column; gap: 10px; }
.wake-big-btn {
  width: 100%; padding: 16px; border-radius: 14px; border: none;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff; font-size: 16px; font-weight: 700; cursor: pointer;
}
.wake-secondary-btn {
  width: 100%; padding: 12px; border-radius: 12px; border: 1px solid var(--border2);
  background: var(--bg3); color: var(--text); font-size: 14px; font-weight: 600; cursor: pointer;
}
.wake-bar { padding: 8px 0 4px; }
.wake-info { font-size: 12px; color: var(--accent2); margin-top: 4px; }
.snooze-panel { display: none; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.snooze-panel.open { display: flex; }
.snooze-btn { padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border); background: var(--bg3); color: var(--muted); font-size: 12px; cursor: pointer; }
.ring-wrap { display: flex; align-items: center; gap: 16px; margin-bottom: 14px; }
.ring-svg { width: 64px; height: 64px; transform: rotate(-90deg); }
.ring-bg { fill: none; stroke: var(--bg3); stroke-width: 6; }
.ring-progress { fill: none; stroke: var(--accent); stroke-width: 6; stroke-linecap: round; stroke-dasharray: 175.9; stroke-dashoffset: 175.9; transition: stroke-dashoffset 0.4s; }
.ring-label { font-size: 13px; font-weight: 600; }
.ring-sub { font-size: 11px; color: var(--muted); }
.stats-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 14px; }
.stat-box { background: var(--bg3); border-radius: 10px; padding: 10px; text-align: center; border: 1px solid var(--border); }
.stat-val { font-size: 16px; font-weight: 700; color: var(--accent2); }
.stat-lbl { font-size: 9px; color: var(--muted); text-transform: uppercase; margin-top: 2px; }
.ahora-card { background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(45,212,191,0.08)); border: 1px solid rgba(99,102,241,0.25); border-radius: var(--r); padding: 14px 16px; margin-bottom: 14px; }
.ahora-title { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
.ahora-text { font-size: 15px; font-weight: 600; }
.tracker { margin-bottom: 12px; }
.tracker-header { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; }
.tracker-label { font-weight: 600; }
.tracker-val { color: var(--muted); font-size: 12px; }
.tracker-bar { height: 8px; background: var(--bg3); border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
.tracker-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
.tracker-btns { display: flex; flex-wrap: wrap; gap: 6px; }
.tracker-btn { padding: 6px 12px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg3); color: var(--text); font-size: 12px; cursor: pointer; }
.tracker-btn.sm { font-size: 11px; padding: 4px 8px; }
.steps-hint { font-size: 11px; color: var(--muted); margin-top: 8px; line-height: 1.4; }
.steps-status { font-size: 11px; color: var(--teal); margin-top: 4px; }
.coach-chat { max-height: 340px; overflow-y: auto; margin-bottom: 12px; }
.coach-msg { padding: 10px 12px; border-radius: 12px; margin-bottom: 8px; font-size: 13px; line-height: 1.5; }
.coach-msg.user { background: var(--accent); color: #fff; margin-left: 20%; }
.coach-msg.bot { background: var(--bg3); border: 1px solid var(--border); margin-right: 10%; }
.coach-input-row { display: flex; gap: 8px; }
.coach-input { flex: 1; padding: 12px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg3); color: var(--text); font-family: inherit; font-size: 14px; }
.coach-send-btn { padding: 12px 16px; border-radius: 12px; border: none; background: var(--accent); color: #fff; font-weight: 600; cursor: pointer; }
.coach-quick { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.coach-quick-btn { padding: 6px 10px; border-radius: 20px; border: 1px solid var(--border); background: var(--card2); color: var(--muted); font-size: 11px; cursor: pointer; }
.timer-box { text-align: center; padding: 16px; }
.timer-display { font-family: 'DM Mono', monospace; font-size: 48px; font-weight: 500; color: var(--accent2); }
.timer-btns { display: flex; gap: 8px; justify-content: center; margin-top: 12px; }
.timer-btn { padding: 10px 20px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg3); color: var(--text); cursor: pointer; font-weight: 600; }
.mas-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.mas-item { padding: 20px 16px; border-radius: var(--r); border: 1px solid var(--border); background: var(--card); text-align: center; cursor: pointer; }
.mas-item:active { background: var(--card2); }
.mas-icon { font-size: 28px; margin-bottom: 6px; }
.mas-label { font-size: 13px; font-weight: 600; }
.back-bar { display: none; position: sticky; top: 0; z-index: 99; background: var(--bg2); padding: 10px 16px; border-bottom: 1px solid var(--border); }
.back-bar.visible { display: block; }
.back-btn { background: none; border: none; color: var(--accent2); font-size: 14px; cursor: pointer; font-weight: 600; }
.log-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
.goal-input { width: 100%; padding: 10px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg3); color: var(--text); margin-bottom: 8px; font-size: 14px; }
.save-btn { width: 100%; padding: 12px; border-radius: 12px; border: none; background: var(--accent); color: #fff; font-weight: 600; cursor: pointer; margin-top: 8px; }
'''
if '.wake-overlay' not in h:
    h = h.replace('</style>', EXTRA_CSS + '\n</style>')

# --- WAKE OVERLAY ---
WAKE_OVERLAY = '''
<div id="wake-overlay" class="wake-overlay hidden">
  <h2>🌙 Nuevo día</h2>
  <p id="wake-overlay-text">Cuando te despiertes activamos tu rutina desde esa hora. O entra ahora y confirma después.</p>
  <motion.div class="wake-overlay-actions">
    <button type="button" class="wake-big-btn" data-action="wake">☀️ ¡Me he despertado!</button>
    <button type="button" class="wake-secondary-btn" data-action="snooze-toggle">🕐 Me despierto en un rato</button>
    <button type="button" class="wake-secondary-btn" data-action="browse">📱 Usar la app ahora</button>
  </div>
  <div id="snooze-panel" class="snooze-panel">
    <button type="button" class="snooze-btn" data-action="snooze" data-min="15">15 min</button>
    <button type="button" class="snooze-btn" data-action="snooze" data-min="30">30 min</button>
    <button type="button" class="snooze-btn" data-action="snooze" data-min="60">1 hora</button>
    <button type="button" class="snooze-btn" data-action="snooze" data-min="120">2 horas</button>
  </div>
</div>
'''.replace('<motion.div', '<div').replace('</motion.div>', '</div>')

if 'wake-overlay' not in h:
    h = h.replace('<body>\n\n<div class="header">', '<body>\n' + WAKE_OVERLAY + '\n<div id="back-bar" class="back-bar"><button type="button" class="back-btn" data-action="nav" data-section="mas">← Volver</button></div>\n\n<div class="header">')

# --- Replace wake selector ---
OLD_WAKE = '''  <div class="wake-selector">
    <span class="wake-label">Me levanto:</span>
    <button class="wake-btn active" onclick="setWake(9)" id="w9">9:00</button>
    <button class="wake-btn" onclick="setWake(10)" id="w10">10:00</button>
    <button class="wake-btn" onclick="setWake(11)" id="w11">11:00</button>
  </motion.div>'''.replace('</motion.div>', '</div>')

NEW_WAKE = '''  <div id="wake-bar" class="wake-bar" style="display:none;">
    <button type="button" class="wake-big-btn" data-action="wake" id="wake-btn">☀️ ¡Me he despertado!</button>
    <div class="wake-info" id="wake-info"></motion.div>
  </div>'''.replace('<motion.div', '<motion.div').replace('</motion.div>', '</div>')

if 'wake-selector' in h:
    h = h.replace('''  <div class="wake-selector">
    <span class="wake-label">Me levanto:</span>
    <button class="wake-btn active" onclick="setWake(9)" id="w9">9:00</button>
    <button class="wake-btn" onclick="setWake(10)" id="w10">10:00</button>
    <button class="wake-btn" onclick="setWake(11)" id="w11">11:00</button>
  </div>''', NEW_WAKE)

# --- Enhance HOY section ---
HOY_INSERT = '''
  <div class="ahora-card">
    <div class="ahora-title">Ahora toca</div>
    <div class="ahora-text" id="ahora-toca">Confirma tu despertar para ver qué toca ahora.</div>
  </div>

  <div class="ring-wrap">
    <svg class="ring-svg" viewBox="0 0 64 64">
      <circle class="ring-bg" cx="32" cy="32" r="28"/>
      <circle class="ring-progress" id="ring-progress" cx="32" cy="32" r="28"/>
    </svg>
    <div>
      <div class="ring-label">Hábitos <span id="ring-val">0/7</span></div>
      <div class="ring-sub">Racha: <span id="streak-val">0</span> días 🔥</div>
    </div>
  </div>

  <div class="stats-row">
    <div class="stat-box"><div class="stat-val" id="stat-water">0L</div><div class="stat-lbl">Agua</div></div>
    <motion.div class="stat-box"><div class="stat-val" id="stat-protein">0g</div><div class="stat-lbl">Proteína</div></div>
    <div class="stat-box"><div class="stat-val" id="stat-steps">0</div><div class="stat-lbl">Pasos</div></div>
  </div>

  <div class="card" style="margin-bottom:14px;">
    <div class="card-body">
      <div class="tracker">
        <div class="tracker-header"><span class="tracker-label">💧 Agua</span><span class="tracker-val" id="water-val">0L / 3L</span></div>
        <div class="tracker-bar"><div class="tracker-fill" id="water-fill" style="width:0%;background:var(--blue);"></div></div>
        <div class="tracker-btns">
          <button type="button" class="tracker-btn" data-action="water" data-ml="250">+250ml</button>
          <button type="button" class="tracker-btn" data-action="water" data-ml="500">+500ml</button>
          <button type="button" class="tracker-btn" data-action="water" data-ml="1000">+1L</button>
        </div>
      </div>
      <div class="divider"></div>
      <div class="tracker">
        <motion.div class="tracker-header"><span class="tracker-label">🥩 Proteína</span><span class="tracker-val" id="protein-val">0g / 160g</span></div>
        <div class="tracker-bar"><div class="tracker-fill" id="protein-fill" style="width:0%;background:var(--green);"></div></div>
        <div class="tracker-btns">
          <button type="button" class="tracker-btn" data-action="protein" data-g="20">+20g</button>
          <button type="button" class="tracker-btn" data-action="protein" data-g="30">+30g</button>
          <button type="button" class="tracker-btn" data-action="protein" data-g="40">+40g</button>
        </div>
      </div>
      <div class="divider"></div>
      <div class="tracker">
        <div class="tracker-header"><span class="tracker-label">👟 Pasos</span><span class="tracker-val" id="steps-val">0 / 10.000</span></div>
        <div class="tracker-bar"><div class="tracker-fill" id="steps-fill" style="width:0%;background:var(--teal);"></div></div>
        <div class="tracker-btns">
          <button type="button" class="tracker-btn" id="steps-toggle-btn" data-action="steps-toggle">▶ Activar contador</button>
        </div>
        <div class="steps-status" id="steps-status"></div>
        <p class="steps-hint">Automático con el sensor al caminar (app abierta). Para pasos 24h desde Salud: Atajo iOS → abrir URL con ?sync_steps=TUS_PASOS</p>
      </div>
    </div>
  </div>
'''.replace('<motion.div', '<div').replace('</motion.div>', '</div>')

if 'ahora-toca' not in h:
    h = h.replace('<motion.div class="sec-title">Hábitos de hoy <span>✓</span></div>', '<div class="sec-title">Hábitos de hoy <span>✓</span></div>')
    h = h.replace('<div class="sec-title">Hábitos de hoy <span>✓</span></motion.div>', '<div class="sec-title">Hábitos de hoy <span>✓</span></div>')
    h = h.replace('<div class="sec-title">Hábitos de hoy <span>✓</span></motion.div>', HOY_INSERT + '\n  <div class="sec-title">Hábitos de hoy <span>✓</span></div>', 1)
    h = h.replace('<div class="sec-title">Hábitos de hoy <span>✓</span></div>', HOY_INSERT + '\n  <div class="sec-title">Hábitos de hoy <span>✓</span></div>', 1)

# Fix reset habits button
h = h.replace('onclick="resetHabits()"', 'data-action="reset-habits"')

# --- COACH section ---
COACH_SEC = '''
<!-- ========= SECTION: COACH ========= -->
<div class="section" id="sec-coach">
  <div class="sec-title">Coach <span>IA</span></motion.div>
  <div class="card">
    <div class="card-header">
      <div class="card-icon ci-purple">🤖</div>
      <div><div class="card-title">Tu coach personal</motion.div><div class="card-sub">Gym, dieta, skincare, fuera de casa</div></div>
    </div>
    <div class="card-body">
      <div id="coach-quick" class="coach-quick"></div>
      <div id="coach-chat" class="coach-chat">
        <div class="coach-msg bot">¡Hola! Pregúntame lo que necesites. Prueba: <strong>"estoy fuera de casa"</strong> o <strong>"¿qué comer ahora?"</strong></div>
      </div>
      <div class="coach-input-row">
        <input type="text" id="coach-input" class="coach-input" placeholder="Escribe tu pregunta..." autocomplete="off">
        <button type="button" class="coach-send-btn" data-action="coach-send">→</button>
      </div>
    </div>
  </div>
</div>
'''.replace('<motion.div', '<div').replace('</motion.div>', '</div>')

if 'sec-coach' not in h:
    h = h.replace('<!-- ========= SECTION: RUTINA ========= -->', COACH_SEC + '\n<!-- ========= SECTION: RUTINA ========= -->')

# --- PROGRESO section ---
PROGRESO_SEC = '''
<!-- ========= SECTION: PROGRESO ========= -->
<div class="section" id="sec-progreso">
  <div class="sec-title">Mi <span>progreso</span></div>
  <div class="card">
    <div class="card-header"><div class="card-icon ci-green">⚖️</div><div><div class="card-title">Peso corporal</div><div class="card-sub">Registra 1× por semana, misma hora</div></div></div>
    <div class="card-body">
      <input type="number" step="0.1" id="weight-input" class="goal-input" placeholder="Peso en kg (ej: 72.5)">
      <button type="button" class="save-btn" data-action="save-weight">Guardar peso</button>
      <div id="weight-log" style="margin-top:12px;"></div>
    </div>
  </div>
  <div class="card">
    <div class="card-header"><div class="card-icon ci-teal">📏</div><motion.div><motion.div class="card-title">Medidas</div><div class="card-sub">Pecho, cintura, brazos — cada 2 semanas</div></div></div>
    <div class="card-body">
      <input type="number" step="0.1" id="meas-chest" class="goal-input" placeholder="Pecho (cm)">
      <input type="number" step="0.1" id="meas-waist" class="goal-input" placeholder="Cintura (cm)">
      <input type="number" step="0.1" id="meas-arms" class="goal-input" placeholder="Brazos (cm)">
      <button type="button" class="save-btn" data-action="save-measures">Guardar medidas</button>
    </div>
  </div>
</div>
'''.replace('<motion.div', '<div').replace('</motion.div>', '</div>')

if 'sec-progreso' not in h:
    h = h.replace('<!-- NAV BAR -->', PROGRESO_SEC + '\n<!-- ========= SECTION: AJUSTES ========= -->\n<div class="section" id="sec-ajustes">\n  <div class="sec-title">Ajustes</div>\n  <div class="card"><div class="card-body">\n    <p style="font-size:13px;color:var(--muted);margin-bottom:12px;">Metas diarias y preferencias. Todo se guarda en tu móvil.</p>\n    <label style="font-size:12px;color:var(--muted);">Proteína (g/día)</label>\n    <input type="number" id="goal-protein" class="goal-input" value="160">\n    <label style="font-size:12px;color:var(--muted);">Agua (ml/día)</label>\n    <input type="number" id="goal-water" class="goal-input" value="3000">\n    <button type="button" class="save-btn" data-action="save-goals">Guardar metas</button>\n    <div class="divider"></motion.div>\n    <p style="font-size:12px;color:var(--muted);line-height:1.5;">📱 Instalar: Safari → Compartir → Añadir a pantalla de inicio.<br>URL: devpedrohurtadoo.github.io/Routine/</p>\n  </div></div>\n</div>\n\n<!-- ========= SECTION: MAS ========= -->\n<div class="section" id="sec-mas">\n  <div class="sec-title">Más</div>\n  <div class="mas-grid">\n    <div class="mas-item" data-action="mas-item" data-section="dieta"><div class="mas-icon">🥗</div><div class="mas-label">Dieta</div></div>\n    <div class="mas-item" data-action="mas-item" data-section="progreso"><div class="mas-icon">📈</div><div class="mas-label">Progreso</div></div>\n    <div class="mas-item" data-action="mas-item" data-section="productos"><div class="mas-icon">🛒</div><div class="mas-label">Compras</div></div>\n    <div class="mas-item" data-action="mas-item" data-section="ajustes"><div class="mas-icon">⚙️</motion.div><div class="mas-label">Ajustes</div></div>\n  </div>\n</div>\n\n<!-- NAV BAR -->')

PROGRESO_SEC = PROGRESO_SEC  # already inserted above in combined block

# --- Gym timer ---
TIMER_HTML = '''
  <div class="card">
    <div class="card-header"><div class="card-icon ci-amber">⏱️</div><div><div class="card-title">Temporizador de descanso</div><motion.div class="card-sub">Entre series</motion.div></div></div>
    <div class="card-body timer-box">
      <div class="timer-display" id="timer-display">2:00</div>
      <select id="timer-preset" style="margin:8px 0;padding:8px;border-radius:8px;background:var(--bg3);color:var(--text);border:1px solid var(--border);">
        <option value="60">60 seg</option>
        <option value="90">90 seg</option>
        <option value="120" selected>2 min</option>
        <option value="150">2.5 min</option>
        <option value="180">3 min</option>
      </select>
      <div class="timer-btns">
        <button type="button" class="timer-btn" data-action="timer-start">▶</button>
        <button type="button" class="timer-btn" data-action="timer-pause">⏸</button>
        <button type="button" class="timer-btn" data-action="timer-reset">↺</button>
      </div>
    </div>
  </div>
'''.replace('<motion.div', '<motion.div').replace('</motion.div>', '</div>')

if 'timer-display' not in h and 'id="sec-gym"' in h:
    h = h.replace('<div class="section" id="sec-gym">', '<div class="section" id="sec-gym">' + TIMER_HTML)

# --- NAV ---
NEW_NAV = '''<nav class="nav">
  <button type="button" class="nav-btn active" id="nav-hoy" data-action="nav" data-section="hoy">
    <div class="nav-icon">🏠</div>Hoy
  </button>
  <button type="button" class="nav-btn" id="nav-coach" data-action="nav" data-section="coach">
    <div class="nav-icon">🤖</div>Coach
  </button>
  <button type="button" class="nav-btn" id="nav-rutina" data-action="nav" data-section="rutina">
    <div class="nav-icon">⏰</div>Rutina
  </button>
  <button type="button" class="nav-btn" id="nav-gym" data-action="nav" data-section="gym">
    <div class="nav-icon">🏋️</div>Gym
  </button>
  <button type="button" class="nav-btn" id="nav-mas" data-action="nav" data-section="mas">
    <div class="nav-icon">⋯</div>Más
  </button>
</nav>'''

h = re.sub(r'<nav class="nav">.*?</nav>', NEW_NAV, h, flags=re.DOTALL)

# Remove onclick from sections - use data-action
h = re.sub(r'\s+onclick="showSection\([^)]+\)"', '', h)

# --- Replace inline script ---
SCRIPTS = '''<script src="coach.js"></script>
<script src="step-counter.js"></script>
<script src="app.js"></script>'''

h = re.sub(r'<script>[\s\S]*?</script>\s*</body>', SCRIPTS + '\n</body>', h)

# Clean any motion.div typos
h = h.replace('motion.div', 'motion.div')
h = h.replace('<motion.div', '<div')
h = h.replace('</motion.div>', '</div>')
h = h.replace('motion.div', 'div')

with open(PATH, 'w', encoding='utf-8') as f:
    f.write(h)

print('OK: mi_rutina.html actualizado')
