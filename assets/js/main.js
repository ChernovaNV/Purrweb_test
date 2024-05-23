const vars = {
    windowEl: window,
    documentEl: document,
    htmlEl: document.documentElement,
    bodyEl: document.body
}

    // Реализация бургер-меню
const disableScroll = () => {
    const fixBlocks = document?.querySelectorAll('.fixed-block');
    const pagePosition = window.scrollY;
    const paddingOffset = `${(window.innerWidth - vars.bodyEl.offsetWidth)}px`;
    
    vars.htmlEl.style.scrollBehavior = 'none';
    fixBlocks.forEach(el => { el.style.paddingRight = paddingOffset; });
    vars.bodyEl.style.paddingRight = paddingOffset;
    vars.bodyEl.classList.add('dis-scroll');
    vars.bodyEl.dataset.position = pagePosition;
    vars.bodyEl.style.top = `-${pagePosition}px`;
    console.log(pagePosition);
    }
    
    const enableScroll = () => {
    const fixBlocks = document?.querySelectorAll('.fixed-block');
    const body = document.body;
    const pagePosition = parseInt(vars.bodyEl.dataset.position, 10);
    fixBlocks.forEach(el => { el.style.paddingRight = '0px'; });
    vars.bodyEl.style.paddingRight = '0px';
    
    vars.bodyEl.style.top = 'auto';
    vars.bodyEl.classList.remove('dis-scroll');
    window.scroll({
        top: pagePosition,
        left: 0
    });
    vars.bodyEl.removeAttribute('data-position');
    vars.htmlEl.style.scrollBehavior = 'smooth';
    }
      

(function(){
  const burger = document?.querySelector('[data-burger]');
  const menu = document?.querySelector('[data-menu]');
  const menuItems = document?.querySelectorAll('[data-menuItem]');
  const overlay = document?.querySelector('[data-menu-overlay]');

  burger?.addEventListener('click', (e) => {
    burger?.classList.toggle('burger--active');
    menu?.classList.toggle('menu--active');

    if (menu?.classList.contains('menu--active')) {
      burger?.setAttribute('aria-expanded', 'true');
      burger?.setAttribute('aria-label', 'Закрыть меню');
      disableScroll();
    } else {
      burger?.setAttribute('aria-expanded', 'false');
      burger?.setAttribute('aria-label', 'Открыть меню');
      enableScroll();
    }
  });

  overlay?.addEventListener('click', () => {
    burger?.setAttribute('aria-expanded', 'false');
    burger?.setAttribute('aria-label', 'Открыть меню');
    burger.classList.remove('burger--active');
    menu.classList.remove('menu--active');
    enableScroll();
  });

  menuItems?.forEach(el => {
    el.addEventListener('click', () => {
      burger?.setAttribute('aria-expanded', 'false');
      burger?.setAttribute('aria-label', 'Открыть меню');
      burger.classList.remove('burger--active');
      menu.classList.remove('menu--active');
      enableScroll();
    });
  });

// Модальное окно
const opens = document?.querySelectorAll('[data-openModal]');
const modals = document?.querySelectorAll('[data-modal]');
const closesModal = document?.querySelectorAll('[data-closeModal]');
const modalForm = document?.querySelector('.modalForm');
const modalThanks = document?.querySelector('.modalThanks');
const form = document?.getElementById('form');

const modalOpen = (modal) => {
  modal?.classList.add('modal--active');
}

closesModal?.forEach((closeBnt, i) => {
  closeBnt.addEventListener('click', () => {
    modals.forEach((modal) => modal.classList.remove('modal--active'));
  })
})

opens?.forEach((openBtn) => {
  openBtn.addEventListener('click', () => {
    modalOpen(modalForm);
  })
})

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  modalForm.classList.remove('modal--active');
  modalOpen(modalThanks);

})
})();


// фиксированный Header
const HeaderFixing = () => {
    const header = document.querySelector('.mainHeader')
    window.addEventListener('scroll', function () {
      const scroll = Math.round(window.scrollY);
  
      if(scroll > 38) {
        header.style.position = 'fixed';
        return
      }
      header.style.position = 'static';
    });
  }
  
