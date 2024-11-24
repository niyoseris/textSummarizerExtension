// Google Gemini API anahtarını ve dil tercihini saklamak için
let apiKey = '';
let targetLanguage = 'en'; // Varsayılan dil İngilizce

// Dil isimlerini tutan obje
const menuTitles = {
  'tr': {
    translate: 'Türkçeye Çevir',
    summarize: 'Türkçe Özetle'
  },
  'en': {
    translate: 'Translate to English',
    summarize: 'Summarize in English'
  },
  'es': {
    translate: 'Traducir al Español',
    summarize: 'Resumir en Español'
  },
  'fr': {
    translate: 'Traduire en Français',
    summarize: 'Résumer en Français'
  },
  'de': {
    translate: 'Auf Deutsch übersetzen',
    summarize: 'Auf Deutsch zusammenfassen'
  },
  'it': {
    translate: 'Traduci in Italiano',
    summarize: 'Riassumi in Italiano'
  },
  'pt': {
    translate: 'Traduzir para Português',
    summarize: 'Resumir em Português'
  },
  'ru': {
    translate: 'Перевести на Русский',
    summarize: 'Обобщить на Русском'
  },
  'ja': {
    translate: '日本語に翻訳',
    summarize: '日本語で要約'
  },
  'ko': {
    translate: '한국어로 번역',
    summarize: '한국어로 요약'
  },
  'zh': {
    translate: '翻译成中文',
    summarize: '用中文总结'
  }
};

const languageNames = {
  'tr': 'Turkish',
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese'
};

// API key ve dil tercihini storage'dan al
chrome.storage.sync.get(['geminiApiKey', 'targetLanguage'], (result) => {
  if (result.geminiApiKey) {
    apiKey = result.geminiApiKey;
  }
  if (result.targetLanguage) {
    targetLanguage = result.targetLanguage;
  }
});

// Storage değişikliklerini dinle
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.geminiApiKey) {
      apiKey = changes.geminiApiKey.newValue;
    }
    if (changes.targetLanguage) {
      targetLanguage = changes.targetLanguage.newValue;
      createContextMenu();
    }
  }
});

// Content script'e mesaj gönderme fonksiyonu
async function sendMessageToContentScript(tabId, message) {
  try {
    // Önce content script'i yüklemeyi dene
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
  } catch (error) {
    console.log('Content script already loaded or cannot be loaded');
  }

  // Mesajı gönder
  try {
    await chrome.tabs.sendMessage(tabId, message);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Context menu öğelerini oluştur
function createContextMenu() {
  // Önce tüm menü öğelerini temizle
  chrome.contextMenus.removeAll(() => {
    // Kısa bir gecikme ekleyerek menü öğelerinin tamamen silinmesini bekle
    setTimeout(() => {
      try {
        // Ana menü
        chrome.contextMenus.create({
          id: 'textHelper',
          title: 'Gemini Text Helper',
          contexts: ['selection']
        }, () => {
          if (chrome.runtime.lastError) {
            console.log('Menu creation error:', chrome.runtime.lastError);
            return;
          }

          // Çeviri menüsü
          chrome.contextMenus.create({
            id: 'translate',
            parentId: 'textHelper',
            title: menuTitles[targetLanguage].translate,
            contexts: ['selection']
          });

          // Özet menüsü
          chrome.contextMenus.create({
            id: 'summarize',
            parentId: 'textHelper',
            title: menuTitles[targetLanguage].summarize,
            contexts: ['selection']
          });
        });
      } catch (error) {
        console.error('Error creating context menu:', error);
      }
    }, 100); // 100ms gecikme
  });
}

// Eklenti yüklendiğinde menüyü oluştur
chrome.runtime.onInstalled.addListener(() => {
  createContextMenu();
});

// Popup'tan gelen mesajları dinle
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'apiKeyUpdated') {
    apiKey = message.apiKey;
  } else if (message.action === 'languageUpdated') {
    targetLanguage = message.language;
    createContextMenu();
  }
});

// Context menu tıklamalarını işle
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const selectedText = info.selectionText;

  switch (info.menuItemId) {
    case 'translate':
      translateText(selectedText, tab);
      break;
    case 'summarize':
      summarizeText(selectedText, tab);
      break;
  }
});

async function translateText(text, tab) {
  try {
    if (!apiKey) {
      await sendMessageToContentScript(tab.id, {
        action: 'showResult',
        result: 'Lütfen önce API anahtarınızı girin.'
      });
      return;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Translate the following text to ${languageNames[targetLanguage]}: ${text}`
          }]
        }]
      })
    });

    const data = await response.json();
    console.log('API Response:', data);

    if (!response.ok) {
      throw new Error(data.error?.message || 'API error');
    }

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid API response format');
    }

    const translation = data.candidates[0].content.parts[0].text;
    await sendMessageToContentScript(tab.id, {
      action: 'showResult',
      result: translation
    });
  } catch (error) {
    console.error('Translation error:', error);
    await sendMessageToContentScript(tab.id, {
      action: 'showResult',
      result: 'Çeviri hatası: ' + error.message
    });
  }
}

async function summarizeText(text, tab) {
  try {
    if (!apiKey) {
      await sendMessageToContentScript(tab.id, {
        action: 'showResult',
        result: 'Lütfen önce API anahtarınızı girin.'
      });
      return;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Summarize the following text in ${languageNames[targetLanguage]}: ${text}`
          }]
        }]
      })
    });

    const data = await response.json();
    console.log('API Response:', data);

    if (!response.ok) {
      throw new Error(data.error?.message || 'API error');
    }

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid API response format');
    }

    const summary = data.candidates[0].content.parts[0].text;
    await sendMessageToContentScript(tab.id, {
      action: 'showResult',
      result: summary
    });
  } catch (error) {
    console.error('Summarization error:', error);
    await sendMessageToContentScript(tab.id, {
      action: 'showResult',
      result: 'Özet hatası: ' + error.message
    });
  }
}
