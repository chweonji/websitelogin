console.log("JS IS RUNNING");

// 🔹 TOGGLE PASSWORD (works globally)
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

// 🔹 PASSWORD VALIDATION (used on multiple pages)
function handlePasswordValidation(inputId) {
  const passwordInput = document.getElementById(inputId);
  const lengthRule = document.getElementById("length");
  const uppercaseRule = document.getElementById("uppercase");
  const numberRule = document.getElementById("number");
  const specialRule = document.getElementById("special");

  if (!passwordInput) return;

  passwordInput.addEventListener("input", function () {
    const value = passwordInput.value;

    if (lengthRule) lengthRule.classList.toggle("valid", value.length >= 8);
    if (uppercaseRule) uppercaseRule.classList.toggle("valid", /[a-z]/.test(value) && /[A-Z]/.test(value));
    if (numberRule) numberRule.classList.toggle("valid", /[0-9]/.test(value));
    if (specialRule) specialRule.classList.toggle("valid", /[!@#$%^&*(),.?":{}|<>]/.test(value));
  });
}

document.addEventListener("DOMContentLoaded", () => {

  console.log("DOM READY");

  // 🔹 PASSWORD VALIDATION (both pages)
  handlePasswordValidation("signupPassword");
  handlePasswordValidation("newPassword");

  // =========================
  // 🔹 SIGNUP PAGE
  // =========================
  const signupForm = document.getElementById("signupForm");

  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const emailInput = signupForm.querySelector('input[type="email"]');
      if (emailInput && !emailInput.value.toLowerCase().endsWith("@sunlife.com.ph")) {
        alert("Please use your Sun Life email address (@sunlife.com.ph).");
        return;
      }

      const phoneInput = signupForm.querySelector('input[type="tel"]');
      if (phoneInput && !/^[0-9]*$/.test(phoneInput.value)) {
        alert("Phone number can only contain numbers.");
        return;
      }

      const textInputs = signupForm.querySelectorAll('input[type="text"]');
      const fullNameInput = textInputs[0];

      if (fullNameInput && fullNameInput.value && !/^[A-Z]/.test(fullNameInput.value)) {
        alert("Full Name must start with a capital letter.");
        return;
      }

      window.location.href = "signup2.html";
    });
  }

  // =========================
  // 🔹 SIGNUP STEP 2 PAGE
  // =========================
  const signup2Form = document.getElementById("signup2Form");
  const modal = document.getElementById("successModal");
  const page = document.getElementById("pageContent");

  if (signup2Form) {
    signup2Form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const phoneInput = this.querySelector('input[type="tel"]');
      if (phoneInput && !/^[0-9]*$/.test(phoneInput.value)) {
        alert("Emergency contact phone number can only contain numbers.");
        return;
      }

      const textInputs = this.querySelectorAll('input[type="text"]');
      const emergencyContactInput = textInputs[0];
      const address = document.getElementById("address")?.value.trim();
      const city = document.getElementById("city")?.value.trim();

      if (emergencyContactInput && emergencyContactInput.value && !/^[A-Z]/.test(emergencyContactInput.value)) {
        alert("Emergency Contact must start with a capital letter.");
        return;
      }

      if (city && !/^[A-Z]/.test(city)) {
        alert("City must start with a capital letter.");
        return;
      }

      if (!address || !city) {
        alert("Please complete address and city.");
        return;
      }

      const fullAddress = `${address}, ${city}, Philippines`;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`
        );
        const data = await response.json();

        if (data.length === 0) {
          alert("Address not found.");
          return;
        }

        if (modal) modal.style.display = "flex";
        if (page) page.classList.add("blur");

      } catch {
        alert("Error validating address.");
      }
    });
  }

  // 🔹 CONTINUE BUTTON (MODAL)
  const continueBtn = document.getElementById("continueBtn");

  if (continueBtn) {
    continueBtn.onclick = function () {
      if (modal) modal.style.display = "none";
      if (page) page.classList.remove("blur");
      window.location.href = "login.html";
    };
  }

  // =========================
  // 🔹 FORGOT PASSWORD PAGE
  // =========================
  const forgotForm = document.getElementById("forgotForm");

  if (forgotForm) {
    forgotForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const emailInput = document.getElementById("email");
      const email = emailInput?.value.trim().toLowerCase();

      if (!email.endsWith("@sunlife.com.ph")) {
        alert("Use your Sun Life email.");
        return;
      }

      window.location.href = "otp.html";
    });
  }

  // =========================
  // 🔹 RESET PASSWORD PAGE
  // =========================
  const resetForm = document.getElementById("resetForm");

  if (resetForm) {
    resetForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const pass1 = document.getElementById("newPassword").value;
      const pass2 = document.getElementById("confirmPassword2").value;

      if (pass1 !== pass2) {
        alert("Passwords do not match");
        return;
      }

      localStorage.setItem("demoPassword", pass1);

      const modal = document.getElementById("successModal");
      const countdownEl = document.getElementById("countdown");

      if (modal) modal.style.display = "block";

      let count = 5;

      const interval = setInterval(() => {
        count--;
        if (countdownEl) countdownEl.textContent = count;

        if (count === 0) {
          clearInterval(interval);
          window.location.href = "login.html";
        }
      }, 1000);
    });
  }

});

// 🔹 OTP VERIFY (can stay outside)
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
