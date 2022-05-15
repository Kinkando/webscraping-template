// web scraping for dynamic java script rendered DOM finish
const puppeteer = require('puppeteer');
const request = require('request');
const cheerio = require('cheerio');
const http = require('../handler/http/http')
const text = ['text', 'innerText'];

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
            if (!error && response.statusCode === http.StatusOK) {
                let $ = cheerio.load(body);
                // let $ = cheerio.load("<parent><child src='src1'>text1</child><child src='src2'>text2</child></parent>");
                let result = {};

                for (const object of context.elements) {
                    let element = $(object.selector);
                    // let element = $("child");

                    if (element.length > 1) {
                        /* <tag src="">text</tag>
                         * <tag src="">text</tag>
                         * <tag src="">text</tag>
                         */
                        var value = getElementsByJQuery(element, object.attribute, $)
                    } else {
                        if (element.children().length > 1) { // Nor 0 or 1
                            /* <parent>
                             *      <child>1</child>
                             *      <child>2</child>
                             * </parent>
                             */
                            var value = getElementsByJQuery(element.children(), object.attribute, $)
                        } else {
                            if (text.includes(object.attribute)) {
                                var value = element.text().trim();
                            } else {
                                var value = element.attr(object.attribute);
                            }
                        }
                    }
                    if (value != undefined && value != null) {
                        if (Array.isArray(value) && value.length == 1) {
                            result[object.name] = value[0];
                        } else {
                            result[object.name] = value;
                        }
                    }
                }
                resolve(Object.entries(result).length > 0 ? result : null);
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

        // First we register our listener.
        // Pass function into page.evaluate(), if you want to debug in evaluate function
        page.on('console', msg => {
            for (let i = 0; i < msg._args.length; ++i) {
                let str = `${i}: ${msg._args[i]}`;
                console.log(str.substring(str.indexOf("JSHandle:") + 9));
            }
        });

        for (const object of context.elements) {
            let element = await page.waitForSelector(object.selector);
            var value = await page.evaluate(
                (element, object, text) => {
                    const attribute = object.attribute;
                    const content = object.content;
                    const selfCount = element.parentNode.children.length;
                    const childrenCount = element.children.length;

                    const getElementsByTag = function(elements) {
                        let result = [];
                        for (let i = 0; i < elements.length; i++) {
                            let value = text.includes(attribute) ?
                                elements[i].innerText :
                                elements[i].getAttribute(attribute)

                            if (value != undefined && value != null && !(text.includes(attribute) && value.length == 0)) {
                                result.push(value);
                            }
                        }
                        if (result.length == 0) {
                            return null;
                        }
                        return result;
                    }

                    if (selfCount > 1 && (content != null && content === 'selfs')) {
                        /* <tag src="">text</tag>
                         * <tag src="">text</tag>
                         * <tag src="">text</tag>
                         */
                        var result = getElementsByTag(element.parentNode.children);
                    } else {
                        if (childrenCount > 1 && (content != null && content === 'children')) {
                            /* <parent>
                             *      <child>1</child>
                             *      <child>2</child>
                             * </parent>
                             */
                            var result = getElementsByTag(element.children);
                        } else {
                            var result = text.includes(attribute) ? element.innerText : element.getAttribute(attribute);
                        }
                    }
                    return result;
                },
                element, //pass first variable as argument
                object, //pass second variable as argument
                text, //pass third variable as argument
            );
            if (value != null) {
                if (Array.isArray(value) && value.length == 1) {
                    result[object.name] = value[0];
                } else {
                    result[object.name] = value;
                }
            }
        }
    })()
    .catch(err => result = null)
        .finally(
            async() => await page.close()
        );
    if (result == null || Object.entries(result).length == 0) {
        return null;
    }
    return result;
}

function getElementsByJQuery(elements, attribute, $) {
    let result = []
    if (text.includes(attribute)) {
        for (let i = 0; i < elements.length; i++) {
            const value = $(elements[i]).text().trim();
            if (value != undefined && value != null && value.length > 0) {
                result.push(value)
            }
        }
    } else {
        elements.each((index, e) => {
            const value = e.attribs[attribute];
            if (value != undefined && value != null) {
                result.push(value);
            }
        });
    }
    if (result.length == 0) {
        return null;
    }
    return result;
}

module.exports = {
    newScrapingRepository,
    ScrapingRepository,
}