const toggleHeaderLinks = () => {
    const links = document.querySelectorAll('.supHeader__link');
    const items = document.querySelectorAll('.mainHeader__menu-item');
  
    links.forEach((link) => {
  
      link.addEventListener('click', (event) => {
        event.preventDefault();
  
        let headerlink = link.dataset.headerlink;
  
        links.forEach((link) => {
          link.parentNode.classList.remove('supHeader__item--active');
        })
  
        if(link == event.target) {
          link.parentNode.classList.add('supHeader__item--active');
          for(let item of items) {
  
            item.classList.contains(headerlink) ? item.style.display = 'flex' : item.style.display = 'none';
  
          }
  
        }
      })
    })
  
  }

HeaderFixing();
toggleHeaderLinks();

// Валидация формы
const validateForms = (selector) => {
    const form = document?.querySelector(selector);
    const inputsWrapper = form.querySelector('.form__inputWrapper');
    const formSubmit = form.querySelector('button[type="submit"]')
    // появление сообщения о наличии пустых полей
    function addError(input, text) {
      const parent = input.parentNode;
      const errorLabel = document.createElement('span');
  
      errorLabel.classList.add('error__label');
      errorLabel.textContent = text;
  
      parent.classList.add('error');
      parent.appendChild(errorLabel);
    }
    //удаление сообщений после заполнения всех обязательных полей
    function removeError(input) {
      const parent = input.parentNode;
  
      if(parent.classList.contains('error')) {
        parent.querySelector('.error__label').remove();
        parent.classList.remove('error');
      }
    }
    //проверка на символы (не цифры для поля с номером)
    function getInputNumbersValue(input) {
      return input.value.replace(/\D/g, '');
    }
  
const validationForm = (form, e) => {
      const inputs = form.querySelectorAll('input[required]');
      const input = e.target;
  
        removeError(input);
  
        //Проверка обязательных полей формы на пустоту
        if(input.value == '' && input.getAttribute('required')) {
          addError(input, "This field is required.")
          return false;
        }
  
        //Проверка поля с номером телефона на регион и длину
        if(input.type == 'tel') {
          let inputNumbersValue = getInputNumbersValue(input);
          let formattedInputValue = '';
          let selectionStart = input.selectionStart;
  
          //удаление символа в середине поля
          if(input.value.length != selectionStart) {
            if(e.data && /\D/g.test(e.data)){
              input.value = inputNumbersValue;
            }
            return;
          }
  
          if(['7', '8', '9'].indexOf(inputNumbersValue[0]) > -1) {
  
          //код региона РФ
          let firstSimbol = '+7';
  
          formattedInputValue = firstSimbol + ' ';
  
          if(inputNumbersValue.length > 1) {
            formattedInputValue += '(' + inputNumbersValue.substring(1,4);
          }
          if(inputNumbersValue.length >= 5) {
            formattedInputValue += ') ' + inputNumbersValue.substring(4,7);
          }
          if(inputNumbersValue.length >= 8) {
            formattedInputValue += ' ' + inputNumbersValue.substring(7,9);
          }
          if(inputNumbersValue.length >= 10) {
            formattedInputValue += ' ' + inputNumbersValue.substring(9,11);
          }
          //код не РФ
          } else {
            formattedInputValue = '+' + inputNumbersValue.substring(0,11);
          }
  
          input.value = formattedInputValue;
          //проверка на кол-во символов
          if (formattedInputValue.length < 18) {
            return false;
          }
        }
  
        for(let input of inputs) {
          if(input.value == "") {
            return false;
          }
        }
        removeError(inputsWrapper);
  
      return true;
    }
  
    form.addEventListener('input', (e) => {
  
    removeError(e.target.parentNode.parentNode);
  
    if(validationForm(form, e)) {
        formSubmit.disabled = false;
      } else {
        formSubmit.disabled = true;
        if(!inputsWrapper.parentNode.classList.contains('error')) {
          addError(inputsWrapper, "Please fill in all required fields")
        }
      }
    });
};

validateForms('#form');


// Окно Cookies
const notificationOfCookies = () => {
    const cookies = document?.querySelector('[data-cookies]');
    const closes = document?.querySelectorAll('[data-closeCookies]');
  
    setTimeout(() => {
        cookies.classList.add('cookies--active')
    }, 2000)
  
    closes?.forEach((closeBnt, i) => {
      closeBnt.addEventListener('click', () => {
        cookies.classList.remove('cookies--active');
      })
    })
  }
  
notificationOfCookies();