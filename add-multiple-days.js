// Moved from index.html: addCustomDay function now supports multiple periods per day
function addCustomDay(event) {
  event.preventDefault();

  const dateVal = document.getElementById("custom-date").value;
  const periodKey = document.getElementById("custom-period").value;
  const fromVal = document.getElementById("custom-from").value;
  const toVal = document.getElementById("custom-to").value;
  const subjectVal = document.getElementById("custom-subject").value;
  const taskVal = document.getElementById("custom-task").value;

  const periodMap = {
    morning: { name: "صباحية", class: "morning" },
    afternoon: { name: "بعد الظهر", class: "afternoon" },
    evening: { name: "مسائية", class: "evening" }
  };

  const dateObj = new Date(dateVal);
  if (isNaN(dateObj.getTime())) return;

  const dateStr = dateObj.toLocaleDateString('ar-EG');
  const dayStr = dateObj.toLocaleDateString('ar-EG', { weekday: 'long' });
  const isFriday = dateObj.getDay() === 5;

  addSessionRow({ dayStr, dateStr, periodKey, fromVal, toVal, subjectVal, taskVal, isFriday });
}

function addSessionRow({ dayStr, dateStr, periodKey, fromVal, toVal, subjectVal, taskVal, isFriday }) {
  const tbody = document.querySelector("#study-table tbody");
  const periodMap = {
    morning: { name: "صباحية", class: "morning" },
    afternoon: { name: "بعد الظهر", class: "afternoon" },
    evening: { name: "مسائية", class: "evening" }
  };
  const period = periodMap[periodKey];

  // First, check if there are existing rows with the same date
  const existingDateRows = Array.from(tbody.querySelectorAll('tr')).filter(row => 
    row.children[1] && row.children[1].textContent === dateStr
  );

  const tr = document.createElement("tr");
  if (isFriday) tr.classList.add("friday-row");

  const tdDay = document.createElement("td"); tdDay.textContent = dayStr;
  const tdDate = document.createElement("td"); tdDate.textContent = dateStr;
  const tdPeriod = document.createElement("td"); tdPeriod.textContent = period.name;
  tdPeriod.classList.add("period-cell", period.class);

  const tdFrom = document.createElement("td"); tdFrom.textContent = formatArabicTime(fromVal);
  const tdTo = document.createElement("td"); tdTo.textContent = formatArabicTime(toVal);

  const tdSubject = document.createElement("td");
  tdSubject.textContent = subjectVal;
  tdSubject.contentEditable = "true";

  const tdTask = document.createElement("td");
  tdTask.contentEditable = "true";
  tdTask.textContent = taskVal;

  const note = document.createElement("div");
  note.className = "tooltip";
  note.textContent = tooltipGenerator();
  tdTask.appendChild(note);

  const btn = document.createElement("button");
  btn.className = "mark-done";
  btn.textContent = "تحديد تم";
  btn.onclick = () => markDone(btn);
  tdTask.appendChild(btn);

  subjectEnhancer(tdSubject);

  tr.appendChild(tdDay);
  tr.appendChild(tdDate);
  tr.appendChild(tdPeriod);
  tr.appendChild(tdFrom);
  tr.appendChild(tdTo);
  tr.appendChild(tdSubject);
  tr.appendChild(tdTask);

  // If there are existing rows with the same date, insert after the last such row
  if (existingDateRows.length > 0) {
    const lastExistingRow = existingDateRows[existingDateRows.length - 1];
    lastExistingRow.after(tr);
  } else {
    // If no existing rows with this date, append to the end
    tbody.appendChild(tr);
  }

  // Remove and re-add the daily rating row for this date if it exists
  const existingRatingRow = Array.from(tbody.querySelectorAll('tr')).find(row => 
    row.children[0] && row.children[0].colSpan === 7 && 
    row.previousElementSibling && 
    row.previousElementSibling.children[1].textContent === dateStr
  );
  
  if (existingRatingRow) {
    existingRatingRow.remove();
  }

  // Add a new rating row for this date at the end of its sessions
  const ratingRow = document.createElement("tr");
  const ratingCell = document.createElement("td");
  ratingCell.colSpan = 7;
  ratingCell.innerHTML = `<strong>تقييم يوم ${dateStr}:</strong> <input type="text" placeholder="أنجزت كام ساعة؟ إيه اللي محتاج أراجعه؟" style="width: 80%; padding: 5px;">`;
  ratingRow.appendChild(ratingCell);
  tr.after(ratingRow);
}

function formatArabicTime(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  let hour = h;
  let suffix = "";
  if (h >= 12) {
    suffix = "م";
    if (h > 12) hour = h - 12;
  } else if (h === 0) hour = 12;
  return hour + ":" + String(m).padStart(2, "0") + " " + suffix;
}

function subjectEnhancer(tdSubject) {
  tdSubject.addEventListener("input", () => {
    const txt = tdSubject.textContent;
    if (heavySubjects.some(s => txt.includes(s))) {
      tdSubject.classList.add("highlight-heavy");
    } else {
      tdSubject.classList.remove("highlight-heavy");
    }

    if (reviewKeywords.some(s => txt.includes(s))) {
      tdSubject.classList.add("review-cell");
    } else {
      tdSubject.classList.remove("review-cell");
    }
  });
}

function markDone(button) {
  const cell = button.parentElement;
  cell.classList.add('done-cell');
  button.remove();

  // Check if all session cells of the day are done
  const row = cell.parentElement;
  const date = row.children[1].textContent;
  const dayRows = Array.from(document.querySelectorAll('#study-table tbody tr'))
    .filter(tr => tr.children.length >= 2 && tr.children[1] && tr.children[1].textContent === date);

  const allDone = dayRows.every(r => {
    const lastCell = r.children[6];
    return lastCell && lastCell.querySelector('.mark-done') === null;
  });

  if (allDone) {
    dayRows.forEach(r => r.classList.add("done-day"));
  }
}

function setupAchievementCrystalTracking() {
  const markDoneButtons = document.querySelectorAll('.mark-done');
  markDoneButtons.forEach(button => {
    button.addEventListener('click', () => {
      setTimeout(updateAchievementCrystal, 100);
    });
  });
}

document.addEventListener('DOMContentLoaded', setupAchievementCrystalTracking);