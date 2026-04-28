document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for fade-in animations on scroll
    const cards = document.querySelectorAll('.card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    cards.forEach((card, index) => {
        // Add a slight delay for initial load so cards cascade in
        setTimeout(() => {
            observer.observe(card);
            // If the card is already in viewport on load, make it visible immediately
            const rect = card.getBoundingClientRect();
            if(rect.top < window.innerHeight) {
                card.classList.add('visible');
            }
        }, index * 100); 
    });

    // 2. Set active nav link dynamically based on current URL
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });

    // 3. Simple glowing mouse effect on the body background
    const body = document.querySelector('body');
    body.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Slightly shift background gradient based on mouse position
        body.style.background = `linear-gradient(${135 + (x * 20)}deg, #f6f8fd 0%, #f1f5f9 100%)`;
    });
});
