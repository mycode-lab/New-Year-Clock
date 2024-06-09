document.addEventListener('DOMContentLoaded', () => {
    const localTimeEl = document.getElementById('local-time');
    const timeZoneEl = document.getElementById('time-zone');
    const dateTodayEl = document.getElementById('date-today');
    const dayTodayEl = document.getElementById('day-today');
    const newYearDateEl = document.getElementById('new-year-date');
    const newYearDayEl = document.getElementById('new-year-day');
    const countdownEl = document.getElementById('countdown');
    const warningEl = document.getElementById('warning');
    const timeDifferenceEl = document.getElementById('time-difference');
    const toggleModeBtn = document.getElementById('toggle-mode');

    let darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.add(darkMode ? 'dark-mode' : 'light-mode');

    const newYear = new Date(new Date().getFullYear() + 1, 0, 1);
    let correctedTime = null;
    let lastServerCheck = 0;
    const serverCheckInterval = 60 * 1000; // Check every minute

    function updateTime() {
        let now = correctedTime ? new Date(correctedTime.getTime() + (Date.now() - lastServerCheck)) : new Date();
        const localTimeStr = now.toLocaleTimeString();
        const timeZoneStr = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const dateTodayStr = now.toLocaleDateString();
        const dayTodayStr = now.toLocaleDateString(undefined, { weekday: 'long' });

        localTimeEl.innerHTML = `<i class="fas fa-clock"></i> Local Time: ${localTimeStr}`;
        timeZoneEl.innerHTML = `<i class="fas fa-globe"></i> Time Zone: ${timeZoneStr}`;
        dateTodayEl.innerHTML = `<i class="fas fa-calendar-day"></i> Today's Date: ${dateTodayStr}`;
        dayTodayEl.innerHTML = `<i class="fas fa-calendar-week"></i> Today is: ${dayTodayStr}`;
        newYearDateEl.innerHTML = `<i class="fas fa-calendar"></i> New Year Date: ${newYear.toLocaleDateString()}`;
        newYearDayEl.innerHTML = `<i class="fas fa-calendar-day"></i> New Year Day: ${newYear.toLocaleDateString(undefined, { weekday: 'long' })}`;
        const timeLeft = newYear - now;
        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);

        countdownEl.innerHTML = ` <i class="fas fa-hourglass-half"></i> Time left for New Year: ${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;

        if (Date.now() - lastServerCheck > serverCheckInterval) {
            checkTimeWithServer();
        }
    }

    function formatTimeDifference(seconds) {
        const days = Math.floor(seconds / (24 * 60 * 60));
        seconds %= 24 * 60 * 60;
        const hours = Math.floor(seconds / (60 * 60));
        seconds %= 60 * 60;
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;

        let result = '';
        if (days > 0) result += `${days}d `;
        if (hours > 0) result += `${hours}h `;
        if (minutes > 0) result += `${minutes}m `;
        if (seconds > 0) result += `${seconds}s`;

        return result.trim();
    }

    function toggleMode() {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
        document.body.classList.toggle('light-mode', !darkMode);
    }

    toggleModeBtn.addEventListener('click', toggleMode);

    async function checkTimeWithServer() {
        try {
            const response = await fetch('https://worldtimeapi.org/api/ip');
            const data = await response.json();
            const serverTime = new Date(data.utc_datetime);
            const localTime = new Date();
            const timeDifference = Math.abs((serverTime - localTime) / 1000);

            if (timeDifference > 1) {
                warningEl.style.display = 'block';
                const formattedTimeDifference = formatTimeDifference(Math.floor(timeDifference));
                timeDifferenceEl.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Time difference detected! Your time may be incorrect.`;
                correctedTime = serverTime;
                lastServerCheck = Date.now();
            } else {
                warningEl.style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching server time:', error);
        }
    }

    function handleOnlineStatus() {
        const isOnline = navigator.onLine;
        if (isOnline) {
            checkTimeWithServer(); // If online, check time with server
        } else {
            warningEl.style.display = 'block';
            const localTime = new Date();
            const localTimeStr = localTime.toLocaleTimeString();
            const dateTodayStr = localTime.toLocaleDateString();
            const timeDifference = Math.abs(localTime - new Date()) / 1000;
            if (timeDifference > 1) {
                timeDifferenceEl.innerHTML = `<i class="fas fa-exclamation-triangle"></i> You are offline. Your device time is being used. Please note that the time may be incorrect.`;
            } else {
                warningEl.style.display = 'none'; // Hide warning if difference is within 1 second
            }
            localTimeEl.innerHTML = `<i class="fas fa-clock"></i> Local Time: ${localTimeStr}`;
            dateTodayEl.innerHTML = `<i class="fas fa-calendar-day"></i> Today's Date: ${dateTodayStr}`;
        }
    }

    handleOnlineStatus(); // Check online status when the page loads

    window.addEventListener('online', handleOnlineStatus); // Listen for online event
    window.addEventListener('offline', handleOnlineStatus); // Listen for offline event

    setInterval(updateTime, 1000); // Update time every second
});
