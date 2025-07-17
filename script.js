document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const taskList = document.getElementById('taskList');
    const notesTextArea = document.getElementById('notes');
    const saveNotesBtn = document.getElementById('saveNotes');
    const saveMessage = document.getElementById('saveMessage');

    // Your predefined daily tasks
    const dailyTasks = [
        "6:30 am: Levantarme y bañarme",
        "7:00 am: Alistar a mi hija para el colegio",
        "7:50 am: Ir al colegio con mi hija",
        "8:30 am: Devocional",
        "9:00 am - 12:30 pm: Diseñar (piezas de media o trabajos freelancer)",
        "12:30 am - 1:30 pm: almorzar",
         "1:30 pm: Diseñar de nuevo",
        "3:45 pm: Ir a recoger a mi hija al jardín",
        "4:30 pm: Bañar a mi hija",
        "5:00 pm: Hacer aseo en casa y adelantar algo de almuerzo para el siguiente día",
        "7:00 pm: Darle de cenar a mi hija",
        "8:00 pm: Cenar y compartir con mi esposa",
        "9:00 pm - 10:30 pm: Ver ideas y creatividad en la habitacion"
    ];

    // Function to load tasks and their status from local storage
    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem('dailyPlannerTasks'));
        if (storedTasks) {
            // Check if the stored tasks match the current dailyTasks list
            // This handles cases where the predefined tasks might change in the future
            if (storedTasks.length === dailyTasks.length && storedTasks.every((task, i) => task.text === dailyTasks[i])) {
                return storedTasks;
            } else {
                // If tasks don't match (e.g., new tasks added/removed), re-initialize
                console.log("Predefined tasks changed. Re-initializing task list.");
                return dailyTasks.map(task => ({ text: task, completed: false }));
            }
        } else {
            // If no tasks are stored, initialize with predefined tasks and 'false' status
            return dailyTasks.map(task => ({ text: task, completed: false }));
        }
    }

    // Global variable to store task states
    let tasks = loadTasks();

    // Function to render (display) tasks in the interface
    function renderTasks() {
        taskList.innerHTML = ''; // Clear the current list before rendering
        tasks.forEach((task, index) => {
            const listItem = document.createElement('li'); // Create a list item (li) element
            // Assign 'completed' class if the task is marked as completed
            listItem.className = task.completed ? 'completed' : '';
            listItem.innerHTML = `
                <input type="checkbox" id="task-${index}" ${task.completed ? 'checked' : ''}>
                <label for="task-${index}"><span>${task.text}</span></label>
            `;
            taskList.appendChild(listItem); // Add the list item to the task list

            // Add an event listener to the checkbox to detect changes
            const checkbox = listItem.querySelector(`#task-${index}`);
            checkbox.addEventListener('change', () => {
                tasks[index].completed = checkbox.checked; // Update the task status
                // Save the updated status of all tasks to localStorage
                localStorage.setItem('dailyPlannerTasks', JSON.stringify(tasks));
                renderTasks(); // Re-render the list to apply 'completed' styles
            });
        });
    }

    // Function to load notes from local storage
    function loadNotes() {
        const storedNotes = localStorage.getItem('dailyPlannerNotes');
        if (storedNotes) {
            notesTextArea.value = storedNotes; // Assign the saved value to the textarea
        }
    }

    // Function to save notes to local storage and display a message
    function saveNotes() {
        localStorage.setItem('dailyPlannerNotes', notesTextArea.value); // Save the textarea content
        
        // Show success message
        saveMessage.textContent = 'Notas guardadas correctamente.';
        saveMessage.className = 'save-message success show'; // Add classes for styling and visibility

        // Hide the message after 3 seconds
        setTimeout(() => {
            saveMessage.className = 'save-message'; // Remove classes to hide
        }, 3000);
    }

    // Assign event listener to the save notes button
    saveNotesBtn.addEventListener('click', saveNotes);

    // Initialize the application when the page loads
    renderTasks(); // Render tasks for the first time
    loadNotes();   // Load saved notes
});
