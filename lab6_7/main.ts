//let rezerwuj = document.querySelector("button[type=submit]") as HTMLButtonElement;
//rezerwuj.style.display = "none";

//let imie = document.querySelector("input[id=imie]") as HTMLInputElement;
//console.log(imie.value);

let akapit = document.createElement("div");
akapit.textContent = "Ostatni akapit";
let body = document.querySelector("body") as HTMLBodyElement;
body.appendChild(akapit);

function teczoweKolory(el: HTMLElement) {
    setTimeout(function () {
        console.log('red');
        el.style.backgroundColor = 'red';
        setTimeout(function() {
            el.style.backgroundColor = 'orange';
            setTimeout(function() {
                el.style.backgroundColor = 'yellow';
                setTimeout(function() {
                    el.style.backgroundColor = 'green';
                    setTimeout(function() {
                        el.style.backgroundColor = 'blue';
                        setTimeout(function() {
                            el.style.backgroundColor = 'indigo';
                            setTimeout(function() {
                                el.style.backgroundColor = 'purple';
                            }, 1000);
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}

function wait(time: number){
    return new Promise(resolve => setTimeout(resolve, time));
}

async function teczoweKoloryLepsze(el: HTMLElement){
    const colors: string[] = ["red", "orange", "yellow", "green", "blue", "indigo", "purple"];
    for(const color of colors){
        await wait(1000);
        el.style.backgroundColor = color;
    }
}

let body2 = document.querySelector(".tabelka") as HTMLElement;
teczoweKoloryLepsze(body2);
