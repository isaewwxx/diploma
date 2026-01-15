// ===========================
// Контактна форма - валидация и изпращане
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;

    // Регулярни изрази за валидация
    const patterns = {
        name: /^[А-Яа-яA-Za-z\s]{2,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^(\+359|0)[0-9]{9}$/,
        message: /^.{10,500}$/
    };

    // Съобщения за грешки
    const errorMessages = {
        name: 'Моля въведете валидно име (2-50 символа)',
        email: 'Моля въведете валиден email адрес',
        phone: 'Моля въведете валиден телефонен номер (+359 или 0 + 9 цифри)',
        subject: 'Моля изберете тема',
        message: 'Моля въведете съобщение (10-500 символа)',
        privacy: 'Трябва да се съгласите с политиката за поверителност'
    };

    // Показване на грешка
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    // Скриване на грешка
    function hideError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }

    // Валидация на поле
    function validateField(input) {
        const name = input.name;
        const value = input.value.trim();

        // Проверка за задължителни полета
        if (input.hasAttribute('required') && value === '') {
            if (input.type === 'checkbox') {
                showError(input, errorMessages.privacy);
                return false;
            }
            showError(input, `Полето е задължително`);
            return false;
        }

        // Специфична валидация по тип
        switch(name) {
            case 'name':
                if (!patterns.name.test(value)) {
                    showError(input, errorMessages.name);
                    return false;
                }
                break;

            case 'email':
                if (!patterns.email.test(value)) {
                    showError(input, errorMessages.email);
                    return false;
                }
                break;

            case 'phone':
                // Телефонът е опционален, но ако е въведен трябва да е валиден
                if (value !== '' && !patterns.phone.test(value.replace(/\s/g, ''))) {
                    showError(input, errorMessages.phone);
                    return false;
                }
                break;

            case 'subject':
                if (value === '') {
                    showError(input, errorMessages.subject);
                    return false;
                }
                break;

            case 'message':
                if (!patterns.message.test(value)) {
                    showError(input, errorMessages.message);
                    return false;
                }
                break;

            case 'privacy':
                if (!input.checked) {
                    showError(input, errorMessages.privacy);
                    return false;
                }
                break;
        }

        hideError(input);
        return true;
    }

    // Real-time валидация при писане
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        // Валидация при напускане на полето
        input.addEventListener('blur', function() {
            validateField(this);
        });

        // Почистване на грешка при писане
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });

        // Специална обработка за checkbox
        if (input.type === 'checkbox') {
            input.addEventListener('change', function() {
                validateField(this);
            });
        }
    });

    // Изпращане на формата
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;

        // Валидация на всички полета
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            // Фокус на първото поле с грешка
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Симулация на изпращане на формата
        const formData = new FormData(contactForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        console.log('Изпращане на форма:', data);

        // Показване на съобщение за успех
        contactForm.style.display = 'none';
        const successMessage = document.getElementById('successMessage');
        successMessage.style.display = 'block';

        // Скрол до съобщението за успех
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Изчистване на формата
        contactForm.reset();

        // Скриване на всички грешки
        inputs.forEach(input => {
            hideError(input);
        });

        // Симулация на изпращане към сървър
        // В реална ситуация тук би имало AJAX заявка
        setTimeout(() => {
            alert('Благодарим ви за съобщението! Ще се свържем с вас скоро.');
            
            // Показване отново на формата след 3 секунди
            setTimeout(() => {
                successMessage.style.display = 'none';
                contactForm.style.display = 'block';
            }, 3000);
        }, 500);
    });

    // Форматиране на телефонен номер при писане
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            
            // Автоматично добавяне на +359 ако започва с 0
            if (value.startsWith('0')) {
                value = '359' + value.substring(1);
            }
            
            // Форматиране: +359 XXX XXX XXX
            if (value.startsWith('359')) {
                const formatted = '+359 ' + 
                    value.substring(3, 6) + 
                    (value.length > 6 ? ' ' + value.substring(6, 9) : '') + 
                    (value.length > 9 ? ' ' + value.substring(9, 12) : '');
                this.value = formatted.trim();
            }
        });
    }

    // Character count за съобщението
    const messageInput = document.getElementById('message');
    if (messageInput) {
        const charCount = document.createElement('span');
        charCount.className = 'char-count';
        charCount.style.cssText = 'font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem;';
        messageInput.parentElement.appendChild(charCount);

        messageInput.addEventListener('input', function() {
            const length = this.value.length;
            const maxLength = 500;
            charCount.textContent = `${length}/${maxLength} символа`;
            
            if (length > maxLength) {
                charCount.style.color = '#ef4444';
            } else if (length >= maxLength * 0.9) {
                charCount.style.color = '#f59e0b';
            } else {
                charCount.style.color = '#6b7280';
            }
        });

        // Инициализиране на брояча
        messageInput.dispatchEvent(new Event('input'));
    }
});

// Функция за изпращане на email (може да се интегрира с EmailJS или подобна услуга)
function sendEmail(data) {
    // Пример с EmailJS:
    // emailjs.send("service_id", "template_id", data)
    //     .then(function(response) {
    //         console.log("SUCCESS!", response.status, response.text);
    //     }, function(error) {
    //         console.log("FAILED...", error);
    //     });
    
    console.log('Email data:', data);
}

console.log('✅ Contact form JavaScript loaded successfully');
