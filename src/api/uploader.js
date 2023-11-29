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
        'Sec-Fetch-Site': 'same-origin',
        'Content-Type': 'multipart/form-data'
    }
});

export const APIUpload = async (voiceFile) => {

    // create file blob with filename
    // create file name from timestamp with .wav extension
    const fileName = new Date().getTime() + '.wav';

    const file = new File([voiceFile], fileName, {
        type: voiceFile.type,
    });
    
    return youzAxios.post('/api/files/upload', {
        file: file
    }).then((response) => {
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
            message: response.data.message,
            response: response
        }
    })
};
