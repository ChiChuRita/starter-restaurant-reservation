/**
 * Formats a Date object as YYYY-MM-DD.
 *
 * This function is *not* exported because the UI should generally avoid working directly with Date instance.
 * You may export this function if you need it.
 *
 * @param date
 *  an instance of a date object
 * @returns {string}
 *  the specified Date formatted as YYYY-MM-DD
 */
const asDateString = (date) => {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

/** Formats the date of today as YYYY-MM-DD.
 * @returns {string}
 * Todays date formatted as YYYY-MM-DD
*/
const today = () => {
  return asDateString(new Date());
}

module.exports = {
  today
}
