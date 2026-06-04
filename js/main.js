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

// ===== MODAL =====
function openGuideModal() {
    document.getElementById('guideModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeGuideModal() {
    document.getElementById('guideModal').classList.remove('active');
    document.body.style.overflow = '';
}
document.addEventListener('click', function(e) {
    const modal = document.getElementById('guideModal');
    if (e.target === modal) closeGuideModal();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeGuideModal();
});

// ===== GUIDE FORM (EmailJS) =====
function initGuideForm(formId, nameId, emailId, phoneId, companyId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Отправляем...';
        btn.disabled = true;

        const name = document.getElementById(nameId)?.value || '';
        const email = document.getElementById(emailId)?.value || '';
        const phone = document.getElementById(phoneId)?.value || '';
        const company = document.getElementById(companyId)?.value || '';

        emailjs.init('ВАШ_PUBLIC_KEY_EMAILJS');

        // 1 — письмо пользователю с PDF
        fetch('assets/guide.pdf')
            .then(r => r.blob())
            .then(pdfBlob => {
                const pdfFile = new File([pdfBlob], 'guide.pdf', { type: 'application/pdf' });
                return emailjs.send('ВАШ_SERVICE_ID', 'ВАШ_TEMPLATE_ID_ДЛЯ_КЛИЕНТА', {
                    to_name: name,
                    to_email: email,
                    company: company,
                    phone: phone,
                    site: 'bureau-of-talents.ru',
                }, {
                    attachments: { 'guide.pdf': pdfFile }
                });
            })
            .then(() => {
                // 2 — уведомление владельцу сайта
                return emailjs.send('ВАШ_SERVICE_ID', 'ВАШ_TEMPLATE_ID_ДЛЯ_ВЛАДЕЛЬЦА', {
                    name: name,
                    email: email,
                    phone: phone,
                    company: company,
                    owner_email: 'vi.cattleya25@gmail.com',
                });
            })
            .then(() => {
                alert('✅ Гайд отправлен на ' + email + '! Проверьте папку «Входящие» или «Спам».');
                form.reset();
                closeGuideModal();
            })
            .catch(() => {
                alert('❌ Ошибка отправки. Попробуйте позже или напишите нам: vi.cattleya25@gmail.com');
            })
            .finally(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            });
    });
}

// ===== CALLBACK FORM (Formspree) =====
function initFormHandler() {
    const form = document.getElementById('callbackForm');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Отправляем...';
        btn.disabled = true;

        const data = new FormData(form);
        fetch('https://formspree.io/f/ВАШ_ID_ФОРМЫ', {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(r => r.json()).then(() => {
            alert('✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
            form.reset();
        }).catch(() => {
            alert('❌ Ошибка отправки. Попробуйте позже или напишите нам на почту.');
        }).finally(() => {
            btn.textContent = 'Отправить заявку';
            btn.disabled = false;
        });
    });
}

// ===== CHECKBOX VALIDATION =====
function initFormValidation() {
    const forms = [
        { formId: 'callbackForm', checkboxId: 'callbackConsent' },
        { formId: 'guideFormModal', checkboxId: 'guideConsent' }
    ];

    forms.forEach(({ formId, checkboxId }) => {
        const form = document.getElementById(formId);
        const checkbox = document.getElementById(checkboxId);
        if (!form || !checkbox) return;

        const btn = form.querySelector('button[type="submit"]');
        if (btn) btn.disabled = true;

        checkbox.addEventListener('change', function() {
            if (btn) btn.disabled = !this.checked;
        });

        form.addEventListener('submit', function(e) {
            if (!checkbox.checked) {
                e.preventDefault();
                e.stopImmediatePropagation();
                alert('Необходимо согласие на обработку персональных данных');
            }
        });
    });
}

// ===== COOKIE BANNER =====
function initCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('cookieAccept');
    if (!banner || !acceptBtn) return;

    if (localStorage.getItem('cookieConsent') === 'true') {
        banner.classList.add('hidden');
        return;
    }

    acceptBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'true');
        banner.classList.add('hidden');
    });
}

function initAll() {
    initFormValidation();
    initFormHandler();
    initSmoothScroll();
    initReviewsCarousel();
    initFaqAccordion();
    initGuideForm('guideFormModal', 'guide_modal_name', 'guide_modal_email', 'guide_modal_phone', 'guide_modal_company');
    initMobileMenu();
    initCookieBanner();

    if (typeof ymaps !== 'undefined') {
        ymaps.ready(initMap);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}
// ===== MOBILE MENU =====

function initMobileMenu() {

    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');

    if (!btn || !menu) return;

    btn.addEventListener('click', () => {

        btn.classList.toggle('active');
        menu.classList.toggle('active');

    });

    menu.querySelectorAll('a').forEach(link => {

        link.addEventListener('click', () => {

            btn.classList.remove('active');
            menu.classList.remove('active');

        });

    });

    document.addEventListener('click', (e) => {

        if (
            !menu.contains(e.target) &&
            !btn.contains(e.target)
        ) {

            btn.classList.remove('active');
            menu.classList.remove('active');

        }

    });

}
