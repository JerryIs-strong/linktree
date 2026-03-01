document.addEventListener('DOMContentLoaded', async () => {
    try {
        const pluginsList = setting['plugins'].list;
        if (pluginsList != null && pluginsList != '' && pluginsList != false) {
            Object.keys(pluginsList).forEach((key) => {
                const pluginName = pluginsList[key];
                const script = document.createElement('script');
                script.src = `./src/plugins/${pluginName}.js`;
                document.body.appendChild(script);
            });
            styleInfo("[System] Installed plugins:", pluginsList, '#7fa3e9', "auto");
        }
    } catch (error) {
        console.error('Error fetching or parsing the setting.json file:', error);
    }
});