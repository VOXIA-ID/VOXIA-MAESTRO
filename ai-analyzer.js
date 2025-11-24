// AI Analysis Engine for Trading Signals
class AIAnalyzer {
    constructor() {
        this.weights = {
            rsi: 0.25,
            movingAverages: 0.30,
            macd: 0.20,
            newsSentiment: 0.15,
            volume: 0.10
        };
        
        this.thresholds = {
            rsi: {
                oversold: 30,
                overbought: 70,
                neutralLow: 40,
                neutralHigh: 60
            },
            macd: {
                strongBullish: 0.5,
                bullish: 0.2,
                bearish: -0.2,
                strongBearish: -0.5
            }
        };
    }

    async analyzeMarketData(searchData, symbol, category) {
        try {
            // Extract relevant data from search results
            const technicalData = this.extractTechnicalData(searchData);
            const sentimentData = this.extractSentimentData(searchData);
            
            // Perform comprehensive analysis
            const analysis = {
                technical: this.analyzeTechnicalIndicators(technicalData),
                sentiment: this.analyzeSentiment(sentimentData),
                risk: this.assessRisk(technicalData, sentimentData),
                opportunity: this.identifyOpportunities(technicalData, sentimentData)
            };
            
            // Generate final verdict
            const verdict = this.generateVerdict(analysis, symbol, category);
            
            return {
                ...analysis,
                verdict,
                confidence: this.calculateConfidence(analysis),
                recommendations: this.generateRecommendations(analysis, verdict),
                riskLevel: this.assessRiskLevel(analysis),
                timeHorizon: this.suggestTimeHorizon(analysis, category)
            };
            
        } catch (error) {
            console.error('AI Analysis error:', error);
            throw new Error('Gagal melakukan analisis AI');
        }
    }

    extractTechnicalData(searchData) {
        const indicators = searchData.technicalIndicators;
        const marketData = searchData.marketData;
        
        return {
            rsi: parseFloat(indicators.rsi.value),
            rsiStatus: indicators.rsi.status,
            ma50: parseFloat(indicators.ma50.value.replace(/,/g, '')),
            ma200: parseFloat(indicators.ma200.value.replace(/,/g, '')),
            currentPrice: parseFloat(searchData.currentPrice.price.replace(/,/g, '')),
            macd: indicators.macd.value,
            macdHistogram: indicators.macd.histogram,
            macdSignal: indicators.macd.signal,
            volume: indicators.volume.value,
            volumeAverage: indicators.volume.average,
            volumeStatus: indicators.volume.status,
            dayHigh: parseFloat(marketData.dayHigh.replace(/,/g, '')),
            dayLow: parseFloat(marketData.dayLow.replace(/,/g, '')),
            week52High: parseFloat(marketData.week52High.replace(/,/g, '')),
            week52Low: parseFloat(marketData.week52Low.replace(/,/g, '')),
            volatility: parseFloat(marketData.volatility),
            beta: parseFloat(marketData.beta)
        };
    }

    extractSentimentData(searchData) {
        const news = searchData.newsSentiment;
        
        const sentimentScores = news.map(item => {
            switch (item.sentiment) {
                case 'positive': return 1;
                case 'negative': return -1;
                default: return 0;
            }
        });
        
        const averageSentiment = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;
        
        return {
            news: news,
            averageSentiment: averageSentiment,
            sentimentStrength: Math.abs(averageSentiment),
            sentimentDistribution: {
                positive: news.filter(n => n.sentiment === 'positive').length,
                negative: news.filter(n => n.sentiment === 'negative').length,
                neutral: news.filter(n => n.sentiment === 'neutral').length
            }
        };
    }

    analyzeTechnicalIndicators(data) {
        const signals = {
            rsi: this.analyzeRSI(data.rsi),
            movingAverages: this.analyzeMovingAverages(data.currentPrice, data.ma50, data.ma200),
            macd: this.analyzeMACD(data.macd, data.macdHistogram, data.macdSignal),
            volume: this.analyzeVolume(data.volume, data.volumeAverage, data.volumeStatus),
            priceAction: this.analyzePriceAction(data.currentPrice, data.dayHigh, data.dayLow, data.week52High, data.week52Low),
            volatility: this.analyzeVolatility(data.volatility)
        };
        
        // Calculate overall technical score
        const technicalScore = this.calculateTechnicalScore(signals);
        
        return {
            signals,
            score: technicalScore,
            trend: this.determineTrend(signals),
            momentum: this.assessMomentum(signals),
            strength: this.assessStrength(signals)
        };
    }

