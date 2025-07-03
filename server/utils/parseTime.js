function parseTimeToDate(timeStr) {
  // timeStr format: 'h:mm AM/PM'
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');

  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  if (modifier.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (modifier.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

module.exports = parseTimeToDate;