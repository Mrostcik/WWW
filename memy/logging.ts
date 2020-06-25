import * as sqlite from 'sqlite3';
import sha256 from 'crypto-js/sha256'

function hashPassword(password: string){
    return sha256(password);
}

function addUser(db: sqlite.Database, login: string, password: string){
    const passwordHashed = hashPassword(password).toString();
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO users (login, password)
        VALUES (?, ?)`, [login, passwordHashed]);
    });
}

export function initUsers(){
    const db = new sqlite.Database("memy.db");
    addUser(db, "admin", "admin");
    addUser(db, "user", "user");
    db.close();
}

export function checkUser(login: string, password: string){
    const db = new sqlite.Database("memy.db");
    const passwordHashed = hashPassword(password).toString();
    return new Promise((resolve, reject) => {
        db.get(`SELECT password FROM users
                WHERE login=?`, [login], function(err, row){
            if(err)
                return checkUser(login, password);
            if(!row || row.password !== passwordHashed){
                return resolve(false);
            }

            resolve(true);
        });
    });
    db.close();
}