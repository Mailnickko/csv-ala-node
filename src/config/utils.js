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
 * @description
 * Format time to ISO-8601, if date is not valid, return false
 */
const formatTimestamp = timestamp => {
  const formatted = moment.tz(timestamp, CONSTANTS.TIME_FORMAT, CONSTANTS.TIME_ZONE);
  if (formatted.isValid()) {
    return formatted.toISOString();
  } else {
    console.log('Date field is invalid');
    return false;
  }
};

/**
 * @function formatZipcode
 * @param {string} zipcode - stringified zipcode
 * @returns {string} zipcode formatted to 5 chars
 * @description
 * Format zip code to be length of 5
 * If length is more than 5, slice the first 5 (will this ever be a case?)
 * If less, than prepend 0's until length is 5
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
 * @param {string} name - name to uppercase
 * @param {array} locales - fallback locales to use, default to en-US
 * @returns {string} uppercased name
 * @description
 * Uppercases the name string
 * Use locales is provided, otherwise fallback the en-US
 */
const formatName = (name, locales = CONSTANTS.LOCALES) => {
  return name.toLocaleUpperCase(locales);
};

/**
 * @function formatDuration
 * @returns {function} returns a closure function
 * @description
 * Returns a closure function that accepts a "time (sample shape: 111:23:32.123)"
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
 * @description
 * Returns sum of two number inputs
 */
const combineDurations = (time1, time2) => time1 + time2;

module.exports = {
  formatTimestamp,
  formatZipcode,
  formatName,
  formatDuration: formatDuration(),
  combineDurations
};
