# -*- coding: utf-8 -*-
import re

def ex(name, sets, tip, heavy=False):
    sh = ' heavy' if heavy else ''
    return (
        f'      <div class="exercise"><motion.div class="exercise-row">'
        f'<div class="exercise-name">{name}</div>'
        f'<div class="exercise-sets{sh}">{sets}</div></div>'
        f'<div class="exercise-tip">{tip}</div></div>'
    ).replace('<motion.div', '<div').replace('motion.div', 'div')

def gym_day(i, title, pill, exercises, extra=''):
    active = ' active' if i == 0 else ''
    body = '\n'.join(exercises)
    return f'''  <div class="gym-day{active}" id="gym-{i}">
    <div class="day-pill">{pill}</div>
    {extra}
    <div class="card"><div class="card-body">
{body}
    </div></div>
  </motion.div>'''.replace('<motion.div', '<div').replace('</motion.div>', '</div>')

GYM = '''  <div class="info imp"><div class="info-icon">💪</div><div><b>PPL Hipertrofia máxima</b> — compuestos pesados 5-8 reps, progresión semanal. Lu-Vi entreno | Sáb-Dom descanso activo.</div></div>

  <div class="day-tabs" id="gym-tabs">
    <button type="button" class="day-tab active" data-action="gym-day" data-day="0">Lun Push</button>
    <button type="button" class="day-tab" data-action="gym-day" data-day="1">Mar Pull</button>
    <button type="button" class="day-tab" data-action="gym-day" data-day="2">Mié Pierna</button>
    <button type="button" class="day-tab" data-action="gym-day" data-day="3">Jue Push2</button>
    <button type="button" class="day-tab" data-action="gym-day" data-day="4">Vie Pull2</button>
  </div>

''' + gym_day(0, '', '💪 Lunes <span class="day-focus">PUSH · Pecho / Hombros / Tríceps</span>', [
    ex('Press banca plano (barra)', '5×5', 'PESADO. Rey del pecho. Descanso 3 min. Sube 2.5 kg/semana si completas las 5×5.', True),
    ex('Press inclinado mancuernas', '4×6-8', 'Pecho alto = te ves grande de frente. Banco 30°.'),
    ex('Press militar (barra)', '4×6-8', 'Hombros anchos. De pie, core firme.'),
    ex('Fondos en paralelas', '3×6-8', 'Tríceps + pecho. Lastra cuando puedas.'),
    ex('Elevaciones laterales', '3×10', 'Único aislamiento con más reps. Sin balanceo.'),
    ex('Extensión tríceps polea', '3×8', 'Codos quietos. Brazos grandes = más fuerza en press.'),
]) + gym_day(1, '', '🔙 Martes <span class="day-focus">PULL · Espalda / Bíceps</span>', [
    ex('Dominadas lastradas', '4×5-8', 'Espalda ancha. Jalón pesado 4×6-8 si no llegas — nunca 12 reps.', True),
    ex('Remo con barra', '4×6', 'Espalda gruesa. Peso pesado, técnica perfecta.', True),
    ex('Remo máquina o cable', '3×8', 'Squeeze 1 seg en el pico.'),
    ex('Face pull', '3×15', 'Salud de hombros. Obligatorio.'),
    ex('Curl barra EZ', '3×8', 'Bíceps pesado. Sin trampa.'),
    ex('Curl martillo', '2×8', 'Grosor del brazo.'),
]) + gym_day(2, '', '🦵 Miércoles <span class="day-focus">PIERNA</span>', [
    ex('Sentadilla libre', '5×5', 'PESADO. Descanso 3 min.', True),
    ex('Peso muerto rumano', '4×6-8', 'Femorales y glúteo.'),
    ex('Prensa', '3×8', 'Más peso controlado.'),
    ex('Curl femoral', '3×8', 'Isquios. Baja lento.'),
    ex('Gemelos de pie', '4×8-10', 'PESADO. No 20 reps ligeras.'),
], '<div class="info warn"><div class="info-icon">⚠️</div><div>Pierna = testosterona y GH. Día sagrado.</div></div>\n    ') + gym_day(3, '', '💪 Jueves <span class="day-focus">PUSH 2</span>', [
    ex('Press inclinado barra', '4×6', 'Pecho alto otra vez.', True),
    ex('Press plano mancuernas', '3×8', 'Rango completo.'),
    ex('Press mancuernas sentado', '3×8', 'Hombros completos.'),
    ex('Cruces en polea', '2×10', 'Solo bombeo, 2 series.'),
    ex('Press cerrado / JM press', '3×6-8', 'Tríceps para fuerza en press.'),
    ex('Extensión tríceps cuerda', '2×10', 'Finisher.'),
]) + gym_day(4, '', '🔙 Viernes <span class="day-focus">PULL 2</span>', [
    ex('Peso muerto o rack pull', '3×5', 'Muy pesado. Técnica perfecta.', True),
    ex('Jalón al pecho ancho', '4×6-8', 'PESADO. No 12 reps.'),
    ex('Remo mancuerna 1 brazo', '3×8 c/lado', 'Máximo rango por lado.'),
    ex('Face pull', '3×15', 'Hombros sanos.'),
    ex('Curl inclinado', '3×8', 'Estiramiento máximo del bíceps.'),
    ex('Curl predicador', '2×8', 'Sin trampa.'),
]) + '''
  <div class="card" style="margin-top:14px;">
    <div class="card-header"><div class="card-icon ci-amber">📐</div><div><div class="card-title">Reglas hipertrofia rápida</div></motion.div></div>
    <div class="card-body">
      <div class="step-item"><div class="step-num">1</div><div class="step-content"><div class="step-title">Compuestos 5-8 reps PESADOS</div><div class="step-desc">5×5 banca y sentadilla. 4×6 remo y dominadas. Eso construye músculo real.</div></div></div>
      <div class="step-item"><div class="step-num">2</div><div class="step-content"><div class="step-title">Progresión cada semana</div><div class="step-desc">+2.5 kg o +1 rep. Sin progresión no hay músculo.</div></div></div>
      <div class="step-item"><div class="step-num">3</div><div class="step-content"><motion.div class="step-title">RIR 1-2 en la última serie</motion.div><div class="step-desc">Casi al fallo. La última rep debe costar.</div></div></div>
      <div class="step-item"><div class="step-num">4</div><div class="step-content"><div class="step-title">Descanso 3 min compuestos</div><div class="step-desc">90 seg aislamiento. Usa el temporizador.</div></div></div>
    </div>
  </div>
'''.replace('<motion.div', '<div').replace('</motion.div>', '</div>')

