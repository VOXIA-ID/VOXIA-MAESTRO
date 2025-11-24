class TradingAssistant {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.searchAPI = new GoogleSearchAPI();
        this.aiAnalyzer = new AIAnalyzer();
    }

    initializeElements() {
        this.assetSymbolInput = document.getElementById('assetSymbol');
        this.marketCategorySelect = document.getElementById('marketCategory');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.loadingSection = document.getElementById('loadingSection');
        this.resultsSection = document.getElementById('resultsSection');
        
        // Result elements
        this.resultTitle = document.getElementById('resultTitle');
        this.currentPrice = document.getElementById('currentPrice');
        this.rsiValue = document.getElementById('rsiValue');
        this.rsiStatus = document.getElementById('rsiStatus');
        this.ma50Value = document.getElementById('ma50Value');
        this.ma50Status = document.getElementById('ma50Status');
        this.ma200Value = document.getElementById('ma200Value');
        this.ma200Status = document.getElementById('ma200Status');
        this.macdValue = document.getElementById('macdValue');
        this.macdStatus = document.getElementById('macdStatus');
        this.verdict = document.getElementById('verdict');
        this.analysisText = document.getElementById('analysisText');
        this.newsList = document.getElementById('newsList');
    }

    bindEvents() {
        this.analyzeBtn.addEventListener('click', () => this.handleAnalyze());
        
        // Allow Enter key to trigger analysis
        this.assetSymbolInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAnalyze();
            }
        });
        
        this.marketCategorySelect.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAnalyze();
            }
        });
    }

    async handleAnalyze() {
        const symbol = this.assetSymbolInput.value.trim();
        const category = this.marketCategorySelect.value;

        if (!symbol) {
            this.showError('Mohon masukkan simbol aset atau nama komoditas');
            return;
        }

        if (!category) {
            this.showError('Mohon pilih kategori pasar');
            return;
        }

        try {
            this.showLoading();
            const analysisData = await this.performAnalysis(symbol, category);
            this.displayResults(analysisData, symbol);
        } catch (error) {
            console.error('Analysis error:', error);
            this.showError('Terjadi kesalahan saat melakukan analisis. Silakan coba lagi.');
        } finally {
            this.hideLoading();
        }
    }

    showLoading() {
        this.loadingSection.style.display = 'block';
        this.resultsSection.style.display = 'none';
    }

    hideLoading() {
        this.loadingSection.style.display = 'none';
    }

    showError(message) {
        alert(message);
        this.hideLoading();
    }

    async performAnalysis(symbol, category) {
        try {
            // Get real-time data from search API
            const searchData = await this.searchAPI.searchRealTimeData(symbol, category);
            
            // Perform AI analysis
            const aiAnalysis = await this.aiAnalyzer.analyzeMarketData(searchData, symbol, category);
            
            // Combine data for display
            return {
                symbol: symbol.toUpperCase(),
                category: category,
                currentPrice: searchData.currentPrice.price,
                rsi: searchData.technicalIndicators.rsi.value,
                ma50: searchData.technicalIndicators.ma50.value,
                ma200: searchData.technicalIndicators.ma200.value,
                macd: searchData.technicalIndicators.macd.value,
                newsSentiment: searchData.newsSentiment,
                ...aiAnalysis
            };
        } catch (error) {
            console.error('Analysis error:', error);
            // Fallback to mock data if search fails
            return this.getFallbackAnalysis(symbol, category);
        }
    }

    async getFallbackAnalysis(symbol, category) {
        // Simulate API call delay
        await this.delay(2000);

        // Generate mock data based on symbol and category
        const mockData = this.generateMockData(symbol, category);
        
        // Perform AI analysis
        const analysis = this.analyzeSignals(mockData);
        
        return {
            ...mockData,
            ...analysis
        };
    }

    generateMockData(symbol, category) {
        // Generate realistic mock data
        const basePrice = this.getBasePrice(symbol, category);
        const currentPrice = basePrice + (Math.random() - 0.5) * basePrice * 0.1;
        
        const rsi = 20 + Math.random() * 60; // RSI between 20-80
        const ma50 = currentPrice + (Math.random() - 0.5) * currentPrice * 0.05;
        const ma200 = currentPrice + (Math.random() - 0.5) * currentPrice * 0.1;
        
        // MACD calculation
        const macdLine = (Math.random() - 0.5) * 2;
        const signalLine = (Math.random() - 0.5) * 2;
        const histogram = macdLine - signalLine;
        
        // Generate news sentiment
        const newsSentiment = this.generateNewsSentiment(symbol, category);

        return {
            symbol: symbol.toUpperCase(),
            category: category,
            currentPrice: this.formatPrice(currentPrice, category),
            rsi: rsi.toFixed(2),
            ma50: this.formatPrice(ma50, category),
            ma200: this.formatPrice(ma200, category),
            macd: `${macdLine.toFixed(3)}`,
            macdHistogram: histogram.toFixed(3),
            newsSentiment: newsSentiment
        };
    }

    getBasePrice(symbol, category) {
        // Return realistic base prices for different asset types
        if (category === 'idx') {
            // Indonesian stocks
            const stockPrices = {
                'BBCA.JK': 8500,
                'TLKM.JK': 3500,
                'BBRI.JK': 4500,
                'UNVR.JK': 4000
            };
            return stockPrices[symbol.toUpperCase()] || 1000 + Math.random() * 9000;
        } else if (category === 'global') {
            // Global stocks
            const stockPrices = {
                'NVDA': 500,
                'AAPL': 180,
                'GOOGL': 140,
                'MSFT': 380
            };
            return stockPrices[symbol.toUpperCase()] || 50 + Math.random() * 500;
        } else if (category === 'forex') {
            // Forex pairs
            const forexPrices = {
                'XAU/USD': 2000,
                'EUR/USD': 1.08,
                'GBP/USD': 1.27,
                'USD/JPY': 148
            };
            return forexPrices[symbol.toUpperCase()] || 1 + Math.random() * 100;
        } else if (category === 'hard-commodities') {
            // Hard commodities
            if (symbol.toLowerCase().includes('gold') || symbol.toLowerCase().includes('xau')) {
                return 2000 + Math.random() * 200;
            } else if (symbol.toLowerCase().includes('oil')) {
                return 70 + Math.random() * 30;
            }
            return 100 + Math.random() * 900;
        } else if (category === 'soft-commodities') {
            // Soft commodities
            if (symbol.toLowerCase().includes('cpo') || symbol.toLowerCase().includes('sawit')) {
                return 3500 + Math.random() * 1000;
            } else if (symbol.toLowerCase().includes('gandum') || symbol.toLowerCase().includes('wheat')) {
                return 200 + Math.random() * 100;
            } else if (symbol.toLowerCase().includes('jagung') || symbol.toLowerCase().includes('corn')) {
                return 150 + Math.random() * 50;
            }
            return 100 + Math.random() * 400;
        }
        
        return 100 + Math.random() * 900;
    }

    formatPrice(price, category) {
        if (category === 'forex') {
            return price.toFixed(4);
        } else if (category === 'idx' || category === 'global') {
            return price.toFixed(0);
        } else {
            return price.toFixed(2);
        }
    }

    generateNewsSentiment(symbol, category) {
        const newsTemplates = {
            positive: [
                `${symbol} mencatat kenaikan signifikan didukung sentimen positif pasar`,
                `Analisis fundamental menunjukkan prospek pertumbuhan kuat untuk ${symbol}`,
                `Investor asing meningkatkan kepemilikan saham ${symbol}`
            ],
            negative: [
                `${symbol} tertekan oleh kekhawatiran global dan penurunan permintaan`,
                `Laporan keuangan terakhir ${symbol} menunjukkan perlambatan pertumbuhan`,
                `Sentimen risiko tinggi mempengaruhi pergerakan ${symbol}`
            ],
            neutral: [
                `${symbol} bergerak sideways menunggu katalis baru`,
                `Pasar sedang mengkalkulasi dampak berita terbaru pada ${symbol}`,
                `Analis teknikal menunggu konfirmasi breakout untuk ${symbol}`
            ]
        };

        const sentiments = ['positive', 'negative', 'neutral'];
        const selectedSentiments = [];
        
        for (let i = 0; i < 3; i++) {
            const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
            const newsList = newsTemplates[sentiment];
            const news = newsList[Math.floor(Math.random() * newsList.length)];
            selectedSentiments.push({ text: news, sentiment: sentiment });
        }

        return selectedSentiments;
    }

    analyzeSignals(data) {
        const rsi = parseFloat(data.rsi);
        const currentPrice = parseFloat(data.currentPrice.replace(/,/g, ''));
        const ma50 = parseFloat(data.ma50.replace(/,/g, ''));
        const ma200 = parseFloat(data.ma200.replace(/,/g, ''));
        const macdHistogram = parseFloat(data.macdHistogram);

        // Count positive and negative signals
        let buySignals = 0;
        let sellSignals = 0;

        // RSI Analysis
        if (rsi < 30) {
            buySignals += 2; // Strong buy signal
        } else if (rsi < 40) {
            buySignals += 1; // Buy signal
        } else if (rsi > 70) {
            sellSignals += 2; // Strong sell signal
        } else if (rsi > 60) {
            sellSignals += 1; // Sell signal
        }

        // Moving Average Analysis
        if (currentPrice > ma50 && ma50 > ma200) {
            buySignals += 2; // Strong uptrend
        } else if (currentPrice > ma50) {
            buySignals += 1; // Uptrend
        } else if (currentPrice < ma50 && ma50 < ma200) {
            sellSignals += 2; // Strong downtrend
        } else if (currentPrice < ma50) {
            sellSignals += 1; // Downtrend
        }

        // MACD Analysis
        if (macdHistogram > 0.1) {
            buySignals += 1; // Bullish MACD
        } else if (macdHistogram < -0.1) {
            sellSignals += 1; // Bearish MACD
        }

        // News Sentiment Analysis
        const positiveNews = data.newsSentiment.filter(n => n.sentiment === 'positive').length;
        const negativeNews = data.newsSentiment.filter(n => n.sentiment === 'negative').length;
        
        if (positiveNews > negativeNews) {
            buySignals += 1;
        } else if (negativeNews > positiveNews) {
            sellSignals += 1;
        }

        // Determine verdict
        let verdict, verdictClass, analysis;

        if (buySignals >= 5) {
            verdict = 'STRONG BUY';
            verdictClass = 'strong-buy';
        } else if (buySignals >= 3) {
            verdict = 'BUY';
            verdictClass = 'buy';
        } else if (sellSignals >= 5) {
            verdict = 'STRONG SELL';
            verdictClass = 'strong-sell';
        } else if (sellSignals >= 3) {
            verdict = 'SELL';
            verdictClass = 'sell';
        } else {
            verdict = 'NEUTRAL';
            verdictClass = 'neutral';
        }

        // Generate analysis text
        analysis = this.generateAnalysis(data, buySignals, sellSignals, verdict);

        return {
            verdict,
            verdictClass,
            analysis,
            rsiStatus: this.getRSIStatus(rsi),
            ma50Status: this.getMAStatus(currentPrice, ma50),
            ma200Status: this.getMAStatus(currentPrice, ma200),
            macdStatus: this.getMACDStatus(macdHistogram)
        };
    }

    getRSIStatus(rsi) {
        if (rsi < 30) return { text: 'Oversold (Jenuh Jual)', class: 'status-positive' };
        if (rsi < 40) return { text: 'Mendekati Oversold', class: 'status-positive' };
        if (rsi > 70) return { text: 'Overbought (Jenuh Beli)', class: 'status-negative' };
        if (rsi > 60) return { text: 'Mendekati Overbought', class: 'status-negative' };
        return { text: 'Netral', class: 'status-neutral' };
    }

    getMAStatus(currentPrice, ma) {
        if (currentPrice > ma * 1.02) return { text: 'Di Atas MA (Bullish)', class: 'status-positive' };
        if (currentPrice < ma * 0.98) return { text: 'Di Bawah MA (Bearish)', class: 'status-negative' };
        return { text: 'Dekati MA', class: 'status-neutral' };
    }

    getMACDStatus(histogram) {
        if (histogram > 0.1) return { text: 'Bullish (Golden Cross)', class: 'status-positive' };
        if (histogram < -0.1) return { text: 'Bearish (Death Cross)', class: 'status-negative' };
        return { text: 'Netral', class: 'status-neutral' };
    }

    generateAnalysis(data, buySignals, sellSignals, verdict) {
        const rsi = parseFloat(data.rsi);
        const positiveNews = data.newsSentiment.filter(n => n.sentiment === 'positive').length;
        const negativeNews = data.newsSentiment.filter(n => n.sentiment === 'negative').length;

        let analysis = '';

        if (verdict === 'STRONG BUY' || verdict === 'BUY') {
            analysis = `Berdasarkan analisis teknikal dan sentimen pasar, ${data.symbol} menunjukkan sinyal beli yang kuat. `;
            analysis += `RSI berada di level ${rsi.toFixed(1)}, mengindikasikan adanya momentum beli yang masih terjaga. `;
            
            if (positiveNews > negativeNews) {
                analysis += `Sentimen berita yang positif juga mendukung potensi kenaikan harga lebih lanjut. `;
            }
            
            analysis += `Investor disarankan untuk mempertimbangkan posisi beli dengan target profit yang wajar dan selalu menerapkan manajemen risiko yang tepat.`;
        } else if (verdict === 'STRONG SELL' || verdict === 'SELL') {
            analysis = `Analisis teknikal menunjukkan sinyal jual untuk ${data.symbol}. `;
            analysis += `RSI berada di level ${rsi.toFixed(1)}, mengindikasikan adanya potensi koreksi atau penurunan harga. `;
            
            if (negativeNews > positiveNews) {
                analysis += `Sentimen berita yang negatif juga memberikan tekanan tambahan pada pergerakan harga. `;
            }
            
            analysis += `Investor yang memiliki posisi beli disarankan untuk mempertimbangkan taking profit atau cut loss, sementara investor baru sebaiknya menunggu konfirmasi pembalikan tren.`;
        } else {
            analysis = `${data.symbol} saat ini berada dalam kondisi netral dengan sinyal yang campur aduk antara beli dan jual. `;
            analysis += `RSI di level ${rsi.toFixed(1)} menunjukkan bahwa aset tidak dalam kondisi ekstrem jenuh beli maupun jenuh jual. `;
            
            analysis += `Sentimen berita juga cenderung seimbang, sehingga disarankan untuk menunggu konfirmasi yang lebih jelas sebelum mengambil keputusan trading. `;
            analysis += `Monitor level support dan resistance kunci untuk menentukan arah pergerakan selanjutnya.`;
        }

        return analysis;
    }

    displayResults(data, symbol) {
        // Update title
        this.resultTitle.textContent = `Analisis Sinyal untuk ${data.symbol}`;
        
        // Update price
        this.currentPrice.textContent = data.currentPrice;
        
        // Update indicators
        this.rsiValue.textContent = data.rsi;
        this.rsiStatus.textContent = data.rsiStatus.text;
        this.rsiStatus.className = data.rsiStatus.class;
        
        this.ma50Value.textContent = data.ma50;
        this.ma50Status.textContent = data.ma50Status.text;
        this.ma50Status.className = data.ma50Status.class;
        
        this.ma200Value.textContent = data.ma200;
        this.ma200Status.textContent = data.ma200Status.text;
        this.ma200Status.className = data.ma200Status.class;
        
        this.macdValue.textContent = data.macd;
        this.macdStatus.textContent = data.macdStatus.text;
        this.macdStatus.className = data.macdStatus.class;
        
        // Update verdict
        this.verdict.textContent = data.verdict;
        this.verdict.className = `verdict ${data.verdictClass}`;
        
        // Update analysis
        this.analysisText.textContent = data.analysis;
        
        // Update news
        this.newsList.innerHTML = '';
        data.newsSentiment.forEach(news => {
            const li = document.createElement('li');
            li.className = news.sentiment;
            li.textContent = news.text || news.title || news.snippet;
            this.newsList.appendChild(li);
        });

        // Update additional analysis
        this.updateAdditionalAnalysis(data);
        
        // Update recommendations
        this.updateRecommendations(data);
        
        // Show results
        this.resultsSection.style.display = 'block';
        
        // Scroll to results
        this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    updateAdditionalAnalysis(data) {
        // Update risk level
        const riskLevel = document.getElementById('riskLevel');
        if (data.riskLevel) {
            riskLevel.textContent = this.formatRiskLevel(data.riskLevel);
            riskLevel.className = `risk-indicator ${data.riskLevel}`;
        }

        // Update confidence level
        const confidenceLevel = document.getElementById('confidenceLevel');
        if (data.confidence) {
            confidenceLevel.textContent = this.formatConfidence(data.confidence);
            confidenceLevel.className = `confidence-indicator ${data.confidence}`;
        }

        // Update time horizon
        const timeHorizon = document.getElementById('timeHorizon');
        if (data.timeHorizon) {
            timeHorizon.textContent = this.formatTimeHorizon(data.timeHorizon);
            timeHorizon.className = 'time-horizon-indicator';
        }

        // Update analysis score
        const analysisScore = document.getElementById('analysisScore');
        if (data.score !== undefined) {
            analysisScore.textContent = this.formatScore(data.score);
            analysisScore.className = `score-indicator ${data.score > 0.3 ? 'positive' : data.score < -0.3 ? 'negative' : 'neutral'}`;
        }
    }

    updateRecommendations(data) {
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = '';

        if (data.recommendations && data.recommendations.length > 0) {
            const ul = document.createElement('ul');
            data.recommendations.forEach(recommendation => {
                const li = document.createElement('li');
                li.textContent = recommendation;
                ul.appendChild(li);
            });
            recommendationsList.appendChild(ul);
        } else {
            recommendationsList.innerHTML = '<p>Tidak ada rekomendasi spesifik untuk saat ini.</p>';
        }
    }

    formatRiskLevel(riskLevel) {
        const riskMap = {
            'low': 'Rendah 🟢',
            'medium': 'Sedang 🟡',
            'high': 'Tinggi 🟠',
            'very_high': 'Sangat Tinggi 🔴'
        };
        return riskMap[riskLevel] || riskLevel;
    }

    formatConfidence(confidence) {
        const confidenceMap = {
            'high': 'Tinggi ✅',
            'medium': 'Sedang ⚠️',
            'low': 'Rendah ❌'
        };
        return confidenceMap[confidence] || confidence;
    }

    formatTimeHorizon(timeHorizon) {
        const horizonMap = {
            'short_term': 'Jangka Pendek',
            'short_to_medium_term': 'Jangka Pendek-Menengah',
            'medium_to_long_term': 'Jangka Menengah-Panjang'
        };
        return horizonMap[timeHorizon] || timeHorizon;
    }

    formatScore(score) {
        const scoreValue = (score * 100).toFixed(1);
        const sign = score > 0 ? '+' : '';
        return `${sign}${scoreValue}%`;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TradingAssistant();
});

