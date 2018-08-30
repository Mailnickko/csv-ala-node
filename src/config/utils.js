const moment = require('moment-timezone');
const CONSTANTS = {
  TIME_FORMAT: 'MM/DD/YY hh:mm:ss A',
  TIME_ZONE: 'America/New_York',
  LOCALES: ['en-US'],
  ZIP_LENGTH: 5
};

/**
 * @function formatTimestamp
 * @param {string} timestamp - stringified timestamp
 * @returns {string} returns time string formatted to ISO-8601
 */
const formatTimestamp = timestamp => {
  const formatted = moment.tz(timestamp, CONSTANTS.TIME_FORMAT, CONSTANTS.TIME_ZONE);
  if (formatted.isValid()) {
    return formatted.toISOString();
  } else {
    throw new Error('timestamp is not valid');
  }
};

/**
 * @function formatZipcode
 * @param {string} zipcode - stringified zipcode
 * @returns {string} zipcode formatted to 5 chars
 */
const formatZipcode = zipcode => {
  if (zipcode.length > CONSTANTS.ZIP_LENGTH) {
    zipcode = zipcode.slice(0, CONSTANTS.ZIP_LENGTH);
  } else if (zipcode.length < CONSTANTS.ZIP_LENGTH) {
    const zipLengthDiff = CONSTANTS.ZIP_LENGTH - zipcode.length;
    zipcode = '0'.repeat(zipLengthDiff) + zipcode;
  }
  return zipcode;
};

/**
 * @function formatName
 * @param {string} name - name to uppsercase
 * @param {array} locales - fallback locales to use, default to en-US
 * @returns {string} uppercased name
 */
const formatName = (name, locales = CONSTANTS.LOCALES) => {
  return name.toLocaleUpperCase(locales);
};

/**
 * @function formatDuration
 * @returns {function}
 * returns a closure function that accepts a "time (sample shape: 111:23:32.123)"
 * string param to keep track of cache in enclosing function
 */
const formatDuration = () => {
  const memo = {};
  return time => {
    if (!memo[time]) {
      const [hours, minutes, seconds] = time.split(':');
      const hoursToSeconds = parseInt(hours, 10) * 60 * 60;
      const minutesToSeconds = parseInt(minutes, 10) * 60;
      const roundedSeconds = Math.round(parseFloat(seconds, 10));
      memo[time] = hoursToSeconds + minutesToSeconds + roundedSeconds;
    }
    return memo[time];
  };
};

/**
 * @function combineDurations
 * @param {number} time1 - time in seconds
 * @param {number} time2 - time in seconds
 * @returns {number} returns the sum given time in seconds
 */
const combineDurations = (time1, time2) => time1 + time2;

module.exports = {
  formatTimestamp,
  formatZipcode,
  formatName,
  formatDuration: formatDuration(),
  combineDurations
};
