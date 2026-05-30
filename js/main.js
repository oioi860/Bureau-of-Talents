// ===== YANDEX MAPS INITIALIZATION =====
function initMap() {
    if (typeof ymaps !== 'undefined') {
        var myMap = new ymaps.Map("map", {
            center: [55.7558, 37.6176],
            zoom: 14,
            controls: ['zoomControl', 'fullscreenControl']
        });
        var placemark = new ymaps.Placemark([55.7558, 37.6176], {
            balloonContent: "Bureau of Talents<br>Адрес вашего офиса"
        });
        myMap.geoObjects.add(placemark);
    }
}

// ===== FORM HANDLER (DEMO MODE) =====
function initFormHandler() {
    const form = document.getElementById('callbackForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email')?.value || 'не указан';
            alert('✅ Форма заглушка. После согласования добавим отправку на почту ' + email);
        });
    }
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ===== REVIEWS CAROUSEL (БЕСКОНЕЧНЫЙ LOOP) =====
function initReviewsCarousel() {
    const wrapper = document.querySelector('.reviews-wrapper');
    const slides = document.querySelectorAll('.review-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.dots-container');
    
    if (!wrapper || slides.length === 0) return;
    
    const totalSlides = slides.length;
    let currentIndex = 0;
    
    // Клонируем первый и последний слайд для бесконечного эффекта
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[totalSlides - 1].cloneNode(true);
    
    wrapper.appendChild(firstClone);
    wrapper.insertBefore(lastClone, wrapper.firstChild);
    
    // Обновляем коллекцию слайдов
    const allSlides = document.querySelectorAll('.review-slide');
    const totalClonedSlides = allSlides.length;
    
    // Сдвигаем на 1 (из-за клона в начале)
    wrapper.style.transform = `translateX(-100%)`;
    
    // Создаём точки (только для оригинальных слайдов)
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    function updateDots() {
        let originalIndex = currentIndex;
        if (originalIndex < 0) originalIndex = totalSlides - 1;
        if (originalIndex >= totalSlides) originalIndex = 0;
        
        document.querySelectorAll('.dot').forEach((dot, idx) => {
            if (idx === originalIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }
    
    function goToSlide(index, noTransition = false) {
        if (noTransition) {
            wrapper.style.transition = 'none';
        } else {
            wrapper.style.transition = 'transform 0.4s ease-in-out';
        }
        
        // +1 из-за клона в начале
        wrapper.style.transform = `translateX(-${(index + 1) * 100}%)`;
        currentIndex = index;
        updateDots();
    }
    
    function nextSlide() {
        let newIndex = currentIndex + 1;
        goToSlide(newIndex);
        
        // Если дошли до клона последнего оригинала
        if (newIndex === totalSlides) {
            setTimeout(() => {
                goToSlide(0, true);
            }, 400);
        }
    }
    
    function prevSlide() {
        let newIndex = currentIndex - 1;
        goToSlide(newIndex);
        
        // Если дошли до клона первого оригинала
        if (newIndex === -1) {
            setTimeout(() => {
                goToSlide(totalSlides - 1, true);
            }, 400);
        }
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
}

// ===== FAQ ACCORDION =====
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
}

// ===== PAGE LOAD HANDLER =====
document.addEventListener('DOMContentLoaded', function() {
    initFormHandler();
    initSmoothScroll();
    initReviewsCarousel();
    initFaqAccordion();
    
    if (typeof ymaps !== 'undefined') {
        ymaps.ready(initMap);
    }
});
