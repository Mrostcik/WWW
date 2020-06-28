import * as sqlite from "sqlite3";
import {initUsers} from "./logging";
import {quiz} from "./quizJSON";

export function createTables(db: sqlite.Database): Promise<void>{
    return new Promise((resolve, reject) => {
        db.serialize(function(){
            db.run(`CREATE TABLE IF NOT EXISTS quizes(
                id INTEGER PRIMARY KEY,
                content TEXT)`);

            db.run(`CREATE TABLE IF NOT EXISTS users(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                login TEXT,
                password TEXT)`);

            db.run(`CREATE TABLE IF NOT EXISTS stats(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                login TEXT,
                quiz_id INTEGER,
                points REAL,
                content TEXT,
                FOREIGN KEY(quiz_id) REFERENCES quizes(id))`);

            db.run(`CREATE TABLE IF NOT EXISTS times(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                login TEXT,
                quiz_id INTEGER,
                time INTEGER)`);
            db.get(`SELECT * FROM quizes`, async function(err: any, row: any){
                if(!row){
                    await initUsers();
                    await addQuiz(JSON.stringify(quiz));
                }
                return resolve();
            })
        });
    });

}

export function addTime(login: string, quiz_id: number, time: number): Promise<void>{
    const db = new sqlite.Database("quizy.db");
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO times (login, quiz_id, time)
                VALUES (?, ?, ?)`, [login, quiz_id, time], function(err: any){
                    if(err && err.code == "SQLITE_BUSY"){
                        return addTime(login, quiz_id, time);
                    }
                    resolve();
                    db.close();
                });
    });
}

export function getTime(login: string, quiz_id: number): Promise<number>{
    const db = new sqlite.Database("quizy.db");
    return new Promise((resolve, reject) => {
        db.get(`SELECT time from times WHERE login=? AND quiz_id=?
                ORDER BY time DESC LIMIT 1`, [login, quiz_id], function(err: any, row){
                    if(err && err.code == "SQLITE_BUSY"){
                        return getTime(login, quiz_id);
                    }
                    resolve(row.time);
                    db.close();
                });
    });
}

function addQuiz(content: string): Promise<void>{
    const db = new sqlite.Database("quizy.db");
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO quizes (content)
                VALUES (?)`, [content], function(err: any){
                    if(err && err.code == "SQLITE_BUSY"){
                        return addQuiz(content);
                    }
                    resolve();
                    db.close();
                });
    });
}

export function getQuiz(id: number): Promise<string>{
    const db = new sqlite.Database("quizy.db");
    return new Promise((resolve, reject) => {
        db.get(`SELECT content from quizes
                WHERE id=?`, [id], function(err: any, row){
            if(err && err.code == "SQLITE_BUSY"){
                return getQuiz(id);
            }
            if(!row){
                db.close();
                return resolve(null);
            }
            resolve(row.content);
            db.close();

        });
    });
}

export function getAllQuizzes(): Promise<string[]>{
    const db = new sqlite.Database("quizy.db");
    return new Promise((resolve, reject) => {
        db.all(`SELECT content from quizes`,function(err: any, rows){
            if(err && err.code == "SQLITE_BUSY"){
                return getAllQuizzes();
            }
            if(!rows){
                db.close();
                return resolve(null);
            }
            const quizes: string[] = [];
            for(const row of rows){
                quizes.push(row.content);
            }
            resolve(quizes);
            db.close();


        });
    });
}

export function addStats(login: string, id: number, points: number, content: string): Promise<void>{
    const db = new sqlite.Database("quizy.db");
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO stats (login, quiz_id, points, content)
                VALUES (?, ?, ?, ?)`, [login, id, points, content], function(err: any){
                    if(err && err.code == "SQLITE_BUSY"){
                        return addStats(login, id, points, content);
                    }
                    resolve();
                    db.close();
                });
    });
}

export function getStats(login: string, id: number): Promise<string>{
    const db = new sqlite.Database("quizy.db");
    return new Promise((resolve, reject) => {
        db.get(`SELECT content FROM stats WHERE login=? AND quiz_id=?`,
                 [login, id], function(err: any, row){
                    if(err && err.code == "SQLITE_BUSY"){
                        return getStats(login, id);
                    }
                    if(!row){
                        db.close();
                        return resolve();
                    }

                    resolve(row.content);
                    db.close();
                });
    });
}

export function checkUserSolution(login: string, id: number): Promise<boolean>{
    const db = new sqlite.Database("quizy.db");
    return new Promise((resolve, reject) => {
        db.get(`SELECT login FROM stats WHERE login=? AND quiz_id=?`,
                 [login, id], function(err: any, row){
                    if(err && err.code == "SQLITE_BUSY"){
                        return checkUserSolution(login, id);
                    }
                    if(!row){
                        db.close();
                        return resolve(false);
                    }

                    resolve(true);
                    db.close();
                });
    });
}

export function getTop(id: number): Promise<[string[], string[]]>{
    const db = new sqlite.Database("quizy.db");
    return new Promise((resolve, reject) => {
        db.all(`SELECT login, content FROM stats WHERE quiz_id=?
                ORDER BY points LIMIT 5`,
                 [id], function(err: any, rows){
                    if(err && err.code == "SQLITE_BUSY"){
                        return getTop(id);
                    }
                    if(!rows){
                        db.close();
                        return resolve();
                    }
                    let scores: [string[], string[]] = [[], []];
                    for(const row of rows){
                        scores[1].push(row.content);
                        scores[0].push(row.login);
                    }


                    resolve(scores);
                    db.close();
                });
    });
}

export function getAverage(id: number): Promise<string[]>{
    const db = new sqlite.Database("quizy.db");
    return new Promise((resolve, reject) => {
        db.all(`SELECT content FROM stats WHERE quiz_id=?`,
                 [id], function(err: any, rows){
                    if(err && err.code == "SQLITE_BUSY"){
                        return getAverage(id);
                    }
                    if(!rows){
                        db.close();
                        return resolve();
                    }
                    const contents: string[] = [];
                    for(const row of rows){
                        contents.push(row.content);
                    }

                    resolve(contents);
                    db.close();
                });
    });
}
