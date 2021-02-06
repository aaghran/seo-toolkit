const pino = require("pino");
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

scrape = async (url, crawledPagesData, browser) => {
  logger.info(url);
  logger.info("page launched: ", url);
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  try {
    await page.goto(`https://${url}/`);
  } catch {
    logger.error("error goto", url)
    return;
  }

  //   await page.waitForSelector("h1");
  logger.info("page loaded");
  await autoScroll(page);

  const pageMetrics = await page.metrics();

  const title = await page.$$eval("title", (elements) => {
    return elements.map((item) => item.textContent);
  });

  const h1 = await page.$$eval("h1", (elements) => {
    return elements.map((item) => item.textContent);
  });

  const h2 = await page.$$eval("h2", (elements) => {
    return elements.map((item) => item.textContent);
  });

  const images = await page.$$eval("img", (elements) => {
    return elements.map((item) => ({
      src: item.getAttribute("src"),
      alt: item.getAttribute("alt"),
    }));
  });

  await page.screenshot({
    fullPage: true,
    path: `./images/${url.replaceAll("/", "_")}.png`,
  });

  logger.info("seo");

  let obj = crawledPagesData.find((x) => x.url == url);
  let index = crawledPagesData.indexOf(obj);
  let seoObject = {
    h1,
    h2,
    title,
    images,
  };
  crawledPagesData[index]["seo"] = seoObject;
  crawledPagesData[index]["pageMetrics"] = pageMetrics;
  // logger(crawledPagesData[index]);

  await browser.close();

  return;
};

//Scroll page https://stackoverflow.com/questions/51529332/puppeteer-scroll-down-until-you-cant-anymore
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

checkMeta = ($, url, crawledPagesData) => {
  // Parse the document body
  var meta = $("meta");
  var keys = Object.keys(meta);
  var metatags = [];
  // logger(metatags);
  keys.forEach(function (key) {
    if (meta[key].attribs && meta[key].attribs.property) {
      metatags.push({
        meta: meta[key].attribs.property,
        content: meta[key].attribs.content,
      });
    }
  });

  logger.info("metatags");

  let obj = crawledPagesData.find((x) => x.url == url);
  let index = crawledPagesData.indexOf(obj);
  crawledPagesData[index]["metatags"] = metatags;
  // logger(crawledPagesData[index]);
};

module.exports = {
  autoScroll,
  checkMeta,
  scrape,
};
