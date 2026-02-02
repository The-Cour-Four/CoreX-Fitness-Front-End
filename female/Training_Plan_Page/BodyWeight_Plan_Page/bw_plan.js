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
        wName = "Lower Body & Booty";
        wDesc = "[3x20 Glute Bridges]  [3x15 Donkey Kicks (each side)]  [3x20 Air Squats]  \n\n [3x15 Side Lying Leg Lifts]  [3x12 Reverse Lunges]  [3x15 Curtsy Lunges] \n\n [3x30 sec Wall Sit]  [3x20 Calf Raises]  [3x15 Fire Hydrants]";
        videoURL = "https://www.youtube.com/embed/8aM_ASCBEWg";
    } else {
        type = "Upper Body";
        wName = "Upper Body Scuplt & Abs";
        wDesc = "[3x12 Push-ups (Knees optional)]  [3x15 Tricep Dips]  [3x30 sec Plank] \n\n [3x15 Superman]  [3x20 Arm Circles]  [3x15 Commando Planks] \n\n [3x20 Bicycle Crunches]  [3x15 Leg Raises] \n\n [3x15 Bear Crawls].";
        videoURL = "https://www.youtube.com/embed/wRDMFP3ihkE";
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