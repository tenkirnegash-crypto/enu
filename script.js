document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for fade-in animations on scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Check if element is already in viewport on load, if so add visible class immediately
    // Wait a tiny bit so the initial hero elements animate gracefully rather than popping in instantly before CSS loads completely
    setTimeout(() => {
        fadeElements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 100); // Stagger initial load
            }
        });
    }, 100);

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        if (!el.classList.contains('visible')) {
            observer.observe(el);
        }
    });

    // 2. Floating Hearts Background Generator
    const heartsContainer = document.getElementById('hearts-container');
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        
        // Randomize the start horizontal position
        heart.style.left = Math.random() * 100 + 'vw';
        
        // Randomize animation duration between 5s and 10s
        const animationDuration = 5 + Math.random() * 5;
        heart.style.animationDuration = animationDuration + 's';
        
        // Randomly pick a color slightly different from main accent sometimes
        const colors = ['#a31d4e', '#c94c73', '#e098a8'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        heart.style.backgroundColor = randomColor;
        
        // Apply color using a small CSS hack (since the ::before/after need the color but can't be styled directly here easily)
        // Instead, we will use a CSS variable specific to this element
        heart.style.setProperty('--accent', randomColor);
        
        // Randomize size slightly
        const scale = 0.5 + Math.random() * 1;
        heart.style.transform = `scale(${scale})`; // Doesn't persist due to the animation keyframes, but kept if we need simple static elements. We handle scale in keyframes.

        heartsContainer.appendChild(heart);
        
        // Remove heart after animation finishes to prevent DOM bloat
        setTimeout(() => {
            heart.remove();
        }, animationDuration * 1000);
    }

    // Create a new heart every few milliseconds
    setInterval(createHeart, 600);
    // 3. Slider logic
    const sliderTrack = document.getElementById('photo-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if(sliderTrack && prevBtn && nextBtn) {
        // Button navigation
        nextBtn.addEventListener('click', () => {
            sliderTrack.scrollBy({ left: sliderTrack.clientWidth * 0.8, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            sliderTrack.scrollBy({ left: -sliderTrack.clientWidth * 0.8, behavior: 'smooth' });
        });

        // Mouse Drag to slide functionality
        let isDown = false;
        let startX;
        let scrollLeft;

        sliderTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            sliderTrack.style.scrollBehavior = 'auto'; // allow immediate drag without snap delay
            startX = e.pageX - sliderTrack.offsetLeft;
            scrollLeft = sliderTrack.scrollLeft;
        });

        sliderTrack.addEventListener('mouseleave', () => {
            isDown = false;
            sliderTrack.style.scrollBehavior = 'smooth';
        });

        sliderTrack.addEventListener('mouseup', () => {
            isDown = false;
            sliderTrack.style.scrollBehavior = 'smooth';
        });

        sliderTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - sliderTrack.offsetLeft;
            const walk = (x - startX) * 2; // scroll sliding speed
            sliderTrack.scrollLeft = scrollLeft - walk;
        });
    }
});
