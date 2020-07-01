let quiz: any = null;
let prefix: string = null;
const url = window.location.href;
const endp = url + "/content";
const beginQuiz = url + "/begin";
let secure: string = null;
fetch("/token")
    .then(response => response.json())
    .then(data => {
        secure = data.token;
    })
    .then(() => {
        fetch(beginQuiz, {method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({_csrf: secure})})       
    .then( () =>{
        fetch(endp)
        .then(response => response.json())
        .then(data => {
            quiz = JSON.parse(data.quiz);
            prefix = data.login + data.id;
        })
        .then( () => {
            let left = document.getElementById("intro") as HTMLElement;
            left.innerHTML = `
            Matma to jest ta dziedzina,<br>
            której starość się nie ima,<br>
            a że zawsze jest pomocna,<br>
            nasza wiedza z niej ma być mocna.<br>
            <img src="/jpg/glowny.jpg" alt="Einstein przy tablicy(animowane)">`;

            const nextQuestionButton = document.getElementById("nextQuestion") as HTMLInputElement;
            const previousQuestionButton = document.getElementById("previousQuestion") as HTMLInputElement;
            const cancelButton = document.getElementById("cancel") as HTMLInputElement;
            const stopButton = document.getElementById("stop") as HTMLInputElement;
            const saveAllButton = document.getElementById("saveAll") as HTMLInputElement;
            const radioButtons: NodeListOf<Element> = document.querySelectorAll("input[type=radio]");
            let doneQuizFlag: boolean = false;
            let points: number = 0;

            nextQuestionButton.addEventListener("click", nextQuestion);
            previousQuestionButton.addEventListener("click", previousQuestion);
            saveAllButton.addEventListener("click", goBack);
            cancelButton.addEventListener("click", cancelQuiz);
            stopButton.addEventListener("click", sendQuiz);
            for(let i = 0; i < 4; i++ ){
                radioButtons[i].addEventListener("click", saveAnswer);
            }

            window.onload = changeContent;
            initializePage();

            const timer = document.getElementById("timer") as HTMLSpanElement;
            let id: number = window.setInterval(changeTimer, 1000);
            if(getSV("time") != 0)
                changeTimer();

            function getSV(name: string): number{
                return parseInt(sessionStorage.getItem(prefix + name));
            }
            
            function changeSV(name: string, add: number): void{
                let nr: number = getSV(name);
                sessionStorage.setItem(prefix + name, (nr+add).toString());
            }

            function goBack(){
                location.href = "/";
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
                        let currentAns: string = sessionStorage.getItem(prefix + "ans" + getSV("questionNumber").toString());
                        if(currentAns == null)
                            changeSV("ansCounter", 1);
                        if(getSV("ansCounter") == quizQuestions.length)
                            stopButton.disabled = false;
                        sessionStorage.setItem(prefix + "ans" + getSV("questionNumber").toString(), answer.value);
                    }
                }
            }
            
            function saveTime(): void {
                let questionTime: string = sessionStorage.getItem(prefix + "time" + getSV("questionNumber").toString());
                if(questionTime == null)
                    questionTime = "0";
                const newTime: string = (parseInt(questionTime, 0) + (getSV("time") - getSV("lastTime"))).toString();
                changeSV("lastTime", getSV("time") - getSV("lastTime"));
                sessionStorage.setItem(prefix + "time" + getSV("questionNumber").toString(), newTime);
            }
            
            function changeContent(): void {
                const questionNr = document.getElementById("questionNr") as HTMLSpanElement;
                const penalty = document.getElementById("penalty") as HTMLSpanElement;
                const question = document.getElementById("question") as HTMLElement;
                const quizQuestions: any = quiz["questions"];
                const ansi: string = sessionStorage.getItem(prefix + "ans" + getSV("questionNumber").toString());
            
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
                location.href = "/";
            }
            
            function getResult(): number[] {
                let penalty: number = points - getSV("time");
                let data: number[] = [points, penalty];
                return data;
            }
            
            async function saveStatistics(answers: number[]): Promise<void>{
                let times: number[] = [];
                for(let i = 0; i < quiz["questions"].length; i++){
                    let time = parseInt(sessionStorage.getItem(prefix + "time" + i.toString()));
                    times.push(time);
                }  
                let data: number[] = getResult();
                await fetch(url, {method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({_csrf: secure, points: data[0], penalty: data[1], times: times, answers: answers})});
            }
            
            async function sendQuiz(): Promise<void> {
                saveTime();
                clearInterval(id);
                doneQuizFlag = true;
                let answers: number[] = [];
                for(let i = 0; i < quiz["questions"].length; i++){
                    let ans: string = sessionStorage.getItem(prefix + "ans" + i.toString());
                    answers.push(parseInt(ans, 10));
                    if(ans !=  quiz["questions"][i]["correctAnswer"])
                        points += parseInt(quiz["questions"][i]["penalty"]);
                }
            
                colorRightAnswer(quiz["questions"][getSV("questionNumber")]["correctAnswer"]);
                points += getSV("time");

                stopButton.disabled = true;
                saveAllButton.style.display = "initial";

                saveStatistics(answers);
            
            }
            
            function initializePage(): void{
                if(sessionStorage.getItem(prefix + "questionNumber") == null){
                    sessionStorage.setItem(prefix + "questionNumber", "0");
                }
            
                if(sessionStorage.getItem(prefix + "lastTime") == null)
                    sessionStorage.setItem(prefix + "lastTime", "0");
            
                if(sessionStorage.getItem(prefix + "time") == null)
                    sessionStorage.setItem(prefix + "time", "0");
            
                if(sessionStorage.getItem(prefix + "ansCounter") == null)
                    sessionStorage.setItem(prefix + "ansCounter", "0");
            
                changeContent();
            
                if(getSV("questionNumber") == 0)
                    previousQuestionButton.disabled = true;
                if(getSV("ansCounter") != quiz["questions"].length)
                    stopButton.disabled = true;
                else
                    nextQuestionButton.disabled = true;
            }
})
    })});