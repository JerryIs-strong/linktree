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
        console.log(eventDate, today);
    }

    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(diffDays, eventDate, today);
    

    return diffDays;
}

function createCard(name, startDay, dayCount) {
    const card = document.createElement('div');
    card.className = 'dcount-card';

    const startDayElement = document.createElement('div');
    startDayElement.textContent = startDay;
    startDayElement.className = 'dcount-card-start-day';

    const title = document.createElement('div');
    title.textContent = name;
    title.className = 'dcount-card-title';

    const dayCountElement = document.createElement('div');
    if (dayCount === 0) {
        dayCountElement.textContent = "Is Today!";
        card.style.backgroundImage = "linear-gradient(45deg, #4413db70, #eb369969)";
    } else {
        dayCountElement.textContent = dayCount > 0 ? `D-${dayCount}` : `D+${Math.abs(dayCount)}`;
    }
    dayCountElement.className = 'dcount-card-day-count';

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
                const card = createCard(event.name, event.start_date, dayCount);
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error loading dcount.json:', error);
        });
}

renderDayCounts();
