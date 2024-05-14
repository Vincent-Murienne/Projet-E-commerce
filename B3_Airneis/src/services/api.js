const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

const Data = async (endpoint, action, data) => {

    // We build the url to which we will make the api call
    const api_url = `${apiUrl}/actions/${endpoint}/${action}.php`;

    // We add the apiKey to the data 
    data.apiKey = apiKey;

    // We build the api informations
    const requestInfos = new Request(
        api_url,
        {
            method: "post",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(data)
        }
    );
    const request = await fetch(requestInfos); // We make the API call
    const response = await request.json(); // We wait for the response, and convert it to json

    return response;
}

export { Data };
