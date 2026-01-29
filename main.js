document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const charCount = document.getElementById('charCount');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultContainer = document.getElementById('resultContainer');
    const spamScore = document.getElementById('spamScore');
    const scoreBar = document.getElementById('scoreBar');
    const finalLabel = document.getElementById('finalLabel');
    const indicatorList = document.getElementById('indicatorList');
    const typingIndicator = document.getElementById('typingIndicator');

    let typingTimer;

    // Char counter & Typing indicator
    messageInput.addEventListener('input', () => {
        const text = messageInput.value;
        charCount.innerText = `${text.length} Characters`;

        typingIndicator.classList.add('active');
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            typingIndicator.classList.remove('active');
        }, 1000);
    });

    // Clear logic
    clearBtn.addEventListener('click', () => {
        messageInput.value = '';
        charCount.innerText = '0 Characters';
        resultContainer.classList.add('hidden');
        messageInput.focus();
    });

    // Analysis logic
    analyzeBtn.addEventListener('click', () => {
        const text = messageInput.value.trim();

        if (!text) {
            alert('Please enter a message to analyze.');
            return;
        }

        // Show loading state
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<span>Scanning Payload...</span>';

        setTimeout(() => {
            const results = SpamEngine.analyze(text);
            displayResults(results);

            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<span>Analyze Message</span><div class="btn-shine"></div>';
        }, 800);
    });

    const displayResults = (results) => {
        resultContainer.classList.remove('hidden');

        // Smooth scroll to results
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Update Score
        spamScore.innerText = `${results.score}%`;
        scoreBar.style.width = `${results.score}%`;

        // Update Label Colors
        finalLabel.innerText = results.label;

        // Dynamic Label styling
        finalLabel.className = 'result-label'; // reset
        if (results.score > 70) {
            finalLabel.classList.add('bg-danger');
            scoreBar.style.background = '#ef4444';
            finalLabel.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
            finalLabel.style.color = '#ef4444';
        } else if (results.score > 40) {
            finalLabel.classList.add('bg-warning');
            scoreBar.style.background = '#f59e0b';
            finalLabel.style.backgroundColor = 'rgba(245, 158, 11, 0.2)';
            finalLabel.style.color = '#f59e0b';
        } else {
            finalLabel.classList.add('bg-success');
            scoreBar.style.background = '#22c55e';
            finalLabel.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
            finalLabel.style.color = '#22c55e';
        }

        // Populate Indicators
        indicatorList.innerHTML = '';
        if (results.indicators.length === 0) {
            indicatorList.innerHTML = '<div class="indicator-tag safe">No threats detected</div>';
        } else {
            results.indicators.forEach(ind => {
                const tag = document.createElement('div');
                tag.className = `indicator-tag ${ind.type}`;
                tag.innerHTML = `
                    <span class="dot"></span>
                    ${ind.name}
                `;
                indicatorList.appendChild(tag);
            });
        }
    };
});
