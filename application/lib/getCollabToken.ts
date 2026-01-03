import axios from "axios";

export const getCollabToken = async () => {
    try {
        const res = await axios.get(`/api/collab-token`, {
            withCredentials: true,
        });
        return res.data.data;
    } catch (error) {
        throw error
    }
}

export const generateCollabToken = async () => {
    try {
        const res = await axios.post(`/api/collab-token`, {
            withCredentials: true,
        });
        return res.data.data;
    } catch (error) {
        throw error
    }
}