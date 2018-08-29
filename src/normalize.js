const fs = require('fs');
const parser = require('csv-parse');
const { formatTimestamp, formatZipcode, formatName, formatAddress, formatDuration } = require('./config/utils');

const csvFile = 'sample.csv';

const readStream = fs.createReadStream(csvFile, 'utf8').pipe(
  parser({
    deliminator: ','
  })
);

readStream.on('data', chunk => {
  console.log(chunk);
});
