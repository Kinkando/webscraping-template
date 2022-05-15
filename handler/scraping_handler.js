const express = require('express');
const http = require('./http/http')
const router = express.Router();

function newScrapingHandler(app, scrapingService) {
    let scrapingHandler = new ScrapingHandler(scrapingService);
    router.post('/dynamic', scrapingHandler.webScrapingDynamicJavaScript);
    app.use('/scraping', router);
}

class ScrapingHandler {
    constructor(scrapingService) {
        this.scrapingService = scrapingService;
    };
    async webScrapingDynamicJavaScript(request, response) {
        console.log("Start: Handler webScrapingDynamicJavaScript Scraping");

        let context = {
            url: request.body.url,
            selector: request.body.selector,
            filename_extension: request.body.filename_extension,
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