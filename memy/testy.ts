import { Meme, MemeList } from "./klasy";
import { expect } from "chai";
import "mocha";
import { constants } from "buffer";

describe("Meme", () => {
    it("current price changes after changePrice()", () => {
        const memix = new Meme(1, "x", 5, "rrr");
        expect(memix.getCurrentPrice()).to.equal(5);
        memix.changePrice(100);
        expect(memix.getCurrentPrice()).to.equal(100);
    });

    it("current price doesn't change to negative one", () => {
        const memix = new Meme(1, "x", 5, "rrr");
        expect(memix.changePrice(-5)).to.equal(1);
    })

    it("historical prices are kept right", () => {
        const prices = [2,3,4];
        const memix = new Meme(1, "x", 2, "rrr");
        memix.changePrice(3);
        memix.changePrice(4);
        const history = memix.getPrices();
        expect(prices).to.eql(history);
    });
});

describe("MemeList", () => {
    it("Memes are correctly added and returned by id", () => {
        const memix1 = new Meme(1, "x1", 5, "r1");
        const memix2 = new Meme(2, "x2", 6, "r2");
        const memix3 = new Meme(3, "x3", 7, "r3");
        const memeList = new MemeList();
        memeList.addMeme(memix1);
        memeList.addMeme(memix2);
        memeList.addMeme(memix3);
        expect(memeList.getMeme(2)).to.equal(memix2);
        expect(memeList.getMeme(3)).to.equal(memix3);
        expect(memeList.getMeme(1)).to.equal(memix1);
        expect(memeList.getMeme(4)).to.equal(null);
    });

    it("Most expensive memes are returned correctly", () => {
        const memix1 = new Meme(1, "x1", 5, "r1");
        const memix2 = new Meme(2, "x2", 6, "r2");
        const memix3 = new Meme(3, "x3", 7, "r3");
        const memeList = new MemeList();
        memeList.addMeme(memix1);
        memeList.addMeme(memix2);
        memeList.addMeme(memix3);
        const top2 = [memix3, memix2];
        const top3 = [memix3, memix2, memix1];
        expect(memeList.getMostExpensive(2)).to.eql(top2);
        expect(memeList.getMostExpensive(3)).to.eql(top3);
    });

    it("getting more memes than there is in list returns null", () => {
        const memeList = new MemeList();
        expect(memeList.getMostExpensive(1)).to.equal(null)
    })
});