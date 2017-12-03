function sendMessage(active, translatedWord, word) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var port = chrome.tabs.connect(tabs[0].id);
    if (active == true) port.postMessage(active);
  });
}

this.onChange = this.onChange.bind(this);
this.isOn = false;

function onChange() {
  this.isOn = !this.isOn;
  if (this.isOn) {
    sendMessage(true);
  }
  else {
    sendMessage(false);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.onOrOff').addEventListener('change', () => onChange());
});
