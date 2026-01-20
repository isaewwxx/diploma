document.addEventListener('DOMContentLoaded', () => {
  initCharts();
  setupContactForm();
});

function initCharts() {
  if (typeof Chart === 'undefined') return;
  const usageCtx = document.getElementById('usageChart');
  const riskCtx = document.getElementById('riskChart');

  if (usageCtx) {
    new Chart(usageCtx, {
      type: 'bar',
      data: {
        labels: ['USB', 'SSD', 'HDD', 'SD', 'CD/DVD'],
        datasets: [
          {
            label: 'Използване (%)',
            data: [70, 85, 55, 35, 15],
            backgroundColor: ['#22d3ee', '#fbbf24', '#38bdf8', '#34d399', '#c084fc'],
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#e9f1f5',
            },
            grid: {
              color: 'rgba(255,255,255,0.08)',
            },
          },
          x: {
            ticks: { color: '#e9f1f5' },
            grid: { display: false },
          },
        },
        plugins: {
          legend: {
            labels: { color: '#e9f1f5' },
          },
        },
      },
    });
  }

  if (riskCtx) {
    new Chart(riskCtx, {
      type: 'doughnut',
      data: {
        labels: ['Зловреден софтуер', 'Физически повреда', 'Кражба/загуба', 'Човешка грешка'],
        datasets: [
          {
            data: [35, 30, 20, 15],
            backgroundColor: ['#f97316', '#22d3ee', '#fbbf24', '#a78bfa'],
            borderColor: '#0b1723',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#e9f1f5' },
          },
        },
      },
    });
  }
}

function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = form.querySelector('.form__status');
  if (!status) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const errors = [];

    if (!name) errors.push('Моля, попълнете име.');
    if (!isValidEmail(email)) errors.push('Въведете валиден имейл.');
    if (message.length < 10) errors.push('Съобщението трябва да е поне 10 символа.');

    status.classList.remove('is-error', 'is-success');

    if (errors.length) {
      status.textContent = errors.join(' ');
      status.classList.add('is-error');
      return;
    }

    status.textContent = 'Успешно изпратено! (демо режим)';
    status.classList.add('is-success');
    form.reset();
  });
}

function isValidEmail(value) {
  return /.+@.+\..+/.test(value);
}
