let left = document.getElementById("intro") as HTMLElement;
left.innerHTML = `
Matma to jest ta dziedzina,<br>
której starość się nie ima,<br>
a że zawsze jest pomocna,<br>
nasza wiedza z niej ma być mocna.<br>
<img src="glowny.jpg" alt="Einstein przy tablicy(animowane)">`;

const nextQuestionButton = document.getElementById("nextQuestion") as HTMLInputElement;
nextQuestionButton.addEventListener("click", nextQuestion);
const previousQuestionButton = document.getElementById("previousQuestion") as HTMLInputElement;
previousQuestionButton.addEventListener("click", previousQuestion);
const cancelButton = document.getElementById("cancel") as HTMLInputElement;
cancelButton.addEventListener("click", cancelQuiz);
const stopButton = document.getElementById("stop") as HTMLInputElement;

stopButton.addEventListener("click", sendQuiz);
window.onload = changeContent;

const saveResultButton = document.getElementById("saveResult") as HTMLInputElement;
const saveAllButton = document.getElementById("saveAll") as HTMLInputElement;
saveResultButton.addEventListener("click", saveResult);
saveAllButton.addEventListener("click", saveStatistics);

let doneQuizFlag = false;

const radioButtons = document.querySelectorAll("input[type=radio]");
for(let i = 0; i < 4; i++ ){
    radioButtons[i].addEventListener("click", saveAnswer);
}

if(getID() == null){
    let tryNr = localStorage.getItem("number");
    localStorage.removeItem("number");
    if(tryNr == null)
        tryNr = "0";
    sessionStorage.setItem("uniqueID", tryNr);
    localStorage.setItem("number", (parseInt(tryNr)+1).toString());
}


if(sessionStorage.getItem("questionNumber") == null)
    sessionStorage.setItem("questionNumber", "0");

if(sessionStorage.getItem("lastTime") == null)
    sessionStorage.setItem("lastTime", "0");

if(sessionStorage.getItem("time") == null)
    sessionStorage.setItem("time", "0");

if(sessionStorage.getItem("ansCounter") == null)
    sessionStorage.setItem("ansCounter", "0");

function getID(){
    return sessionStorage.getItem("uniqueID");
}

function getSV(name: string){
    return parseInt(sessionStorage.getItem(name));
}

function changeSV(name: string, add: number){
    let nr = getSV(name);
    sessionStorage.setItem(name, (nr+add).toString());
}

function nextQuestion(){
    saveTime();
    changeSV("questionNumber", 1);
    if(getSV("questionNumber") >= quiz["questions"].length-1){
        nextQuestionButton.disabled = true;
    }

    previousQuestionButton.disabled = false;
    changeContent();
}

changeContent();

if(getSV("questionNumber") == 0)
    previousQuestionButton.disabled = true;
if(getSV("ansCounter") != quiz["questions"].length)
    stopButton.disabled = true;
else
    nextQuestionButton.disabled = true;

function previousQuestion(){
    saveTime();
    changeSV("questionNumber", -1);
    if(getSV("questionNumber") < 1){
        previousQuestionButton.disabled = true;
    }

    nextQuestionButton.disabled = false;
    changeContent();
}

function saveAnswer(){
    const quizQuestions = quiz["questions"];
    for(let i = 0; i < 4; i++){
        const answer = document.getElementById("answer" + (i).toString()) as HTMLInputElement;
        if(answer.checked){
            let currentAns = sessionStorage.getItem(getID() + "ans" + getSV("questionNumber").toString());
            if(currentAns == null)
                changeSV("ansCounter", 1);
            if(getSV("ansCounter") == quizQuestions.length)
                stopButton.disabled = false;
            sessionStorage.setItem(getID() + "ans" + getSV("questionNumber").toString(), answer.value);
        }
    }
}

