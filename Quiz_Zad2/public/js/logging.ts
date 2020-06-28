import * as sqlite from "sqlite3";
import sha256 from "crypto-js/sha256";

function hashPassword(password: string){
    return sha256(password);
}

function addUser(login: string, password: string){
    const db = new sqlite.Database("quizy.db");
    const passwordHashed = hashPassword(password).toString();
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO users (login, password)
        VALUES (?, ?)`, [login, passwordHashed], function(err: any){
            if(err && err.code == "SQLITE_BUSY"){
                return addUser(login, password);
            }
            resolve();
            db.close();
        });
    });
}

export async function initUsers(){
    await addUser("user1", "user1");
    await addUser("user2", "user2");
}

export function checkUser(login: string, password: string){
    const db = new sqlite.Database("quizy.db");
    const passwordHashed = hashPassword(password).toString();
    return new Promise((resolve, reject) => {
        db.get(`SELECT password FROM users
                WHERE login=?`, [login], function(err: any, row){
            if(err && err.code == "SQLITE_BUSY"){
                return checkUser(login, password);
            }
            if(!row || row.password !== passwordHashed){
                db.close();
                return resolve(false);
            }

            resolve(true);
            db.close();
        });
    });
}

export function changePassword(login: string, password: string){
    const db = new sqlite.Database("quizy.db");
    const passwordHashed = hashPassword(password).toString();
    const sessions = new sqlite.Database("sessions");
    return new Promise((resolve, reject) => {
        db.run(`UPDATE users SET password=? WHERE login=?`, [passwordHashed, login], function(err: any){
            if(err && err.code == "SQLITE_BUSY"){
                return changePassword(login, password);
            }
            let pattern = '%"login":"' + login + '"%';
            db.close();
            sessions.run(`DELETE FROM sessions WHERE sess LIKE ?`, [pattern], function(err2){
                resolve();
                sessions.close();
            });
        });
    });
}