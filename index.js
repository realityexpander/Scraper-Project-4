const puppeteer = require('puppeteer');

// Puppeteer docs
// https://developers.google.com/web/tools/puppeteer
// https://www.npmjs.com/package/puppeteer/v/1.11.0-next.1547527073587

//Puppeteer Firewall message fix
// https://stackoverflow.com/questions/54545193/puppeteer-chromium-on-mac-chronically-prompting-accept-incoming-network-connect
// https://github.com/puppeteer/puppeteer/issues/4752
// https://support.apple.com/en-gb/guide/keychain-access/kyca2686/mac

const url = 'https://old.reddit.com/r/learnprogramming/comments/4q6tae/i_highly_recommend_harvards_free_online_2016_cs50/';

(async () => {
  
  const browser = await puppeteer.launch({headless:true});
  const page = await browser.newPage();
  await page.goto(url);
  // await page.screenshot({path: 'example.png'});
 
  // expand all comments thread
  let expandButtons = await page.$$('.morecomments')

  // while (expandButtons.length) {
  //   for (let button of expandButtons ) {
  //     await button.click()
  //     await page.waitFor(500)
  //   }
  //   await page.waitFor(1000)
  //   expandButtons = await page.$$('.morecomments')
  // }

  // select all comments, scrape text and points
  const comments = await page.$$('.entry')
  const formattedComments = []
  for (let comment of comments) {
    // scrape points
    const points = await comment.$eval('.score', el => el.textContent)
                                .catch( err => console.error("no score"))
                                
    // scrape text
    const rawText = await comment.$eval('.usertext-body', el => el.textContent)
                              .catch( err => console.error("no user text") )
    
    if (points && rawText) {
      // const text = rawText.replace(/\n/g, '') // regex style
      const text = rawText.trim()
      formattedComments.push({points, text})
    }

  }

  console.log({formattedComments})

  // sort comments by points

  // insert into google spreadsheet

  await browser.close();

})()