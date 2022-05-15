// web scraping for dynamic java script rendered DOM finish
const puppeteer = require('puppeteer');

function newScrapingRepository() {
    return new ScrapingRepository();
}

class ScrapingRepository {
    constructor() {

    };
    async webScrapingDynamicJavaScriptRepository(context) {
        console.log("Start: Repository webScrapingDynamicJavaScriptRepository in scraping repository")

        let result = {};

        const browser = await puppeteer.launch({
            'args': [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });

        let page;
        await (async() => {
            page = await browser.newPage();

            await page.goto(context.url);
            for (const key in context.selector) {
                let element = await page.waitForSelector(context.selector[key]);
                if (key == 'img') {
                    let img = await page.evaluate(element => element.getAttribute('srcset'), element);
                    var text = img.substring(0, img.indexOf(context.filename_extension) + context.filename_extension.length).trim()
                } else {
                    var text = await page.evaluate(element => element.innerText, element);
                }
                result[key] = text;
            }
        })()
        .catch(err => result = null)
            .finally(
                async() => await page.close()
            );

        if (result == null) {
            return null;
        }

        result = [result];

        console.log("Data Count: ", result.length)
        console.log("End: Repository webScrapingDynamicJavaScriptRepository in scraping repository")

        return result;
    }
}

module.exports = {
    newScrapingRepository,
    ScrapingRepository,
}