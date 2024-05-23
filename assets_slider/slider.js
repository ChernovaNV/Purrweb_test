const images = ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png', '08.png', '09.png', '10.png'];

let activeImage = 0,
    animateFlag = false,
    dotClickFlag = false,
    direction = '',
    duration = 800,
    lastActiveImage = activeImage;


document.addEventListener('DOMContentLoaded', function () {   
const slider = document.querySelector('.slider'),
    container = document.querySelector('.slider__inner'),
    track = document.querySelector('.slider__line'),
    btnPrev = document.querySelector('.slider__btn-prev'),
    btnNext = document.querySelector('.slider__btn-next'),
    
    itemWidth = container.clientWidth;
    console.log(itemWidth);

      
    track.style.width = 3 * itemWidth + 'px';
    track.style.transform = `translateX(-${itemWidth}px)`;
    
//создание слайда для добавления в html
const createImg = (currentImg, width) => {
    const img = document.createElement ('img');
    img.alt = '';
    img.src = './assets_slider/img/' + images[currentImg];
    
    if(width) img.style.width = 0;
    return img;
}

const nextImageGenerate = (id = activeImage) => {
    let nextImage = id + 1;
    if(nextImage >= images.length) nextImage = 0;
    track.append(createImg(nextImage));
}

const prevImageGenerate = (id = activeImage, w = false) => {
    let prevImage = id - 1;
    if(prevImage < 0) prevImage = images.length - 1;

    track.prepend(createImg(prevImage, w));
}

//создание пагинации
const createDots = () => {
    const list = document.querySelector('.slider__dots');
    
    for(let i = 0; i < images.length; i++) {
        const li = document.createElement('li');
        li.classList.add('slider__dots-item');
        li.setAttribute('id', i)
        if(i == activeImage) li.style.backgroundColor = '#fff';
        list.append(li);	
    }
} 


const initSlider = () => {
    track.append(createImg(activeImage));
    prevImageGenerate();
    nextImageGenerate();
    createDots();
}


const changeSlide = (id = activeImage) => {
    lastActiveImage = activeImage;

    //предотвращение сбоя анимации при повторном нажатии
    if(animateFlag) return;
    animateFlag = !animateFlag;

    //переключениt слайдов
    if(direction == 'next') {
        if(dotClickFlag)  {
            activeImage = id;
            if(activeImage >= images.length) activeImage = 0;
            document.querySelector('.slider__line img:last-child').remove();
            nextImageGenerate(--id);
        } else {
            activeImage++;
            if(activeImage >= images.length) activeImage = 0;
        }
        nextImageGenerate();
        
        setTimeout(() => {
            document.querySelector('.slider__line img').remove();
            prevImageGenerate();
        }, duration);

    } 
    if(direction == 'prev') {
        if(dotClickFlag) {
            activeImage = id;
            if(activeImage < 0) activeImage = images.length - 1;
            document.querySelector('.slider__line img').remove();

            prevImageGenerate(++id);
        } else {
            activeImage--;
            if(activeImage < 0) activeImage = images.length - 1;
        }

        prevImageGenerate(activeImage, true);

        setTimeout(() => {
            document.querySelector('.slider__line img:last-child').remove();
            nextImageGenerate();
        }, duration);
    }
    animate(activeImage, lastActiveImage);
}

initSlider();

//onClick по кнопкам
[btnNext, btnPrev].forEach((btn) => {
    btn.addEventListener('click', (e) => {
        direction = e.target == btnNext ? 'next' : 'prev';
        changeSlide()
    });
});

//Onclick пагинация
document.querySelectorAll('.slider__dots-item').forEach((dot, key) => {
    dot.addEventListener('click', (e) => {
        const id = parseInt(e.target.id);
        if(activeImage === id) return;

        direction = (e.target.id - activeImage > 0 ) ? 'next' : 'prev';
        dotClickFlag = true;
        
        changeSlide(id);
    })
});

//анимация 
const animate =  ( activeImage, lastActiveImage)=> {
    const dots = document.querySelectorAll('.slider__dots-item');

    let trackImages = document.querySelectorAll('.slider__line img'),
        removeElement;
    const start = performance.now();

    let timer = setInterval( function () {
        let timePassed = (performance.now() - start) / duration;
        if(timePassed > 1) timePassed = 1;
        if(direction == 'next') {
            trackImages[0].style.width = (itemWidth * (1 - timePassed)) + 'px';
            removeElement = trackImages[0];
        } 
        if(direction == 'prev'){
            trackImages[0].style.width = (itemWidth * timePassed) + 'px';
            removeElement = trackImages[3];
        }

        if(timePassed === 1) {
            dots[activeImage].style.backgroundColor = '#fff';
            dots[lastActiveImage].style.backgroundColor  = 'transparent';
            slider.style.backgroundImage = `url("./assets_slider/img/${images[activeImage]}`;

            removeElement.remove();
            
            animateFlag = false;
            dotClickFlag = false;
            clearInterval(timer);
        }
    }, 20);
    return timer;
}
})