var express = require('express')
var cors = require('cors');

var app = express()

// use it before all route definitions
app.use(cors({origin: '*'}));

const insecamScraper = require('./insecam_scraper')
const classify = require('./classify')
const interpretVision = require('./interpret_vision')


const getTopXClassificationNames = classifications => (
  classifications.map(({ name }) => name).filter(name => name !== 'no person' && name !== 'indoors').slice(0, 7)
)

// respond with "hello world" when a GET request is made to the homepage
app.get('/', async function (req, res) {
  const cameraType = req.query.cameraType
  try {
    const {imageUri, width, height, location} = await insecamScraper.getRandomSnapshot(cameraType)
    const classifications = await classify(imageUri)
    console.log('classified')
    const classificationNames = getTopXClassificationNames(classifications)

    const visions = classificationNames.map(name => ({
      name,
      interpretation: interpretVision(name)
    })).filter(({ interpretation }) => interpretation !== null) 


    res.json({
      imageUri,
      width,
      height,
      visions,
      location
    })
  } catch(e) {
    console.error(e)
    res.status(500).send('Error occured')
  }
})

app.listen(5000);
