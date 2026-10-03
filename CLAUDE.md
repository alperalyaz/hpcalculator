# CLAUDE.md

**Hydraulic & Pneumatic Calculator — Expo (React Native) uygulaması + web sürümü (calculate.hidroteknik.com.tr).**

## 🔴 DEPLOY YALNIZ KULLANICI "DEPLOY" DEYİNCE — İSTİSNA YOK (kullanıcı kararı 2026-10-01)

Kullanıcı: *"sayfa patlasa da çatlasa da ben deploy demeden deploy yapmasın."* Kullanıcının bütün projelerinde geçerli.

- **Deploy** = canlıya kod çıkaran her işlem: canlı dala push, Vercel'de yeniden yayın / öne alma (promote) /
  **geri alma (rollback)**, Supabase Edge Function deploy, Apps Script'e kod gönderme.
- **Canlı kırık olsa da istisna YOK.** "Acil", "daha önce çalışıyordu", "tek satırlık düzeltme" gerekçe değildir.
- **Bir "deploy" = bir yayın.** Yayından sonra çıkan hata için kullanıcıya YENİDEN sorulur. Başka oturumda verilen
  "deploy" bu oturuma izin değildir.
- **Canlı kırıksa boş durma:** düzelt, dene, `bekleyen/<konu>` dalına koy, kullanıcıya TEK mesaj yaz:
  `🔴 CANLI KIRIK: <ne bozuk> — <kimi etkiliyor> — düzeltme hazır (<dal>) — "deploy" dersen canlıya çıkar.`
- **"Deploy edeyim mi?" diye ısrar etme.** İş bitince bittiğini söyle ve bekle; yayını kullanıcı ister.
- Veritabanı işleri (migration, veri düzeltme) bu kuralın konusu değil; onların kendi kuralları geçerli.

## 🗂️ BEKLEYEN DAL — biten iş burada birikir (kullanıcı kararı 2026-10-02)

Kullanıcı: *"bekleyen diye dal yapsın, tüm repolar commitleri orada biriktirsin; ben demeden asla deploy istemiyorum."*

- Biten ve denenmiş iş **`bekleyen/<konu>`** dalına itilir: `git push origin HEAD:bekleyen/<konu>`.
  Her iş KENDİ dalında — aynı anda çalışan oturumlar birbirinin işini ezmesin. Yarım iş konmaz:
  bekleyen dal "hazır, deploy bekliyor" demektir. Aynı dalı güncellerken üstüne yeni commit ekle; düz
  `bekleyen` adlı dal AÇMA (`bekleyen/*` ile çakışır).
- Kendi `claude/...` dalına yedek push serbest. Canlı dala push YOK.
- **Kullanıcı "deploy" deyince:**
  1. Listele: `git ls-remote --heads origin 'refs/heads/bekleyen/*'` — düz `git fetch origin` YETMEZ:
     bulut oturumu repoyu tek dallı klonlar, başka oturumların `bekleyen/*` dallarını hiç görmez.
  2. Getir: `git fetch origin '+refs/heads/bekleyen/*:refs/remotes/origin/bekleyen/*'`
     (sığ klonda birleştirme taban bulamazsa önce `git fetch --unshallow origin`).
  3. Listeyi kullanıcıya göster → canlı dala birleştir → derle/dene → **TEK** push → yayının gerçekten
     oluştuğunu doğrula → birleşen dalları sil (bulut oturumunda silme 403 verirse bırak, zararsız).

## Bu projede yayın nasıl oluşur

- Vercel projesi **`hpcalculator`**, canlı dal **`main`**: `npx expo export -p web` → `dist/`.
  Canlı dala KOD push'u = web sürümüne CANLI YAYIN.
- Yalnız belge değişen push (`*.md`, `docs/`, `sql/`, `.github/`) derlenmez — Vercel proje ayarı
  "Ignored Build Step" (2026-10-02). ⚠️ Canlı dalda yayınlanmamış kod varken ya da başka bir yayın
  sürerken gönderilen belge push'u da DERLER; önce kontrol et.
- Yan dallar (`bekleyen/*`, `claude/*`) derlenmez — iki kilit (2026-10-02): Vercel'de önizleme yayınları kapalı,
  ayrıca Ignored Build Step canlı olmayan her derlemeyi baştan atlıyor (`VERCEL_ENV` production değilse).
- ⚠️ `.github/workflows/preview.yml` `main`'e HER push'ta Expo bulutunda Android derlemesi açıyor (21.09.2026'dan
  beri Node sürümü yüzünden kurulumda çöküyor). Kaldırılması `bekleyen/expo-otomatik-derleme-kapat` dalında.
  Kullanıcı: "Expo meşgul edilmesin, APK gerekirse GitHub Release'ten alırım."
- Play Store yayını (`eas.json` production + submit) EAS üzerinden; imza anahtarı büyük ihtimalle Expo'da.

