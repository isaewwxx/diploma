/* ===========================
   App.js — Charts, Tables & Interactivity
   =========================== */

// ---- Mobile Navigation Toggle ----
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.setAttribute('aria-expanded',
                navLinks.classList.contains('active'));
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ---- Scroll Progress Bar ----
    const scrollProgress = document.getElementById('scrollProgress');
    const navbar = document.querySelector('.navbar');
    const backToTop = document.getElementById('backToTop');

    function onScroll() {
        // Progress bar
        if (scrollProgress) {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = pct + '%';
        }

        // Navbar glass / scrolled effect
        if (navbar) {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Back-to-top visibility
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial call

    // Back-to-top click handler
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- Enhanced Scroll Animations ----
    const animatedSelectors = [
        '.device-card', '.risk-card', '.case-card', '.checklist-item',
        '.timeline-item', '.encrypt-card', '.erasure-card', '.goal-card',
        '.fs-card', '.stat-card', '.section-card', '.chart-card',
        '.table-card', '.skill-card', '.project-card', '.ref-item',
        '.contact-card', '.author-card', '.info-card'
    ].join(', ');

    // Assign stagger classes to grid children
    document.querySelectorAll('.card-grid, .stats-grid, .skills-grid, .projects-grid, .goals-grid').forEach(grid => {
        const children = grid.children;
        for (let i = 0; i < children.length; i++) {
            children[i].classList.add(`stagger-${Math.min(i + 1, 10)}`);
        }
    });

    // Assign alternating directional reveal to timeline items
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
        item.classList.add(i % 2 === 0 ? 'fade-in-left' : 'fade-in-right');
    });

    const observerOptions = {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(animatedSelectors).forEach(el => {
        observer.observe(el);
    });

    // ---- Animate Hero Stat Numbers (count-up) ----
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.textContent, 10);
        if (isNaN(target)) return;
        const suffix = el.textContent.replace(/[\d]/g, '');
        const duration = 1800;
        const start = performance.now();
        el.textContent = '0' + suffix;

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * ease) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        // Only animate when visible
        const statObs = new IntersectionObserver((entries, obs) => {
            if (entries[0].isIntersecting) {
                requestAnimationFrame(step);
                obs.unobserve(el);
            }
        }, { threshold: 0.5 });
        statObs.observe(el);
    });

    // ---- Active Nav Link Highlight ----
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    // ---- Initialize Charts (only on charts page) ----
    if (document.getElementById('readSpeedChart')) {
        initCharts();
    }

    // ---- Initialize Tables (only on charts page) ----
    if (document.getElementById('comparisonTableContainer')) {
        initTables();
    }

    // ---- Contact Form (Formspree AJAX) ----
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const submitBtn = contactForm.querySelector('[type="submit"]');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Guard against double-submit
            if (submitBtn.disabled) return;

            // Loading state
            submitBtn.disabled = true;
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i data-lucide="loader-2"></i> Изпращане…';
            if (typeof lucide !== 'undefined') lucide.createIcons();

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                    showToast('success', 'Съобщението е изпратено успешно! Ще се свържа с вас скоро.');
                } else {
                    let errMsg = 'Нещо се обърка. Моля опитайте отново.';
                    try {
                        const data = await response.json();
                        if (data && Array.isArray(data.errors) && data.errors.length) {
                            errMsg = data.errors.map(er => er.message).join(' ');
                        }
                    } catch (_) { /* ignore JSON parse errors */ }
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                    showToast('error', errMsg);
                }
            } catch (_) {
                // Network / fetch error
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
                if (typeof lucide !== 'undefined') lucide.createIcons();
                showToast('error', 'Мрежова грешка. Проверете интернет връзката и опитайте отново.');
            }
        });
    }
});

/* ===========================
   Toast Notification Helper
   =========================== */
