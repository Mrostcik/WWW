import { expect } from "chai"
import { driver } from "mocha-webdriver";

describe("Test 1", () => {

    it ('Solving the same quiz twice is impossible', async function() {
        this.timeout(20000);
        await driver.get("http://localhost:8080/login");
        await driver.find("input[name=login]").sendKeys("user1");
        await driver.find("input[name=password]").sendKeys("user1");
        await driver.find("input[type=submit]").click();
        await driver.get("http://localhost:8080/quiz/0");
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