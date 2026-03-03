//let task='hi its the example';
//let streak=0;
//let taskCompleted=false;
//console.log(task);
//console.log(streak);
//console.log(taskCompleted);
const daily = document.getElementById('daily');

if (daily) {
  daily.addEventListener("click", () => {
    window.location.href = "daily.html";
  });
}

const calendar = document.getElementById('calendar');

if (calendar) {
  calendar.addEventListener("click", () => {
    window.location.href = "progress.html";
  });
}
const challenge21 = document.getElementById("challenge21");

if (challenge21) {
  challenge21.addEventListener("click", () => {
    window.location.href = "21day.html";
  });
}

//const status=document.getElementById('status');
//console.log(daily);
//console.log(status);
//daily.addEventListener("click", function () {
//status.textContent = "Daily habit done ✅";
//});
const habitInput = document.getElementById('habitInput');
const addHabit = document.getElementById('addHabit');
const habitList = document.getElementById('habitList');
const message = document.getElementById("message");

// Try to load habits from localStorage
let habits = JSON.parse(localStorage.getItem("habits")) || [];

// Save habits to localStorage
function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}
if (addHabit) {
  addHabit.addEventListener("click", function () {
    const name = habitInput.value.trim();

    if (name === "") {
      alert("Please enter a habit");
      return;
    }
    const habit = {
      id: Date.now(),        // unique id
      name: name,            // habit text
      streak: 0,             // fire count
      pausedUntil: null,     // pause date
      lastChecked: null      // last completed date
    };

    habits.push(habit);
    saveHabits();
    renderHabits();

    habitInput.value = "";
  });
}
function renderHabits() {
  if (!habitList) return;

  habitList.innerHTML = "";

  habits.forEach(habit => {

    //const habitText = habitInput.value;
    //if (habitText === "") {
    //alert("Please enter a habit");
    //return;
    //}

    const habitDiv = document.createElement("div");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const text = document.createElement("span");
    text.textContent = " " + habit.name + " ";

    const today = new Date().toDateString();

    if (habit.lastChecked === today) {
      checkbox.checked = true;
    }
    if (checkbox.checked) {
      text.style.textDecoration = "line-through";
      text.style.opacity = "0.6";
    }


    // STREAK
    const streakSpan = document.createElement("span");
    streakSpan.textContent = "🔥 " + habit.streak + " ";

    //PAUSE BUTTON 
    const pauseBtn = document.createElement("button");
    pauseBtn.textContent = "Pause";
    if (habit.pausedUntil && new Date() < new Date(habit.pausedUntil)) {
      pauseBtn.textContent = "Resume";
    } else {
      pauseBtn.textContent = "Pause";
    }
    // DELETE BUTTON 
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    //CHECKBOX LOGIC
    checkbox.addEventListener("change", () => {
      const today = new Date().toDateString();

      // Block if paused
      if (habit.pausedUntil && new Date() < new Date(habit.pausedUntil)) {
        alert("Habit is paused");
        checkbox.checked = false;
        return;
      }

      const last = habit.lastChecked ? new Date(habit.lastChecked) : null;

      if (last) {
        const diffTime = new Date(today) - last;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // ❄️ FREEZE DAY (1 missed day)
        if (diffDays === 2) {
          alert("❄️ Your streak is frozen for today. Complete the habit to continue.");
        }

        // 💥 RESET (2+ missed days)
        if (diffDays >= 3) {
          habit.streak = 0;

          alert("💥 Your streak was reset due to inactivity.");

          // reset lastChecked so today counts as fresh start
          habit.lastChecked = null;
        }
      }

      // Count streak ONLY if not already checked today
      if (habit.lastChecked !== today) {
        habit.streak += 1;
        habit.lastChecked = today;

        if (message) {
          message.textContent = "🔥 Streak counted!";
        }
      } else {
        if (message) {
          message.textContent = "⚠️ Already counted for today";
        }
      }

      setTimeout(() => {
        if (message) message.textContent = "";
      }, 2000);

      saveHabits();
      renderHabits();
    });
    //PAUSE LOGIC
    pauseBtn.addEventListener("click", () => {
      // If habit is currently paused → RESUME
      const now = new Date();
      if (habit.pausedUntil && now < new Date(habit.pausedUntil)) {
        habit.pausedUntil = null;

        if (message) {
          message.textContent = "Habit resumed";
        }
      }
      // Else → PAUSE
      else {
        const days = prompt("Pause for how many days?");
        if (!days) return;

        const pauseDate = new Date();
        pauseDate.setDate(pauseDate.getDate() + Number(days));
        habit.pausedUntil = pauseDate;

        if (message) {
          message.textContent = "⏸ Habit paused";
        }
      }
      if (message) {
        setTimeout(() => {
          message.textContent = "";
        }, 2000);
      }
      saveHabits();
      renderHabits();
    });


    //DELETE LOGIC
    deleteBtn.addEventListener("click", () => {
      habits = habits.filter(h => h.id !== habit.id);
      saveHabits();
      renderHabits();
    });

    habitDiv.appendChild(checkbox);
    habitDiv.appendChild(text);
    habitDiv.appendChild(streakSpan);
    habitDiv.appendChild(pauseBtn);
    habitDiv.appendChild(deleteBtn);

    //const p = document.createElement("p");  
    //p.textContent = habitText;               
    //habitList.appendChild(p);               
    habitList.appendChild(habitDiv);
    //habitInput.value = "";
  });
}
renderHabits();


