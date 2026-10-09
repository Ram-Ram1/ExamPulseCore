const STORAGE_KEY = 'examPulseCoreAssessments';
const TASKS_KEY = 'examPulseCoreTaskMap';

const defaultAssessments = [
  {
    id: 'bio-midterm',
    title: 'Biology Midterm',
    subject: 'Biology 101',
    room: 'C-204',
    type: 'Midterm',
    date: '2026-10-16',
    time: '09:00',
  },
  {
    id: 'history-essay',
    title: 'History Essay',
    subject: 'Modern History',
    room: 'H-112',
    type: 'Final',
    date: '2026-10-21',
    time: '13:30',
  },
  {
    id: 'chem-practical',
    title: 'Chemistry Practical',
    subject: 'Chemistry Lab',
    room: 'Lab 3',
    type: 'Practical',
    date: '2026-10-26',
    time: '11:00',
  },
];

const DEFAULT_TASKS = {
  'bio-midterm': [
    { text: 'Review chapter 3 summary notes', done: false },
    { text: 'Complete 10 flashcards', done: true },
    { text: 'Practice a timed mock quiz', done: false },
  ],
  'history-essay': [
    { text: 'Outline thesis structure', done: false },
    { text: 'Draft evidence paragraphs', done: false },
  ],
  'chem-practical': [
    { text: 'Review lab safety notes', done: true },
    { text: 'Rehearse reaction steps', done: false },
  ],
};

const state = {
  assessments: loadAssessments(),
  taskMap: loadTaskMap(),
  selectedAssessmentId: null,
  filter: 'all',
  search: '',
};

const form = document.getElementById('assessment-form');
const dashboard = document.getElementById('dashboard');
const reminders = document.getElementById('reminders');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const addTaskBtn = document.getElementById('add-task-btn');
const selectedAssessmentTitle = document.getElementById('selected-assessment-title');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');

function loadAssessments() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAssessments));
    return defaultAssessments;
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? parsed : defaultAssessments;
  } catch {
    return defaultAssessments;
  }
}

function loadTaskMap() {
  const saved = localStorage.getItem(TASKS_KEY);
  if (!saved) {
    const taskMap = JSON.parse(JSON.stringify(DEFAULT_TASKS));
    localStorage.setItem(TASKS_KEY, JSON.stringify(taskMap));
    return taskMap;
  }

  try {
    const parsed = JSON.parse(saved);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return normalizeTaskMap(parsed);
    }
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_TASKS));
  }

  return JSON.parse(JSON.stringify(DEFAULT_TASKS));
}

function normalizeTaskMap(taskMap) {
  const normalized = {};
  Object.keys(taskMap).forEach((key) => {
    normalized[key] = normalizeTasks(taskMap[key]);
  });
  return normalized;
}

function normalizeTasks(tasks) {
  return (Array.isArray(tasks) ? tasks : []).map((task) => {
    if (typeof task === 'string') {
      return { text: task, done: false };
    }

    return {
      text: task?.text || 'Untitled task',
      done: Boolean(task?.done),
    };
  });
}

function saveAssessments() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.assessments));
}

function saveTaskMap() {
  localStorage.setItem(TASKS_KEY, JSON.stringify(state.taskMap));
}

function getSelectedAssessment() {
  ensureSelectedAssessment();
  return state.assessments.find((assessment) => assessment.id === state.selectedAssessmentId) || null;
}

