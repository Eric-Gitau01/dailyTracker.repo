document.addEventListener('DOMContentLoaded', function() {
    // Check if user has already selected a gender
    const userGender = localStorage.getItem('bloomGender');
    
    if (userGender) {
      // Apply saved theme and show app
      applyTheme(userGender);
      document.getElementById('genderModal').style.display = 'none';
      document.getElementById('appContainer').style.display = 'block';
      initApp();
      
      // Check if this is the first visit
      if (!localStorage.getItem('bloomFirstVisit')) {
        document.getElementById('onboarding').style.display = 'flex';
        localStorage.setItem('bloomFirstVisit', 'true');
      }
    } else {
      // Show gender selection modal
      setupGenderSelection();
    }
  });

  function setupGenderSelection() {
    const genderOptions = document.querySelectorAll('.gender-option');
    
    genderOptions.forEach(option => {
      option.addEventListener('click', function() {
        const selectedGender = this.getAttribute('data-gender');
        localStorage.setItem('bloomGender', selectedGender);
        
        // Apply theme and show app
        applyTheme(selectedGender);
        document.getElementById('genderModal').style.display = 'none';
        document.getElementById('appContainer').style.display = 'block';
        initApp();
        
        // Show onboarding
        document.getElementById('onboarding').style.display = 'flex';
      });
    });
  }

  function applyTheme(gender) {
    // Remove any existing theme classes
    document.body.classList.remove('female-theme', 'male-theme');
    
    // Add the selected theme class
    document.body.classList.add(`${gender}-theme`);
    
    // Update current theme display in settings
    if (document.getElementById('currentTheme')) {
      document.getElementById('currentTheme').textContent = 
        gender === 'female' ? 'Female' : 'Male';
    }
    
    // Update motivational message based on gender
    const motivationalMessage = document.getElementById('motivationalMessage');
    if (motivationalMessage) {
      motivationalMessage.textContent = gender === 'female' 
        ? "You're amazing! Keep shining! ✨" 
        : "Great work! You've crushed it today! 💪";
    }
  }

  function initApp() {
    // Close onboarding
    document.getElementById('startBtn').addEventListener('click', function() {
      document.getElementById('onboarding').style.display = 'none';
    });

    // Set current date
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);

    // Load motivational quote
    loadQuote();

    // Tab functionality
    setupTabs();

    // Goal tracker functionality
    setupGoalTracker();

    // Journal functionality
    setupJournal();

    // Habit tracker functionality
    setupHabitTracker();

    // Theme change button in settings
    document.getElementById('changeThemeBtn').addEventListener('click', function() {
      if (confirm('Change theme? This will reload the app.')) {
        localStorage.removeItem('bloomGender');
        location.reload();
      }
    });
  }

  function loadQuote() {
    const quotes = {
      female: [
        "You are capable of amazing things.",
        "Small steps every day lead to big results.",
        "Believe you can and you're halfway there.",
        "Your potential is endless.",
        "Today is a perfect day to start something new.",
        "Bloom where you are planted.",
        "She believed she could, so she did.",
        "You're stronger than you think.",
        "Every flower must grow through dirt.",
        "You is kind. You is smart. You is important."
      ],
      male: [
        "Discipline is choosing between what you want now and what you want most.",
        "Success is the sum of small efforts repeated daily.",
        "The only limit to our realization of tomorrow is our doubts of today.",
        "Don't watch the clock; do what it does. Keep going.",
        "Quality is not an act, it's a habit.",
        "The secret of getting ahead is getting started.",
        "Hard work beats talent when talent fails to work hard.",
        "No excuses, just results.",
        "Stay hungry, stay foolish.",
        "Do the hard work, especially when you don't feel like it."
      ]
    };

    const userGender = localStorage.getItem('bloomGender') || 'female';
    const genderQuotes = quotes[userGender];
    const randomQuote = genderQuotes[Math.floor(Math.random() * genderQuotes.length)];
    document.getElementById('dailyQuote').textContent = randomQuote;
  }

  function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }

  function setupGoalTracker() {
    const goalInput = document.getElementById('goalInput');
    const addGoalBtn = document.getElementById('addGoalBtn');
    const goalList = document.getElementById('goalList');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const motivationalMessage = document.getElementById('motivationalMessage');

    // Load goals from localStorage
    let goals = JSON.parse(localStorage.getItem('bloomGoals')) || [];

    // Render goals
    renderGoals();

    // Add new goal
    addGoalBtn.addEventListener('click', addGoal);
    goalInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') addGoal();
    });

    function addGoal() {
      const goalText = goalInput.value.trim();
      if (goalText) {
        const newGoal = {
          id: Date.now(),
          text: goalText,
          completed: false,
          createdAt: new Date().toISOString()
        };

        goals.push(newGoal);
        saveGoals();
        renderGoals();
        goalInput.value = '';
        goalInput.focus();
      }
    }

    function renderGoals() {
      goalList.innerHTML = '';
      
      if (goals.length === 0) {
        goalList.innerHTML = '<p style="text-align: center; opacity: 0.7;">No goals set for today. Add your first goal above!</p>';
        return;
      }

      let completedCount = 0;

      goals.forEach(goal => {
        const goalItem = document.createElement('li');
        goalItem.className = 'goal-item';
        if (goal.completed) {
          goalItem.classList.add('completed');
          completedCount++;
        }

        goalItem.innerHTML = `
          <input type="checkbox" class="goal-checkbox" ${goal.completed ? 'checked' : ''} data-id="${goal.id}">
          <span class="goal-text">${goal.text}</span>
          <div class="goal-actions">
            <button class="goal-btn edit-btn" data-id="${goal.id}"><i class="fas fa-edit"></i></button>
            <button class="goal-btn delete-btn" data-id="${goal.id}"><i class="fas fa-trash-alt"></i></button>
          </div>
        `;

        goalList.appendChild(goalItem);
      });

      // Update progress
      const progress = Math.round((completedCount / goals.length) * 100);
      progressFill.style.width = `${progress}%`;
      progressText.textContent = `${progress}% Complete`;

      // Show motivational message if all goals completed
      if (completedCount > 0 && completedCount === goals.length) {
        motivationalMessage.style.display = 'block';
      } else {
        motivationalMessage.style.display = 'none';
      }

      // Add event listeners to checkboxes
      document.querySelectorAll('.goal-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          const goalId = parseInt(this.getAttribute('data-id'));
          const goal = goals.find(g => g.id === goalId);
          if (goal) {
            goal.completed = this.checked;
            saveGoals();
            renderGoals();
          }
        });
      });

      // Add event listeners to delete buttons
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const goalId = parseInt(this.getAttribute('data-id'));
          if (confirm('Are you sure you want to delete this goal?')) {
            goals = goals.filter(g => g.id !== goalId);
            saveGoals();
            renderGoals();
          }
        });
      });

      // Add event listeners to edit buttons
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const goalId = parseInt(this.getAttribute('data-id'));
          const goal = goals.find(g => g.id === goalId);
          if (goal) {
            goalInput.value = goal.text;
            goalInput.focus();
            goals = goals.filter(g => g.id !== goalId);
            saveGoals();
            renderGoals();
          }
        });
      });
    }

    function saveGoals() {
      localStorage.setItem('bloomGoals', JSON.stringify(goals));
    }
  }

  function setupJournal() {
    const journalContent = document.getElementById('journalContent');
    const saveJournalBtn = document.getElementById('saveJournalBtn');
    const journalEntries = document.getElementById('journalEntries');

    // Load journal entries from localStorage
    let entries = JSON.parse(localStorage.getItem('bloomJournalEntries')) || [];

    // Render journal entries
    renderJournalEntries();

    // Setup toolbar buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const command = this.getAttribute('data-command');
        document.execCommand(command, false, null);
        journalContent.focus();
      });
    });

    // Save journal entry
    saveJournalBtn.addEventListener('click', saveJournalEntry);

    function saveJournalEntry() {
      const content = journalContent.innerHTML.trim();
      if (content) {
        const now = new Date();
        const dateString = now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const newEntry = {
          id: Date.now(),
          date: dateString,
          timestamp: now.toISOString(),
          content: content
        };

        entries.unshift(newEntry); // Add to beginning of array
        saveJournalEntries();
        renderJournalEntries();
        journalContent.innerHTML = '';
      }
    }

    function renderJournalEntries() {
      journalEntries.innerHTML = '<h3>Previous Entries</h3>';
      
      if (entries.length === 0) {
        journalEntries.innerHTML += '<p style="text-align: center; opacity: 0.7;">No journal entries yet. Write your first entry above!</p>';
        return;
      }

      entries.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'entry';
        entryElement.innerHTML = `
          <div class="entry-date">
            ${entry.date}
            <span class="delete-entry" data-id="${entry.id}"><i class="fas fa-trash-alt"></i></span>
          </div>
          <div class="entry-content">${entry.content}</div>
        `;
        journalEntries.appendChild(entryElement);
      });

      // Add event listeners to delete buttons
      document.querySelectorAll('.delete-entry').forEach(btn => {
        btn.addEventListener('click', function() {
          const entryId = parseInt(this.getAttribute('data-id'));
          if (confirm('Are you sure you want to delete this journal entry?')) {
            entries = entries.filter(e => e.id !== entryId);
            saveJournalEntries();
            renderJournalEntries();
          }
        });
      });
    }

    function saveJournalEntries() {
      localStorage.setItem('bloomJournalEntries', JSON.stringify(entries));
    }
  }

  function setupHabitTracker() {
    const habitList = document.getElementById('habitList');
    
    // Default habits
    let habits = JSON.parse(localStorage.getItem('bloomHabits')) || [
      { id: 1, text: "Drink water", completed: false },
      { id: 2, text: "Exercise", completed: false },
      { id: 3, text: "Meditate", completed: false },
      { id: 4, text: "Read", completed: false },
      { id: 5, text: "Gratitude journal", completed: false }
    ];

    // Render habits
    renderHabits();

    function renderHabits() {
      habitList.innerHTML = '';
      
      habits.forEach(habit => {
        const habitItem = document.createElement('div');
        habitItem.className = 'habit-item';
        habitItem.innerHTML = `
          <input type="checkbox" class="habit-checkbox" ${habit.completed ? 'checked' : ''} data-id="${habit.id}">
          <span>${habit.text}</span>
        `;
        habitList.appendChild(habitItem);
      });

      // Add event listeners to checkboxes
      document.querySelectorAll('.habit-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          const habitId = parseInt(this.getAttribute('data-id'));
          const habit = habits.find(h => h.id === habitId);
          if (habit) {
            habit.completed = this.checked;
            saveHabits();
          }
        });
      });
    }

    function saveHabits() {
      localStorage.setItem('bloomHabits', JSON.stringify(habits));
    }
  }