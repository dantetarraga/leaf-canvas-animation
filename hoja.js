document.addEventListener('DOMContentLoaded', function () {
    const splide = new Splide('#splide-prueba', {
        type: 'slide', // Usa 'slide' para transiciones horizontales
        perPage: 4, // Número de slides visibles por página
        perMove: 1,
        gap: '2rem',
        pagination: false,
        arrows: true, // Muestra los botones de navegación
        breakpoints: {
            600: {
                perPage: 1,
            },
            1000: {
                perPage: 2,
            },
        },
    }).mount();

    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    let drawnProgress = 0;

    function setCanvasSize() {
        const splideTrack = document.querySelector('.splide__track');
        if (splideTrack) {
            const trackWidth = splideTrack.clientWidth;
            canvas.width = trackWidth * 2; // Ajusta el ancho del canvas al 200% del contenedor
            canvas.height = splideTrack.clientHeight; // Ajusta la altura del canvas a la del contenedor
        }
    }

    function drawWaveSegment(startX, endX) {
        const width = canvas.width;
        const height = canvas.height;
        const centerY = height / 2;
        const amplitude = 50;
        const frequency = 0.02;
        const segmentLength = 10;

        ctx.beginPath();
        ctx.moveTo(startX, centerY);

        for (let i = startX; i <= endX && i <= width; i++) {
            const y = amplitude * Math.sin(frequency * i) + centerY;
            ctx.lineTo(i, y);
            
            if (i % segmentLength === 0) {
                ctx.moveTo(i, y);
            }
        }

        ctx.strokeStyle = '#007000';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    function drawWaveIncrementally(targetProgress) {
        const interval = 30;
        const increment = 10;
        const maxProgress = (canvas.width / 200) * targetProgress;

        function step() {
            if (drawnProgress < maxProgress) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawWaveSegment(0, drawnProgress);
                drawnProgress += increment;

                if (drawnProgress > maxProgress) {
                    drawnProgress = maxProgress;
                }

                setTimeout(step, interval);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawWaveSegment(0, maxProgress);
            }
        }

        step();
    }

    function resetProgress() {
        drawnProgress = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function updateCanvasForCurrentPage() {
        const currentPage = splide.index; // Página actual
        const slidesPerPage = splide.options.perPage; // Número de slides por página
        const totalSlides = splide.length; // Total de slides
        const totalPages = Math.ceil(totalSlides / slidesPerPage); // Total de páginas
        const currentPageNumber = Math.floor(currentPage / slidesPerPage) + 1;
        
        const currentProgress = ((currentPage % slidesPerPage) + 1) * (100 / slidesPerPage); // Calcula el progreso basado en la página actual
        
        // Actualiza el aria-label
        const ariaLabel = `${currentPageNumber} of ${totalPages}`;
        document.querySelector('#splide-prueba').setAttribute('aria-label', ariaLabel);
        
        // Avanza a la siguiente página cuando se llegue al final
        if ((currentPage + 1) % slidesPerPage === 0 && currentPage + 1 < totalSlides) {
            splide.go(`+=${slidesPerPage}`); // Avanza `slidesPerPage` páginas
        }

        // Actualiza el canvas
        resetProgress();
        drawWaveIncrementally(currentProgress);
    }

    // Maneja el evento de cambio de slide
    splide.on('moved', updateCanvasForCurrentPage);

    document.querySelectorAll('.build-btn').forEach(button => {
        button.addEventListener('click', function () {
            const progressValue = parseInt(this.getAttribute('data-progress'));

            setCanvasSize();
            drawWaveIncrementally(progressValue);
        });
    });

    window.addEventListener('resize', setCanvasSize);

    // Inicializa el tamaño del canvas y actualiza la página actual
    setCanvasSize();
    updateCanvasForCurrentPage();
});
