(() => null)();

fetch("/logs", { headers: { token: prompt("Token") } })
    .then(response => response
        .json()
        .then(console.log)
        .catch(console.error))
    .catch(console.error);