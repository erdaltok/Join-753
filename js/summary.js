// SUMMARY PAGE

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
      "/img/pen-icon-whiteBg.svg",
      "/img/pen-icon.svg"
    );
  }

  if (rightBox) {
    changeImageOnHover(
      rightBox,
      "/img/checkmark-icon-whiteBg.svg",
      "/img/checkmark-icon.svg"
    );
  }
});

function updateTaskCounts() {
  const todoCount = tasks.filter((task) => task.status === "todo").length;
  const inProgressCount = tasks.filter(
    (task) => task.status === "inProgress"
  ).length;
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

function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}


