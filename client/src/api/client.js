export async function api(path, { method = 'GET', body, headers = {} } = {}) {
    const token = localStorage.getItem('token');

    const res = await fetch(path, {
        method,
        headers : {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
    }
    return data;
};