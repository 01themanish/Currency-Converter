const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapBtn = document.querySelector(".swap");
const chartCanvas = document.getElementById("rateChart");
let chart;

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  msg.innerText = "Loading exchange rate...";
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

  try {
    let response = await fetch(URL);
    let data = await response.json();

    let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
    let finalAmount = amtVal * rate;

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    drawChart(rate);
  } catch (error) {
    msg.innerText = "Error fetching exchange rate.";
    console.error(error);
  }
};

const drawChart = (rate) => {

  const labels = ["Day1","Day2","Day3","Day4","Day5"];
  const values = [
      rate * 0.98,
      rate * 1.01,
      rate * 0.99,
      rate * 1.02,
      rate
  ];

  if(chart){
      chart.destroy();
  }

  chart = new Chart(chartCanvas, {
      type: "line",
      data: {
          labels: labels,
          datasets: [{
              label: "Exchange Rate Trend",
              data: values,
              borderColor: "#ff512f",
              tension: 0.3
          }]
      }
  });
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];

  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");

  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});

swapBtn.addEventListener("click", () => {

  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  updateFlag(fromCurr);
  updateFlag(toCurr);

  updateExchangeRate();
});