path = r'c:\Users\Usuario\Desktop\mi_rutina\mi_rutina.html'
with open(path, 'r', encoding='utf-8') as f:
    h = f.read()

# Sun habit
if '10 minutos de sol' not in h:
    h = re.sub(
        r'(habit-title">✨ Skincare mañana</div>\s*<div class="habit-sub">[^<]+</div>\s*</div>\s*</motion.div>)',
        r'\1\n      <div class="habit-item">\n        <div class="habit-check"></div>\n        <div class="habit-text">\n          <div class="habit-title">☀️ 10 minutos de sol</div>\n          <div class="habit-sub">Vitamina D + aspecto más sano. SPF ya aplicado en skincare.</div>\n        </div>\n      </div>',
        h, count=1
    )
    if '10 minutos de sol' not in h:
        h = re.sub(
            r'(habit-title">✨ Skincare mañana</div>\s*<div class="habit-sub">[^<]+</motion.div>\s*</div>\s*</div>)',
            r'\1\n      <div class="habit-item">\n        <div class="habit-check"></div>\n        <div class="habit-text">\n          <div class="habit-title">☀️ 10 minutos de sol</div>\n          <div class="habit-sub">Vitamina D + aspecto más sano. SPF ya aplicado en skincare.</div>\n        </div>\n      </div>',
            h, count=1
        )

h = h.replace('onclick="toggleHabit(this)"', '')
h = h.replace('id="ring-val">0/7<', 'id="ring-val">0/8<')

gym_start = h.find('<div class="info imp"><div class="info-icon">📋</motion.div>')
if gym_start < 0:
    gym_start = h.find('<div class="info imp"><div class="info-icon">📋</div>')
if gym_start < 0:
    gym_start = h.find('<motion.div class="info imp">')
if gym_start < 0:
    gym_start = h.find('<div class="info imp"><div class="info-icon">💪</div>')
gym_end = h.find('<!-- ========= SECTION: DIETA ========= -->')

if gym_start > 0 and gym_end > gym_start:
    h = h[:gym_start] + GYM + '\n\n' + h[gym_end:]

if '.exercise-sets.heavy' not in h:
    h = h.replace('.exercise-sets {', '.exercise-sets.heavy { color: var(--amber); font-weight: 700; }\n.exercise-sets {')

h = re.sub(
    r'<button class="day-tab([^"]*)" onclick="showDietDay\((\d+)\)">',
    r'<button type="button" class="day-tab\1" data-action="diet-day" data-day="\2">',
    h
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(h)
print('HTML OK, sun:', '10 minutos de sol' in h, 'gym heavy:', '5×5' in h)
