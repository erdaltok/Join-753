const STORAGE_TOKEN = 'KN8F3FCI9GE7BWDCHXO5HBK5BAQ4FM50U3L5N3C2';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {

        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}


// fetch("https://remote-storage.developerakademie.org/item", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     key: "testKey",
//     value: { test: "Testwert" },
//     token: "KN8F3FCI9GE7BWDCHXO5HBK5BAQ4FM50U3L5N3C2",
//   }),
// })
//   .then((response) => response.json())
//   .then((data) => console.log("setItem Antwort:", data))
//   .catch((error) => console.error("Fehler:", error));


//   fetch(
//     "https://remote-storage.developerakademie.org/item?key=testKey&token=KN8F3FCI9GE7BWDCHXO5HBK5BAQ4FM50U3L5N3C2"
//   )
//     .then((response) => response.json())
//     .then((data) => console.log("getItem Antwort:", data))
//     .catch((error) => console.error("Fehler:", error));



