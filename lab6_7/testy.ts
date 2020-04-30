import {Builder, Capabilities, Browser, Alert} from 'selenium-webdriver';
import { expect } from 'chai';
import { driver } from 'mocha-webdriver';
const filePath = "file://" + process.cwd() + "/index.html";

async function lackingArgument(n: number){
    await driver.sleep(1000);
    await driver.get(filePath);
    const dane: string[] = ["Olaf", "Lubaszenko", "2020-05-10", "2020-05-10", "Ryga", "Londyn"];
    const selektory: string[] = ["input[id=imie]", "input[id=nazwisko]", "input[id=data_wylotu]", 
                                "input[id=data_powrotu]", "select[id=skad_miasta]", "select[id=dokad_miasta]"]                         
        for(let i = 0; i < dane.length; i++){
            if(i !== n){
                await driver.find(selektory[i]).sendKeys(dane[i]);
            }
        }
        return (await (await driver.find("input[type=submit]")).isEnabled().then((enabled)=>{return enabled}, ()=>{return false}))   
}
 
describe("LackOfArgument", function(){
     it("Submit button not active", async function(){ 
        this.timeout(20000);
         expect(await lackingArgument(0).then((value) => {return value}, ()=> {return true})).to.equal(false);
     });
     it("Submit button not active", async function(){ 
        this.timeout(20000);
         expect(await lackingArgument(1).then((value) => {return value}, ()=> {return true})).to.equal(false);
     });
     it("Submit button not active", async function(){ 
        this.timeout(20000);
         expect(await lackingArgument(2).then((value) => {return value}, ()=> {return true})).to.equal(false);
     });
     it("Submit button not active", async function(){ 
        this.timeout(20000);
         expect(await lackingArgument(3).then((value) => {return value}, ()=> {return true})).to.equal(false);
     });
     it("Submit button not active", async function(){ 
        this.timeout(20000);
         expect(await lackingArgument(4).then((value) => {return value}, ()=> {return true})).to.equal(false);
     });
     it("Submit button not active", async function(){ 
        this.timeout(20000);
         expect(await lackingArgument(5).then((value) => {return value}, ()=> {return true})).to.equal(false);
     });
})

describe("AllArgumentsFine", function(){
    it("Submit button active", async function(){ 
        this.timeout(20000);
        expect(await lackingArgument(6).then((value) => {return value}, ()=> {return false})).to.equal(true);
     });
})

describe("checkForAlert", function(){
    it("Alert is present", async function(){
        this.timeout(20000);
        await lackingArgument(6);
        await driver.find('input[type=submit]').click();
        expect(await driver.switchTo().alert().then(()=>{return true}, ()=>{return false})).to.equal(true);
    })

    it("Alert has right message", async function(){
        this.timeout(20000);
        const alercik: Alert = await driver.switchTo().alert().then((value) => {return value});
        const content: string = await alercik.getText();
        expect(content).to.have.string("Imię");
        expect(content).to.have.string("Nazwisko");
        expect(content).to.have.string("Skąd");
        expect(content).to.have.string("Dokąd");
        expect(content).to.have.string("Data wylotu");
        expect(content).to.have.string("Data powrotu");
        await alercik.accept();
    })
    it("Can't press links", async function(){
        this.timeout(20000);
        await lackingArgument(6);
        await driver.find('input[type=submit]').click();
        expect(await driver.find("a").click().then(() =>{return true}, ()=>{return false})).to.equal(false);
    })
})