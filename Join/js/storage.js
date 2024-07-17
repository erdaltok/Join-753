const STORAGE_TOKEN = 'KN8F3FCI9GE7BWDCHXO5HBK5BAQ4FM50U3L5N3C2';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
/**
 * Sets an item in storage with the provided key and value.
 * @async
 * @param {string} key - The key to identify the item in storage.
 * @param {any} value - The value to be stored.
 * @returns {Promise<any>} A Promise that resolves with the response data from the storage service.
 */
async function setItem(key, value) {
     // Construct the payload with key, value, and token
    const payload = { key, value, token: STORAGE_TOKEN };
    // Make a POST request to the storage service API to set the item
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}
/**
 * Retrieves an item from storage based on the provided key.
 * @async
 * @param {string} key - The key to identify the item in storage.
 * @returns {Promise<any>} A Promise that resolves with the retrieved item's value, or rejects with an error if the item cannot be found or an error occurs during the retrieval process.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url)
        .then(res => res.json())
        .then(res => {
            if (res.data) {
                return res.data.value;
            } else {
                return Promise.reject(`Could not find data with key "${key}".`);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            return Promise.reject(error);
        });
}


