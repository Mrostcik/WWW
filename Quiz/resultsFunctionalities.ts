import {res, getFromDB} from "./db.js"
const table = document.getElementById("topTable") as HTMLTableElement;
getFromDB(table);

const backButton = document.getElementById("back") as HTMLInputElement;
backButton.addEventListener("click", back);

function back(): void {
    location.href = "quiz.html";
}
