const getToken = () => document.cookie
    .split(";")
    .filter(cookie => cookie.startsWith("token"))?.[0]
    ?.split("=")?.[1];

if (!getToken()) document.cookie = `token=${prompt("Token")}`;

fetch("/logs", { headers: { token: getToken() } })
    .then(response => response
        .json()
        .then(console.log)
        .catch(console.error))
    .catch(console.error);