    analyzeRSI(rsi) {
        let signal, strength, description;
        
        if (rsi < this.thresholds.rsi.oversold) {
            signal = 'strong_buy';
            strength = 0.8;
            description = 'RSI menunjukkan kondisi oversold (jenuh jual), peluang rebound tinggi';
        } else if (rsi < this.thresholds.rsi.neutralLow) {
            signal = 'buy';
            strength = 0.6;
            description = 'RSI mendekati oversold, momentum beli mulai terlihat';
        } else if (rsi > this.thresholds.rsi.overbought) {
            signal = 'strong_sell';
            strength = 0.8;
            description = 'RSI menunjukkan kondisi overbought (jenuh beli), risiko koreksi tinggi';
        } else if (rsi > this.thresholds.rsi.neutralHigh) {
            signal = 'sell';
            strength = 0.6;
            description = 'RSI mendekati overbought, momentum jual mulai terlihat';
        } else {
            signal = 'neutral';
            strength = 0.3;
            description = 'RSI dalam zona netral, menunggu konfirmasi';
        }
        
        return { signal, strength, description, value: rsi };
    }

    analyzeMovingAverages(currentPrice, ma50, ma200) {
        const priceAboveMA50 = currentPrice > ma50;
        const priceAboveMA200 = currentPrice > ma200;
        const ma50AboveMA200 = ma50 > ma200;
        
        let signal, strength, description;
        
        if (priceAboveMA50 && priceAboveMA200 && ma50AboveMA200) {
            signal = 'strong_buy';
            strength = 0.9;
            description = 'Harga di atas MA50 & MA200 dengan MA50 di atas MA200 - Uptrend kuat';
        } else if (priceAboveMA50 && ma50AboveMA200) {
            signal = 'buy';
            strength = 0.7;
            description = 'Harga di atas MA50 dengan MA50 di atas MA200 - Uptrend';
        } else if (!priceAboveMA50 && !priceAboveMA200 && !ma50AboveMA200) {
            signal = 'strong_sell';
            strength = 0.9;
            description = 'Harga di bawah MA50 & MA200 dengan MA50 di bawah MA200 - Downtrend kuat';
        } else if (!priceAboveMA50 && !ma50AboveMA200) {
            signal = 'sell';
            strength = 0.7;
            description = 'Harga di bawah MA50 dengan MA50 di bawah MA200 - Downtrend';
        } else {
            signal = 'neutral';
            strength = 0.4;
            description = 'Posisi harga terhadap MA menunjukkan konsolidasi';
        }
        
        return { signal, strength, description, currentPrice, ma50, ma200 };
    }

    analyzeMACD(macd, histogram, signal) {
        let signal, strength, description;
        
        if (histogram > this.thresholds.macd.strongBullish) {
            signal = 'strong_buy';
            strength = 0.8;
            description = 'MACD menunjukkan Golden Cross dengan momentum bullish kuat';
        } else if (histogram > this.thresholds.macd.bullish) {
            signal = 'buy';
            strength = 0.6;
            description = 'MACD menunjukkan momentum bullish';
        } else if (histogram < this.thresholds.macd.strongBearish) {
            signal = 'strong_sell';
            strength = 0.8;
            description = 'MACD menunjukkan Death Cross dengan momentum bearish kuat';
        } else if (histogram < this.thresholds.macd.bearish) {
            signal = 'sell';
            strength = 0.6;
            description = 'MACD menunjukkan momentum bearish';
        } else {
            signal = 'neutral';
            strength = 0.3;
            description = 'MACD dalam zona netral, menunggu konfirmasi';
        }
        
        return { signal, strength, description, macd, histogram, signalLine: signal };
    }

    analyzeVolume(volume, average, status) {
        let signal, strength, description;
        
        if (status === 'above_average' && volume > average * 1.5) {
            signal = 'strong_confirmation';
            strength = 0.7;
            description = 'Volume tinggi di atas rata-rata, mengkonfirmasi pergerakan harga';
        } else if (status === 'above_average') {
            signal = 'confirmation';
            strength = 0.5;
            description = 'Volume di atas rata-rata, mendukung pergerakan harga';
        } else if (status === 'below_average' && volume < average * 0.5) {
            signal = 'weakness';
            strength = 0.6;
            description = 'Volume rendah, menunjukkan kelemahan momentum';
        } else {
            signal = 'neutral';
            strength = 0.3;
            description = 'Volume normal, tidak ada sinyal khusus';
        }
        
        return { signal, strength, description, volume, average };
    }

