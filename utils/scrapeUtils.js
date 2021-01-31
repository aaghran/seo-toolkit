const puppeteer = require("puppeteer");

scrape = async (url, crawledPagesData) => {
  const browser = await puppeteer.launch({
    headless: true,
    // slows down Puppeteer operations
    slowMo: 100,
    // open dev tools
    //   devtools: true,
  });
  console.log(url);
  console.log("browser launched");
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  try {
    await page.goto(`https://${url}/`);
  } catch {
    return;
  }

  //   await page.waitForSelector("h1");
  console.log("page loaded");
  await autoScroll(page);

  const pageMetrics = await page.metrics();

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



//   await page.screenshot({
//     fullPage: true,
//     path: `./images/${url.replaceAll("/", "_")}.png`,
//   });

  //   console.log(titles);
  console.log("seo");

  let obj = crawledPagesData.find((x) => x.url == url);
  let index = crawledPagesData.indexOf(obj);
  crawledPagesData[index]["h1"] = h1;
  crawledPagesData[index]["h2"] = h2;
  crawledPagesData[index]["images"] = images;
  crawledPagesData[index]["pageMetrics"] = pageMetrics;
  console.log(crawledPagesData[index]);

  
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

  keys.forEach(function (key) {
    if (meta[key].attribs && meta[key].attribs.property) {
      metatags.push({
        meta: meta[key].attribs.property,
        content: meta[key].attribs.content,
      });
    }
  });

  console.log("metatags");

  let obj = crawledPagesData.find((x) => x.url == url);
  let index = crawledPagesData.indexOf(obj);
  crawledPagesData[index]["metatags"] = metatags;
  console.log(crawledPagesData[index]);
};

module.exports = {
  autoScroll,
  checkMeta,
  scrape,
};
