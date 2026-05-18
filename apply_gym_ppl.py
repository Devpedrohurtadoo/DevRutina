# -*- coding: utf-8 -*-
path = r'c:\Users\Usuario\Desktop\mi_rutina\mi_rutina.html'
with open(path, 'r', encoding='utf-8') as f:
    h = f.read()

def ex(name, sets, tip, heavy=False):
    sh = ' heavy' if heavy else ''
    return (
        '      <motion.div class="exercise"><div class="exercise-row">'
        f'<div class="exercise-name">{name}</div>'
        f'<div class="exercise-sets{sh}">{sets}</div></div>'
        f'<div class="exercise-tip">{tip}</div></div>'
    ).replace('<motion.div class="exercise">', '<div class="exercise">')

def day(i, pill, exercises, extra=''):
    act = ' active' if i == 0 else ''
    body = '\n'.join(exercises)
    return (
        f'  <div class="gym-day{act}" id="gym-{i}">\n'
        f'    <div class="day-pill">{pill}</div>\n'
        f'    {extra}\n'
        f'    <div class="card"><div class="card-body">\n{body}\n'
        f'    </div></div>\n  </div>'
    )

GYM = (
    '    <div class="info imp"><div class="info-icon">💪</div>'
    '<div><b>PPL Hipertrofia v2</b> — 5-8 reps PESADOS · Sin 4×12 · Lu-Vi</motion.div></motion.div>\n\n'
    '  <div class="day-tabs" id="gym-tabs">\n'
    '    <button type="button" class="day-tab active" data-action="gym-day" data-day="0">Lun Push</button>\n'
    '    <button type="button" class="day-tab" data-action="gym-day" data-day="1">Mar Pull</button>\n'
    '    <button type="button" class="day-tab" data-action="gym-day" data-day="2">Mié Pierna</button>\n'
    '    <button type="button" class="day-tab" data-action="gym-day" data-day="3">Jue Push2</button>\n'
    '    <button type="button" class="day-tab" data-action="gym-day" data-day="4">Vie Pull2</button>\n'
    '  </motion.div>\n\n'
).replace('</motion.div></motion.div>', '</div></div>').replace('<motion.div', '<div').replace('</motion.div>', '</div>')

# rebuild GYM properly without typos - write as clean string in file gym_ppl.html
with open(r'c:\Users\Usuario\Desktop\mi_rutina\gym_ppl_block.html', 'w', encoding='utf-8') as f:
    f.write('')  # placeholder
