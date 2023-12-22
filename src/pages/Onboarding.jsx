import { Helmet } from "react-helmet";
import Header from "../components/Header";
import { Mic, Stop, Trash } from "react-ionicons";
import AudioSection from "../components/AudioSection";
import { Fragment, useEffect, useState } from "react";
import { GetDiaries, StoreDiary } from "../api/diary";
import { Transition, Dialog } from "@headlessui/react";
import Input from "../utils/Input";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { getWaveBlob } from "webm-to-wav-converter";
import { toast } from "react-toastify";
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
    maxContentLength: 10000000,
    maxBodyLength: 10000000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
    },
});

var persianDigits = "۰۱۲۳۴۵۶۷۸۹";
var persianMap = persianDigits.split("");
function convertToPersianNumber(input) {
    return input.replace(/\d/g, function (m) {
        return persianMap[parseInt(m)];
    });
}

function secondsToMinutesAndSeconds(totalSeconds) {
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;

    return convertToPersianNumber(("0" + minutes).slice(-2) + ':' + ("0" + seconds).slice(-2));

}

export function NewVoiceDrawer(props) {
    const { isOpen, setIsOpen } = props;

    const [voice, setVoice] = useState(null);
    const [isVoiceSubmitting, setIsVoiceSubmitting] = useState(false);
    const [percent, setPercent] = useState(0);

    const recorderControls = useAudioRecorder()
    const addAudioElement = (blob) => {
        const url = URL.createObjectURL(blob);
        const audio = document.createElement("audio");
        audio.src = url;
        audio.controls = true;
        document.querySelector('#player-box').append(audio);

        // append blob.size in human readable format to #file-size
        const fileSize = blob.size;
        const i = Math.floor(Math.log(fileSize) / Math.log(1024));
        const readableFileSize = (fileSize / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
        document.querySelector('#file-size').innerHTML = readableFileSize;

        setVoice(blob);
    };

    const APIUpload = async (voiceFile) => {

        // create file blob with filename
        // create file name from timestamp with .wav extension
        const fileName = new Date().getTime() + '.wav';

        const file = new File([voiceFile], fileName, {
            type: voiceFile.type,
        });

        return youzAxios.post('/api/files/upload', {
            file: file
        }, {
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                let percent = Math.floor((loaded * 100) / total);
                setPercent(percent);

                if (percent === 100) {
                    setTimeout(() => {
                        setPercent(0);
                    }, 1000);

                }
            }
        }).then(async (response) => {
            return response.data.file.id
        }).catch((response) => {
            return {
                status: 'error',
                variant: 'error',
                message: response.data.message,
                response: response
            }
        })
    }

    async function handleDiarySubmit() {
        setIsVoiceSubmitting(true);

        if (!document.querySelector('input[name="name"]').value) {
            toast.error('لطفا نام خود را وارد کنید');
            setIsVoiceSubmitting(false);
            return;
        }

        if (!recorderControls.recordingBlob) {
            toast.error('.لطفا ابتدا یک صدا ضبط کنید');
            setIsVoiceSubmitting(false);
            return;
        }

        const wavBlob = await getWaveBlob(voice, true);
        const fileuploadresponse = await APIUpload(wavBlob).then(async (voiceID) => {
            console.log('voiceId:' + voiceID);
            if (voiceID) {
                const diaryName = document.querySelector('input[name="name"]').value;
                const diaryEmail = document.querySelector('input[name="email"]').value;

                const diary = {
                    file_id: voiceID,
                    cafe_id: import.meta.env.VITE_CAFE_ID,
                    name: diaryName,
                    email: diaryEmail
                }

                const diaryResponse = await StoreDiary(diary);

                console.log(diaryResponse.response.status);

                if (diaryResponse.response.status == 'success') {
                    setIsVoiceSubmitting(false);

                    toast.success('خاطره شما با موفقیت ثبت شد');
                    setIsOpen(false);
                    window.location.reload();
                }
            }
            else {
                toast.error('لطفا ابتدا یک صدا ضبط کنید..');
            }
        })


    }

    function closeModal() {
        recorderControls.stopRecording();
        handleRemoveVoice();
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    function handleRemoveVoice() {
        if (document.querySelector('#player-box')) {
            document.querySelector('#player-box').innerHTML = '';
        }
    }

    // Drawer with Framer Motion
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[103]" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
                </Transition.Child>

                <Transition.Child
                    className="fixed bottom-0 z-[104] w-screen overflow-y-hidden"
                    as={Fragment}
                    enter="ease-out duration-500"
                    enterFrom="translate-y-full"
                    enterTo="translate-y-0"
                    leave="ease-in duration-500"
                    leaveFrom="translate-y-0"
                    leaveTo="translate-y-full"
                >
                    <div className="flex min-h-full items-end justify-center text-center">

                        {/* percent of upload as red progress bar on top of the screen */}
                        {
                            percent > 0 && <div className="fixed top-0 left-0 w-full h-[3px] bg-red-100 shadow shadow-red-100" style={{ width: percent + '%' }}></div>
                        }

                        <Dialog.Panel className="relative max-w-md transform overflow-hidden rounded-t-2xl p-6 bg-white w-full transition-all">
                            <div className="flex items-center justify-between mb-5">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-bold leading-6 text-gray-900"
                                >
                                    ثبت صدا
                                </Dialog.Title>

                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-full p-1 border border-transparent bg-gray-100 text-neutral-700 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                    onClick={closeModal}
                                >
                                    <span className="sr-only">بستن</span>
                                    <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="mt-2 space-y-3">
                                <Input title="نام کاربر *" name="name" placeholder="" required />

                                <div className="flex flex-col">
                                    <Input title="آدرس ایمیل" type="email" dir="ltr" name="email" placeholder="" />
                                    <span className="text-xs text-right text-neutral-400 px-3 mt-1">شما می‌توانید فایل صدایتان را با وارد کردن ایمیل دریافت کنید.</span>
                                </div>

                                <div className="hidden">
                                    <AudioRecorder
                                        onRecordingComplete={(blob) => addAudioElement(blob)}
                                        recorderControls={recorderControls}
                                        audioTrackConstraints={{
                                            sampleRate: 44100,
                                            sampleSize: 16,
                                        }}
                                        downloadFileExtension={"wav"}
                                    />
                                </div>

                                <div className="flex flex-col px-3 py-5 bg-neutral-100 rounded-[4px] text-center">
                                    {
                                        recorderControls.isRecording ?
                                            (<p className="text-4xl font-light mb-3">
                                                {secondsToMinutesAndSeconds(recorderControls.recordingTime)}
                                            </p>) : (recorderControls.recordingBlob && <div id="player-box" className="mx-auto border-2 rounded-full mb-3"></div>)
                                    }
                                    <p className="text-sm text-neutral-400" id="file-size" dir="ltr"></p>
                                    <div className="flex items-center justify-center gap-x-5">
                                        {
                                            recorderControls.isRecording ?
                                                <button onClick={recorderControls.stopRecording} className="w-[48px] aspect-square rounded-full bg-neutral-700 flex items-center justify-center">
                                                    <Stop color="white" height="24px" width="24px" />
                                                </button> :
                                                <button onClick={recorderControls.startRecording} className="w-[48px] aspect-square rounded-full bg-red-500 flex items-center justify-center">
                                                    <Mic color="white" height="24px" width="24px" />
                                                </button>
                                        }
                                        {
                                            recorderControls.recordingBlob &&
                                            <button onClick={handleRemoveVoice} className="w-[48px] aspect-square rounded-full border-2 border-red-500 flex items-center justify-center">
                                                <Trash color="red" height="24px" width="24px" />
                                            </button>
                                        }
                                    </div>
                                </div>

                            </div>

                            <div className="mt-4">
                                <button
                                    type="button"
                                    disabled={isVoiceSubmitting}
                                    className="w-full justify-center items-center text-center rounded-md border border-transparent bg-blue-500 px-4 py-3 text-sm text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 font-bold"
                                    onClick={handleDiarySubmit}
                                >
                                    {
                                        isVoiceSubmitting ?
                                            <svg className="animate-spin mx-auto h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z">
                                                </path>
                                            </svg> : 'ارسال'
                                    }
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition.Root >

    );
}

