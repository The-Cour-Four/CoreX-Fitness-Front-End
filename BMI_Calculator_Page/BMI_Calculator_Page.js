function calculator(event) {

    event.preventDefault(); // Prevent form submission from reloading page
    var age = document.getElementById("age").value;
    var weight = document.getElementById("weight").value;
    var height = document.getElementById("height").value;

    if (age === "" || weight === "" || height === "") {
        alert("Please fill in all fields.");
        return;
    }

    if (isNaN(age) || isNaN(weight) || isNaN(height)) {
        alert("Please enter valid numbers for age, weight, and height.");
        return;
    }

    age = parseInt(age);
    weight = parseFloat(weight);
    height = parseFloat(height);
    var heightM = height / 100;
    var bmi = (weight / (heightM * heightM)).toFixed(2);

    var output = document.getElementById("bmi-output");

    if (bmi < 18.5) {
        output.innerText = bmi + "\n\nYou are UnderWeight";
        output.style.color = "#0a5604ff";
    } 

    else if (bmi >= 18.5 && bmi < 24.9) {
        output.innerText = bmi + "\n\nYou are in the Healthy Range";
        output.style.color = "#1c8113ff";
    } 

    else if (bmi >= 25 && bmi < 29.9) {
        output.innerText = bmi + "\n\nYou are OverWeight";
        output.style.color = "#4fd643ff";
    } 

    else if (bmi >= 30 && bmi < 34.9) {
        output.innerText = bmi + "\n\nYou are in Obesity Class I";
        output.style.color = "#d3349cff";
    }

    else if (bmi >= 35 && bmi < 39.9) {
        output.innerText = bmi + "\n\nYou are in Obesity Class II";
        output.style.color = "#8b248dff";
    }

    else if (bmi >= 40) {
        output.innerText = bmi + "\n\nYou are in Obesity Class III";
        output.style.color = "#730419ff";
    } 

    
}
