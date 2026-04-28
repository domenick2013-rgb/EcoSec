document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for fade-in animations on scroll
    const cards = document.querySelectorAll('.card');
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, observerOptions);

    cards.forEach((card, index) => {
        setTimeout(() => {
            observer.observe(card);
            const rect = card.getBoundingClientRect();
            if(rect.top < window.innerHeight) card.classList.add('visible');
        }, index * 100); 
    });

    // 2. Set active nav link dynamically based on current URL
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) link.classList.add('active');
    });

    // 3. Dark Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');
    
    // Check local storage for theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if(theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // 4. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        const icon = menuToggle.querySelector('i');
        if(navLinks.classList.contains('show')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // 5. Interactive Background (Dynamic Gradient Shift)
    const body = document.querySelector('body');
    body.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const theme = htmlElement.getAttribute('data-theme');
        const color1 = theme === 'dark' ? '#111827' : '#f6f8fd';
        const color2 = theme === 'dark' ? '#1f2937' : '#f1f5f9';
        body.style.background = `linear-gradient(${135 + (x * 10)}deg, ${color1} 0%, ${color2} 100%)`;
    });
});
