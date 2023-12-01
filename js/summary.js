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

  document.getElementById("todo-count").textContent = todoCount;
  document.getElementById("progress-count").textContent = inProgressCount;
  document.getElementById("feedback-count").textContent = awaitFeedbackCount;
  document.getElementById("done-count").textContent = doneCount;
  document.getElementById("tasks-count").textContent = totalCount;

  updateUrgentTasksInfo();
}

function updateUrgentTasksInfo() {
  const urgentTasks = tasks.filter((task) => task.priority === "Urgent");
  const urgentCount = urgentTasks.length;
  document.getElementById("deadline-count").textContent = urgentCount;

  if (urgentTasks.length > 0) {
    const earliestDate = urgentTasks
      .map((task) => new Date(task.dueDate))
      .reduce((a, b) => (a < b ? a : b));

    document.getElementById("deadline").textContent = formatDate(earliestDate);
  }
}

function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}




