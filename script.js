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

    // 4. PDF Generation using html2pdf
    const downloadBtn = document.getElementById('download-pdf-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // --- Robust PDF Generation using an Iframe ---

            // 1. Update UI to show loading state
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Генеруємо PDF...';
            downloadBtn.disabled = true;

            // 2. Create a hidden iframe to act as a clean rendering environment
            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = 'none';
            document.body.appendChild(iframe);

            const iframeDoc = iframe.contentWindow.document;

            // 3. Get the content to print and prepare it
            const contentToPrint = document.getElementById('resume-content').cloneNode(true);
            contentToPrint.classList.add('pdf-export'); // Apply special print styles

            // 4. Write content and styles into the iframe
            iframeDoc.open();
            iframeDoc.write(`
                <html>
                <head>
                    <link rel="stylesheet" href="${window.location.origin}/style.css">
                    <style>
                        /* Ensure body has no margin and content has a defined width */
                        body { margin: 0; padding: 0; background: white; }
                        #resume-content { width: 800px !important; } 
                    </style>
                </head>
                <body></body>
                </html>
            `);
            iframeDoc.body.appendChild(contentToPrint);
            iframeDoc.close();

            // 5. Wait for the iframe content (especially styles) to load, then generate PDF
            iframe.onload = () => {
                // Add a small delay to ensure all styles from the external stylesheet are applied
                setTimeout(() => {
                    const opt = {
                        margin:       10,
                        filename:     'Myts_Vadym_Resume.pdf',
                        image:        { type: 'jpeg', quality: 0.98 },
                        html2canvas:  { scale: 2, useCORS: true, logging: false, width: 800 },
                        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    };

                    html2pdf().set(opt).from(contentToPrint).save().finally(() => {
                        // 6. Cleanup: Restore button and remove the iframe
                        downloadBtn.innerHTML = originalText;
                        downloadBtn.disabled = false;
                        document.body.removeChild(iframe);
                    });
                }, 200); // 200ms delay for styles to apply
            };
        });
    }

    // 5. Interactive Background (Dynamic Gradient Shift)
    const body = document.querySelector('body');
    body.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        body.style.background = `linear-gradient(${135 + (x * 10)}deg, var(--gradient-bg-1) 0%, var(--gradient-bg-2) 100%)`;
    });
});
