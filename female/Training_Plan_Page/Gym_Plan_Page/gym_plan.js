const dayList = document.getElementById('day-list');
const dayTitle = document.getElementById('day-title');
const workoutName = document.getElementById('workout-name');
const workoutDesc = document.getElementById('workout-desc');
const videoPlaceholder = document.querySelector('.video-placeholder');

const planData = [];

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
        wName = "Glute & Leg Sculpt";
        wDesc = "[4x12 Goblet Squats]  [3x15 Glute Bridges (Weighted)]  [4x12 Walking Lunges]  \n\n [3x15 Leg Press (High Foot Placement)]  [4x15 Cable Kickbacks]  [3x12 RDLs] \n\n [4x20 Calf Raises]  [3x15 Abductor Machine]  [4x15 Step Ups]";
        videoURL = "https://www.youtube.com/embed/8HuJbDeCvAM";
    } else {
        type = "Upper Body";
        wName = "Upper Body Tone & Core";
        wDesc = "[3x12 Incline Dumbbell Press]  [3x15 Seated Arnold Press]  [4x12 Lat Pulldowns] \n\n [3x15 Seated Row]  [3x15 Lateral Raises]  [3x12 Tricep Dips (Assisted)] \n\n [4x15 Bicep Curls]  [3x20 Russian Twists]  [3x15 Leg Raises] \n\n [3x1 min Plank].";
        videoURL = "https://www.youtube.com/embed/bHUGzjIwRKA";
    }

    planData.push({ day: i, type: type, workout: { name: wName, desc: wDesc }, videoURL: videoURL });
}

planData.forEach((data, index) => {
    const btn = document.createElement('button');
    btn.innerText = `Day ${data.day}: ${data.type}`;
    btn.classList.add('day-btn');
    btn.onclick = () => loadDay(index);
    dayList.appendChild(btn);
});

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

loadDay(0);