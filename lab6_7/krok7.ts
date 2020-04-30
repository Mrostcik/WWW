let count = 0;
const odwolane = document.querySelector(".odwolane") as HTMLElement;
const formularz = document.querySelector("#rezerwacja") as HTMLElement;
const kontener = document.querySelector(".kontener") as HTMLElement;

function prawaKolumna(ev: MouseEvent){
    const target = ev.target as HTMLElement;
    if(odwolane.contains(target) || formularz.contains(target)){
        const colors: string[] = ["purple", "aliceblue", "red"];
        odwolane.style.backgroundColor = colors[count];
        formularz.style.backgroundColor = colors[count];
        count++;
        count%=colors.length;
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
function fib(n: number): number{
    if(n <= 1){
        return n;
    }
    return fib(n-2)+fib(n-1);
}