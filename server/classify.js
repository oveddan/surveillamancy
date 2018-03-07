const Clarifai = require('clarifai')

// instantiate a new Clarifai app passing in your api key.
const app = new Clarifai.App({
 apiKey: 'a31b04c2a118456bb3782614e3948ee2'
});

const extractClassifications = prediction => {
  const [dataElement] = prediction.outputs.filter(output => output.data)

  return dataElement.data.concepts
}

async function classify(imageUri) {
  const prediction = await app.models.predict(Clarifai.GENERAL_MODEL, imageUri)

  return extractClassifications(prediction)
}

module.exports = classify
