function updateClock() {
  var now = new Date();
  var currentYear = now.getFullYear();
  var newYear = new Date(currentYear + 1, 0, 1); // Next year's New Year
  
  var days = Math.floor((newYear - now) / (1000 * 60 * 60 * 24));
  var hours = Math.floor((newYear - now) % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
  var minutes = Math.floor((newYear - now) % (1000 * 60 * 60) / (1000 * 60));
  var seconds = Math.floor((newYear - now) % (1000 * 60) / 1000);

  var today = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  var newYearDate = newYear.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  document.getElementById('info').innerHTML = "Current date: " + today + "<br>Next year's New Year: " + newYearDate + "<br>Timezone: " + timeZone;
  document.getElementById('clock').innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s";

  var time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  document.getElementById('time').innerHTML = "Current time: " + time;
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initial call to set the clock without delay
updateClock();
