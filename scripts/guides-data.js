/* Content data for the SEO guide generator. Formulas verified. */
const CTA_TR_TOP = '⚙ Hidrolik Hesaplayıcıyı Aç →';
const CTA_TR_BOT = 'Kendi değerlerinizle hesaplayın →';
const CTA_EN_TOP = '⚙ Open the Hydraulic Calculator →';
const CTA_EN_BOT = 'Calculate with your own values →';

module.exports = [
  // 1 — Cylinder force
  {
    trSlug: 'hidrolik-silindir-kuvveti-hesaplama',
    enSlug: 'hydraulic-cylinder-force-calculation',
    tr: {
      title: 'Hidrolik Silindir Kuvveti Hesaplama | Formül ve Örnek — Hidroteknik',
      desc: 'Hidrolik silindir itme ve çekme kuvveti nasıl hesaplanır? F = P × A formülü, piston ve halka alanı, birim tablosu ve çözümlü örnek.',
      keywords: 'hidrolik silindir kuvveti hesaplama, silindir itme kuvveti, silindir çekme kuvveti, hidrolik piston kuvveti, silindir kuvvet formülü',
      h1: 'Hidrolik Silindir Kuvveti Hesaplama', crumb: 'Hidrolik Silindir Kuvveti',
      lead: 'Bir hidrolik silindirin ürettiği <strong>itme</strong> ve <strong>çekme</strong> kuvveti, sistem basıncı ile pistonun etkin alanına bağlıdır. Aşağıda formülü, birimleri ve çözümlü bir örneği bulacaksınız.',
      formulaTitle: 'Temel Formül',
      formulas: [
        { html: '<b>F</b> = <b>P</b> × <b>A</b>' },
        { label: 'İtme kuvveti (piston tarafı)', html: 'A<sub>piston</sub> = π × D² / 4', note: 'D = gömlek (silindir) iç çapı' },
        { label: 'Çekme kuvveti (mil tarafı)', html: 'A<sub>halka</sub> = π × (D² − d²) / 4', note: 'd = mil çapı. Mil kesiti düştüğü için çekme kuvveti daima itmeden küçüktür.' },
      ],
      units: [['Basınç', 'P', 'bar (1 bar = 0,1 N/mm²)'], ['Çap', 'D, d', 'mm'], ['Alan', 'A', 'mm² (÷100 → cm²)'], ['Kuvvet', 'F', 'N (÷9,81 → kgf)']],
      example: {
        given: 'Gömlek iç çapı D = 80 mm, mil çapı d = 45 mm, basınç P = 160 bar.',
        steps: [
          '1) Piston alanı: A = π × 80² / 4 = <strong>5026,5 mm²</strong>',
          "2) İtme kuvveti: F = 160 × 0,1 × 5026,5 = <span class='result'>80.424 N ≈ 80,4 kN ≈ 8,2 ton</span>",
          '3) Halka alan: A = π × (80² − 45²) / 4 = <strong>3436 mm²</strong>',
          "4) Çekme kuvveti: F = 160 × 0,1 × 3436 = <span class='result'>54.976 N ≈ 55,0 kN ≈ 5,6 ton</span>",
        ],
      },
      faq: [
        { q: 'Hidrolik silindir kuvveti formülü nedir?', a: 'Kuvvet = Basınç × Alan (F = P × A). İtmede alan piston alanıdır (π×D²/4); çekmede mil kesitini çıkardığımız halka alandır (π×(D²−d²)/4).' },
        { q: 'İtme ve çekme kuvveti neden farklı?', a: 'Mil tarafında etkin alan mil kesiti kadar azalır; bu yüzden aynı basınçta çekme kuvveti itmeden daima küçüktür.' },
        { q: 'Bar cinsinden basıncı nasıl kullanırım?', a: '1 bar = 0,1 N/mm². Alanı mm² alırsanız F(N) = P(bar) × 0,1 × A(mm²). Pratik kabul: F(kgf) ≈ P(bar) × A(cm²).' },
      ],
      howto: [{ name: 'Piston alanını bul', text: 'A = π × D² / 4' }, { name: 'Basıncı çevir', text: '1 bar = 0,1 N/mm²' }, { name: 'Kuvveti hesapla', text: 'F = P × 0,1 × A' }],
      ctaTop: CTA_TR_TOP, ctaBottom: CTA_TR_BOT,
    },
    en: {
      title: 'Hydraulic Cylinder Force Calculation | Formula & Example — Hidroteknik',
      desc: 'How to calculate hydraulic cylinder push and pull force. F = P × A formula, piston and annular area, unit table and a worked example.',
      keywords: 'hydraulic cylinder force calculation, cylinder push force, cylinder pull force, hydraulic piston force, cylinder force formula',
      h1: 'Hydraulic Cylinder Force Calculation', crumb: 'Hydraulic Cylinder Force',
      lead: 'The <strong>push</strong> and <strong>pull</strong> force a hydraulic cylinder produces depends on the system pressure and the effective piston area. Below you will find the formula, units and a worked example.',
      formulaTitle: 'Core Formula',
      formulas: [
        { html: '<b>F</b> = <b>P</b> × <b>A</b>' },
        { label: 'Push force (piston side)', html: 'A<sub>piston</sub> = π × D² / 4', note: 'D = cylinder bore (inner) diameter' },
        { label: 'Pull force (rod side)', html: 'A<sub>annulus</sub> = π × (D² − d²) / 4', note: 'd = rod diameter. The rod area reduces the effective area, so pull force is always lower than push force.' },
      ],
      units: [['Pressure', 'P', 'bar (1 bar = 0.1 N/mm²)'], ['Diameter', 'D, d', 'mm'], ['Area', 'A', 'mm² (÷100 → cm²)'], ['Force', 'F', 'N (÷9.81 → kgf)']],
      example: {
        given: 'Bore D = 80 mm, rod d = 45 mm, pressure P = 160 bar.',
        steps: [
          '1) Piston area: A = π × 80² / 4 = <strong>5026.5 mm²</strong>',
          "2) Push force: F = 160 × 0.1 × 5026.5 = <span class='result'>80,424 N ≈ 80.4 kN ≈ 8.2 tonne</span>",
          '3) Annular area: A = π × (80² − 45²) / 4 = <strong>3436 mm²</strong>',
          "4) Pull force: F = 160 × 0.1 × 3436 = <span class='result'>54,976 N ≈ 55.0 kN ≈ 5.6 tonne</span>",
        ],
      },
      faq: [
        { q: 'What is the hydraulic cylinder force formula?', a: 'Force = Pressure × Area (F = P × A). For push, the area is the piston area (π×D²/4); for pull, it is the annular area (π×(D²−d²)/4).' },
        { q: 'Why are push and pull force different?', a: 'On the rod side the effective area is reduced by the rod cross-section, so at the same pressure the pull force is always lower than the push force.' },
        { q: 'How do I use pressure in bar?', a: '1 bar = 0.1 N/mm². With area in mm², F(N) = P(bar) × 0.1 × A(mm²). Rule of thumb: F(kgf) ≈ P(bar) × A(cm²).' },
      ],
      howto: [{ name: 'Find piston area', text: 'A = π × D² / 4' }, { name: 'Convert pressure', text: '1 bar = 0.1 N/mm²' }, { name: 'Compute force', text: 'F = P × 0.1 × A' }],
      ctaTop: CTA_EN_TOP, ctaBottom: CTA_EN_BOT,
    },
  },

  // 2 — Pump flow
  {
    trSlug: 'hidrolik-pompa-debisi-hesaplama',
    enSlug: 'hydraulic-pump-flow-rate-calculation',
    tr: {
      title: 'Hidrolik Pompa Debisi Hesaplama | Formül ve Örnek — Hidroteknik',
      desc: 'Hidrolik pompa debisi nasıl hesaplanır? Q = Vg × n / 1000 formülü, volumetrik verim, birimler ve çözümlü örnek.',
      keywords: 'hidrolik pompa debisi hesaplama, pompa debi formülü, pompa deplasmanı, volumetrik verim, litre dakika hesabı',
      h1: 'Hidrolik Pompa Debisi Hesaplama', crumb: 'Pompa Debisi',
      lead: 'Bir hidrolik pompanın debisi, deplasmanı (devir başına hacim) ile devir sayısına bağlıdır. Volumetrik verim gerçek debiyi teorik debinin biraz altına çeker.',
      formulaTitle: 'Debi Formülü',
      formulas: [
        { label: 'Teorik debi', html: 'Q = V<sub>g</sub> × n / 1000', note: 'V<sub>g</sub>: deplasman (cc/dev), n: devir (dev/dk), Q: L/dk' },
        { label: 'Gerçek debi', html: 'Q<sub>gerçek</sub> = Q × η<sub>v</sub>', note: 'η<sub>v</sub>: volumetrik verim (genelde 0,90–0,97)' },
      ],
      units: [['Deplasman', 'Vg', 'cc/dev'], ['Devir', 'n', 'dev/dk (rpm)'], ['Debi', 'Q', 'L/dk'], ['Volumetrik verim', 'ηv', '– (0,90–0,97)']],
      example: {
        given: 'Deplasman Vg = 32 cc/dev, devir n = 1450 rpm, volumetrik verim ηv = 0,95.',
        steps: [
          "1) Teorik debi: Q = 32 × 1450 / 1000 = <span class='result'>46,4 L/dk</span>",
          "2) Gerçek debi: Q = 46,4 × 0,95 = <span class='result'>44,1 L/dk</span>",
        ],
      },
      faq: [
        { q: 'Pompa deplasmanı nedir?', a: 'Deplasman (Vg), pompanın bir tam devirde ittiği yağ hacmidir (cc/dev). Debinin temel belirleyicisidir.' },
        { q: 'Volumetrik verim neden önemli?', a: 'İç kaçaklar nedeniyle gerçek debi teorik debiden düşüktür. Volumetrik verim (0,90–0,97) bu farkı hesaba katar.' },
        { q: 'Devir değişince debi nasıl değişir?', a: 'Debi devirle doğru orantılıdır: devri iki katına çıkarırsanız debi de yaklaşık iki katına çıkar.' },
      ],
      howto: [{ name: 'Teorik debi', text: 'Q = Vg × n / 1000' }, { name: 'Verimi uygula', text: 'Qgerçek = Q × ηv' }],
      ctaTop: CTA_TR_TOP, ctaBottom: CTA_TR_BOT,
    },
    en: {
      title: 'Hydraulic Pump Flow Rate Calculation | Formula & Example — Hidroteknik',
      desc: 'How to calculate hydraulic pump flow rate. Q = Vg × n / 1000 formula, volumetric efficiency, units and a worked example.',
      keywords: 'hydraulic pump flow rate calculation, pump flow formula, pump displacement, volumetric efficiency, litres per minute',
      h1: 'Hydraulic Pump Flow Rate Calculation', crumb: 'Pump Flow Rate',
      lead: 'A hydraulic pump\'s flow rate depends on its displacement (volume per revolution) and its speed. Volumetric efficiency brings the actual flow slightly below the theoretical value.',
      formulaTitle: 'Flow Formula',
      formulas: [
        { label: 'Theoretical flow', html: 'Q = V<sub>g</sub> × n / 1000', note: 'V<sub>g</sub>: displacement (cc/rev), n: speed (rpm), Q: L/min' },
        { label: 'Actual flow', html: 'Q<sub>actual</sub> = Q × η<sub>v</sub>', note: 'η<sub>v</sub>: volumetric efficiency (typically 0.90–0.97)' },
      ],
      units: [['Displacement', 'Vg', 'cc/rev'], ['Speed', 'n', 'rpm'], ['Flow', 'Q', 'L/min'], ['Volumetric efficiency', 'ηv', '– (0.90–0.97)']],
      example: {
        given: 'Displacement Vg = 32 cc/rev, speed n = 1450 rpm, volumetric efficiency ηv = 0.95.',
        steps: [
          "1) Theoretical flow: Q = 32 × 1450 / 1000 = <span class='result'>46.4 L/min</span>",
          "2) Actual flow: Q = 46.4 × 0.95 = <span class='result'>44.1 L/min</span>",
        ],
      },
      faq: [
        { q: 'What is pump displacement?', a: 'Displacement (Vg) is the oil volume the pump delivers per full revolution (cc/rev). It is the primary driver of flow.' },
        { q: 'Why does volumetric efficiency matter?', a: 'Internal leakage makes actual flow lower than theoretical. Volumetric efficiency (0.90–0.97) accounts for this difference.' },
        { q: 'How does speed affect flow?', a: 'Flow is directly proportional to speed: doubling the rpm roughly doubles the flow.' },
      ],
      howto: [{ name: 'Theoretical flow', text: 'Q = Vg × n / 1000' }, { name: 'Apply efficiency', text: 'Qactual = Q × ηv' }],
      ctaTop: CTA_EN_TOP, ctaBottom: CTA_EN_BOT,
    },
  },

  // 3 — Motor power & torque
  {
    trSlug: 'hidrolik-motor-gucu-hesaplama',
    enSlug: 'hydraulic-motor-power-calculation',
    tr: {
      title: 'Hidrolik Motor Gücü ve Tork Hesaplama | Formül — Hidroteknik',
      desc: 'Hidrolik motor gücü ve torku nasıl hesaplanır? P = p × Q / 600 ve T = Vg × Δp / 62,83 formülleri, birimler ve çözümlü örnek.',
      keywords: 'hidrolik motor gücü hesaplama, hidrolik motor tork hesabı, motor devir hesabı, hidrolik güç formülü',
      h1: 'Hidrolik Motor Gücü ve Tork Hesaplama', crumb: 'Motor Gücü',
      lead: 'Hidrolik motorun ürettiği güç, sistem basıncı ile debiye; torku ise deplasman ile basınç farkına bağlıdır.',
      formulaTitle: 'Güç ve Tork Formülleri',
      formulas: [
        { label: 'Hidrolik güç', html: 'P (kW) = p (bar) × Q (L/dk) / 600' },
        { label: 'Tork', html: 'T (Nm) = V<sub>g</sub> (cc/dev) × Δp (bar) / 62,83' },
        { label: 'Devir', html: 'n (dev/dk) = Q (L/dk) × 1000 / V<sub>g</sub>' },
      ],
      units: [['Basınç', 'p, Δp', 'bar'], ['Debi', 'Q', 'L/dk'], ['Deplasman', 'Vg', 'cc/dev'], ['Güç', 'P', 'kW'], ['Tork', 'T', 'Nm']],
      example: {
        given: 'Debi Q = 40 L/dk, basınç p = 200 bar; motor deplasmanı Vg = 250 cc/dev, Δp = 180 bar.',
        steps: [
          "1) Güç: P = 200 × 40 / 600 = <span class='result'>13,3 kW</span>",
          "2) Tork: T = 250 × 180 / 62,83 = <span class='result'>716 Nm</span>",
          "3) Devir: n = 40 × 1000 / 250 = <span class='result'>160 dev/dk</span>",
        ],
      },
      faq: [
        { q: 'Hidrolik güç formülü nedir?', a: 'P (kW) = p (bar) × Q (L/dk) / 600. Bu, basınç ile debinin çarpımından elde edilen akışkan gücüdür.' },
        { q: 'Tork neye bağlıdır?', a: 'Tork, motor deplasmanı ile basınç farkına bağlıdır: T = Vg × Δp / 62,83. Deplasman büyüdükçe tork artar.' },
        { q: 'Mekanik güç ile fark ne?', a: 'Yukarıdaki hidrolik güçtür. Mekanik çıkış gücü, motorun toplam verimiyle (genelde 0,85–0,92) çarpılarak bulunur.' },
      ],
      howto: [{ name: 'Gücü hesapla', text: 'P = p × Q / 600' }, { name: 'Torku hesapla', text: 'T = Vg × Δp / 62,83' }],
      ctaTop: CTA_TR_TOP, ctaBottom: CTA_TR_BOT,
    },
    en: {
      title: 'Hydraulic Motor Power & Torque Calculation | Formula — Hidroteknik',
      desc: 'How to calculate hydraulic motor power and torque. P = p × Q / 600 and T = Vg × Δp / 62.83 formulas, units and a worked example.',
      keywords: 'hydraulic motor power calculation, hydraulic motor torque, motor speed calculation, hydraulic power formula',
      h1: 'Hydraulic Motor Power & Torque Calculation', crumb: 'Motor Power',
      lead: 'The power a hydraulic motor produces depends on system pressure and flow; its torque depends on displacement and the pressure drop across it.',
      formulaTitle: 'Power & Torque Formulas',
      formulas: [
        { label: 'Hydraulic power', html: 'P (kW) = p (bar) × Q (L/min) / 600' },
        { label: 'Torque', html: 'T (Nm) = V<sub>g</sub> (cc/rev) × Δp (bar) / 62.83' },
        { label: 'Speed', html: 'n (rpm) = Q (L/min) × 1000 / V<sub>g</sub>' },
      ],
      units: [['Pressure', 'p, Δp', 'bar'], ['Flow', 'Q', 'L/min'], ['Displacement', 'Vg', 'cc/rev'], ['Power', 'P', 'kW'], ['Torque', 'T', 'Nm']],
      example: {
        given: 'Flow Q = 40 L/min, pressure p = 200 bar; motor displacement Vg = 250 cc/rev, Δp = 180 bar.',
        steps: [
          "1) Power: P = 200 × 40 / 600 = <span class='result'>13.3 kW</span>",
          "2) Torque: T = 250 × 180 / 62.83 = <span class='result'>716 Nm</span>",
          "3) Speed: n = 40 × 1000 / 250 = <span class='result'>160 rpm</span>",
        ],
      },
      faq: [
        { q: 'What is the hydraulic power formula?', a: 'P (kW) = p (bar) × Q (L/min) / 600. This is the fluid power from pressure times flow.' },
        { q: 'What determines torque?', a: 'Torque depends on motor displacement and pressure drop: T = Vg × Δp / 62.83. Larger displacement gives more torque.' },
        { q: 'How is this different from mechanical power?', a: 'The above is hydraulic power. Mechanical output power is found by multiplying by the motor\'s overall efficiency (typically 0.85–0.92).' },
      ],
      howto: [{ name: 'Compute power', text: 'P = p × Q / 600' }, { name: 'Compute torque', text: 'T = Vg × Δp / 62.83' }],
      ctaTop: CTA_EN_TOP, ctaBottom: CTA_EN_BOT,
    },
  },

  // 4 — Accumulator sizing
  {
    trSlug: 'akumulator-boyutlandirma-hesabi',
    enSlug: 'hydraulic-accumulator-sizing',
    tr: {
      title: 'Akümülatör Boyutlandırma Hesabı | Boyle Yasası — Hidroteknik',
      desc: 'Hidrolik akümülatör hacmi nasıl hesaplanır? Boyle yasası ile toplam hacim, azot ön şarj basıncı, birimler ve çözümlü örnek.',
      keywords: 'akümülatör boyutlandırma, akümülatör hacim hesabı, azot ön şarj basıncı, boyle yasası hidrolik, akümülatör seçimi',
      h1: 'Akümülatör Boyutlandırma Hesabı', crumb: 'Akümülatör Boyutlandırma',
      lead: 'Bir bladder/piston akümülatörün toplam hacmi, kullanılabilir yağ hacmine ve çalışma basınçlarına göre Boyle yasasıyla (izotermal) hesaplanır.',
      formulaTitle: 'Hacim Formülü',
      formulas: [
        { html: 'V<sub>0</sub> = ΔV / [ p<sub>0</sub> × (1/p<sub>1</sub> − 1/p<sub>2</sub>) ]', note: 'Tüm basınçlar MUTLAK (bar abs = gösterge + 1,013). Ön şarj p<sub>0</sub> ≈ 0,9 × p<sub>1</sub>.' },
      ],
      units: [['Toplam hacim', 'V0', 'L'], ['Kullanılabilir hacim', 'ΔV', 'L'], ['Min/Max basınç', 'p1, p2', 'bar (mutlak)'], ['Ön şarj', 'p0', 'bar (mutlak)']],
      example: {
        given: 'ΔV = 2 L, min basınç 100 bar, max basınç 160 bar (gösterge). Ön şarj p0 = 90 bar gösterge.',
        steps: [
          '1) Mutlak: p0 = 91,0 · p1 = 101,0 · p2 = 161,0 bar',
          '2) 1/p1 − 1/p2 = 0,00990 − 0,00621 = 0,003689',
          "3) V0 = 2 / (91,0 × 0,003689) = <span class='result'>≈ 6,0 L</span>",
        ],
      },
      faq: [
        { q: 'Azot ön şarj basıncı ne olmalı?', a: 'Genel kural: ön şarj (p0) ≈ min çalışma basıncının %90\'ı. Fazla düşükse yağın büyük kısmı boşa gider, fazla yüksekse akümülatör erken boşalır.' },
        { q: 'Neden mutlak basınç kullanılır?', a: 'Boyle yasası (p×V = sabit) mutlak basınçla geçerlidir. Gösterge basıncına atmosfer (≈1,013 bar) eklenir.' },
        { q: 'İzotermal mi adyabatik mi?', a: 'Yavaş çevrimlerde izotermal (sabit sıcaklık) kabul yeterlidir. Çok hızlı çevrimlerde adyabatik düzeltme (üs n≈1,4) gerekebilir.' },
      ],
      howto: [{ name: 'Mutlak basınçlara çevir', text: 'bar abs = gösterge + 1,013' }, { name: 'Hacmi hesapla', text: 'V0 = ΔV / [p0 × (1/p1 − 1/p2)]' }],
      ctaTop: CTA_TR_TOP, ctaBottom: CTA_TR_BOT,
    },
    en: {
      title: 'Hydraulic Accumulator Sizing | Boyle\'s Law — Hidroteknik',
      desc: 'How to size a hydraulic accumulator. Total volume via Boyle\'s law, nitrogen pre-charge pressure, units and a worked example.',
      keywords: 'hydraulic accumulator sizing, accumulator volume calculation, nitrogen pre-charge pressure, boyle law hydraulic, accumulator selection',
      h1: 'Hydraulic Accumulator Sizing', crumb: 'Accumulator Sizing',
      lead: 'The total volume of a bladder/piston accumulator is calculated from the usable oil volume and the working pressures using Boyle\'s law (isothermal).',
      formulaTitle: 'Volume Formula',
      formulas: [
        { html: 'V<sub>0</sub> = ΔV / [ p<sub>0</sub> × (1/p<sub>1</sub> − 1/p<sub>2</sub>) ]', note: 'All pressures ABSOLUTE (bar abs = gauge + 1.013). Pre-charge p<sub>0</sub> ≈ 0.9 × p<sub>1</sub>.' },
      ],
      units: [['Total volume', 'V0', 'L'], ['Usable volume', 'ΔV', 'L'], ['Min/Max pressure', 'p1, p2', 'bar (absolute)'], ['Pre-charge', 'p0', 'bar (absolute)']],
      example: {
        given: 'ΔV = 2 L, min pressure 100 bar, max pressure 160 bar (gauge). Pre-charge p0 = 90 bar gauge.',
        steps: [
          '1) Absolute: p0 = 91.0 · p1 = 101.0 · p2 = 161.0 bar',
          '2) 1/p1 − 1/p2 = 0.00990 − 0.00621 = 0.003689',
          "3) V0 = 2 / (91.0 × 0.003689) = <span class='result'>≈ 6.0 L</span>",
        ],
      },
      faq: [
        { q: 'What should the nitrogen pre-charge be?', a: 'Rule of thumb: pre-charge (p0) ≈ 90% of the minimum working pressure. Too low wastes most of the oil; too high empties the accumulator early.' },
        { q: 'Why use absolute pressure?', a: 'Boyle\'s law (p×V = constant) holds for absolute pressure. Add atmospheric pressure (≈1.013 bar) to the gauge value.' },
        { q: 'Isothermal or adiabatic?', a: 'For slow cycles the isothermal (constant temperature) assumption is adequate. Very fast cycles may need an adiabatic correction (exponent n≈1.4).' },
      ],
      howto: [{ name: 'Convert to absolute', text: 'bar abs = gauge + 1.013' }, { name: 'Compute volume', text: 'V0 = ΔV / [p0 × (1/p1 − 1/p2)]' }],
      ctaTop: CTA_EN_TOP, ctaBottom: CTA_EN_BOT,
    },
  },

  // 5 — Pipe diameter / flow velocity
  {
    trSlug: 'boru-capi-akis-hizi-hesaplama',
    enSlug: 'pipe-diameter-flow-velocity-calculation',
    tr: {
      title: 'Boru Çapı ve Akış Hızı Hesaplama | Hidrolik — Hidroteknik',
      desc: 'Hidrolik hatlarda boru çapı ve akış hızı nasıl hesaplanır? Formül, önerilen hızlar tablosu, birimler ve çözümlü örnek.',
      keywords: 'boru çapı hesaplama, akış hızı hesaplama, hidrolik hat hızı, boru iç çapı hesabı, önerilen akış hızları',
      h1: 'Boru Çapı ve Akış Hızı Hesaplama', crumb: 'Boru Çapı & Akış Hızı',
      lead: 'Hidrolik hatlarda doğru boru çapı, akış hızını önerilen aralıkta tutar. Çok yüksek hız basınç kaybı ve ısınma, çok düşük hız gereksiz maliyet demektir.',
      formulaTitle: 'Formül',
      formulas: [
        { label: 'Akış hızı', html: 'v = Q / (A × 60000)', note: 'Q: L/dk, A: m², v: m/s' },
        { label: 'Gerekli iç çap', html: 'D = √(4 × A / π) × 1000', note: 'A = Q / (v × 60000)  [m²],  D: mm' },
        { label: 'Önerilen hızlar', html: 'Emme: 0,5–1,5 · Basınç: 3–6 · Dönüş: 2–4 m/s' },
      ],
      units: [['Debi', 'Q', 'L/dk'], ['Hız', 'v', 'm/s'], ['Alan', 'A', 'm² (×10⁶ → mm²)'], ['İç çap', 'D', 'mm']],
      example: {
        given: 'Debi Q = 40 L/dk, hedef hız v = 4 m/s (basınç hattı).',
        steps: [
          '1) Alan: A = 40 / (4 × 60000) = 1,667×10⁻⁴ m² = <strong>166,7 mm²</strong>',
          "2) İç çap: D = √(4 × 166,7 / π) = <span class='result'>14,6 mm → en yakın üst standart ≥ 16 mm</span>",
        ],
      },
      faq: [
        { q: 'Hidrolik hatlarda önerilen hız nedir?', a: 'Emme hattı 0,5–1,5 m/s, basınç hattı 3–6 m/s, dönüş hattı 2–4 m/s aralığında tutulur.' },
        { q: 'Hız çok yüksek olursa ne olur?', a: 'Basınç kaybı, türbülans, ısınma ve gürültü artar. Bu yüzden çapı bir üst standarda yuvarlamak iyidir.' },
        { q: 'Çapı neden yukarı yuvarlarız?', a: 'Hesaplanan çap ara bir değer çıkar; en yakın büyük standart çap seçilerek hız güvenli tarafta (biraz düşük) tutulur.' },
      ],
      howto: [{ name: 'Alanı bul', text: 'A = Q / (v × 60000)' }, { name: 'Çapı bul', text: 'D = √(4A/π) × 1000' }],
      ctaTop: CTA_TR_TOP, ctaBottom: CTA_TR_BOT,
    },
    en: {
      title: 'Pipe Diameter & Flow Velocity Calculation | Hydraulic — Hidroteknik',
      desc: 'How to calculate pipe diameter and flow velocity for hydraulic lines. Formula, recommended velocity table, units and a worked example.',
      keywords: 'pipe diameter calculation, flow velocity calculation, hydraulic line velocity, pipe inner diameter, recommended flow velocities',
      h1: 'Pipe Diameter & Flow Velocity Calculation', crumb: 'Pipe Diameter & Velocity',
      lead: 'The right pipe diameter keeps flow velocity within the recommended range. Too high causes pressure loss and heating; too low means unnecessary cost.',
      formulaTitle: 'Formula',
      formulas: [
        { label: 'Flow velocity', html: 'v = Q / (A × 60000)', note: 'Q: L/min, A: m², v: m/s' },
        { label: 'Required inner diameter', html: 'D = √(4 × A / π) × 1000', note: 'A = Q / (v × 60000)  [m²],  D: mm' },
        { label: 'Recommended velocities', html: 'Suction: 0.5–1.5 · Pressure: 3–6 · Return: 2–4 m/s' },
      ],
      units: [['Flow', 'Q', 'L/min'], ['Velocity', 'v', 'm/s'], ['Area', 'A', 'm² (×10⁶ → mm²)'], ['Inner diameter', 'D', 'mm']],
      example: {
        given: 'Flow Q = 40 L/min, target velocity v = 4 m/s (pressure line).',
        steps: [
          '1) Area: A = 40 / (4 × 60000) = 1.667×10⁻⁴ m² = <strong>166.7 mm²</strong>',
          "2) Inner diameter: D = √(4 × 166.7 / π) = <span class='result'>14.6 mm → nearest larger standard ≥ 16 mm</span>",
        ],
      },
      faq: [
        { q: 'What are the recommended hydraulic line velocities?', a: 'Suction line 0.5–1.5 m/s, pressure line 3–6 m/s, return line 2–4 m/s.' },
        { q: 'What happens if velocity is too high?', a: 'Pressure loss, turbulence, heating and noise increase. That is why the diameter is usually rounded up to the next standard.' },
        { q: 'Why round the diameter up?', a: 'The computed diameter is an in-between value; choosing the nearest larger standard keeps velocity on the safe (slightly lower) side.' },
      ],
      howto: [{ name: 'Find area', text: 'A = Q / (v × 60000)' }, { name: 'Find diameter', text: 'D = √(4A/π) × 1000' }],
      ctaTop: CTA_EN_TOP, ctaBottom: CTA_EN_BOT,
    },
  },

  // 6 — Pneumatic cylinder air consumption
  {
    trSlug: 'pnomatik-silindir-hava-tuketimi',
    enSlug: 'pneumatic-cylinder-air-consumption',
    tr: {
      title: 'Pnömatik Silindir Hava Tüketimi Hesaplama — Hidroteknik',
      desc: 'Pnömatik silindir hava tüketimi nasıl hesaplanır? Sıkışma oranı, serbest hava debisi (NL/dk), birimler ve çözümlü örnek.',
      keywords: 'pnömatik silindir hava tüketimi, hava debisi hesaplama, sıkışma oranı, serbest hava, pnömatik hesaplama',
      h1: 'Pnömatik Silindir Hava Tüketimi Hesaplama', crumb: 'Pnömatik Hava Tüketimi',
      lead: 'Pnömatik bir silindirin hava tüketimi; piston hacmine, çalışma basıncına (sıkışma oranı) ve çevrim sayısına bağlıdır. Sonuç normal (serbest) litre cinsinden verilir.',
      formulaTitle: 'Formül',
      formulas: [
        { label: 'Sıkışma oranı', html: 'r = (P + 1,013) / 1,013', note: 'P: çalışma basıncı (bar, gösterge)' },
        { label: 'Debi (git-gel)', html: 'Q ≈ 2 × A × s × n × r', note: 'A: piston alanı, s: strok, n: çevrim/dk → serbest hava (NL/dk)' },
      ],
      units: [['Çap', 'D', 'mm'], ['Strok', 's', 'mm'], ['Basınç', 'P', 'bar (gösterge)'], ['Çevrim', 'n', '1/dk'], ['Debi', 'Q', 'NL/dk']],
      example: {
        given: 'Çap D = 50 mm, strok s = 200 mm, basınç P = 6 bar, çevrim n = 30 /dk.',
        steps: [
          '1) Piston alanı: A = π × 50² / 4 = 1963 mm² = 19,63 cm²',
          '2) Sıkışma oranı: r = (6 + 1,013) / 1,013 = 6,92',
          '3) Tek strok serbest hava: 19,63 × 20 × 6,92 / 1000 = 2,72 NL',
          "4) Debi (git-gel × çevrim): 2 × 2,72 × 30 = <span class='result'>≈ 163 NL/dk</span>",
        ],
      },
      faq: [
        { q: 'Serbest hava (NL) ne demek?', a: 'Normal litre; havanın atmosfer basıncındaki (1,013 bar) hacmidir. Kompresör kapasitesi de bu birimle karşılaştırılır.' },
        { q: 'Sıkışma oranı nedir?', a: 'Çalışma basıncındaki havanın atmosfere göre kaç kat sıkıştığıdır: r = (P+1,013)/1,013. 6 bar için ≈ 6,9.' },
        { q: 'Mil hacmi ihmal edilir mi?', a: 'Pratik hesapta çoğunlukla ihmal edilir; hassas hesapta çekme strokunda mil kesiti düşülür.' },
      ],
      howto: [{ name: 'Sıkışma oranı', text: 'r = (P + 1,013) / 1,013' }, { name: 'Debi', text: 'Q ≈ 2 × A × s × n × r' }],
      ctaTop: CTA_TR_TOP, ctaBottom: CTA_TR_BOT,
    },
    en: {
      title: 'Pneumatic Cylinder Air Consumption Calculation — Hidroteknik',
      desc: 'How to calculate pneumatic cylinder air consumption. Compression ratio, free air flow (Nl/min), units and a worked example.',
      keywords: 'pneumatic cylinder air consumption, air flow calculation, compression ratio, free air, pneumatic calculation',
      h1: 'Pneumatic Cylinder Air Consumption Calculation', crumb: 'Pneumatic Air Consumption',
      lead: 'A pneumatic cylinder\'s air consumption depends on the piston volume, the working pressure (compression ratio) and the cycle rate. The result is given in normal (free) litres.',
      formulaTitle: 'Formula',
      formulas: [
        { label: 'Compression ratio', html: 'r = (P + 1.013) / 1.013', note: 'P: working pressure (bar, gauge)' },
        { label: 'Flow (extend + retract)', html: 'Q ≈ 2 × A × s × n × r', note: 'A: piston area, s: stroke, n: cycles/min → free air (Nl/min)' },
      ],
      units: [['Bore', 'D', 'mm'], ['Stroke', 's', 'mm'], ['Pressure', 'P', 'bar (gauge)'], ['Cycles', 'n', '1/min'], ['Flow', 'Q', 'Nl/min']],
      example: {
        given: 'Bore D = 50 mm, stroke s = 200 mm, pressure P = 6 bar, cycles n = 30 /min.',
        steps: [
          '1) Piston area: A = π × 50² / 4 = 1963 mm² = 19.63 cm²',
          '2) Compression ratio: r = (6 + 1.013) / 1.013 = 6.92',
          '3) Free air per stroke: 19.63 × 20 × 6.92 / 1000 = 2.72 Nl',
          "4) Flow (extend+retract × cycles): 2 × 2.72 × 30 = <span class='result'>≈ 163 Nl/min</span>",
        ],
      },
      faq: [
        { q: 'What does free air (Nl) mean?', a: 'Normal litres; the volume of air at atmospheric pressure (1.013 bar). Compressor capacity is compared in the same unit.' },
        { q: 'What is the compression ratio?', a: 'How many times the air at working pressure is compressed relative to atmosphere: r = (P+1.013)/1.013. For 6 bar it is ≈ 6.9.' },
        { q: 'Is the rod volume ignored?', a: 'In practical calculations it is usually ignored; for precise work the rod cross-section is subtracted on the retract stroke.' },
      ],
      howto: [{ name: 'Compression ratio', text: 'r = (P + 1.013) / 1.013' }, { name: 'Flow', text: 'Q ≈ 2 × A × s × n × r' }],
      ctaTop: CTA_EN_TOP, ctaBottom: CTA_EN_BOT,
    },
  },

  // 7 — Buckling load & shaft diameter
  {
    trSlug: 'burkulma-hesabi-mil-capi',
    enSlug: 'buckling-load-shaft-diameter-calculation',
    tr: {
      title: 'Burkulma Hesabı ve Minimum Şaft Çapı | Euler — Hidroteknik',
      desc: 'Basınç altındaki mil/kolon burkulma yükü nasıl hesaplanır? Euler formülü, mesnet katsayıları, birimler ve çözümlü örnek.',
      keywords: 'burkulma hesabı, euler burkulma yükü, kritik burkulma yükü, minimum şaft çapı, mil burkulma, kolon burkulma',
      h1: 'Burkulma Hesabı ve Minimum Şaft Çapı', crumb: 'Burkulma & Şaft Çapı',
      lead: 'Uzun ve ince bir mil eksenel basınç altında, kırılmadan önce yanal olarak <strong>burkulur</strong>. Euler formülü, milin taşıyabileceği kritik yükü verir.',
      formulaTitle: 'Euler Formülü',
      formulas: [
        { label: 'Kritik burkulma yükü', html: 'P<sub>kr</sub> = π² × E × I / (K × L)²' },
        { label: 'Atalet momenti (dolu mil)', html: 'I = π × d⁴ / 64' },
        { label: 'Mesnet katsayısı K', html: 'İki ucu mafsallı: 1 · Ankastre-serbest: 2 · Ankastre-mafsallı: 0,7 · İki ucu ankastre: 0,5' },
      ],
      units: [['Elastisite modülü', 'E', 'N/mm² (çelik ≈ 210.000)'], ['Atalet momenti', 'I', 'mm⁴'], ['Boy', 'L', 'mm'], ['Kritik yük', 'Pkr', 'N']],
      example: {
        given: 'Dolu mil d = 40 mm, boy L = 1000 mm, iki ucu mafsallı (K = 1), E = 210.000 N/mm².',
        steps: [
          '1) Atalet momenti: I = π × 40⁴ / 64 = <strong>125.664 mm⁴</strong>',
          "2) Kritik yük: P<sub>kr</sub> = π² × 210000 × 125664 / (1 × 1000)² = <span class='result'>≈ 260 kN</span>",
          "3) Emniyet katsayısı S = 3,5 → emniyetli yük: <span class='result'>≈ 74 kN</span>",
        ],
      },
      faq: [
        { q: 'Mesnet katsayısı (K) nedir?', a: 'Milin uçlarının nasıl bağlandığını ifade eder. İki ucu mafsallı K=1, ankastre-serbest K=2, ankastre-mafsallı K=0,7, iki ucu ankastre K=0,5. K büyüdükçe burkulma yükü düşer.' },
        { q: 'Emniyet katsayısı ne kadar olmalı?', a: 'Burkulma ani ve tehlikeli olduğu için genelde 3–5 arası emniyet katsayısı seçilir; kritik yük bu katsayıya bölünerek çalışma yükü bulunur.' },
        { q: 'Kısa millerde Euler geçerli mi?', a: 'Hayır. Euler sadece narin (uzun/ince) çubuklarda geçerlidir. Kısa/kalın millerde akma (ezilme) baskındır, farklı kontrol gerekir.' },
      ],
      howto: [{ name: 'Atalet momenti', text: 'I = π × d⁴ / 64' }, { name: 'Kritik yük', text: 'Pkr = π² × E × I / (K × L)²' }],
      ctaTop: CTA_TR_TOP, ctaBottom: CTA_TR_BOT,
    },
    en: {
      title: 'Buckling Load & Minimum Shaft Diameter | Euler — Hidroteknik',
      desc: 'How to calculate the buckling load of a shaft/column under compression. Euler formula, end-fixity factors, units and a worked example.',
      keywords: 'buckling calculation, euler buckling load, critical buckling load, minimum shaft diameter, column buckling, rod buckling',
      h1: 'Buckling Load & Minimum Shaft Diameter', crumb: 'Buckling & Shaft Diameter',
      lead: 'A long, slender shaft under axial compression <strong>buckles</strong> sideways before it crushes. Euler\'s formula gives the critical load the shaft can carry.',
      formulaTitle: 'Euler Formula',
      formulas: [
        { label: 'Critical buckling load', html: 'P<sub>cr</sub> = π² × E × I / (K × L)²' },
        { label: 'Second moment of area (solid shaft)', html: 'I = π × d⁴ / 64' },
        { label: 'End-fixity factor K', html: 'Pinned-pinned: 1 · Fixed-free: 2 · Fixed-pinned: 0.7 · Fixed-fixed: 0.5' },
      ],
      units: [['Elastic modulus', 'E', 'N/mm² (steel ≈ 210,000)'], ['Second moment of area', 'I', 'mm⁴'], ['Length', 'L', 'mm'], ['Critical load', 'Pcr', 'N']],
      example: {
        given: 'Solid shaft d = 40 mm, length L = 1000 mm, pinned-pinned (K = 1), E = 210,000 N/mm².',
        steps: [
          '1) Second moment: I = π × 40⁴ / 64 = <strong>125,664 mm⁴</strong>',
          "2) Critical load: P<sub>cr</sub> = π² × 210000 × 125664 / (1 × 1000)² = <span class='result'>≈ 260 kN</span>",
          "3) Safety factor S = 3.5 → allowable load: <span class='result'>≈ 74 kN</span>",
        ],
      },
      faq: [
        { q: 'What is the end-fixity factor (K)?', a: 'It captures how the shaft ends are supported. Pinned-pinned K=1, fixed-free K=2, fixed-pinned K=0.7, fixed-fixed K=0.5. A larger K lowers the buckling load.' },
        { q: 'What safety factor should I use?', a: 'Because buckling is sudden and dangerous, a factor of 3–5 is common; the critical load is divided by this to get the working load.' },
        { q: 'Does Euler apply to short shafts?', a: 'No. Euler applies only to slender (long/thin) members. Short/thick shafts are governed by yielding (crushing) and need a different check.' },
      ],
      howto: [{ name: 'Second moment', text: 'I = π × d⁴ / 64' }, { name: 'Critical load', text: 'Pcr = π² × E × I / (K × L)²' }],
      ctaTop: CTA_EN_TOP, ctaBottom: CTA_EN_BOT,
    },
  },

  // 8 — Pipe & rod weight
  {
    trSlug: 'boru-mil-agirligi-hesaplama',
    enSlug: 'pipe-rod-weight-calculation',
    tr: {
      title: 'Boru ve Mil Ağırlığı Hesaplama | kg/m — Hidroteknik',
      desc: 'Boru ve dolu milin metre başına ağırlığı nasıl hesaplanır? Formül, çelik yoğunluğu, birimler ve çözümlü örnek.',
      keywords: 'boru ağırlığı hesaplama, mil ağırlığı hesaplama, kg/m hesabı, çelik boru ağırlığı, metre ağırlık',
      h1: 'Boru ve Mil Ağırlığı Hesaplama', crumb: 'Boru & Mil Ağırlığı',
      lead: 'Bir çubuğun ağırlığı, kesit alanı ile boyunun ve malzeme yoğunluğunun çarpımıdır. Dolu milde tam kesit, boruda halka kesit kullanılır.',
      formulaTitle: 'Ağırlık Formülü',
      formulas: [
        { label: 'Kütle', html: 'm = ρ × A × L' },
        { label: 'Dolu mil kesiti', html: 'A = π × d² / 4' },
        { label: 'Boru kesiti', html: 'A = π × (D² − d²) / 4', note: 'D: dış çap, d: iç çap. Çelik yoğunluğu ρ ≈ 7,85 kg/dm³.' },
      ],
      units: [['Yoğunluk', 'ρ', 'kg/dm³ (çelik 7,85)'], ['Çap', 'D, d', 'mm'], ['Boy', 'L', 'm'], ['Kütle', 'm', 'kg']],
      example: {
        given: 'Çelik dolu mil Ø40 mm ve çelik boru Ø60/Ø50 mm için metre ağırlığı.',
        steps: [
          "1) Dolu mil Ø40: A = π×40²/4 = 12,57 cm² → m = <span class='result'>9,86 kg/m</span>",
          "2) Boru Ø60/Ø50: A = π×(60²−50²)/4 = 8,64 cm² → m = <span class='result'>6,78 kg/m</span>",
        ],
      },
      faq: [
        { q: 'Çelik yoğunluğu kaçtır?', a: 'Yaklaşık 7,85 kg/dm³ (7850 kg/m³). Alüminyum ≈ 2,70; paslanmaz çelik ≈ 8,00 kg/dm³.' },
        { q: 'Boru ile dolu mil farkı nedir?', a: 'Dolu milde tam daire kesiti (π×d²/4), boruda ise iç boşluğu çıkardığımız halka kesit (π×(D²−d²)/4) kullanılır.' },
        { q: 'Toplam ağırlığı nasıl bulurum?', a: 'Metre ağırlığını (kg/m) parçanın boyu (m) ile çarparsınız.' },
      ],
      howto: [{ name: 'Kesiti bul', text: 'Dolu: π×d²/4 · Boru: π×(D²−d²)/4' }, { name: 'Kütleyi hesapla', text: 'm = ρ × A × L' }],
      ctaTop: CTA_TR_TOP, ctaBottom: CTA_TR_BOT,
    },
    en: {
      title: 'Pipe & Rod Weight Calculation | kg/m — Hidroteknik',
      desc: 'How to calculate the weight per metre of pipe and solid rod. Formula, steel density, units and a worked example.',
      keywords: 'pipe weight calculation, rod weight calculation, kg/m calculation, steel pipe weight, weight per metre',
      h1: 'Pipe & Rod Weight Calculation', crumb: 'Pipe & Rod Weight',
      lead: 'The weight of a bar is its cross-sectional area times its length and material density. A solid rod uses the full section; a pipe uses the annular section.',
      formulaTitle: 'Weight Formula',
      formulas: [
        { label: 'Mass', html: 'm = ρ × A × L' },
        { label: 'Solid rod section', html: 'A = π × d² / 4' },
        { label: 'Pipe section', html: 'A = π × (D² − d²) / 4', note: 'D: outer diameter, d: inner diameter. Steel density ρ ≈ 7.85 kg/dm³.' },
      ],
      units: [['Density', 'ρ', 'kg/dm³ (steel 7.85)'], ['Diameter', 'D, d', 'mm'], ['Length', 'L', 'm'], ['Mass', 'm', 'kg']],
      example: {
        given: 'Weight per metre for a steel solid rod Ø40 mm and a steel pipe Ø60/Ø50 mm.',
        steps: [
          "1) Solid rod Ø40: A = π×40²/4 = 12.57 cm² → m = <span class='result'>9.86 kg/m</span>",
          "2) Pipe Ø60/Ø50: A = π×(60²−50²)/4 = 8.64 cm² → m = <span class='result'>6.78 kg/m</span>",
        ],
      },
      faq: [
        { q: 'What is the density of steel?', a: 'About 7.85 kg/dm³ (7850 kg/m³). Aluminium ≈ 2.70; stainless steel ≈ 8.00 kg/dm³.' },
        { q: 'What is the difference between pipe and solid rod?', a: 'A solid rod uses the full circular section (π×d²/4); a pipe uses the annular section with the bore removed (π×(D²−d²)/4).' },
        { q: 'How do I get the total weight?', a: 'Multiply the weight per metre (kg/m) by the length of the part (m).' },
      ],
      howto: [{ name: 'Find the section', text: 'Solid: π×d²/4 · Pipe: π×(D²−d²)/4' }, { name: 'Compute mass', text: 'm = ρ × A × L' }],
      ctaTop: CTA_EN_TOP, ctaBottom: CTA_EN_BOT,
    },
  },

  // 9 — Thread pitch / identification
  {
    trSlug: 'dis-adimi-olcusu-tanimlama',
    enSlug: 'thread-pitch-size-identification',
    tr: {
      title: 'Diş Adımı ve Ölçüsü Tanımlama | Metrik, BSP, NPT — Hidroteknik',
      desc: 'Bir dişin ölçüsü ve adımı nasıl bulunur? Büyük çap ve adım ölçümü, metrik/BSP/NPT ayrımı ve pratik örnek.',
      keywords: 'diş adımı ölçme, diş ölçüsü tanımlama, metrik diş, bsp npt farkı, diş tanımlama, vida ölçüsü',
      h1: 'Diş Adımı ve Ölçüsü Tanımlama', crumb: 'Diş Adımı Tanımlama',
      lead: 'Bilinmeyen bir dişi tanımlamak için iki ölçü yeterlidir: <strong>büyük çap</strong> (kumpasla) ve <strong>adım</strong> (diş tarağı ile). Bu ikisi standart tablolarla eşleştirilir.',
      formulaTitle: 'Temel İlişki',
      formulas: [
        { label: 'Metrik diş (60°) diş dibi çapı', html: 'd<sub>dip</sub> ≈ D − 1,0825 × P' },
        { label: 'İnç dişte adım', html: 'P = 25,4 / (inç başına diş sayısı)', note: 'D: büyük çap (mm), P: adım (mm)' },
      ],
      units: [['Büyük çap', 'D', 'mm'], ['Adım', 'P', 'mm'], ['Diş sayısı', 'TPI', 'inç başına diş']],
      example: {
        given: 'Kumpasla dış çap ≈ 20,0 mm ölçüldü, diş tarağı adımı P = 2,5 mm gösterdi.',
        steps: [
          "1) 20 mm + 2,5 mm adım → standart eşleşme: <span class='result'>M20 × 2,5 (metrik kaba diş)</span>",
          '2) Diş dibi çapı ≈ 20 − 1,0825×2,5 = 17,3 mm (kontrol için)',
        ],
      },
      faq: [
        { q: 'Adımı nasıl ölçerim?', a: 'En kolayı diş tarağı (pitch gauge) ile: dişe uyan lamayı bulursunuz, üzerinde adım (mm) veya TPI yazar. Alternatif olarak 10 diş arasını ölçüp 10\'a bölersiniz.' },
        { q: 'Metrik mi inç mi olduğunu nasıl anlarım?', a: 'Adım mm cinsinden tam/yuvarlak değerse (1,5; 2; 2,5) genelde metriktir. Adım "inç başına diş" (ör. 19 TPI) olarak oturuyorsa BSP/NPT/UN dişidir.' },
        { q: 'BSP ile NPT farkı nedir?', a: 'BSP silindirik veya konik olabilir ve 55° diş açısına sahiptir; NPT konik ve 60°\'dir. Karıştırılırsa sızdırma yapar.' },
      ],
      howto: [{ name: 'Büyük çapı ölç', text: 'Kumpasla dış çap (mm)' }, { name: 'Adımı ölç', text: 'Diş tarağı ile P (mm) veya TPI' }, { name: 'Tabloyla eşleştir', text: 'Metrik / BSP / NPT / UN' }],
      ctaTop: CTA_TR_TOP, ctaBottom: CTA_TR_BOT,
    },
    en: {
      title: 'Thread Pitch & Size Identification | Metric, BSP, NPT — Hidroteknik',
      desc: 'How to identify a thread\'s size and pitch. Measuring major diameter and pitch, telling metric/BSP/NPT apart, and a practical example.',
      keywords: 'thread pitch measurement, thread size identification, metric thread, bsp vs npt, thread identification, screw size',
      h1: 'Thread Pitch & Size Identification', crumb: 'Thread Identification',
      lead: 'Two measurements are enough to identify an unknown thread: the <strong>major diameter</strong> (with calipers) and the <strong>pitch</strong> (with a pitch gauge). These are matched against standard tables.',
      formulaTitle: 'Basic Relationship',
      formulas: [
        { label: 'Metric (60°) minor diameter', html: 'd<sub>minor</sub> ≈ D − 1.0825 × P' },
        { label: 'Pitch of an inch thread', html: 'P = 25.4 / (threads per inch)', note: 'D: major diameter (mm), P: pitch (mm)' },
      ],
      units: [['Major diameter', 'D', 'mm'], ['Pitch', 'P', 'mm'], ['Thread count', 'TPI', 'threads per inch']],
      example: {
        given: 'Calipers read an outer diameter ≈ 20.0 mm; the pitch gauge shows P = 2.5 mm.',
        steps: [
          "1) 20 mm + 2.5 mm pitch → standard match: <span class='result'>M20 × 2.5 (metric coarse)</span>",
          '2) Minor diameter ≈ 20 − 1.0825×2.5 = 17.3 mm (as a check)',
        ],
      },
      faq: [
        { q: 'How do I measure the pitch?', a: 'The easiest way is a pitch (thread) gauge: find the blade that fits, and it is stamped with the pitch (mm) or TPI. Alternatively, measure across 10 threads and divide by 10.' },
        { q: 'How do I tell metric from inch?', a: 'If the pitch is a round mm value (1.5, 2, 2.5) it is usually metric. If it fits a "threads per inch" value (e.g. 19 TPI) it is a BSP/NPT/UN thread.' },
        { q: 'What is the difference between BSP and NPT?', a: 'BSP can be parallel or tapered and has a 55° thread angle; NPT is tapered and 60°. Mixing them causes leaks.' },
      ],
      howto: [{ name: 'Measure major diameter', text: 'Outer diameter with calipers (mm)' }, { name: 'Measure pitch', text: 'Pitch gauge: P (mm) or TPI' }, { name: 'Match to table', text: 'Metric / BSP / NPT / UN' }],
      ctaTop: CTA_EN_TOP, ctaBottom: CTA_EN_BOT,
    },
  },

  // 10 — Pressure unit conversion
  {
    trSlug: 'basinc-birimi-donusturme-bar-psi',
    enSlug: 'pressure-unit-conversion-bar-psi',
    tr: {
      title: 'Basınç Birimi Dönüştürme | bar, psi, MPa, kgf/cm² — Hidroteknik',
      desc: 'bar, psi, MPa, kPa ve kgf/cm² arasında basınç dönüştürme. Dönüşüm katsayıları tablosu ve çözümlü örnekler.',
      keywords: 'bar psi çevirme, basınç birimi dönüştürme, bar mpa, kgf/cm2 bar, psi bar hesaplama, basınç çevirici',
      h1: 'Basınç Birimi Dönüştürme (bar · psi · MPa)', crumb: 'Basınç Dönüştürme',
      lead: 'Hidrolikte basınç bar, psi, MPa ve kgf/cm² olarak karşımıza çıkar. Aşağıdaki katsayılarla hepsini birbirine çevirebilirsiniz.',
      formulaTitle: 'Dönüşüm Katsayıları (1 bar)',
      formulas: [
        { html: '1 bar = 100.000 Pa = 100 kPa = <b>0,1 MPa</b>' },
        { html: '1 bar = <b>14,5038 psi</b>' },
        { html: '1 bar = <b>1,01972 kgf/cm²</b> ≈ 0,987 atm' },
      ],
      units: [['bar', '→ psi', '× 14,5038'], ['psi', '→ bar', '÷ 14,5038'], ['bar', '→ MPa', '× 0,1'], ['bar', '→ kgf/cm²', '× 1,0197']],
      example: {
        given: 'Sık kullanılan iki dönüşüm.',
        steps: [
          "1) 250 bar kaç psi? → 250 × 14,5038 = <span class='result'>3.626 psi</span>",
          "2) 3000 psi kaç bar? → 3000 ÷ 14,5038 = <span class='result'>206,8 bar</span>",
          '3) 250 bar = 25 MPa = 254,9 kgf/cm²',
        ],
      },
      faq: [
        { q: 'bar ile psi arasındaki oran nedir?', a: '1 bar = 14,5038 psi. bar\'dan psi\'ye çarparak, psi\'den bar\'a bölerek geçilir.' },
        { q: 'bar ile MPa ilişkisi?', a: '1 bar = 0,1 MPa. Yani 10 bar = 1 MPa. MPa, SI birimidir ve mühendislik hesaplarında sık kullanılır.' },
        { q: 'kgf/cm² neredeyse bar mı?', a: 'Evet, çok yakındır: 1 bar = 1,0197 kgf/cm². Pratikte çoğu zaman eşit kabul edilir ama hassas hesapta katsayı kullanılmalıdır.' },
      ],
      howto: [{ name: 'bar → psi', text: '× 14,5038' }, { name: 'bar → MPa', text: '× 0,1' }, { name: 'bar → kgf/cm²', text: '× 1,0197' }],
      ctaTop: CTA_TR_TOP, ctaBottom: CTA_TR_BOT,
    },
    en: {
      title: 'Pressure Unit Conversion | bar, psi, MPa, kgf/cm² — Hidroteknik',
      desc: 'Convert pressure between bar, psi, MPa, kPa and kgf/cm². Conversion factor table and worked examples.',
      keywords: 'bar to psi, pressure unit conversion, bar to mpa, kgf/cm2 to bar, psi to bar, pressure converter',
      h1: 'Pressure Unit Conversion (bar · psi · MPa)', crumb: 'Pressure Conversion',
      lead: 'In hydraulics, pressure appears as bar, psi, MPa and kgf/cm². The factors below let you convert between all of them.',
      formulaTitle: 'Conversion Factors (1 bar)',
      formulas: [
        { html: '1 bar = 100,000 Pa = 100 kPa = <b>0.1 MPa</b>' },
        { html: '1 bar = <b>14.5038 psi</b>' },
        { html: '1 bar = <b>1.01972 kgf/cm²</b> ≈ 0.987 atm' },
      ],
      units: [['bar', '→ psi', '× 14.5038'], ['psi', '→ bar', '÷ 14.5038'], ['bar', '→ MPa', '× 0.1'], ['bar', '→ kgf/cm²', '× 1.0197']],
      example: {
        given: 'Two common conversions.',
        steps: [
          "1) 250 bar in psi → 250 × 14.5038 = <span class='result'>3,626 psi</span>",
          "2) 3000 psi in bar → 3000 ÷ 14.5038 = <span class='result'>206.8 bar</span>",
          '3) 250 bar = 25 MPa = 254.9 kgf/cm²',
        ],
      },
      faq: [
        { q: 'What is the ratio between bar and psi?', a: '1 bar = 14.5038 psi. Multiply to go from bar to psi, divide to go from psi to bar.' },
        { q: 'How does bar relate to MPa?', a: '1 bar = 0.1 MPa, so 10 bar = 1 MPa. MPa is the SI unit and is common in engineering calculations.' },
        { q: 'Is kgf/cm² almost the same as bar?', a: 'Yes, very close: 1 bar = 1.0197 kgf/cm². In practice they are often treated as equal, but a precise calculation should use the factor.' },
      ],
      howto: [{ name: 'bar → psi', text: '× 14.5038' }, { name: 'bar → MPa', text: '× 0.1' }, { name: 'bar → kgf/cm²', text: '× 1.0197' }],
      ctaTop: CTA_EN_TOP, ctaBottom: CTA_EN_BOT,
    },
  },

  // 11 — Gear pump selection
  {
    trSlug: 'disli-pompa-secimi',
    enSlug: 'gear-pump-selection',
    tr: {
      title: 'Dişli Pompa Seçimi | Deplasman Hesabı — Hidroteknik',
      desc: 'İhtiyaca göre dişli pompa nasıl seçilir? Gerekli deplasman formülü, devir ve basınç sınıfı, çözümlü örnek.',
      keywords: 'dişli pompa seçimi, pompa deplasman hesabı, dişli pompa hesaplama, pompa seçim kriterleri, hidrolik pompa seçimi',
      h1: 'Dişli Pompa Seçimi', crumb: 'Dişli Pompa Seçimi',
      lead: 'Doğru dişli pompayı seçmek için üç şeyi bilmelisiniz: gerekli <strong>debi</strong>, motor <strong>devri</strong> ve çalışma <strong>basıncı</strong>. Bunlardan gerekli deplasman hesaplanır.',
      formulaTitle: 'Gerekli Deplasman',
      formulas: [
        { html: 'V<sub>g</sub> = Q × 1000 / (n × η<sub>v</sub>)', note: 'Q: gerekli debi (L/dk), n: devir (rpm), η<sub>v</sub>: volumetrik verim (≈0,90–0,95), V<sub>g</sub>: cc/dev' },
      ],
      units: [['Debi', 'Q', 'L/dk'], ['Devir', 'n', 'rpm'], ['Volumetrik verim', 'ηv', '– (0,90–0,95)'], ['Deplasman', 'Vg', 'cc/dev']],
      example: {
        given: 'Gerekli debi Q = 40 L/dk, motor devri n = 1450 rpm, volumetrik verim ηv = 0,92.',
        steps: [
          "1) Deplasman: Vg = 40 × 1000 / (1450 × 0,92) = <span class='result'>≈ 30 cc/dev</span>",
          '2) En yakın standart deplasmanı seç (ör. 30 cc/dev)',
          '3) Pompanın basınç sınıfının çalışma basıncını karşıladığını doğrula',
        ],
      },
      faq: [
        { q: 'Pompa deplasmanı nasıl seçilir?', a: 'Gerekli debi ve devirden Vg = Q×1000/(n×ηv) ile hesaplanır, sonra en yakın büyük standart deplasman seçilir.' },
        { q: 'Basınç sınıfı neden önemli?', a: 'Her pompanın maksimum sürekli/aralıklı çalışma basıncı vardır. Sisteminizin basıncı bu sınırın altında kalmalıdır.' },
        { q: 'Devir pompayı nasıl etkiler?', a: 'Debi devirle doğru orantılıdır. Aynı deplasmanlı pompa daha yüksek devirde daha çok debi verir, ama üretici min/max devir sınırlarına uyulmalıdır.' },
      ],
      howto: [{ name: 'Deplasmanı hesapla', text: 'Vg = Q × 1000 / (n × ηv)' }, { name: 'Standart seç', text: 'En yakın büyük deplasman' }, { name: 'Basıncı doğrula', text: 'Pompa basınç sınıfı ≥ sistem basıncı' }],
      ctaTop: CTA_TR_TOP, ctaBottom: CTA_TR_BOT,
    },
    en: {
      title: 'Gear Pump Selection | Displacement Calculation — Hidroteknik',
      desc: 'How to select a gear pump for your needs. Required displacement formula, speed and pressure class, and a worked example.',
      keywords: 'gear pump selection, pump displacement calculation, gear pump sizing, pump selection criteria, hydraulic pump selection',
      h1: 'Gear Pump Selection', crumb: 'Gear Pump Selection',
      lead: 'To pick the right gear pump you need three things: the required <strong>flow</strong>, the motor <strong>speed</strong>, and the working <strong>pressure</strong>. From these the required displacement is found.',
      formulaTitle: 'Required Displacement',
      formulas: [
        { html: 'V<sub>g</sub> = Q × 1000 / (n × η<sub>v</sub>)', note: 'Q: required flow (L/min), n: speed (rpm), η<sub>v</sub>: volumetric efficiency (≈0.90–0.95), V<sub>g</sub>: cc/rev' },
      ],
      units: [['Flow', 'Q', 'L/min'], ['Speed', 'n', 'rpm'], ['Volumetric efficiency', 'ηv', '– (0.90–0.95)'], ['Displacement', 'Vg', 'cc/rev']],
      example: {
        given: 'Required flow Q = 40 L/min, motor speed n = 1450 rpm, volumetric efficiency ηv = 0.92.',
        steps: [
          "1) Displacement: Vg = 40 × 1000 / (1450 × 0.92) = <span class='result'>≈ 30 cc/rev</span>",
          '2) Choose the nearest standard displacement (e.g. 30 cc/rev)',
          '3) Verify the pump\'s pressure class covers the working pressure',
        ],
      },
      faq: [
        { q: 'How is pump displacement selected?', a: 'From the required flow and speed via Vg = Q×1000/(n×ηv), then round up to the nearest standard displacement.' },
        { q: 'Why does the pressure class matter?', a: 'Every pump has a maximum continuous/intermittent working pressure. Your system pressure must stay below that limit.' },
        { q: 'How does speed affect the pump?', a: 'Flow is proportional to speed. The same displacement gives more flow at higher rpm, but you must respect the manufacturer\'s min/max speed limits.' },
      ],
      howto: [{ name: 'Compute displacement', text: 'Vg = Q × 1000 / (n × ηv)' }, { name: 'Pick a standard', text: 'Nearest larger displacement' }, { name: 'Verify pressure', text: 'Pump class ≥ system pressure' }],
      ctaTop: CTA_EN_TOP, ctaBottom: CTA_EN_BOT,
    },
  },

  // 12 — Hydraulic power unit sizing
  {
    trSlug: 'hidrolik-guc-unitesi-boyutlandirma',
    enSlug: 'hydraulic-power-unit-sizing',
    tr: {
      title: 'Hidrolik Güç Ünitesi Boyutlandırma | Power Pack — Hidroteknik',
      desc: 'Hidrolik güç ünitesi (power pack) nasıl boyutlandırılır? Motor gücü, pompa deplasmanı ve tank hacmi formülleri ile çözümlü örnek.',
      keywords: 'hidrolik güç ünitesi, power pack boyutlandırma, hidrolik ünite hesabı, tank hacmi hesabı, elektrik motoru gücü hidrolik',
      h1: 'Hidrolik Güç Ünitesi Boyutlandırma', crumb: 'Güç Ünitesi Boyutlandırma',
      lead: 'Bir hidrolik güç ünitesi; pompa, elektrik motoru ve tanktan oluşur. Debi ve basınç hedefinden motor gücü, pompa deplasmanı ve tank hacmi belirlenir.',
      formulaTitle: 'Boyutlandırma Formülleri',
      formulas: [
        { label: 'Elektrik motoru gücü', html: 'P (kW) = p (bar) × Q (L/dk) / (600 × η)', note: 'η: toplam verim ≈ 0,85' },
        { label: 'Pompa deplasmanı', html: 'V<sub>g</sub> = Q × 1000 / n' },
        { label: 'Tank hacmi', html: 'V<sub>tank</sub> ≈ 3–5 × Q' },
      ],
      units: [['Debi', 'Q', 'L/dk'], ['Basınç', 'p', 'bar'], ['Devir', 'n', 'rpm'], ['Güç', 'P', 'kW'], ['Tank', 'Vtank', 'L']],
      example: {
        given: 'Debi Q = 30 L/dk, basınç p = 180 bar, motor devri n = 1450 rpm, verim η = 0,85.',
        steps: [
          "1) Motor gücü: P = 180 × 30 / (600 × 0,85) = 10,6 kW → <span class='result'>11 kW standart motor</span>",
          "2) Pompa deplasmanı: Vg = 30 × 1000 / 1450 = <span class='result'>≈ 20,7 cc/dev</span>",
          "3) Tank hacmi: 3 × 30 = <span class='result'>≈ 90 L</span>",
        ],
      },
      faq: [
        { q: 'Tank neden debinin 3–5 katı seçilir?', a: 'Yağın soğuması, havadan/su buharından arınması ve dinlenmesi için zaman gerekir. 3–5 katı hacim, ısı dengesi ve köpük ayrışması için yeterli bekleme sağlar.' },
        { q: 'Motor gücünü neden verime böleriz?', a: 'Hidrolik güç teorik değerdir; pompadaki kayıplar nedeniyle elektrik motorunun bundan fazlasını vermesi gerekir. η≈0,85 bunu hesaba katar.' },
        { q: 'Motoru bir üst standarda mı seçmeliyim?', a: 'Evet. Hesaplanan gücün üzerindeki en yakın standart motor (ör. 10,6 kW → 11 kW) seçilir; sürekli tam yükte çalışmada emniyet payı bırakılır.' },
      ],
      howto: [{ name: 'Motor gücü', text: 'P = p × Q / (600 × η)' }, { name: 'Pompa deplasmanı', text: 'Vg = Q × 1000 / n' }, { name: 'Tank hacmi', text: '3–5 × Q' }],
      ctaTop: CTA_TR_TOP, ctaBottom: CTA_TR_BOT,
    },
    en: {
      title: 'Hydraulic Power Unit Sizing | Power Pack — Hidroteknik',
      desc: 'How to size a hydraulic power unit (power pack). Motor power, pump displacement and tank volume formulas with a worked example.',
      keywords: 'hydraulic power unit, power pack sizing, hydraulic unit calculation, tank volume calculation, electric motor power hydraulic',
      h1: 'Hydraulic Power Unit Sizing', crumb: 'Power Unit Sizing',
      lead: 'A hydraulic power unit consists of a pump, an electric motor and a tank. From the target flow and pressure you determine the motor power, pump displacement and tank volume.',
      formulaTitle: 'Sizing Formulas',
      formulas: [
        { label: 'Electric motor power', html: 'P (kW) = p (bar) × Q (L/min) / (600 × η)', note: 'η: overall efficiency ≈ 0.85' },
        { label: 'Pump displacement', html: 'V<sub>g</sub> = Q × 1000 / n' },
        { label: 'Tank volume', html: 'V<sub>tank</sub> ≈ 3–5 × Q' },
      ],
      units: [['Flow', 'Q', 'L/min'], ['Pressure', 'p', 'bar'], ['Speed', 'n', 'rpm'], ['Power', 'P', 'kW'], ['Tank', 'Vtank', 'L']],
      example: {
        given: 'Flow Q = 30 L/min, pressure p = 180 bar, motor speed n = 1450 rpm, efficiency η = 0.85.',
        steps: [
          "1) Motor power: P = 180 × 30 / (600 × 0.85) = 10.6 kW → <span class='result'>11 kW standard motor</span>",
          "2) Pump displacement: Vg = 30 × 1000 / 1450 = <span class='result'>≈ 20.7 cc/rev</span>",
          "3) Tank volume: 3 × 30 = <span class='result'>≈ 90 L</span>",
        ],
      },
      faq: [
        { q: 'Why is the tank 3–5× the flow?', a: 'The oil needs time to cool, release air/moisture and settle. A volume of 3–5× the flow gives enough dwell time for heat balance and foam separation.' },
        { q: 'Why divide motor power by efficiency?', a: 'Hydraulic power is the theoretical value; because of pump losses the electric motor must supply more. η≈0.85 accounts for this.' },
        { q: 'Should I pick the next standard motor up?', a: 'Yes. Choose the nearest standard motor above the calculated power (e.g. 10.6 kW → 11 kW) to leave a safety margin for continuous full-load operation.' },
      ],
      howto: [{ name: 'Motor power', text: 'P = p × Q / (600 × η)' }, { name: 'Pump displacement', text: 'Vg = Q × 1000 / n' }, { name: 'Tank volume', text: '3–5 × Q' }],
      ctaTop: CTA_EN_TOP, ctaBottom: CTA_EN_BOT,
    },
  },
];
