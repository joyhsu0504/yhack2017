chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(onMessage);
});


async function onMessage() {
  const translationQuery = await fetch('/getTranslation/es/' + encodeURIComponent(msg[2] + '/')); //current functionality for spanish
  this.translation = await translationQuery.json();
  console.log(translationQuery);
}
