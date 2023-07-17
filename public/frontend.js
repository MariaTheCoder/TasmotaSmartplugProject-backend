const gridContainer = document.getElementById("grid-container");

function fetchDataFromBackend() {
  fetch("http://localhost:5502/api", {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("all requested data from the backend: ", data);

      data.forEach((element, index) => {
        console.log(element);

        for (key in element) {
          if (key === "Total" || key === "Yesterday" || key === "Today") {
            createGridElement("div", `${key}: kWh ${element[key]}`, index);
          } else if (
            key === "kWhPrice" ||
            key === "totalPrice" ||
            key === "yesterdayPrice" ||
            key === "todayPrice"
          ) {
            createGridElement("div", `${key}: €${element[key]}`, index);
          } else {
            createGridElement("div", `${key}: ${element[key]}`, index);
          }
        }
      });
    })
    .catch((err) => console.error(err));
}

fetchDataFromBackend();

function createGridElement(HTMLtag, innerText, id) {
  const newElement = document.createElement(HTMLtag);
  newElement.innerText = innerText;
  newElement.classList.add("grid-item");
  newElement.setAttribute("id", id);
  gridContainer.appendChild(newElement);
}
