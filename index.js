const { POINT_CONVERSION_HYBRID } = require("constants");
const puppeteer = require("puppeteer");
const Sheet = require("./sheet");

// Puppeteer docs
// https://developers.google.com/web/tools/puppeteer
// https://www.npmjs.com/package/puppeteer/v/1.11.0-next.1547527073587

//Puppeteer Firewall message fix
// https://stackoverflow.com/questions/54545193/puppeteer-chromium-on-mac-chronically-prompting-accept-incoming-network-connect
// https://github.com/puppeteer/puppeteer/issues/4752
// https://support.apple.com/en-gb/guide/keychain-access/kyca2686/mac

// Google sheet docs
// https://www.npmjs.com/package/google-spreadsheet

// Sheet
// https://docs.google.com/spreadsheets/d/1WDxlusy9tCNU8vdVyEjRrXIkkAOdsn45wGrTw2F4nzQ/edit#gid=0


const url = "https://old.reddit.com/r/learnprogramming/comments/4q6tae/i_highly_recommend_harvards_free_online_2016_cs50/";

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);
  // await page.screenshot({path: 'example.png'});

  let sheet = new Sheet()
  sheet.load()

  // create sheet with title
  let title = await page.$eval('.title a', el => el.textContent )
  const sheetIndex = await sheet.addSheet( title.slice(0,99), ['points', 'text'] )

  // expand all comments thread
  let expandButtons = await page.$$(".morecomments");
  while (expandButtons.length) {
    for (let button of expandButtons ) {
      await button.click()
      await page.waitFor(500)
    }
    await page.waitFor(1000)
    expandButtons = await page.$$('.morecomments')
  }

  // select all comments, scrape text and points
  const comments = await page.$$(".entry");
  const formattedComments = [];
  for (let comment of comments) {
    // scrape points
    const points = await comment
      .$eval(".score", (el) => el.textContent)
      .catch((err) => console.error("no score"));

    // scrape text
    const rawText = await comment
      .$eval(".usertext-body", (el) => el.textContent)
      .catch((err) => console.error("no user text"));

    if (points && rawText) {
      // const text = rawText.replace(/\n/g, '') // regex style
      const text = rawText.trim();
      formattedComments.push({ points, text });
    }
  }
  
  // sort comments by points
  formattedComments.sort( (a,b) => {
    let pointsA = Number(a.points.split(' ')[0])
    let pointsB = Number(b.points.split(' ')[0])
    return pointsB - pointsA
  })
  
  console.log("Line of comments: ",formattedComments.length);
  
  // insert into google spreadsheet
  sheet.addRows(formattedComments, sheetIndex)

  await browser.close();
})();
