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

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
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

// ===== PAGE LOAD HANDLER =====
document.addEventListener('DOMContentLoaded', function() {
    initFormHandler();
    initSmoothScroll();
    
    // Яндекс карты грузятся асинхронно
    if (typeof ymaps !== 'undefined') {
        ymaps.ready(initMap);
    } else if (document.getElementById('map')) {
        // Если карта есть, но API ещё не загрузился — подождём
        console.log('Ожидание загрузки Яндекс.Карт...');
    }
});
