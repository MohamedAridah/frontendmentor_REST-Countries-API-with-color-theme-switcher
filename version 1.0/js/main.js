let countriesGrid = document.querySelector(".countries-grid");
let countries;
let dropDownHeader = document.querySelector(".dropdown-header");
let dropDownBodyOptions = document.querySelectorAll(".dropdown-body li");
let searchInput = document.querySelector(".search-input");

/*
    FUNCTIONS
*/

// Country Card HTML Structure
function countryStructure(data) {
  return `
      <a href="#" class="country scale-effect" data-country-name="${data.name}">
          <div class="country-flag">
              <img src=${data.flag} alt="${data.name} Flag">
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
async function getCountries(apiLink) {
  try {
    let response = await fetch(apiLink,{cache:'force-cache'});
    // console.log(response);
    let data = await response.json();
    // console.log(data);

    if (response.status == 404) {
      notifications(
        countriesGrid,
        (message = `Sorry, country ${data.message}...`),
        (details = "Please check spelling and try again")
      );
    } else {
      if (data) {
        controlLoader("open"); // Open
        countriesGrid.classList.remove("no-grid", "no-flex");
        countriesGrid.innerHTML = "";
        data.forEach((country) => {
          countriesGrid.innerHTML += countryStructure(country);
        });
        countries = countriesGrid.querySelectorAll(".country");
        moreDetails(countries);

        controlLoader(); // Close
      } else {
        notifications(countriesGrid);
      }
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
getCountries(baseApiLink);

// Get Countries By Region
function getCountriesByRegion(region) {
  if (region == "all") {
    getCountries(baseApiLink);
  } else {
    getCountries(`${regionQuery}${region}`);
  }
}

// Get Countries By Search
function getCountriesBySearch() {
  let searchInputValue = searchInput.value.trim().toLowerCase();
  if (searchInputValue == "" || searchInputValue.length == 0) {
    getCountries(baseApiLink);
  } else {
    getCountries(`${nameQuery}${searchInputValue}`);
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

/*
    EVENTS
*/

dropDownHeader.addEventListener("click", controlDropDown);
searchInput.addEventListener("paste", getCountriesBySearch);
searchInput.addEventListener("keyup", getCountriesBySearch);

/*
    LOOPS
*/

dropDownBodyOptions.forEach((option) => {
  option.addEventListener("click", () => {
    controlLoader("open"); // Open
    let optionValue = option.dataset.region.toLowerCase();
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
