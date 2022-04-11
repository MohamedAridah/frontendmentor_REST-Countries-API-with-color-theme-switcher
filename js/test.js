let countriesGrid = document.querySelector(".countries-grid");
let countries;
let dropDownHeader = document.querySelector(".dropdown-header");
let dropDownBodyOptions = document.querySelectorAll(".dropdown-body li");
let searchInput = document.querySelector(".search-input");

/*
    FUNCTIONS
*/

// Country Card HTML Structure
async function countryStructure(data) {
  return `
      <a href="#" class="country scale-effect" data-country-name='${data.name}'>
          <div class="country-flag">
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
  let url = apiLink;
  try {
    let response = await fetch(url, { cache: "force-cache" });
    // console.log(response);
    let data = await response.json();
    console.log(data);

    if (response.status >= 200 && response.status < 300) {
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
    } else {
      notifications(
        countriesGrid,
        (message = `Sorry, country ${data.message}...`),
        (details = "Please check spelling and try again")
      );
    }
  } catch (error) {
    console.error(error);
    notifications(
      countriesGrid,
      (message = "Sorry something went wrong..."),
      error
    );
  }
}
// console.log(getCountries(baseApiLink));
getCountries(baseApiLink);

/*
function getCountries() {
  let url = baseApiLink;
  fetch(url, {
    cache: "force-cache",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
}
getCountries();
*/
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

// async function cacheImage(imageToCache) {
//   let url = imageToCache;
//   try {
//     let res = await fetch(url);
//     // let data = res.clone();
//     // console.log(data.url)
//     return res.clone().url;
//   } catch (error) {
//     console.log(error);
//   }
// }

// function cacheImage() {
//   let link = "https://flagcdn.com/ax.svg";
//   fetch(link, { cache: "force-cache" })
//     .then((res) => res.clone())
//     .then((data) => {
//       let url = data.url;
//       return url;
//     });
// }

// async function test() {
//   let links = await cacheImage("https://flagcdn.com/ax.svg");
//   console.log(links);
// }

// test();
