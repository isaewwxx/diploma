// ===========================
// Графики с Chart.js
// ===========================

// Общи настройки за всички графики
Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
Chart.defaults.font.size = 14;
Chart.defaults.color = '#374151';

// Цветова палитра
const colors = {
    primary: '#2563eb',
    secondary: '#1e40af',
    accent: '#3b82f6',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    purple: '#8b5cf6',
    pink: '#ec4899',
    orange: '#f97316'
};

// 1. График за скорост на четене/запис
const speedCtx = document.getElementById('speedChart');
if (speedCtx) {
    new Chart(speedCtx, {
        type: 'bar',
        data: {
            labels: ['USB Flash', 'SSD NVMe', 'SSD SATA', 'HDD', 'SD карта', 'DVD'],
            datasets: [{
                label: 'Четене (MB/s)',
                data: [300, 7000, 560, 160, 300, 11],
                backgroundColor: colors.primary,
                borderColor: colors.secondary,
                borderWidth: 2
            }, {
                label: 'Запис (MB/s)',
                data: [200, 5000, 530, 140, 280, 11],
                backgroundColor: colors.accent,
                borderColor: colors.primary,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + ' MB/s';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Скорост (MB/s)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// 2. График за капацитет спрямо цена
const priceCapacityCtx = document.getElementById('priceCapacityChart');
if (priceCapacityCtx) {
    new Chart(priceCapacityCtx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'USB Flash',
                data: [{x: 0.15, y: 128}],
                backgroundColor: colors.primary,
                pointRadius: 8
            }, {
                label: 'SSD',
                data: [{x: 0.25, y: 1024}],
                backgroundColor: colors.success,
                pointRadius: 8
            }, {
                label: 'HDD',
                data: [{x: 0.03, y: 4000}],
                backgroundColor: colors.warning,
                pointRadius: 8
            }, {
                label: 'SD карта',
                data: [{x: 0.20, y: 256}],
                backgroundColor: colors.purple,
                pointRadius: 8
            }, {
                label: 'DVD',
                data: [{x: 0.10, y: 4.7}],
                backgroundColor: colors.danger,
                pointRadius: 8
            }, {
                label: 'Cloud',
                data: [{x: 0.01, y: 10000}],
                backgroundColor: colors.pink,
                pointRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.x + ' лв/GB, ' + context.parsed.y + ' GB';
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Цена (лв/GB)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(2) + ' лв';
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Типичен капацитет (GB)'
                    },
                    type: 'logarithmic',
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + ' GB';
                        }
                    }
                }
            }
        }
    });
}

// 3. График за пазарен дял
const marketShareCtx = document.getElementById('marketShareChart');
if (marketShareCtx) {
    new Chart(marketShareCtx, {
        type: 'doughnut',
        data: {
            labels: ['HDD', 'SSD', 'USB Flash', 'Cloud Storage', 'SD карти', 'Други'],
            datasets: [{
                data: [25, 35, 15, 18, 5, 2],
                backgroundColor: [
                    colors.warning,
                    colors.success,
                    colors.primary,
                    colors.pink,
                    colors.purple,
                    colors.accent
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

// 4. График за издръжливост
const durabilityCtx = document.getElementById('durabilityChart');
if (durabilityCtx) {
    new Chart(durabilityCtx, {
        type: 'horizontalBar',
        data: {
            labels: ['DVD', 'SSD', 'USB Flash', 'SD карта', 'HDD', 'Cloud'],
            datasets: [{
                label: 'Средна издръжливост (години)',
                data: [60, 12, 7, 7, 4, 999],
                backgroundColor: [
                    colors.danger,
                    colors.success,
                    colors.primary,
                    colors.purple,
                    colors.warning,
                    colors.pink
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.parsed.x >= 999) {
                                return 'Издръжливост: Безсрочно';
                            }
                            return 'Издръжливост: ' + context.parsed.x + ' години';
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Години'
                    },
                    ticks: {
                        callback: function(value) {
                            if (value >= 999) return 'Безсрочно';
                            return value + ' г.';
                        }
                    }
                }
            }
        }
    });
}

// 5. График за енергопотребление
const powerConsumptionCtx = document.getElementById('powerConsumptionChart');
if (powerConsumptionCtx) {
    new Chart(powerConsumptionCtx, {
        type: 'line',
        data: {
            labels: ['USB Flash', 'SSD', 'HDD 2.5"', 'HDD 3.5"', 'DVD привод'],
            datasets: [{
                label: 'Енергопотребление при работа (W)',
                data: [0.5, 3, 2, 8, 15],
                borderColor: colors.primary,
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: colors.primary
            }, {
                label: 'Енергопотребление в режим на готовност (W)',
                data: [0.1, 0.5, 0.8, 1.5, 2],
                borderColor: colors.success,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: colors.success
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + ' W';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Мощност (W)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' W';
                        }
                    }
                }
            }
        }
    });
}

// 6. График за честота на използване в корпоративна среда
const usageFrequencyCtx = document.getElementById('usageFrequencyChart');
if (usageFrequencyCtx) {
    new Chart(usageFrequencyCtx, {
        type: 'polarArea',
        data: {
            labels: ['Cloud Storage', 'SSD', 'HDD', 'USB Flash', 'Network Storage', 'External HDD'],
            datasets: [{
                data: [85, 75, 45, 60, 70, 40],
                backgroundColor: [
                    'rgba(236, 72, 153, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(37, 99, 235, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(239, 68, 68, 0.7)'
                ],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed.r + '% използване';
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Анимация при зареждане на графиките
document.addEventListener('DOMContentLoaded', () => {
    const chartContainers = document.querySelectorAll('.chart-container');
    
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                chartObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    chartContainers.forEach(container => {
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        container.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        chartObserver.observe(container);
    });
});

console.log('✅ Charts JavaScript loaded successfully');
