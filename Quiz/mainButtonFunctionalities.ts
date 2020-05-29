let newQuiz = document.getElementById("newQuiz") as HTMLInputElement;
let results = document.getElementById("checkResults") as HTMLInputElement;
newQuiz.onclick = startQuiz;
results.onclick = seeResults;

function startQuiz(): void {
    location.href = "question.html";
};

function seeResults(): void {
    location.href = "results.html"
}