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

// // Zum löschen der Tasks aus dem Remote-Storage, außer einem Task
// async function removeTasksExceptSpecificOne() {
//   try {
//     let tasks = await getItem("tasks");
//     if (!tasks) {
//       console.log("Keine Tasks zum Löschen gefunden.");
//       return;
//     }

//     // Sicherstellen, ob tasks ein Array ist
//     if (typeof tasks === "string") {
//       tasks = JSON.parse(tasks);
//     }

//     // Überprüfen, ob tasks jetzt ein Array ist
//     if (!Array.isArray(tasks)) {
//       console.error("Tasks sind nicht im erwarteten Format (Array).");
//       return;
//     }

//     // Behalte nur den Task mit der spezifischen ID
//     const specificTaskId = 1702229508197;
//     const updatedTasks = tasks.filter((task) => task.id === specificTaskId);

//     // Speichern der aktualisierten Task-Liste
//     await setItem("tasks", updatedTasks);
//     console.log("Nicht spezifizierte Tasks wurden erfolgreich entfernt.");
//   } catch (error) {
//     console.error("Fehler beim Entfernen der Tasks:", error);
//   }
// }

// // Aufrufen der Funktion
// removeTasksExceptSpecificOne();

