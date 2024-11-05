
document.querySelectorAll('.service').forEach(service => {
    let currentSlide = 0;
    const slides = service.querySelectorAll('.service-img-slide .slide');
    const totalSlides = slides.length;

    function showSlide(index) {
        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }

        const slideWidth = slides[0].clientWidth;
        const offset = -currentSlide * slideWidth;
        service.querySelector('.service-img-slide').style.transform = `translateX(${offset}px)`;
    }

    function autoSlide() {
        currentSlide++;
        showSlide(currentSlide);
    }

    setInterval(autoSlide, 5000);
    showSlide(currentSlide);
});

let OpenMenu = document.getElementById('OpenMenu');
let CloseMenu = document.getElementById('CloseMenu');
let NavItems = document.querySelector('.NavItems');

let OpenNavMenu = () => {
   OpenMenu.style.display="None";
   CloseMenu.style.display="block";
   NavItems.style.display="block";
   
}
let CloseNavMenu = () => {
   OpenMenu.style.display="block";
   CloseMenu.style.display="None";
   NavItems.style.display="none";
}

function animateCount(element, target) {
    const duration = 2000;
    const frameRate = 60;
    const totalFrames = Math.round((duration / 1000) * frameRate);
    const increment = target / totalFrames;
    let currentCount = 0;
    let frame = 0;

    const counterInterval = setInterval(() => {
        frame++;
        currentCount += increment;

        if (frame >= totalFrames) {
            clearInterval(counterInterval);
            element.innerText = target.toLocaleString();
        } else {
            element.innerText = Math.round(currentCount).toLocaleString();
        }
    }, duration / totalFrames);
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const statsSection = entry.target;

        if (entry.isIntersecting) {
            const counters = statsSection.querySelectorAll('.stat-no');
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                animateCount(counter, target);
            });
            observer.unobserve(statsSection);
        }
    });
}, { threshold: 0.5 });

observer.observe(document.getElementById('stats-section'));