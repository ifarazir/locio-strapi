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
        'Authorization': 'Bearer b091bbe20100e7aac9718adcff533aa8f7c444a1cb91a1ca2ac1059485829c164d25592e5421dbabeba2c27ce160f9680af719b1e36d570e1449226508fd35b6556ffe0bc130e78a8cc9a1453ea070bf4fe437e58d59251dd143fff5ce3b545f1cdc405fb2e44b0be9977b2dcde848f620eee1cbd823271c7dfe0d99b1c5bdf3'
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
