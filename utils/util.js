const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  var date = new Date(date);  
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const myTrim = x => {
  return x.replace(/^\s+|\s+$/gm, '');
}

const isEmail =str => {
  var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
  return reg.test(str);
} 
const indexArray = arr => {
  var i = 0;
  arr.forEach(function (value) {
    value['index'] = i++;
  });
}
module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatNumber:formatNumber,
  myTrim: myTrim,
  isEmail:isEmail,
  indexArray: indexArray
}
