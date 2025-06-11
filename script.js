//timer and clock component
const digitCardsSeconds = document.querySelectorAll(
  "[seconds-segment] .digit-card"
);
const digitCardsMinutes = document.querySelectorAll(
  "[minutes-segement] .digit-card"
);
const digitCardsHours = document.querySelectorAll(
  "[hours-segment] .digit-card"
);
const digitCardsDays = document.querySelectorAll("[days-segment] .digit-card");

let timerHandler = null;

// Populate the year options and start-category options dynamically
function populateYearOptions() {
  const currentYear = new Date().getFullYear();
  const yearSelect = document.getElementById("year");

  // Add options for the current year and the next year
  for (let i = currentYear - 4; i <= currentYear; i++) {
    const optionElement = document.createElement("option");
    optionElement.value = i;
    optionElement.textContent = i;
    yearSelect.appendChild(optionElement);
  }
}

function populateStartCategories() {
  const startCategorySelect = document.getElementById("start-category");
  const options = [
    { label: `دفع 1 (25/2)`, date: `02-25` },
    { label: `دفع 4 (25/5)`, date: `05-25` },
    { label: `دفع 7 (25/8)`, date: `08-25` },
    { label: `دفع 10 (25/11)`, date: `11-25` },
  ];

  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option.date;
    optionElement.textContent = option.label;
    startCategorySelect.appendChild(optionElement);
  });
}

populateYearOptions();
populateStartCategories();

function updateProgress() {
  window.clearInterval(timerHandler);
  const year = document.getElementById("year").value;
  const startCategory = document.getElementById("start-category").value;
  const startDateInput = `${year}-${startCategory}`;
  const durationInput = document.getElementById("duration").value;
  const extraDaysInput = document.getElementById("extra-days").checked;

  const startDate = new Date(startDateInput);
  let endDate;

  // Calculate end date based on the selected duration
  switch (durationInput) {
    case "1":
      endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + 1);
      break;
    case "1.5":
      endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 18);
      break;
    case "2":
      endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + 2);
      break;
    case "3":
      endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + 3);
      break;
  }
  

  // Add extra 45 days if the checkbox is checked
  if (extraDaysInput) {
    endDate.setDate(endDate.getDate() + 45);
  }
  endDate.setDate(endDate.getDate() - 1); //end date is exclusive

  const totalServiceDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
  const currentDate = new Date();
  const daysPassed = (currentDate - startDate) / (1000 * 60 * 60 * 24);
  const percentage = Math.min(
    (daysPassed / totalServiceDays) * 100,
    100
  ).toFixed(2);
  const daysLeft = Math.max(Math.ceil(totalServiceDays - daysPassed), 0);

  // Calculate remaining months
  const monthsLeft =
    (endDate.getFullYear() - currentDate.getFullYear()) * 12 +
    (endDate.getMonth() - currentDate.getMonth());

  // Initialize the timer
  if (daysPassed > 0 && daysLeft > 0) {
    let seconds = 59 - currentDate.getSeconds(),
      minutes = 59 - currentDate.getMinutes(),
      hours = 23 - currentDate.getHours();
    inintializeTimer(
      digitCardsSeconds,
      digitCardsMinutes,
      digitCardsHours,
      digitCardsDays,
      seconds,
      minutes,
      hours,
      daysLeft
    );

    // Run the timer
    runTimer(
      digitCardsSeconds,
      digitCardsMinutes,
      digitCardsHours,
      digitCardsDays,
      seconds,
      minutes,
      hours,
      daysLeft
    );
  }

  // Update the elements based on conditions
  const daysLeftElement = document.getElementById("days-left");
  const messageElement = document.getElementById("message");

  // Check if the service has not started yet
  if (daysPassed < 0) {
    daysLeftElement.textContent = "يارب تاخد اعفاء";
    messageElement.textContent = "";
  } else if (percentage === "100.00" || daysLeft === 0) {
    // Check if the service is completed
    daysLeftElement.textContent = "عدت على خير الحمد لله";
    messageElement.textContent = "";
  } else {
    // Display normal progress information
    daysLeftElement.textContent = `فاضل ${daysLeft} يوم يا حلبة`;

    // Display message based on remaining months
    if (percentage === "100.00" || daysLeft === 0) {
      messageElement.textContent = "";
    } else if (monthsLeft <= 3) {
      // Display normal progress information
      daysLeftElement.textContent = `فاضل ${daysLeft} يوم يا رديف`;
      messageElement.textContent = "هانت يارديف";
    } else {
      messageElement.textContent = "لسه ايامك حلبة";
    }
  }

  // Update the percentage text
  document.getElementById("percentage").textContent = percentage + "%";

  // Update the circle progress
  const circleElement = document.getElementById("circle");
  circleElement.style.background = `conic-gradient(blue 0% ${percentage}%, red ${percentage}% 100%)`;
}

