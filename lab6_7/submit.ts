let rezerwuj = document.querySelector("input[type=submit]") as HTMLButtonElement;
let potwierdzenie = document.querySelector("#potwierdzenie") as HTMLElement;
potwierdzenie.style.display = "none";

formularz.addEventListener("click", checkEvent);
formularz.addEventListener("keyup", checkEvent);
formularz.addEventListener("change", checkEvent);

const imie = document.querySelector("input[id=imie]") as HTMLInputElement;
const nazwisko = document.querySelector("input[id=nazwisko]") as HTMLInputElement;
const dataWylotu = document.querySelector("input[id=data_wylotu]") as HTMLInputElement;
const dataPowrotu = document.querySelector("input[id=data_powrotu]") as HTMLInputElement;
const skad = document.querySelector("select[id=skad_miasta]") as HTMLSelectElement;
const dokad = document.querySelector("select[id=dokad_miasta]") as HTMLSelectElement;

function checkForm(){
    if(imie.value === "" || nazwisko.value === "")
        return false;

    const today = new Date();
    let currentDate = "";
    currentDate +=  today.getFullYear();
    currentDate += "-";
    let month = today.getMonth();
    month++;
    if(month < 10)
        currentDate += "0";
    currentDate += month;
    currentDate += "-";
    currentDate += today.getDate();
    if(dataWylotu.value === "" || dataPowrotu.value === "" || dataWylotu.value > dataPowrotu.value || 
        dataWylotu.value < currentDate || dataPowrotu.value < currentDate)
        return false;

    if(skad.value === "" || dokad.value === "" || skad.value === dokad.value)
        return false;

    return true;
}

async function checkEvent(){
    await wait(0);
    rezerwuj.disabled = !checkForm();
}

rezerwuj.addEventListener("click", submitEvent);

function submitEvent(){
    let potwText = "";
    potwText += "Rezerwacja udana!\nImię: " + imie.value + "\nNazwisko: " + nazwisko.value + "\nSkąd: "
                + skad.value + "\nDokąd: " + dokad.value + "\nData wylotu: " + dataWylotu.value + 
                "\nData powrotu: " + dataPowrotu.value;
    alert(potwText);
}

checkEvent();