function saveTime(){
    let questionTime = sessionStorage.getItem(getID() + "time" + getSV("questionNumber").toString());
    if(questionTime == null)
        questionTime = "0";
    const newTime = (parseInt(questionTime, 0) + (getSV("time") - getSV("lastTime"))).toString();
    changeSV("lastTime", getSV("time") - getSV("lastTime"));
    sessionStorage.setItem(getID() + "time" + getSV("questionNumber").toString(), newTime);
}

function changeContent(){
    const questionNr = document.getElementById("questionNr") as HTMLSpanElement;
    const penalty = document.getElementById("penalty") as HTMLSpanElement;
    const question = document.getElementById("question") as HTMLElement;
    const quizQuestions = quiz["questions"];
    const ansi = sessionStorage.getItem(getID() + "ans" + getSV("questionNumber").toString());
    penalty.textContent = quizQuestions[getSV("questionNumber")]["penalty"];
    questionNr.textContent = (getSV("questionNumber") + 1).toString();
    question.textContent = quizQuestions[getSV("questionNumber")].question;
    for(let i = 0; i < 4; i++){
        const answer = document.getElementById("answer" + (i).toString()) as HTMLInputElement;
        answer.checked = false;
        if(ansi == (i.toString()))
            answer.checked = true;
        const label = answer.labels[0].getElementsByClassName("answerWrapper")[0] as HTMLElement;
        label.textContent = quizQuestions[getSV("questionNumber")]["answers"][i];
    }

    if(doneQuizFlag){
        colorRightAnswer(quiz["questions"][getSV("questionNumber")]["correctAnswer"]);
    }

}

function colorRightAnswer(which: string){
    const all = document.querySelectorAll("label");
    for(let i = 0; i < all.length; i++){
        all[i].style.backgroundColor = "rgb(211, 186, 149)";
        if(i == parseInt(which))
            all[i].style.backgroundColor = "green";
    }
}

const timer = document.getElementById("timer") as HTMLSpanElement;
let id = setInterval(changeTimer, 1000);
if(getSV("time") != 0)
    changeTimer();

function changeTimer(){
    changeSV("time", 1);
    let timeString = "";
    const minutes = Math.floor(getSV("time")/60);
    const seconds = getSV("time") % 60;
    if(minutes < 10)
        timeString += "0";
    timeString += minutes.toString() + ":";
    if(seconds < 10)
        timeString += "0";
    timeString += seconds.toString();

    timer.textContent = timeString;
}

function cancelQuiz(){
    sessionStorage.clear();
    location.href = "quiz.html";
}

function saveResult(){
    localStorage.setItem(getID() + "penalty", (points - getSV("time")).toString());
    localStorage.setItem(getID() + "result", points.toString());
    localStorage.setItem(getID().toString() + "done", "true");
    sessionStorage.clear();
    location.href = "quiz.html";
}

function saveStatistics(){
    for(let i = 0; i < quiz["questions"].length; i++){
        let time = sessionStorage.getItem(getID() + "time" + i.toString());
        localStorage.setItem(getID() + "time" + i.toString(), time);
    }  
    saveResult();
}

let points = 0;

function sendQuiz(){
    saveTime();
    clearInterval(id);
    doneQuizFlag = true;
    for(let i = 0; i < quiz["questions"].length; i++){
        let ans = sessionStorage.getItem(getID() + "ans" + i.toString());
        if(ans !=  quiz["questions"][i]["correctAnswer"])
            points += parseInt(quiz["questions"][i]["penalty"]);
        
    }

    colorRightAnswer(quiz["questions"][getSV("questionNumber")]["correctAnswer"]);
    points += getSV("time");
    const result = document.getElementById("result") as HTMLParagraphElement;
    if(points < 10)
        result.textContent = "Perfekcyjnie! Twój wynik to: " + points.toString();
    else
        result.textContent = "Twój wynik to: " + points.toString();
    stopButton.disabled = true;
    saveResultButton.style.display = "initial";
    saveAllButton.style.display = "initial";

}
