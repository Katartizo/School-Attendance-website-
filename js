// ==========================================
// 1. CONFIGURATION (YOU MUST CHANGE THIS)
// ==========================================

const CLASS_LAT = 7.84312; 
const CLASS_LON = 3.93675;

// Set the radius to 50 meters for testing (since GPS can jump around a bit)
const ALLOWED_RADIUS = 50;




// The maximum distance allowed in meters (e.g., 20 meters)
const ALLOWED_RADIUS = 20; 

// ==========================================
// 2. THE LOGIC
// ==========================================

const statusEl = document.getElementById('status-message');
const formContainer = document.getElementById('google-form-container');

function checkLocation() {
    // 1. Show loading message
    statusEl.className = 'loading';
    statusEl.innerText = "Checking GPS... Please wait.";

    // 2. Check if browser supports Geolocation
    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser.");
        return;
    }

    // 3. Request the position
    navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true, // Use GPS (more battery, better accuracy)
        timeout: 30000,           // Wait 30 seconds max
        maximumAge: 0             // Do not use cached location
    });
}

// If we successfully get the location:
function success(position) {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;

    // Calculate distance between student and class
    const distance = getDistanceFromLatLonInMeters(CLASS_LAT, CLASS_LON, userLat, userLon);

    // Check if they are close enough
    if (distance <= ALLOWED_RADIUS) {
        showSuccess(`Success! You are in class (${Math.round(distance)}m away).`);
        formContainer.style.display = "block"; // REVEAL THE FORM
    } else {
        showError(`Access Denied. You are ${Math.round(distance)}m away. You must be within ${ALLOWED_RADIUS}m.`);
        formContainer.style.display = "none"; // Hide the form
    }
}

// If there is an error getting location:
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    showError("Unable to retrieve location. Please allow GPS access.");
}

// Helper function to update the status text (Green)
function showSuccess(msg) {
    statusEl.className = 'success';
    statusEl.innerText = msg;
}

// Helper function to update the status text (Red)
function showError(msg) {
    statusEl.className = 'error';
    statusEl.innerText = msg;
}

// ==========================================
// 3. THE MATH (Haversine Formula)
// ==========================================
// This calculates the distance between two GPS points in meters
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radius of the earth in meters
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in meters
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}