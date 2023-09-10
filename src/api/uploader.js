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
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer b5113a3bd0d05005c7698d9439291cbb2cb03212273e4edc58e4fd33a0db437f73265a25e4537a334557f43f967c666c3978647832ffdd49746a59208c16e634fd7464de15c596f942bfbfad5e6b31dcc4ba3bdd552a80d65798e6b3f0a42907723c334f98b4a24b07f1f3425e390b03d5cc83cd7a3ebbf20bab6df9b3daefda'
    }
});

export const APIUpload = async (voiceFile) => {
    console.log(voiceFile);
    const file = new File([voiceFile], 'voice.wav', { type: 'audio/wav' });

    return youzAxios.post('/api/upload', {
        files: file,
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
