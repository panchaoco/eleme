/**
 * 解析url参数
 * @example ?id=1234&a=b
 * @return Object {id: 1234, a: b}
 */
export function urlParse () {
  let url = decodeURIComponent(window.location.search);
  if (url.indexOf('/') > -1) {
    url = url.substring(0, url.indexOf('/'));
  }
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  // ['?id=12345', '&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      let key = tempArr[0]
      let val = tempArr[1];
      obj[key] = val;
    });
  }
  return obj;
}
