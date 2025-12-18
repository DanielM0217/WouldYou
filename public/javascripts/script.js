// Front end JavaScript code goes here
async function GetQuestions() {
    const response = await fetch('/api/questions'); 
    const questions = await response.json();
    return questions
}


//Open new question button which hides default popup/screen
const btnQuestion = document.getElementById("addQuestionButton");
const popupQuestion = document.getElementById("Questions");
const popupDefault = document.getElementById("Default");
const backQBtn = document.getElementById("qBack")

function hideDefault(element) {
  element.style.display = "none";
}

function showDefault(element) {
    element.style.display = "flex";
}

btnQuestion.addEventListener("click", () => {
  popupQuestion.classList.toggle("hidden");
    if (popupDefault.classList === "none") {
        showDefault(popupDefault);
        hideDefault(popupQuestion);
    } else {
        hideDefault(popupDefault);
        showDefault(popupQuestion);
    }
});

backQBtn.addEventListener("click", () =>{
    hideDefault(popupQuestion);
    showDefault(popupDefault);
})

//open answer a random question button hide default
const btnAnswer = document.getElementById("answerButton");
const popupAnswer = document.getElementById("Answer");
const backABtn = document.getElementById("aBack");

btnAnswer.addEventListener("click", () => {
  popupAnswer.classList.toggle("hidden");
    if (popupDefault.classList === "none") {
        showDefault(popupDefault);
        hideDefault(popupAnswer);
    } else {
        hideDefault(popupDefault);
        showDefault(popupAnswer)
    }
  displayQuestion();
});

backABtn.addEventListener("click", () => {
  hideDefault(popupAnswer)
  showDefault(popupDefault);
});

//open stats hide default
const btnStats = document.getElementById("statButton");
const popupStats = document.getElementById("Stat");
const backSBtn = document.getElementById("sBack");

btnStats.addEventListener("click", () => {
  popupStats.classList.toggle("hidden");
      if (popupDefault.classList === "none") {
        showDefault(popupDefault);
        hideDefault(popupStats);
    } else {
        hideDefault(popupDefault);
        showDefault(popupStats);
    }
});

backSBtn.addEventListener("click", () => {
    hideDefault(popupStats);
    showDefault(popupDefault);
});

const gridStat = document.getElementById("grid-container");

// checks for yescount compared to total count to figure out percentage of yes
async function yesFilter() {
    //pulls intital list
    const questionList = await GetQuestions();
    const percentageChart = questionList.map(item => {
        const totalCount = item.yesCount+item.noCount
        const percentage = ((item.yesCount/totalCount)*100).toFixed(1)

        return {
            item,
            percentage
        };
    });
        percentageChart.sort((a, b) => b.percentage - a.percentage);
        console.log(percentageChart)

        gridStat.innerHTML = ""

        percentageChart.forEach(item => {
        console.log(item.item.Question)
        const gridQ = document.createElement("div");
        gridQ.classList.add("grid-item");
        gridQ.innerText = item.item.Question;
        gridStat.appendChild(gridQ);

        const gridP = document.createElement("div");
        gridP.classList.add("grid-item");
        if (item.item.yesCount + item.item.noCount === 0) {
            gridP.innerText = "N/A"
        } else {
        gridP.innerText = item.percentage + '%';
        }
        gridStat.appendChild(gridP);
    });
};

async function noFilter() {
    //pulls intital list
    const questionList = await GetQuestions();
    console.log(questionList);
    //maps percentage values to the array
    const percentageChart = questionList.map(item => {
        const totalCount = item.yesCount+item.noCount
        const percentage = ((item.noCount/totalCount)*100).toFixed(1)
        return {
            item,
            percentage
        };
    });
    console.log(percentageChart)
    gridStat.innerHTML = ""
    //sorts array by lowest percents
    percentageChart.sort((a, b) => b.percentage - a.percentage);
    percentageChart.forEach(item => {
        console.log(item.item.Question)
        const gridQ = document.createElement("div");
        gridQ.classList.add("grid-item");
        gridQ.innerText = item.item.Question;
        gridStat.appendChild(gridQ);

        const gridP = document.createElement("div");
        gridP.classList.add("grid-item");
        if (item.item.yesCount + item.item.noCount === 0) {
            gridP.innerText = "N/A"
        } else {
        gridP.innerText = item.percentage + '%';
        }
        gridStat.appendChild(gridP);
    });
};

//adds document to mongoDB
document.getElementById('questionForm').addEventListener('submit', async (e) =>{
    e.preventDefault();

    const newQ = document.getElementById('newQuestion').value;
    console.log(newQ)

    const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: newQ })
    })

    const disQ = document.getElementById("newQuestion");
    disQ.value = "";
    const data = await res.json();
    console.log('Saved:', data);
});

const select = document.getElementById("filterChoice");

select.addEventListener("change", () => {
  if (select.value === "Agreement") {
    yesFilter();
  }

  if (select.value === "Disagreement") {
    noFilter();
  }
});

//used to create an rng based questioning
function getRandomObject(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

let currentQuestion = null;

//used to display a random question needs to be pushed to incorporate yes and no tally counts
async function displayQuestion() {
    const questionList = await GetQuestions();
    currentQuestion = getRandomObject(questionList);
    const displayEl = document.querySelector('.questionBox')
    displayEl.innerText = currentQuestion.Question
}
//function to increase yes count on questions
const statDis = document.getElementById("statDisplay")

async function yesUpdate () {
    //posts to backend
    const res = await fetch(`/api/questions/${currentQuestion._id}/yes`, {
        method: "POST"
    });
    //logs current yes.Count
    const updated = await res.json();
    console.log("Yes count:", updated.yesCount);
    const totalCount = currentQuestion.yesCount+currentQuestion.noCount
    const percentage = ((currentQuestion.yesCount/totalCount)*100).toFixed(1)
    const displayARate = document.createElement("p");
    statDis.style.display = "flex";
    if (totalCount === 0) {
    displayARate.innerText = "You are the first to vote on this question!";
    } else {
    displayARate.innerText = percentage + '% of users agreed with your choice';
    }
    statDis.appendChild(displayARate);
    
}

//function to increase no count on questions
async function noUpdate () {
    //posts to backend
    const res = await fetch(`/api/questions/${currentQuestion._id}/no`, {
        method: "POST"
    });
    //logs current yes.Count
    const updated = await res.json();
    console.log("No count:", updated.noCount);
    const totalCount = currentQuestion.yesCount+currentQuestion.noCount
    const percentage = ((currentQuestion.noCount/totalCount)*100).toFixed(1)
    const displayARate = document.createElement("p");
    statDis.style.display = "flex";
    if (totalCount === 0) {
    displayARate.innerText = "You are the first to vote on this question!";
    } else {
    displayARate.innerText = percentage + '% of users agreed with your choice';
    }
    statDis.appendChild(displayARate);
    
}

    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const nextBtn = document.getElementById("nextQ")

    yesBtn.addEventListener("click", async () => {
        
        yesBtn.disabled = true;
        noBtn.disabled = true;
        await yesUpdate();    
        nextBtn.classList.toggle("hidden");    
    });

   noBtn.addEventListener("click", async () => {
        yesBtn.disabled = true;
        noBtn.disabled = true;
        await noUpdate();     
        nextBtn.classList.toggle("hidden");   
    });

    nextBtn.addEventListener("click", async () => {
        yesBtn.disabled = false;
        noBtn.disabled = false;
        nextBtn.classList.toggle("hidden");
        displayQuestion();
        statDis.innerText = ""
        statDis.style.display = "none"  
    })