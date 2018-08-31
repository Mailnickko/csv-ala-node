const fs = require('fs');
const parser = require('csv-parse');
const { formatTimestamp, formatZipcode, formatName, formatDuration, combineDurations } = require('./config/utils');

const csvFile = process.argv[2] || 'sample.csv';
const csvPath = `${__dirname}/../${csvFile}`;
const outputPath = `${__dirname}/../output/`;

/**
 * @function validateFileInRootDir
 * @param {string} csvFile - name of csv file
 * @param {string} csvPath - path to csv file
 * @returns {void} returns nothing
 * @description
 * Checks to see if the requested file exists in root dir
 * If so, invoke makeOutputDir, otherwise, throw an error in console.
 */
const validateFileInRootDir = (csvFile, csvPath) => {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`${csvFile} does not exist in the root directory`);
  } else {
    makeOutputDir(outputPath);
  }
};

/**
 * @function makeOutputDir
 * @param {string} dirPath - the path to make output directory
 * @returns {void} returns nothing
 * @description
 * Check to see if output directory exists, if not make it!
 * Then continue parse csv file
 */
const makeOutputDir = dirPath => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
  createCSVOutput();
};

/**
 * @function createCSVOutput
 * @returns {void} returns nothing
 * @description
 * Create read and write steams
 * Write first line, since that is header,
 * For subsequent lines, make necessary transformations
 * Check to see if all data is valid for current chunk
 * If valid write to output file, otherwise skip it
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

        // Let's confirm all data is valid, if not, we'll skip adding this row
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

validateFileInRootDir(csvFile, csvPath);
