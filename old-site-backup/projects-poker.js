const pokerProjects = [
    {
        title: "Crypt0nest.io",
        suit: "♠",
        description: "AI/ML R&D internship building LSTM & Transformer pipelines for crypto asset modeling. Reduced MAPE 15%, F1 +12%. Built multi-agent trading architecture with Kafka & LangGraph.",
        tech: "Python · LSTM · Transformers · Kafka · LangGraph · Docker · GCP",
        url: "project-alpha.html"
    },
    {
        title: "LLM Research @ Penn",
        suit: "♥",
        description: "Researcher under Prof. Chris Callison-Burch. Co-published paper on dense image caption training for vision-language models. Built large-scale annotation and training pipelines.",
        tech: "Python · PyTorch · Qdrant · VLM · Fine-tuning · Vector Databases",
        url: "design-system.html"
    },
    {
        title: "Stock Prediction",
        suit: "♦",
        description: "Multimodal neural network framework predicting stock returns using price features + FinBERT sentiment. Achieved 0.76 Sharpe ratio and 42.8% total return, outperforming S&P 500.",
        tech: "PyTorch · FinBERT · NDCG · XGBoost · Time-Series CV",
        url: "mobile-app.html"
    },
    {
        title: "Dense Captioning",
        suit: "♣",
        description: "Scalable Python pipelines for training and evaluating dense image captioning models. Integrates multimodal datasets, annotation tools, and LLM-based caption generation for scientific and cultural visuals.",
        tech: "Python · PyTorch · Multimodal · LLM · Qdrant · Annotation Pipelines",
        url: "api-platform.html"
    },
    {
        title: "Superintendencia",
        suit: "♥",
        description: "Software internship at the Dominican Republic's central banking regulator. Built Python/SQL tools to automate macroeconomic data processing and implemented time-series forecasting models for economic risk assessment.",
        tech: "Python · SQL · Linear Regression · Time-Series · Statistical Analysis",
        url: "data-visualization.html"
    }
];

class PokerProjectsPage {
    constructor() {
        this.page4 = document.querySelector('.page-4');
        this.cardStackContainer = document.getElementById('cardStackContainer');
        this.state = 'idle'; // idle | dealing | pre-reveal | revealing | done
        if (!this.page4) return;
        this.init();
    }

    init() {
        this.createCardStack();
        this.createDealButton();
    }

    // ── Initial table state ───────────────────────────────────────

    createCardStack() {
        if (!this.cardStackContainer) return;
        const stack = document.createElement('div');
        stack.className = 'card-stack';
        stack.id = 'pokerCardStack';
        for (let i = 0; i < pokerProjects.length; i++) {
            const c = document.createElement('div');
            c.className = 'card-back';
            stack.appendChild(c);
        }
        this.cardStackContainer.appendChild(stack);
    }

    createDealButton() {
        const btn = document.createElement('button');
        btn.className = 'deal-button';
        btn.id = 'dealButton';
        btn.innerHTML = '<span class="deal-button-text">DEAL</span>';
        this.page4.appendChild(btn);
        btn.addEventListener('click', () => {
            if (this.state === 'idle') this.startDeal(btn);
        });
    }

    // ── Deal phase ────────────────────────────────────────────────

    startDeal(btn) {
        this.state = 'dealing';
        const stack = document.getElementById('pokerCardStack');

        [btn, stack].forEach(el => {
            if (!el) return;
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            el.style.opacity = '0';
            el.style.transform = el === btn ? 'translateX(-50%) scale(0.8)' : 'scale(0.8)';
        });

        setTimeout(() => {
            btn?.remove();
            stack?.remove();
            this.deal();
        }, 350);
    }

    deal() {
        const pw = this.page4.offsetWidth;
        const ph = this.page4.offsetHeight;

        // Responsive card size
        let cw, gap;
        if (pw < 400)      { cw = 90;  gap = 10; }
        else if (pw < 640) { cw = 110; gap = 12; }
        else               { cw = 180; gap = 22; }
        const ch = Math.round(cw * 1.4);
        const spacing = cw + gap;

        // Board (community): 3 cards centered, above page center
        const boardY  = -(ph * 0.13);
        const halfGap = cw / 2 + gap / 2;
        const boardXs = [-spacing, 0, spacing];

        // Hand (hole): 2 cards centered, below page center
        const handY  = ph * 0.19;
        const handXs = [-halfGap, halfGap];

        // Deal hand cards first (projects 0–1)
        pokerProjects.slice(0, 2).forEach((project, i) => {
            setTimeout(() => this.spawnFaceDown(project, handXs[i], handY, cw, ch, 10), i * 200);
        });

        // Deal board cards next (projects 2–4), slight delay
        pokerProjects.slice(2, 5).forEach((project, i) => {
            setTimeout(() => this.spawnFaceDown(project, boardXs[i], boardY, cw, ch, 5), 400 + i * 200);
        });

        // Table labels appear just before REVEAL button
        setTimeout(() => this.addTableLabels(boardY, handY, ch), 400 + 2 * 200 + 200);

        // REVEAL button after all 5 cards are dealt
        setTimeout(() => {
            this.state = 'pre-reveal';
            this.showRevealButton();
        }, 400 + 2 * 200 + 600);
    }

