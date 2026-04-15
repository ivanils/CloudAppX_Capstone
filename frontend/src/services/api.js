import axios from 'axios';

// base url of the fastapi backend )
const API_URL = 'http://127.0.0.1:8000';

// Fetches the prioritized tickets from the API.
export const fetchTickets = async () => {
    try {
        // Call the endpoint defined in main.py
        const response = await axios.get(`${API_URL}/api/tickets`);
        return response.data;
    } catch (error) {
        console.error("Error connecting to the API:", error);
        throw error;
    }
};