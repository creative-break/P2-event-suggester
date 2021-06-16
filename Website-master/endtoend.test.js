const puppeteer = require('puppeteer');
/*

*/
/*
test('End-to-end test login', async () => {
    const browser = puppeteer.launch( {
        headless: true,
        slowMo: 100,
    })
    const page = await (await browser).newPage();
    await page.goto('https://sw2b2-14.p2datsw.cs.aau.dk/');
    expect(page.url()).toBe('https://sw2b2-14.p2datsw.cs.aau.dk/'); // Checks if the user starts at the login page

    await page.type("#username", 'admin');
    await page.type("#password", 'test');
    await page.click("#loginBtn");

    await page.waitForNavigation();
    expect(page.url()).toBe("https://sw2b2-14.p2datsw.cs.aau.dk/FindEvents.html"); // Checks if the the login was a success by checking if the user gets redirected after entering login information
},10000);
*/

/*
test('End-to-end test login', async () => {
    const browser = puppeteer.launch( {
        headless: true,
        slowMo: 100,
    })
    const page = await (await browser).newPage();
    await page.goto('https://sw2b2-14.p2datsw.cs.aau.dk/');
    expect(page.url()).toBe('https://sw2b2-14.p2datsw.cs.aau.dk/'); // Checks if the user starts at the login page

    await page.type("#username", 'admin');
    await page.type("#password", 'test');
    await page.click("#loginBtn");

    await page.waitForNavigation();
    expect(page.url()).toBe("https://sw2b2-14.p2datsw.cs.aau.dk/FindEvents.html"); // Checks if the the login was a success by checking if the user gets redirected after entering login information
},10000);
*/
/*
test('End-to-end test user should see events', async () => {
    const browser = puppeteer.launch( {
        headless: false,
        slowMo: 30,
    })
    const page = await (await browser).newPage();
    await page.goto('https://sw2b2-14.p2datsw.cs.aau.dk/');

    await page.type("#username", 'admin');
    await page.type("#password", 'test');
    await page.click("#loginBtn");

    await page.waitForNavigation();

    await page.click("#seeArrangements");
    await page.waitForNavigation();
    await page.setViewport({ width: 2500, height: 1500});
    expect(page.url()).toBe("https://sw2b2-14.p2datsw.cs.aau.dk/Suggestions.html"); // Checks if the website takes us to the Suggestion site
    await page.screenshot({ path: './image.jpg', type: 'jpeg' });   // Takes a screenshot to document that the page suggest events
},10000);
*/
/*
test('End-to-end test go back and search', async () => {
    const browser = puppeteer.launch( {
        headless: true,
        slowMo: 30,
    })
    const page = await (await browser).newPage();
    await page.goto('https://sw2b2-14.p2datsw.cs.aau.dk/');

    await page.type("#username", 'admin');
    await page.type("#password", 'test');
    await page.click("#loginBtn");

    await page.waitForNavigation();

    await page.click("#seeArrangements");
    await page.waitForNavigation();
    expect(page.url()).toBe("https://sw2b2-14.p2datsw.cs.aau.dk/Suggestions.html"); // Checks if the website takes us to the Suggestion site

    await page.click("#forward");

    await page.click("#newSearch");
    expect(page.url()).toBe("https://sw2b2-14.p2datsw.cs.aau.dk/FindEvents.html") // Checks if the button "Ny søgning" takes us back to the find events URL

    await page.click("#seeArrangements");
    await page.waitForNavigation();
    expect(page.url()).toBe("https://sw2b2-14.p2datsw.cs.aau.dk/Suggestions.html"); // Checks if the website takes us to the Suggestion site
},10000);
*/

/*
test('End-to-end test redirect to and new tab', async () => {
    const browser = puppeteer.launch( {
        headless: false,
        slowMo: 30,
        args: [`--window-size=${1920},${1080}`],
        args: ['--windows-size=1920,1080']
    })
    const page = await (await browser).newPage();
    await page.goto('https://sw2b2-14.p2datsw.cs.aau.dk/');

    await page.type("#username", 'admin');
    await page.type("#password", 'test');
    await page.click("#loginBtn");

    await page.waitForNavigation();

    await page.click("#seeArrangements");
    await page.waitForNavigation();
    expect(page.url()).toBe("https://sw2b2-14.p2datsw.cs.aau.dk/Suggestions.html"); // Checks if the website takes us to the Suggestion site
    await page.click('#forward');
    await page.click("#siteNameEvening");
    expect(page.url()).toBe(page.url('#siteNameEvening')); // Checks if the new page url redirected to the intended page 

    await page.screenshot({ path: './image.jpg', type: 'jpeg' });   // Takes a screenshot to document that the page opens a new tab
},100000);
*/

let boxes = [];
boxes = ["sport", "music", "theater", "family", "comedy", "culture", "other", "free"];
let i = 0;
let dialogExits = false;

/*
    const dialogHandler = jest.fn(dialog => dialog.dismiss());
    beforeAll(() => {
      page.on('dialog', dialogHandler);
    });
    */
