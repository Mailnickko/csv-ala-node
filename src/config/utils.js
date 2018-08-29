/**
 * @function formatTimestamp
 */
const formatTimestamp = () => {};

/**
 * @function formatZipcode
 * @param {string} zipcode - stringified zipcode
 * @returns {string} zipcode formatted to 5 chars
 */
const formatZipcode = zipcode => {
  if (zipcode.length > 5) {
    zipcode = zipcode.slice(0, 5);
  } else if (zipcode.length < 5) {
    const zipLengthDiff = 5 - zipcode.length;
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
const formatName = (name, locales = ['en-US']) => {
  return name.toLocaleUpperCase(locales);
};

/**
 * @function formatAddress
 */
const formatAddress = () => {};

/**
 * @function formatDuration
 * @param {string} time - stringified time format, sample shape: 111:23:32.123
 * @returns {number} breaks out time format and converts to seconds
 */
const formatDuration = time => {
  const [hours, minutes, seconds] = time.split(':');
  const hoursToSeconds = parseInt(hours, 10) * 60 * 60;
  const minutesToSeconds = parseInt(minutes, 10) * 60;
  const roundedSeconds = Math.round(parseFloat(seconds, 10));
  return hoursToSeconds + minutesToSeconds + roundedSeconds;
};

module.exports = {
  formatTimestamp,
  formatZipcode,
  formatName,
  formatAddress,
  formatDuration
};
