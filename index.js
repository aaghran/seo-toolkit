const request = require("request");
const pino = require("pino");
const cheerio = require("cheerio");
const open = require("open");
const puppeteer = require("puppeteer");
const fs = require("fs");

const { checkMeta, scrape } = require("./utils/scrapeUtils");
const { collectInternalLinks } = require("./utils/crawlUtils");

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const crawledPages = [];
const crawledPagesData = [];
let foundPages = [];
let index = 0;

const domain = process.argv[2];

let browser;

initializeBrowser = async () => {
  browser = await puppeteer.launch({
    headless: false,
    // slows down Puppeteer operations
    slowMo: 100,
    // open dev tools
    //   devtools: true,
  });

  await crawl();
};

crawl = async () => {
  // if it's the first start
  if (index === 0) {
    // use / as first page.
    foundPages.push(domain + "/");
  }
  const pageToCrawl = foundPages[index];
  // exit the process if both arrays are the same or the next page is not defined
  if (foundPages === crawledPages || !pageToCrawl) {
    // stop
    fs.writeFileSync(
      "./seo-ui/src/urls_" + domain + ".json",
      JSON.stringify({ data: crawledPagesData }),
      function (err) {
        if (err) throw err;
      }
    );
    open("http://localhost:3000/");
    process.exit();
  }

  // if pageToCrawl is not yet in list of crawledPages
  if (crawledPages.indexOf(pageToCrawl) === -1) {
    if (pageToCrawl) {
      new Promise((resolve) => {
        // visit the page
        visitPage(pageToCrawl, resolve);
      }).then(function () {
        index++;
        crawl();
      });
    } else {
      process.nextTick(crawl);
    }
  } else {
    // go to next crawl
    process.nextTick(crawl);
  }
};

visitPage = async (url, callback) => {
  crawledPagesData.push({
    url: url,
  });

  // Make the request
  request("http://" + url, function (error, response, body) {
    // Check status code (200 is HTTP OK)
    if (!response || response.statusCode !== 200) {
      process.nextTick(callback);
      return;
    }
    // Add URL to crawled Pages
    crawledPages.push(url);
    var $ = cheerio.load(body);
    checkMeta($, url, crawledPagesData);

    // collect all links
    collectInternalLinks($, domain, foundPages, crawledPagesData, url).then(
      (newFoundPages) => {
        foundPages = newFoundPages;
        callback();
      }
    );
  });

  try {
    await scrape(url, crawledPagesData, browser);
  } catch (e) {
    logger.error("scrape failed ", url);
    logger.error(e);
    let obj = crawledPagesData.find((x) => x.url == url);
    if (!obj) {
      crawledPagesData.push({
        name: url,
      });
    }
    obj = crawledPagesData.find((x) => x.url == url);
    let index = crawledPagesData.indexOf(obj);
    crawledPagesData[index]["status"] = false;
  }

  fs.writeFileSync(
    "./seo-ui/src/urls_" + domain + ".json",
    JSON.stringify({ data: crawledPagesData }),
    function (err) {
      if (err) throw err;
    }
  );
};

initializeBrowser();
