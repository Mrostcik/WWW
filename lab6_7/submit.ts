const rezerwuj = document.querySelector("input[type=button]") as HTMLButtonElement;
const potwierdzenie = document.querySelector("#potwierdzenie") as HTMLElement;
potwierdzenie.style.display = "none";

formularz.addEventListener("input", checkEvent);

const imie = document.querySelector("input[id=imie]") as HTMLInputElement;
const nazwisko = document.querySelector("input[id=nazwisko]") as HTMLInputElement;
const dataWylotu = document.querySelector("input[id=data_wylotu]") as HTMLInputElement;
const dataPowrotu = document.querySelector("input[id=data_powrotu]") as HTMLInputElement;
const skad = document.querySelector("select[id=skad_miasta]") as HTMLSelectElement;
const dokad = document.querySelector("select[id=dokad_miasta]") as HTMLSelectElement;

function checkForm(){
    if(imie.value === "" || nazwisko.value === "")
        return false;

    const currentDate = makeDate();
    if(dataWylotu.value === "" || dataPowrotu.value === "" || dataWylotu.value > dataPowrotu.value || 
        dataWylotu.value < currentDate)
        return false;

    if(skad.value === "" || dokad.value === "" || skad.value === dokad.value)
        return false;

    return true;
}

function makeDate(){
    const today = new Date();
    let currentDate = "";
    currentDate +=  today.getFullYear();
    currentDate += "-";
    let month = today.getMonth();
    const day = today.getDate();
    month++;
    if(month < 10)
        currentDate += "0";
    currentDate += month;
    currentDate += "-";
    if(day < 10)
        currentDate += "0";
    currentDate += day;

    return currentDate;
}


function checkEvent(){
    rezerwuj.disabled = !checkForm();
}

rezerwuj.addEventListener("click", submitEvent);

function submitEvent(){
    let potwText = "";
    potwText += "Rezerwacja udana!<br>Imię: " + imie.value + "<br>Nazwisko: " + nazwisko.value + "<br>Skąd: "
                + skad.value + "<br>Dokąd: " + dokad.value + "<br>Data wylotu: " + dataWylotu.value + 
                "<br>Data powrotu: " + dataPowrotu.value;
    const info = document.getElementById("potwierdzenie") as HTMLDivElement;
    info.innerHTML = potwText;
    info.style.display = "initial";
}

checkEvent();