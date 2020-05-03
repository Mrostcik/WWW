var rezerwuj = document.querySelector("input[type=button]");
var potwierdzenie = document.querySelector("#potwierdzenie");
potwierdzenie.style.display = "none";
formularz.addEventListener("input", checkEvent);
var imie = document.querySelector("input[id=imie]");
var nazwisko = document.querySelector("input[id=nazwisko]");
var dataWylotu = document.querySelector("input[id=data_wylotu]");
var dataPowrotu = document.querySelector("input[id=data_powrotu]");
var skad = document.querySelector("select[id=skad_miasta]");
var dokad = document.querySelector("select[id=dokad_miasta]");
function checkForm() {
    if (imie.value === "" || nazwisko.value === "")
        return false;
    var currentDate = makeDate();
    if (dataWylotu.value === "" || dataPowrotu.value === "" || dataWylotu.value > dataPowrotu.value ||
        dataWylotu.value < currentDate)
        return false;
    if (skad.value === "" || dokad.value === "" || skad.value === dokad.value)
        return false;
    return true;
}
function makeDate() {
    var today = new Date();
    var currentDate = "";
    currentDate += today.getFullYear();
    currentDate += "-";
    var month = today.getMonth();
    var day = today.getDate();
    month++;
    if (month < 10)
        currentDate += "0";
    currentDate += month;
    currentDate += "-";
    if (day < 10)
        currentDate += "0";
    currentDate += day;
    return currentDate;
}
function checkEvent() {
    rezerwuj.disabled = !checkForm();
}
rezerwuj.addEventListener("click", submitEvent);
function submitEvent() {
    var potwText = "";
    potwText += "Rezerwacja udana!<br>Imię: " + imie.value + "<br>Nazwisko: " + nazwisko.value + "<br>Skąd: "
        + skad.value + "<br>Dokąd: " + dokad.value + "<br>Data wylotu: " + dataWylotu.value +
        "<br>Data powrotu: " + dataPowrotu.value;
    var info = document.getElementById("potwierdzenie");
    info.innerHTML = potwText;
    info.style.display = "initial";
}
checkEvent();
