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
        wDesc = "[4x10 Barbell Air Squat]  [3x12 Jump Squat]  [4x10 Alternating Lunges]  \n\n [3x15 Jumping Lunges]  [4x10 Side Lunges]  [3x12 Skaters] \n\n [4x15 Wall Sit]  [3x12 Glute Bridge]  [4x15 Standing Donkey Kicks]";
        videoURL = "https://www.youtube.com/embed/8aM_ASCBEWg";
    } else {
        type = "Upper Body";
        wName = "Chest, Back, Abs & Arms";
        wDesc = "[4x10 EXTENDED PLANK UPS KEEP CORE ENGAGED]  [3x12 ARMY PLANK CRAWLS]  [4x15 TRICEP KICKBACKS] \n\n [3x15 SHOULDER ROTATIONS]  [4x10 REACH EXTENSIONS]  [3x12 REAR DELT RAISES ROUND FORWARD] \n\n [4x15 NEGATIVE PUSH-UPS]  [3x15 CHEST SQUEEZE HOLD THE SQUEEZE] \n\n [3x12 BACK EXTENSIONS]  [4x15 PIKE PRESS UPS]  [3x15 PUSH UP MOUNTAINERS].";
        videoURL = "https://www.youtube.com/embed/wRDMFP3ihkE";

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