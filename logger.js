const fs = require('fs');

const date = new Date();

const options = {
  timeZone: 'America/New_York',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

const logOut = async (fileName, message) => {
  const logDateTime = date.toLocaleString('en-US', options).replace(/\s/g, '');

  await fs.appendFile(fileName, `${logDateTime}: ${message}` + '\n', (err) => {
    console.log(message);
    if (err) {
      console.log(err);
      throw new Error(err.message);
    }
  });
};

module.exports = { logOut };
