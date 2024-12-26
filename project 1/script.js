document.getElementById('logWorkoutBtn').addEventListener('click', logWorkout);
document.getElementById('setGoalsBtn').addEventListener('click', setGoals);
document.addEventListener('DOMContentLoaded', loadWorkouts);

let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
let goals = JSON.parse(localStorage.getItem('goals')) || { workouts: 100, calories: 1000, duration: 120 };

function logWorkout() {
    const workoutType = document.getElementById('workoutType').value;
    const duration = document.getElementById('duration').value;
    const calories = document.getElementById('calories').value;
    const workoutDate = document.getElementById('workoutDate').value;

    if (workoutType && duration && calories && workoutDate) {
        const workout = { workoutType, duration, calories, workoutDate };
        workouts.push(workout);
        saveWorkouts();
        displayWorkouts();
        updateSummary();
        clearInputs();
        alert('Workout logged successfully!');
    } else {
        alert('Please fill in all fields.');
    }
}

function setGoals() {
    const goalWorkouts = document.getElementById('goalWorkouts').value;
    const goalCalories = document.getElementById('goalCalories').value;
    const goalDuration = document.getElementById('goalDuration').value;

    goals = {
        workouts: goalWorkouts || 100,
        calories: goalCalories || 1000,
        duration: goalDuration || 120
    };

    localStorage.setItem('goals', JSON.stringify(goals));
    updateSummary();
    alert('Goals set successfully!');
}

function saveWorkouts() {
    localStorage.setItem('workouts', JSON.stringify(workouts));
}

function loadWorkouts() {
    displayWorkouts();
    updateSummary();
}

function displayWorkouts() {
    const workoutList = document.getElementById('workoutList');
    workoutList.innerHTML = '';
    workouts.forEach((workout, index) => {
        workoutList.innerHTML += `
            <li>
                ${workout.workoutType} - ${workout.duration} min - ${workout.calories} cal - ${new Date(workout.workoutDate).toLocaleDateString()}
                <button class="edit-btn" onclick="editWorkout(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteWorkout(${index})">Delete</button>
            </li>`;
    });
}

function editWorkout(index) {
    const workout = workouts[index];
    document.getElementById('workoutType').value = workout.workoutType;
    document.getElementById('duration').value = workout.duration;
    document.getElementById('calories').value = workout.calories;
    document.getElementById('workoutDate').value = workout.workoutDate; // Set the date
    deleteWorkout(index); // Remove the workout to avoid duplication
}

function deleteWorkout(index) {
    workouts.splice(index, 1);
    saveWorkouts();
    displayWorkouts();
    updateSummary();
    alert('Workout deleted successfully!');
}

function updateSummary() {
    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, workout) => sum + parseInt(workout.calories), 0);
    const averageDuration = totalWorkouts > 0 ? (workouts.reduce((sum, workout) => sum + parseInt(workout.duration), 0) / totalWorkouts).toFixed(2) : 0;

    document.getElementById('totalWorkouts').innerText = `Total Workouts: ${totalWorkouts}`;
    document.getElementById('totalCalories').innerText = `Total Calories: ${totalCalories}`;
    document.getElementById('averageDuration').innerText = `Average Duration: ${averageDuration} min`;

    // Update progress bars based on goals
    updateProgressBars(totalWorkouts, totalCalories, averageDuration);
}

function updateProgressBars(totalWorkouts, totalCalories, averageDuration) {
    const workoutProgress = Math.min((totalWorkouts / goals.workouts) * 100, 100);
    const caloriesProgress = Math.min((totalCalories / goals.calories) * 100, 100);
    const durationProgress = Math.min((averageDuration / goals.duration) * 100, 100);

    document.getElementById('workoutProgress').style.width = `${workoutProgress}%`;
    document.getElementById('workoutProgress').innerText = `${totalWorkouts} / ${goals.workouts}`;

    document.getElementById('caloriesProgress').style.width = `${caloriesProgress}%`;
    document.getElementById('caloriesProgress').innerText = `${totalCalories} / ${goals.calories}`;

    document.getElementById('durationProgress').style.width = `${durationProgress}%`;
    document.getElementById('durationProgress').innerText = `${averageDuration} / ${goals.duration} min`;
}

function clearInputs() {
    document.getElementById('workoutType').value = '';
    document.getElementById('duration').value = '';
    document.getElementById('calories').value = '';
    document.getElementById('workoutDate').value = ''; // Clear the date input
}
