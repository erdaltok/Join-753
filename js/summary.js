// SUMMARY PAGE
/**
 * Changes the image source of an element on mouseover and mouseout events.
 * @param {HTMLElement} element - The element whose image will change.
 * @param {string} newSrc - The source path of the new image for mouseover.
 * @param {string} originalSrc - The original source path of the image for mouseout.
 */
function changeImageOnHover(element, newSrc, originalSrc) {
  element.addEventListener("mouseover", function () {
    this.querySelector("img").src = newSrc;
  });
  element.addEventListener("mouseout", function () {
    this.querySelector("img").src = originalSrc;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const leftBox = document.querySelector(".left-box");
  const rightBox = document.querySelector(".right-box");

  if (leftBox) {
    changeImageOnHover(
      leftBox,
      "/Join/img/pen-icon-whiteBg.svg",
      "/Join/img/pen-icon.svg"
    );
  }
  if (rightBox) {
    changeImageOnHover(
      rightBox,
      "/Join/img/checkmark-icon-whiteBg.svg",
      "/Join/img/checkmark-icon.svg"
    );
  }
});

/**
 * Updates the task counts displayed on the summary page.
 */
function updateTaskCounts() {
  const todoCount = tasks.filter((task) => task.status === "todo").length;
  const inProgressCount = tasks.filter(
    (task) => task.status === "inProgress").length;
  const awaitFeedbackCount = tasks.filter(
    (task) => task.status === "awaitFeedback"
  ).length;
  const doneCount = tasks.filter((task) => task.status === "done").length;
  const totalCount = tasks.length;
  const updateElementText = (elementId, text) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = text;
    }
  };
  updateElementText("todo-count", todoCount);
  updateElementText("progress-count", inProgressCount);
  updateElementText("feedback-count", awaitFeedbackCount);
  updateElementText("done-count", doneCount);
  updateElementText("tasks-count", totalCount);
  updateUrgentTasksInfo();
}

/**
 * Updates the display of urgent tasks and the nearest deadline.
 */
function updateUrgentTasksInfo() {
  const urgentTasks = tasks.filter((task) => task.priority === "Urgent");
  const urgentCount = urgentTasks.length;
  const deadlineCountElement = document.getElementById("deadline-count");
  if (deadlineCountElement) {
    deadlineCountElement.textContent = urgentCount;  }

  if (urgentTasks.length > 0) {
    const earliestDate = urgentTasks
      .map((task) => new Date(task.dueDate))
      .reduce((a, b) => (a < b ? a : b));

    const deadlineElement = document.getElementById("deadline");
    if (deadlineElement) {
      deadlineElement.textContent = formatDate(earliestDate);
    }
  }
}

/**
 * Formats a date into a more readable string.
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date string.
 */
function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

/**
 * Updates the greeting message based on the time of day and user's name.
 */
function updateGreeting() {
  const userName = "Sofia Müller"; // Hier können Sie den Benutzernamen dynamisch einfügen
  const greetingElement = document.querySelector(".greeting-user h2");
  const userNameElement = document.getElementById("user-name-greet");
  if (!greetingElement || !userNameElement) {
    // console.error("Greeting elements not found");
    return;
  }
  const currentHour = new Date().getHours();
  let greeting;
  if (currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }
  greetingElement.textContent = `${greeting},`;
  userNameElement.textContent = userName;
}

// Event listener for DOMContentLoaded to trigger the greeting update.
document.addEventListener("DOMContentLoaded", updateGreeting);