//21days challenge
const messages = [
  "Consistency beats motivation.",
  "You showed up today. That matters.",
  "Miracles happen when you believe in yourself.",
  "Starting again is not failure. Quitting is.",
  "Keep going. You are closer than you think.",
  "Motivation follows action, not the other way around.",
  "Every time you show up, you rewire who you are."
];
let challenge = JSON.parse(localStorage.getItem("challenge21")) || null;

function saveChallenge() {
  localStorage.setItem("challenge21", JSON.stringify(challenge));
}
const startScreen = document.getElementById("startScreen");
const challengeScreen = document.getElementById("challengeScreen");
const completeScreen = document.getElementById("completeScreen");

const challengeInput = document.getElementById("challengeInput");
const challengeName = document.getElementById("challengeName");
const startBtn = document.getElementById("startChallenge");
const markDoneBtn = document.getElementById("markDone");

const dayCount = document.getElementById("dayCount");
const progressBar = document.getElementById("progressBar");
const motivation = document.getElementById("motivation");
if (startBtn) {
  startBtn.addEventListener("click", () => {
    const name = challengeInput.value.trim();
    if (!name) return alert("Enter a habit");

    challenge = {
      name,
      startDate: new Date().toDateString(),
      completedDays: 0,
      lastChecked: null,
      completed: false
    };

    saveChallenge();
    renderChallenge();
  });
}
function renderChallenge() {
  if (!challenge) return;

  startScreen.style.display = "none";
  challengeScreen.style.display = "block";

  if (challengeName) {
    challengeName.textContent = `🔥 Challenge: ${challenge.name}`;
  }

  dayCount.textContent = `Day ${challenge.completedDays} / 21`;
  progressBar.value = challenge.completedDays;

  const randomMsg =
    messages[Math.floor(Math.random() * messages.length)];
  motivation.textContent = randomMsg;

  if (challenge.completedDays >= 21) {
    challengeScreen.style.display = "none";
    completeScreen.style.display = "block";
    challenge.completed = true;
    saveChallenge();
  }
}

  // Completion
  if (challenge.completedDays >= 21) {
    challengeScreen.style.display = "none";
    completeScreen.style.display = "block";
    challenge.completed = true;
    saveChallenge();
  }
if (markDoneBtn) {
  markDoneBtn.addEventListener("click", () => {
    const today = new Date().toDateString();

    if (challenge.lastChecked === today) {
      alert("Already marked for today");
      return;
    }

    // Hard reset if missed a day
    if (challenge.lastChecked) {
      const diff =
        (new Date(today) - new Date(challenge.lastChecked)) /
        (1000 * 60 * 60 * 24);

      if (diff >= 2) {
        alert("You missed a day. Challenge restarted.");
        challenge.completedDays = 0;
      }
    }

    challenge.completedDays += 1;
    challenge.lastChecked = today;

    saveChallenge();
    renderChallenge();
  });
}
if (challenge) {
  renderChallenge();
}

