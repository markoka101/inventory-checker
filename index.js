const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const sendEmail = require("./sendEmail.js");
const noti = require("./window-notify.js");
const { path, htmlSection } = require("./PageVariables.js");

// Add stealth plugin
puppeteer.use(StealthPlugin());

/*
This kinda simulates a human clicking the refresh button and uses random timing
*/
(async () => {
    //launching broswer and starting page
    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage();

    //go to the page
    await page.goto(path);

    //runs until the button does not exisit
    while (true) {
        //this is the button
        const buttonSelector = htmlSection;

        //track whether the button was found
        let found = false;

        //run 8 times to make sure there is no fluke
        for (let i = 0; i < 8; i++) {
            const button = await page.$(buttonSelector);
            if (button) {
                //extract text from button
                const buttonText = await page.evaluate(
                    (el) => el.textContent.trim(),
                    button
                );

                //only say button was found when it equals this text
                if (buttonText === "NOTIFY ME WHEN AVAILABLE") {
                    found = true;
                }

                break;
            } else {
                await page.reload();

                // pause for 3 - 7 seconds and check again
                await new Promise(
                    (res) => setTimeout(res, Math.random() * 7001) + 3000
                );
            }
        }

        //if after checks button isn't found send alerts
        if (!found) {
            noti.windowNotif();
            sendEmail.sendEmail();
            break;
        }

        // pause for 30 - 60 seconds
        console.log("restarting");
        await new Promise((res) =>
            setTimeout(res, Math.floor(Math.random() * 60001) + 30000)
        );
        await page.reload();
    }

    //close browser and kill process
    await browser.close();
})();
