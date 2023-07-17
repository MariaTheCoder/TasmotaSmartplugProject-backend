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

      // return response to client
      return response;
    } catch (err) {
      console.error(err);
    }
  }

  if (environment === "production") {
    // Use this call to fetch api on Kerim's end
    console.log("running in " + environment);

    try {
      const promises = serverSettings.devices.map((device) =>
        fetch(`http://${device}/cm?cmnd=STATUS%200`).then((res) => res.json())
      );

      const results = await Promise.allSettled(promises);

      return results;
    } catch (err) {
      console.error(err);
    }
  }
}
