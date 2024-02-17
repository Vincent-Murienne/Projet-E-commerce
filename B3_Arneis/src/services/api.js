
const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

const testAPI = async (data) => {
    let api_url = `${apiUrl}/actions/homePage/getTopCategories.php`;

    data.apiKey = apiKey;

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

export { testAPI };