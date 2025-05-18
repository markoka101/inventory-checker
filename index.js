const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

//functions for alert and email functionality taken from respective files
const sendEmail = require("./sendEmail.js");
const noti = require("./window-notify.js");

//variables for the page
const { path, htmlSection } = require("./PageVariables.js");

// Add stealth plugin
puppeteer.use(StealthPlugin());

/*
This kinda simulates a human by openning an instance of the webpage and refreshing using random timing
Times can easily be adjusted, but I wouldn't recommend making it shorter
*/
(async () => {
    //launching broswer and starting page
    //if you want to see the browser set headleess to false, but it will take more resources and doesn't change anything
    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage();

    //go to the specified path
    await page.goto(path);

    //runs until the button does not exist
    while (true) {
        //the button is set for the specified section in the page
        const buttonSelector = htmlSection;

        //track whether the button was found
        let found = false;

        //this will check for the button. It will run 8 times to make sure there is no false reading
        for (let i = 0; i < 8; i++) {
            const button = await page.$(buttonSelector);
            //checks if the button does in fact exist, if it does we break this for loop
            if (button) {
                //extract text from button and trim leading and tailing whitespace
                const buttonText = await page.evaluate(
                    (el) => el.textContent.trim(),
                    button
                );

                //only say button was found when it equals this text as that means
                //that the product is still not available
                if (buttonText === "NOTIFY ME WHEN AVAILABLE") {
                    found = true;
                }

                break;
            } else {
                //reload page then pause for 2 to 5 seconds
                await page.reload();

                await new Promise(
                    (res) => setTimeout(res, Math.random() * 5001) + 2000
                );
            }
        }

        //if after checks button isn't found send notification and email then break out of loop
        if (!found) {
            noti.windowNotif();
            sendEmail.sendEmail();
            break;
        }

        // pause for 20 - 35 seconds then reload page
        await new Promise((res) =>
            setTimeout(res, Math.floor(Math.random() * 35001) + 20000)
        );
        await page.reload();
    }

    //close browser and complete program
    await browser.close();
})();
