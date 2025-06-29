const serverSettings = require("./settings.json");
const express = require("express");
const cors = require("cors");
// const fetch = (...args) =>
//   import("node-fetch").then(({ default: fetch }) => fetch(...args));

// create our app
const app = express();
const port = 5502;

// enable all cors requests
app.use(express.json());
app.use(cors());
// app.use("/", express.static("public"));

app.get("/api", async (req, res) => {
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
        console.log("result: ", result);
        let newDataObject = {};

        newDataObject.DeviceName = result.value.Status.DeviceName;
        newDataObject.IPAddress = result.value.StatusNET.IPAddress;
        newDataObject.POWER = result.value.StatusSTS.POWER;

        return newDataObject;
      });

      // lastly, add an object that contains total for each property accross the objects, so for example total price for today's power usage
      // smartPlugData{};

      // console.log("smartPlugData: ", smartPlugData);

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
        // fetch(`http://${device}/cm?cmnd=STATUS%200`).then((res) => res.json())
        // fetch(`http://${device}/cm?cmnd=Power%20TOGGLE`).then((res) => res.json())
        fetch(`http://${device}/cm?cmnd=STATUS%200`).then((res) => res.json())
      );

      const results = await Promise.allSettled(promises);

      const smartPlugData = results.map((result) => {
        console.log("result: ", result);
        let newDataObject = {};

        newDataObject.DeviceName = result.value.Status.DeviceName;
        newDataObject.IPAddress = result.value.StatusNET.IPAddress;
        newDataObject.POWER = result.value.StatusSTS.POWER;

        return newDataObject;
      });

      console.log("smartPlugData: ", smartPlugData);
      return smartPlugData;
    } catch (err) {
      console.error(err);
    }
  }
}