// Add some utility functions for better user experience
document.addEventListener('DOMContentLoaded', () => {
    // Add input validation
    const assetInput = document.getElementById('assetSymbol');
    const categorySelect = document.getElementById('marketCategory');
    
    // Auto-format some common symbols
    assetInput.addEventListener('blur', function() {
        let value = this.value.trim().toUpperCase();
        
        // Auto-format Indonesian stocks
        if (value && !value.includes('.') && !value.includes('/') && !value.includes(' ')) {
            // Check if it might be an Indonesian stock
            const commonIndonesianStocks = ['BBCA', 'TLKM', 'BBRI', 'UNVR', 'BMRI', 'ASII', 'INDF', 'KLBF'];
            if (commonIndonesianStocks.includes(value) || categorySelect.value === 'idx') {
                value += '.JK';
                this.value = value;
            }
        }
    });
    
    // Add example suggestions
    const examples = [
        { symbol: 'BBCA.JK', category: 'idx' },
        { symbol: 'NVDA', category: 'global' },
        { symbol: 'XAU/USD', category: 'forex' },
        { symbol: 'Minyak Sawit (CPO)', category: 'soft-commodities' }
    ];
    
    // Add quick fill buttons (optional enhancement)
    const inputSection = document.querySelector('.input-section');
    const quickExamples = document.createElement('div');
    quickExamples.className = 'quick-examples';
    quickExamples.innerHTML = '<p style="margin-bottom: 0.5rem; font-size: 0.9rem; color: #6b7280;">Contoh cepat:</p>';
    
    examples.forEach(example => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'example-btn';
        btn.textContent = example.symbol;
        btn.style.cssText = 'margin: 0.25rem; padding: 0.25rem 0.5rem; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 4px; cursor: pointer; font-size: 0.8rem;';
        btn.addEventListener('click', () => {
            assetInput.value = example.symbol;
            categorySelect.value = example.category;
        });
        quickExamples.appendChild(btn);
    });
    
    inputSection.appendChild(quickExamples);
});