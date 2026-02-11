# İftar Vakti 2026 - Ramazan Uygulaması

Bu proje, Next.js 15 ve TailwindCSS 4 kullanılarak geliştirilmiş modern bir Ramazan uygulamasıdır. İçerisinde Namaz Vakitleri, İmsakiye, Kıble Pusulası ve Dualar/Hadisler bölümleri bulunur.

## Özellikler

- 🌙 **Ana Sayfa:** İftar/Sahur geri sayımı, vakitler ve günün özeti.
- 📅 **İmsakiye:** 30 günlük Ramazan takvimi.
- 🧭 **Kıble:** Cihaz sensörlerini kullanan gerçek zamanlı pusula.
- 🤲 **Dua & Hadis:** Günlük içerikler ve interaktif zikirmatik.
- ⚙️ **Ayarlar:** Şehir seçimi, tema (Açık/Koyu) ve bildirim ayarları.
- 📱 **PWA Desteği:** Mobil cihazlara uygulama gibi kurulabilir.

## Kurulum ve Çalıştırma

1. **Gereksinimler:** Node.js (v18+) kurulu olmalıdır. (Kurulum scripti Node.js v24 kurdu).
2. **Başlatma:**
   - Ana klasördeki `baslat.bat` dosyasına çift tıklayın.
   - Veya terminalden:
     ```bash
     cd iftar-vakti
     npm install
     npm run dev
     ```
3. **Tarayıcıda Açma:**
   - [http://localhost:3000](http://localhost:3000) adresine gidin.

## Teknoloji Yığını

- **Framework:** Next.js 15 (App Router)
- **Stil:** TailwindCSS 4
- **İkonlar:** Lucide React
- **Veri:** Yerel hesaplama (API bağımlılığı yok)
- **Dağıtım:** Static Export (`output: export`)

## Lisans

MIT
