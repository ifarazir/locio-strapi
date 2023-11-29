import axios from "axios";

axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401) {
        //place your reentry code
    }
    return error;
});

axios.defaults.withCredentials = true;
const youzAxios = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_API_BASE,
    headers: {
        'Accept': 'application/json',
    }
});

export const GetCafe = async (cafeID) => {
    return youzAxios.get('/api/diaries/' + cafeID).then((response) => {
        return {
            status: 'success',
            variant: 'default',
            response: response.data.data.attributes
        }
    }).catch((response) => {
        return {
            status: 'error',
            variant: 'error',
            message: response.data.message,
            response: response
        }
    })
};
