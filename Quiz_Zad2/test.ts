import { expect } from "chai"
import { driver } from "mocha-webdriver";

function sleep(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

describe("Test 1", () => {

    it ('Solving the same quiz twice is impossible', async function() {
        this.timeout(30000);
        await driver.get("http://localhost:8080/login");
        await driver.find("input[name=login]").sendKeys("user1");
        await driver.find("input[name=password]").sendKeys("user1");
        await driver.find("input[type=submit]").click();
        await driver.get("http://localhost:8080/quiz/0")
        //let the script execute
        await sleep(1000);
        for(let i = 0; i < 4; i++){
            await driver.find("#answer0").click();
            await driver.find("#nextQuestion").click();
        }
        await driver.find("#answer0").click();
        await driver.find("#stop").click();
        await driver.get("http://localhost:8080/quiz/0");
        expect(await driver.find("body").getText()).to.include("You already solved this quiz");

    });
});

describe("Test 2", () => {
    it("Changing password deletes all user's sessions", async function() {
        this.timeout(20000);
        await driver.manage().deleteAllCookies();
        await driver.get("http://localhost:8080/login");
        await driver.find("input[name=login]").sendKeys("user1");
        await driver.find("input[name=password]").sendKeys("user1");
        await driver.find("input[type=submit]").click();
        const cookies = await driver.manage().getCookies();
        await driver.manage().deleteAllCookies();
        await driver.get("http://localhost:8080/login");
        await driver.find("input[name=login]").sendKeys("user1");
        await driver.find("input[name=password]").sendKeys("user1");
        await driver.find("input[type=submit]").click();
        await driver.get("http://localhost:8080/changepassword");
        await driver.find("input[name=login]").sendKeys("user1");
        await driver.find("input[name=password]").sendKeys("user1");
        await driver.find("input[name=newPassword]").sendKeys("kolec");
        await driver.find("input[type=submit]").click();
        await driver.manage().deleteAllCookies();

        for (const cookie of cookies) {
            await driver.manage().addCookie({name:cookie.name, value:cookie.value, expiry: cookie.expiry});
        }

        await driver.get("http://localhost:8080/quiz/0");
        expect(await driver.find("body").getText()).to.include("Log in to solve a quiz");
    })
});

describe("Test 3", () => {
    it("Check whether results page is corresponding to user's solved quiz", async function () {
        this.timeout(20000);
        await driver.manage().deleteAllCookies();
        await driver.get("http://localhost:8080/login");
        await driver.find("input[name=login]").sendKeys("user2");
        await driver.find("input[name=password]").sendKeys("user2");
        await driver.find("input[type=submit]").click();
        await driver.get("http://localhost:8080/quiz/0");
        //let the script execute
        await sleep(1000);
        for(let i = 0; i < 4; i++){
            await driver.find("#answer0").click();
            await driver.find("#nextQuestion").click();
        }
        await driver.find("#answer0").click();
        await driver.find("#stop").click();
        await driver.get("http://localhost:8080/quiz/0/results");
        let answers: string[] = (await driver.find("#answers").getText()).split("Średni czas odpowiedzi:");
        let top: string[] = (await driver.find("#topTable").getText()).split("user2");
        //check penalty
        expect(top[1]).to.include("31s");
        //check whether quiz's solution time matches the reality
        expect(parseInt(top[1][5], 10)).to.equal(3);
        expect(parseInt(top[1][6], 10)).to.lessThan(7);
        //check whether displayed user's answers match the ones we've chosen
        expect(answers[0]).to.include("Twoja odpowiedź: 7");
        expect(answers[1]).to.include("Twoja odpowiedź: 2");
        expect(answers[2]).to.include("Twoja odpowiedź: 97");
        expect(answers[3]).to.include("Twoja odpowiedź: 27");
        expect(answers[4]).to.include("Twoja odpowiedź: 16");

    });
})