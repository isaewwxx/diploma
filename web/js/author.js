document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('projectModal');
  const closeButton = document.getElementById('projectModalClose');
  const title = document.getElementById('projectModalTitle');
  const summary = document.getElementById('projectModalSummary');
  const highlights = document.getElementById('projectModalHighlights');
  const role = document.getElementById('projectModalRole');
  const link = document.getElementById('projectModalLink');
  const triggers = Array.from(document.querySelectorAll('[data-project]'));
  const backdrop = modal ? modal.querySelector('[data-project-close]') : null;

  if (!modal || !closeButton || !title || !summary || !highlights || !role || !link || triggers.length === 0 || !backdrop) {
    return;
  }

  const projectDetails = {
    capybarahost: {
      title: 'CapybaraHost',
      summary: 'CapybaraHost е практическа хостинг платформа, ориентирана към автоматизирано разгръщане, надеждна инфраструктура и лесно управление на услуги за малки и средни уеб проекти.',
      highlights: [
        'Автоматизирани deployment процеси за по-бързо публикуване на приложения.',
        'Управление на SSL сертификати, DNS записи и основни операции от един интерфейс.',
        'Непрекъснат мониторинг и оперативна поддръжка на хостваните услуги.'
      ],
      role: 'Проектът е реализиран с фокус върху back-end логика, сървърна администрация и клиентска поддръжка. Използвани са Node.js, Docker и Linux-базирана инфраструктура.',
      url: 'https://capybarahost.eu'
    },
    infininode: {
      title: 'Infininode',
      summary: 'Infininode е учебно-тренировъчен проект, който симулира структура и работа на IT компания в рамките на учебната програма по Учебно предприятие.',
      highlights: [
        'Моделиране на реални бизнес процеси: услуги, продуктово портфолио и комуникация с клиенти.',
        'Работа в екип с разделение на роли и отговорности по реален сценарий.',
        'Практическо прилагане на уеб технологии за представяне на фирмена идентичност.'
      ],
      role: 'Основната роля е разработка на уеб присъствие и структуриране на съдържание. Технологичната част комбинира HTML, CSS и Node.js.',
      url: 'https://infininode.isaewwxx.dev/'
    },
    euro: {
      title: 'Euro Presentation',
      summary: 'Интерактивна образователна презентация, която представя процеса по присъединяване на България към еврозоната с акцент върху исторически, икономически и практически аспекти.',
      highlights: [
        'Визуално обяснение на пътя към ERM II и ключовите етапи към еврото.',
        'Раздели за ползи, рискове и обществено въздействие с лесна за следване структура.',
        'Вграден BGN/EUR конвертор и интерактивни елементи за по-добро разбиране.'
      ],
      role: 'Проектът е изграден като front-end решение с фокус върху ясна информация и достъпна визуализация. Използвани са HTML/CSS, JavaScript и Chart.js.',
      url: 'https://euro.isaewwxx.dev/'
    },
    'mobile-security-day': {
      title: 'Mobile Security Day',
      summary: 'Практическо ръководство за мобилна киберсигурност, насочено към ежедневни заплахи и действия за защита на личните данни на потребителите.',
      highlights: [
        'Разглежда реални атаки като phishing и злонамерени мобилни приложения.',
        'Включва тестер за пароли и кратки самооценки за ниво на сигурност.',
        'Предоставя приложим чеклист с конкретни стъпки за защита на устройство.'
      ],
      role: 'Реализиран като модерно SPA решение с React, Next.js и Tailwind. Фокусът е върху достъпно UX изживяване и практическа приложимост на съдържанието.',
      url: 'https://ms.isaewwxx.dev/'
    }
  };

  let lastTrigger = null;

  const renderHighlights = (items) => {
    highlights.innerHTML = '';
    items.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      highlights.appendChild(li);
    });
  };

  const openModal = (projectKey, trigger) => {
    const data = projectDetails[projectKey];
    if (!data) return;

    lastTrigger = trigger || null;
    title.textContent = data.title;
    summary.textContent = data.summary;
    role.textContent = data.role;
    renderHighlights(data.highlights);
    link.href = data.url;
    link.setAttribute('aria-label', `Отвори ${data.title}`);

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('project-modal-open');
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('project-modal-open');

    if (lastTrigger) {
      lastTrigger.focus();
    }
  };

  triggers.forEach((button) => {
    button.addEventListener('click', () => {
      openModal(button.getAttribute('data-project'), button);
    });
  });

  closeButton.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
});
