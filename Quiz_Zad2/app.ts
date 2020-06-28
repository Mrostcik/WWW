import {checkUser, changePassword} from "./public/js/logging"
import {getQuiz, getAllQuizzes, addTime, getTime, addStats, getStats, checkUserSolution, getTop, getAverage} from "./public/js/database"
import express from 'express';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
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

app.use("/css",  express.static(__dirname + '/public/css'));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/jpg",  express.static(__dirname + '/public/jpg'));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.sendFile("public/quiz.html", {root: __dirname});
})

app.get("/token", csrfProtection, function(req, res){
    res.status(200).json({token: req.csrfToken()});
})

app.get("/login", function(req, res){
    if(req.session.login){
        res.send("You are already logged in");
        return;
    }
    
    res.sendFile("public/logging.html", {root: __dirname});
})

app.get("/changepassword", function(req, res){
    res.sendFile("public/password.html", {root: __dirname});
})

app.post("/login", csrfProtection, async function(req, res){
    const login = req.body.login;
    const password = req.body.password;
    if(!(await checkUser(login, password))){
        res.send("User doesn't exist");
        return;
    }

    req.session.login = login;
    res.redirect("/");
})

app.post("/changepassword", csrfProtection, async function(req, res){
    const login = req.body.login;
    const oldPassword = req.body.password;
    const newPassword = req.body.newPassword;
    if(!(await checkUser(login, oldPassword))){
        res.send("User doesn't exist");
        return;
    }

    await changePassword(login, newPassword);
    res.redirect("/");
})

app.get("/quizzes", async function(req, res){
    const quizzes = await getAllQuizzes();
    res.json({quizzes})
})

app.get("/quiz/:quizId", async function(req, res) {
    if(!req.session.login){
        res.send("Log in to solve a quiz");
        return;
    }

    if(await checkUserSolution(req.session.login, parseInt(req.params.quizId, 10) + 1)){
        res.send("You already solved this quiz");
        return;
    }
    const id = parseInt(req.params.quizId, 10);
    await addTime(req.session.login, id + 1, Date.now());
    res.sendFile("public/question.html", {root: __dirname});
})

app.get("/quiz/:quizId/content", async function(req, res){
    if(!req.session.login){
        res.send("You are logged out");
        return;
    }
    const id = parseInt(req.params.quizId, 10);
    const quiz = await getQuiz(id + 1);
    const login = req.session.login;

    res.json({quiz, login, id});
})

app.post("/quiz/:quizId", async function(req, res){
    if(!req.session.login){
        res.send("Couldn't send results. Log in.");
        return;
    }

    const id = parseInt(req.params.quizId, 10);
    let time = -(await getTime(req.session.login, id + 1));
    time += Date.now();
    const data = req.body;
    const points: number = data.points;
    const penalty: number = data.penalty;
    const answers: number[] = data.answers;
    let times: number[] = data.times;
    for(let i = 0; i < times.length; i++){
        times[i] *= time;
        times[i] /= (points-penalty);
        times[i] /= 1000;
    }
    await addStats(req.session.login, id + 1, time/1000, JSON.stringify({points: time/1000 + penalty, penalty: penalty, times: times, answers: answers}));
})

app.post("/logout", function(req, res){
    delete req.session.login;
    res.redirect("/");
})

app.get("/quiz/:quizId/results", function(req, res){
    if(!req.session.login){
        res.send("Log in to see results");
        return;
    }
    res.sendFile("public/results.html", {root: __dirname});
})

app.get("/quiz/:quizId/results/stats", async function(req, res){
    if(!req.session.login){
        res.send("You are logged out");
        return;
    }
    const id = parseInt(req.params.quizId, 10);
    const login = req.session.login;
    const quiz = await getQuiz(id + 1);
    const stats = await getStats(login, id + 1);
    const top = await getTop(id + 1);
    const times = await getAverage(id + 1);
    const avgs: number[] = [];
    const qNr: number = JSON.parse(quiz).questions.length;
    if(!stats){
        res.send("You haven't solved this quiz yet");
        return;
    }    
    for(let i = 0; i < qNr; i++){
        avgs.push(0);
    }
    for(let i = 0; i < times.length; i++){
        const json = JSON.parse(times[i]);
        for(let j = 0; j < qNr; j++){
            avgs[j] += json.times[j];
        }
    }
    for(let i = 0; i < qNr; i++){
        avgs[i] /= times.length;
    }

    res.json({quiz, stats, login, id, top, avgs});
})

const server = app.listen(8080, () => {
    console.log("App is running at http://localhost:8080/");
});