const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;


const postData = async (action, data) => {
    let api_url = `${apiUrl}/actions/loginRegister/${action}.php`;

    data.apiKey = apiKey;

    try {
        const response = await fetch(api_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        throw new Error('Une erreur est survenue lors de la requête.');
    }
}

export { postData };
