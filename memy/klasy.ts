import * as sqlite from 'sqlite3';

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

    static getPrices(db: sqlite.Database, ID: number){
        return new Promise((resolve, reject) => {
            db.all(`SELECT price, author FROM prices WHERE meme_id=${ID}`,
            function(err, rows){
                if(err){
                    return reject();
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

    static async changePrice(db: sqlite.Database, ID: number, newPrice: number, newAuthor: string){
        return new Promise((resolve, reject) => {
            db.serialize(async function(){
                const oldPrice = await Meme.getCurrentPrice(db, ID) as number;
                const oldAuthor = await Meme.getCurrentAuthor(db, ID) as string;
                if(newPrice < 0)
                    return resolve(null);
                db.run("BEGIN");
                db.run(`UPDATE memes SET price=${newPrice}, author="${newAuthor}" WHERE id=${ID}`,
                function(err){
                    if(err){
                        db.run("ROLLBACK");
                        return reject();
                    }
                });
                db.run(`INSERT INTO prices (price, meme_id, author)
                        VALUES (${oldPrice}, ${ID}, "${oldAuthor}")`,
                async function(err){
                    if(err){
                        db.run("ROLLBACK");
                        return reject();
                    }
                    else{
                        const data = await Meme.getPrices(db, ID) as [number[], string[]];
                        resolve(data);
                        db.run("COMMIT");
                    }
                });
            });
        });
    }

    static getCurrentPrice(db: sqlite.Database, ID: number){
        return new Promise((resolve,reject) => {
            db.get(`SELECT price FROM memes where id=${ID}`,
            function(err, row){
                if(err){
                    reject();
                }
                else{
                    resolve(row.price);
                }
            });
        });
    }

    static getCurrentAuthor(db: sqlite.Database, ID: number){
        return new Promise((resolve,reject) => {
            db.get(`SELECT author FROM memes where id=${ID}`,
            function(err, row){
                if(err){
                    reject();
                }
                else{
                    resolve(row.author);
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
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO memes (id, name, price, url, author)
                    VALUES (${id}, "${name}", ${price}, "${url}", "${author}")`, function (err) {
                if (err) {
                    reject();
                }
                else{
                    resolve();
                }
            });
        });
    }

}

export class MemeList{
    static addMeme(db: sqlite.Database, m: Meme){
        return m.saveToDB(db);
    }

    static getMeme(db: sqlite.Database, id: number){
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM memes WHERE id=${id}`,
            function(err, row){
                if(err){
                    reject();
                }
                else{
                    if(!row)
                        resolve(null);

                    resolve(new Meme(row.id, row.name, row.price, row.url, row.author));
                }
            });
        });
    }

    static getMostExpensive(db: sqlite.Database, howMany: number){
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM memes ORDER BY price DESC LIMIT ${howMany}`,
             function(err, rows){
                if(err){
                    reject();
                }
                else{
                    const memes: Meme[] = [];
                    for(const row of rows){
                        memes.push(new Meme(row.id, row.name, row.price, row.url, row.author))
                    }
                    resolve(memes);
                }
            });
        });
    }
}