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

    return await youzAxios.get('/sanctum/csrf-cookie').then(CSRFresponse => {
        youzAxios.post('/api/files/upload', {
            file: file
        }).then((response) => {
            console.log(response);
            return response.data.file.id
        }).catch((response) => {
            return {
                status: 'error',
                variant: 'error',
                message: response.data.message,
                response: response
            }
        })
    });
};
