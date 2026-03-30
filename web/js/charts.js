document.addEventListener('DOMContentLoaded', () => {
  Chart.defaults.color = '#a1a1aa';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
  Chart.defaults.font.family = "'Space Grotesk', system-ui, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.responsive = true;
  Chart.defaults.maintainAspectRatio = true;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.padding = 16;
  Chart.defaults.plugins.legend.labels.boxWidth = 8;

  const COLORS = {
    indigo: '#6366f1',
    indigoSoft: 'rgba(99,102,241,0.7)',
    blue: '#3b82f6',
    green: '#22c55e',
    orange: '#f97316',
    red: '#ef4444',
    yellow: '#eab308',
    purple: '#a855f7',
    cyan: '#06b6d4',
    pink: '#ec4899',
    teal: '#14b8a6',
    lime: '#84cc16'
  };

  const devices = ['USB Flash', 'SSD', 'HDD', 'SD карта', 'CD/DVD'];
  const deviceColors = [COLORS.indigo, COLORS.blue, COLORS.orange, COLORS.green, COLORS.red];
  const deviceColorsBg = [
    'rgba(99,102,241,0.7)',
    'rgba(59,130,246,0.7)',
    'rgba(249,115,22,0.7)',
    'rgba(34,197,94,0.7)',
    'rgba(239,68,68,0.7)'
  ];
  const speedCtx = document.getElementById('speedChart');
  if (speedCtx) {
    new Chart(speedCtx, {
      type: 'bar',
      data: {
        labels: devices,
        datasets: [
          {
            label: 'Мин. скорост (MB/s)',
            data: [100, 500, 80, 90, 1.2],
            backgroundColor: 'rgba(99,102,241,0.5)',
            borderColor: COLORS.indigo,
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Макс. скорост (MB/s)',
            data: [400, 2000, 160, 300, 22],
            backgroundColor: 'rgba(129,140,248,0.7)',
            borderColor: '#818cf8',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y} MB/s`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'MB/s' },
            grid: { color: 'rgba(255,255,255,0.04)' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }
  const bwCtx = document.getElementById('bandwidthChart');
  if (bwCtx) {
    new Chart(bwCtx, {
      type: 'bar',
      data: {
        labels: ['USB 2.0', 'USB 3.0', 'USB 3.1', 'USB 3.2', 'SATA III', 'NVMe Gen 4', 'NVMe Gen 5', 'TB 3/4', 'TB 5'],
        datasets: [{
          label: 'Макс. скорост (MB/s)',
          data: [60, 625, 1250, 2500, 600, 7000, 14000, 5000, 10000],
          backgroundColor: [
            'rgba(99,102,241,0.6)',
            'rgba(99,102,241,0.65)',
            'rgba(99,102,241,0.7)',
            'rgba(99,102,241,0.8)',
            'rgba(249,115,22,0.7)',
            'rgba(34,197,94,0.7)',
            'rgba(34,197,94,0.85)',
            'rgba(168,85,247,0.7)',
            'rgba(168,85,247,0.85)'
          ],
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.parsed.x.toLocaleString()} MB/s`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: { display: true, text: 'MB/s' },
            grid: { color: 'rgba(255,255,255,0.04)' }
          },
          y: {
            grid: { display: false }
          }
        }
      }
    });
  }
  const priceCtx = document.getElementById('priceChart');
  if (priceCtx) {
    new Chart(priceCtx, {
      type: 'bar',
      data: {
        labels: devices,
        datasets: [
          {
            label: 'Мин. цена (€/GB)',
            data: [0.05, 0.07, 0.02, 0.08, 0.01],
            backgroundColor: 'rgba(34,197,94,0.5)',
            borderColor: COLORS.green,
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Макс. цена (€/GB)',
            data: [0.15, 0.12, 0.04, 0.20, 0.03],
            backgroundColor: 'rgba(34,197,94,0.8)',
            borderColor: COLORS.green,
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: €${ctx.parsed.y}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: '€/GB' },
            grid: { color: 'rgba(255,255,255,0.04)' }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }
  const nandCtx = document.getElementById('nandChart');
  if (nandCtx) {
    new Chart(nandCtx, {
      type: 'bar',
      data: {
        labels: ['SLC', 'MLC', 'TLC', 'QLC'],
        datasets: [{
          label: 'P/E цикли (×1000)',
          data: [100, 10, 4, 1],
          backgroundColor: [
            COLORS.indigo,
            COLORS.blue,
            COLORS.orange,
            COLORS.red
          ],
          borderRadius: 6,
          barThickness: 48
        }]
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.parsed.y.toLocaleString()}×1000 цикли`
            }
          }
        },
        scales: {
          y: {
            type: 'logarithmic',
            title: { display: true, text: 'P/E цикли (×1000, лог. скала)' },
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
              callback: (v) => v.toLocaleString()
            }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }
  const riskCtx = document.getElementById('riskChart');
  if (riskCtx) {
    const riskData = [
      { label: 'Malware', x: 4.2, y: 4.8, r: 20, severity: 'critical' },
      { label: 'Кражба', x: 3.8, y: 5.0, r: 19, severity: 'critical' },
      { label: 'Рансъмуер', x: 3.2, y: 4.5, r: 17, severity: 'high' },
      { label: 'Head Crash', x: 2.8, y: 4.0, r: 15, severity: 'high' },
      { label: 'ФС Корупция', x: 3.5, y: 3.2, r: 14, severity: 'high' },
      { label: 'BadUSB', x: 2.2, y: 4.3, r: 13, severity: 'medium' },
      { label: 'NAND Износване', x: 2.5, y: 2.5, r: 11, severity: 'low' },
      { label: 'CD Деградация', x: 2.8, y: 1.8, r: 10, severity: 'low' }
    ];

    const sevColors = {
      critical: 'rgba(239,68,68,0.6)',
      high: 'rgba(249,115,22,0.6)',
      medium: 'rgba(234,179,8,0.6)',
      low: 'rgba(34,197,94,0.5)'
    };

    const sevBorder = {
      critical: '#ef4444',
      high: '#f97316',
      medium: '#eab308',
      low: '#22c55e'
    };

    new Chart(riskCtx, {
      type: 'bubble',
      data: {
        datasets: riskData.map(d => ({
          label: d.label,
          data: [{ x: d.x, y: d.y, r: d.r }],
          backgroundColor: sevColors[d.severity],
          borderColor: sevBorder[d.severity],
          borderWidth: 1.5
        }))
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: ctx => {
                const d = riskData[ctx.datasetIndex];
                return `${d.label}: Вероятност ${d.x}, Въздействие ${d.y}`;
              }
            }
          },
          legend: {
            labels: { font: { size: 11 } }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Вероятност' },
            min: 1.5, max: 5,
            grid: { color: 'rgba(255,255,255,0.04)' }
          },
          y: {
            title: { display: true, text: 'Въздействие' },
            min: 1, max: 5.5,
            grid: { color: 'rgba(255,255,255,0.04)' }
          }
        }
      }
    });
  }
  const dlCtx = document.getElementById('datalossChart');
  if (dlCtx) {
    new Chart(dlCtx, {
      type: 'doughnut',
      data: {
        labels: ['Хардуер', 'Софтуер', 'Случайно', 'Друго'],
        datasets: [{
          data: [67, 14, 10, 9],
          backgroundColor: [
            COLORS.red,
            COLORS.orange,
            COLORS.yellow,
            COLORS.indigo
          ],
          borderWidth: 0,
          hoverBorderColor: '#fff',
          hoverBorderWidth: 2
        }]
      },
      options: {
        cutout: '55%',
        plugins: {
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.label}: ${ctx.parsed}%`
            }
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
  const radarCtx = document.getElementById('radarChart');
  if (radarCtx) {
    const criteria = ['Скорост', 'Капацитет', 'Преносимост', 'Надеждност', 'Цена/GB', 'Криптиране'];
    const radarData = {
      'USB Flash': [5, 4, 10, 5, 6, 4],
      'SSD': [9, 6, 8, 8, 5, 6],
      'HDD': [3, 10, 5, 6, 9, 5],
      'SD карта': [5, 4, 10, 5, 5, 3],
      'CD/DVD': [1, 1, 3, 8, 10, 7]
    };

    new Chart(radarCtx, {
      type: 'bar',
      data: {
        labels: criteria,
        datasets: Object.entries(radarData).map(([name, data], i) => ({
          label: name,
          data: data,
          backgroundColor: deviceColorsBg[i],
          borderColor: deviceColors[i],
          borderWidth: 1,
          borderRadius: 3
        }))
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            max: 10,
            title: { display: true, text: 'Оценка (1–10)' },
            grid: { color: 'rgba(255,255,255,0.04)' }
          },
          y: {
            grid: { display: false }
          }
        },
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${ctx.parsed.x}/10`
            }
          }
        }
      }
    });
  }
  const attackCtx = document.getElementById('attackChart');
  if (attackCtx) {
    new Chart(attackCtx, {
      type: 'polarArea',
      data: {
        labels: ['AutoRun', 'BadUSB', 'USB Drop', 'Ransomware', 'Juice Jacking', 'Data Exfil'],
        datasets: [{
          data: [37, 12, 25, 18, 8, 30],
          backgroundColor: [
            'rgba(239,68,68,0.6)',
            'rgba(168,85,247,0.6)',
            'rgba(249,115,22,0.6)',
            'rgba(234,179,8,0.6)',
            'rgba(6,182,212,0.6)',
            'rgba(99,102,241,0.6)'
          ],
          borderWidth: 0
        }]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            ticks: { backdropColor: 'transparent' },
            grid: { color: 'rgba(255,255,255,0.06)' }
          }
        },
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.label}: ${ctx.parsed.r}`
            }
          }
        }
      }
    });
  }
  function createTable(headers, rows, wrapId) {
    const wrap = document.getElementById(wrapId);
    if (!wrap) return;

    let html = '<table class="data-table"><thead><tr>';
    headers.forEach(h => { html += `<th>${h}</th>`; });
    html += '</tr></thead><tbody>';

    rows.forEach(row => {
      html += '<tr>';
      row.forEach((cell, i) => {
        const cls = i > 0 ? ' class="mono"' : '';
        html += `<td${cls}>${cell}</td>`;
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    wrap.innerHTML = html;
  }
  createTable(
    ['Параметър', 'USB Flash', 'Външен SSD', 'Външен HDD', 'SD карта', 'CD/DVD'],
    [
      ['Капацитет', '4 GB–2 TB', '120 GB–8 TB', '500 GB–20 TB', '2 GB–1 TB', '700 MB–8.5 GB'],
      ['Скорост четене', '100–400 MB/s', '500–2000 MB/s', '80–160 MB/s', '90–300 MB/s', '1.2–22 MB/s'],
      ['Интерфейс', 'USB 2.0/3.x', 'USB 3.x/TB', 'USB 3.0/SATA', 'SD/microSD', 'SATA/USB'],
      ['Тегло', '~10 g', '~50 g', '~150 g', '~2 g', '~16 g'],
      ['Цена/GB (€)', '0.05–0.15', '0.07–0.12', '0.02–0.04', '0.08–0.20', '0.01–0.03'],
      ['Издръжливост', 'TLC/QLC', 'TLC/QLC', 'Механична', 'TLC', 'Оптична'],
      ['Криптиране', 'Софтуерно', 'Хардуерно/Софт.', 'Софтуерно', 'Ограничено', 'Не'],
      ['Преносимост', '★★★★★', '★★★★☆', '★★★☆☆', '★★★★★', '★★★☆☆'],
      ['Надеждност', '★★★☆☆', '★★★★☆', '★★★☆☆', '★★★☆☆', '★★★★☆'],
      ['Типична употреба', 'Трансфер', 'Видео/Бекъп', 'Архив/Бекъп', 'Камери/IoT', 'Архив']
    ],
    'comparisonTableWrap'
  );
  createTable(
    ['Параметър', 'BitLocker To Go', 'VeraCrypt', 'LUKS'],
    [
      ['Платформа', 'Windows', 'Windows/macOS/Linux', 'Linux'],
      ['Алгоритми', 'AES-128/256', 'AES/Serpent/Twofish', 'AES-XTS-plain64'],
      ['Тип криптиране', 'Пълен диск', 'Контейнер/Диск', 'Пълен диск'],
      ['Скрити томове', 'Не', 'Да', 'Частично'],
      ['TPM поддръжка', 'Да', 'Не', 'Не'],
      ['Open-Source', 'Не', 'Да', 'Да'],
      ['Управление GPO', 'Да', 'Не', 'Не'],
      ['Recovery Key', 'AD/Azure', 'Файл', 'Header backup'],
      ['Сложност', 'Ниска', 'Средна', 'Висока'],
      ['Препоръка', 'Корпоративна', 'Универсална', 'Linux среди']
    ],
    'encryptionTableWrap'
  );
  createTable(
    ['Решение', 'Тип', 'Обхват', 'Цена', 'Ефективност'],
    [
      ['BitLocker To Go', 'Криптиране', 'Windows', 'Включена в Windows Pro', '★★★★★'],
      ['VeraCrypt', 'Криптиране', 'Крос-платформен', 'Безплатен', '★★★★★'],
      ['GPO политики', 'Контрол на достъпа', 'AD среди', 'Безплатен', '★★★★☆'],
      ['Microsoft Endpoint Manager', 'Управление', 'Azure AD', 'Лиценз M365', '★★★★★'],
      ['USB Guard (Linux)', 'Whitelist', 'Linux', 'Безплатен', '★★★★☆'],
      ['Антивирус с USB скан', 'Защита', 'Универсален', 'Платен/Безпл.', '★★★☆☆'],
      ['Физически блокери', 'Хардуер', 'Универсален', 'Нисък', '★★★☆☆'],
      ['DLP решения', 'Мониторинг', 'Корпоративен', 'Висок', '★★★★★']
    ],
    'protectionTableWrap'
  );
  createTable(
    ['Файлова система', 'Макс. файл', 'Журнал', 'ACL', 'Криптиране', 'Платформа'],
    [
      ['FAT32', '4 GB', 'Не', 'Не', 'Не', 'Универсална'],
      ['NTFS', '16 TB', 'Да', 'Да', 'EFS/BitLocker', 'Windows'],
      ['exFAT', '16 EB', 'Не', 'Не', 'Не', 'Крос-платформена'],
      ['ext4', '16 TB', 'Да', 'POSIX', 'LUKS', 'Linux'],
      ['APFS', '8 EB', 'CoW', 'Да', 'Вградено', 'macOS/iOS']
    ],
    'filesystemsTableWrap'
  );
  createTable(
    ['#', 'Функция', 'Практика', 'Приоритет'],
    [
      ['1', '<span class="nist-badge id">ID</span>', 'Инвентаризация на одобрени USB устройства', 'Висок'],
      ['2', '<span class="nist-badge id">ID</span>', 'Класификация на данните по чувствителност', 'Висок'],
      ['3', '<span class="nist-badge pr">PR</span>', 'Задължително AES-256 криптиране', 'Критичен'],
      ['4', '<span class="nist-badge pr">PR</span>', 'Принцип за минимални привилегии', 'Висок'],
      ['5', '<span class="nist-badge pr">PR</span>', 'Обучение на персонала за USB заплахи', 'Среден'],
      ['6', '<span class="nist-badge de">DE</span>', 'Мониторинг чрез Event 4663', 'Висок'],
      ['7', '<span class="nist-badge de">DE</span>', 'Автоматично сканиране при свързване', 'Висок'],
      ['8', '<span class="nist-badge rs">RS</span>', 'Инцидентна реакция при загуба', 'Критичен'],
      ['9', '<span class="nist-badge rs">RS</span>', 'Remote wipe на криптирани носители', 'Среден'],
      ['10', '<span class="nist-badge rc">RC</span>', 'Възстановяване по правило 3-2-1', 'Критичен']
    ],
    'nistTableWrap'
  );
  createTable(
    ['Година', 'Тип устройство', 'Цена за GB ($)', 'Скорост (MB/s)'],
    [
      ['1980', 'Hard Disk Drive (5.25")', '1 000 000', '0.5'],
      ['1987', 'Hard Disk Drive (3.5")', '50 000', '2'],
      ['1995', 'Zip Drive', '2 000', '1.4'],
      ['1998', 'Compact Flash', '400', '4'],
      ['2000', 'USB 1.1 Flash Drive', '100', '1'],
      ['2004', 'USB 2.0 Flash Drive', '20', '30'],
      ['2007', '1TB External HDD', '0.10', '60'],
      ['2010', 'SATA III SSD', '2', '500'],
      ['2013', 'USB 3.0 Flash Drive', '0.80', '100'],
      ['2016', 'NVMe External SSD', '0.35', '1 000'],
      ['2020', 'Thunderbolt 3 SSD', '0.20', '2 800'],
      ['2024', 'USB4 / Thunderbolt 4', '0.08', '3 500']
    ],
    'historyTableWrap'
  );
  createTable(
    ['№', 'Риск', 'Вероятност', 'Въздействие', 'Ниво на риска'],
    [
      ['1', 'Заразяване със зловреден софтуер чрез USB', 'Висока', 'Критично', 'Много високо'],
      ['2', 'Кражба/загуба на некриптиран носител', 'Висока', 'Критично', 'Много високо'],
      ['3', 'Рансъмуер атака чрез външен носител', 'Средна', 'Критично', 'Висок'],
      ['4', 'Head crash при външен HDD (при транспорт)', 'Средна', 'Високо', 'Висок'],
      ['5', 'Корупция на ФС при неправилно изваждане', 'Висока', 'Средно', 'Висок'],
      ['6', 'BadUSB атака (модифициран фърмуер)', 'Ниска', 'Критично', 'Среден'],
      ['7', 'Износване на NAND клетки (SSD/USB)', 'Ниска', 'Средно', 'Нисък'],
      ['8', 'Деградация на оптичен носител (CD/DVD)', 'Средна', 'Ниско', 'Нисък']
    ],
    'riskTableWrap'
  );
  createTable(
    ['Операция', 'USB-Allowed (GRP_USB_Allowed)', 'USB-Blocked (GRP_USB_Blocked)'],
    [
      ['Четене от USB устройство', 'Разрешено', 'Разрешено'],
      ['Запис върху USB устройство', 'Разрешено (само при активиран BitLocker)', 'Забранено (Deny write access)'],
      ['Криптиране с BitLocker To Go', 'Задължително за запис', 'Не е приложимо'],
      ['Одит (Event Log)', 'Да – Event ID 4663 (успешен достъп)', 'Да – Event ID 4663 (отказан достъп)']
    ],
    'usbGroupsTableWrap'
  );
  createTable(
    ['Настройка', 'Стойност'],
    [
      ['Removable Disks: Deny write access', 'Enabled'],
      ['Removable Disks: Deny read access', 'Not Configured'],
      ['All Removable Storage classes: Deny all access', 'Not Configured'],
      ['CD and DVD: Deny write access', 'Enabled'],
      ['Tape Drives: Deny write access', 'Enabled']
    ],
    'gpoRemovableTableWrap'
  );
  createTable(
    ['Настройка', 'Стойност'],
    [
      ['Prevent installation of devices not described by other policy settings', 'Enabled'],
      ['Allow installation of devices that match any of these Device Instance IDs', 'Enabled (списък с одобрени ID)'],
      ['Prevent installation of devices using drivers that match these device setup classes', 'Enabled {36FC9E60-C465-11CF-8056-444553540000} (USB Mass Storage)']
    ],
    'gpoInstallTableWrap'
  );
  createTable(
    ['Настройка', 'Стойност'],
    [
      ['Deny write access to removable drives not protected by BitLocker', 'Enabled'],
      ['Control use of BitLocker on removable drives', 'Enabled'],
      ['→ Allow users to apply BitLocker protection', 'Checked'],
      ['→ Allow users to suspend and decrypt', 'Unchecked'],
      ['Choose how BitLocker-protected removable drives can be recovered', 'Enabled'],
      ['→ Allow data recovery agent', 'Checked'],
      ['→ Save BitLocker recovery information to AD DS', 'Checked']
    ],
    'gpoBitlockerTableWrap'
  );
  createTable(
    ['Настройка', 'Стойност'],
    [
      ['Audit Removable Storage', 'Success, Failure'],
      ['Audit PNP Activity', 'Success']
    ],
    'auditTableWrap'
  );
  createTable(
    ['№', 'VID', 'PID', 'Сериен номер', 'Производител', 'Модел', 'Потребител', 'Отдел', 'Дата на регистрация', 'Статус'],
    [
      ['1', '781', '5591', '4C53000121', 'SanDisk', 'Ultra Flair 64GB', 'Иванов, П.', 'ИТ', '15.01.2025', 'Активен'],
      ['2', '951', '1666', 'E0D55EA573', 'Kingston', 'DT100 G3 32GB', 'Петрова, М.', 'Счетов.', '22.02.2025', 'Активен'],
      ['3', '8564', '1000', 'AA00000489', 'Transcend', 'JetFlash 128GB', 'Георгиев, Д.', 'Маркет.', '10.03.2025', 'Деактив.']
    ],
    'inventoryTableWrap'
  );
  createTable(
    ['№', 'Стъпка', 'Инструменти'],
    [
      ['1.1', 'Идентифициране на устройството (VID/PID/сериен номер)', '—'],
      ['1.2', 'Резервно копие на необходимите данни (ако има такива)', '—'],
      ['1.3', 'Презаписване с нули/единици/произволни стойности (мин. 1 пас)', 'Windows: cipher /w:D:\\ · Linux: shred -vfz -n 3 /dev/sdb · DBAN: bootable носител'],
      ['1.4', 'Верификация чрез четене на случайни блокове', '—'],
      ['1.5', 'Документиране: устройство, метод, дата, отговорник', '—']
    ],
    'clearTableWrap'
  );
  createTable(
    ['№', 'Стъпка', 'Инструменти'],
    [
      ['2.1', 'Идентифициране на устройството и тип (HDD/SSD/NVMe)', '—'],
      ['2.2', 'Резервно копие на необходимите данни (ако има такива)', '—'],
      ['2.3', 'Изпълнение на Secure Erase / Cryptographic Erase', 'NVMe: nvme format /dev/nvme0n1 --ses=1 · SATA SSD: hdparm --security-erase NULL /dev/sda · HDD: 3+ паса (DoD 5220.22-M) · Криптирани: унищожаване на ключа'],
      ['2.4', 'Верификация: четене на целия носител, потвърждаване на липса на възстановими данни', '—'],
      ['2.5', 'Документиране: сертификат за изтриване с подпис', '—']
    ],
    'purgeTableWrap'
  );
  createTable(
    ['№', 'Стъпка', 'Методи'],
    [
      ['3.1', 'Идентифициране на устройството (VID/PID/сериен номер)', '—'],
      ['3.2', 'Избор на метод за физическо унищожаване', 'Шредиране (≤ 2 mm) · Дегаусиране (само HDD) · Изгаряне (лицензиран оператор) · Химическо разтваряне (NAND)'],
      ['3.3', 'Извършване на унищожаването от оторизиран персонал', '—'],
      ['3.4', 'Визуална верификация: устройството е физически неразпознаваемо и неработоспособно', '—'],
      ['3.5', 'Документиране: протокол за унищожаване с подпис на двама свидетели, снимков материал', '—'],
      ['3.6', 'Актуализиране на инвентарния регистър – статус „Унищожен"', '—']
    ],
    'destroyTableWrap'
  );
  createTable(
    ['Критерий', 'Clear', 'Purge', 'Destroy'],
    [
      ['Клас на данните', 'Нисък–среден', 'Висок', 'Най-висок'],
      ['Носителят остава', 'В организацията', 'Напуска контрола', 'Не – унищожен'],
      ['Време', 'Минути–часове', 'Минути–часове', 'Минути'],
      ['Цена', 'Ниска', 'Ниска–средна', 'Средна–висока'],
      ['Гаранция', 'Средна', 'Висока', 'Абсолютна'],
      ['Стандарт', 'NIST SP 800-88 (Clear)', 'NIST SP 800-88 (Purge)', 'NIST SP 800-88 (Destroy)']
    ],
    'sanitizeCompareTableWrap'
  );

});
