// Arayüz metinleri
const uiText = {
  'tr': {
    apiKeyLabel: 'Google Gemini API Anahtarı:',
    apiKeyPlaceholder: 'API anahtarınızı girin',
    saveButton: 'Kaydet',
    languageLabel: 'Çeviri Dili:',
    saveSuccess: 'API anahtarı kaydedildi!',
    saveError: 'Lütfen API anahtarı girin!',
    languageSuccess: 'Dil tercihi kaydedildi!'
  },
  'en': {
    apiKeyLabel: 'Google Gemini API Key:',
    apiKeyPlaceholder: 'Enter your API key',
    saveButton: 'Save',
    languageLabel: 'Translation Language:',
    saveSuccess: 'API key saved!',
    saveError: 'Please enter an API key!',
    languageSuccess: 'Language preference saved!'
  },
  'es': {
    apiKeyLabel: 'Clave API de Google Gemini:',
    apiKeyPlaceholder: 'Ingrese su clave API',
    saveButton: 'Guardar',
    languageLabel: 'Idioma de traducción:',
    saveSuccess: '¡Clave API guardada!',
    saveError: '¡Por favor ingrese una clave API!',
    languageSuccess: '¡Preferencia de idioma guardada!'
  },
  'fr': {
    apiKeyLabel: 'Clé API Google Gemini :',
    apiKeyPlaceholder: 'Entrez votre clé API',
    saveButton: 'Enregistrer',
    languageLabel: 'Langue de traduction :',
    saveSuccess: 'Clé API enregistrée !',
    saveError: 'Veuillez entrer une clé API !',
    languageSuccess: 'Préférence de langue enregistrée !'
  },
  'de': {
    apiKeyLabel: 'Google Gemini API-Schlüssel:',
    apiKeyPlaceholder: 'API-Schlüssel eingeben',
    saveButton: 'Speichern',
    languageLabel: 'Übersetzungssprache:',
    saveSuccess: 'API-Schlüssel gespeichert!',
    saveError: 'Bitte geben Sie einen API-Schlüssel ein!',
    languageSuccess: 'Spracheinstellung gespeichert!'
  },
  'it': {
    apiKeyLabel: 'Chiave API Google Gemini:',
    apiKeyPlaceholder: 'Inserisci la tua chiave API',
    saveButton: 'Salva',
    languageLabel: 'Lingua di traduzione:',
    saveSuccess: 'Chiave API salvata!',
    saveError: 'Inserisci una chiave API!',
    languageSuccess: 'Preferenza lingua salvata!'
  },
  'pt': {
    apiKeyLabel: 'Chave API do Google Gemini:',
    apiKeyPlaceholder: 'Digite sua chave API',
    saveButton: 'Salvar',
    languageLabel: 'Idioma de tradução:',
    saveSuccess: 'Chave API salva!',
    saveError: 'Por favor, insira uma chave API!',
    languageSuccess: 'Preferência de idioma salva!'
  },
  'ru': {
    apiKeyLabel: 'API-ключ Google Gemini:',
    apiKeyPlaceholder: 'Введите ваш API-ключ',
    saveButton: 'Сохранить',
    languageLabel: 'Язык перевода:',
    saveSuccess: 'API-ключ сохранен!',
    saveError: 'Пожалуйста, введите API-ключ!',
    languageSuccess: 'Языковые настройки сохранены!'
  },
  'ja': {
    apiKeyLabel: 'Google Gemini APIキー：',
    apiKeyPlaceholder: 'APIキーを入力してください',
    saveButton: '保存',
    languageLabel: '翻訳言語：',
    saveSuccess: 'APIキーが保存されました！',
    saveError: 'APIキーを入力してください！',
    languageSuccess: '言語設定が保存されました！'
  },
  'ko': {
    apiKeyLabel: 'Google Gemini API 키:',
    apiKeyPlaceholder: 'API 키를 입력하세요',
    saveButton: '저장',
    languageLabel: '번역 언어:',
    saveSuccess: 'API 키가 저장되었습니다!',
    saveError: 'API 키를 입력해주세요!',
    languageSuccess: '언어 설정이 저장되었습니다!'
  },
  'zh': {
    apiKeyLabel: 'Google Gemini API密钥：',
    apiKeyPlaceholder: '请输入API密钥',
    saveButton: '保存',
    languageLabel: '翻译语言：',
    saveSuccess: 'API密钥已保存！',
    saveError: '请输入API密钥！',
    languageSuccess: '语言偏好已保存！'
  }
};

// Arayüz metinlerini güncelle
function updateUIText(language) {
  const texts = uiText[language] || uiText['en'];
  
  document.getElementById('apiKeyLabel').textContent = texts.apiKeyLabel;
  document.getElementById('apiKey').placeholder = texts.apiKeyPlaceholder;
  document.getElementById('saveApiKey').textContent = texts.saveButton;
  document.getElementById('languageLabel').textContent = texts.languageLabel;
}

document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const saveButton = document.getElementById('saveApiKey');
  const languageSelect = document.getElementById('language');
  const resultDiv = document.getElementById('result');

  // API key ve dil tercihini storage'dan al
  chrome.storage.sync.get(['geminiApiKey', 'targetLanguage'], (result) => {
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
    }
    if (result.targetLanguage) {
      languageSelect.value = result.targetLanguage;
      updateUIText(result.targetLanguage);
    } else {
      // Varsayılan dil İngilizce
      updateUIText('en');
    }
  });

  // API key'i kaydet
  saveButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
        resultDiv.textContent = uiText[languageSelect.value].saveSuccess;
        resultDiv.className = 'success';
        chrome.runtime.sendMessage({ action: 'apiKeyUpdated', apiKey });
      });
    } else {
      resultDiv.textContent = uiText[languageSelect.value].saveError;
      resultDiv.className = 'error';
    }
  });

  // Dil seçimini kaydet
  languageSelect.addEventListener('change', () => {
    const language = languageSelect.value;
    chrome.storage.sync.set({ targetLanguage: language }, () => {
      updateUIText(language);
      resultDiv.textContent = uiText[language].languageSuccess;
      resultDiv.className = 'success';
      chrome.runtime.sendMessage({ action: 'languageUpdated', language });
    });
  });
});
