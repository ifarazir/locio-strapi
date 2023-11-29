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
        'Sec-Fetch-Site': 'same-origin',
    }
});

export const GetDiaries = async (cafeID) => {
    return youzAxios.get('/sanctum/csrf-cookie').then(CSRFresponse => {
        youzAxios.get('/api/diaries/' + cafeID).then((response) => {
            if (response.data.status == 'success') {
                return {
                    status: 'success',
                    variant: 'default',
                    message: 'success',
                    response: response.data
                }
            }
            else {
                return {
                    status: 'error',
                    variant: 'error',
                    message: response?.data?.message,
                    response: response
                }
            }
        }).catch((response) => {
            return {
                status: 'error',
                variant: 'error',
                message: response,
                response: response
            }
        })
    });
};


export const StoreDiary = async (diary) => {
    return youzAxios.post('/api/diaries', diary).then((response) => {
        return {
            status: 'success',
            variant: 'default',
            message: 'success',
            response: response.data
        }
    }).catch((response) => {
        return {
            status: 'error',
            variant: 'error',
            message: 'Error! Please try again later.',
            response: response
        }
    })
};

export const LikeDiary = async (diary) => {
    return youzAxios.get('/sanctum/csrf-cookie').then(CSRFresponse => {
        youzAxios.get('/api/like/diary/' + diary, {}).then((response) => {
            return {
                status: 'success',
                variant: 'default',
                message: 'success',
                response: response.data
            }
        }).catch((response) => {
            return {
                status: 'error',
                variant: 'error',
                message: 'Error! Please try again later.',
                response: response
            }
        })
    });
};
