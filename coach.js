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
  'Objetivo: ~160g proteína repartidos en el día',
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
      reply: () => {
        saveDayMode('away');
        return AWAY_PLAN + '\n\n💡 He activado **modo Fuera de casa**. Pregúntame "qué comer ahora" o "entreno sin gym".';
      },
    },
    {
      match: t => hasAny(t, ['sin gym', 'no puedo ir al gym', 'gym cerrado', 'no hay gym']),
      reply: c => `**Entreno en casa / sin gym** (${c.gym}):\n${bullet([
        'Calentamiento 5 min: jumping jacks + movilidad hombros',
        'Flexiones 4×12-15 (rodillas si hace falta)',
        'Dominadas australianas o banda elástica 4×10',
        'Sentadillas 4×15 o zancadas 3×12/pierna',
        'Plancha 3×45 seg',
        'Termina con 10 min caminata rápida',
      ])}\n\nMantén **proteína alta** hoy.`,
    },
    {
      match: t => hasAny(t, ['comer', 'comida', 'almuerzo', 'cena', 'desayuno', 'merienda', 'hambre', 'proteina', 'proteína']),
      reply: c => {
        const left = Math.max(0, c.proteinGoal - c.protein);
        if (c.mode === 'away')
          return `**Comer ahora (fuera)** — faltan ~${left}g proteína:\n${bullet([
            'Menú: pechuga/pescado + arroz',
            'Super: yogur griego + atún + plátano',
            'Bocadillo: pavo/atún + pan integral',
          ])}`;
        return `**Nutrición** (${c.protein}/${c.proteinGoal}g):\n${bullet([
          'Siguiente: 40g+ proteína',
          'Pre-gym: plátano + yogur o whey',
          'Post-gym: whey + arroz/patata en 60 min',
        ])}`;
      },
    },
    {
      match: t => hasAny(t, ['agua', 'hidrat', 'sed']),
      reply: c => {
        const left = Math.max(0, c.waterGoal - c.water);
        return `💧 **${(c.water / 1000).toFixed(1)}L** / ${(c.waterGoal / 1000).toFixed(1)}L. Faltan **${left}ml**.\n${bullet([
          'Bebe 500ml ahora',
          'Vaso grande con cada comida',
          'Antes del gym: 300ml extra',
        ])}`;
      },
    },
    {
      match: t => hasAny(t, ['piel', 'skincare', 'acne', 'acné', 'granos', 'vitamina c', 'retinol', 'spf']),
      reply: () => `**Skincare**:\n☀️ Mañana: limpiador → vitamina C → SPF 30\n🌙 Noche: limpiador → niacinamida → hidratante\n🔄 Retinol 2-3×/semana solo noche`,
    },
    {
      match: t => hasAny(t, ['aliento', 'mal olor', 'boca', 'dientes', 'higiene bucal']),
      reply: () => `**Protocolo aliento**:\n${bullet([
        'Rascador de lengua primero',
        'Cepillo 2 min + hilo dental',
        'Enjuague clorhexidina 30 seg',
        'Chicle xilitol entre comidas',
      ])}`,
    },
    {
      match: t => hasAny(t, ['axila', 'axilas', 'sudor', 'transpir', 'desodorante']),
      reply: () => `**Anti-olor axilas**:\n${bullet([
        'Jabón antibacterial 30-40 seg',
        'Secar COMPLETAMENTE',
        'Antitranspirante DE NOCHE',
        'Ropa algodón, lavar a 40°C',
      ])}`,
    },
    {
      match: t => hasAny(t, ['gym', 'entreno', 'entrenar', 'peso', 'ppl', 'musculo', 'músculo']),
      reply: c => {
        if (!c.isGymDay)
          return `Hoy: **${c.gym}**. Descanso activo: paseo 30-45 min.\n¿Entreno ligero? Dime "sin gym".`;
        return `**Hoy: ${c.gym}**\n${bullet([
          'Compuestos PESADOS 5-8 reps (5×5 banca/sentadilla)',
          'Descanso 3 min en compuestos, 90 seg aislamiento',
          'Progresión: +2.5 kg o +1 rep/semana — sin 4×12 en todo',
        ])}\n\nDespertaste a las ${c.wake}.`;
      },
    },
    {
      match: t => hasAny(t, ['cansado', 'sueño', 'dormir', 'fatiga', 'energia', 'energía']),
      reply: () => `**Sueño** (clave para músculo y piel):\n${bullet([
        '8-9h. Misma hora ±30 min',
        'Teléfono boca abajo 60 min antes',
        'Cuarto oscuro y fresco',
      ])}`,
    },
    {
      match: t => hasAny(t, ['motivacion', 'motivación', 'pereza', 'flojo', 'no quiero']),
      reply: c => `**Racha: ${c.streak} días** 🔥\nRegla de 2 minutos: solo ponte la ropa del gym o marca 1 hábito.`,
    },
    {
      match: t => hasAny(t, ['modo normal', 'volver normal', 'en casa']),
      reply: () => { saveDayMode('normal'); return '✅ **Modo normal** activado.'; },
    },
    {
      match: t => hasAny(t, ['hola', 'hey', 'buenas', 'coach', 'ayuda']),
      reply: c => `¡Hola! **Coach** listo.\n**Hoy**: ${c.gym} | Despertar: ${c.wake} | Proteína: ${c.protein}/${c.proteinGoal}g\n\nPrueba: "estoy fuera de casa", "¿qué comer?", "entreno sin gym".`,
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
    if (!norm(message).trim()) return 'Escribe tu pregunta (ej: "estoy fuera de casa").';
    for (const r of RESPONSES) {
      if (r.match(message)) return r.reply(c, profile);
    }
    return `Pregunta: "${message.slice(0, 80)}..."\n\nSé más específico: gym, comida, piel, fuera de casa, sueño...\n\n**Atajos** abajo 👇`;
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