function showToast(type, message) {
    // Remove any existing toast
    const existing = document.getElementById('form-toast');
    if (existing) {
        existing.remove();
    }

    const toast = document.createElement('div');
    toast.id = 'form-toast';
    toast.className = `form-toast form-toast--${type}`;
    const iconName = type === 'success' ? 'check-circle' : 'alert-circle';
    toast.innerHTML = `
        <i data-lucide="${iconName}" class="form-toast__icon"></i>
        <span class="form-toast__msg">${message}</span>
        <button class="form-toast__close" aria-label="Затвори"><i data-lucide="x"></i></button>
    `;

    document.body.appendChild(toast);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Trigger CSS transition
    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('form-toast--visible'));
    });

    // Auto-dismiss
    const autoDismiss = setTimeout(() => dismissToast(toast), type === 'success' ? 6000 : 10000);

    toast.querySelector('.form-toast__close').addEventListener('click', () => {
        clearTimeout(autoDismiss);
        dismissToast(toast);
    });
}

function dismissToast(toast) {
    if (!toast) return;
    toast.classList.remove('form-toast--visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
}

/* ===========================
   Color Palette for Charts
   =========================== */
const COLORS = {
    usb: '#2c4a6e',
    ssd: '#3b6998',
    hdd: '#b06a2a',
    sd: '#3a7d5c',
    cdDvd: '#9e7c2e',
    primary: '#2c4a6e',
    primaryLight: 'rgba(44, 74, 110, 0.08)',
    critical: '#b44040',
    high: '#b06a2a',
    medium: '#9e7c2e',
    low: '#3a7d5c',
    grid: 'rgba(0, 0, 0, 0.05)'
};

const DEVICE_COLORS = [COLORS.usb, COLORS.ssd, COLORS.hdd, COLORS.sd, COLORS.cdDvd];
const DEVICE_LABELS = ['USB Flash', 'Външен SSD', 'Външен HDD', 'SD карта', 'CD/DVD'];

/* ===========================
   Chart Defaults
   =========================== */
function getDefaultOptions(title) {
    return {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 16,
                    usePointStyle: true,
                    color: '#6b6b6b',
                    font: { size: 12, family: "'Inter', 'Segoe UI', sans-serif" }
                }
            },
            title: {
                display: !!title,
                text: title || '',
                color: '#1a1a1a',
                font: { size: 16, weight: '700', family: "'Inter', 'Segoe UI', sans-serif" },
                padding: { bottom: 20 }
            }
        }
    };
}

/* ===========================
   Initialize All Charts
   =========================== */
function initCharts() {
    createReadSpeedChart();
    createInterfaceChart();
    createPriceChart();
    createNandChart();
    createRiskChart();
    createDataLossChart();
    createRadarChart();
    createAttackChart();
}

/* ---- 1. Read Speed Comparison ---- */
function createReadSpeedChart() {
    const ctx = document.getElementById('readSpeedChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: DEVICE_LABELS,
            datasets: [
                {
                    label: 'Мин. скорост (MB/s)',
                    data: [100, 500, 80, 90, 1.2],
                    backgroundColor: DEVICE_COLORS.map(c => c + '99'),
                    borderColor: DEVICE_COLORS,
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false
                },
                {
                    label: 'Макс. скорост (MB/s)',
                    data: [400, 2000, 160, 300, 22],
                    backgroundColor: DEVICE_COLORS,
                    borderColor: DEVICE_COLORS,
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false
                }
            ]
        },
        options: {
            ...getDefaultOptions(),
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Скорост (MB/s)',
                        color: '#6b6b6b',
                        font: { size: 12, weight: '600' }
                    },
                    ticks: { color: '#9a9a9a' },
                    grid: { color: COLORS.grid }
                },
                x: {
                    ticks: { color: '#9a9a9a' },
                    grid: { display: false }
                }
            }
        }
    });
}

/* ---- 2. Interface Bandwidth ---- */
function createInterfaceChart() {
    const ctx = document.getElementById('interfaceChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['USB 2.0', 'USB 3.0', 'USB 3.1\nGen 2', 'USB 3.2\nGen 2×2', 'SATA III', 'NVMe\nPCIe 4', 'NVMe\nPCIe 5', 'Thunderbolt\n3/4', 'Thunderbolt 5'],
            datasets: [{
                label: 'Макс. скорост (MB/s)',
                data: [60, 625, 1250, 2500, 600, 7000, 14000, 5000, 10000],
                backgroundColor: [
                    'rgba(44,74,110,0.25)', 'rgba(44,74,110,0.35)', 'rgba(44,74,110,0.45)', 'rgba(44,74,110,0.55)',
                    'rgba(59,105,152,0.45)',
                    'rgba(59,105,152,0.55)', 'rgba(59,105,152,0.7)',
                    'rgba(176,106,42,0.45)', 'rgba(176,106,42,0.6)'
                ],
                borderRadius: 6,
                borderSkipped: false,
                borderWidth: 0
            }]
        },
        options: {
            ...getDefaultOptions(),
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'MB/s',
                        color: '#6b6b6b',
                        font: { size: 12, weight: '600' }
                    },
                    ticks: { color: '#9a9a9a' },
                    grid: { color: COLORS.grid }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#6b6b6b', font: { size: 11 } }
                }
            },
            plugins: {
                ...getDefaultOptions().plugins,
                legend: { display: false }
            }
        }
    });
}

