const table = document.getElementById("topTable") as HTMLTableElement;
let howMany = parseInt(localStorage.getItem("number"));
if(howMany == null)
    howMany = 0;

type res = {
    time: number,
    penalty: number,
    total: number;
}

let resultArray: Array<res> = [];

function computeTopResults(){
    for(let i = 0; i < howMany; i++){
        const penalty = parseInt(localStorage.getItem(i.toString() + "penalty"));
        const points = parseInt(localStorage.getItem(i.toString() + "result"));
        let tempResult: res = {
            time: points - penalty,
            penalty:  penalty,
            total: points
        }
        resultArray.push(tempResult);
    }

    resultArray.sort(compareFunction);

    for(let i = 0; i < Math.min(5, howMany); i++){
        let row = table.insertRow(i+1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        cell1.textContent = (i+1).toString()
        cell2.textContent = resultArray[i].time.toString() + "s";
        cell3.textContent = resultArray[i].penalty.toString() + "s";
        cell4.textContent = resultArray[i].total.toString() + "s";
    }

}

function compareFunction(a: res, b: res){
    if(a.total < b.total)
        return -1;
    else if(a.total > b.total)
        return 1;

    return 0;
}

computeTopResults();

const backButton = document.getElementById("back") as HTMLInputElement;
backButton.addEventListener("click", back);

function back(){
    location.href = "index.html";
}
