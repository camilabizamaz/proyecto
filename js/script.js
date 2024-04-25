async function convertCurrency() {
  var amount = parseFloat(document.getElementById("amount").value);
  var fromCurrency = document.getElementById("fromCurrency").value;
  var toCurrency = document.getElementById("toCurrency").value;

  var conversionRate = await getConversionRate(fromCurrency, toCurrency);
  var result = amount * conversionRate;

  document.getElementById("result").innerHTML =
    amount +
    " " +
    fromCurrency +
    " equivale a " +
    result.toFixed(2) +
    " " +
    toCurrency;
}

async function getConversionRate(fromCurrency, toCurrency) {
  var conversionRates = JSON.parse(localStorage.getItem("conversionRates"));

  if (
    !conversionRates ||
    !conversionRates[fromCurrency] ||
    !conversionRates[fromCurrency][toCurrency]
  ) {
    var apiKey = "B59AA9209AE9BC850B149ABB";
    var url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;

    var response = await fetch(url);
    var data = await response.json();

    if (!conversionRates) {
      conversionRates = {};
    }
    if (!conversionRates[fromCurrency]) {
      conversionRates[fromCurrency] = {};
    }

    conversionRates[fromCurrency][toCurrency] =
      data.conversion_rates[toCurrency];
    localStorage.setItem("conversionRates", JSON.stringify(conversionRates));
  }

  return conversionRates[fromCurrency][toCurrency];
}

// Lista de todas las divisas que quieres actualizar
var currencies = ["USD", "CLP", "EUR", "GBP", "CHF", "JPY", "CNY", "COP", "ARS"];

// Actualiza cada divisa
for (let i = 0; i < currencies.length; i++) {
  getConversionRate("USD", currencies[i]);
}

// Actualiza las tasas de cambio a medianoche todos los días
setInterval(() => {
  for (let i = 0; i < currencies.length; i++) {
    getConversionRate("USD", currencies[i]);
  }
}, 24 * 60 * 60 * 1000); // 24 horas en milisegundos
