// Sonuç gösterme fonksiyonu
function showResult(text) {
    // Varsa eski sonuç kutusunu kaldır
    const existingBox = document.getElementById('gemini-result-box');
    if (existingBox) {
        existingBox.remove();
    }

    // Yeni sonuç kutusu oluştur
    const resultBox = document.createElement('div');
    resultBox.id = 'gemini-result-box';
    resultBox.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 15px 35px 15px 15px;
        max-width: 400px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;

    // Sonuç metni
    const resultText = document.createElement('p');
    resultText.style.cssText = `
        margin: 0;
        padding: 0;
        color: #333;
        font-size: 14px;
        line-height: 1.4;
    `;
    resultText.textContent = text;

    // Kapatma butonu
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        border: none;
        background: none;
        color: #666;
        font-size: 18px;
        cursor: pointer;
        padding: 0 5px;
    `;
    closeButton.onclick = () => resultBox.remove();

    // Kopyalama butonu
    const copyButton = document.createElement('button');
    copyButton.textContent = '📋';
    copyButton.title = 'Metni Kopyala';
    copyButton.style.cssText = `
        position: absolute;
        top: 5px;
        right: 25px;
        border: none;
        background: none;
        color: #666;
        font-size: 16px;
        cursor: pointer;
        padding: 0 5px;
    `;
    copyButton.onclick = () => {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyButton.textContent;
            copyButton.textContent = '✓';
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 1000);
        });
    };

    // Elementleri birleştir
    resultBox.appendChild(closeButton);
    resultBox.appendChild(copyButton);
    resultBox.appendChild(resultText);
    document.body.appendChild(resultBox);
}

// Background script'ten gelen mesajları dinle
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'showResult') {
        showResult(message.result);
    }
});
