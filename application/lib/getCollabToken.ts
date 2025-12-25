import axios from "axios";

export const getCollabToken = async () => {
    try {
        const res = await axios.get(`/api/collab-token`, {
            withCredentials: true,
        });
        return res.data;
    } catch (error) {
        throw error
    }
}

