function init() {
    var css_link = document.createElement('link');
    css_link.rel = 'stylesheet';
    css_link.href = 'src/data/style/dcount.css';
    document.head.appendChild(css_link);
    styleInfo("[Plugins] Day Counter:", "Resources initialized", '#98f3d8', "auto");
}

function calculateDayCount(startDate, isAnnual) {
    const today = new Date();
    let eventDate;
    if (isAnnual) {
        const [month, day] = startDate.split('-').map(Number);
        if (month < today.getMonth() + 1 || (month === today.getMonth() + 1 && day < today.getDate())) {
            eventDate = new Date(today.getFullYear() + 1, month - 1, day);
        }
        else {
            eventDate = new Date(today.getFullYear(), month - 1, day);
        }
    } else {
        eventDate = new Date(startDate);
        eventDate.setHours(0, 0, 0, 0);
    }
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function createCard(name, startDay, dayCount, isAnnual = false) {
    const card = document.createElement('div');
    card.className = 'dcount-card';
    const startDayElement = document.createElement('div');
    startDayElement.textContent = startDay;
    startDayElement.className = 'dcount-card-start-day';
    const title = document.createElement('div');
    title.textContent = name;
    title.className = 'dcount-card-title';
    const dayCountElement = document.createElement('div');
    dayCountElement.textContent = dayCount > 0 ? `D-${dayCount}` : `D+${Math.abs(dayCount)}`;
    if (dayCount === 0) {
        card.setAttribute('data-today', true);
    }
    dayCountElement.className = 'dcount-card-day-count';
    if (!isAnnual) {
        const negDayCount = -dayCount;
        if (negDayCount > 0 || (negDayCount < 0 && negDayCount >= -30)) {
            const tag = document.createElement('div');
            tag.className = "dcount-progress";
            const tagIcon = document.createElement('div');
            tagIcon.className = "dcount-progress-icon";
            tagIcon.innerHTML = '<span class="material-symbols-outlined">progress_activity</span>';
            tag.appendChild(tagIcon);
            const tagText = document.createElement('div');
            tagText.className = "dcount-progress-text";
            if (negDayCount >= 365) {
                tagText.textContent = 'A long time ago';
                tag.style.backgroundColor = '#cab123';
            } else if (negDayCount < 0) {
                tagText.textContent = 'Upcoming';
                tag.style.backgroundColor = '#31a2ac';
            } else {
                tagText.textContent = 'In progress';
            }
            tag.appendChild(tagText);
            card.appendChild(tag);
        }
    }
    card.appendChild(title);
    card.appendChild(dayCountElement);
    card.appendChild(startDayElement);
    return card;
}

function renderDayCounts() {
    const container = document.getElementById('dcount-container');
    if (!container) {
        console.error('Container element with id "dcount-container" not found in index.html');
        return;
    }
    fetch('./src/data/dcount.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch dcount.json: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            data.data.forEach(event => {
                const isAnnual = event.type === 'Annually';
                const dayCount = calculateDayCount(event.start_date, isAnnual);
                const card = createCard(event.name, event.start_date, dayCount, isAnnual);
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error loading dcount.json:', error);
        });
}

init();
renderDayCounts();