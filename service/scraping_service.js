function newScrapingService(scrapingRepository) {
    return new ScrapingService(scrapingRepository);
}

class ScrapingService {
    constructor(scrapingiRepository) {
        this.scrapingiRepository = scrapingiRepository
    };
    async webScrapingDynamicJavaScriptService(context) {
        console.log("Start: Service webScrapingDynamicJavaScriptService in scraping service")

        let result = await scrapingRepository.webScrapingDynamicJavaScriptRepository(context);

        if (result != undefined && result != null) {
            console.log("Data Count: ", result.length)
        }
        console.log("End: Service webScrapingDynamicJavaScriptService in scraping service")
        return result;
    }
}

module.exports = {
    newScrapingService,
    ScrapingService,
}