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
  // *NOTE:  in memory before final append
  const fragment = document.createDocumentFragment();

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

    const li = document.createElement("li");
    li.className = `activity-card activity-card--${activity.title
      .toLowerCase()
      .replace(/ /g, "-")}`;

    li.innerHTML = `
      <div class="activity-card__info">
        <div class="activity-card__header">
          <h3 class="activity-card__title">${activity.title}</h3>
          <span class="activity-card__menu-icon" aria-hidden="true"></span>
        </div>
        <div class="activity-card__stats">
          <span class="activity-card__time">${current}hrs</span>
          <small class="activity-card__previous">${previousPeriod} - ${previous}hrs</small>
        </div>
      </div>
    `;

    li.style.setProperty(
      "--background-image",
      `url(../../images/icon-${activity.title
        .toLowerCase()
        .replace(/ /g, "-")}.svg)`
    );

    fragment.appendChild(li);

    // * animation
    const timeSpan = li.querySelector(".activity-card__time");
    const previousSmall = li.querySelector(".activity-card__previous");

    timeSpan.classList.add("animate-fade-in");
    previousSmall.classList.add("animate-fade-in");
  });

  activityGrid.innerHTML = ""; //* clear once
  activityGrid.appendChild(fragment); //* inject once
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
