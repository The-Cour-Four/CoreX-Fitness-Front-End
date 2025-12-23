const dayList = document.getElementById('day-list');
const dayTitle = document.getElementById('day-title');
const workoutName = document.getElementById('workout-name');
const workoutDesc = document.getElementById('workout-desc');
const videoPlaceholder = document.querySelector('.video-placeholder');

const planData = [];

// Generate Training Data
for (let i = 1; i <= 30; i++) {
    let type = "";
    let wName = "";
    let wDesc = "";
    let videoURL = "";

    if (i % 4 === 0) {
        type = "Rest Day";
        wName = "Active Recovery";
        wDesc = "[Wide-legged forward fold]  [Lizard Pose to Half split] \n\n [Reclined figure 4 (Variation)]  [Pigeon] \n\n [Lizard Reachback]  [Closing Notes].";
        videoURL = "https://www.youtube.com/embed/290izU5mtvc";
    } else if (i % 2 === 0) {
        type = "Lower Body";
        wName = "Legs Destruction";
        wDesc = "[4x10 Barbell Sumo Squats]  [3x12 Seated Leg Extensions]  [4x10 Db Reverse Lunges]  \n\n [3x15 Leg Press]  [4x10 Lying Leg Curls]  [3x12 Barbell Hip Thrust] \n\n [4x15 Standing Calf Raises]  [3x12 Barbell Good Morning]  [4x15 Seated Calf Raises]";
        videoURL = "https://www.youtube.com/embed/8HuJbDeCvAM";
    } else {
        type = "Upper Body";
        wName = "Chest, Back & Arms";
        wDesc = "[4x10 Dumbbell Bench Press]  [3x12 Incline Dumbbell Bench Press]  [4x15 Incline Barbell Bench Press] \n\n [3x15 Seated Dumbbell Shoulder Press]  [4x10 Standing Barbell Shoulder Press]  [3x12 Dumbbell Lateral Raise] \n\n [4x15 Rope Straight Arm Pull Down]  [3x15 Bent Over Barbell Row]  [4x10 Cable Rope Pushdown] \n\n [3x12 Dumbbell Triceps Extension]  [4x15 Alternate Seated Hammer Curl]  [3x15 Cable Curl].";
        videoURL = "https://www.youtube.com/embed/bHUGzjIwRKA";

    }

    planData.push({ day: i, type: type, workout: { name: wName, desc: wDesc }, videoURL: videoURL });
}

// Create Buttons
planData.forEach((data, index) => {
    const btn = document.createElement('button');
    btn.innerText = `Day ${data.day}: ${data.type}`;
    btn.classList.add('day-btn');
    btn.onclick = () => loadDay(index);
    dayList.appendChild(btn);
});

// Load Content
function loadDay(index) {
    const data = planData[index];
    dayTitle.innerText = `Day ${data.day}: ${data.type}`;
    workoutName.innerText = data.workout.name;
    workoutDesc.innerText = data.workout.desc;

    videoPlaceholder.innerHTML = `<iframe width="100%" height="300" src="${data.videoURL}" title="Workout Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

    const allBtns = document.querySelectorAll('.day-btn');
    allBtns.forEach(b => b.classList.remove('active-day'));
    allBtns[index].classList.add('active-day');
}

// Start with Day 1
loadDay(0);