    analyzePriceAction(currentPrice, dayHigh, dayLow, week52High, week52Low) {
        const dayRange = dayHigh - dayLow;
        const dayPosition = (currentPrice - dayLow) / dayRange;
        const week52Range = week52High - week52Low;
        const week52Position = (currentPrice - week52Low) / week52Range;
        
        let signal, strength, description;
        
        if (week52Position > 0.9) {
            signal = 'resistance';
            strength = 0.7;
            description = 'Harga mendekati resistance 52 minggu, waspadai koreksi';
        } else if (week52Position < 0.1) {
            signal = 'support';
            strength = 0.7;
            description = 'Harga mendekati support 52 minggu, peluang rebound';
        } else if (dayPosition > 0.8) {
            signal = 'daily_resistance';
            strength = 0.5;
            description = 'Harga dekat resistance harian';
        } else if (dayPosition < 0.2) {
            signal = 'daily_support';
            strength = 0.5;
            description = 'Harga dekat support harian';
        } else {
            signal = 'neutral';
            strength = 0.3;
            description = 'Harga dalam range normal';
        }
        
        return { signal, strength, description, dayPosition, week52Position };
    }

    analyzeVolatility(volatility) {
        let signal, strength, description;
        
        if (volatility > 25) {
            signal = 'high_volatility';
            strength = 0.6;
            description = 'Volatilitas tinggi, risiko meningkat';
        } else if (volatility < 10) {
            signal = 'low_volatility';
            strength = 0.4;
            description = 'Volatilitas rendah, pergerakan terbatas';
        } else {
            signal = 'normal_volatility';
            strength = 0.3;
            description = 'Volatilitas normal';
        }
        
        return { signal, strength, description, volatility };
    }

    calculateTechnicalScore(signals) {
        const scores = {
            rsi: signals.rsi.signal === 'strong_buy' ? 0.8 : 
                  signals.rsi.signal === 'buy' ? 0.6 : 
                  signals.rsi.signal === 'strong_sell' ? -0.8 : 
                  signals.rsi.signal === 'sell' ? -0.6 : 0,
            
            movingAverages: signals.movingAverages.signal === 'strong_buy' ? 0.9 : 
                           signals.movingAverages.signal === 'buy' ? 0.7 : 
                           signals.movingAverages.signal === 'strong_sell' ? -0.9 : 
                           signals.movingAverages.signal === 'sell' ? -0.7 : 0,
            
            macd: signals.macd.signal === 'strong_buy' ? 0.8 : 
                  signals.macd.signal === 'buy' ? 0.6 : 
                  signals.macd.signal === 'strong_sell' ? -0.8 : 
                  signals.macd.signal === 'sell' ? -0.6 : 0,
            
            volume: signals.volume.signal === 'strong_confirmation' ? 0.4 : 
                   signals.volume.signal === 'confirmation' ? 0.2 : 
                   signals.volume.signal === 'weakness' ? -0.3 : 0,
            
            priceAction: signals.priceAction.signal === 'support' ? 0.3 : 
                        signals.priceAction.signal === 'daily_support' ? 0.2 : 
                        signals.priceAction.signal === 'resistance' ? -0.3 : 
                        signals.priceAction.signal === 'daily_resistance' ? -0.2 : 0
        };
        
        const weightedScore = 
            scores.rsi * this.weights.rsi +
            scores.movingAverages * this.weights.movingAverages +
            scores.macd * this.weights.macd +
            scores.volume * this.weights.volume +
            scores.priceAction * 0.15;
        
        return weightedScore;
    }