/* ---- 3. Price per GB ---- */
function createPriceChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: DEVICE_LABELS,
            datasets: [
                {
                    label: 'Мин. цена (€/GB)',
                    data: [0.05, 0.07, 0.02, 0.08, 0.01],
                    backgroundColor: DEVICE_COLORS.map(c => c + '80'),
                    borderColor: DEVICE_COLORS,
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false
                },
                {
                    label: 'Макс. цена (€/GB)',
                    data: [0.15, 0.12, 0.04, 0.20, 0.03],
                    backgroundColor: DEVICE_COLORS,
                    borderColor: DEVICE_COLORS,
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false
                }
            ]
        },
        options: {
            ...getDefaultOptions(),
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '€ / GB',
                        color: '#6b6b6b',
                        font: { size: 12, weight: '600' }
                    },
                    ticks: { color: '#9a9a9a' },
                    grid: { color: COLORS.grid }
                },
                x: { ticks: { color: '#9a9a9a' }, grid: { display: false } }
            }
        }
    });
}

/* ---- 4. NAND Endurance ---- */
function createNandChart() {
    const ctx = document.getElementById('nandChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['SLC\n(Single-Level)', 'MLC\n(Multi-Level)', 'TLC\n(Triple-Level)', 'QLC\n(Quad-Level)'],
            datasets: [{
                label: 'P/E Цикли (×1000)',
                data: [100, 10, 4, 1],
                backgroundColor: ['rgba(44,74,110,0.65)', 'rgba(59,105,152,0.55)', 'rgba(176,106,42,0.5)', 'rgba(158,124,46,0.4)'],
                borderRadius: 6,
                borderSkipped: false,
                borderWidth: 0
            }]
        },
        options: {
            ...getDefaultOptions(),
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Цикли запис/изтриване (×1000)',
                        color: '#6b6b6b',
                        font: { size: 12, weight: '600' }
                    },
                    ticks: { color: '#9a9a9a' },
                    grid: { color: COLORS.grid }
                },
                x: { ticks: { color: '#9a9a9a' }, grid: { display: false } }
            },
            plugins: {
                ...getDefaultOptions().plugins,
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.parsed.y * 1000} цикъла`
                    }
                }
            }
        }
    });
}

/* ---- 5. Risk Matrix (Bubble Chart) ---- */
function createRiskChart() {
    const risks = [
        { label: 'Malware чрез USB', x: 4.2, y: 4.8, r: 20, color: COLORS.critical },
        { label: 'Кражба некриптиран носител', x: 3.8, y: 5, r: 19, color: COLORS.critical },
        { label: 'Рансъмуер', x: 3.2, y: 4.5, r: 17, color: COLORS.high },
        { label: 'Head crash (HDD)', x: 2.8, y: 4, r: 15, color: COLORS.high },
        { label: 'Корупция ФС', x: 3.5, y: 3.2, r: 14, color: COLORS.high },
        { label: 'BadUSB атака', x: 2.2, y: 4.3, r: 13, color: COLORS.medium },
        { label: 'Износване NAND', x: 2.5, y: 2.5, r: 11, color: COLORS.low },
        { label: 'Деградация CD/DVD', x: 2.8, y: 1.8, r: 10, color: COLORS.low }
    ];

    const ctx = document.getElementById('riskChart').getContext('2d');
    
    // Background plugin for risk zones
    const riskZonesPlugin = {
        id: 'riskZones',
        beforeDatasetsDraw: (chart) => {
            const { ctx, chartArea: { left, right, top, bottom }, scales: { x, y } } = chart;
            
            // Define risk zones (вероятност x въздействие)
            const zones = [
                // Critical zone (top-right)
                { x1: 3.5, x2: 5.5, y1: 3.5, y2: 5.5, color: 'rgba(239, 68, 68, 0.08)' },
                // High zone
                { x1: 2.5, x2: 5.5, y1: 2.5, y2: 3.5, color: 'rgba(251, 146, 60, 0.06)' },
                { x1: 3.5, x2: 5.5, y1: 2.5, y2: 5.5, color: 'rgba(251, 146, 60, 0.06)' },
                // Medium zone
                { x1: 1.5, x2: 3.5, y1: 1.5, y2: 3.5, color: 'rgba(251, 191, 36, 0.04)' },
                // Low zone
                { x1: 0.5, x2: 2.5, y1: 0.5, y2: 2.5, color: 'rgba(34, 197, 94, 0.03)' }
            ];
            
            zones.forEach(zone => {
                ctx.fillStyle = zone.color;
                ctx.fillRect(
                    x.getPixelForValue(zone.x1),
                    y.getPixelForValue(zone.y2),
                    x.getPixelForValue(zone.x2) - x.getPixelForValue(zone.x1),
                    y.getPixelForValue(zone.y1) - y.getPixelForValue(zone.y2)
                );
            });
        }
    };

    new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: risks.map(r => ({
                label: r.label,
                data: [{ x: r.x, y: r.y, r: r.r }],
                backgroundColor: r.color + 'DD',
                borderColor: r.color,
                borderWidth: 2.5,
                hoverBackgroundColor: r.color + 'FF',
                hoverBorderWidth: 3
            }))
        },
        options: {
            ...getDefaultOptions(),
            aspectRatio: 1.4,
            scales: {
                x: {
                    min: 0.5,
                    max: 5.5,
                    title: {
                        display: true,
                        text: 'Вероятност →',
                        font: { size: 14, weight: '700' },
                        color: '#3d3d3d'
                    },
                    ticks: {
                        stepSize: 1,
                        callback: (v) => ['', '1-Много\nниска', '2-Ниска', '3-Средна', '4-Висока', '5-Много\nвисока'][v] || '',
                        font: { size: 10 },
                        color: '#9a9a9a'
                    },
                    grid: { 
                        color: 'rgba(0,0,0,0.05)',
                        lineWidth: 1
                    }
                },
                y: {
                    min: 0.5,
                    max: 5.5,
                    title: {
                        display: true,
                        text: '↑ Въздействие',
                        font: { size: 14, weight: '700' },
                        color: '#3d3d3d'
                    },
                    ticks: {
                        stepSize: 1,
                        callback: (v) => ['', '1-Много\nниско', '2-Ниско', '3-Средно', '4-Високо', '5-Критично'][v] || '',
                        font: { size: 10 },
                        color: '#9a9a9a'
                    },
                    grid: { 
                        color: 'rgba(0,0,0,0.05)',
                        lineWidth: 1
                    }
                }
            },
            plugins: {
                ...getDefaultOptions().plugins,
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: { size: 11, weight: '500' },
                        boxWidth: 10,
                        boxHeight: 10
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    padding: 12,
                    titleFont: { size: 13, weight: '600' },
                    bodyFont: { size: 12 },
                    callbacks: {
                        label: (ctx) => {
                            const point = ctx.parsed;
                            return [
                                `Риск: ${ctx.dataset.label}`,
                                `Вероятност: ${point.x.toFixed(1)}/5`,
                                `Въздействие: ${point.y.toFixed(1)}/5`
                            ];
                        }
                    }
                }
            }
        },
        plugins: [riskZonesPlugin]
    });

    // Build legend
    const legendEl = document.getElementById('riskLegend');
    if (legendEl) {
        const levels = [
            { color: COLORS.critical, label: 'Критичен риск' },
            { color: COLORS.high, label: 'Висок риск' },
            { color: COLORS.medium, label: 'Среден риск' },
            { color: COLORS.low, label: 'Нисък риск' }
        ];
        legendEl.innerHTML = levels.map(l =>
            `<div class="risk-legend-item">
                <span class="risk-legend-dot" style="background:${l.color}"></span>
                <span>${l.label}</span>
            </div>`
        ).join('');
    }
}

/* ---- 6. Data Loss Causes ---- */
function createDataLossChart() {
    const ctx = document.getElementById('dataLossChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Хардуерна повреда (67%)', 'Софтуерни грешки (14%)', 'Случайно изтриване (10%)', 'Други причини (9%)'],
            datasets: [{
                data: [67, 14, 10, 9],
                backgroundColor: ['rgba(44,74,110,0.65)', 'rgba(59,105,152,0.55)', 'rgba(176,106,42,0.5)', 'rgba(158,124,46,0.4)'],
                borderColor: '#faf8f5',
                borderWidth: 3,
                hoverOffset: 8
            }]
        },
        options: {
            ...getDefaultOptions(),
            cutout: '55%',
            plugins: {
                ...getDefaultOptions().plugins,
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 16,
                        usePointStyle: true,
                        font: { size: 12 }
                    }
                }
            }
        }
    });
}

/* ---- 7. Radar Comparison ---- */
function createRadarChart() {
    const ctx = document.getElementById('radarChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Скорост', 'Капацитет', 'Мобилност', 'Надеждност', 'Цена/GB', 'Сигурност'],
            datasets: [
                {
                    label: 'USB Flash',
                    data: [5, 4, 10, 5, 6, 4],
                    borderColor: COLORS.usb,
                    backgroundColor: COLORS.usb + '20',
                    borderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'Външен SSD',
                    data: [9, 6, 8, 8, 5, 6],
                    borderColor: COLORS.ssd,
                    backgroundColor: COLORS.ssd + '20',
                    borderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'Външен HDD',
                    data: [3, 10, 5, 6, 9, 5],
                    borderColor: COLORS.hdd,
                    backgroundColor: COLORS.hdd + '20',
                    borderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'SD карта',
                    data: [5, 4, 10, 5, 5, 3],
                    borderColor: COLORS.sd,
                    backgroundColor: COLORS.sd + '20',
                    borderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'CD/DVD',
                    data: [1, 1, 3, 8, 10, 7],
                    borderColor: COLORS.cdDvd,
                    backgroundColor: COLORS.cdDvd + '20',
                    borderWidth: 2,
                    pointRadius: 4
                }
            ]
        },
        options: {
            ...getDefaultOptions(),
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 2,
                        font: { size: 10 },
                        color: '#9a9a9a',
                        backdropColor: 'transparent'
                    },
                    pointLabels: {
                        font: { size: 12, weight: '600' },
                        color: '#3d3d3d'
                    },
                    grid: { color: COLORS.grid }
                }
            }
        }
    });
}

/* ---- 8. USB Attack Vectors ---- */
function createAttackChart() {
    const ctx = document.getElementById('attackChart').getContext('2d');
    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: [
                'Malware чрез AutoRun',
                'BadUSB (фърмуер)',
                'USB Drop атака',
                'Рансъмуер чрез USB',
                'Juice Jacking',
                'Data Exfiltration'
            ],
            datasets: [{
                data: [37, 12, 25, 18, 8, 30],
                backgroundColor: [
                    'rgba(44, 74, 110, 0.5)',
                    'rgba(59, 105, 152, 0.5)',
                    'rgba(176, 106, 42, 0.5)',
                    'rgba(158, 124, 46, 0.5)',
                    'rgba(58, 125, 92, 0.5)',
                    'rgba(128, 80, 140, 0.5)'
                ],
                borderColor: [
                    '#2c4a6e', '#3b6998', '#b06a2a',
                    '#9e7c2e', '#3a7d5c', '#80508c'
                ],
                borderWidth: 2
            }]
        },
        options: {
            ...getDefaultOptions(),
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: {
                        font: { size: 10 },
                        color: '#9a9a9a',
                        backdropColor: 'transparent'
                    },
                    grid: { color: COLORS.grid }
                }
            },
            plugins: {
                ...getDefaultOptions().plugins,
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 14,
                        usePointStyle: true,
                        color: '#6b6b6b',
                        font: { size: 11 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.label}: ${ctx.parsed.r}% от атаките`
                    }
                }
            }
        }
    });
}

