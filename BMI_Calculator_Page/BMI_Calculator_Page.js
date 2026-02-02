const bmiForm = document.getElementById("bmi-form");
const ageInput = document.getElementById("age");
const weightInput = document.getElementById("weight");
const heightInput = document.getElementById("height");
const bmiOutput = document.getElementById("bmi-output");

function calculateBMI(weight, height) {
    const heightM = height / 100;
    return (weight / (heightM * heightM)).toFixed(1);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return { category: "Underweight", class: "underweight", message: "Consider a nutrition plan to gain healthy weight." };
    } else if (bmi >= 18.5 && bmi < 25) {
        return { category: "Normal", class: "normal", message: "Great job! Maintain your healthy lifestyle." };
    } else if (bmi >= 25 && bmi < 30) {
        return { category: "Overweight", class: "overweight", message: "Consider our workout and diet programs." };
    } else {
        return { category: "Obese", class: "obese", message: "Consult a professional for a personalized plan." };
    }
}

function displayResult(bmi, categoryInfo) {
    const valueEl = bmiOutput.querySelector(".bmi-value");
    const categoryEl = bmiOutput.querySelector(".bmi-category");
    
    valueEl.style.transform = "scale(0)";
    valueEl.style.opacity = "0";
    
    setTimeout(() => {
        valueEl.textContent = bmi;
        valueEl.style.transform = "scale(1)";
        valueEl.style.opacity = "1";
        valueEl.style.transition = "all 0.3s ease";
        
        categoryEl.textContent = categoryInfo.category;
        categoryEl.className = "bmi-category " + categoryInfo.class;
        
        Toast.info(categoryInfo.message, 5000);
    }, 100);
    
    document.querySelectorAll(".scale-item").forEach(item => {
        item.style.transform = "scale(1)";
        item.style.boxShadow = "none";
    });
    
    const activeScale = document.querySelector(".scale-item." + categoryInfo.class);
    if (activeScale) {
        activeScale.style.transform = "scale(1.1)";
        activeScale.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
    }
}

function validateInput(input, min, max, name) {
    const value = parseFloat(input.value);
    
    if (!input.value || isNaN(value)) {
        Toast.error("Please enter a valid " + name);
        input.focus();
        return false;
    }
    
    if (value < min || value > max) {
        Toast.error(name + " must be between " + min + " and " + max);
        input.focus();
        return false;
    }
    
    return true;
}

bmiForm?.addEventListener("submit", function(e) {
    e.preventDefault();
    
    if (!validateInput(ageInput, 10, 120, "Age")) return;
    if (!validateInput(weightInput, 20, 300, "Weight")) return;
    if (!validateInput(heightInput, 100, 250, "Height")) return;
    
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);
    
    const bmi = calculateBMI(weight, height);
    const categoryInfo = getBMICategory(parseFloat(bmi));
    
    displayResult(bmi, categoryInfo);
    
    Toast.success("BMI calculated successfully!");
});

[ageInput, weightInput, heightInput].forEach(input => {
    input?.addEventListener("input", function() {
        this.style.borderColor = this.value ? "var(--primary)" : "";
    });
});