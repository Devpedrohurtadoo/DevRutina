/* Rutina PPL — datos de ejercicios, vídeo, máquina, máx. 3 series */
const Exercises = (function () {
  const PPL = [
    {
      day: 0, pill: '💪 Lunes <span class="day-focus">PUSH · Pecho / Hombros / Tríceps</span>',
      items: ['bench_press', 'incline_db_press', 'ohp', 'dips', 'lat_raise', 'tricep_pushdown'],
    },
    {
      day: 1, pill: '🔙 Martes <span class="day-focus">PULL · Espalda / Bíceps</span>',
      items: ['pullups', 'barbell_row', 'cable_row', 'face_pull', 'ez_curl', 'hammer_curl'],
    },
    {
      day: 2, pill: '🦵 Miércoles <span class="day-focus">PIERNA</span>', warn: 'Pierna = testosterona y GH. Día sagrado.',
      items: ['squat', 'rdl', 'leg_press', 'leg_curl', 'calves'],
    },
    {
      day: 3, pill: '💪 Jueves <span class="day-focus">PUSH 2</span>',
      items: ['incline_barbell', 'flat_db_press', 'db_shoulder_press', 'cable_fly', 'close_grip', 'rope_tricep'],
    },
    {
      day: 4, pill: '🔙 Viernes <span class="day-focus">PULL 2</span>',
      items: ['deadlift', 'lat_pulldown', 'one_arm_row', 'face_pull', 'incline_curl', 'preacher_curl'],
    },
  ];

  const DB = {
    bench_press: {
      name: 'Press banca plano (barra)',
      sets: '3×5', heavy: true,
      tip: 'PESADO. Rey del pecho. Descanso 3 min. +2.5 kg/semana si completas las 3×5.',
      video: 'IwyvZFllLVw',
      machine: 'Banco plano + rack de sentadillas / press',
      setup: 'Banco horizontal (0°). Barra a la altura de los ojos tumbado. Agarre medio: antebrazos verticales abajo. Pies firmes en el suelo. Omóplatos juntos y hacia abajo.',
      grip: 'Agarre prono, ancho de hombros + unos cm.',
    },
    incline_db_press: {
      name: 'Press inclinado mancuernas',
      sets: '3×6-8', heavy: false,
      tip: 'Pecho alto. Banco 30° (no 45°).',
      video: '8iPEnn-ltC8',
      machine: 'Banco ajustable inclinado + mancuernas',
      setup: 'Banco a 30°. Mancuernas a los lados del pecho. Codos 45°. Baja hasta estiramiento en pecho alto, sube sin chocar mancuernas arriba.',
      grip: 'Agarre neutro o prono en mancuernas.',
    },
    ohp: {
      name: 'Press militar (barra)',
      sets: '3×6-8', heavy: false,
      tip: 'Hombros anchos. De pie, core firme, glúteos apretados.',
      video: '2yjwXTZQDDg',
      machine: 'Rack / press de hombros de pie',
      setup: 'Barra a la altura de la clavícula. Agarre un poco más ancho que hombros. Codos ligeramente delante de la barra. Empuja la cabeza hacia atrás al subir.',
      grip: 'Agarre prono medio.',
    },
    dips: {
      name: 'Fondos en paralelas',
      sets: '3×6-8', heavy: false,
      tip: 'Tríceps + pecho. Torso recto = más tríceps; inclinado = más pecho.',
      video: 'yN6Q1UI_xkE',
      machine: 'Paralelas / estación de fondos',
      setup: 'Brazos casi verticales al bajar. Codos hacia atrás, no abiertos. Baja hasta 90° o un poco más si las articulaciones lo permiten. Lastra con cinturón cuando puedas.',
      grip: 'Agarre neutro en las paralelas.',
    },
    lat_raise: {
      name: 'Elevaciones laterales',
      sets: '3×10', heavy: false,
      tip: 'Peso moderado. Sin balanceo. Codos ligeramente flexionados.',
      video: '3VcKaXpzqQs',
      machine: 'Mancuernas de pie',
      setup: 'De pie, ligera inclinación del torso. Sube hasta la altura de los hombros, meñique un poco más alto que el pulgar (como vaciar una jarra).',
      grip: 'Mancuernas, agarre neutro.',
    },
    tricep_pushdown: {
      name: 'Extensión tríceps polea',
      sets: '3×8', heavy: false,
      tip: 'Codos pegados al cuerpo. Solo mueve antebrazo.',
      video: '2-LAMcpzODU',
      machine: 'Polea alta — barra recta o cuerda',
      setup: 'Polea en posición alta. Codos fijos a los costados. Extensión completa abajo, control al subir.',
      grip: 'Barra recta prono o cuerda con agarre neutro.',
    },
    pullups: {
      name: 'Dominadas lastradas',
      sets: '3×5-8', heavy: true,
      tip: 'Espalda ancha. Si no llegas: jalón 3×6-8 pesado.',
      video: 'eGo4IYlbE5g',
      machine: 'Barra de dominadas / rack con barra alta',
      setup: 'Agarre prono ancho (más ancho que hombros). Depresión escapular antes de tirar. Pecho a la barra, codos hacia abajo y atrás.',
      grip: 'Prono ancho. Alternativa: agarre neutro en barra paralela.',
    },
    barbell_row: {
      name: 'Remo con barra',
      sets: '3×6', heavy: true,
      tip: 'Espalda gruesa. Torso casi paralelo al suelo, barra a la línea del ombligo.',
      video: '9EF0xeo6jOE',
      machine: 'Barra libre',
      setup: 'Pies bajo la barra, agarre prono ancho medio. Espalda neutra, core firme. Tira hacia el ombligo, aprieta omóplatos 1 seg.',
      grip: 'Prono, ancho de hombros o un poco más.',
    },
    cable_row: {
      name: 'Remo en polea baja',
      sets: '3×8', heavy: false,
      tip: 'Pecho alto, espalda recta. Squeeze 1 seg al pico.',
      video: 'o0bP2Z8K2Gs',
      machine: 'Polea baja con asiento / remo sentado',
      setup: 'Polea baja, asiento con pecho apoyado si hay. Agarre en V o barra recta. Tira al ombligo, no uses demasiado impulso de piernas.',
      grip: 'Agarre neutro en V o prono ancho.',
    },
    face_pull: {
      name: 'Face pull',
      sets: '3×15', heavy: false,
      tip: 'Salud de hombros. Obligatorio en pull.',
      video: 'HSoHeSjvIdY',
      machine: 'Polea alta con cuerda',
      setup: 'Polea a la altura de la cara o un poco más alta. Tira la cuerda hacia la frente separando las manos. Codos altos, rotación externa al final.',
      grip: 'Cuerda, agarre neutro en los extremos.',
    },
    ez_curl: {
      name: 'Curl barra EZ',
      sets: '3×8', heavy: false,
      tip: 'Bíceps pesado. Sin balanceo del torso.',
      video: 'zyfFsi8nAkw',
      machine: 'Barra EZ de pie',
      setup: 'De pie, codos fijos a los costados. Agarre en la parte interna/media de la EZ para menos estrés en muñeca.',
      grip: 'Prono en barra EZ (agarre angulado).',
    },
    hammer_curl: {
      name: 'Curl martillo',
      sets: '3×8', heavy: false,
      tip: 'Braquial y braquiorradial = brazo grueso.',
      video: 'TwD-YwV4PB0',
      machine: 'Mancuernas',
      setup: 'De pie o sentado. Codos quietos. Sube sin rotar la muñeca (agarre neutro todo el recorrido).',
      grip: 'Neutro (martillo).',
    },
    squat: {
      name: 'Sentadilla libre',
      sets: '3×5', heavy: true,
      tip: 'PESADO. Descanso 3 min. Profundidad paralelo o más.',
      video: 'bD6Y56p_cz4',
      machine: 'Rack de sentadillas + barra olímpica',
      setup: 'Barra en trapecio alto (low bar) o trapecio medio (high bar). Pies ancho de hombros, puntas 15-30° fuera. Rompe cadera y rodilla a la vez. Rodillas siguen la punta del pie.',
      grip: 'Agarre en la barra, codos abajo, pecho arriba.',
    },
    rdl: {
      name: 'Peso muerto rumano',
      sets: '3×6-8', heavy: false,
      tip: 'Femorales y glúteo. Barra cerca de las piernas siempre.',
      video: '1ED09ZPzmKk',
      machine: 'Barra libre',
      setup: 'Pies al ancho de caderas. Rodillas ligeramente flexionadas y fijas. Empuja cadera atrás, barra rozando muslos. Estira isquios, vuelve apretando glúteo.',
      grip: 'Prono al ancho de hombros.',
    },
    leg_press: {
      name: 'Prensa de piernas',
      sets: '3×8', heavy: false,
      tip: 'Pies al centro de la plataforma. No bloquees rodillas arriba.',
      video: 'Ibf8vR1Wvw0',
      machine: 'Prensa 45° o horizontal',
      setup: 'Pies al centro, ancho de hombros. Baja hasta 90° en rodilla sin levantar lumbar de la espalda. Empuja con toda la planta del pie.',
      grip: 'Asas laterales de la máquina para estabilidad.',
    },
    leg_curl: {
      name: 'Curl femoral tumbado',
      sets: '3×8', heavy: false,
      tip: 'Isquios. Baja en 2-3 segundos.',
      video: 'EAXKPro-brQ',
      machine: 'Curl femoral tumbado (máquina)',
      setup: 'Rodillo en el talón/Aquiles. Caderas pegadas al banco. Flexiona llevando talones al glúteo, pausa arriba.',
      grip: 'Asas del banco si las hay.',
    },
    calves: {
      name: 'Gemelos de pie',
      sets: '3×8-10', heavy: false,
      tip: 'PESADO. Recorrido completo: estira abajo, pausa arriba.',
      video: 'gwvItP4Hz24',
      machine: 'Máquina de gemelos de pie o multipower',
      setup: 'Punta de pies en el borde del step. Baja talones al máximo, sube a punta de pie 1 seg arriba.',
      grip: 'Hombros bajo almohadillas de la máquina.',
    },
    incline_barbell: {
      name: 'Press inclinado barra',
      sets: '3×6', heavy: true,
      tip: 'Pecho alto. Banco 30°.',
      video: 'S7zBsFD4xX0',
      machine: 'Banco inclinado + rack',
      setup: 'Banco 30°. Barra a la parte alta del pecho. Misma técnica que banca: omóplatos retraídos.',
      grip: 'Prono, un poco más ancho que hombros.',
    },
    flat_db_press: {
      name: 'Press plano mancuernas',
      sets: '3×8', heavy: false,
      tip: 'Rango completo, control en la bajada.',
      video: 'Vs-ioz8mMUI',
      machine: 'Banco plano + mancuernas',
      setup: 'Banco 0°. Baja mancuernas hasta codos 90° o un poco más. No rebotes en el pecho.',
      grip: 'Prono en mancuernas.',
    },
    db_shoulder_press: {
      name: 'Press mancuernas sentado',
      sets: '3×8', heavy: false,
      tip: 'Hombros completos. Espalda apoyada en el banco 90°.',
      video: 'qEwKCR5JCn8',
      machine: 'Banco vertical 90° + mancuernas',
      setup: 'Banco casi vertical. Mancuernas a la altura de las orejas. Empuja sin arquear lumbar.',
      grip: 'Prono o neutro.',
    },
    cable_fly: {
      name: 'Cruces en polea',
      sets: '3×10', heavy: false,
      tip: 'Bombeo pecho. Ligero, forma perfecta.',
      video: 'Iwe6YcOPMDo',
      machine: 'Cruces / poleas dobles',
      setup: 'Poleas a la altura del pecho o un poco arriba. Paso adelante, ligera inclinación. Junta manos delante del pecho con ligera flexión de codo.',
      grip: 'Neutro en las asas de polea.',
    },
    close_grip: {
      name: 'Press cerrado / JM press',
      sets: '3×6-8', heavy: false,
      tip: 'Tríceps para más fuerza en press.',
      video: '7HQZE95wSQM',
      machine: 'Banco plano + barra',
      setup: 'Agarre al ancho de hombros o menos en banca plana. Codos pegados al cuerpo al bajar.',
      grip: 'Prono cerrado.',
    },
    rope_tricep: {
      name: 'Extensión tríceps cuerda',
      sets: '3×10', heavy: false,
      tip: 'Finisher. Separa la cuerda al final.',
      video: 'kiPQYo-XxlU',
      machine: 'Polea alta + cuerda',
      setup: 'Polea alta, inclínate ligeramente. Codos fijos, extiende y abre la cuerda al final.',
      grip: 'Neutro en cuerda.',
    },
    deadlift: {
      name: 'Peso muerto convencional',
      sets: '3×5', heavy: true,
      tip: 'Muy pesado. Espalda neutra siempre.',
      video: 'Y1ZhsdAcrPw',
      machine: 'Barra en el suelo',
      setup: 'Pies al ancho de caderas, barra sobre el mediopie. Agarre prono o mixto. Pecho arriba, empuja el suelo con los pies. Barra pegada a las piernas.',
      grip: 'Prono doble o mixto (alterna en cada serie si usas mixto).',
    },
    lat_pulldown: {
      name: 'Jalón al pecho ancho',
      sets: '3×6-8', heavy: false,
      tip: 'PESADO. Tira al pecho alto, no detrás del cuello.',
      video: 'CAwf7n6Luuc',
      machine: 'Jalón en polea alta',
      setup: 'Agarre prono ancho. Ligeramente inclinado atrás. Tira la barra al pecho superior, aprieta dorsales.',
      grip: 'Prono ancho en barra de jalón.',
    },
    one_arm_row: {
      name: 'Remo mancuerna 1 brazo',
      sets: '3×8 c/lado', heavy: false,
      tip: 'Máximo rango. Rodilla y mano en el banco.',
      video: 'pUfkihVsj6s',
      machine: 'Banco plano + mancuerna',
      setup: 'Mano y rodilla en el banco. Espalda paralela al suelo. Tira el codo hacia el techo, no solo la mancuerna.',
      grip: 'Neutro en mancuerna.',
    },
    incline_curl: {
      name: 'Curl inclinado',
      sets: '3×8', heavy: false,
      tip: 'Estiramiento máximo del bíceps.',
      video: 'soxrZlIL35Q',
      machine: 'Banco inclinado 45° + mancuernas',
      setup: 'Tumbado en banco 45°, brazos colgando. Sube sin mover el hombro.',
      grip: 'Prono.',
    },
    preacher_curl: {
      name: 'Curl predicador',
      sets: '3×8', heavy: false,
      tip: 'Sin trampa. Brazos apoyados en el banco Scott.',
      video: 'fIWP-FRFNU0',
      machine: 'Banco Scott / predicador + barra EZ',
      setup: 'Axilas en el borde del banco. Extensión casi completa abajo sin hiperextender el codo.',
      grip: 'EZ prono o mancuerna neutra.',
    },
  };

  function get(id) { return DB[id] || null; }
  function getAllIds() { return Object.keys(DB); }

  function renderCardClean(id) {
    const ex = DB[id];
    if (!ex) return '';
    const heavy = ex.heavy ? ' heavy' : '';
    const thumb = 'https://img.youtube.com/vi/' + ex.video + '/mqdefault.jpg';
    return [
      '<div class="exercise" data-ex-id="' + id + '">',
      '<div class="exercise-row"><div class="exercise-name">' + ex.name + '</div>',
      '<div class="exercise-sets' + heavy + '">' + ex.sets + '</div></div>',
      '<div class="exercise-tip">' + ex.tip + '</div>',
      '<button type="button" class="ex-toggle-btn" data-action="toggle-ex" data-ex="' + id + '">▶ Técnica, máquina y vídeo</button>',
      '<div class="ex-detail" id="ex-detail-' + id + '" hidden>',
      '<div class="ex-machine"><span class="ex-label">Máquina / material</span> ' + ex.machine + '</div>',
      '<div class="ex-setup"><span class="ex-label">Ajustes y agarre</span> ' + ex.setup + '<br><b>Agarre:</b> ' + ex.grip + '</div>',
      '<div class="ex-media">',
      '<img class="ex-thumb" src="' + thumb + '" alt="' + ex.name + '" loading="lazy">',
      '<button type="button" class="ex-play-btn" data-action="play-ex-video" data-ex="' + id + '" data-vid="' + ex.video + '">▶ Ver vídeo de técnica</button>',
      '<div class="ex-video-wrap" id="ex-video-' + id + '"></div>',
      '</div>',
      '<div class="ex-log-block" id="ex-log-' + id + '"></div>',
      '</div></div>'
    ].join('').replace('<div class="exercise-name"', '<div class="exercise-name"');
  }

  function renderGymDays() {
    PPL.forEach(function (day) {
      const container = document.getElementById('gym-' + day.day);
      if (!container) return;
      let html = '<div class="day-pill">' + day.pill + '</div>';
      if (day.warn) html += '<div class="info warn"><div class="info-icon">⚠️</div><div>' + day.warn + '</div></div>';
      html += '<div class="card"><div class="card-body">';
      day.items.forEach(function (id) { html += renderCardClean(id); });
      html += '</div></div>';
      container.innerHTML = html;
    });
  }

  return { PPL, DB, get, getAllIds, renderGymDays, renderCardClean };
})();
