const serverSettings = require("./settings.json");
// const fetch = (...args) =>
//   import("node-fetch").then(({ default: fetch }) => fetch(...args));

console.log(serverSettings);
console.log(serverSettings.devices.length);

async function main() {
  // Use this call to fetch api on Kerim's end
  // const promises = serverSettings.devices.map((device) =>
  //   fetch(`http://${device}/cm?cmnd=STATUS%200`)
  //     .then((res) => res.json())
  //     .catch((err) => console.error(err))
  // );
  // const results = await Promise.all(promises);
  // console.log(results.length);
}

main();
