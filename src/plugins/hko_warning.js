async function getData() {
    const url = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warnsum&lang=en';
    try {
        const response = await fetch(url);
        const json = await response.json();
        const container = document.getElementById('warning_sign');
        if (Object.keys(json).length > 0) {
            Object.values(json).forEach(warning => {
                if (warning.code) {
                    const warningElement = document.createElement('img');
                    warningElement.className = 'warning_sign';
                    warningElement.alt = warning.code;
                    warningElement.title = `${warning.name}現正生效 - 資訊來自data.gov.hk`;
                    warningElement.src = `../data/warning_sign/${warning.code}.gif`;
                    container.appendChild(warningElement);
                }
            });
        } else {
            document.getElementById('warning_sign').remove();
        }
    } catch (error) {
        console.error(error.message);
    }
}
getData();