export default function OnboardingPage() {

    const [voices, setVoices] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    async function getVoices() {
        const response = await GetDiaries(import.meta.env.VITE_CAFE_ID);
        setVoices(response.response.diaries);
    }

    useEffect(() => {
        getVoices();
    }, []);

    return (
        <>
            <Helmet>
                <title>لوکیو | کافه نولان</title>
            </Helmet>

            <Header />

            <div className="px-[16px] pt-[24px] space-y-[24px] pb-[100px]">
                {
                    voices && voices.map((voice, index) => {
                        return (<AudioSection id={voice?.id} name={voice?.name} createdAt={voice?.created_at} url={voice?.file_url.replace('http://', 'https://')} key={voice?.id} likes_count={voice?.likes_count} is_liked={voice?.is_like} />)
                    })
                }
            </div>

            <div className="z-20 fixed bottom-0 w-full flex justify-center items-center border-t-2 h-[48px] bg-white rounded-t-3xl">
                <button className="absolute w-fit top-0 -translate-y-1/2 px-[32px] h-[54px] flex items-center justify-center bg-red-500 hover:bg-red-700 text-white rounded-full"
                    onClick={() => setIsOpen(true)}
                >
                    <Mic color="white" height="24px" width="24px" />
                </button>
            </div>
            <NewVoiceDrawer isOpen={isOpen} setIsOpen={setIsOpen} />

            {/* <div className="fixed bottom-0 w-full flex justify-center items-center border-t-2 border-t-neutral-200 h-[72px] bg-white">
                <button className="w-fit px-[32px] h-[54px] flex items-center justify-center bg-red-500 hover:bg-red-700 text-white rounded-full">
                    <Mic color="white" height="24px" width="24px" />
                </button>
            </div> */}


        </>
    )

}