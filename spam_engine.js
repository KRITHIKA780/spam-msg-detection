/**
 * SpamEngine - Heuristic Analysis Engine
 */
const SpamEngine = (() => {
    const SPAM_KEYWORDS = [
        'win', 'winner', 'prize', 'cash', 'gift', 'award', 'million', 'dollar',
        'urgent', 'immediate', 'action', 'required', 'account', 'verify', 'bank',
        'crypto', 'bitcoin', 'investment', 'profit', 'guaranteed', 'risk-free',
        'click', 'here', 'link', 'below', 'subscribe', 'unsubscribe', 'offer',
        'free', 'bonus', 'limited', 'time', 'exclusive', 'lottery', 'inheritance'
    ];

    const analyze = (text) => {
        const results = {
            score: 0,
            indicators: [],
            label: 'CLEAN'
        };

        if (!text || text.trim().length === 0) return results;

        const normalized = text.toLowerCase();
        const words = normalized.split(/\W+/).filter(w => w.length > 0);
        
        // 1. Keyword Frequency Analysis
        let matchedKeywords = [];
        SPAM_KEYWORDS.forEach(kw => {
            if (normalized.includes(kw)) {
                matchedKeywords.push(kw);
            }
        });
        
        if (matchedKeywords.length > 0) {
            const weight = Math.min(matchedKeywords.length * 15, 45);
            results.score += weight;
            results.indicators.push({
                name: `${matchedKeywords.length} Spam Trigger Words Detected`,
                type: 'danger'
            });
        }

        // 2. Capitalization Ratio
        const caps = text.replace(/[^A-Z]/g, "").length;
        const capRatio = caps / text.length;
        if (capRatio > 0.3 && text.length > 10) {
            results.score += 20;
            results.indicators.push({
                name: 'Excessive Capitalization',
                type: 'danger'
            });
        }

        // 3. Punctuation Density (!!!, $$$)
        const suspiciousPunct = (text.match(/[!$]/g) || []).length;
        if (suspiciousPunct > 3) {
            results.score += 15;
            results.indicators.push({
                name: 'Aggressive Punctuation Density',
                type: 'danger'
            });
        }

        // 4. URL Detection
        const hasUrl = /https?:\/\/\S+|www\.\S+/i.test(text);
        if (hasUrl) {
            results.score += 20;
            results.indicators.push({
                name: 'Embedded Link Pattern',
                type: 'warning'
            });
        }

        // 5. Short Message Heuristic
        if (words.length < 3 && words.length > 0 && !hasUrl) {
            results.score = Math.max(0, results.score - 20);
            results.indicators.push({
                name: 'Likely Natural Interaction (Short)',
                type: 'safe'
            });
        }

        // Final Labeling
        results.score = Math.min(results.score, 100);
        
        if (results.score > 70) results.label = 'HIGH SPAM RISK';
        else if (results.score > 40) results.label = 'SUSPICIOUS';
        else results.label = 'LEGITIMATE';

        return results;
    };

    return { analyze };
})();
