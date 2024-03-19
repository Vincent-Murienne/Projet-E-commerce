const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

const Data = async (endpoint, action, data) => {
    const validEndpoints = ['homePage', 'loginRegister', 'category'];

    if (!validEndpoints.includes(endpoint)) {
        throw new Error('Endpoint non valide');
    }

    const api_url = `${apiUrl}/actions/${endpoint}/${action}.php`;

    data.apiKey = apiKey;

    console.log("Data sent to backend:", data);

    const requestInfos = new Request(
        api_url,
        {
            method: "post",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(data)
        }
    );
    const request = await fetch(requestInfos);
    const response = await request.json();

    return response;
}

export { Data };
