const puppeteer = require('puppeteer');
const fs = require('fs');
const util = require('util')
const fs_writeFile = util.promisify(fs.writeFile)

process.setMaxListeners(30)

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

async function scrapeLetter(letter) {
  console.log('scraping ', letter)
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://nickm.com/dreams/alpha/${letter}.html`);

  const result = await page.evaluate(() => {
    const children = document.querySelectorAll('h2, p:not(.lettermenu)')

    let currentWord = { meanings: [] }
    const wordsAndMeanings = []

    children.forEach(node => {
      if (node.tagName.toLowerCase() === 'h2') {
        currentWord = { name: node.querySelector('a').innerText, meanings : [] }
        wordsAndMeanings.push(currentWord)
      } else {
        currentWord.meanings.push(node.innerText)
      }
    })

    return wordsAndMeanings
  })

  return result
}

async function scrapeDreams() {
  return Promise.all(letters.map(scrapeLetter))
}


async function scrapeAndSaveDreams() {
  const dreamsByLetter = await scrapeDreams()

  const dreams = dreamsByLetter.reduce((result, dreamsOfLetter) => ([...result, ...dreamsOfLetter]), [])

  await fs_writeFile('dreams.json', JSON.stringify(dreams), 'utf8');

  console.log('finished')
}

scrapeAndSaveDreams()