/* ===========================
   Initialize Tables (JS-generated)
   =========================== */
function initTables() {
    createComparisonTable();
    createEncryptionTable();
    createFSTable();
    createNISTTable();
    refreshLucide();
}

/* ---- Comparison Table ---- */
function createComparisonTable() {
    const container = document.getElementById('comparisonTableContainer');
    if (!container) return;

    const headers = ['Параметър', 'USB Flash', 'Външен SSD', 'Външен HDD', 'SD карта', 'CD/DVD'];
    const rows = [
        ['Обем на съхранение', '16 GB – 1 TB', '250 GB – 4 TB', '1 TB – 20 TB', '16 GB – 1 TB', '700 MB – 8.5 GB'],
        ['Четене (послед.)', '100–400 MB/s', '500–2 000 MB/s', '80–160 MB/s', '90–300 MB/s', '1.2–22 MB/s'],
        ['Запис (послед.)', '30–200 MB/s', '400–1 800 MB/s', '60–140 MB/s', '30–250 MB/s', '1–16 MB/s'],
        ['Латентност', '~1–10 ms', '~25–50 µs', '5–15 ms', '~1–5 ms', '80–120 ms'],
        ['Цена/GB (€)', '0.05–0.15', '0.07–0.12', '0.02–0.04', '0.08–0.20', '0.01–0.03'],
        ['Преносимост', '★★★★★', '★★★★☆', '★★★☆☆', '★★★★★', '★★☆☆☆'],
        ['Издръжливост', '5–10 г. / ★★★☆☆', '5–10 г. / ★★★★☆', 'MTBF ~1M ч. / ★★★★☆', '5–10 г. / ★★★☆☆', '20–100 г. / ★★★★★'],
        ['Принцип на работа', 'NAND флаш памет', 'NAND + NVMe/SATA контролер', 'Магнитни пластини', 'NAND флаш памет', 'Лазерен оптичен запис'],
        ['Свързване', 'USB 2.0 – 3.2 Gen 2', 'USB 3.2 / Thunderbolt', 'USB 3.0 / SATA III', 'SD / UHS-II слот', 'SATA (оптично устр.)'],
        ['Основни сценарии', 'Бърз трансфер, bootable ОС', 'Видео монтаж, бърз архив', 'Масово архивиране, NAS', 'Камери, дронове, IoT', 'Дългосрочен архив, дистрибуция']
    ];

    container.innerHTML = buildTable(headers, rows);
}

