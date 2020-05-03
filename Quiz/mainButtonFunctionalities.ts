let newQuiz = document.getElementById("newQuiz") as HTMLInputElement;
newQuiz.onclick = startQuiz;
let results = document.getElementById("checkResults") as HTMLInputElement;
results.onclick = seeResults;

function startQuiz(){
    location.href = "question.html";
};

function seeResults(){
    location.href = "results.html"
}