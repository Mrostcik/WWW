import {Builder, Capabilities, Browser, Alert} from "selenium-webdriver";
import { expect } from "chai";
import { driver } from "mocha-webdriver";
const filePath = "file://" + process.cwd() + "/index.html";
function makeDate(){
    const today = new Date();
    let currentDate = "";
    currentDate +=  today.getFullYear();
    currentDate += "-";
    let month = today.getMonth();
    const day = today.getDate();
    month++;
    if(month < 10)
        currentDate += "0";
    currentDate += month;
    currentDate += "-";
    if(day < 10)
        currentDate += "0";
    currentDate += day;

    return currentDate;
}

async function lackingArgument(n: number){
    await driver.get(filePath);
    const today = makeDate();
    const dane: string[] = ["Olaf", "Lubaszenko", today, today, "Ryga", "Londyn"];
    const selektory: string[] = ["input[id=imie]", "input[id=nazwisko]", "input[id=data_wylotu]", 
                                "input[id=data_powrotu]", "select[id=skad_miasta]", "select[id=dokad_miasta]"]                         
        for(let i = 0; i < dane.length; i++){
            if(i !== n){
                await driver.find(selektory[i]).sendKeys(dane[i]);
            }
        }
        return await driver.find("input[type=button]").isEnabled();
}
 
describe("LackOfArgument", function(){
     it("First name not set", async function(){ 
        this.timeout(20000);
        expect(await lackingArgument(0).then((value) => {return value}, ()=> {return true})).to.equal(false);
     });
     it("Last name not set", async function(){ 
        this.timeout(20000);
        expect(await lackingArgument(1).then((value) => {return value}, ()=> {return true})).to.equal(false);
     });
     it("Date of departure not set", async function(){ 
        this.timeout(20000);
        expect(await lackingArgument(2).then((value) => {return value}, ()=> {return true})).to.equal(false);
     });
     it("Date of arrival not set", async function(){ 
        this.timeout(20000);
        expect(await lackingArgument(3).then((value) => {return value}, ()=> {return true})).to.equal(false);
     });
     it("City of departure not set", async function(){ 
        this.timeout(20000);
        expect(await lackingArgument(4).then((value) => {return value}, ()=> {return true})).to.equal(false);
     });
     it("Desination not set", async function(){ 
        this.timeout(20000);
        expect(await lackingArgument(5).then((value) => {return value}, ()=> {return true})).to.equal(false);
     });
})

describe("AllArgumentsFine", function(){
    it("All set. Submit button active", async function(){ 
        this.timeout(20000);
        expect(await lackingArgument(6).then((value) => {return value}, ()=> {return false})).to.equal(true);
     });
})

describe("checkForInfo", function(){
    it("Travel information is present", async function(){
        this.timeout(20000);
        await lackingArgument(6);
        await driver.find("input[type=button]").click();
        console.log(await driver.find("#potwierdzenie").getCssValue("display"));
        expect( await driver.find("#potwierdzenie").getCssValue("display").then((value)=>{return (value !== "none")}, ()=>{return false})).to.equal(true);
    })

    it("Info has correct message", async function(){
        this.timeout(20000);
        const content: string = await driver.find("#potwierdzenie").getText();
        expect(content).to.have.string("Imię");
        expect(content).to.have.string("Nazwisko");
        expect(content).to.have.string("Skąd");
        expect(content).to.have.string("Dokąd");
        expect(content).to.have.string("Data wylotu");
        expect(content).to.have.string("Data powrotu");
    })
    it("Can't press links", async function(){
        this.timeout(20000);
        expect(await driver.find("a").click().then(() =>{return true}, ()=>{return false})).to.equal(false);
    })
})