/* ---- Encryption Table ---- */
function createEncryptionTable() {
    const container = document.getElementById('encryptionTableContainer');
    if (!container) return;

    const headers = ['Параметър', 'BitLocker To Go', 'VeraCrypt', 'LUKS (dm-crypt)'];
    const rows = [
        ['Поддържани ОС', 'Windows Pro / Enterprise', 'Windows, Linux, macOS', 'Само Linux'],
        ['Шифри', 'AES-128 / AES-256 (XTS)', 'AES, Serpent, Twofish + каскади', 'AES, Serpent, Twofish (XTS режим)'],
        ['Скрит том', '✗', '✓', '✗'],
        ['Централизирано управл.', '✓ AD / GPO', '✗', '✗'],
        ['TPM поддръжка', '✓', '✗', '✗'],
        ['Лицензиране', 'Windows Pro+ лиценз', 'Свободен (FOSS)', 'Свободен (FOSS)'],
        ['Извличане на ключ (KDF)', 'PBKDF2', 'PBKDF2 / SHA-512', 'PBKDF2 / Argon2id'],
        ['Слотове за ключове', '1', '2', 'До 8'],
        ['Преносим режим', '✗', '✓', '✗']
    ];

    container.innerHTML = buildTable(headers, rows);
}

/* ---- File Systems Table ---- */
function createFSTable() {
    const container = document.getElementById('fsTableContainer');
    if (!container) return;

    const headers = ['Параметър', 'FAT32', 'NTFS', 'exFAT', 'ext4', 'APFS'];
    const rows = [
        ['Макс. размер на файл', '4 GB', '256 TB', '128 PB', '16 TB', '8 EB'],
        ['Макс. размер на том', '2 TB', '256 TB', '128 PB', '1 EB', '8 EB'],
        ['Журнал на метаданни', '✗', '✓', '✗', '✓', '✓'],
        ['Права за достъп (ACL)', '✗', '✓', '✗', '✓ POSIX', '✓'],
        ['Вградено криптиране', '✗', '✓ EFS', '✗', '✗', '✓ AES'],
        ['Съвм. с Windows', '✓', '✓', '✓', '✗', '✗'],
        ['Съвм. с Linux', '✓', '✓ NTFS-3G', '✓', '✓', '✗'],
        ['Съвм. с macOS', '✓', '✗', '✓', '✗', '✓'],
        ['Най-подходяща за', 'Универсални преносими носители', 'Windows работни станции', 'Големи флаш / SD карти', 'Linux сървъри и десктоп', 'Apple устройства (Mac, iPhone)']
    ];

    container.innerHTML = buildTable(headers, rows);
}

