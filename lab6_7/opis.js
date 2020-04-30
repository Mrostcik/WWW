var pasazerowie = document.querySelector(".pasazerowie p");
pasazerowie.textContent = "Ekipa samolotowa:";
var pasazerowieLista = document.querySelectorAll(".pasazerowie li");
var aktualnyPas = pasazerowieLista[0];
// tslint:disable-next-line: prefer-for-of
for (var i = 0; i < pasazerowieLista.length; i++) {
    var pasazer = pasazerowieLista[i];
    if (pasazer.getAttribute("data-identyfikator-pasazera") > aktualnyPas.getAttribute("data-identyfikator-pasazera")) {
        aktualnyPas = pasazer;
    }
}
console.log(aktualnyPas.innerText);
setTimeout(function () { console.log("No już wreszcie."); }, 2000);
