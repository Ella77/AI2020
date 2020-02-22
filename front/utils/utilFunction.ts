export function getCookie(c_name) {
  var i,
    x,
    y,
    ARRcookies = document.cookie.split(";");

  for (i = 0; i < ARRcookies.length; i++) {
    x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));

    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);

    x = x.replace(/^\s+|\s+$/g, "");

    if (x == c_name) {
      return unescape(y);
    }
  }
}

export function getFormatDate(date) {
  var year = date.getFullYear(); //yyyy
  var month = 1 + date.getMonth(); //M
  month = month >= 10 ? month : "0" + month; //month 두자리로 저장
  var day = date.getDate(); //d
  day = day >= 10 ? day : "0" + day; //day 두자리로 저장
  return year + "";
}

export function millisToMinutesAndSeconds(millis: number) {
  var minutes = Math.floor(millis / 60);
  var seconds = (millis % 60).toFixed(0);
  //@ts-ignore
  return minutes + "분:" + (seconds < 10 ? "0" : "") + seconds + "초";
}
