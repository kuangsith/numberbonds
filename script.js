document.getElementById("startGameButton").addEventListener("click", startGame);
document.getElementById("newQuestionButton").addEventListener("click", showQuestion);

let correctAnswer;
let problemType; // "addition" or "subtraction"

function startGame() {
    document.getElementById("startGameSection").classList.add("hidden");
    showQuestion();
}

function showQuestion() {
    document.getElementById("resultSection").classList.add("hidden");
    document.getElementById("questionSection").classList.remove("hidden");
    document.getElementById("choicesSection").classList.remove("hidden");

    // Remove highlights from all circles
    document.querySelectorAll("#numberBondsSvg .highlight").forEach(elem => {
        elem.classList.remove("highlight");
    });



    let z = Math.floor(Math.random() * 18) + 2;
    let x = Math.floor(Math.random() * (z - 1)) + 1;
    let y = z - x;

    // 1. Random Bonds Connection
    const allLines = ['line1', 'line2', 'line3'];
    let randomIndex = Math.floor(Math.random() * 3);
    let chosenLines = [allLines[randomIndex], allLines[(randomIndex + 1) % 3]];
    let hiddenLine = allLines[(randomIndex + 2) % 3];
    document.getElementById(chosenLines[0]).style.display = '';
    document.getElementById(chosenLines[1]).style.display = '';
    document.getElementById(hiddenLine).style.display = 'none';

    // 2. Random Question Type
    let problemType = Math.random() > 0.5 ? "addition" : "subtraction";

    // 3. Random Position of the Result
    let positions = ['text1', 'text2', 'text3'];
    if (hiddenLine === 'line1') {
        // z must be in text3
        [positions[0], positions[2]] = [positions[2], positions[0]];
    } else if (hiddenLine === 'line2') {
        // z must be in text2
        [positions[1], positions[0]] = [positions[0], positions[1]];
    } 
    // For hiddenLine 'line3', z must be in text1 which is already set
    
    // Randomly shuffle x and y
    if (Math.random() > 0.5) {
        [positions[1], positions[2]] = [positions[2], positions[1]];
    }

    if (problemType === "addition") {
        document.getElementById(positions[0]).textContent = "?";
        document.getElementById(positions[1]).textContent = x;
        document.getElementById(positions[2]).textContent = y;
    } else {
        document.getElementById(positions[0]).textContent = z;
        document.getElementById(positions[1]).textContent = x;
        document.getElementById(positions[2]).textContent = "?";
    }

    correctAnswer = problemType === "addition" ? z : y;

    const choices = generateChoices(correctAnswer);
    const choiceButtons = document.querySelectorAll(".choiceButton");  // I noticed you had ".choiceBtn" which might be a typo.
    choiceButtons.forEach((btn, index) => {
        btn.textContent = choices[index];
        btn.addEventListener("click", checkAnswer);
    });
}


function generateChoices(correct) {
    const choices = new Set();

    while (choices.size < 3) {
        let randomChoice = Math.floor(Math.random() * 18) + 2;
        if (randomChoice !== correct) {
            choices.add(randomChoice);
        }
    }

    const choicesArray = Array.from(choices);
    const correctPos = Math.floor(Math.random() * 4);

    choicesArray.splice(correctPos, 0, correct);
    
    // Sort the choices
    return choicesArray.sort((a, b) => a - b);
}

function checkAnswer(event) {
    const playerChoice = parseInt(event.target.textContent);
    document.getElementById("questionSection").classList.add("hidden");
    document.getElementById("choicesSection").classList.add("hidden");
    document.getElementById("resultSection").classList.remove("hidden");

    const resultText = document.getElementById("resultText");
    const playerChoiceElem = document.getElementById("playerChoice");

    // Update player's answer
    playerChoiceElem.textContent = playerChoice;

    if (playerChoice === correctAnswer) {
        resultText.textContent = "Correct";
        resultText.style.color = "green";
    } else {
        resultText.textContent = "Incorrect";
        resultText.style.color = "red";
    }

    // Update the numberBondsSvg with the current question state
    const questionSvg = document.querySelector("#questionSvg").innerHTML;
    document.querySelector("#numberBondsSvg").innerHTML = questionSvg;


    // Find the text element with '?'
    const resultQuestionMark = Array.from(document.querySelectorAll("#numberBondsSvg text")).find(textElem => textElem.textContent === "?");

    
    let circleId = resultQuestionMark.id.replace("text", "circle");
    const circleElem = document.querySelector("#numberBondsSvg #" + circleId);
    circleElem.classList.add("highlight");
    

    // Replace '?' with the correct answer
    resultQuestionMark.textContent = correctAnswer;


        
    
}

