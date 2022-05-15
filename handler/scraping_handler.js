const express = require('express');
const http = require('./http/http')
const router = express.Router();

function newScrapingHandler(app, scrapingService) {
    let scrapingHandler = new ScrapingHandler(scrapingService);
    router.post('', scrapingHandler.webScraping);
    router.post('/dynamic', scrapingHandler.webScrapingDynamicJavaScript);
    app.use('/scraping', router);
}

class ScrapingHandler {
    constructor(scrapingService) {
        this.scrapingService = scrapingService;
    };
    async webScraping(request, response) {
        console.log("Start: Handler webScraping Scraping");

        let context = {
            url: request.body.url,
            elements: request.body.elements,
        };

        let result = await scrapingService.webScrapingService(context);
        if (result == undefined || result == null) {
            response.status(http.StatusInternalServerError);
            return response.send([{ message: "Error" }]);
        }

        console.log("End: Handler webScraping Scraping");

        response.status(http.StatusOK)
        return response.send(result)
    };
    async webScrapingDynamicJavaScript(request, response) {
        console.log("Start: Handler webScrapingDynamicJavaScript Scraping");

        let context = {
            url: request.body.url,
            elements: request.body.elements,
        };

        let result = await scrapingService.webScrapingDynamicJavaScriptService(context);
        if (result == undefined || result == null) {
            response.status(http.StatusInternalServerError);
            return response.send([{ message: "Error" }]);
        }

        console.log("End: Handler webScrapingDynamicJavaScript Scraping");

        response.status(http.StatusOK)
        return response.send(result)
    };
}

module.exports = {
    newScrapingHandler,
    ScrapingHandler,
}