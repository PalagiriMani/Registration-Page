document.addEventListener('DOMContentLoaded', function() {
    updateMenu();
    if (document.getElementById('response-dropdown')) {
        populateResponseDropdown();
    }
});

function signup(event) {
    event.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(user => user.username === username)) {
        alert('Username already exists!');
        return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful!');
    window.location.href = 'login.html';
}

function login(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        localStorage.setItem('loggedInUser', username);
        alert('Login successful!');
        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password!');
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    updateMenu();
    alert('Logout successful!');
    window.location.href = 'index.html';
}

function isLoggedIn() {
    return localStorage.getItem('loggedInUser') !== null;
}

function updateMenu() {
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');

    if (isLoggedIn()) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'inline';
    } else {
        loginLink.style.display = 'inline';
        logoutLink.style.display = 'none';
    }
}

function populateResponseDropdown() {
    const responseDropdown = document.getElementById('response-dropdown');
    const responses = getResponses();

    responses.forEach((response, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = response.companyName;
        responseDropdown.appendChild(option);
    });
}

function getResponses() {
    const responses = JSON.parse(localStorage.getItem('responses')) || [];
    return responses;
}

function showResponseDetails() {
    const responseDropdown = document.getElementById('response-dropdown');
    const responseDetailsDiv = document.getElementById('response-details');
    const selectedIndex = responseDropdown.value;
    const responses = getResponses();
    const response = responses[selectedIndex];

    if (response) {
        let detailsHtml = `<h2>${response.companyName}</h2><p>CEO: ${response.ceo}</p><h3>Facilities:</h3><ul>`;
        response.facilities.forEach(facility => {
            detailsHtml += `<li>Location: ${facility.location}, In Charge: ${facility.inCharge}, Operations: ${facility.operations}</li>`;
        });
        detailsHtml += '</ul>';
        responseDetailsDiv.innerHTML = detailsHtml;
    } else {
        responseDetailsDiv.innerHTML = '<p>No details available.</p>';
    }
}

function addFacility() {
    const facilitiesDiv = document.getElementById('facilities');
    const facilityCount = facilitiesDiv.querySelectorAll('.facility').length;
    const facilityDiv = document.createElement('div');
    facilityDiv.classList.add('facility');
    facilityDiv.innerHTML = `
        <h4>Facility ${facilityCount + 1}</h4>
        <label for="facility-location-${facilityCount}">Location:</label>
        <input type="text" id="facility-location-${facilityCount}" name="facility-location-${facilityCount}" required>
        <label for="facility-incharge-${facilityCount}">In Charge:</label>
        <input type="text" id="facility-incharge-${facilityCount}" name="facility-incharge-${facilityCount}" required>
        <label for="facility-operations-${facilityCount}">Operations:</label>
        <input type="text" id="facility-operations-${facilityCount}" name="facility-operations-${facilityCount}" required>
    `;
    facilitiesDiv.appendChild(facilityDiv);
}

function submitForm(event) {
    event.preventDefault();
    const companyName = document.getElementById('company-name').value;
    const ceo = document.getElementById('company-ceo').value;
    const facilities = [];
    document.querySelectorAll('.facility').forEach((facilityDiv, index) => {
        const location = document.getElementById(`facility-location-${index}`).value;
        const inCharge = document.getElementById(`facility-incharge-${index}`).value;
        const operations = document.getElementById(`facility-operations-${index}`).value;
        facilities.push({ location, inCharge, operations });
    });

    const newResponse = { companyName, ceo, facilities };
    const responses = getResponses();
    responses.push(newResponse);
    localStorage.setItem('responses', JSON.stringify(responses));
    alert('Response submitted successfully!');
    document.getElementById('company-form').reset();
}
