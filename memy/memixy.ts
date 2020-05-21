import express = require("express")
const app = express()
app.set("view engine", "pug");

export class Meme {
    private id: number;
    private name: string;
    private prices: number[];
    private url: string;
    constructor(id: number, name: string, price: number, url: string){
        this.id = id;
        this.name = name;
        this.prices = new Array();
        this.prices.push(price);
        this.url = url;
    }

    changePrice(newPrice: number){
        this.prices.push(newPrice);
    }

    getCurrentPrice(){
        const i = this.prices.length - 1;
        return this.prices[i];
    }

    getId(){
        return this.id;
    }

}

export class MemeList{
    private memes: Meme[];

    constructor(){
        this.memes = new Array();
    }

    addMeme(m: Meme){
        this.memes.push(m);
    }

    getMeme(id: number){
        let meme = null;
        for(const m of this.memes){
            if(m.getId() === id)
                meme = m;
        }
        return meme;
    }

    getMostExpensive(howMany: number){
        if(howMany > this.memes.length)
            return null;
        const sorted = this.memes.sort(function(a: Meme, b: Meme){
            return b.getCurrentPrice() - a.getCurrentPrice()
        });
        return sorted.slice(0, howMany);
    }
}

const list = new MemeList();
list.addMeme(new Meme(1, "Najwyższy człowiek świata", 100, "https://www.wykop.pl/cdn/c3201142/comment_1589890151EowDEZ1qqYicFaEwhye8IT.jpg"));
list.addMeme(new Meme(2, "Ryby po browarach", 50, "https://www.wykop.pl/cdn/c3201142/comment_1589886538v1lecEsvOEgPzBMyaMQT3x.jpg"));
list.addMeme(new Meme(3, "Hajto", 60, "https://www.wykop.pl/cdn/c3201142/comment_1588518360qSA3luxDcJrnVkTxX3yf6c.jpg"));
list.addMeme(new Meme(4, "Lista przebojów Trójki", 71, "https://www.wykop.pl/cdn/c3201142/comment_1589828305vWOrjXx9eH4MPtlFk4RJFN.jpg"));
list.addMeme(new Meme(5, "Nietypowy lód", 30, "https://www.wykop.pl/cdn/c3201142/comment_2OkBOdEXYswqvTVGbcxV5isZlNOMTiVS.jpg"));
list.addMeme(new Meme(6, "Przejażdżka windą", 40, "https://www.wykop.pl/cdn/c3201142/comment_1589917777xPKv9XKzEuXSYuJJsnwGGH.jpg"));
list.addMeme(new Meme(7, "Gaz i woda", 99, "https://www.wykop.pl/cdn/c3201142/comment_1589911779xjAGZrSovKfcN8vPpKVmgu.jpg"));
list.addMeme(new Meme(8, "Umyj mi samochód! Hehe", 86, "https://www.wykop.pl/cdn/c3201142/comment_AfA7PorQqrmTvDJ93cryKf4LDEvIfAdZ.jpg"));
list.addMeme(new Meme(9, "Ups, gleba", 79, "https://www.wykop.pl/cdn/c3201142/comment_UNckTmv1LzztaTJojLYQIBYYjgHCeQWH.jpg"));
list.addMeme(new Meme(10, "TCP VS UDP", 200, "https://pbs.twimg.com/media/EX2Mq2hVcAA0K0Y?format=png&name=small"));

app.get("/", function(req, res) {
    res.render("index", { title: "Meme market", message: "Hello there!", memes: list.getMostExpensive(3) })
});

app.get("/meme/:memeId", function (req, res) {
    const meme = list.getMeme(parseInt(req.params.memeId, 10));
    if(meme == null){
        res.send("Wrong meme id");
        return;
    }
    res.render("meme", { title: "Meme history", meme });
})

app.use(express.urlencoded({
    extended: true
}));

app.post("/meme/:memeId", function (req, res) {
    const meme = list.getMeme(parseInt(req.params.memeId, 10));
    if(meme == null){
        res.send("Wrong meme id");
        return;
    }
    const price = req.body.price;
    meme.changePrice(price);
    res.render("meme", { meme })
})

app.use(function (req,res,next){
	res.status(404).send('Unable to find the requested resource!');
});

// localhost:8080
app.listen(8080);