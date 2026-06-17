// Chat functionality for answering questions about Monica Lama
// NOTE: For production, you'll need to set up a backend API endpoint
// to securely handle the OpenAI API key. This is a client-side example.

const chatBox = document.getElementById('chatBox');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');

// System prompt to focus the AI on answering questions about Monica Lama
const SYSTEM_PROMPT = `You are a helpful assistant on Monica Lama's personal portfolio website. Answer questions about Monica concisely and accurately using the information below. If asked about something unrelated to Monica, politely redirect the conversation.

## Who is Monica Lama?
Monica Lama (full name: Monica Lama Gonzalez Teja) is an AI Engineering student at the University of Pennsylvania (UPenn, SEAS) pursuing a BSE in Artificial Intelligence with a Minor in Mathematics, and a concurrent MSE in Quantitative Finance from Wharton — graduating May 2027. She builds machine learning systems at the intersection of research, large language models, and quantitative finance. She is bilingual: English and Spanish (both native/fluent).

Contact: mlama@wharton.upenn.edu | LinkedIn: linkedin.com/in/monica-lama-gonzalez-teja-782097260 | GitHub: monicalamagt.github.io

## Experience

**Crypt0nest.io — AI/ML R&D Intern** (June–Sept 2025, Remote)
- Built and deployed LSTM and Transformer-based pipelines for crypto asset modeling
- Reduced MAPE by 15% and improved F1 score by 12% through iterative model refinement and hyperparameter tuning
- Designed production-grade CI/CD workflows for ML model deployment
- Implemented predictive ML agents in a distributed Kafka-powered multi-agent architecture using LangGraph and chain-of-thought prompting

**LLM Research, University of Pennsylvania — Researcher** (May 2025–Present, Advisor: Prof. Chris Callison-Burch)
- Co-published paper demonstrating positive transfer on dense image caption training for vision-language models
- Led backend software development for large-scale data annotation and model training pipelines for Dense Image Captioning
- Fine-tuned LLMs on diverse datasets integrating vision and language modalities using Python and vector databases (Qdrant)
- Prototyping UI and backend to annotate scientific, cultural, and 3D visuals with high-fidelity captions

**Superintendencia de Bancos — Software Intern** (July–Aug 2024, Santo Domingo, DR)
- Built Python/SQL tools to automate macroeconomic data processing
- Implemented linear regression and time-series forecasting models for economic risk assessment
- Conducted residual analysis to reduce consumer risk and improve model robustness

**Accenture Student Leadership Program — Student Intern** (Feb–May 2025, Remote)
- Selected for Accenture's SLP; participated in business simulations focused on tech-driven consulting and data analytics

**Teaching / TA, UPenn** (June 2024–Present)
- Weingarten Center Tutor: Physics I, Multivariable Calculus, Dynamic Systems
- TA for MATH 1410 (Multivariable Calculus): led recitation sessions

## Technical Skills
- **Programming**: Python, Java, SQL, Bash, OCaml, C++, React Native, Vite
- **ML/AI**: LLM Fine-tuning, Transformers, LSTM, NLP, VLM, RAG, Model Evaluation, Backtesting
- **Frameworks/Libraries**: PyTorch, TensorFlow, Scikit-learn, XGBoost, Pandas, NumPy, Matplotlib, Seaborn
- **Engineering**: FastAPI, Docker, GCP, GitHub Actions, Qdrant, Kafka, LangGraph, Django, Git, Oracle SQL
- **Data & Modeling**: Regression, Classification, Time-Series Forecasting, Monte Carlo Simulation, Backtesting

## Projects
- **Dense Captioning Toolkit for Vision-Language Models**: Scalable Python pipelines for training and evaluating dense image captioning models; integrates multimodal datasets, annotation tools, and LLM-based caption generation
- **Multi-Agent AI System for Financial Modeling**: Distributed multi-agent architecture (Kafka + LangGraph) where specialized agents generate trading signals, run backtests, and evaluate market strategies
- **Crypto Market Prediction Platform**: End-to-end ML pipeline for ingesting market data, engineering features, training predictive models, and visualizing performance metrics for cryptocurrency forecasting

## Organizations
- **AI @ Penn** — Founding member, President of Outreach (Sept 2024–Present)
- **Penn Quantum Computing Club** (Aug 2024–Present)
- **Competitive Programming @ Penn** (Jan 2025–Present)

## Coursework
Applied Machine Learning, Theory of Machine Learning, Statistics for Data Science, Convolutional Neural Networks, Data Structures and Algorithms, Mathematics of Computer Science, Deep Machine Learning, Probability, Calculus, Linear Algebra

## Interests & Hobbies
Private Pilot, Poker, Marathon Running, Triathlons, Baking, Ceramics, Clash of Clans

## Tone
Be warm, concise, and direct. Speak about Monica in third person unless asked a first-person style question. Keep answers to 2–4 sentences unless more detail is clearly needed.`;

// Add a message to the chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    const p = document.createElement('p');
    p.textContent = text;
    messageDiv.appendChild(p);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message function
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, true);
    chatInput.value = '';
    sendButton.disabled = true;

    // Add loading message
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message loading';
    loadingDiv.id = 'loadingMessage';
    const loadingP = document.createElement('p');
    loadingP.textContent = 'Thinking…';
    loadingDiv.appendChild(loadingP);
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // IMPORTANT: Replace this with your actual API endpoint
        // For security, never expose your OpenAI API key in client-side code
        // You'll need to create a backend endpoint that handles the API call
        
        const response = await fetchChatResponse(message);
        
        // Remove loading message
        document.getElementById('loadingMessage').remove();
        
        // Add bot response
        addMessage(response);
    } catch (error) {
        // Remove loading message
        const loadingMsg = document.getElementById('loadingMessage');
        if (loadingMsg) loadingMsg.remove();
        
        const errorMsg = error.message || 'Unknown error occurred';
        addMessage(`Sorry, I encountered an error: ${errorMsg}. Please check the console for details.`);
        console.error('Error:', error);
    } finally {
        sendButton.disabled = false;
        chatInput.focus();
    }
}

// Function to fetch chat response from API
async function fetchChatResponse(userMessage) {
    // Wait a moment for config to load if it hasn't yet
    if (!window.API_CONFIG) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Get API URL from config (fallback to relative path if config not loaded)
    const apiUrl = (window.API_CONFIG && window.API_CONFIG.API_URL) || '/api/chat';
    
    console.log('Using API URL:', apiUrl);
    
    // Check if API URL is still the placeholder
    if (apiUrl.includes('your-project.vercel.app')) {
        throw new Error('Please update config.js with your actual API endpoint URL');
    }

    console.log('Sending request to:', apiUrl);
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: userMessage,
            systemPrompt: SYSTEM_PROMPT
        })
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
            console.error('Error response:', errorData);
        } catch (e) {
            errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.error || errorData.message || `API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Success response:', data);
    return data.response;
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});


