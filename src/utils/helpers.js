export function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function parseJwt(token) {
    const base64Url = token.split('.')[1]; // obtiene el payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // corrige los caracteres de base64 URL
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}