/* ---- NIST CSF Table ---- */
function createNISTTable() {
    const container = document.getElementById('nistTableContainer');
    if (!container) return;

    const headers = ['№', 'Мярка', 'Подробности', 'CSF функция'];
    const rows = [
        ['1', 'Инвентаризация на устройства', 'Регистър на всички преносими носители — VID, PID, сериен номер, отговорно лице', 'Identify (ID)'],
        ['2', 'Категоризиране на информацията', 'Определяне ниво на чувствителност (публична / вътрешна / конфиденциална) преди запис', 'Identify (ID)'],
        ['3', 'Задължително AES-256 криптиране', 'Прилагане на BitLocker To Go, VeraCrypt или LUKS за целия том на носителя', 'Protect (PR)'],
        ['4', 'Списък с разрешени устройства', 'Само одобрени носители (по VID/PID/SN) могат да се свързват към работни станции', 'Protect (PR)'],
        ['5', 'Забрана на AutoRun / AutoPlay', 'Деактивиране чрез GPO за всички сменяеми носители в домейна', 'Protect (PR)'],
        ['6', 'Автоматично антивирусно сканиране', 'Задействане на проверка веднага при свързване на нов преносим носител', 'Detect (DE)'],
        ['7', 'Наблюдение чрез SIEM', 'Логване на USB свързвания, корелация с правила за аномалии и известяване', 'Detect (DE)'],
        ['8', 'План за реагиране при инцидент', 'Документирана процедура: изолиране → анализ → възстановяване → рапорт', 'Respond (RS)'],
        ['9', 'Резервни копия по схема 3-2-1', 'Три копия, два типа носител, едно копие офсайт (вкл. външен носител)', 'Recover (RC)'],
        ['10', 'Безопасно унищожаване на данни', 'Clear / Purge / Destroy по NIST SP 800-88 Rev. 1, с писмен протокол', 'Recover (RC)']
    ];

    container.innerHTML = buildTable(headers, rows);
}

