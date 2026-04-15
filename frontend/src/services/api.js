import axios from 'axios';

// base url of the fastapi backend )
const API_URL = import.meta.env.VITE_API_URL;
export default API_URL;

// Fetches the prioritized tickets from the API.
export const fetchTickets = async () => {
    try {
        // Call the endpoint defined in main.py
        const response = await axios.get(`${API_URL}/api/tickets`);
        return response.data;
    } catch (error) {
        alert("Fallo en móvil: " + error.message);
        console.error("Error connecting to the API:", error);
        throw error;
    }
};