const table = document.getElementById("topTable") as HTMLTableElement;
// getFromDB(table);

 const backButton = document.getElementById("back") as HTMLInputElement;
backButton.addEventListener("click", back);

function back(): void {
    location.href = "/";
}
let quizz: any = null;
let stats: any = null;
let topka: [string[], string[]] = null;
let averages: number[] = null;

fetch(window.location.href + "/stats")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        quizz = JSON.parse(data.quiz);
        stats = JSON.parse(data.stats);
        topka = data.top;
        averages = data.avgs;
    })
    .then( () => {
        console.log(averages);
        for(let i = 0; i < topka[1].length; i++){
            const login = topka[0][i];
            console.log(topka[1][i]);
            const act = JSON.parse(topka[1][i]);
            let row = table.insertRow(i+1);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            let cell4 = row.insertCell(3);
            cell1.textContent = (i+1).toString()
            cell2.textContent = login;
            cell3.textContent = act.penalty.toString() + "s";
            cell4.textContent = act.points.toString() + "s";
        }
        const questionsSection = document.getElementById("answers") as HTMLDivElement;
        const questions: any[] = quizz.questions;
        for(let i = 0; i < questions.length; i++){
            const opt = document.createElement('paragraph');
            let text = "";
            text += ("Pytanie: " + questions[i].question);
            text += ("<br>Poprawna odpowiedź: " + questions[i].answers[questions[i].correctAnswer]);
            text += ("<br>Twoja odpowiedź: " + questions[i].answers[stats.answers[i]]);
            text += ("<br>Średni czas odpowiedzi: " + averages[i].toString() + "s");
            text += ("<br><br>");
            opt.innerHTML = text;
            opt.style.display = "block";
            opt.style.textAlign = "center";
            questionsSection.appendChild(opt);
        }
    });
