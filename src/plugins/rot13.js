function decryptRot13(text) {
  return text.replace(/[a-zA-Z]/g, function (char) {
    const code = char.charCodeAt(0);
    const base = code < 91 ? 65 : 97; // Uppercase or lowercase
    return String.fromCharCode(((code - base + 13) % 26) + base);
  });
}

function decryptRot13InElement() {
    if(document.getElementById("rot13-input").value != "") {
        document.getElementById('rot13-output').textContent = decryptRot13(document.getElementById("rot13-input").value);
    }
}