import {addToDB} from "./db.js";

let left = document.getElementById("intro") as HTMLElement;
left.innerHTML = `
Matma to jest ta dziedzina,<br>
której starość się nie ima,<br>
a że zawsze jest pomocna,<br>
nasza wiedza z niej ma być mocna.<br>
<img src="glowny.jpg" alt="Einstein przy tablicy(animowane)">`;

const nextQuestionButton = document.getElementById("nextQuestion") as HTMLInputElement;
const previousQuestionButton = document.getElementById("previousQuestion") as HTMLInputElement;
const cancelButton = document.getElementById("cancel") as HTMLInputElement;
const stopButton = document.getElementById("stop") as HTMLInputElement;
const saveResultButton = document.getElementById("saveResult") as HTMLInputElement;
const saveAllButton = document.getElementById("saveAll") as HTMLInputElement;
const radioButtons: NodeListOf<Element> = document.querySelectorAll("input[type=radio]");
let doneQuizFlag: boolean = false;
let points: number = 0;

nextQuestionButton.addEventListener("click", nextQuestion);
previousQuestionButton.addEventListener("click", previousQuestion);
cancelButton.addEventListener("click", cancelQuiz);
stopButton.addEventListener("click", sendQuiz);
saveResultButton.addEventListener("click", saveResult);
saveAllButton.addEventListener("click", saveStatistics);
for(let i = 0; i < 4; i++ ){
    radioButtons[i].addEventListener("click", saveAnswer);
}

window.onload = changeContent;
initializePage();

const timer = document.getElementById("timer") as HTMLSpanElement;
let id: number = setInterval(changeTimer, 1000);
if(getSV("time") != 0)
    changeTimer();

function getSV(name: string): number{
    return parseInt(sessionStorage.getItem(name));
}

function changeSV(name: string, add: number): void{
    let nr: number = getSV(name);
    sessionStorage.setItem(name, (nr+add).toString());
}

function nextQuestion(): void{
    saveTime();
    changeSV("questionNumber", 1);
    if(getSV("questionNumber") >= quiz["questions"].length-1){
        nextQuestionButton.disabled = true;
    }

    previousQuestionButton.disabled = false;
    changeContent();
}

function previousQuestion(): void{
    saveTime();
    changeSV("questionNumber", -1);
    if(getSV("questionNumber") < 1){
        previousQuestionButton.disabled = true;
    }

    nextQuestionButton.disabled = false;
    changeContent();
}

function saveAnswer(): void {
    const quizQuestions: Object[] = quiz["questions"];
    for(let i = 0; i < 4; i++){
        const answer = document.getElementById("answer" + (i).toString()) as HTMLInputElement;
        if(answer.checked){
            let currentAns: string = sessionStorage.getItem("ans" + getSV("questionNumber").toString());
            if(currentAns == null)
                changeSV("ansCounter", 1);
            if(getSV("ansCounter") == quizQuestions.length)
                stopButton.disabled = false;
            sessionStorage.setItem("ans" + getSV("questionNumber").toString(), answer.value);
        }
    }
}

function saveTime(): void {
    let questionTime: string = sessionStorage.getItem("time" + getSV("questionNumber").toString());
    if(questionTime == null)
        questionTime = "0";
    const newTime: string = (parseInt(questionTime, 0) + (getSV("time") - getSV("lastTime"))).toString();
    changeSV("lastTime", getSV("time") - getSV("lastTime"));
    sessionStorage.setItem("time" + getSV("questionNumber").toString(), newTime);
}

function changeContent(): void {
    const questionNr = document.getElementById("questionNr") as HTMLSpanElement;
    const penalty = document.getElementById("penalty") as HTMLSpanElement;
    const question = document.getElementById("question") as HTMLElement;
    const quizQuestions: any = quiz["questions"];
    const ansi: string = sessionStorage.getItem("ans" + getSV("questionNumber").toString());

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

function colorRightAnswer(which: string): void {
    const all: NodeListOf<HTMLLabelElement> = document.querySelectorAll("label");
    for(let i = 0; i < all.length; i++){
        all[i].style.backgroundColor = "rgb(211, 186, 149)";
        if(i == parseInt(which))
            all[i].style.backgroundColor = "green";
    }
}

function changeTimer(): void {
    changeSV("time", 1);
    let timeString: string = "";
    const minutes: number = Math.floor(getSV("time")/60);
    const seconds: number = getSV("time") % 60;
    if(minutes < 10)
        timeString += "0";
    timeString += minutes.toString() + ":";
    if(seconds < 10)
        timeString += "0";
    timeString += seconds.toString();

    timer.textContent = timeString;
}

function cancelQuiz(): void {
    sessionStorage.clear();
    location.href = "quiz.html";
}

function getResult(): number[] {
    let penalty: number = points - getSV("time");
    let data: number[] = [points, penalty];
    return data;
}
function saveResult(): void{
    const data: number[] = getResult();
    addToDB(data[0], data[1], []);
}

function saveStatistics(): void{
    let times: number[] = [];
    for(let i = 0; i < quiz["questions"].length; i++){
        let time = parseInt(sessionStorage.getItem("time" + i.toString()));
        times.push(time);
    }  
    let data: number[] = getResult();
    addToDB(data[0], data[1], times);
}

function sendQuiz(): void {
    saveTime();
    clearInterval(id);
    doneQuizFlag = true;
    for(let i = 0; i < quiz["questions"].length; i++){
        let ans: string = sessionStorage.getItem("ans" + i.toString());
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

function initializePage(): void{
    if(sessionStorage.getItem("questionNumber") == null)
        sessionStorage.setItem("questionNumber", "0");

    if(sessionStorage.getItem("lastTime") == null)
        sessionStorage.setItem("lastTime", "0");

    if(sessionStorage.getItem("time") == null)
        sessionStorage.setItem("time", "0");

    if(sessionStorage.getItem("ansCounter") == null)
        sessionStorage.setItem("ansCounter", "0");

    changeContent();

    if(getSV("questionNumber") == 0)
        previousQuestionButton.disabled = true;
    if(getSV("ansCounter") != quiz["questions"].length)
        stopButton.disabled = true;
    else
        nextQuestionButton.disabled = true;
}