    spawnFaceDown(project, dealX, dealY, cw, ch, zIndex) {
        const card = document.createElement('div');
        card.className = 'project-card dealing poker-facedown';
        card.dataset.dealX   = dealX;
        card.dataset.dealY   = dealY;
        card.dataset.project = JSON.stringify(project);

        card.style.cssText = `
            width:${cw}px; height:${ch}px;
            position:absolute;
            left:50%; top:50%;
            margin-left:${-cw / 2}px; margin-top:${-ch / 2}px;
            z-index:${zIndex};
        `;
        card.style.setProperty('--deal-x', `${dealX}px`);
        card.style.setProperty('--deal-y', `${dealY}px`);
        card.style.setProperty('--deal-rotate', '0deg');

        card.innerHTML = this.faceDownHTML(cw);
        this.page4.appendChild(card);

        // After the CSS deal animation (0.8s), lock transform via inline style
        setTimeout(() => {
            card.classList.remove('dealing');
            card.style.transform = `translate(${dealX}px,${dealY}px)`;
            card.style.opacity   = '1';
            card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
        }, 850);
    }

    faceDownHTML(cw) {
        const fs = Math.round(cw * 0.15);
        return `
            <div style="
                width:100%;height:100%;
                background:#E8E3D8;border:2.5px solid #5C4033;border-radius:6px;
                display:flex;align-items:center;justify-content:center;
                font-family:Georgia,serif;font-size:${fs}px;color:#8B6F47;letter-spacing:0.15em;
                position:relative;overflow:hidden;
                box-shadow:0 4px 16px rgba(0,0,0,0.25);
            ">
                <span style="position:relative;z-index:2">ML</span>
                <div style="position:absolute;inset:0;z-index:1;background-image:
                    repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(92,64,51,0.07) 20px,rgba(92,64,51,0.07) 21px),
                    repeating-linear-gradient(-45deg,transparent,transparent 20px,rgba(92,64,51,0.07) 20px,rgba(92,64,51,0.07) 21px);">
                </div>
            </div>
        `;
    }

    addTableLabels(boardY, handY, ch) {
        const mkLabel = (text, y) => {
            const el = document.createElement('div');
            el.className = 'poker-table-label';
            el.textContent = text;
            el.style.cssText = `
                position:absolute;
                left:50%; top:50%;
                transform:translate(-50%, calc(${y}px - ${ch / 2 + 28}px));
                font-size:0.65rem;font-weight:300;letter-spacing:2px;
                text-transform:uppercase;color:rgba(232,227,216,0.35);
                pointer-events:none;white-space:nowrap;
                opacity:0;transition:opacity 0.5s ease;
            `;
            this.page4.appendChild(el);
            requestAnimationFrame(() => requestAnimationFrame(() => { el.style.opacity = '1'; }));
            return el;
        };

        mkLabel('board',     boardY);
        mkLabel('your hand', handY);
    }

    // ── Reveal phase ──────────────────────────────────────────────

    showRevealButton() {
        const btn = document.createElement('button');
        btn.className = 'continue-button';
        btn.id = 'revealButton';
        btn.textContent = 'REVEAL HAND';
        btn.style.opacity = '0';
        btn.style.transition = 'opacity 0.4s ease, background 0.3s ease, transform 0.2s ease';
        this.page4.appendChild(btn);
        requestAnimationFrame(() => requestAnimationFrame(() => { btn.style.opacity = '1'; }));
        btn.addEventListener('click', () => {
            if (this.state === 'pre-reveal') this.revealAll(btn);
        });
    }

    revealAll(btn) {
        this.state = 'revealing';
        btn.style.opacity = '0';
        setTimeout(() => btn.remove(), 400);

        const cards = [...this.page4.querySelectorAll('.poker-facedown')];
        cards.forEach((card, i) => {
            setTimeout(() => this.flipToFaceUp(card), i * 320);
        });

        setTimeout(() => { this.state = 'done'; }, cards.length * 320 + 400);
    }

    flipToFaceUp(card) {
        const dealX   = parseFloat(card.dataset.dealX);
        const dealY   = parseFloat(card.dataset.dealY);
        const project = JSON.parse(card.dataset.project);
        const cw      = parseInt(card.style.width);
        const isRed   = project.suit === '♥' || project.suit === '♦';

        card.classList.remove('poker-facedown');
        card.classList.add('poker-faceup');

        // Phase 1: fold card away (scaleX → 0)
        card.style.transition = 'transform 0.14s ease-in';
        card.style.transform  = `translate(${dealX}px,${dealY}px) scaleX(0)`;

        setTimeout(() => {
            // Swap to project card content
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-face card-front">
                        <div class="card-title" style="font-size:${cw * 0.065}px">${project.title}</div>
                        <div class="${isRed ? 'card-suit-red' : 'card-suit-black'}"
                             style="font-size:${cw * 0.2}px;text-align:center;margin:0.5rem 0">${project.suit}</div>
                        <div class="chip-badge" style="font-size:${cw * 0.042}px">click to view</div>
                    </div>
                    <div class="card-face card-back">
                        <p class="card-description" style="font-size:${cw * 0.047}px">${project.description}</p>
                        <p class="card-tech"        style="font-size:${cw * 0.042}px">${project.tech}</p>
                        <div class="card-links">
                            <a href="${project.url}" class="card-link"
                               onclick="event.stopPropagation()">view →</a>
                        </div>
                    </div>
                </div>
            `;

            // Phase 2: unfold new face
            card.style.transition = 'transform 0.14s ease-out';
            card.style.transform  = `translate(${dealX}px,${dealY}px) scaleX(1)`;

            setTimeout(() => {
                card.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease';
                this.wireInteractions(card, dealX, dealY, project.url);
            }, 150);
        }, 140);
    }

    wireInteractions(card, dealX, dealY, url) {
        const base = `translate(${dealX}px,${dealY}px)`;
        const lift = `translate(${dealX}px,${dealY - 16}px) scale(1.05)`;

        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('flipped')) {
                card.style.transform = lift;
                card.style.zIndex = '100';
            }
        });
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('flipped')) {
                card.style.transform = base;
                card.style.zIndex = '';
            }
        });
        card.addEventListener('click', () => {
            window.location.href = url;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new PokerProjectsPage());
