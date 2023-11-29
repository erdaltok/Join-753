const STORAGE_TOKEN = 'KN8F3FCI9GE7BWDCHXO5HBK5BAQ4FM50U3L5N3C2';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

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