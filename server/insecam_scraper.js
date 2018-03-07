const puppeteer = require('puppeteer');
const Datauri = require('datauri')
const datauri = new Datauri();

async function getRandomSnapshot(cameraType) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log('navigating to page');
  await page.goto(`https://www.insecam.org/en/bytag/${cameraType}`);

  const randomLink = await page.evaluate(() => {
    const elements = document.querySelectorAll('.thumbnail-item__wrap');
    const randomElementNumber = Math.floor(Math.random() * elements.length)
    const randomElement = elements[randomElementNumber];

    return randomElement.getAttribute('href')
  });

  console.log('random link', randomLink);

  await page.goto(`https://www.insecam.org${randomLink}`);

  console.log('capturing screenshot')


  const rect = await page.evaluate(() => {
    const element = document.querySelector('.grid-container img');
    const {x, y, width, height} = element.getBoundingClientRect();
    return {left: x, top: y, width, height, id: element.id};
  });
  console.log('image rect', rect);

  const padding = 0;

  const width = rect.width + padding * 2
  const height = rect.height + padding * 2
  const screenshot = await page.screenshot({
    clip: {
      x: rect.left - padding,
      y: rect.top - padding,
      width,
      height
    }
  });

  console.log('getting location')
  const location = await page.evaluate(() => {
    const element = document.querySelector('h1')
    if (element) {
      const contents = element.innerText
      if (contents.indexOf('in') >= 0) {
        const startLocation = contents.indexOf('in') + 3
        return contents.substring(startLocation, contents.length)
      }
    }

    return null
  })

  console.log('location is', location)
  datauri.format('.png', screenshot)

  const imageUri = datauri.base64

  await browser.close();

  return {
    imageUri,
    width,
    height,
    location
  }
};



module.exports = {
  getRandomSnapshot
}
