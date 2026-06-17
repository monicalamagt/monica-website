document.addEventListener('DOMContentLoaded', function() {
    // Ensure page starts at the top
    window.scrollTo(0, 0);
    
    let cursor = document.querySelector('.custom-cursor');
    
    // Ensure cursor exists and is visible
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
    }
    
    // Make sure cursor is always visible
    cursor.style.display = 'block';
    cursor.style.visibility = 'visible';
    cursor.style.opacity = '1';
    
    // Store last known position to prevent glitching
    let lastX = window.innerWidth / 2;
    let lastY = window.innerHeight / 2;
    
    // Update cursor position on mouse move
    function updateCursor(e) {
        if (!cursor) return;
        
        // Update position smoothly
        lastX = e.clientX;
        lastY = e.clientY;
        
        cursor.style.left = lastX + 'px';
        cursor.style.top = lastY + 'px';
        
        // Ensure visibility
        cursor.style.display = 'block';
        cursor.style.visibility = 'visible';
        cursor.style.opacity = '1';
        
        // Update z-index based on modal state
        const modal = document.getElementById('projectModal');
        const isModalOpen = modal && modal.classList.contains('active');
        const zIndex = isModalOpen ? '10001' : '999999';
        cursor.style.setProperty('z-index', zIndex, 'important');
    }
    
    // Track mouse movement
    document.addEventListener('mousemove', updateCursor, { passive: true });
    window.addEventListener('mousemove', updateCursor, { passive: true });
    
    // Watch for modal changes to update z-index
    const modal = document.getElementById('projectModal');
    if (modal) {
        const observer = new MutationObserver(function() {
            if (cursor) {
                const isModalOpen = modal.classList.contains('active');
                const zIndex = isModalOpen ? '10001' : '999999';
                cursor.style.setProperty('z-index', zIndex, 'important');
                // Ensure cursor stays visible
                cursor.style.display = 'block';
                cursor.style.visibility = 'visible';
                cursor.style.opacity = '1';
            }
        });
        observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
    }
    
    // Smooth gradient fade effect when scrolling from page 1 to page 2
    const page1 = document.querySelector('.page-1');
    const page2 = document.querySelector('.page-2');
    const page3 = document.querySelector('.page-3');
    
    if (page1 && page2) {
        // Create a style element to control body::before opacity
        const style = document.createElement('style');
        document.head.appendChild(style);
        
        function updateGradient() {
            const scrollY = window.scrollY;
            const page1Height = page1.offsetHeight;
            
            let opacity = 0;
            
            // Only show gradient during transition from page 1 (before reaching page 2)
            const transitionStart = page1Height * 0.3;
            const transitionEnd = page1Height * 0.9; // End transition before page 2 starts
            
            if (scrollY >= transitionStart && scrollY < transitionEnd) {
                // Fade in during transition, but fade out before reaching page 2
                const scrollRange = transitionEnd - transitionStart;
                const progress = (scrollY - transitionStart) / scrollRange;
                // Fade in first half, fade out second half
                if (progress < 0.5) {
                    opacity = progress / 0.5;
                } else {
                    opacity = (1 - progress) / 0.5;
                }
                opacity = Math.max(0, Math.min(1, opacity));
            }
            // opacity stays 0 for page 2 and beyond
            
            // Directly update the style
            style.textContent = `body::before { opacity: ${opacity} !important; }`;
        }
        
        window.addEventListener('scroll', updateGradient, { passive: true });
        updateGradient();
    }

// Section navigation dots
    const pages = document.querySelectorAll('.page');
    const navDots = document.querySelectorAll('.nav-dot');
    const pageNav = document.querySelector('.page-nav');
    const projectModal = document.getElementById('projectModal');

    if (navDots.length && pages.length) {
        const pageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = Array.from(pages).indexOf(entry.target);
                    navDots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
                    // Light dots on dark poker page (now index 2)
                    pageNav.classList.toggle('nav-light', idx === 2);
                }
            });
        }, { threshold: 0.5 });

        pages.forEach(page => pageObserver.observe(page));

        navDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                pages[i]?.scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Hide nav dots while project modal is open
        if (projectModal) {
            const modalObserver = new MutationObserver(() => {
                const isOpen = projectModal.classList.contains('active');
                pageNav.style.opacity = isOpen ? '0' : '';
                pageNav.style.pointerEvents = isOpen ? 'none' : '';
            });
            modalObserver.observe(projectModal, { attributes: true, attributeFilter: ['class'] });
        }
    }

});
