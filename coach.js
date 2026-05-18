/* Coach experto — gym, nutrición, skincare, higiene, músculos. Usa tus datos guardados. */
const Coach = (function () {
  const gymDays = ['Push (pecho/hombros/tríceps)', 'Pull (espalda/bíceps)', 'Pierna', 'Push 2', 'Pull 2', 'Descanso', 'Descanso'];

  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function hasAny(text, words) {
    const t = norm(text);
    return words.some(function (w) { return t.includes(norm(w)); });
  }

  function bullet(lines) {
    return lines.map(function (l) { return '• ' + l; }).join('\n');
  }

  function scoreMatch(text, keywords) {
    const t = norm(text);
    let s = 0;
    keywords.forEach(function (k) {
      const nk = norm(k);
      if (t === nk) s += 5;
      else if (t.includes(nk)) s += nk.length > 4 ? 3 : 1;
    });
    return s;
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
      liftSummary: state.liftSummary || '',
    };
  }

  const KNOWLEDGE = [
    {
      keys: ['pectoral', 'pecho', 'banca', 'press banca', 'inclinado', 'cruces'],
      reply: function () {
        return '**Pecho / Pectoral**\n' + bullet([
          'Banca plana 3×5: rey del volumen. Omóplatos retraídos.',
          'Inclinado 30°: parte alta — te ves más grande de frente.',
          'Cruces en polea: bombeo, ligero, 3×10.',
          'Recuperación: 48-72h entre sesiones push intensas.',
        ]) + '\n\nEn la app: abre el ejercicio → vídeo + registro de pesos.';
      },
    },
    {
      keys: ['espalda', 'dorsal', 'remo', 'dominada', 'jalon', 'pull'],
      reply: function () {
        return '**Espalda**\n' + bullet([
          'Dominadas 3×5-8: anchura. Jalón pesado si no llegas.',
          'Remo con barra 3×6: grosor de espalda.',
          'Face pull 3×15: salud de hombros, postura.',
          'Tira con codos, no solo con brazos.',
        ]);
      },
    },
    {
      keys: ['pierna', 'cuadriceps', 'femoral', 'gluteo', 'sentadilla', 'prensa', 'gemelo'],
      reply: function () {
        return '**Pierna**\n' + bullet([
          'Sentadilla 3×5: la más importante. Profundidad paralelo+.',
          'RDL 3×6-8: femorales y glúteo.',
          'Prensa 3×8: más peso con control.',
          'Gemelos 3×8-10 pesado, recorrido completo.',
          'Pierna genera más testosterona/GH que cualquier otro día.',
        ]);
      },
    },
    {
      keys: ['hombro', 'deltoides', 'militar', 'lateral', 'press hombro'],
      reply: function () {
        return '**Hombros**\n' + bullet([
          'Press militar 3×6-8: masa total del deltoides.',
          'Laterales 3×10: anchura visual. Peso moderado.',
          'Face pull: rotadores externos — previene lesiones.',
          'No entrenes hombro pesado todos los días.',
        ]);
      },
    },
    {
      keys: ['biceps', 'curl', 'brazo'],
      reply: function () {
        return '**Bíceps**\n' + bullet([
          'Curl barra EZ 3×8: básico pesado.',
          'Martillo 3×8: grosor del brazo.',
          'Inclinado 3×8: estiramiento máximo.',
          '2-3 ejercicios de bíceps por semana bastan en PPL.',
        ]);
      },
    },
    {
      keys: ['triceps', 'fondos', 'extension', 'polea tricep'],
      reply: function () {
        return '**Tríceps** (2/3 del brazo)\n' + bullet([
          'Fondos 3×6-8: compuesto potente.',
          'Press cerrado 3×6-8: fuerza en press.',
          'Extensión polea 3×8-10: aislamiento.',
          'Brazos grandes = más peso en banca.',
        ]);
      },
    },
    {
      keys: ['creatina', 'whey', 'suplemento', 'proteina polvo'],
      reply: function () {
        return '**Suplementos**\n' + bullet([
          'Whey: si no llegas a 160g proteína con comida.',
          'Creatina 5g/día: la más estudiada para fuerza.',
          'Vitamina D si poco sol.',
          'No sustituyen comida real.',
        ]);
      },
    },
    {
      keys: ['lesion', 'dolor', 'hombro duele', 'rodilla', 'lumbar', 'tendinitis'],
      reply: function () {
        return '**Dolor / lesión** (orientación general)\n' + bullet([
          'Dolor agudo punzante: para y consulta médico/fisio.',
          'Dolor muscular normal 24-48h post-entreno (DOMS).',
          'Hombro: reduce press, más face pull y rotadores.',
          'Rodilla: revisa técnica sentadilla, no rodillas hacia dentro.',
          'Lumbar: core firme, no redondees en peso muerto.',
        ]) + '\n\n⚠️ No soy médico. Si persiste, ve al profesional.';
      },
    },
    {
      keys: ['progresion', 'subir peso', 'estancado', 'plateau', 'no progreso'],
      reply: function (c) {
        let extra = c.liftSummary ? '\n\n**Tus últimos registros:**\n' + c.liftSummary : '';
        return '**Progresión**\n' + bullet([
          'Máx. 3 series por ejercicio — calidad > cantidad.',
          '+2.5 kg en compuestos si completas todas las reps con buena técnica.',
          'O +1 rep por serie una semana, luego sube peso.',
          'Come 160g+ proteína y duerme 8-9h.',
          'Registra cada serie en la app para ver el progreso real.',
        ]) + extra;
      },
    },
    {
      keys: ['fuera', 'viaje', 'viajar', 'restaurante', 'hotel', 'fiesta', 'no estoy en casa'],
      reply: function () {
        saveDayMode('away');
        return '**Modo fuera de casa** activado.\n' + bullet([
          'Comida: proteína + arroz/patata en cada comida.',
          'Mochila: whey, atún, agua, chicle, mini skincare.',
          'Gym hotel: misma rutina, pesos moderados.',
          'Sin gym: flexiones, dominadas australianas, sentadillas 3×10.',
        ]) + '\n\nPregunta "qué comer" o "sin gym".';
      },
    },
    {
      keys: ['sin gym', 'no puedo ir', 'gym cerrado', 'casa', 'en casa entreno'],
      reply: function (c) {
        return '**Entreno sin gym** (' + c.gym + '):\n' + bullet([
          'Flexiones 3×8-10 (casi al fallo)',
          'Dominadas australianas 3×6-8',
          'Sentadillas 3×10 o zancadas 3×10/pierna',
          'Plancha 3×45 seg',
          '20 min caminata rápida',
        ]);
      },
    },
    {
      keys: ['comer', 'comida', 'almuerzo', 'cena', 'desayuno', 'hambre', 'proteina', 'calorias', 'dieta'],
      reply: function (c) {
        const left = Math.max(0, c.proteinGoal - c.protein);
        return '**Nutrición** (' + c.protein + '/' + c.proteinGoal + 'g hoy, faltan ~' + left + 'g):\n' + bullet([
          'Cada comida: 40g+ proteína mínimo.',
          'Pre-gym: plátano + yogur o whey.',
          'Post-gym: whey + arroz/patata en 60 min.',
          '~2600 kcal, 160-175g proteína, 260-300g carbs para ganar músculo.',
        ]);
      },
    },
    {
      keys: ['agua', 'hidrat', 'sed'],
      reply: function (c) {
        const left = Math.max(0, c.waterGoal - c.water);
        return '💧 **' + (c.water / 1000).toFixed(1) + 'L** / ' + (c.waterGoal / 1000).toFixed(1) + 'L. Faltan **' + left + 'ml**.\n' + bullet([
          '500ml ahora',
          'Vaso grande con cada comida',
          '300ml extra antes del gym',
        ]);
      },
    },
    {
      keys: ['piel', 'skincare', 'acne', 'granos', 'vitamina c', 'retinol', 'spf', 'poros'],
      reply: function () {
        return '**Skincare**\n☀️ Mañana: limpiador → vitamina C → SPF 30\n🌙 Noche: limpiador → niacinamida → hidratante\n🔄 Retinol 2-3×/semana solo noche\n\nConstancia > productos caros.';
      },
    },
    {
      keys: ['aliento', 'mal olor', 'boca', 'dientes', 'higiene bucal', 'halitosis'],
      reply: function () {
        return '**Higiene bucal**\n' + bullet([
          '1. Rascador de lengua (siempre primero)',
          '2. Cepillo 2 min',
          '3. Hilo dental',
          '4. Enjuague clorhexidina 30 seg',
          'Resultado en 3-5 días si eres constante.',
        ]);
      },
    },
    {
      keys: ['axila', 'sudor', 'transpir', 'desodorante', 'olor corporal'],
      reply: function () {
        return '**Anti-olor axilas**\n' + bullet([
          'Jabón antibacterial 30-40 seg en ducha',
          'Secar COMPLETAMENTE',
          'Antitranspirante DE NOCHE (Rexona Clinical, Mitchum)',
          'Ropa algodón, lavar 40°C',
        ]);
      },
    },
    {
      keys: ['gym', 'entreno', 'entrenar', 'ppl', 'rutina', 'serie', 'repeticion', 'rir', 'fallo'],
      reply: function (c) {
        if (!c.isGymDay)
          return 'Hoy: **' + c.gym + '**. Descanso activo 30-45 min o movilidad.\n¿Sin gym? Dímelo.';
        return '**Hoy: ' + c.gym + '**\n' + bullet([
          'Máx. **3 series** por ejercicio.',
          'Compuestos 5-8 reps PESADOS (3×5 banca/sentadilla).',
          'Descanso 3 min compuestos, 90 seg aislamiento.',
          'Registra peso y reps en cada ejercicio de la app.',
          'RIR 1-2 en la última serie.',
        ]) + (c.liftSummary ? '\n\n📊 ' + c.liftSummary : '');
      },
    },
    {
      keys: ['cansado', 'sueño', 'dormir', 'fatiga', 'energia', 'insomnio'],
      reply: function () {
        return '**Sueño = músculo + piel**\n' + bullet([
          '8-9h, misma hora ±30 min',
          'Teléfono boca abajo 60 min antes',
          'Cuarto oscuro y fresco',
          'Sin entreno pesado si dormiste <6h',
        ]);
      },
    },
    {
      keys: ['sol', 'bronce', 'vitamina d', 'broncer'],
      reply: function () {
        return '**Sol / bronceado**\n' + bullet([
          '10 min sol mañana (ya tienes SPF en skincare)',
          'Bronceado gradual, SPF 20-30 si quieres color',
          'Aloe post-sol',
          'Beta-caroteno opcional 3-4 semanas antes del verano',
        ]);
      },
    },
    {
      keys: ['motivacion', 'pereza', 'flojo', 'no quiero', 'flojera'],
      reply: function (c) {
        return '**Motivación** — Racha: **' + c.streak + ' días** 🔥\n' + bullet([
          'Regla 2 min: solo ponte la ropa del gym.',
          'Marca 1 hábito = momentum.',
          'El músculo crece con constancia, no con perfección.',
        ]);
      },
    },
    {
      keys: ['peso corporal', 'engordar', 'adelgazar', 'definir', 'volumen', 'bulk', 'cut'],
      reply: function () {
        return '**Peso corporal / composición**\n' + bullet([
          'Ganar músculo: ~2600 kcal, 160g+ proteína, entreno progresivo.',
          'Pesa 1×/semana misma hora (sección Progreso).',
          'Sube 0.25-0.5 kg/mes de peso corporal en volumen limpio.',
          'No te obsesiones con la báscula diaria.',
        ]);
      },
    },
    {
      keys: ['como hacer', 'tecnica', 'forma', 'mal hecho', 'video', 'ejercicio'],
      reply: function () {
        return '**Técnica de ejercicios**\nEn **Gym** → toca cada ejercicio → **"Técnica, máquina y vídeo"**.\nAhí verás:\n• Qué máquina usar\n• Ángulo del banco / altura de polea\n• Agarre correcto\n• Vídeo de técnica\n\nPregúntame por un músculo concreto: "pecho", "espalda", "pierna"...';
      },
    },
    {
      keys: ['registrar', 'apuntar', 'peso levantado', 'series', 'cuaderno', 'progreso gym'],
      reply: function () {
        return '**Registrar pesos**\n' + bullet([
          'En cada ejercicio del Gym: abre detalles → 3 filas (kg + reps).',
          'Pulsa "Guardar series de hoy".',
          'Historial en **Más → Progreso → Pesos del gym**.',
          'Los datos **nunca se borran** al cambiar de día.',
          'Backup en Ajustes si cambias de móvil.',
        ]);
      },
    },
    {
      keys: ['modo normal', 'volver normal', 'en casa ya'],
      reply: function () {
        saveDayMode('normal');
        return '✅ **Modo normal** activado.';
      },
    },
    {
      keys: ['hola', 'hey', 'buenas', 'coach', 'ayuda', 'que puedes'],
      reply: function (c) {
        return '¡Hola! Soy tu **coach** — pregúntame lo que sea:\n' + bullet([
          'Gym: pecho, espalda, pierna, técnica, progresión',
          'Dieta y proteína',
          'Skincare, aliento, axilas',
          'Fuera de casa / sin gym',
        ]) + '\n\n**Hoy**: ' + c.gym + ' | Proteína: ' + c.protein + '/' + c.proteinGoal + 'g';
      },
    },
  ];

  function saveDayMode(mode) {
    try {
      const p = JSON.parse(localStorage.getItem('mr_profile') || '{}');
      p.dayMode = mode;
      localStorage.setItem('mr_profile', JSON.stringify(p));
    } catch (e) {}
  }

  function findBestReply(message, c) {
    let best = null;
    let bestScore = 0;
    KNOWLEDGE.forEach(function (item) {
      const s = scoreMatch(message, item.keys);
      if (s > bestScore) {
        bestScore = s;
        best = item;
      }
    });
    if (best && bestScore >= 2) return best.reply(c);
    return null;
  }

  function genericSmartReply(message, c) {
    const t = norm(message);
    const words = t.split(/\s+/).filter(function (w) { return w.length > 3; });
    if (words.length === 0) return null;

    const hints = [];
    if (hasAny(t, ['que', 'como', 'cuando', 'cuanto', 'cual']))
      hints.push('Sé concreto: ¿gym, comida, piel, sueño o un músculo (pecho, espalda...)?');
    if (hasAny(t, ['hacer', 'entrenar', 'ir']))
      hints.push('Hoy toca **' + c.gym + '**. Abre la pestaña Gym para la rutina con vídeos.');
    if (c.protein < c.proteinGoal * 0.6)
      hints.push('Llevas **' + c.protein + 'g** de proteína — come 40g+ en la próxima comida.');

    if (hints.length)
      return 'Sobre **"' + message.slice(0, 60) + '"**:\n' + bullet(hints) + '\n\nPrueba: "¿cómo hacer remo?", "qué comer ahora", "técnica banca", "motivación".';

    return 'Entiendo tu pregunta sobre **"' + message.slice(0, 50) + '"**.\n\nPuedo ayudarte con:\n• **Gym** (músculos, ejercicios, series, pesos)\n• **Comida** y proteína\n• **Piel**, aliento, axilas\n• **Sueño** y motivación\n\nEscribe con más detalle o usa un atajo abajo.';
  }

  function getReply(message, profile, state) {
    const c = ctx(profile, state);
    if (!norm(message).trim()) return 'Escribe tu pregunta. Puedo ayudarte con gym, dieta, skincare, higiene, músculos y más.';

    const matched = findBestReply(message, c);
    if (matched) return matched;

    return genericSmartReply(message, c);
  }

  function getQuickReplies() {
    return [
      '¿Qué toca hoy en el gym?',
      '¿Cómo hacer press banca?',
      '¿Qué comer para ganar músculo?',
      'Técnica de sentadilla',
      'Rutina skincare',
      'Estoy fuera de casa',
      'Motivación',
      '¿Cómo registro mis pesos?',
    ];
  }

  return { getReply, getQuickReplies, saveDayMode };
})();
