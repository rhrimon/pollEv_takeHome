const puppeteer = require('puppeteer');

//wait function
function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
        })

//navigate to vote responses page 
    const page1 = await browser.newPage();
    await page1.goto('https://viz.polleverywhere.com/multiple_choice_polls/AxE2ULWiYsaGgmZ0Zundf');
//show responses
    await delay(2000)
    await page1.click('div[class="chart-control"]');
    await delay(1000)
    await page1.click('button[title="Show responses"]');
    await delay(2000)
//grab total responses before voting
    const beforeCount = await page1.evaluate(() => {
        const elements = document.getElementsByClassName('count');
        return Array.from(elements).map(element => element.innerText);
    })
    console.log(`The vote count before voting is: ${beforeCount.pop()}`);

//open voting page
    const page2 = await browser.newPage();
    await page2.goto('https://pollev.com/qainterview880');
    await page1.close();
//click button to accept cookies
    await delay(1000)
    await page2.click('button[name=action]');
    await delay(1000)
//enter name
    await page2.waitForSelector('input[class=pe-text-field__input]');
    await page2.$eval('input[class=pe-text-field__input]', el => el.value = 'Poll Everywhere QA');
    await delay(1000)
    await page2.click('button[class=pe-button__button]');
    await delay(1000)
//choose ramshackle as option
    const [voteButton] = await page2.$x("//div[text()[contains(., 'Ramshackle')]]");
    await voteButton.click();
    await delay(3000)

//navigate to vote responses page after voting
    const page3 = await browser.newPage();
    await page3.goto('https://viz.polleverywhere.com/multiple_choice_polls/AxE2ULWiYsaGgmZ0Zundf');
    await page2.close();
//show responses
    await delay(2000)
    await page3.click('div[class="chart-control"]');
    await delay(1000)
    await page3.click('button[title="Show responses"]');
    await delay(2000)
//grab total responses after voting
    const afterCount = await page3.evaluate(() => {
        const elements = document.getElementsByClassName('count');
        return Array.from(elements).map(element => element.innerText);
    })
    console.log(`The vote count after voting is: ${afterCount.pop()}`);

//close browser
    await browser.close();
})();