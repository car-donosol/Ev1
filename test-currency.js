
const fetch = require('node-fetch'); // Assuming node-fetch or global fetch in node 18+

async function testApi() {
  try {
    console.log("Fetching from open.er-api.com...");
    const res = await fetch("https://open.er-api.com/v6/latest/CLP");
    if (!res.ok) {
        console.error("Response not OK:", res.status, res.statusText);
        return;
    }
    const data = await res.json();
    console.log("Result result:", data.result);
    console.log("Rates CLP:", data.rates.CLP);
    console.log("Rates USD:", data.rates.USD);
    console.log("Rates EUR:", data.rates.EUR);
  } catch (error) {
    console.error("Error fetching:", error);
  }
}

testApi();
