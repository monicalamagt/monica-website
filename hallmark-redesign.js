// Hallmark redesign — type-in, reveal, and command palette. Comparison build only.

document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Hero code-card type-in (plays once) ─────────────────────
    const typeLine = document.getElementById('typeLine');
    const codeResponse = document.getElementById('codeResponse');
    const fullText = '/monica';

    function showResponse() {
        if (codeResponse) codeResponse.hidden = false;
    }

    if (typeLine) {
        if (reduceMotion) {
            typeLine.textContent = fullText;
            showResponse();
        } else {
            let i = 0;
            const typeNext = () => {
                if (i <= fullText.length) {
                    typeLine.textContent = fullText.slice(0, i);
                    i++;
                    setTimeout(typeNext, 45);
                } else {
                    showResponse();
                }
            };
            setTimeout(typeNext, 300);
        }
    }

    // ── Reveal on scroll (one-shot, stagger by DOM index) ───────
    const revealEls = document.querySelectorAll('.reveal');
    if (reduceMotion) {
        revealEls.forEach(el => el.classList.add('is-in'));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('is-in'), idx * 60);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(el => observer.observe(el));
    }

    // ── Command palette ──────────────────────────────────────────
    const dialog = document.getElementById('cmdkDialog');
    const trigger = document.getElementById('cmdkTrigger');
    const input = document.getElementById('cmdkInput');
    const list = document.getElementById('cmdkList');

    const commands = [
        { label: 'Email Monica', hint: 'mailto', run: () => { window.location.href = 'mailto:mlama@wharton.upenn.edu'; } },
        { label: 'Copy email address', hint: 'clipboard', run: (item) => {
            navigator.clipboard.writeText('mlama@wharton.upenn.edu');
            const original = item.querySelector('.cmdk__label-text');
            if (original) {
                const prev = original.textContent;
                original.textContent = 'Copied ✓';
                setTimeout(() => { original.textContent = prev; }, 1800);
            }
        } },
        { label: 'Open LinkedIn', hint: '↗', run: () => window.open('https://www.linkedin.com/in/monica-lama-gonzalez-teja-782097260', '_blank', 'noopener') },
        { label: 'View résumé', hint: '↗', run: () => window.open('resume.pdf', '_blank') },
        { label: 'Go to Work', hint: '→', run: () => document.getElementById('work')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }) },
        { label: 'Go to Skills', hint: '→', run: () => document.getElementById('skills')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }) },
        { label: 'Go to Contact', hint: '→', run: () => document.getElementById('contact')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }) },
    ];

    let filtered = commands.slice();
    let selectedIndex = 0;
    let lastFocused = null;

    function renderList() {
        list.innerHTML = '';
        filtered.forEach((cmd, idx) => {
            const li = document.createElement('li');
            li.className = 'cmdk__item';
            li.id = `cmdk-item-${idx}`;
            li.setAttribute('role', 'option');
            li.setAttribute('aria-selected', idx === selectedIndex ? 'true' : 'false');
            const labelSpan = document.createElement('span');
            labelSpan.className = 'cmdk__label-text';
            labelSpan.textContent = cmd.label;
            const hintSpan = document.createElement('span');
            hintSpan.className = 'cmdk__hint';
            hintSpan.textContent = cmd.hint;
            li.appendChild(labelSpan);
            li.appendChild(hintSpan);
            li.addEventListener('click', () => runCommand(idx));
            list.appendChild(li);
        });
    }

    function runCommand(idx) {
        const cmd = filtered[idx];
        if (!cmd) return;
        const item = document.getElementById(`cmdk-item-${idx}`);
        cmd.run(item);
        if (cmd.label !== 'Copy email address') closePalette();
    }

    function openPalette() {
        lastFocused = document.activeElement;
        dialog.hidden = false;
        filtered = commands.slice();
        selectedIndex = 0;
        input.value = '';
        renderList();
        input.focus();
        document.addEventListener('keydown', onKeydown);
    }

    function closePalette() {
        dialog.hidden = true;
        document.removeEventListener('keydown', onKeydown);
        if (lastFocused) lastFocused.focus();
    }

    function onKeydown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closePalette();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
            renderList();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, 0);
            renderList();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            runCommand(selectedIndex);
        }
    }

    input.addEventListener('input', () => {
        const q = input.value.toLowerCase();
        filtered = commands.filter(c => c.label.toLowerCase().includes(q));
        selectedIndex = 0;
        renderList();
    });

    trigger.addEventListener('click', openPalette);
    dialog.querySelectorAll('[data-cmdk-close]').forEach(el => el.addEventListener('click', closePalette));

    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (dialog.hidden) openPalette();
            else closePalette();
        }
    });
});
