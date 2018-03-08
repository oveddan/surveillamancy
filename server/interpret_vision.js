const fs = require('fs');

var dreams = JSON.parse(fs.readFileSync("dreams.json"));

const getRandomMeaning = meanings => {
  const randomMeaningIndex = Math.floor(Math.random() * meanings.length)

  return meanings[randomMeaningIndex]
}

const changeToSoundLikeVision = dreamMeaning => (
  dreamMeaning
    .replace('To dream of', 'To see')
    .replace('to dream of', 'to see')
    .replace('To dream that', 'To see that')
    .replace('to dream that', 'to see that')
    .replace('dreamer', 'voyeur')
    .replace('dreaming', 'voyeuring')
    .replace('dream of', 'see')
    .replace('in a dream', '')
)

const getMeaningForDreamName = (visionName) => {
  let meaning = null

  const dreamsForName = dreams.filter(({ name }) => name.toLowerCase() === visionName)

  if (dreamsForName.length > 0) {
    let meanings = dreamsForName[0].meanings

    const dreamMeaning = getRandomMeaning(meanings)

    if (dreamMeaning.indexOf('See') === 0) {
      const referral = dreamMeaning.split(' ')[1]
      return getMeaningForDreamName(referral)
    }

    meaning = changeToSoundLikeVision(dreamMeaning)
  }

  return meaning
}

const intepretVision = visionName => {
  const lowerName = visionName.toLowerCase()

  return getMeaningForDreamName(lowerName)
}

module.exports = intepretVision
