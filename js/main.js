/**
 * Main entry point for the portfolio.
 * Handles loading, intersection observers for reveal, and scroll effects.
 */

window.addEventListener('DOMContentLoaded', () => {
    // 1. Loader Handling
    const loader = document.getElementById('loader');
    
    // Wait for page load to hide loader
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1000);
        }, 500); // Slight delay for cinematic effect
    });

    // 2. Intersection Observer for Reveal Animations
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once revealed, we don't need to observe it anymore for performance
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15 // Trigger when 15% of item is visible
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Navbar Scroll Effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '1rem 0';
            nav.style.background = 'rgba(10, 10, 10, 0.9)';
        } else {
            nav.style.padding = '2rem 0';
            nav.style.background = 'linear-gradient(to bottom, rgba(10,10,10,0.8), transparent)';
        }
    });

    // 4. Set Year in Footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
