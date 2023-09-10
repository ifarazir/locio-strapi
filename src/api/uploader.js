import axios from "axios";

axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response.status === 401) {
        //place your reentry code
    }
    return error;
});

const youzAxios = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
    }
});

export const APIUpload = async (voiceFile) => {
    console.log(voiceFile);
    const file = new File([voiceFile], 'voice.wav', { type: 'audio/wav' });
    // convert wave blob to file

    return youzAxios.post('/api/upload', {
        files: [file],
    }).then((response) => {
        return {
            status: 'success',
            variant: 'default',
            message: 'success',
            response: response
        }
        if (response.data.status == 'success') {
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
            message: response.data.message,
            response: response
        }
    })
};
