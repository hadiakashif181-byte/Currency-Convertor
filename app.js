// Base URL for the currency API
const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

// Assume countryList is something like:
// const countryList = { "USD": "US", "PKR": "PK", "EUR": "EU", ... }

let dropDowns = document.querySelectorAll(".dropdown select");
let btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

// Populate dropdowns
for (let select of dropDowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode; // set the value for select
        // Set default selected values
        if (select.name === "from" && currCode === "PKR") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "USD") {
            newOption.selected = true;
        }
        select.append(newOption);
    }

    // Update flag when currency changes
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Function to update the flag image
const updateFlag = (select) => {
    let currCode = select.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = select.parentElement.querySelector("img");
    if (img) {
        img.src = newSrc;
    }
};

// Convert currency on button click
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();

    let amountInput = document.querySelector(".amount input");
    let amtVal = Number(amountInput.value);
    if (!amtVal || amtVal < 1) {
        amtVal = 1;
        amountInput.value = amtVal;
    }

    const from = fromCurr.value.toLowerCase();
    const to = toCurr.value.toLowerCase();
    const URL = `${BASE_URL}/${from}/${to}.json`;

    try {
        let response = await fetch(URL);
        if (!response.ok) throw new Error("Network response was not ok");

        let data = await response.json();
        let rate = data[to];
        let result = (amtVal * rate).toFixed(2);

        document.querySelector(".result").innerText = `${amtVal} ${fromCurr.value} = ${result} ${toCurr.value}`;
    } catch (error) {
        console.error("Error fetching currency data:", error);
        alert("Failed to fetch currency data.");
    }
});
