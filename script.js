function togglePassword(element) {
    const input = element.parentElement.querySelector("input");
    const icon = element.querySelector("i");
    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
}

function handlePasswordValidation(inputId) {
    const passwordInput = document.getElementById(inputId);
    const lengthRule = document.getElementById("length");
    const uppercaseRule = document.getElementById("uppercase");
    const numberRule = document.getElementById("number");
    const specialRule = document.getElementById("special");

    if (!passwordInput) return; // stops if not on that page

    passwordInput.addEventListener("input", function() {
        const value = passwordInput.value;

        // At least 8 characters
        lengthRule.classList.toggle("valid", value.length >= 8);

        // Upper & Lowercase
        uppercaseRule.classList.toggle("valid", /[a-z]/.test(value) && /[A-Z]/.test(value));

        // Number
        numberRule.classList.toggle("valid", /[0-9]/.test(value));

        // Special character
        specialRule.classList.toggle("valid", /[!@#$%^&*(),.?":{}|<>]/.test(value));
    });
}

// Run for BOTH pages
handlePasswordValidation("signupPassword");
handlePasswordValidation("newPassword");

const form = document.getElementById("signupForm");
if (form) {
    form.addEventListener("submit", function(e) {
        e.preventDefault(); // stop default submit

         // Validate email
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && !emailInput.value.toLowerCase().endsWith('@sunlife.com.ph')) {
            alert("Please use your Sun Life email address (@sunlife.com.ph).");
            return;
        }
        
        // Validate phone number
        const phoneInput = form.querySelector('input[type="tel"]');
        if (phoneInput && !/^[0-9]*$/.test(phoneInput.value)) {
            alert("Phone number can only contain numbers.");
            return;
        }
        
        // Validate Full Name starts with capital letter
        const textInputs = form.querySelectorAll('input[type="text"]');
        const fullNameInput = textInputs[0];
        if (fullNameInput && fullNameInput.value && !/^[A-Z]/.test(fullNameInput.value)) {
            alert("Full Name must start with a capital letter.");
            return;
        }
        
        // You can validate here if needed
        window.location.href = "signup2.html";
    });
}

const signup2Form = document.getElementById("signup2Form");
const modal = document.getElementById("successModal");
const page = document.getElementById("pageContent");

document.getElementById("signup2Form").addEventListener("submit", async function(e) {
  e.preventDefault();

  // 🔹 Phone validation
  const phoneInput = this.querySelector('input[type="tel"]');
  if (phoneInput && !/^[0-9]*$/.test(phoneInput.value)) {
    alert("Emergency contact phone number can only contain numbers.");
    return;
  }

  // 🔹 Text inputs
  const textInputs = this.querySelectorAll('input[type="text"]');
  const emergencyContactInput = textInputs[0];
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();

  // 🔹 Capital letter checks
  if (emergencyContactInput && emergencyContactInput.value && !/^[A-Z]/.test(emergencyContactInput.value)) {
    alert("Emergency Contact must start with a capital letter.");
    return;
  }

  if (city && !/^[A-Z]/.test(city)) {
    alert("City must start with a capital letter.");
    return;
  }

  // 🔹 Address required
  if (!address || !city) {
    alert("Please complete address and city.");
    return;
  }

  // 🔹 🌍 ADDRESS VALIDATION (FREE API)
  const fullAddress = `${address}, ${city}, Philippines`;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&addressdetails=1&limit=1`
    );
    const data = await response.json();

    if (data.length === 0) {
      alert("Address not found. Please enter a real address.");
      return;
    }

    const addr = data[0].address;
    const returnedCity =
      addr.city || addr.town || addr.municipality || addr.state || "";

    if (!returnedCity.toLowerCase().includes(city.toLowerCase())) {
      alert("City does not match the address.");
      return;
    }

    // ✅ ONLY SUCCESS PATH
    modal.style.display = "flex";
    page.classList.add("blur");

  } catch (err) {
    alert("Error validating address. Please try again.");
  }
});

document.getElementById("continueBtn").onclick = function(){
    modal.style.display = "none";
    page.classList.remove("blur");
    // redirect to login page
    window.location.href = "login.html";
};

// ==========================
// FORGOT PASSWORD, OTP AND NEW PASSWORD PAGES 
// ==========================

// ===== FORGOT PASSWORD FLOW (DEMO ONLY - FRONTEND) =====

// STEP 1 — Send Code
//function sendCode() {
//  const emailInput = document.getElementById("ForgotForm");
//  if (!emailInput || !emailInput.value) {
//    alert("Enter your email");
//    return;
//  }

//  const email = emailInput.value.trim().toLowerCase();

  // ✅ Allow only Sun Life emails
//  if (!email.endsWith("@sunlife.com.ph")) {
//    alert("Please use your Sun Life email (@sunlife.com.ph)");
//    return;
//  }

  // Generate OTP
//  const otp = Math.floor(100000 + Math.random() * 900000).toString();
//  localStorage.setItem("demoOTP", otp);
//  localStorage.setItem("resetEmail", email);

//  alert("Demo OTP: " + otp); // demo only
//  window.location.href = "otp.html";
//}

document.addEventListener("DOMContentLoaded", function () {

    console.log("JS LOADED");

    const forgotForm = document.getElementById("forgotForm");
    console.log("FORM:", forgotForm);

    if (!forgotForm) {
        console.log("No forgotForm on this page");
        return; // ✅ stops error
    }

    forgotForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const emailInput = document.getElementById("email");

        if (!emailInput) {
            console.log("Email input not found");
            return;
        }

        const email = emailInput.value.trim().toLowerCase();

        if (!email.endsWith("@sunlife.com.ph")) {
            alert("Please use your Sun Life email address (@sunlife.com.ph).");
            return;
        }

        window.location.href = "otp.html";
    });

});

// STEP 2 — Verify OTP
function verifyOTP() {
  const otpInput = document.getElementById("otpInput");
  if (!otpInput) return;

  const entered = otpInput.value;
  const saved = localStorage.getItem("demoOTP");

  if (entered === saved) {
    alert("Code verified");
    window.location.href = "new-password.html";
  } else {
    alert("Invalid code");
  }
}


// STEP 3 — Reset Password
function resetPassword() {
  const pass1 = document.getElementById("newPass");
  const pass2 = document.getElementById("confirmPass");

  if (!pass1 || !pass2) return;

  if (pass1.value !== pass2.value) {
    alert("Passwords do not match");
    return;
  }

  localStorage.setItem("demoPassword", pass1.value);

  alert("Password reset successful (demo)");
  window.location.href = "login.html";
}

function showPopup(event) {
  event.preventDefault();
  alert("Password has been reset!");

  window.location.href = "login.html"; // change file name if needed
}