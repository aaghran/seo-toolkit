const pino = require("pino");
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

collectInternalLinks = ($, domain, foundPages, crawledPagesData, url) => {
  return new Promise((resolve) => {
    const elements =
      "a[href^='http://" +
      domain +
      "']:not(a[href^='mailto']), " +
      "a[href^='https://" +
      domain +
      "']:not(a[href^='mailto']), " +
      "a[href^='https://www." +
      domain +
      "']:not(a[href^='mailto']), " +
      "a[href^='http://www." +
      domain +
      "']:not(a[href^='mailto']), " +
      "a[href^='/']:not(a[href^='mailto'])";

    const relativeLinks = $(elements);
    let internalLinks = []

    relativeLinks.each(function (i, e) {
      let href = $(this).attr("href");

      if (href.indexOf("www.") !== -1) {
        href = href.substr(href.indexOf("www.") + 4, href.length);
      }
      if (href.indexOf("http") === 0) {
        href = href.substr(href.indexOf("://") + 3, href.length);
      } else if (href.indexOf("/") === 0) {
          if (!href.includes(domain)) 
            href = domain + href;
      }
      // only add the href to the foundPages if it's not there yet.
      if (foundPages.indexOf(href) === -1 && href.includes(domain)) {
        // logger.info(href);
        foundPages.push(href);
        internalLinks.push(href);
      }
    });

    let obj = crawledPagesData.find((x) => x.url == url);
    let index = crawledPagesData.indexOf(obj);
    crawledPagesData[index]["internalLinks"] = internalLinks;
    // logger.info(crawledPagesData[index]);

    resolve(foundPages);
  });
};

module.exports = {
  collectInternalLinks,
};
