export const apiUrl = 'http://localhost:3000/api';

export const postData = async(url:string, body:any, method='POST') => {
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();

    if(!response.ok) {
        const message:string = data.message || data;
        return {error: true, message}
    }
    return data;
}

export const postFormData = async(url:string, body:any, method='POST') => {
    const response = await fetch(url, {
        method,
        body
    });

    const data = await response.json();

    if(!response.ok) {
        const message:string = data.message || data;
        return {error: true, message}
    }
    return data;
}

export const getData = async(url:string) => {
    const response = await fetch(url);
    const data = await response.json();

    if(!response.ok) {
        const message:string = data.message || data;
        return {error: true, message}
    }
    return data;
}