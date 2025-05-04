const debugInfo = setting.debug;

function styleInfo(message1, message2, primary_color, second_color) {
    console.log(
        `%c${message1}%c${message2}`,
        `background-color: ${primary_color}; color: ${second_color}; padding: 5px; border-radius: 15px 0 0 15px`,
        `background-color: ${second_color}; color: ${primary_color}; padding: 5px; border-radius: 0 15px 15px 0`
    );
}

function debug(DebugMessage, action = 'info') {
    if (debugInfo) {
        styleInfo(`${action}`, DebugMessage, `${action === 'error' ? '#d57079' : action === 'warn' ? '#e5c07b' : '#6eaf91'}`, "#fff");
    }
}

styleInfo("Arona version", version, "#4d6491", "#fff");
if (!debugInfo) {
    styleInfo("Log process:", "disabled", `#d280e5`, "#fff");
}