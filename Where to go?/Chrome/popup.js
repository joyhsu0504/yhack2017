const languageCodes = {
  afrikaans: 'af',
  albanian: 'sq',
  arabic: 'ar',
  basque: 'eu',
  bulgarian: 'bg',
  belarusian: 'be',
  catalan: 'ca',
  taiwanese: 'zh-tw',
  chinese: 'zh-cn',
  croatian: 'hr',
  czech: 'cs',
  danish: 'da',
  dutch: 'nl',
  english: 'en',
  estonian: 'et',
  faeroese: 'fo',
  farsi: 'fa',
  finnish: 'fi',
  french: 'fr',
  gaelic: 'gd',
  irish: 'ga',
  german: 'de',
  greek: 'el',
  hebrew: 'he',
  hindi: 'hi',
  hungarian: 'hu',
  icelandic: 'is',
  indonesian: 'id',
  italian: 'it',
  japanese: 'ja',
  korean: 'ko',
  latvian: 'lv',
  lithuanian: 'lt',
  malaysian: 'ms',
  norwegian: 'no',
  polish: 'pl',
  portuguese: 'pt',
  romanian: 'ro',
  russian: 'ru',
  serbian: 'sr',
  slovak: 'sk',
  slovenian: 'sl',
  spanish: 'es',
  sutu: 'sx',
  swedish: 'sv',
  thai: 'th',
  finnish: 'sv-fi',
  tsonga: 'ts',
  tswana: 'tn',
  turkish: 'tr',
  ukranian: 'uk',
  urdu: 'ur',
  venda: 've',
  vietnamese: 'vi',
  xhosa: 'xh',
  yiddish: 'ji',
  zulu: 'zu'
};

function sendMessage(active, translatedWord, word) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var port = chrome.tabs.connect(tabs[0].id);
    port.postMessage(active + ':' + translatedWord + ':' + word);
  });
}

this.onChange = this.onChange.bind(this);
this.isOn = false;

async function onChange() {
  this.isOn = !this.isOn;
  const lang = document.querySelector('.lang').value.toLowerCase();
  const word = document.querySelector('.word').value.toLowerCase();
  if (this.isOn) {
    if (lang != "" && word != "" && languageCodes[lang] != null) {
      const getTranslation = await fetch('https://localhost:3000/getTranslation/es/' + encodeURIComponent(languageCodes[lang])); //current functionality for spanish
      const translatedWord = await getTranslation.json();
      console.log(getTranslation);
      sendMessage(true, translatedWord, word);
    }
    else {
      if (lang == "" || languageCodes[lang] == null) {
        document.querySelector('.lang').value = "";
        document.querySelector('.lang').placeholder = "Select a language!";
      }
      if (word == "") document.querySelector('.word').placeholder = "Select a word!";
    }
  }
  else {
    sendMessage(false, "", "");
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.onOrOff').addEventListener('change', () => onChange());
});
