// DOM Elements
const currentDateElement = document.getElementById('current-date');
const goalInput = document.getElementById('goal-input');
const saveGoalButton = document.getElementById('save-goal');
const goalText = document.getElementById('goal-text');
const completeGoalButton = document.getElementById('complete-goal');
const completionStatus = document.getElementById('completion-status');
const goalsHistory = document.getElementById('goals-history');

// State
let currentGoal = {
    text: '',
    date: '',
    completed: false
};

// Initialize
function init() {
    updateDateDisplay();
    loadGoalFromStorage();
    loadHistory();
}

// Update date display
function updateDateDisplay() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Save goal to local storage
function saveGoal() {
    if (!goalInput.value.trim()) {
        alert('Please enter a goal!');
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    currentGoal = {
        text: goalInput.value.trim(),
        date: today,
        completed: false
    };

    localStorage.setItem('currentGoal', JSON.stringify(currentGoal));
    updateGoalDisplay();
    goalInput.value = '';
}

// Load goal from storage
function loadGoalFromStorage() {
    const savedGoal = localStorage.getItem('currentGoal');
    if (savedGoal) {
        currentGoal = JSON.parse(savedGoal);
        const today = new Date().toISOString().split('T')[0];
        
        // If the saved goal is from a previous day, move it to history
        if (currentGoal.date !== today) {
            moveGoalToHistory(currentGoal);
            currentGoal = { text: '', date: today, completed: false };
            localStorage.setItem('currentGoal', JSON.stringify(currentGoal));
        }
    }
    updateGoalDisplay();
}

// Update goal display
function updateGoalDisplay() {
    if (currentGoal.text) {
        goalText.textContent = currentGoal.text;
        completeGoalButton.classList.remove('hidden');
        
        if (currentGoal.completed) {
            completionStatus.classList.remove('hidden');
            completeGoalButton.classList.add('hidden');
        } else {
            completionStatus.classList.add('hidden');
            completeGoalButton.classList.remove('hidden');
        }
    } else {
        goalText.textContent = 'No goal set yet';
        completeGoalButton.classList.add('hidden');
        completionStatus.classList.add('hidden');
    }
}

// Mark goal as complete
function completeGoal() {
    currentGoal.completed = true;
    localStorage.setItem('currentGoal', JSON.stringify(currentGoal));
    updateGoalDisplay();
}

// Move goal to history
function moveGoalToHistory(goal) {
    let history = JSON.parse(localStorage.getItem('goalsHistory') || '[]');
    history.unshift(goal);
    localStorage.setItem('goalsHistory', JSON.stringify(history));
}

// Load and display history
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('goalsHistory') || '[]');
    goalsHistory.innerHTML = '';
    
    history.forEach(goal => {
        const goalElement = document.createElement('div');
        goalElement.className = 'goal-item';
        
        const date = new Date(goal.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        goalElement.innerHTML = `
            <div class="goal-date">${date}</div>
            <div class="goal-text ${goal.completed ? 'completed' : ''}">${goal.text}
                ${goal.completed ? ' ✓' : ''}</div>
        `;
        
        goalsHistory.appendChild(goalElement);
    });
}

// Event Listeners
saveGoalButton.addEventListener('click', saveGoal);
completeGoalButton.addEventListener('click', completeGoal);
goalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveGoal();
    }
});

// Initialize the app
init(); 