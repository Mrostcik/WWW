let newQuiz = document.getElementById("newQuiz") as HTMLInputElement;
let results = document.getElementById("checkResults") as HTMLInputElement;

newQuiz.onclick = startQuiz;
results.onclick = seeResults;
let quizzes: string[];

function seeResults(): void {
    const selectQuizzes = document.getElementById("quizzes") as HTMLSelectElement;
    const id = parseInt(selectQuizzes.value, 10);
    if(id < 0){
        alert("You haven't chosen quiz");
        return;
    }
    location.href = `/quiz/${id}/results`;
}

async function showQuizzes(): Promise<void>{
    const selectQuizzes = document.getElementById("quizzes") as HTMLSelectElement;
    await fetch("/quizzes")
        .then(response => response.json())
        .then(data => quizzes = data.quizzes);

    let index = 0;
    for(const quiz of quizzes){
        const opt = document.createElement('option');
        const quizJSON = JSON.parse(quiz);
        opt.value = index.toString();
        opt.innerHTML = quizJSON.info.description;
        selectQuizzes.appendChild(opt);
        index++;
    }
    
    
}

function startQuiz(){
    const selectQuizzes = document.getElementById("quizzes") as HTMLSelectElement;
    const id = parseInt(selectQuizzes.value, 10);
    if(id < 0){
        alert("You haven't chosen quiz");
        return;
    }

    location.href = `/quiz/${id}`;
}

showQuizzes();

