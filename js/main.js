let countriesGrid = document.querySelector(".countries-grid");
let countries;
let dropDownHeader = document.querySelector(".dropdown-header");
let dropDownBodyOptions = document.querySelectorAll(".dropdown-body li");
let searchInput = document.querySelector(".search-input");
let showMoreButton = document.querySelector(".show-more-btn");

/*
    FUNCTIONS
*/

// Country Card HTML Structure
function countryStructure(data) {
  return `
      <a href="#" class="country scale-effect" data-country-name="${data.name}">
          <div class="country-flag">
              <img src=${data.flags.svg} alt="${data.name} FLag">
          </div>
          <div class="country-info">
              <h2 class="country-title">${data.name}</h2>
              <ul class="country-brief">
                  <li><strong>population: </strong>${data.population}</li>
                  <li><strong>Region: </strong>${data.region}</li>
                  <li><strong>capital: </strong>${data.capital}</li>
              </ul>
          </div>
      </a>
      `;
}

// Get All Countries
async function getCountries(query, limit = 50, getRest = false) {
  let url = `${baseApiLink}${query}`;
  try {
    let response = await fetch(url, { cache: "force-cache" });
    // console.log(response);
    let data = await response.json();
    // console.log(data);
    limit ? (data.length = limit) : "";
    getRest ? (data.length = data.splice(0, 50).length) : "";

    if (response.status >= 200 && response.status < 300) {
      if (data) {
        controlLoader("open"); // Open
        countriesGrid.classList.remove("no-grid", "no-flex");
        limit == null ? (countriesGrid.innerHTML = "") : "";

        data.forEach((country) => {
          countriesGrid.innerHTML += countryStructure(country);
        });
        countries = countriesGrid.querySelectorAll(".country");
        moreDetails(countries);

        controlLoader(); // Close
      } else {
        notifications(countriesGrid);
      }
    } else {
      notifications(
        countriesGrid,
        (message = `Sorry, country ${data.message}...`),
        (details = "Please check spelling and try again")
      );
    }
  } catch (error) {
    //   console.error(error);
    notifications(
      countriesGrid,
      (message = "Sorry something went wrong..."),
      error
    );
  }
}
getCountries(`${all}${byFields}`);

// Get Countries By Region
function getCountriesByRegion(region) {
  if (region == "all") {
    countriesGrid.innerHTML = "";
    getCountries(`${all}${byFields}`);
  } else {
    countriesGrid.innerHTML = "";
    getCountries(`${byRegion}${region}${byFields}`);
  }
}

// Get Countries By Search
function getCountriesBySearch() {
  let searchInputValue = searchInput.value.trim().toLowerCase();
  if (searchInputValue == "" || searchInputValue.length == 0) {
    countriesGrid.innerHTML = "";
    getCountries(`${all}${byFields}`);
    showMoreButton.style.display = "block";
  } else {
    countriesGrid.innerHTML = "";
    getCountries(`${byName}${searchInputValue}${byFields}`);
    showMoreButton.style.display = "none";
  }
}

// Save The Country We Want to Get Its Details To SessitionStorage
function selectedForDetails(id, destination) {
  sessionStorage.setItem("id", id);
  window.location = destination;
}

function moreDetails(array) {
  array.forEach((item) => {
    item.addEventListener("click", () => {
      let countryName = item.dataset.countryName.toLocaleLowerCase().trim();
      selectedForDetails(countryName, "details.html");
    });
  });
}

// Control Drop Down Menu
function controlDropDown() {
  let dropDownWrapper = document.querySelector(".dropdown-wrapper");
  if (dropDownWrapper.classList.contains("open")) {
    dropDownWrapper.classList.remove("open");
  } else {
    dropDownWrapper.classList.add("open");
  }
}

function showMorecountries() {}

/*
    EVENTS
*/

dropDownHeader.addEventListener("click", controlDropDown);
searchInput.addEventListener("paste", getCountriesBySearch);
searchInput.addEventListener("keyup", getCountriesBySearch);
showMoreButton.addEventListener("click", () => {
  showMoreButton.textContent = "loading countries...";
  getCountries(all, (limit = 250), (getRest = true));
  setTimeout(() => {
    showMoreButton.style.display = "none";
    showMoreButton.textContent = "show more";
  }, 2000);
});

/*
    LOOPS
*/

dropDownBodyOptions.forEach((option) => {
  option.addEventListener("click", () => {
    controlLoader("open"); // Open
    let optionValue = option.dataset.region.toLowerCase();
    optionValue == "all"
      ? (showMoreButton.style.display = "block")
      : (showMoreButton.style.display = "none");
    getCountriesByRegion(optionValue);
    controlDropDown();
    // Extra Code [Can Be Omitted]
    optionValue = optionValue.split("");
    let firstLetter = optionValue[0].toUpperCase();
    optionValue = optionValue.slice(1);
    optionValue = firstLetter + optionValue.join("");
    dropDownHeader.querySelector("span").textContent = optionValue;
  });
});
