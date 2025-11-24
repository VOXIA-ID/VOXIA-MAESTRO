# Asisten Trading & Sinyal Pasar Global

Website aplikasi trading cerdas yang bertindak sebagai "Senior Analis Teknikal & Fundamental" untuk membantu trader mengambil keputusan Open Posisi. Aplikasi ini mencakup pasar Saham (Indonesia/IDX, AS, Eropa, Asia), Forex, Emas, dan Komoditas Lunak (Soft Commodities).

## 🚀 Fitur Utama

### 📊 Analisis Teknikal Komprehensif
- **RSI (Relative Strength Index)**: Deteksi kondisi Overbought/Oversold
- **Moving Average (MA 50 & MA 200)**: Identifikasi tren dan support/resistance
- **MACD**: Deteksi sinyal Golden Cross dan Death Cross
- **Volume Analysis**: Konfirmasi kekuatan pergerakan harga

### 📰 Sentimen Berita Real-Time
- Pencarian berita terkini terkait aset
- Analisis sentimen (Positif/Negatif/Netral)
- Integrasi dengan sumber berita terpercaya

### 🤖 Analisis AI Cerdas
- **Sinyal BELI**: RSI < 30 + harga di support + sentimen positif
- **Sinyal JUAL**: RSI > 70 + harga di resistance + sentimen negatif
- **Verdict**: STRONG BUY, BUY, NEUTRAL, SELL, STRONG SELL
- **Tingkat Keyakinan**: High, Medium, Low
- **Manajemen Risiko**: Assess tingkat risiko secara otomatis

### 🌈 Coverage Pasar Lengkap
- **Saham Indonesia (IDX)**: BBCA.JK, TLKM.JK, BBRI.JK, dll
- **Saham Global**: NVDA, AAPL, GOOGL, MSFT, dll
- **Forex & Crypto**: XAU/USD, EUR/USD, GBP/USD, dll
- **Komoditas Hard**: Emas, Minyak (WTI/Brent)
- **Komoditas Soft**: CPO, Gandum, Jagung (CBOT)

## 🛠️ Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Icons**: Font Awesome 6
- **Typography**: Google Fonts (Inter)
- **API Integration**: Google Search API (simulated)
- **AI Engine**: Custom JavaScript AI Analyzer

## 📱 Responsive Design
- Mobile-first approach
- Optimized untuk desktop, tablet, dan mobile
- Smooth animations dan transitions
- Modern gradient backgrounds

## 🎯 Cara Penggunaan

1. **Input Aset**: Masukkan simbol saham atau nama komoditas
2. **Pilih Kategori**: Pilih kategori pasar yang sesuai
3. **Analisis**: Klik tombol "Analisis Sekarang"
4. **Hasil**: Lihat hasil analisis lengkap dengan rekomendasi

## 📈 Output Analisis

### 📊 Indikator Teknikal
- Tabel lengkap dengan nilai dan status setiap indikator
- Color-coded untuk kemudahan interpretasi
- Real-time price updates

### ⚖️ Verdict & Rekomendasi
- Keputusan trading yang jelas (BUY/SELL/NEUTRAL)
- Alasan analisis yang mendalam
- Rekomendasi manajemen risiko
- Target horizon waktu

### 📰 Sentimen Pasar
- 3 berita terkini dengan analisis sentimen
- Sumber berita terpercaya
- Timestamp untuk relevansi waktu

### 🔍 Analisis Lanjutan
- Tingkat risiko (Low/Medium/High/Very High)
- Tingkat keyakinan analisis
- Skor analisis kuantitatif
- Rekomendasi trading spesifik

## 🌐 Deployment ke GitHub Pages

### Prasyarat
- Akun GitHub
- Repository untuk project

### Langkah Deployment

1. **Clone Repository**
```bash
git clone https://github.com/username/trading-assistant.git
cd trading-assistant
```

2. **Add Files ke Repository**
```bash
git add .
git commit -m "Initial commit - Trading Assistant App"
git push origin main
```

3. **Enable GitHub Pages**
- Buka repository di GitHub
- Go to Settings → Pages
- Source: Deploy from a branch
- Branch: main / (root)
- Save

4. **Access Website**
- Website akan tersedia di: `https://username.github.io/trading-assistant/`

### Custom Domain (Optional)
Tambahkan file `CNAME` di root directory:
```
yourdomain.com
```

## 🎨 Branding

### Voxia ID Integration
- Powered by Voxia ID branding
- Link ke https://voxia.id/
- Professional color scheme

### Bali Trade Community
- Dedicated untuk Bali Trade Community
- Community-focused features
- Local market insights

## 🔧 Konfigurasi

### Environment Variables
Untuk production deployment dengan real API:
```javascript
const config = {
    GOOGLE_API_KEY: 'your-google-api-key',
    SEARCH_ENGINE_ID: 'your-search-engine-id',
    BASE_URL: 'https://your-domain.com'
};
```

### API Integration
- Google Custom Search API untuk real-time data
- Financial data providers (Alpha Vantage, Yahoo Finance)
- News APIs untuk sentiment analysis

## 🚀 Performance Optimization

- Lazy loading untuk images
- Minified CSS dan JavaScript
- Optimized font loading
- Efficient DOM manipulation
- Smooth scrolling dan animations

## 🔒 Security Features

- Input sanitization
- XSS prevention
- HTTPS enforcement
- Secure API calls
- Data validation

## 📱 Mobile Features

- Touch-friendly interface
- Swipe gestures untuk navigation
- Optimized form inputs
- Responsive tables
- Mobile-optimized charts

## 🌟 Future Enhancements

- Real-time price alerts
- Portfolio tracking
- Advanced charting
- Social trading features
- Machine learning improvements
- Multi-language support

## 📞 Support & Contact

- **Developer**: Voxia ID Team
- **Community**: Bali Trade Community
- **Website**: https://voxia.id/
- **Documentation**: Available in repository

## 📄 License

MIT License - Feel free to use and modify for your trading needs.

---

**Disclaimer**: Aplikasi ini untuk tujuan edukasi dan informasi. Selalu lakukan due diligence sebelum membuat keputusan trading. Segala risiko trading adalah tanggung jawab pengguna.

---

*Built with ❤️ by Voxia ID for Bali Trade Community*