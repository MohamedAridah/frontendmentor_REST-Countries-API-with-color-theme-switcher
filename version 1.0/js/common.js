let baseApiLink = "https://restcountries.com/v2/all";
let regionQuery = `https://restcountries.com/v2/region/`;
let nameQuery = `https://restcountries.com/v2/name/`;
let alphaQuery = `https://restcountries.com/v2/alpha/`;

let scrollBtn = document.querySelector(".scroll-top");

/*
    FUNCTIONS
*/

// Control Loading
function controlLoader(status = "close") {
  let loader = document.querySelector(".loader");
  if (status == "close") {
    loader.classList.add("close");
  } else {
    loader.classList.remove("close");
  }
}

// Theme Switcher Functions
(function controlTheme() {
  let switchBtn = document.querySelector(".theme-toggle");
  let switchBtnText = document.querySelector(".theme-toggle .theme-text");
  let switchBtnIcon = document.querySelector(".theme-toggle .theme-icon");
  let light = true;

  switchBtn.addEventListener("click", () => {
    if (light) {
      darkMode(switchBtnText, switchBtnIcon);
      light = false;
    } else {
      lightMode(switchBtnText, switchBtnIcon);
      light = true;
    }
  });
})();

// Enable Light Mode
function lightMode(text, icon) {
  let lightIcon = `fa-regular fa-sun-bright theme-icon`;
  text.textContent = "dark mode";
  icon.className = lightIcon;
  document.body.classList.remove("dark-theme");
}

// Enable Dark Mode
function darkMode(text, icon) {
  let darkIcon = `fa-regular fa-moon theme-icon`;
  text.textContent = "light mode";
  icon.className = darkIcon;
  document.body.classList.add("dark-theme");
}

// Error Messgaes
function notifications(
  target,
  message = "Sorry, something went wrong...",
  details = "Please try again later"
) {
  target.innerHTML = `
      <div class="notifi-wrapper">
        <h2>${message}</h2>
        <p>${details}</p>
      </div>
      `;
  target.classList.add("no-grid", "no-flex");
  controlLoader(); // Close
}

// Scroll Top
function scrollTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

// Toggle Scroll Top Button
function controlScrollButton() {
  if (
    (document.documentElement.scrollTop || window.pageYOffset) >=
    window.innerHeight / 2
  ) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
}


/*
    EVENTS
*/

scrollBtn.addEventListener("click", scrollTop);
window.addEventListener("scroll", controlScrollButton);
