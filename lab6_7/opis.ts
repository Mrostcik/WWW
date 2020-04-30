let pasazerowie = document.querySelector(".pasazerowie p") as HTMLParagraphElement;
pasazerowie.textContent = "Ekipa samolotowa:";

let pasazerowieLista = document.querySelectorAll(".pasazerowie li") as NodeList;
let aktualnyPas = pasazerowieLista[0] as HTMLLIElement;
// tslint:disable-next-line: prefer-for-of
for(let i = 0; i < pasazerowieLista.length; i++){
    const pasazer = pasazerowieLista[i] as HTMLLIElement;
    if(pasazer.getAttribute("data-identyfikator-pasazera") > aktualnyPas.getAttribute("data-identyfikator-pasazera")){
        aktualnyPas = pasazer;
    }
}
console.log(aktualnyPas.innerText);

setTimeout(() => {console.log("No już wreszcie."); }, 2000);
