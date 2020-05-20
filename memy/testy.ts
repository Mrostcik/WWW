import { Meme, MemeList } from "./memixy";
import { expect } from "chai";
import "mocha";

describe("Meme", () => {
    it("current price changes after changePrice()", () => {
        const memix = new Meme(1, "x", 5, "rrr");
        expect(memix.getCurrentPrice()).to.equal(5);
        memix.changePrice(100);
        expect(memix.getCurrentPrice()).to.equal(100);
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
});