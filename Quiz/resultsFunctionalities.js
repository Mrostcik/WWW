var table = document.getElementById("topTable");
var howMany = parseInt(localStorage.getItem("number"));
if (howMany == null)
    howMany = 0;
var resultArray = [];
function computeTopResults() {
    for (var i = 0; i < howMany; i++) {
        var penalty = parseInt(localStorage.getItem(i.toString() + "penalty"));
        var points_1 = parseInt(localStorage.getItem(i.toString() + "result"));
        var tempResult = {
            time: points_1 - penalty,
            penalty: penalty,
            total: points_1
        };
        resultArray.push(tempResult);
    }
    resultArray.sort(compareFunction);
    for (var i = 0; i < Math.min(5, howMany); i++) {
        var row = table.insertRow(i + 1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.textContent = (i + 1).toString();
        cell2.textContent = resultArray[i].time.toString() + "s";
        cell3.textContent = resultArray[i].penalty.toString() + "s";
        cell4.textContent = resultArray[i].total.toString() + "s";
    }
}
function compareFunction(a, b) {
    if (a.total < b.total)
        return -1;
    else if (a.total > b.total)
        return 1;
    return 0;
}
computeTopResults();
var backButton = document.getElementById("back");
backButton.addEventListener("click", back);
function back() {
    location.href = "index.html";
}
