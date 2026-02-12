// ==========================================
// 1. CONFIGURATION
// ==========================================

// YOUR CURRENT COORDINATES (Oyo)

const CLASS_LAT = 7.800081; 
const CLASS_LON = 3.910736;



// Allowed radius in meters
// We use 50m to be safe because phone GPS can be jumpy
const ALLOWED_RADIUS = 50; 

// ==========================================
// 2. THE LOGIC
// ==========================================

const statusEl = document.getElementById('status-message');
const formContainer = document.getElementById('google-form-container');

function checkLocation() {
    // 1. Show loading message
    statusEl.className = 'loading';
    statusEl.innerText = "Checking GPS... Please wait up to 10 seconds.";

    // 2. Check if browser supports Geolocation
    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser.");
        return;
    }

    // 3. Request the position
    navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true, // Use GPS (more battery, better accuracy)
        timeout: 10000,           // Wait 10 seconds max
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

// ------------------------------------------
// UPDATED ERROR HANDLER (TELLS YOU THE REASON)
// ------------------------------------------
function error(err) {
    let errorMessage = "";
    
    // Check the specific error code from the browser
    switch(err.code) {
        case 1: // PERMISSION_DENIED
            errorMessage = "🔒 BLOCKED: You denied Location access. Reset permissions by clicking the Lock icon in the address bar.";
            break;
        case 2: // POSITION_UNAVAILABLE
            errorMessage = "📡 GPS FAILED: Your device can't find a signal. Go outside or turn on Wi-Fi.";
            break;
        case 3: // TIMEOUT
            errorMessage = "⏳ TIMEOUT: Your phone took too long to answer. Try again.";
            break;
        default:
            errorMessage = "❌ Unknown error: " + err.message;
    }

    // Show the detailed message on screen
    statusEl.innerHTML = `<span class='error'>${errorMessage}</span>`;
    statusEl.className = 'error';
    console.warn(errorMessage);
}

// Helper function to update the status text (Green)
function showSuccess(msg) {
    statusEl.className = 'success';
    statusEl.innerText = msg;
}

// Helper function to update the status text (Red)
function showError(msg) {
    statusEl.className = 'error';
    statusEl.innerHTML = msg; 
}

// ==========================================
// 3. THE MATH (Haversine Formula)
// ==========================================
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