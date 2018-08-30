const fs = require('fs');
const parser = require('csv-parse');
const { formatTimestamp, formatZipcode, formatName, formatDuration, combineDurations } = require('./config/utils');

const csvFile = 'sample.csv';
console.log('__', __dirname);
const outputPath = `${__dirname}/../output/`;

// Check to see if output directory exists, if not make it!
/**
 * @function makeOutputDir
 * @param {string} dirPath - the path to make output directory
 * @returns {void} returns nothing
 */
const makeOutputDir = dirPath => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
};

/**
 * @function createCSVOutput
 * @returns {void} returns nothing
 * @description
 * Parse through csvFile, make transformations, then output to destinationFile
 */
const createCSVOutput = () => {
  const destinationFile = csvFile.split('.').join('-normalized');
  const writeStream = fs.createWriteStream(outputPath + destinationFile);
  const readStream = fs.createReadStream(csvFile, 'utf8').pipe(
    parser({
      deliminator: ','
    })
  );
  let isHeaderLine = true;
  readStream
    .on('data', chunk => {
      let formatted;
      if (isHeaderLine) {
        isHeaderLine = false;
        formatted = chunk;
      } else {
        const [timestamp, address, zipcode, fullName, fooDur, barDur, totalDur, notes] = chunk;
        formatted = [
          formatTimestamp(timestamp),
          address,
          formatZipcode(zipcode),
          formatName(fullName),
          formatDuration(fooDur),
          formatDuration(barDur),
          combineDurations(formatDuration(fooDur), formatDuration(barDur)),
          notes
        ].join(',');
      }
      writeStream.write(formatted + '\n');
    })
    .on('end', () => {
      console.log('We done');
    });
};

makeOutputDir(outputPath);
createCSVOutput();