    determineTrend(signals) {
        const maSignal = signals.movingAverages.signal;
        const macdSignal = signals.macd.signal;
        
        if ((maSignal === 'strong_buy' || maSignal === 'buy') && 
            (macdSignal === 'strong_buy' || macdSignal === 'buy')) {
            return 'strong_uptrend';
        } else if ((maSignal === 'strong_sell' || maSignal === 'sell') && 
                  (macdSignal === 'strong_sell' || macdSignal === 'sell')) {
            return 'strong_downtrend';
        } else if (maSignal === 'buy' || macdSignal === 'buy') {
            return 'uptrend';
        } else if (maSignal === 'sell' || macdSignal === 'sell') {
            return 'downtrend';
        } else {
            return 'sideways';
        }
    }

    assessMomentum(signals) {
        const rsiMomentum = signals.rsi.strength;
        const macdMomentum = signals.macd.strength;
        const volumeMomentum = signals.volume.strength;
        
        const avgMomentum = (rsiMomentum + macdMomentum + volumeMomentum) / 3;
        
        if (avgMomentum > 0.7) return 'strong';
        if (avgMomentum > 0.5) return 'moderate';
        if (avgMomentum > 0.3) return 'weak';
        return 'very_weak';
    }

    assessStrength(signals) {
        const maStrength = signals.movingAverages.strength;
        const volumeStrength = signals.volume.strength;
        
        const avgStrength = (maStrength + volumeStrength) / 2;
        
        if (avgStrength > 0.8) return 'very_strong';
        if (avgStrength > 0.6) return 'strong';
        if (avgStrength > 0.4) return 'moderate';
        return 'weak';
    }

    analyzeSentiment(sentimentData) {
        const { averageSentiment, sentimentStrength, sentimentDistribution } = sentimentData;
        
        let signal, strength, description;
        
        if (averageSentiment > 0.5) {
            signal = 'strong_positive';
            strength = 0.8;
            description = 'Sentimen berita sangat positif, mendukung kenaikan harga';
        } else if (averageSentiment > 0.2) {
            signal = 'positive';
            strength = 0.6;
            description = 'Sentimen berita positif, mendukung momentum beli';
        } else if (averageSentiment < -0.5) {
            signal = 'strong_negative';
            strength = 0.8;
            description = 'Sentimen berita sangat negatif, menekan harga';
        } else if (averageSentiment < -0.2) {
            signal = 'negative';
            strength = 0.6;
            description = 'Sentimen berita negatif, mendukung momentum jual';
        } else {
            signal = 'neutral';
            strength = 0.3;
            description = 'Sentimen berita netral, tidak ada pengaruh signifikan';
        }
        
        return {
            signal,
            strength,
            description,
            averageSentiment,
            sentimentStrength,
            distribution: sentimentDistribution
        };
    }

    assessRisk(technicalData, sentimentData) {
        const volatilityRisk = technicalData.volatility / 30; // Normalize to 0-1
        const betaRisk = Math.min(technicalData.beta / 2, 1); // Normalize to 0-1
        const sentimentRisk = sentimentData.averageSentiment < -0.3 ? 0.7 : 
                             sentimentData.averageSentiment > 0.3 ? 0.3 : 0.5;
        
        const overallRisk = (volatilityRisk + betaRisk + sentimentRisk) / 3;
        
        let riskLevel;
        if (overallRisk > 0.7) riskLevel = 'very_high';
        else if (overallRisk > 0.5) riskLevel = 'high';
        else if (overallRisk > 0.3) riskLevel = 'medium';
        else riskLevel = 'low';
        
        return {
            level: riskLevel,
            score: overallRisk,
            factors: {
                volatility: volatilityRisk,
                beta: betaRisk,
                sentiment: sentimentRisk
            }
        };
    }

    identifyOpportunities(technicalData, sentimentData) {
        const opportunities = [];
        
        // RSI opportunities
        if (technicalData.rsi < 30) {
            opportunities.push({
                type: 'oversold_rebound',
                description: 'RSI oversold menunjukkan peluang rebound',
                confidence: 0.7
            });
        }
        
        // Moving average opportunities
        if (technicalData.currentPrice > technicalData.ma50 && 
            technicalData.currentPrice < technicalData.ma50 * 1.02) {
            opportunities.push({
                type: 'ma_support',
                description: 'Harga dekat MA50 sebagai support',
                confidence: 0.6
            });
        }
        
        // Sentiment opportunities
        if (sentimentData.averageSentiment > 0.5 && technicalData.rsi < 50) {
            opportunities.push({
                type: 'sentiment_technical_alignment',
                description: 'Sentimen positif sejalan dengan indikator teknikal',
                confidence: 0.8
            });
        }
        
        return opportunities;
    }

