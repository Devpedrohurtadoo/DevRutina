/* Coach inteligente — 100% gratis, funciona sin internet */
const Coach = (function () {
  const gymDays = ['Push (pecho/hombros/tríceps)', 'Pull (espalda/bíceps)', 'Pierna', 'Push 2', 'Pull 2', 'Descanso', 'Descanso'];

  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function hasAny(text, words) {
    const t = norm(text);
    return words.some(w => t.includes(norm(w)));
  }

  function bullet(lines) {
    return lines.map(l => '• ' + l).join('\n');
  }

  function ctx(profile, state) {
    const wd = new Date().getDay();
    return {
      gym: gymDays[wd],
      isGymDay: wd >= 1 && wd <= 5,
      wake: state.wakeStr || 'no registrada',
      water: state.water || 0,
      protein: state.protein || 0,
      habits: state.habitsDone || 0,
      mode: profile.dayMode || 'normal',
      proteinGoal: profile.proteinGoal || 160,
      waterGoal: profile.waterGoal || 3000,
      streak: state.streak || 0,
    };
  }

  const AWAY_PLAN = `**Plan fuera de casa** — sigues progresando:

**Mochila mínima**
${bullet([
  'Botella de agua (rellénala siempre)',
  'Proteína en sobre o barrita (20-30g)',
  'Chicle sin azúcar + mini hilo dental',
  'Toallitas + desodorante/antitranspirante',
  'Mini SPF o gorra si sales al sol',
])}

**Comidas fuera**
${bullet([
  'Prioridad: proteína (pollo, pescado, huevos, atún)',
  'Arroz/patata > frituras. Ensalada siempre',
  'Si no hay buena opción: 2 latas atún + fruta en super',
  'Evita bebidas azucaradas; agua o zero',
  'Objetivo: ~' + (160) + 'g proteína repartidos en el día',
])}

**Gym fuera**
${bullet([
  'Hotel con gym: misma rutina, pesos moderados, técnica perfecta',
  'Sin gym: flexiones, dominadas en parque, sentadillas, zancadas 4×15',
  '20 min > 0 min. Mantén el hábito aunque sea versión corta',
])}

**Skincare viaje**
${bullet([
  'Mañana: limpiador + SPF (no lo saltes)',
  'Noche: limpiador + niacinamida. Retinol solo si lo llevas',
  'Higiene bucal: rascador + cepillo + enjuague mínimo',
])}

**Antitranspirante**: aplícalo de noche aunque estés fuera. Axilas secas.`;

  const RESPONSES = [
    {
      match: t => hasAny(t, ['fuera', 'viaje', 'viajar', 'casa de', 'fiesta', 'restaurante', 'hotel', 'finde fuera', 'no estoy en casa']),
      reply: (c, p) => {
        saveDayMode('away');
        return AWAY_PLAN + '\n\n💡 He activado **modo Fuera de casa** en tu perfil. Tu horario se adapta. Pregúntame "qué comer ahora" o "entreno sin gym".';
      },
    },
    {
      match: t => hasAny(t, ['sin gym', 'no puedo ir al gym', 'gym cerrado', 'no hay gym']),
      reply: (c) => `**Entreno en casa / sin gym** (${c.gym}):\n${bullet([
        'Calentamiento 5 min: jumping jacks + movilidad hombros',
        'Flexiones 4×12-15 (rodillas si hace falta)',
        'Dominadas australianas o banda elástica 4×10',
        'Sentadillas 4×15 o zancadas 3×12/pierna',
        'Plancha 3×45 seg',
        'Termina con 10 min caminata rápida',
      ])}\n\nMantén **proteína alta** hoy — el músculo se recupera con comida, no solo con pesas.`,
    },
    {
      match: t => hasAny(t, ['comer', 'comida', 'almuerzo', 'cena', 'desayuno', 'merienda', 'hambre', 'proteina', 'proteína']),
      reply: (c, p) => {
        const left = Math.max(0, c.proteinGoal - c.protein);
        if (c.mode === 'away')
          return `**Comer ahora (fuera de casa)** — te faltan ~${left}g proteína:\n${bullet([
            'Opción rápida: menú con pechuga/pescado + arroz',
            'Super: yogur griego + atún + plátano + nueces',
            'Mc/Burger: doble pollo sin salsas, patatas pequeñas o ensalada',
            'Bocadillo: pavo/atún entero + pan integral',
          ])}`;
        return `**Nutrición ahora** (llevas ${c.protein}g / ${c.proteinGoal}g):\n${bullet([
          'Siguiente comida ideal: 40g+ proteína + carbos si entrenas pronto',
          'Pre-gym: plátano + yogur o batido whey',
          'Post-gym: whey + arroz/patata en 60 min',
          'Cena: pollo/pescado/huevos + verduras',
        ])}\n\nMira la pestaña **Dieta** para el menú del día ${new Date().getDay() || 7}.`;
      },
    },
    {
      match: t => hasAny(t, ['agua', 'hidrat', 'sed']),
      reply: c => {
        const left = Math.max(0, c.waterGoal - c.water);
        return `💧 Llevas **${(c.water / 1000).toFixed(1)}L** de ${(c.waterGoal / 1000).toFixed(1)}L. Faltan **${left}ml**.\n\n${bullet([
          'Bebe 500ml ahora de un trago',
          'Vaso grande con cada comida',
          'Antes del gym: 300ml extra',
          'Orina clara = bien hidratado',
        ])}`;
      },
    },
    {
      match: t => hasAny(t, ['piel', 'skincare', 'acne', 'acné', 'granos', 'manchas', 'vitamina c', 'retinol', 'spf', 'sol']),
      reply: () => `**Skincare profesional** (16 años, piel joven):\n\n☀️ **Mañana**: limpiador suave → vitamina C → SPF 30 (obligatorio)\n🌙 **Noche**: limpiador → niacinamida 10% → hidratante\n🔄 **Retinol** 2-3×/semana solo noche, empieza lento\n\n${bullet([
        'No toques la cara. Cambia funda almohada cada semana',
        'Sudor post-gym: limpia en 30 min',
        'Más progreso con constancia 4-6 semanas que con productos caros',
      ])}`,
    },
    {
      match: t => hasAny(t, ['aliento', 'mal olor', 'boca', 'dientes', 'higiene bucal', 'halitosis']),
      reply: () => `**Protocolo aliento** (resultados en 3-5 días):\n${bullet([
        '1º Rascador de lengua (causa #1 del olor)',
        '2º Cepillo eléctrico 2 min',
        '3º Hilo dental — huele el hilo, ahí está el problema',
        '4º Enjuague clorhexidina 30 seg (farmacia)',
        'Chicle xilitol entre comidas',
      ])}\n\nNoche = rutina completa. Mañana puedes saltar hilo si vas justo.`,
    },
    {
      match: t => hasAny(t, ['axila', 'axilas', 'sudor', 'transpir', 'olor corporal', 'desodorante']),
      reply: () => `**Anti-olor axilas**:\n${bullet([
        'Ducha: jabón antibacterial 30-40 seg en axilas',
        'Secar COMPLETAMENTE con toalla',
        'Antitranspirante DE NOCHE (Rexona Clinical, Sure Max)',
        'Ropa algodón, lavar a 40°C mínimo',
      ])}\n\nPor la mañana solo enjuaga, no reapliques — ya actuó de noche.`,
    },
    {
      match: t => hasAny(t, ['gym', 'entreno', 'entrenar', 'peso', 'serie', 'ppl', 'musculo', 'músculo', 'hipertrofia']),
      reply: c => {
        if (!c.isGymDay)
          return `Hoy es **${c.gym}**. Descanso activo: paseo 30-45 min, estiramientos, movilidad. El músculo crece durmiendo.\n\n¿Quieres igualmente un entreno ligero? Dime "sin gym".`;
        return `**Hoy toca: ${c.gym}**\n${bullet([
          'Calentamiento 5 min + 1 serie ligera por ejercicio',
          'Compuestos primero: 4×8-10, descanso 2-3 min',
          'Aislamiento: 3×12-15, descanso 90 seg (usa el temporizador)',
          'Progresión: +1-2 kg o +1 rep/semana si la técnica es perfecta',
          'RIR 1-2: para con 1-2 reps en el tanque',
        ])}\n\nAnota pesos en el registro del gym. Despertaste a las ${c.wake}.`;
      },
    },
    {
      match: t => hasAny(t, ['cansado', 'sueño', 'dormir', 'insomnio', 'fatiga', 'energia', 'energía']),
      reply: () => `**Recuperación y sueño** (clave para músculo y piel):\n${bullet([
        'Objetivo: 8-9h. Misma hora de despertar ±30 min',
        'Teléfono boca abajo 60 min antes de dormir',
        'Cena no muy pesada 2-3h antes',
        'Cuarto oscuro y fresco',
        'Creatina y comida suficiente ayudan a la energía diurna',
      ])}`,
    },
    {
      match: t => hasAny(t, ['creatina', 'whey', 'suplemento', 'proteina en polvo']),
      reply: () => `**Suplementos (evidencia real)**:\n${bullet([
        '**Creatina** 5g/día — el más estudiado. Fuerza y volumen',
        '**Whey** — solo si no llegas a 160g con comida',
        '**Vitamina D** si poco sol',
        'El resto es opcional. Comida > suplementos siempre',
      ])}`,
    },
    {
      match: t => hasAny(t, ['motivacion', 'motivación', 'pereza', 'flojo', 'no quiero']),
      reply: c => `**Motivación** — racha actual: ${c.streak} días 🔥\n\nLa disciplina gana al ánimo. Regla de 2 minutos: solo ponte la ropa del gym / haz 1 hábito.\n\n${bullet([
        'Hoy: marca 1 hábito → momentum',
        'Música playlist gym',
        'Recuerda: en 2 meses de gym ya llevas base, sigue',
      ])}\n\n¿Qué es lo MÁS fácil que puedes hacer en los próximos 10 min?`,
    },
    {
      match: t => hasAny(t, ['grasa', 'adelgazar', 'definicion', 'definición', 'volumen', 'bulk', 'peso']),
      reply: () => `A los 16 con 1.80m y gym 2 meses: prioriza **recomposición** (ganar músculo + poco grasa).\n\n${bullet([
        '~2600 kcal, 160g+ proteína, entreno 5×/semana',
        'No recortes demasiado calorías — necesitas energía para crecer',
        'Pérdida de grasa lenta: -0.3 kg/semana máximo si acortas',
        'Pesa 1×/semana misma hora, mide cintura cada 2 semanas',
      ])}`,
    },
    {
      match: t => hasAny(t, ['modo normal', 'volver normal', 'en casa']),
      reply: () => {
        saveDayMode('normal');
        return '✅ **Modo normal** activado. Rutina completa desde tu hora de despertar. ¡Buen día!';
      },
    },
    {
      match: t => hasAny(t, ['hola', 'hey', 'buenas', 'coach', 'ayuda']),
      reply: c => `¡Hola! Soy tu **Coach** — experto en gym, nutrición, skincare e higiene.\n\n**Tu día**: ${c.gym} | Despertar: ${c.wake} | Proteína: ${c.protein}/${c.proteinGoal}g | Agua: ${(c.water / 1000).toFixed(1)}L\n\nPregúntame lo que quieras, por ejemplo:\n${bullet([
        '"Hoy estoy fuera de casa"',
        '"¿Qué comer ahora?"',
        '"Entreno sin gym"',
        '"Rutina de piel"',
      ])}`,
    },
  ];

  function saveDayMode(mode) {
    try {
      const p = JSON.parse(localStorage.getItem('mr_profile') || '{}');
      p.dayMode = mode;
      localStorage.setItem('mr_profile', JSON.stringify(p));
    } catch (e) {}
  }

  function getReply(message, profile, state) {
    const c = ctx(profile, state);
    const t = norm(message);
    if (!t.trim()) return 'Escribe tu pregunta o situación (ej: "estoy fuera de casa").';

    for (const r of RESPONSES) {
      if (r.match(message)) return r.reply(c, profile);
    }

    return `Entiendo que preguntas sobre: "${message.slice(0, 80)}..."\n\nTe recomiendo:\n${bullet([
      'Sé más específico: gym, comida, piel, fuera de casa, sueño...',
      'Activa **modo fuera** si viajas: escribe "estoy fuera de casa"',
      'Revisa **Hoy** para tu siguiente paso según tu despertar',
    ])}\n\n**Atajos rápidos** abajo 👇`;
  }

  function getQuickReplies() {
    return [
      'Estoy fuera de casa hoy',
      '¿Qué comer ahora?',
      'Entreno sin gym',
      'Rutina skincare',
      'Mal aliento / boca',
      'Motivación',
    ];
  }

  return { getReply, getQuickReplies, saveDayMode };
})();
