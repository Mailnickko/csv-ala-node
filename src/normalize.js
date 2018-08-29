const fs = require('fs');
const parser = require('csv-parse');
const { formatTimestamp, formatZipcode, formatName, formatAddress, formatDuration } = require('./config/utils');

const csvFile = 'sample.csv';

const readStream = fs.createReadStream(csvFile, 'utf8').pipe(
  parser({
    deliminator: ','
  })
);

let isHeaderLine = true;

readStream.on('data', chunk => {
  let formatted;
  if (isHeaderLine) {
    isHeaderLine = false;
    formatted = chunk;
  } else {
    const [timestamp, address, zipcode, fullName, fooDur, barDur, totalDur, notes] = chunk;
    formatted = [
      timestamp,
      address,
      formatZipcode(zipcode),
      formatName(fullName),
      formatDuration(fooDur),
      formatDuration(barDur),
      totalDur,
      notes
    ];
  }
  console.log(formatted);
});
