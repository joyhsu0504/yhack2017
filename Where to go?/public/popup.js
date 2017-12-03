function sendMessage(active, translatedWord, word) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var port = chrome.tabs.connect(tabs[0].id);
    if (active == true) port.postMessage(active);
  });
}

this.onChange = this.onChange.bind(this);
this.on = false;

async function onChange() {
//  const fetchReq2 = await fetch('https://tranquil-headland-43776.herokuapp.com/toggled', {method: "POST"});
  this.on = !this.on;
  //console.log(this.on);
  if (this.on) {
    //document.querySelector('.slider').classList.add('squashPlant');
    sendMessage(true);
  }
  else {
    //document.querySelector('.slider').classList.remove('squashPlant');
    sendMessage(false);
  }
}

//TODO SLIDER/ THE THINGY DOESNT WORK

document.addEventListener('DOMContentLoaded', async function() {
  //const fetchReq = await fetch('https://tranquil-headland-43776.herokuapp.com/toggled', {method: "GET"});
  //this.on = await fetchReq.json();
  /*if (this.on) {
    document.querySelector('.slider').classList.add('squashPlant');
  }
  else {
    document.querySelector('.slider').classList.remove('squashPlant');
  }*/
  document.querySelector('.onOrOff').addEventListener('change', () => onChange());
});
