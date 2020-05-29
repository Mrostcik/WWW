export type res = {
    time: number,
    penalty: number,
    total: number;
}

function openDB(): IDBOpenDBRequest{
    const request: IDBOpenDBRequest = window.indexedDB.open("ScoresDB", 1);
    request.onupgradeneeded = function(ev) {
        const db: IDBDatabase = request.result;
        const store: IDBObjectStore = db.createObjectStore("ScoresStore", {autoIncrement: true});
        const index: IDBIndex = store.createIndex("score", "score", {unique: false});
    }

    request.onerror = function(ev) {
        console.log("error while opening db");
    }

    return request;
}

export function addToDB(score: number, penalty: number, times: number[]): void{
    const request: IDBOpenDBRequest = openDB();
    request.onsuccess = function(ev) {
        const db: IDBDatabase = request.result;
        const tx: IDBTransaction = db.transaction("ScoresStore", "readwrite");
        tx.oncomplete = function(ev) {
            db.close();
            sessionStorage.clear();
            location.href = "quiz.html";
        }

        const store: IDBObjectStore = tx.objectStore("ScoresStore");

        db.onerror = function(ev) {
            console.log("error while adding to db");
        }

        console.log(times);
        store.put({score: score, penalty: penalty, times: times});
        console.log(store);
    }
}

export function getFromDB(table: HTMLTableElement): void{
    let resultArray: Array<res> = [];
    const request: IDBOpenDBRequest = openDB();
    request.onsuccess = function(ev) {
        const db: IDBDatabase = request.result;
        const tx: IDBTransaction = db.transaction("ScoresStore", "readonly");
        tx.oncomplete = function(ev) {
            db.close();
        }
        const store: IDBObjectStore = tx.objectStore("ScoresStore");

        db.onerror = function(ev) {
            console.log("error while adding to db");
        }

        let numberOfResults: number = 0;
        store.openCursor().onsuccess = function(ev) {
            let target: any = ev.target;
            let cursor: any = target.result;
            if(cursor) {
                const val: any = cursor.value;
                let tempResult: res = {
                    time: val.score - val.penalty,
                    penalty:  val.penalty,
                    total: val.score
                }
                console.log(tempResult);
                numberOfResults = resultArray.push(tempResult);
        
                cursor.continue();
            }
            else{
                resultArray.sort(compareFunction);
                for(let i = 0; i < Math.min(5, numberOfResults); i++){
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
        }
    }
}

function compareFunction(a: res, b: res): number {
    if(a.total < b.total)
        return -1;
    else if(a.total > b.total)
        return 1;

    return 0;
}