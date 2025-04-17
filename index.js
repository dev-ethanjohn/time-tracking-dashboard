"use strict";

const activityGrid = document.querySelector(".activity-grid");
const timeframeButtons = document.querySelectorAll(".timeframe-button");

let currentTimeframe = "daily";
let timeTrackingData = [];

// init when page loads (DOM)
document.querySelectorAll(".timeframe-button").forEach((btn) => {
  btn.classList.remove("active");
});
document
  .querySelector(`[data-timeframe="${currentTimeframe}"]`)
  .classList.add("active");

// *create all activity card
function displayActivityCards(timeframe) {
  // clear grid
  activityGrid.innerHTML = "";

  // * create a card
  timeTrackingData.forEach((activity) => {
    const current = activity.timeframes[timeframe].current;
    const previous = activity.timeframes[timeframe].previous;
    let previousPeriod;

    switch (timeframe) {
      case "daily":
        previousPeriod = "Yesterday";
        break;
      case "weekly":
        previousPeriod = "Last Week";
        break;
      case "monthly":
        previousPeriod = "Last Month";
        break;
    }

    const cardHTML = `
      <li class="activity-card activity-card--${activity.title
        .toLowerCase()
        .replace(" ", "-")}">
        <div class="activity-card__info">
          <div class="activity-card__header">
            <h3 class="activity-card__title">${activity.title}</h3>
            <img class="activity-card__menu-icon" src="./images/icon-ellipsis.svg" alt="menu icon">
          </div>
          <div class="activity-card__stats">
            <span class="activity-card__time">${current}hrs</span>
            <small class="activity-card__previous">${previousPeriod} - ${previous}hrs</small>
          </div>
        </div>
      </li>
    `;

    activityGrid.innerHTML += cardHTML;
  });
}

// initially currentTimeFrame === "daily" as active
timeframeButtons.forEach((button) => {
  button.addEventListener("click", function () {
    // *reset by removal
    timeframeButtons.forEach((btn) => btn.classList.remove("active"));

    // add active class to clicked button/ nav item
    this.classList.add("active");

    // *update data attribute to curentTimeframe
    currentTimeframe = this.dataset.timeframe;

    // *rerender the cards based on updated currenTimeframe
    displayActivityCards(currentTimeframe);
  });
});

//* NOTE: immediate invoked async as soona the page loads/ scriptloads
(async function () {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    timeTrackingData = await response.json(); //* assigned

    displayActivityCards(currentTimeframe);
  } catch (error) {
    console.error("Error fetching data:", error);
    activityGrid.innerHTML =
      "<p>Error loading data. Please try again later.</p>";
  }
})();
