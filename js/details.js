let detailsGrid = document.querySelector(".country-details");
let borderCountries;

/*
    FUNCTIONS
*/

// Country Details HTML Structure
function countryDetailsStructure(data) {
  return `
    <div class="country-flag">
      <img src=${data.flag} alt="${data.flag} Flag" />
    </div>
    <div class="country-info">
      <div class="col col-1">
        <h1 class="country-title">${data.name}</h1>
      </div>
      <div class="col col-2">
        <div class="col col-1">
          <ul>
            <li><strong>native name: </strong> ${data.nativeName}</li>
            <li><strong>population: </strong> ${data.population}</li>
            <li><strong>region: </strong> ${data.region}</li>
            <li><strong>sub region: </strong> ${data.subregion}</li>
            <li><strong>capital: </strong> ${data.capital}</li>
          </ul>
        </div>
        <div class="col col-2">
          <ul>
            <li><strong>top level domain: </strong> ${data.topLevelDomain}</li>
            <li><strong>currencies: </strong> ${data.currencies[0].name}</li>
            <li><strong>languages: </strong> ${data.languages
              .map((lang) => lang.name)
              .join(", ")}</li>
          </ul>
        </div>
      </div>
      <div class="col col-3">
      ${
        data.borders == undefined
          ? "<strong class='warning'>no borders for this country...!</strong>"
          : `<strong> border countries:</strong> ${`
        <ul>
            ${data.borders
              .map(
                (border) => `
                <li data-border=${border} onclick="moreDetails(this)">
                <button
                  type="button"
                  class="button btn"
                  data-country-name="${data.name}"
                >
                ${border}
                </button>
              </li>`
              )
              .join("")}
          </ul>
      `}`
      }      
      </div>
    </div>
        `;
}

// Get Country Details
async function getCountryDetails() {
  let sessionValue = sessionStorage.getItem("id");
  try {
    let response = await fetch(`${nameQuery}${sessionValue}?fullText=true`);
    // console.log(response);
    let data = await response.json();
    // console.log(data);

    if (response.status == 404) {
      notifications(
        detailsGrid,
        (message = `Sorry, country ${data.message}...`),
        (details = "Please check spelling and try again")
      );
    } else {
      if (data) {
        controlLoader("open"); // Open
        detailsGrid.classList.remove("no-grid", "no-flex");
        detailsGrid.innerHTML = "";
        data.forEach((country) => {
          detailsGrid.innerHTML += countryDetailsStructure(country);
        });
        borderCountries = document.querySelectorAll(".col-3 li");
        controlLoader(); // Close
      } else {
        notifications(detailsGrid);
      }
    }
  } catch (error) {
    //   console.error(error);
    notifications(
      detailsGrid,
      (message = "Sorry something went wrong..."),
      error
    );
  }
}
getCountryDetails();

// Get Border Countries Details
async function getBorderDetails(value) {
  try {
    let response = await fetch(`${alphaQuery}${value}`);
    // console.log(response);
    let data = await response.json();
    // console.log(data);

    if (response.status == 404) {
      notifications(
        detailsGrid,
        (message = `Sorry, country ${data.message}...`),
        (details = "Please check spelling and try again")
      );
    } else {
      if (data) {
        controlLoader("open"); // Open
        detailsGrid.classList.remove("no-grid", "no-flex");
        detailsGrid.innerHTML = "";
        detailsGrid.innerHTML += countryDetailsStructure(data);
        controlLoader(); // Close
      } else {
        notifications(detailsGrid);
      }
    }
  } catch (error) {
    //   console.error(error);
    notifications(
      detailsGrid,
      (message = "Sorry something went wrong..."),
      error
    );
  }
}

function moreDetails(el) {
  controlLoader("open"); // Open
  let countryName = el.dataset.border.toLocaleLowerCase().trim();
  getBorderDetails(countryName);
}
