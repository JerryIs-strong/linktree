(async () => {
    try {
        const [settingResponse, versionResponse] = await Promise.all([
            fetch('setting.json'),
            fetch('version.txt')
        ]);
        const data = await settingResponse.json();
        const version = await versionResponse.text();
        const existingSetting = JSON.parse(sessionStorage.getItem('setting') || '{}');
        if (!existingSetting.version || existingSetting.version !== version) {
            const setting = { ...data, version };
            sessionStorage.setItem('setting', JSON.stringify(setting));
            window.location.reload();
        }
    } catch (error) {
        console.error('Error fetching setting.json or version.txt:', error);
    }
})();