function runTimer(
  digitCardsSeconds,
  digitCardsMinutes,
  digitCardsHours,
  digitCardsDays,
  initailSeconds,
  inintialMinutes,
  initialHours,
  initialDays
) {
  let secondsOnes = initailSeconds % 10;
  let secondsTens = parseInt(initailSeconds / 10);
  let miutesOnes = inintialMinutes % 10;
  let minutesTens = parseInt(inintialMinutes / 10);
  let hoursOnes = initialHours % 10;
  let hoursTens = parseInt(initialHours / 10);
  let daysOnes = initialDays % 10;
  initialDays = parseInt(initialDays / 10);
  let daysTens = initialDays % 10;
  let daysHunderds = parseInt(initialDays / 10);

  timerHandler = window.setInterval(
    function (digitCardsSeconds) {
      // run seconds
      flip(digitCardsSeconds[0], 9, secondsOnes);
      if (secondsOnes === 0) {
        flip(digitCardsSeconds[1], 5, secondsTens);
        secondsTens = secondsTens === 0 ? 5 : secondsTens - 1;
        secondsOnes = 9;
      } else secondsOnes--;
      // run minutes
      if (secondsOnes === 9 && secondsTens === 5) {
        flip(digitCardsMinutes[0], 9, miutesOnes);
        if (miutesOnes === 0) {
          flip(digitCardsMinutes[1], 5, minutesTens);
          minutesTens = minutesTens === 0 ? 5 : minutesTens - 1;
          miutesOnes = 9;
        } else miutesOnes--;
      }
      // run hours
      if (
        miutesOnes === 9 &&
        minutesTens === 5 &&
        secondsOnes === 9 &&
        secondsTens === 5
      ) {
        flip(digitCardsHours[0], hoursOnes === 0 ? 3 : 9, hoursOnes);
        if (hoursOnes === 0) {
          flip(digitCardsHours[1], 2, hoursTens);
          hoursTens = hoursTens === 0 ? 2 : hoursTens - 1;
          hoursOnes = hoursTens === 2 ? 3 : 9;
        } else hoursOnes--;
      }

      if (
        hoursTens === 2 &&
        hoursOnes === 3 &&
        miutesOnes === 9 &&
        minutesTens === 5 &&
        secondsOnes === 9 &&
        secondsTens === 5
      ) {
        flip(digitCardsDays[0], 9, daysOnes);
        if (daysOnes === 0) {
          flip(digitCardsDays[1], 9, daysTens);
          daysTens = daysTens === 0 ? 9 : daysTens - 1;

          if (daysTens === 0) {
            flip(digitCardsDays[2], 9, daysHunderds);
            daysHunderds = daysHunderds === 0 ? 9 : daysHunderds - 1;
          }

          daysOnes = 9;
        } else daysOnes--;
      }
    },
    1000,
    digitCardsSeconds
  );
}

//the main animation componant for clock and timer
function flip(digitCard, breakPoint, currentNumber) {
  const digitTop = digitCard.firstElementChild;
  const digitBottom = digitCard.lastElementChild;
  let currNum = currentNumber;
  let nextNum = currNum === 0 ? breakPoint : currNum - 1;
  digitTop.textContent = currNum;
  digitBottom.textContent = currNum;
  const topFlip = document.createElement("div");
  const bottomFlip = document.createElement("div");
  topFlip.textContent = currNum;
  bottomFlip.textContent = nextNum;
  topFlip.classList.add("top-flip");
  bottomFlip.classList.add("bottom-flip");
  digitCard.addEventListener("animationstart", function (e) {
    if (e.target === topFlip) digitTop.textContent = nextNum;
  });

  digitCard.addEventListener("animationend", function (e) {
    if (e.target === topFlip) e.target.remove();
    else if (e.target === bottomFlip) {
      digitBottom.textContent = nextNum;
      e.target.remove();
    }
  });
  digitCard.append(topFlip, bottomFlip);
}

function inintializeTimer(
  digitCardsSeconds,
  digitCardsMinutes,
  digitCardsHours,
  digitCardsDays,
  initailSeconds,
  inintialMinutes,
  initialHours,
  initialDays
) {
  let secondsOnes = initailSeconds % 10;
  let secondsTens = parseInt(initailSeconds / 10);
  let miutesOnes = inintialMinutes % 10;
  let minutesTens = parseInt(inintialMinutes / 10);
  let hoursOnes = initialHours % 10;
  let hoursTens = parseInt(initialHours / 10);
  let daysOnes = initialDays % 10;
  initialDays = parseInt(initialDays / 10);
  let daysTens = initialDays % 10;
  let daysHunderds = parseInt(initialDays / 10);

  digitCardsSeconds[0].firstElementChild.textContent = secondsOnes;
  digitCardsSeconds[0].lastElementChild.textContent = secondsOnes;

  digitCardsSeconds[1].firstElementChild.textContent = secondsTens;
  digitCardsSeconds[1].lastElementChild.textContent = secondsTens;

  digitCardsMinutes[0].firstElementChild.textContent = miutesOnes;
  digitCardsMinutes[0].lastElementChild.textContent = miutesOnes;

  digitCardsMinutes[1].firstElementChild.textContent = minutesTens;
  digitCardsMinutes[1].lastElementChild.textContent = minutesTens;

  digitCardsHours[0].firstElementChild.textContent = hoursOnes;
  digitCardsHours[0].lastElementChild.textContent = hoursOnes;

  digitCardsHours[1].firstElementChild.textContent = hoursTens;
  digitCardsHours[1].lastElementChild.textContent = hoursTens;

  digitCardsDays[0].firstElementChild.textContent = daysOnes;
  digitCardsDays[0].lastElementChild.textContent = daysOnes;

  digitCardsDays[1].firstElementChild.textContent = daysTens;
  digitCardsDays[1].lastElementChild.textContent = daysTens;

  digitCardsDays[2].firstElementChild.textContent = daysHunderds;
  digitCardsDays[2].lastElementChild.textContent = daysHunderds;
}


// display current date 
function displayCurrentDate(){
   const dateDiv = document.querySelector('.cur-date');
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Customize as needed
    dateDiv.textContent = today.toLocaleDateString(undefined, options);
}
displayCurrentDate();