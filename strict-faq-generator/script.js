const generateBtn = document.getElementById('generateBtn');
const sourceTextInput = document.getElementById('sourceText');
const resultsPanel = document.getElementById('resultsPanel');
const faqList = document.getElementById('faqList');
const statusMessage = document.getElementById('statusMessage');
// Custom Q&A Elements
const askBtn = document.getElementById('askBtn');
const customQuestionInput = document.getElementById('customQuestion');
const qaResult = document.getElementById('qaResult');

// Google Gemini API Key
const API_KEY = "AIzaSyBH8b41SHuSCrHNluzb42Kir2boFo3nCzE";

/**
 * Shared function to call Gemini with Retry and Quota handling
 */
async function fetchGeminiResponse(prompt, apiKey) {
    let response;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
        try {
            // Using gemini-flash-latest as per recent success
            response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            if (response.ok) return response; // Success

            // Handle Quota/Rate Limits
            if (response.status === 429) throw new Error("Rate limit hit");

            const errData = await response.clone().json();
            if (errData.error && errData.error.message.includes('Quota')) {
                throw new Error("Quota exceeded");
            }

            // Other errors, don't retry immediately
            throw new Error(errData.error?.message || `API Error: ${response.status}`);

        } catch (e) {
            console.log(`Attempt ${retryCount + 1} failed: ${e.message}`);
            retryCount++;

            if (retryCount === maxRetries) throw e; // Give up

            const waitTime = retryCount * 5000;
            showStatus(`Quota limit hit. Retrying in ${waitTime / 1000}s...`, 'error');
            await new Promise(r => setTimeout(r, waitTime));
        }
    }
}

async function generateFAQs() {
    const apiKey = API_KEY;
    const sourceText = sourceTextInput.value.trim();
    const selectedTone = document.getElementById('toneSelect').value;

    if (!apiKey) { showStatus('API Key is missing.', 'error'); return; }
    if (!sourceText) { showStatus('Please provide a source document.', 'error'); return; }

    setLoading(true);
    resultsPanel.classList.add('hidden');
    faqList.innerHTML = '';
    showStatus('');

    try {
        const prompt = `
            You are a Strict FAQ Generator.
            Your task is to generate FAQs only from the provided source document, with zero assumptions or external knowledge.
            
            TONE INSTRUCTION: Adopt a "${selectedTone}" tone for the Answers. 
            (Note: Even if the tone is "Creative" or "Sarcastic", the FACTS must be strictly derived. The "Reference Line" must still be verbatim.)

            Input Source Document:
            """${sourceText}"""
            
            Output Requirements:
            Generate exactly 5 FAQs.
            Each FAQ must contain:
            1. Question
            2. Answer (Strictly derived)
            3. Reference Line (Verbatim exact sentence from text)

            Rules:
            - Do NOT infer or add external info.
            - Reference Line must be word-for-word.
            - If insufficient info for 5, return a JSON with an "error" property: "Insufficient information...".

            Return the output strictly as a JSON array of objects with keys: "question", "answer", "reference".
        `;

        const response = await fetchGeminiResponse(prompt, apiKey);
        const data = await response.json();
        const candidate = data.candidates && data.candidates[0];

        if (!candidate || !candidate.content || !candidate.content.parts) {
            throw new Error('No content generated');
        }

        const text = candidate.content.parts[0].text;
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const outputData = JSON.parse(jsonString);

        if (outputData.error) {
            showStatus(outputData.error, 'error');
        } else if (Array.isArray(outputData)) {
            renderFAQs(outputData);
            resultsPanel.classList.remove('hidden');
            // Scroll to results
            resultsPanel.scrollIntoView({ behavior: 'smooth' });
            showStatus('Successfully generated 5 strict FAQs.', 'success');
        } else {
            console.log(outputData);
            showStatus('Unexpected format returned by Gemini.', 'error');
        }

    } catch (error) {
        console.error(error);
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        setLoading(false);
    }
}

/**
 * Handle Specific Question
 */
async function askSpecificQuestion() {
    const question = customQuestionInput.value.trim();
    const sourceText = sourceTextInput.value.trim();
    const selectedTone = document.getElementById('toneSelect').value;
    const apiKey = API_KEY;

    if (!question) return;

    // UI State for Q&A
    askBtn.disabled = true;
    askBtn.innerHTML = '<div class="btn-loader" style="width:15px;height:15px;border-width:2px;display:block;"></div>';
    qaResult.classList.add('hidden');

    try {
        const prompt = `
            You are a Strict Fact checker.
            User Question: "${question}"
            
            Source Document:
            """${sourceText}"""

            Task:
            Answer the user's question strictly based ONLY on the source document.
            TONE: ${selectedTone}
            
            Return output as JSON:
            {
                "answer": "...",
                "reference": "..." (Verbatim quote supporting the answer. If no info found, say "Not found in text")
            }
        `;

        const response = await fetchGeminiResponse(prompt, apiKey);
        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(jsonString);

        // Render Result
        qaResult.innerHTML = `
            <div class="faq-question">Q: ${question}</div>
            <div class="faq-answer">${result.answer}</div>
            <div class="faq-reference">
                <span><i data-lucide="quote"></i> Reference</span>
                "${result.reference}"
            </div>
        `;
        qaResult.classList.remove('hidden');
        lucide.createIcons();

    } catch (error) {
        console.error(error);
        alert("Could not answer question: " + error.message);
    } finally {
        askBtn.disabled = false;
        askBtn.innerHTML = '<i data-lucide="send"></i>';
        lucide.createIcons();
    }
}

function renderFAQs(faqs) {
    faqList.innerHTML = '';
    faqs.forEach((faq, index) => {
        const card = document.createElement('div');
        card.className = 'faq-card';
        card.style.animationDelay = `${index * 100}ms`; // Staggered reveal

        card.innerHTML = `
            <div class="faq-question">Q: ${faq.question}</div>
            <div class="faq-answer">${faq.answer}</div>
            <div class="faq-reference">
                <span><i data-lucide="quote"></i> Reference Source</span>
                "${faq.reference}"
            </div>
        `;
        faqList.appendChild(card);
    });
    // Ensure icons are rendered if Lucide is available globally
    if (window.lucide) {
        lucide.createIcons();
    }
}

function setLoading(isLoading) {
    generateBtn.disabled = isLoading;
    if (isLoading) {
        generateBtn.classList.add('loading');
        generateBtn.querySelector('.btn-content').textContent = 'Processing...';
    } else {
        generateBtn.classList.remove('loading');
        generateBtn.querySelector('.btn-content').textContent = 'Generate FAQs';
    }
}

function showStatus(msg, type) {
    statusMessage.textContent = msg;
    statusMessage.className = type;
}

function downloadPDF() {
    const element = document.getElementById('faqList');
    const opt = {
        margin: 0.5,
        filename: 'strict-faqs.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Temporarily style for print transparency/readability if needed, 
    // but default dark mode might consume cleaner
    html2pdf().set(opt).from(element).save();
}

generateBtn.addEventListener('click', generateFAQs);
document.getElementById('downloadBtn').addEventListener('click', downloadPDF);
askBtn.addEventListener('click', askSpecificQuestion);
customQuestionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') askSpecificQuestion();
});
