const adjectiveList = require('./adjectives');

const randomIndex = Math.floor(Math.random() * adjectiveList.length);

module.exports = adjectiveList[randomIndex];
