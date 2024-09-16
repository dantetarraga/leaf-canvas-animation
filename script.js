$(document).ready(function () {
    const carousel = $("#carousel");
    const slides = $(".carousel-slide");
    const canvas = $("#myCanvas");
    const ctx = canvas[0].getContext("2d");

    let currentIndex = 0;
    const slidesToShow = 4;
    const slidesToAdvance = 3; // Avance de tres slides por clic en last-slide
    const totalSlides = slides.length;

    function updateCarousel() {
        const offset = -currentIndex * (100 / slidesToShow);
        carousel.css("transform", `translateX(${offset}%)`);
        updateSlideClasses();
    }

    function updateSlideClasses() {
        slides.removeClass("last-slide first-slide");
        const startIndex = Math.max(0, currentIndex);
        const endIndex = Math.min(totalSlides, currentIndex + slidesToShow);
        const visibleSlides = slides.slice(startIndex, endIndex);

        if (visibleSlides.length > 0) {
            visibleSlides.last().addClass("last-slide");
            visibleSlides.first().addClass("first-slide");
        }
    }

    function handleLastSlideClick() {
        if (currentIndex + slidesToShow >= totalSlides) {
            currentIndex = totalSlides - slidesToShow;
        } else {
            currentIndex = Math.min(
                totalSlides - slidesToShow,
                currentIndex + slidesToAdvance
            );
        }
        updateCarousel();
    }

    function handleFirstSlideClick() {
        if (currentIndex <= 0) {
            currentIndex = 0;
        } else {
            currentIndex = Math.max(0, currentIndex - slidesToAdvance);
        }
        updateCarousel();
    }

    function updateCanvasSize(percentage) {
        canvas.css("width", "0%"); // Resetea el canvas antes de expandir
        setTimeout(() => {
            canvas.css("width", percentage); // Expande el canvas al porcentaje del slide
        }, 10); // Pequeño retraso para permitir el reset del tamaño
    }

    function drawWavyLine() {
        const width = canvas[0].width;
        const height = canvas[0].height;
        const amplitude = 50; // Amplitud más alta para ondas más pronunciadas
        const frequency = 0.02; // Frecuencia de la onda

        ctx.clearRect(0, 0, width, height); // Limpia el canvas

        ctx.beginPath();
        ctx.moveTo(0, height / 2); // Empieza en la mitad vertical del canvas

        // Dibuja una línea ondulada
        for (let x = 0; x < width; x++) {
            const y = height / 2 + amplitude * Math.sin(frequency * x);
            ctx.lineTo(x, y);
        }

        ctx.strokeStyle = "#5DAD56"; // Color verde del trazo
        ctx.lineWidth = 4;

        // Establece el patrón de línea discontinua
        ctx.setLineDash([15, 15]); // [largo del trazo, largo del espacio] en píxeles

        ctx.stroke();
    }

    function onResize() {
        // Ajusta el tamaño del canvas cuando la ventana cambia de tamaño
        canvas[0].width = window.innerWidth;
        canvas[0].height = window.innerHeight;
        drawWavyLine();
    }

    $(window).on("resize", onResize);

    $(".carousel-slide button").on("click", function () {
        const slide = $(this).parent();
        const percentage = slide.data("percentage") + "%";

        // Primero, actualiza el tamaño del canvas
        updateCanvasSize(percentage);

        // Luego, maneja el movimiento del carrusel
        setTimeout(() => {
            if (slide.hasClass("last-slide")) {
                handleLastSlideClick();
            } else if (slide.hasClass("first-slide")) {
                handleFirstSlideClick();
            }
        }, 500); // Sincroniza con la duración de la animación del canvas
    });

    updateCarousel();
    onResize(); // Inicializa el tamaño del canvas
});
