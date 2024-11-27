function fetchTracker(url, content) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;

            const mainContent = tempDiv.querySelector('#main');

            document.getElementById(content).innerHTML = mainContent.innerHTML;
        })
        .catch(err => console.error('failure:', err));
}

fetchTracker('donation-tracker/donation-tracker.html', 'donation-tracker-content')
fetchTracker('volunteer-hours-tracker/volunteer-hours-tracker.html', 'volunteer-hours-tracker-content')
