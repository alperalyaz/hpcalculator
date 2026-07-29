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
];
