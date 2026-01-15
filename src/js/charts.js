// Charts Configuration
document.addEventListener('DOMContentLoaded', () => {
    // Shared Colors
    const colors = {
        primary: '#3b82f6',
        accent: '#06b6d4',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        bg: '#1e293b',
        grid: '#334155',
        text: '#94a3b8'
    };

    // Shared Options
    Chart.defaults.color = colors.text;
    Chart.defaults.scale.grid.color = colors.grid;
    Chart.defaults.font.family = "'Inter', sans-serif";

    // 1. Speed Chart
    const speedCtx = document.getElementById('speedChart');
    if (speedCtx) {
        new Chart(speedCtx, {
            type: 'bar',
            data: {
                labels: ['USB 2.0', 'HDD', 'SATA SSD', 'NVMe Gen3', 'NVMe Gen4'],
                datasets: [{
                    label: 'Скорост на четене (MB/s)',
                    data: [40, 160, 560, 3500, 7000],
                    backgroundColor: [
                        colors.text,
                        colors.warning,
                        colors.primary,
                        colors.accent,
                        colors.success
                    ],
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: colors.grid }
                    }
                }
            }
        });
    }

    // 2. Price/Capacity Chart
    const priceCtx = document.getElementById('priceChart');
    if (priceCtx) {
        new Chart(priceCtx, {
            type: 'line',
            data: {
                labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
                datasets: [{
                    label: 'SSD Цена (лв/GB)',
                    data: [0.45, 0.38, 0.30, 0.22, 0.18, 0.15],
                    borderColor: colors.primary,
                    tension: 0.4,
                    fill: false
                }, {
                    label: 'HDD Цена (лв/GB)',
                    data: [0.06, 0.05, 0.05, 0.04, 0.04, 0.035],
                    borderColor: colors.warning,
                    tension: 0.4,
                    fill: false,
                    borderDash: [5, 5]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                }
            }
        });
    }

    // 3. Market Share Chart
    const marketCtx = document.getElementById('marketChart');
    if (marketCtx) {
        new Chart(marketCtx, {
            type: 'doughnut',
            data: {
                labels: ['SSD (Всички тилове)', 'HDD', 'Flash/USB', 'Cloud'],
                datasets: [{
                    data: [65, 15, 10, 10],
                    backgroundColor: [
                        colors.primary,
                        colors.warning,
                        colors.danger,
                        colors.accent
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: colors.text }
                    }
                }
            }
        });
    }

    // 4. Lifespan Chart
    const lifeCtx = document.getElementById('lifeChart');
    if (lifeCtx) {
        new Chart(lifeCtx, {
            type: 'radar',
            data: {
                labels: ['Физическа Здравина', 'Магнитна Защита', 'Брой Записи', 'Живот на Съхранение', 'Цена/Надеждност'],
                datasets: [{
                    label: 'SSD',
                    data: [90, 100, 70, 60, 80],
                    borderColor: colors.primary,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                }, {
                    label: 'HDD',
                    data: [40, 20, 90, 80, 70],
                    borderColor: colors.warning,
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: colors.grid },
                        grid: { color: colors.grid },
                        pointLabels: { color: colors.text }
                    }
                }
            }
        });
    }
});
