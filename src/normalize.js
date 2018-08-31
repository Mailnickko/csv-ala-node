const fs = require('fs');
const parser = require('csv-parse');
const { formatTimestamp, formatZipcode, formatName, formatDuration, combineDurations } = require('./config/utils');

const csvFile = process.argv[2] || 'sample.csv';
const csvPath = `${__dirname}/../${csvFile}`;
const outputPath = `${__dirname}/../output/`;

/**
 * @function makeOutputDir
 * @param {string} dirPath - the path to make output directory
 * @returns {void} returns nothing
 * @description
 * Check to see if output directory exists, if not make it!
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
  const destinationFile = csvFile.split('.').join('-normalized.');
  const writeStream = fs.createWriteStream(outputPath + destinationFile);
  const readStream = fs.createReadStream(csvPath, 'utf8').pipe(
    parser({
      deliminator: ','
    })
  );
  let isHeaderLine = true;
  readStream
    .on('data', chunk => {
      let formatted;
      let isAllValidData = true;
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
        ];

        isAllValidData = formatted.every(data => {
          return data !== false;
        });
      }
      if (isAllValidData) {
        writeStream.write(formatted.join(',') + '\n');
      }
    })
    .on('end', () => {
      console.log('Finished! Checkout the output directory');
    });
};

makeOutputDir(outputPath);
createCSVOutput();
