/*
 * Static SEO guide generator.
 * Produces content-rich, crawlable HTML pages (no JS needed) for each
 * calculation topic in Turkish (/rehber/<slug>/) and English (/guide/<slug>/).
 * Run: node scripts/gen-guides.js
 */
const fs = require('fs');
const path = require('path');

const TR_BASE = 'https://hesapla.hidroteknik.com.tr';
const EN_BASE = 'https://calculate.hidroteknik.com.tr';
const GA = 'G-E5DR9LJ8TF';
const PUBLIC = path.join(__dirname, '..', 'public');

const esc = (s) => String(s).replace(/&(?!amp;|lt;|gt;|quot;)/g, '&amp;');

function page(lang, topic) {
  const isTR = lang === 'tr';
  const c = topic[lang];
  const trUrl = `${TR_BASE}/rehber/${topic.trSlug}/`;
  const enUrl = `${EN_BASE}/guide/${topic.enSlug}/`;
  const selfUrl = isTR ? trUrl : enUrl;
  const calcUrl = isTR ? `${TR_BASE}/` : `${EN_BASE}/`;
  const calcCrumb = isTR ? 'Hesaplayıcı' : 'Calculator';
  const allToolsLabel = isTR ? 'Tüm hesaplama araçları →' : 'All calculation tools →';
  const footerText = isTR
    ? 'Bu rehber <a href="https://www.hidroteknik.com.tr">Hidroteknik A.Ş.</a> tarafından hazırlanmıştır — 40 yılı aşkın süredir hidrolik, pnömatik ve otomasyon çözümleri.'
    : 'This guide is prepared by <a href="https://www.hidroteknik.com.tr">Hidroteknik Inc.</a> — over 40 years of hydraulic, pneumatic and automation solutions.';

  const formulas = c.formulas
    .map((f) => `${f.label ? `<h3>${f.label}</h3>` : ''}<div class="formula">${f.html}</div>${f.note ? `<p><span class="muted">${f.note}</span></p>` : ''}`)
    .join('\n');

  const unitRows = c.units.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('');
  const steps = c.example.steps.map((s) => `<p class="step">${s}</p>`).join('\n');
  const faqHtml = c.faq.map((q) => `<details><summary>${q.q}</summary><p>${q.a}</p></details>`).join('\n');

  const howtoLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: c.h1,
    description: c.desc,
    step: c.howto.map((s) => ({ '@type': 'HowToStep', name: s.name, text: s.text })),
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faq.map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a.replace(/<[^>]+>/g, '') } })),
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA}');
  </script>

  <title>${c.title}</title>
  <meta name="description" content="${esc(c.desc)}" />
  <meta name="keywords" content="${esc(c.keywords)}" />
  <meta name="author" content="Hidroteknik A.Ş." />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="${selfUrl}" />
  <link rel="alternate" hreflang="tr" href="${trUrl}" />
  <link rel="alternate" hreflang="en" href="${enUrl}" />
  <link rel="alternate" hreflang="x-default" href="${trUrl}" />

  <meta property="og:type" content="article" />
  <meta property="og:title" content="${esc(c.h1)}" />
  <meta property="og:description" content="${esc(c.desc)}" />
  <meta property="og:url" content="${selfUrl}" />
  <meta property="og:image" content="${(isTR ? TR_BASE : EN_BASE)}/og-image.jpg" />
  <meta property="og:locale" content="${isTR ? 'tr_TR' : 'en_US'}" />

  <style>
    :root { --bg:#111; --surface:#1b1b1b; --border:#2a2a2a; --text:#f2f2f2; --muted:#9a9a9a; --accent:#F5C400; }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--bg); color:var(--text); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; line-height:1.65; }
    .wrap { max-width:820px; margin:0 auto; padding:24px 20px 64px; }
    header.site { display:flex; align-items:center; gap:12px; padding:16px 0; border-bottom:1px solid var(--border); margin-bottom:24px; }
    header.site img { height:30px; background:#fff; padding:6px 10px; border-radius:8px; }
    nav.crumb { font-size:13px; color:var(--muted); margin-bottom:16px; }
    nav.crumb a { color:var(--muted); text-decoration:none; }
    nav.crumb a:hover { color:var(--accent); }
    h1 { font-size:30px; line-height:1.25; margin:8px 0 16px; }
    h2 { font-size:22px; margin:36px 0 12px; border-left:4px solid var(--accent); padding-left:12px; }
    h3 { font-size:17px; margin:24px 0 8px; color:var(--accent); }
    p { margin:12px 0; }
    a { color:var(--accent); }
    .lead { font-size:18px; color:#e6e6e6; }
    .formula { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:18px 20px; margin:16px 0; font-size:19px; text-align:center; }
    .formula b { color:var(--accent); }
    table { width:100%; border-collapse:collapse; margin:16px 0; background:var(--surface); border-radius:12px; overflow:hidden; }
    th, td { text-align:left; padding:11px 14px; border-bottom:1px solid var(--border); font-size:14px; }
    th { background:#000; color:var(--accent); font-weight:700; }
    .example { background:var(--surface); border:1px solid var(--border); border-left:4px solid var(--accent); border-radius:12px; padding:18px 20px; margin:16px 0; }
    .example .step { margin:8px 0; }
    .result { color:var(--accent); font-weight:800; font-size:18px; }
    .cta { display:block; text-align:center; background:var(--accent); color:#111; font-weight:800; text-decoration:none; padding:16px; border-radius:12px; margin:28px 0; font-size:16px; }
    details { background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:4px 16px; margin:10px 0; }
    summary { cursor:pointer; font-weight:700; padding:12px 0; }
    details p { color:var(--muted); }
    footer { margin-top:48px; padding-top:20px; border-top:1px solid var(--border); font-size:13px; color:var(--muted); }
    footer a { color:var(--accent); }
    .muted { color:var(--muted); font-size:14px; }
  </style>

  <script type="application/ld+json">${JSON.stringify(howtoLd)}</script>
  <script type="application/ld+json">${JSON.stringify(faqLd)}</script>
</head>
<body>
  <div class="wrap">
    <header class="site">
      <img src="/apple-touch-icon.png" alt="Hidroteknik" onerror="this.style.display='none'" />
      <strong>Hidroteknik ${isTR ? 'Hesaplama' : 'Calculators'}</strong>
    </header>

    <nav class="crumb">
      <a href="https://www.hidroteknik.com.tr">Hidroteknik</a> ›
      <a href="${calcUrl}">${calcCrumb}</a> ›
      ${c.crumb}
    </nav>

    <h1>${c.h1}</h1>
    <p class="lead">${c.lead}</p>

    <a class="cta" href="${calcUrl}">${c.ctaTop}</a>

    <h2>${c.formulaTitle}</h2>
    ${formulas}

    <h2>${isTR ? 'Birimler' : 'Units'}</h2>
    <table>
      <tr><th>${isTR ? 'Büyüklük' : 'Quantity'}</th><th>${isTR ? 'Sembol' : 'Symbol'}</th><th>${isTR ? 'Birim' : 'Unit'}</th></tr>
      ${unitRows}
    </table>

    <h2>${isTR ? 'Çözümlü Örnek' : 'Worked Example'}</h2>
    <div class="example">
      <p><strong>${isTR ? 'Verilen:' : 'Given:'}</strong> ${c.example.given}</p>
      ${steps}
    </div>

    <a class="cta" href="${calcUrl}">${c.ctaBottom}</a>

    <h2>${isTR ? 'Sık Sorulan Sorular' : 'Frequently Asked Questions'}</h2>
    ${faqHtml}

    <footer>
      <p>${footerText}</p>
      <p><a href="${calcUrl}">${allToolsLabel}</a></p>
    </footer>
  </div>
</body>
</html>
`;
}

function hubPage(lang, topics) {
  const isTR = lang === 'tr';
  const trUrl = `${TR_BASE}/rehber/`;
  const enUrl = `${EN_BASE}/guide/`;
  const selfUrl = isTR ? trUrl : enUrl;
  const calcUrl = isTR ? `${TR_BASE}/` : `${EN_BASE}/`;
  const t = isTR
    ? {
        title: 'Hidrolik ve Pnömatik Hesaplama Rehberleri — Hidroteknik',
        desc: 'Hidrolik silindir kuvveti, pompa debisi, motor gücü, akümülatör, boru çapı ve pnömatik hava tüketimi için formüller, örnekler ve ücretsiz hesaplayıcılar.',
        keywords: 'hidrolik hesaplama rehberi, pnömatik hesaplama, hidrolik formüller, mühendislik hesaplamaları',
        h1: 'Hidrolik & Pnömatik Hesaplama Rehberleri',
        crumb: 'Rehberler',
        lead: 'Her rehberde konunun formülü, birimleri, çözümlü bir örneği ve ilgili ücretsiz hesaplayıcıyı bulacaksınız.',
        calcCrumb: 'Hesaplayıcı',
        cta: '⚙ Hesaplayıcıyı Aç →',
      }
    : {
        title: 'Hydraulic & Pneumatic Calculation Guides — Hidroteknik',
        desc: 'Formulas, worked examples and free calculators for hydraulic cylinder force, pump flow, motor power, accumulator sizing, pipe diameter and pneumatic air consumption.',
        keywords: 'hydraulic calculation guides, pneumatic calculation, hydraulic formulas, engineering calculations',
        h1: 'Hydraulic & Pneumatic Calculation Guides',
        crumb: 'Guides',
        lead: 'Each guide gives the formula, units, a worked example and the related free calculator.',
        calcCrumb: 'Calculator',
        cta: '⚙ Open the Calculator →',
      };

  const cards = topics
    .map((topic) => {
      const c = topic[lang];
      const href = isTR ? `/rehber/${topic.trSlug}/` : `/guide/${topic.enSlug}/`;
      return `      <a class="card" href="${href}">
        <h2>${c.crumb}</h2>
        <p>${esc(c.desc)}</p>
        <span class="go">${isTR ? 'Rehberi aç →' : 'Open guide →'}</span>
      </a>`;
    })
    .join('\n');

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: topics.map((topic, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: topic[lang].h1,
      url: isTR ? `${TR_BASE}/rehber/${topic.trSlug}/` : `${EN_BASE}/guide/${topic.enSlug}/`,
    })),
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA}');
  </script>

  <title>${t.title}</title>
  <meta name="description" content="${esc(t.desc)}" />
  <meta name="keywords" content="${esc(t.keywords)}" />
  <meta name="author" content="Hidroteknik A.Ş." />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="${selfUrl}" />
  <link rel="alternate" hreflang="tr" href="${trUrl}" />
  <link rel="alternate" hreflang="en" href="${enUrl}" />
  <link rel="alternate" hreflang="x-default" href="${trUrl}" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(t.h1)}" />
  <meta property="og:description" content="${esc(t.desc)}" />
  <meta property="og:url" content="${selfUrl}" />
  <meta property="og:image" content="${(isTR ? TR_BASE : EN_BASE)}/og-image.jpg" />
  <meta property="og:locale" content="${isTR ? 'tr_TR' : 'en_US'}" />

  <style>
    :root { --bg:#111; --surface:#1b1b1b; --border:#2a2a2a; --text:#f2f2f2; --muted:#9a9a9a; --accent:#F5C400; }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--bg); color:var(--text); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; line-height:1.6; }
    .wrap { max-width:900px; margin:0 auto; padding:24px 20px 64px; }
    header.site { display:flex; align-items:center; gap:12px; padding:16px 0; border-bottom:1px solid var(--border); margin-bottom:24px; }
    header.site img { height:30px; background:#fff; padding:6px 10px; border-radius:8px; }
    nav.crumb { font-size:13px; color:var(--muted); margin-bottom:16px; }
    nav.crumb a { color:var(--muted); text-decoration:none; }
    nav.crumb a:hover { color:var(--accent); }
    h1 { font-size:30px; line-height:1.25; margin:8px 0 12px; }
    .lead { font-size:18px; color:#e6e6e6; margin-bottom:8px; }
    .cta { display:inline-block; background:var(--accent); color:#111; font-weight:800; text-decoration:none; padding:12px 20px; border-radius:12px; margin:16px 0 28px; }
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:14px; }
    .card { display:block; background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:18px; text-decoration:none; transition:border-color .15s; }
    .card:hover { border-color:var(--accent); }
    .card h2 { font-size:17px; margin:0 0 8px; color:var(--text); }
    .card p { font-size:13px; color:var(--muted); margin:0 0 12px; line-height:1.5; }
    .card .go { font-size:13px; color:var(--accent); font-weight:700; }
    footer { margin-top:48px; padding-top:20px; border-top:1px solid var(--border); font-size:13px; color:var(--muted); }
    footer a { color:var(--accent); }
  </style>

  <script type="application/ld+json">${JSON.stringify(itemList)}</script>
</head>
<body>
  <div class="wrap">
    <header class="site">
      <img src="/apple-touch-icon.png" alt="Hidroteknik" onerror="this.style.display='none'" />
      <strong>Hidroteknik ${isTR ? 'Hesaplama' : 'Calculators'}</strong>
    </header>

    <nav class="crumb">
      <a href="https://www.hidroteknik.com.tr">Hidroteknik</a> ›
      <a href="${calcUrl}">${t.calcCrumb}</a> ›
      ${t.crumb}
    </nav>

    <h1>${t.h1}</h1>
    <p class="lead">${t.lead}</p>
    <a class="cta" href="${calcUrl}">${t.cta}</a>

    <div class="grid">
${cards}
    </div>

    <footer>
      <p>${isTR
        ? 'Hesaplama araçları ve rehberler <a href="https://www.hidroteknik.com.tr">Hidroteknik A.Ş.</a> tarafından sunulmaktadır.'
        : 'Calculators and guides provided by <a href="https://www.hidroteknik.com.tr">Hidroteknik Inc.</a>'}</p>
    </footer>
  </div>
</body>
</html>
`;
}

const topics = require('./guides-data.js');

let count = 0;
for (const topic of topics) {
  const trDir = path.join(PUBLIC, 'rehber', topic.trSlug);
  const enDir = path.join(PUBLIC, 'guide', topic.enSlug);
  fs.mkdirSync(trDir, { recursive: true });
  fs.mkdirSync(enDir, { recursive: true });
  fs.writeFileSync(path.join(trDir, 'index.html'), page('tr', topic));
  fs.writeFileSync(path.join(enDir, 'index.html'), page('en', topic));
  count += 2;
}

// Hub (index) pages for each language
fs.mkdirSync(path.join(PUBLIC, 'rehber'), { recursive: true });
fs.mkdirSync(path.join(PUBLIC, 'guide'), { recursive: true });
fs.writeFileSync(path.join(PUBLIC, 'rehber', 'index.html'), hubPage('tr', topics));
fs.writeFileSync(path.join(PUBLIC, 'guide', 'index.html'), hubPage('en', topics));
count += 2;

// Regenerate sitemap.xml with all pages + hreflang
const staticUrls = [
  { loc: `${TR_BASE}/`, pri: '1.0', alts: true },
  { loc: `${EN_BASE}/`, pri: '0.9', alts: true },
];
const alt = (tr, en) =>
  `    <xhtml:link rel="alternate" hreflang="tr" href="${tr}"/>\n` +
  `    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>\n` +
  `    <xhtml:link rel="alternate" hreflang="x-default" href="${tr}"/>\n`;

let sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
sm += `  <url>\n    <loc>${TR_BASE}/</loc>\n${alt(TR_BASE + '/', EN_BASE + '/')}    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
sm += `  <url>\n    <loc>${EN_BASE}/</loc>\n${alt(TR_BASE + '/', EN_BASE + '/')}    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
// Guide hub pages
sm += `  <url>\n    <loc>${TR_BASE}/rehber/</loc>\n${alt(TR_BASE + '/rehber/', EN_BASE + '/guide/')}    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
sm += `  <url>\n    <loc>${EN_BASE}/guide/</loc>\n${alt(TR_BASE + '/rehber/', EN_BASE + '/guide/')}    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
for (const topic of topics) {
  const tr = `${TR_BASE}/rehber/${topic.trSlug}/`;
  const en = `${EN_BASE}/guide/${topic.enSlug}/`;
  sm += `  <url>\n    <loc>${tr}</loc>\n${alt(tr, en)}    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  sm += `  <url>\n    <loc>${en}</loc>\n${alt(tr, en)}    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
}
sm += `</urlset>\n`;
fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), sm);

console.log(`Generated ${count} guide pages + sitemap (${topics.length} topics).`);
