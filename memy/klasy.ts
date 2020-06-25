import * as sqlite from "sqlite3";

export class Meme {
    public id: number;
    public price: number;
    public author: string;
    private name: string;
    private url: string;
    constructor(id: number, name: string, price: number, url: string, author: string){
        this.id = id;
        this.name = name;
        this.price = price;
        this.url = url;
        this.author = author;
    }

    static getPrices(db: sqlite.Database, ID: number): Promise<[number[], string[]]>{
        return new Promise((resolve, reject) => {
            db.all(`SELECT price, author FROM prices WHERE meme_id=?`, [ID],
            function(err, rows){
                if(err){
                    return Meme.getPrices(db, ID);
                }
                const prices: number[] = [];
                const authors: string[] = [];
                for(const row of rows){
                    prices.push(row.price);
                    authors.push(row.author);
                }
                resolve([prices, authors]);
            })
        });
    }

    static async changePrice(ID: number, newPrice: number, newAuthor: string): Promise<[number[], string[]]>{
        const db = new sqlite.Database("memy.db");
        return new Promise((resolve, reject) => {
            db.serialize(async function(){
                const oldPrice = await Meme.getCurrentPrice(ID) as number;
                const oldAuthor = await Meme.getCurrentAuthor(ID) as string;
                db.run("BEGIN", function(err){
                    if(err)
                        return Meme.changePrice(ID, newPrice, newAuthor);
                    db.run(`UPDATE memes SET price=?, author=? WHERE id=?`,
                            [newPrice, newAuthor, ID], function(err2){
                        if(err2){
                            db.run("ROLLBACK");
                            return Meme.changePrice(ID, newPrice, newAuthor);
                        }
                        db.run(`INSERT INTO prices (price, meme_id, author)
                                VALUES (?, ?, ?)`,
                                [oldPrice, ID, oldAuthor],
                            async function(err3){
                                if(err3){
                                    db.run("ROLLBACK");
                                    return Meme.changePrice(ID, newPrice, newAuthor);
                                }
                                else{
                                    const data = await Meme.getPrices(db, ID) as [number[], string[]];
                                    resolve(data);
                                    db.run("COMMIT");
                                    db.close();
                                }
                        });
                    });
                });
            });
        });
    }

    static getCurrentPrice(ID: number): Promise<number>{
        const db = new sqlite.Database("memy.db");
        return new Promise((resolve,reject) => {
            db.get(`SELECT price FROM memes where id=?`, [ID],
            function(err, row){
                if(err){
                    return Meme.getCurrentPrice(ID);
                }
                else{
                    resolve(row.price);
                    db.close();
                }
            });
        });
    }

    static getCurrentAuthor(ID: number): Promise<string>{
        const db = new sqlite.Database("memy.db");
        return new Promise((resolve,reject) => {
            db.get(`SELECT author FROM memes where id=?`, [ID],
            function(err, row){
                if(err){
                    return Meme.getCurrentAuthor(ID);
                }
                else{
                    resolve(row.author);
                    db.close();
                }
            });
        });
    }

    saveToDB(db: sqlite.Database){
        const id = this.id;
        const name = this.name;
        const url = this.url;
        const price = this.price;
        const author = this.author;
        const meme = this;
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO memes (id, name, price, url, author)
                    VALUES (?, ?, ?, ?, ?)`,
                    [id, name, price, url, author], function (err) {
                if (err) {
                    return meme.saveToDB(db);
                }
                else{
                    resolve();
                    db.close();
                }
            });
        });
    }

}

export class MemeList{
    static addMeme(m: Meme){
        const db = new sqlite.Database("memy.db");
        return m.saveToDB(db);
    }

    static getMeme(id: number): Promise<Meme>{
        const db = new sqlite.Database("memy.db");
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM memes WHERE id=?`, [id],
            function(err, row){
                if(err){
                    return MemeList.getMeme(id);
                }
                else{
                    if(!row)
                        resolve(null);

                    resolve(new Meme(row.id, row.name, row.price, row.url, row.author));
                    db.close();
                }
            });
        });
    }

    static getMostExpensive(howMany: number): Promise<Meme[]>{
        const db = new sqlite.Database("memy.db");
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM memes ORDER BY price DESC LIMIT ?`, [howMany],
             function(err, rows){
                if(err){
                    return MemeList.getMostExpensive(howMany);
                }
                else{
                    const memes: Meme[] = [];
                    for(const row of rows){
                        memes.push(new Meme(row.id, row.name, row.price, row.url, row.author))
                    }
                    resolve(memes);
                    db.close();
                }
            });
        });
    }
}