/* ===========================
   Table Builder Helper
   =========================== */
function buildTable(headers, rows) {
    let html = '<table class="data-table"><thead><tr>';
    headers.forEach(h => {
        html += `<th>${h}</th>`;
    });
    html += '</tr></thead><tbody>';

    rows.forEach(row => {
        html += '<tr>';
        row.forEach((cell, i) => {
            // Style check/cross marks with Lucide icons
            let cellHtml = cell;
            if (cell === '✓') cellHtml = '<i data-lucide="check" class="table-check"></i>';
            else if (cell === '✗') cellHtml = '<i data-lucide="x" class="table-cross"></i>';
            else {
                cellHtml = cell
                    .replace(/✓/g, '<i data-lucide="check" class="table-check"></i> ')
                    .replace(/✗/g, '<i data-lucide="x" class="table-cross"></i> ');
            }

            // Replace standalone dashes in empty-looking cells
            if (cell.trim() === '—' || cell.trim() === '-') {
                cellHtml = '<span class="table-partial">—</span>';
            }

            // Bold first column
            if (i === 0) {
                html += `<td><strong>${cellHtml}</strong></td>`;
            } else {
                html += `<td>${cellHtml}</td>`;
            }
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
}

/* Re-init Lucide after JS tables are built */
function refreshLucide() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/* ===========================
   Smooth scroll for anchor links
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // navbar height
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* ===========================
   Navbar background on scroll
   =========================== */
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

/* ===========================
   Initialize Lucide Icons
   =========================== */
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
