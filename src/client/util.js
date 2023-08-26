/*

export function setCookie(cookieName, cookieValue, expiryDate) {
  var d = new Date();
  d.setTime(d.getTime() + (expiryDate * 24 * 60 * 60 * 1000));
  var expires = "; expires=" + d.toUTCString();
  if (expiryDate == -1) {
    expires = "";
  }
  document.cookie = cookieName + "=" + cookieValue + expires + "; path=/";
}

export function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

export function getRandom(a, b) {
  let max = Math.max(a, b);
  let min = Math.min(a, b);
  return parseInt(Math.random() * (max - min)) + min;
}

export function sleep(millisecond) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, millisecond)
  })
}
*/