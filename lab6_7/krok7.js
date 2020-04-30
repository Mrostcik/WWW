var count = 0;
var odwolane = document.querySelector(".odwolane");
var formularz = document.querySelector("#rezerwacja");
var kontener = document.querySelector(".kontener");
function prawaKolumna(ev) {
    var target = ev.target;
    if (odwolane.contains(target) || formularz.contains(target)) {
        var colors = ["purple", "aliceblue", "red"];
        odwolane.style.backgroundColor = colors[count];
        formularz.style.backgroundColor = colors[count];
        count++;
        count %= colors.length;
    }
}
kontener.addEventListener("click", prawaKolumna);
//formularz.addEventListener("click", fibEvent);
/*
function fibEvent(){
    const elem = this as HTMLElement;
    const atrybut = elem.getAttribute("data-fib") as string;
    let liczba = parseInt(atrybut, 10);
    if(liczba <= 4){
        console.log(fib(10*liczba));
        liczba++;
        elem.setAttribute("data-fib", liczba.toString());
    }
    else throw "Too big Fibonacii number to compute"
}
*/
function fib(n) {
    if (n <= 1) {
        return n;
    }
    return fib(n - 2) + fib(n - 1);
}