/*
test('End-to-end test 1', async () => {
    const browser = puppeteer.launch( {
        headless: false,
        slowMo: 30,
        args: [`--window-size=${1920},${1080}`],
        args: ['--windows-size=1920,1080'],
    })
    const page = await (await browser).newPage();
    await page.goto('https://sw2b2-14.p2datsw.cs.aau.dk/');

    //page.on("dialog", async (dialog) => {
     //   console.log(dialog);
     //   await dialog.dismiss();
     //   dialogExits = true;
    //});

    const dialogHandler = jest.fn(dialog => dialog.dismiss());
    beforeAll(() => {
      page.on('dialog', dialogHandler);
    });


    await page.type("#username", 'admin');
    await page.type("#password", 'test');
    await page.click("#loginBtn");

    await page.waitForNavigation();
    expect(page.url()).toBe("https://sw2b2-14.p2datsw.cs.aau.dk/FindEvents.html"); // Checks if the the login was a success by checking the new page URL

    await page.click("#seeArrangements");
    await page.waitForNavigation();
    expect(page.url()).toBe("https://sw2b2-14.p2datsw.cs.aau.dk/Suggestions.html"); // Checks if the website takes us to the Suggestion site

    await page.click("#forward");

    await page.click("#newSearch");
    expect(page.url()).toBe("https://sw2b2-14.p2datsw.cs.aau.dk/FindEvents.html") // Checks if the button "Ny søgning" takes us back to the find events URL

    for(i = 0; i <= boxes.length; i++) {     // tests all the check boxes on the find event URL
        
        await page.click('#' + boxes[i]);       
        await page.click("#seeArrangements");
        /*
        if(dialogExits) {
            await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
            await page.click('#' + boxes[i+1]);
            await page.click("#seeArrangements");
            dialogExits = false;
            console.log('Did i get here');
        } else {
        
       
        expect(page.url()).toBe("https://sw2b2-14.p2datsw.cs.aau.dk/FindEvents.html");  // Checks if the website takes us to the FinEvent site
        await page.waitForNavigation();
        await page.click("#newSearch");
        expect(page.url()).toBe("https://sw2b2-14.p2datsw.cs.aau.dk/FindEvents.html") // Checks if the button "Ny søgning" takes us back to the find events URL
        //}
    }
    await browser.close();
},1000000);
*/
/*
    for(i = 0; i <= 8; i++) {     // tests all the check boxes on the find event URL
        
        await page.click('#' + boxes[i]);
        //await page.click("#alert(noArrangements);")

        await page.click("#seeArrangements");
        expect(page.url()).toBe("https://sw2b2-14.p2datsw.cs.aau.dk/FindEvents.html");
        await page.waitForNavigation();
        await page.click("#newSearch");
         // Checks if the website takes us to the Suggestion site
        
    }
},1000000);
*/
/*
test('Should Login', async () => {
    const browser = puppeteer.launch( {
        headless: false,
        slowMo: 30,
    })
    const page = await (await browser).newPage();
    await page.goto('https://sw2b2-14.p2datsw.cs.aau.dk/');

    await page.type("#username", 'admin');
    await page.type("#password", 'test');
    await page.click("#loginBtn");

    await page.waitForNavigation();

    await page.click("#seeArrangements");
    await page.waitForNavigation();
    expect(page.url()).toBe("https://sw2b2-14.p2datsw.cs.aau.dk/Suggestions.html"); // Checks if the the login was a success by checking the new page url

    //await page.type("#geocoder-control-input", "9000, Aalborg, Nordjylland");
    //await page.$eval('#geocoder-control.leaflet-control', elem => elem.click());
    //await page.$eval('input["geocoder-control-input.leaflet-bar"]', el => el.value = "9000, Aalborg, Nordjylland");
},100000); 

*/

test('End-to-end test', async () => {
    const browser = puppeteer.launch( {
        defaultViewport: null,
        headless: false,
        slowMo: 100,
    })
    const page = await (await browser).newPage();
    await page.goto('https://sw2b2-14.p2datsw.cs.aau.dk/');

    await page.type("#username", 'admin');
    await page.type("#password", 'test');
    await page.click("#loginBtn");

    await page.waitForNavigation();
    await expect(page.url()).toBe("https://sw2b2-14.p2datsw.cs.aau.dk/FindEvents.html"); // Checks if the the login was a success by checking the new page URL

    await page.click("#seeArrangements");
    await page.waitForNavigation();
    await expect(page.url()).toBe("https://sw2b2-14.p2datsw.cs.aau.dk/Suggestions.html"); // Checks if the website takes us to the Suggestion site

    await page.click("#forward");
    await page.screenshot({ path: './image_01.jpg', type: 'jpeg' });   // Takes a screenshot to document that the page shows the user events
    await page.click("#newSearch");
    await expect(page.url()).toBe("https://sw2b2-14.p2datsw.cs.aau.dk/FindEvents.html") // Checks if the button "Ny søgning" takes us back to the find events URL

    await page.click("#music");    // Checks the music box to test if the webpage still shows the user events when a box is checket
    await page.click("#seeArrangements");
    await expect(page.url()).toBe("https://sw2b2-14.p2datsw.cs.aau.dk/Suggestions.html"); // Checks if the website takes us to the Suggestion site
    await page.screenshot({ path: './image_02.jpg', type: 'jpeg' });   // Takes a screenshot to document that the page shows the user events 
},100000);
