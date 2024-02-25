const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

const getData = async (action, data) => {
    let api_url = `${apiUrl}/actions/loginRegister/${action}.php`;

    data.action = action; // Assurez-vous que la clé "action" est ajoutée aux données
    data.apiKey = apiKey; // Ajoutez cette ligne pour inclure la clé d'API

    console.log("Data sent to backend:", data); // Ajoutons un log pour vérifier les données envoyées

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

export { getData };
