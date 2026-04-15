import axios from 'axios';

// base url of the fastapi backend )
const API_URL = import.meta.env.VITE_API_URL;
export default API_URL;

// Fetches the prioritized tickets from the API.
export const fetchTickets = async () => {
    const cleanURL = API_URL ? API_URL.replace(/\/$/, "") : "";
    const endpoint = `${cleanURL}/api/tickets`;
    try {
        // Call the endpoint defined in main.py
        const response = await axios.get(endpoint);
        return response.data;
    } catch (error) {
        alert(`Intento en: ${endpoint} \nFallo: ${error.message}`);
        console.error("Error connecting to the API:", error);
        throw error;
    }
};