const serverSettings = require("./settings.json");
const express = require("express");

// create our app
const app = express();
const port = 5502;

// const fetch = (...args) =>
//   import("node-fetch").then(({ default: fetch }) => fetch(...args));

app.get("/", (req, res) => {
  res.send("Can you see me?");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

console.log(serverSettings);

async function main() {
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
}

main();
