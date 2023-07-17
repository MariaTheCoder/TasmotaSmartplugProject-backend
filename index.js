const serverSettings = require("./settings.json");
const express = require("express");
const cors = require("cors");
// const fetch = (...args) =>
//   import("node-fetch").then(({ default: fetch }) => fetch(...args));

// create our app
const app = express();
const port = 5502;

// enable all cors requests
app.use(cors());

app.get("/", async (req, res) => {
  const smartPlugData = await getSmartPlugData();
  res.json(smartPlugData);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

console.log(serverSettings);

async function getSmartPlugData() {
  const environment = process.env.NODE_ENV || "development";

  if (environment === "development") {
    console.log("running in " + environment);

    try {
      // The code below can be used as mock data for this project
      const devices = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(
            serverSettings.devices.map((device) => require(`./${device}.json`))
          );
        }, 3000);
      });

      const response = await devices;

      const smartPlugData = response.map((result) => {
        let newDataObject = {};

        newDataObject.Total = result.StatusSNS.ENERGY.Total;
        newDataObject.Yesterday = result.StatusSNS.ENERGY.Yesterday;
        newDataObject.Today = result.StatusSNS.ENERGY.Today;
        newDataObject.POWER = result.StatusSTS.POWER;
        newDataObject.kWhPrice = serverSettings.kWh;
        newDataObject.totalPrice = (
          newDataObject.Total * newDataObject.kWhPrice
        ).toFixed(3);
        newDataObject.yesterdayPrice = (
          newDataObject.Yesterday * newDataObject.kWhPrice
        ).toFixed(3);
        newDataObject.todayPrice = (
          newDataObject.Today * newDataObject.kWhPrice
        ).toFixed(3);

        return newDataObject;
      });

      console.log("smartPlugData: ", smartPlugData);

      // return response to client
      return smartPlugData;
    } catch (err) {
      console.error(err);
    }
  }

  if (environment === "production") {
    console.log("running in " + environment);

    try {
      // Use this call to fetch api on Kerim's end
      const promises = serverSettings.devices.map((device) =>
        fetch(`http://${device}/cm?cmnd=STATUS%200`).then((res) => res.json())
      );

      const results = await Promise.allSettled(promises);

      const smartPlugData = results.map((result) => {
        let newDataObject = {};

        newDataObject.Total = result.StatusSNS.ENERGY.Total;
        newDataObject.Yesterday = result.StatusSNS.ENERGY.Yesterday;
        newDataObject.Today = result.StatusSNS.ENERGY.Today;
        newDataObject.POWER = result.StatusSTS.POWER;
        newDataObject.kWhPrice = serverSettings.kWh;
        newDataObject.totalPrice = (
          newDataObject.Total * newDataObject.kWhPrice
        ).toFixed(3);
        newDataObject.yesterdayPrice = (
          newDataObject.Yesterday * newDataObject.kWhPrice
        ).toFixed(3);
        newDataObject.todayPrice = (
          newDataObject.Today * newDataObject.kWhPrice
        ).toFixed(3);

        return newDataObject;
      });

      console.log("smartPlugData: ", smartPlugData);
      return smartPlugData;
    } catch (err) {
      console.error(err);
    }
  }
}
