import {Meme, MemeList} from "./klasy";
import {initUsers, checkUser} from "./logging"
import express from 'express';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import * as sqlite from 'sqlite3';
import session from 'express-session';
// tslint:disable-next-line: no-var-requires
const connsqlite = require('connect-sqlite3');

const sqliteStore = connsqlite(session);

const app = express()
app.set("view engine", "pug");

const csrfProtection = csurf({ cookie: true });
app.use(cookieParser("seccccreeeet"));
app.use(session({
    secret: "seccccreeeet",
    resave: false,
    saveUninitialized: true,
    store: new sqliteStore()
}));

let db = new sqlite.Database("memy.db");
function createTables(){
    return new Promise((resolve, reject) => {
        db.serialize(function(){
            db.run(`CREATE TABLE IF NOT EXISTS memes(
                id INTEGER PRIMARY KEY,
                price INTEGER,
                name TEXT,
                url TEXT,
                author TEXT)`);

            db.run(`CREATE TABLE IF NOT EXISTS prices(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                price INTEGER,
                meme_id INTEGER,
                author TEXT,
                FOREIGN KEY(meme_id) REFERENCES memes(id))`);

            db.run(`CREATE TABLE IF NOT EXISTS users(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                login TEXT UNIQUE,
                password TEXT
            )`);

            db.get(`SELECT * FROM memes`, async function(err: any, row: any){
                if(err){
                    reject();
                }
                if(!row){
                    db.close();
                    await initUsers();
                    await addMemes();
                }
                resolve();
            })
        });
    });

}

function addMemes(){
    MemeList.addMeme(new Meme(1, "Najwyższy człowiek świata", 100, "https://www.wykop.pl/cdn/c3201142/comment_1589890151EowDEZ1qqYicFaEwhye8IT.jpg", "init"));
    MemeList.addMeme(new Meme(2, "Ryby po browarach", 50, "https://www.wykop.pl/cdn/c3201142/comment_1589886538v1lecEsvOEgPzBMyaMQT3x.jpg", "init"));
    MemeList.addMeme(new Meme(3, "Hajto", 60, "https://www.wykop.pl/cdn/c3201142/comment_1588518360qSA3luxDcJrnVkTxX3yf6c.jpg", "init"));
    MemeList.addMeme(new Meme(4, "Lista przebojów Trójki", 71, "https://www.wykop.pl/cdn/c3201142/comment_1589828305vWOrjXx9eH4MPtlFk4RJFN.jpg", "init"));
    MemeList.addMeme(new Meme(5, "Nietypowy lód", 30, "https://www.wykop.pl/cdn/c3201142/comment_2OkBOdEXYswqvTVGbcxV5isZlNOMTiVS.jpg", "init"));
    MemeList.addMeme(new Meme(6, "Przejażdżka windą", 40, "https://www.wykop.pl/cdn/c3201142/comment_1589917777xPKv9XKzEuXSYuJJsnwGGH.jpg", "init"));
    MemeList.addMeme(new Meme(7, "Gaz i woda", 99, "https://www.wykop.pl/cdn/c3201142/comment_1589911779xjAGZrSovKfcN8vPpKVmgu.jpg", "init"));
    MemeList.addMeme(new Meme(8, "Umyj mi samochód! Hehe", 86, "https://www.wykop.pl/cdn/c3201142/comment_AfA7PorQqrmTvDJ93cryKf4LDEvIfAdZ.jpg", "init"));
    MemeList.addMeme(new Meme(9, "Ups, gleba", 79, "https://www.wykop.pl/cdn/c3201142/comment_UNckTmv1LzztaTJojLYQIBYYjgHCeQWH.jpg", "init"));
    MemeList.addMeme(new Meme(10, "TCP VS UDP", 200, "https://pbs.twimg.com/media/EX2Mq2hVcAA0K0Y?format=png&name=small", "init"));
}

createTables().then(async () => {
    app.get("/", async function(req, res) {
        res.render("index", { title: "Meme market", message: "Hello there!", memes: await MemeList.getMostExpensive(3) })
    });

    app.get("/meme/:memeId", csrfProtection, async function (req, res) {
        let showForm = false;
        if(req.session.login){
            showForm = true;
        }
        const meme = await MemeList.getMeme(parseInt(req.params.memeId, 10));
        if(meme == null){
            res.send("Wrong meme id");
            return;
        }
        db = new sqlite.Database("memy.db");
        const data = await Meme.getPrices(db, meme.id);
        db.close()
        const prices = data[0];
        const authors = data[1];
        prices.push(meme.price);
        authors.push(meme.author);
        res.render("meme", { title: "Meme history", meme, prices, authors, showForm, csrfToken: req.csrfToken() });
    })

    app.use(express.urlencoded({
        extended: true
    }));

    app.get("/login", csrfProtection, function(req, res){
        if(req.session.login){
            res.redirect("/");
            return;
        }

        res.render("logging", {title: "Logowanie", csrfToken: req.csrfToken()});
    });

    app.post("/login", csrfProtection, async function(req, res){
        if(req.session.login){
            res.redirect("/");
            return;
        }

        const login = req.body.login;
        const password = req.body.password;

        if(!(await checkUser(login, password))){
            res.send("User doesn't exist");
            return;
        }
        req.session.login = login;
        res.redirect("/");
    })

    app.post("/logout", function(req, res){
        delete req.session.login;
        res.redirect("/");
    })

    app.post("/meme/:memeId", csrfProtection, async function (req, res) {
        if(!req.session.login){
            res.send("Nie jesteś zalogowany!");
            return;
        }
        const meme = await MemeList.getMeme(parseInt(req.params.memeId, 10));
        if(meme == null){
            res.send("Wrong meme id");
            return;
        }

        const price = req.body.price;
        if(isNaN(price)){
            res.send("Given price is not a number");
            return;
        }
        if(price < 0){
            res.send("Given price is negative");
            return;
        }

        const data = await Meme.changePrice(meme.id, price, req.session.login);

        const prices = data[0];
        const authors = data[1];
        prices.push(price);
        authors.push(req.session.login);

        res.render("meme", { meme, prices, authors, showForm: true, csrfToken: req.csrfToken() })
    })

    app.use(function (req,res,next){
        res.status(404).send('Unable to find the requested resource!');
    });

    const server = app.listen(8080, () => {
        console.log("App is running at http://localhost:8080/");
    });
});