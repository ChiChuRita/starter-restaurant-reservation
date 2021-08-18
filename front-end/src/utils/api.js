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
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

export async function getReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  return await fetchJson(url, { headers, signal }, []);
}

export async function insertNewReservation(resData) {
  try {
    const url = new URL(`${API_BASE_URL}/reservations/`);
    await fetch(url, {
      headers,
      method: "POST",
      body: JSON.stringify({ data: resData }),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function insertNewTable(tData) {
  try {
    const url = new URL(`${API_BASE_URL}/tables/`);
    await fetch(url, {
      headers,
      method: "POST",
      body: JSON.stringify({ data: tData }),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function assignTable(reservation_id, table_id) {
  try {
    const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
    await fetch(url, {
      headers,
      method: "PUT",
      body: JSON.stringify({ data: { reservation_id } }),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function deleteAssignment(table_id) {
  try {
    const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
    await fetch(url, {
      headers,
      method: "DELETE",
    });
  } catch (err) {
    console.log(err);
  }
}

export async function listTables(params, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, []);
}

export async function listAvailableTables(params, signal) {
  const url = new URL(`${API_BASE_URL}/tables/freetables`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, []);
}

export async function cancelReservation(reservation_id) {
  try {
    const url = new URL(
      `${API_BASE_URL}/reservations/${reservation_id}/status`
    );
    await fetch(url, {
      headers,
      method: "PUT",
      body: JSON.stringify({ data: { status: "cancelled" } }),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function updateReservation(reservation_id, resData) {
  try {
    const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
    await fetch(url, {
      headers,
      method: "PUT",
      body: JSON.stringify({ data: resData }),
    });
  } catch (err) {
    console.log(err);
  }
}
