/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();
    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * api call to request the data of all reservations (api call for US-01 and US-07)
 * @param {{date, mobile_number}} params the date and/or mobile_number of the requested reservations
 * @returns the data of the reservation
 */

export async function getReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * api call to request the data of all tables (api call for US-04)
 * @returns the data of the reservation
 */
export async function getTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, []);
}

/**
 * api call to request the data of a reservation (api call for US-04)
 * @param {number} reservation_id id of the reservation whose data is requested
 * @returns the data of the reservation
 */
export async function getReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  return await fetchJson(url, { headers, signal }, []);
}

/**
 * api call to insert a reservation (api call for US-01)
 * @param {{ first_name, last_name, mobile_number, reservation_date, reservation_time, people}} resData data of the new table
 */
export async function insertNewReservation(resData, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/`);
  await fetchJson(url, {
    signal,
    headers,
    method: "POST",
    body: JSON.stringify({ data: resData }),
  });
}

/**
 * api call to insert a new table (api call for US-04)
 * @param {{ capacity, name }} tData data of the new table
 */
export async function insertNewTable(tData, signal) {
  const url = new URL(`${API_BASE_URL}/tables/`);
  await fetch(url, {
    signal,
    headers,
    method: "POST",
    body: JSON.stringify({ data: tData }),
  });
}

/**
 * api call to assign a reservation to a table (api call for US-04)
 * @param {number} reservation_id id of the reservation which should be assigned to the table
 * @param {number} table_id id of the table which should be assigned to the reservation
 */
export async function assignTable(reservation_id, table_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  await fetchJson(url, {
    signal,
    headers,
    method: "PUT",
    body: JSON.stringify({ data: { reservation_id } }),
  });
}

/**
 * api call to free a table of a reservation (api call for US-05)
 * @param {number} table_id id of the table which should be freed
 */
export async function deleteAssignment(table_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  await fetch(url, {
    signal,
    headers,
    method: "DELETE",
  });
}

/**
 * api call to cancel a reservation (api call for US-08)
 * @param {number} reservation_id id of the reservation which should be canceled
 */
export async function cancelReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/status`);
  await fetchJson(url, {
    signal,
    headers,
    method: "PUT",
    body: JSON.stringify({ data: { status: "cancelled" } }),
  });
}

/**
 * api call to edit a reservation (api call for US-08)
 * @param {number} reservation_id id of the reservation which should be edited
 * @param {{ first_name, last_name, mobile_number, reservation_date, reservation_time, people}} resData the edited data of the reservation
 */
export async function updateReservation(reservation_id, resData, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  await fetchJson(url, {
    signal,
    headers,
    method: "PUT",
    body: JSON.stringify({ data: resData }),
  });
}
