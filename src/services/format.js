function formatDate(date) {
  var month = "" + (date.getMonth() + 1);
  var day = "" + date.getDate();
  var year = date.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function formatTime(date) {
  var date = new Date();
  var hour = "" + date.getHours();
  var minute = "" + date.getMinutes();
  var second = "" + date.getSeconds();

  if (hour.length < 2) hour = "0" + hour;
  if (minute.length < 2) minute = "0" + minute;
  if (second.length < 2) second = "0" + second;

  return formatDate(date) + " " + [hour, minute, second].join(":");
}

module.exports = {
  formatDate: formatDate,
  formatTime: formatTime,
};