function ensureSelectedAssessment() {
  if (!state.assessments.length) {
    state.selectedAssessmentId = null;
    return;
  }

  const exists = state.assessments.some((assessment) => assessment.id === state.selectedAssessmentId);
  if (!exists) {
    state.selectedAssessmentId = state.assessments[0].id;
  }
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function calculateCountdown(dateString, timeString) {
  const eventDate = new Date(`${dateString}T${timeString || '09:00'}:00`);
  const now = new Date();
  const diffMs = eventDate - now;

  if (diffMs <= 0) {
    return { label: 'Critical', color: 'urgency-critical', days: 0, hours: 0, totalHours: 0 };
  }

  const totalHours = Math.ceil(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  let label = 'Upcoming';
  let color = 'urgency-upcoming';

  if (totalHours <= 48) {
    label = 'Critical';
    color = 'urgency-critical';
  } else if (totalHours <= 7 * 24) {
    label = 'Soon';
    color = 'urgency-soon';
  }

  return { label, color, days, hours, totalHours };
}

function buildReminderSummary(assessment) {
  const date = new Date(`${assessment.date}T${assessment.time}:00`);
  const remindersSet = [
    { label: '7 days before', offset: 7 },
    { label: '2 days before', offset: 2 },
    { label: 'Morning of exam', offset: 0 },
  ];

  return remindersSet.map((reminder) => {
    const sendDate = new Date(date);
    if (reminder.offset === 0) {
      sendDate.setHours(8, 0, 0, 0);
    } else {
      sendDate.setDate(sendDate.getDate() - reminder.offset);
      sendDate.setHours(9, 0, 0, 0);
    }

    return {
      assessment: assessment.title,
      reminder: reminder.label,
      scheduledFor: sendDate,
    };
  });
}

function renderDashboard() {
  const template = document.getElementById('card-template');
  const filtered = state.assessments
    .filter((assessment) => {
      const countdown = calculateCountdown(assessment.date, assessment.time);
      const searchText = `${assessment.subject} ${assessment.title}`.toLowerCase();
      const matchesSearch = searchText.includes(state.search.toLowerCase());
      const matchesFilter = state.filter === 'all' || countdown.label.toLowerCase() === state.filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!filtered.length) {
    dashboard.innerHTML = '<p class="empty-state">No assessments match the current search or filter.</p>';
    return;
  }

  dashboard.innerHTML = '';

  filtered.forEach((assessment) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const countdown = calculateCountdown(assessment.date, assessment.time);
    const isSelected = assessment.id === state.selectedAssessmentId;
    if (isSelected) {
      card.classList.add('selected');
    }

    card.dataset.assessmentId = assessment.id;
    card.querySelector('.course-tag').textContent = assessment.subject;
    card.querySelector('h3').textContent = assessment.title;
    card.querySelector('.urgency-badge').textContent = countdown.label;
    card.querySelector('.urgency-badge').classList.add(countdown.color);
    card.querySelector('.type-value').textContent = assessment.type;
    card.querySelector('.room-value').textContent = assessment.room;
    card.querySelector('.date-value').textContent = `${formatDate(assessment.date)} at ${assessment.time}`;

    const countdownText = countdown.totalHours <= 0
      ? 'Now'
      : countdown.days > 0
        ? `${countdown.days}d ${countdown.hours}h left`
        : `${countdown.hours}h left`;

    card.querySelector('.countdown-value').textContent = countdownText;

    card.addEventListener('click', (event) => {
      if (event.target.closest('.delete-btn')) return;
      state.selectedAssessmentId = assessment.id;
      renderAll();
    });

    card.querySelector('.delete-btn').addEventListener('click', (event) => {
      event.stopPropagation();
      removeAssessment(assessment.id);
    });

    dashboard.appendChild(card);
  });
}

function renderReminders() {
  const allReminders = state.assessments.flatMap(buildReminderSummary);

  if (!allReminders.length) {
    reminders.innerHTML = '<p class="empty-state">No reminders scheduled yet.</p>';
    return;
  }

  reminders.innerHTML = allReminders
    .map(
      (item) => `
        <div class="reminder-item">
          <strong>${item.assessment}</strong>
          <span>${item.reminder}: ${item.scheduledFor.toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}</span>
        </div>
      `,
    )
    .join('');
}

function renderTasks() {
  const assessment = getSelectedAssessment();
  if (!assessment) {
    selectedAssessmentTitle.textContent = 'Study task breakdown';
    taskList.innerHTML = '<li><p class="empty-state">Select an assessment to add study tasks.</p></li>';
    return;
  }

  selectedAssessmentTitle.textContent = `${assessment.title} tasks`;
  const tasks = state.taskMap[assessment.id] || [];

  if (!tasks.length) {
    taskList.innerHTML = '<li><p class="empty-state">No study tasks yet for this assessment.</p></li>';
    return;
  }

  taskList.innerHTML = tasks
    .map(
      (task, index) => `
        <li>
          <label>
            <input type="checkbox" data-index="${index}" ${task.done ? 'checked' : ''} />
            <span class="${task.done ? 'task-complete' : ''}">${task.text}</span>
          </label>
        </li>
      `,
    )
    .join('');
}

function renderAll() {
  ensureSelectedAssessment();
  renderDashboard();
  renderReminders();
  renderTasks();
}

function removeAssessment(assessmentId) {
  state.assessments = state.assessments.filter((assessment) => assessment.id !== assessmentId);
  delete state.taskMap[assessmentId];
  saveAssessments();
  saveTaskMap();
  ensureSelectedAssessment();
  renderAll();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const newAssessment = {
    id: `assessment-${crypto.randomUUID()}`,
    title: formData.get('title').toString().trim(),
    subject: formData.get('subject').toString().trim(),
    room: formData.get('room').toString().trim(),
    type: formData.get('type').toString(),
    date: formData.get('date').toString(),
    time: formData.get('time').toString(),
  };

  if (!newAssessment.title || !newAssessment.subject || !newAssessment.room || !newAssessment.date || !newAssessment.time) {
    return;
  }

  state.assessments.push(newAssessment);
  state.taskMap[newAssessment.id] = [];
  state.selectedAssessmentId = newAssessment.id;
  saveAssessments();
  saveTaskMap();
  form.reset();
  renderAll();
});

addTaskBtn.addEventListener('click', () => {
  const assessment = getSelectedAssessment();
  const trimmed = taskInput.value.trim();

  if (!assessment || !trimmed) return;

  if (!state.taskMap[assessment.id]) {
    state.taskMap[assessment.id] = [];
  }

  state.taskMap[assessment.id].push({ text: trimmed, done: false });
  saveTaskMap();
  taskInput.value = '';
  renderTasks();
});

taskList.addEventListener('change', (event) => {
  const assessment = getSelectedAssessment();
  const target = event.target;

  if (!assessment || !(target instanceof HTMLInputElement)) return;

  const index = Number(target.getAttribute('data-index'));
  if (Number.isNaN(index)) return;

  const tasks = state.taskMap[assessment.id] || [];
  if (!tasks[index]) return;

  tasks[index].done = target.checked;
  state.taskMap[assessment.id] = tasks;
  saveTaskMap();
  renderTasks();
});

searchInput.addEventListener('input', (event) => {
  state.search = event.target.value;
  renderDashboard();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state.filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    renderDashboard();
  });
});

renderAll();
