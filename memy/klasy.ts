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
        if(newPrice >= 0){
            this.prices.push(newPrice);
            return 0;
        }

        return 1;
    }

    getCurrentPrice(){
        const i = this.prices.length - 1;
        return this.prices[i];
    }

    getPrices(){
        return this.prices;
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