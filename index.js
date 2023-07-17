const serverSettings = require("./settings.json");
const express = require("express");
// const fetch = (...args) =>
//   import("node-fetch").then(({ default: fetch }) => fetch(...args));

// create our app
const app = express();
const port = 5502;

app.get("/", (req, res) => {
  // The code below can be used as mock data for this project
  const devices = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        serverSettings.devices.map((device) => require(`./${device}.json`))
      );
    }, 3000);
  });

  devices
    .then((value) => {
      res.status(200).send(value);
      console.log(value.length);
    })
    .catch((err) => {
      console.error(err);
    });

  // Use this call to fetch api on Kerim's end
  // const promises = serverSettings.devices.map((device) =>
  //   fetch(`http://${device}/cm?cmnd=STATUS%200`)
  //     .then((res) => res.json())
  //     .catch((err) => console.error(err))
  // );
  // const results = await Promise.allSettled(promises);
  // console.log(results.length);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

console.log(serverSettings);