    generateVerdict(analysis, symbol, category) {
        const technicalScore = analysis.technical.score;
        const sentimentScore = analysis.sentiment.strength * (analysis.sentiment.signal.includes('positive') ? 1 : -1);
        const riskPenalty = analysis.risk.score * 0.3;
        
        const finalScore = technicalScore + sentimentScore * 0.3 - riskPenalty;
        
        let verdict, verdictClass, confidence;
        
        if (finalScore > 0.7) {
            verdict = 'STRONG BUY';
            verdictClass = 'strong-buy';
            confidence = 'high';
        } else if (finalScore > 0.3) {
            verdict = 'BUY';
            verdictClass = 'buy';
            confidence = 'medium';
        } else if (finalScore < -0.7) {
            verdict = 'STRONG SELL';
            verdictClass = 'strong-sell';
            confidence = 'high';
        } else if (finalScore < -0.3) {
            verdict = 'SELL';
            verdictClass = 'sell';
            confidence = 'medium';
        } else {
            verdict = 'NEUTRAL';
            verdictClass = 'neutral';
            confidence = 'low';
        }
        
        return {
            verdict,
            verdictClass,
            confidence,
            score: finalScore,
            reasoning: this.generateVerdictReasoning(analysis, finalScore)
        };
    }

    generateVerdictReasoning(analysis, score) {
        const reasons = [];
        
        if (analysis.technical.trend === 'strong_uptrend') {
            reasons.push('Tren naik yang kuat berdasarkan moving averages');
        }
        
        if (analysis.technical.momentum === 'strong') {
            reasons.push('Momentum yang kuat terlihat dari RSI dan MACD');
        }
        
        if (analysis.sentiment.signal.includes('positive')) {
            reasons.push('Sentimen berita yang mendukung');
        }
        
        if (analysis.risk.level === 'low') {
            reasons.push('Tingkat risiko yang relatif rendah');
        }
        
        if (analysis.opportunities.length > 0) {
            reasons.push('Adanya peluang trading yang teridentifikasi');
        }
        
        return reasons.join('. ');
    }

    calculateConfidence(analysis) {
        const technicalConfidence = analysis.technical.strength === 'very_strong' ? 0.9 :
                                   analysis.technical.strength === 'strong' ? 0.7 :
                                   analysis.technical.strength === 'moderate' ? 0.5 : 0.3;
        
        const sentimentConfidence = analysis.sentiment.strength;
        const riskConfidence = analysis.risk.level === 'low' ? 0.8 :
                               analysis.risk.level === 'medium' ? 0.6 :
                               analysis.risk.level === 'high' ? 0.4 : 0.2;
        
        return (technicalConfidence + sentimentConfidence + riskConfidence) / 3;
    }

    generateRecommendations(analysis, verdict) {
        const recommendations = [];
        
        if (verdict.verdict.includes('BUY')) {
            recommendations.push('Pertimbangkan posisi beli dengan manajemen risiko yang ketat');
            if (analysis.technical.momentum === 'strong') {
                recommendations.push('Manfaatkan momentum positif dengan target profit yang realistis');
            }
        } else if (verdict.verdict.includes('SELL')) {
            recommendations.push('Pertimbangkan untuk mengurangi posisi atau taking profit');
            if (analysis.risk.level === 'high') {
                recommendations.push('Tingkatkan level stop loss karena risiko yang meningkat');
            }
        } else {
            recommendations.push('Tunggu konfirmasi sinyal yang lebih jelas sebelum mengambil posisi');
            recommendations.push('Monitor level support dan resistance kunci');
        }
        
        // Risk management recommendations
        if (analysis.risk.level === 'high') {
            recommendations.push('Gunakan position sizing yang lebih kecil');
            recommendations.push('Pertimbangkan untuk menunggu volatilitas menurun');
        }
        
        return recommendations;
    }

    assessRiskLevel(analysis) {
        return analysis.risk.level;
    }

    suggestTimeHorizon(analysis, category) {
        if (analysis.technical.trend.includes('strong')) {
            return 'medium_to_long_term';
        } else if (analysis.technical.momentum === 'strong') {
            return 'short_to_medium_term';
        } else {
            return 'short_term';
        }
    }
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAnalyzer;
} else {
    window.AIAnalyzer = AIAnalyzer;
}