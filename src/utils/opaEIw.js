export const aUHXaHEz = () => {
  const __xkS = ["D", "i", "g", "i", "t", "e", " ", "a", " ", "s", "e", "n", "h", "a", " ", "p", "a", "r", "a", " ", "s", "a", "l", "v", "a", "r", " ", "n", "o", " ", "h", "i", "s", "t", "ó", "r", "i", "c", "o", ":"];
  const __zLo = ["S", "e", "n", "h", "a", " ", "i", "n", "c", "o", "r", "r", "e", "t", "a", ".", " ", "A", "ç", "ã", "o", " ", "c", "a", "n", "c", "e", "l", "a", "d", "a", "."];
  const __rSd = ["R", "n", "V", "0", "R", "H", "J", "h", "Z", "n", "Q", "y", "M", "D", "I", "1"];
  const __qWs = ["Z", "W", "R", "u", "Y", "V", "g", "m", "b", "m", "l", "2", "Z", "U", "s", "="];
  function __pLq(arr) {return arr.join("");}
  function __tGh(str) {return str.split("").reverse().join("");}
  function __mNc(encoded) {return decodeURIComponent(atob(encoded).split("").map(function (ch) {return "%" + ("00" + ch.charCodeAt(0).toString(16)).slice(-2);}).join(""));}
  const __promptMsg = __pLq(__xkS);
  const __alertMsg = __pLq(__zLo);
  const _pw = prompt(__promptMsg);
  const _seg1 = __mNc(__pLq(__rSd));
  const _seg2 = __tGh(__mNc(__pLq(__qWs)));
  const __sChave = _seg1 + _seg2;
  if (_pw !== __sChave) {alert(__alertMsg);
    return false;}
  return true;
};
