// web scraping for dynamic java script rendered DOM finish
const puppeteer = require('puppeteer');
const request = require('request')
const cheerio = require('cheerio')

function newScrapingRepository() {
    return new ScrapingRepository();
}

class ScrapingRepository {
    async webScrapingRepository(context) {
        console.log("Start: Repository webScrapingRepository in scraping repository")

        let result = await doRequest(context);

        if (result == null) {
            return null;
        }

        result = [result];

        console.log("Data Count: ", result.length)
        console.log("End: Repository webScrapingRepository in scraping repository")

        return result;
    };
    async webScrapingDynamicJavaScriptRepository(context) {
        console.log("Start: Repository webScrapingDynamicJavaScriptRepository in scraping repository")

        let result = await doDynamicRequest(context);

        if (result == null) {
            return null;
        }

        result = [result];

        console.log("Data Count: ", result.length)
        console.log("End: Repository webScrapingDynamicJavaScriptRepository in scraping repository")

        return result;
    }
}

function doRequest(context) {
    return new Promise((resolve, reject) => {
        request(context.url, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let $ = cheerio.load(body)
                let result = {};

                for (const object of context.elements) {
                    let element = $(object.selector);
                    if (object.attribute === 'innerText') {
                        result[object.name] = element.text().trim();
                    } else {
                        result[object.name] = element.attr(object.attribute);
                    }
                }

                resolve(result);
            } else {
                resolve(null);
                // reject(error)
            }
        });
    });
}

async function doDynamicRequest(context) {
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
        for (const object of context.elements) {
            let element = await page.waitForSelector(object.selector);
            var value = await page.evaluate(
                (element, attribute) => attribute === 'innerText' ? element.innerText : element.getAttribute(attribute),
                element, //pass first variable as argument
                object.attribute, //pass second variable as argument
            );
            result[object.name] = value;
        }
    })()
    .catch(err => result = null)
        .finally(
            async() => await page.close()
        );
    return result;
}

module.exports = {
    newScrapingRepository,
    ScrapingRepository,
}