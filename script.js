/**
 * Portfolio Script
 * Custom cursor, preloader animations, scroll reveal, and text scrambling.
 */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCustomCursor();
    initScrollReveal();
    initTextScramble();
});

/* ==========================================
   1. PRELOADER
   ========================================== */
function initPreloader() {
    const loader = document.getElementById('loader');
    const ldNum = document.getElementById('ld-num');
    const ldProg = document.getElementById('ld-prog');
    const ldStatus = document.getElementById('ld-status');
    const ticks = document.querySelectorAll('.ld-t');
    
    if (!loader) return;
    
    const statusMessages = [
        "Initializing core modules...",
        "Configuring grid architectures...",
        "Compiling style utilities...",
        "Fetching selected works...",
        "Mounting interactive viewport...",
        "Rendering experiences...",
        "System Ready."
    ];
    
    let count = 0;
    
    const interval = setInterval(() => {
        // Fast at start, slower at end for smooth loading feel
        let increment = 1;
        if (count < 40) {
            increment = Math.floor(Math.random() * 4) + 2;
        } else if (count < 85) {
            increment = Math.floor(Math.random() * 2) + 1;
        } else {
            increment = Math.floor(Math.random() * 2);
        }
        
        count = Math.min(count + increment, 100);
        
        // Update number and progress bar width
        ldNum.textContent = count;
        ldProg.style.width = `${count}%`;
        
        // Update status messages periodically
        const msgIndex = Math.min(Math.floor((count / 100) * statusMessages.length), statusMessages.length - 1);
        ldStatus.textContent = statusMessages[msgIndex];
        
        // Active ticks based on count
        const tickIndex = Math.min(Math.floor((count / 100) * ticks.length), ticks.length - 1);
        ticks.forEach((tick, i) => {
            if (i <= tickIndex) {
                tick.classList.add('active');
            }
        });
        
        if (count >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('loaded');
                // Trigger hero entrance reveals shortly after loader finishes sliding
                document.querySelectorAll('.hero .reveal, .hero .reveal-up').forEach(el => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, 250);
                });
            }, 600);
        }
    }, 45);
}

/* ==========================================
   2. CUSTOM CURSOR
   ========================================== */
function initCustomCursor() {
    const cur = document.getElementById('cur');
    const curR = document.getElementById('cur-r');
    
    if (!cur || !curR) return;
    
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    
    // Exact tracking for the small dot
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cur.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });
    
    // Lerp tracking for the ring (creates smooth lag effect)
    function animateRing() {
        // Interpolation: current = current + (target - current) * factor
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        
        curR.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        
        requestAnimationFrame(animateRing);
    }
    animateRing();
    
    // Interactive hover triggers
    const hoverElements = document.querySelectorAll('a, button, .skill-row');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (el.closest('.project-card') || el.classList.contains('project-card')) {
                document.body.classList.add('hover-thumb');
            } else {
                document.body.classList.add('hover-link');
            }
        });
        
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hover-link');
            document.body.classList.remove('hover-thumb');
        });
    });
}

/* ==========================================
   3. SCROLL REVEAL (IntersectionObserver)
   ========================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-up');
    
    if (revealElements.length === 0) return;
    
    const observerOptions = {
        root: null, // viewport
        threshold: 0.1, // 10% visible
        rootMargin: "0px 0px -50px 0px" // triggers slightly before scrolling fully in
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class
                entry.target.classList.add('visible');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => {
        // Skip hero reveals as they are animated on loader finish
        if (el.closest('.hero')) return;
        observer.observe(el);
    });
}

/* ==========================================
   4. TEXT SCRAMBLE EFFECT
   ========================================== */
function initTextScramble() {
    const scrambleElements = document.querySelectorAll('[data-scramble]');
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    
    function scramble(el) {
        const targetText = el.getAttribute('data-scramble');
        let iteration = 0;
        
        // Clear running interval for this specific element to prevent overlaps
        if (el.scrambleInterval) {
            clearInterval(el.scrambleInterval);
        }
        
        el.scrambleInterval = setInterval(() => {
            el.textContent = targetText
                .split("")
                .map((char, index) => {
                    if (char === " ") return " ";
                    if (index < iteration) {
                        return targetText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");
                
            if (iteration >= targetText.length) {
                clearInterval(el.scrambleInterval);
                el.scrambleInterval = null;
                
                // Custom check for logo to restore its child tags
                if (targetText === "BINS") {
                    el.innerHTML = 'BINS<span>®</span>';
                } else {
                    el.textContent = targetText;
                }
            }
            
            iteration += 1 / 3;
        }, 30);
    }
    
    scrambleElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            scramble(el);
        });
    });
}
