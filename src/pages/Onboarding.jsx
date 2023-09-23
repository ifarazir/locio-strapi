import { Helmet } from "react-helmet";
import Header from "../components/Header";
import { Mic, Stop, Trash } from "react-ionicons";
import AudioSection from "../components/AudioSection";
import { Fragment, useEffect, useState } from "react";
import { GetDiaries, StoreDiary } from "../api/diary";
import { Transition, Dialog } from "@headlessui/react";
import Input from "../utils/Input";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import S3Uploader from "../components/S3Uploader";
import { getWaveBlob } from "webm-to-wav-converter";
import { APIUpload } from "../api/uploader";
import { toast } from "react-toastify";

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

    const recorderControls = useAudioRecorder()
    const addAudioElement = (blob) => {
        const url = URL.createObjectURL(blob);
        const audio = document.createElement("audio");
        audio.src = url;
        audio.controls = true;
        document.querySelector('#player-box').append(audio);
        setVoice(blob);
    };

    async function handleDiarySubmit() {
        const wavBlob = await getWaveBlob(voice, true);
        const response = await APIUpload(wavBlob);

        const voiceID = response?.response?.data[0]?.id;
        if (voiceID) {
            if (!document.querySelector('input[name="name"]').value) {
                toast.error('لطفا نام خود را وارد کنید');
            }
            else {
                const diaryName = document.querySelector('input[name="name"]').value;
                const diaryEmail = document.querySelector('input[name="email"]').value;
                console.log(response?.response?.data[0]?.id);

                const diary = {
                    "data": {
                        "Name": diaryName,
                        "Email": diaryEmail,
                        "voice": voiceID,
                        "cafe": import.meta.env.VITE_CAFE_ID
                    }
                }

                const diaryResponse = await StoreDiary(diary);

                if (diaryResponse?.response?.data?.data?.id) {
                    toast.success('خاطره شما با موفقیت ثبت شد');
                    setIsOpen(false);
                    window.location.reload();
                }
            }
        }
        else {
            toast.error('لطفا ابتدا یک صدا ضبط کنید');
        }



    }

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    function handleRemoveVoice() {
        document.querySelector('#player-box').innerHTML = '';
    }

    // Drawer with Framer Motion
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-30" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center text-center">
                        <Transition.Child
                            as={Fragment}
                            enterFrom="translate-y-full"
                            leaveTo="opacity-0 translate-y-full"
                        >
                            <Dialog.Panel className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white p-6 text-right shadow-xl transition-all translate-y-0 duration-300">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-bold mb-5 leading-6 text-gray-900"
                                >
                                    ثبت صدا
                                </Dialog.Title>
                                <div className="mt-2 space-y-3">
                                    <Input title="اسم شما" name="name" placeholder="" />

                                    <div>
                                        <Input title="آدرس ایمیل" type="email" dir="ltr" name="email" placeholder="" />
                                        <span className="text-xs text-neutral-400 px-3">شما می‌توانید فایل صدایتان را با وارد کردن ایمیل دریافت کنید.</span>
                                    </div>

                                    <div className="hidden">
                                        <AudioRecorder
                                            onRecordingComplete={(blob) => addAudioElement(blob)}
                                            recorderControls={recorderControls}
                                            showVisualizer={true}
                                        />
                                    </div>

                                    <div className="flex flex-col px-3 py-5 bg-neutral-100 rounded-[4px] text-center">
                                        {
                                            recorderControls.isRecording ?
                                                (<p className="text-4xl font-light mb-3">
                                                    {secondsToMinutesAndSeconds(recorderControls.recordingTime)}
                                                </p>) : (recorderControls.recordingBlob && <div id="player-box" className="mx-auto border-2 rounded-full mb-3"></div>)
                                        }
                                        <div className="flex items-center justify-center gap-x-5">
                                            <button onClick={recorderControls.startRecording} className="w-[48px] aspect-square rounded-full bg-red-500 flex items-center justify-center">
                                                <Mic color="white" height="24px" width="24px" />
                                            </button>
                                            <button onClick={recorderControls.stopRecording} className="w-[48px] aspect-square rounded-full bg-neutral-700 flex items-center justify-center">
                                                <Stop color="white" height="24px" width="24px" />
                                            </button>
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
                                        className="w-full justify-center rounded-md border border-transparent bg-blue-500 px-4 py-3 text-sm text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 font-bold"
                                        onClick={handleDiarySubmit}
                                    >
                                        ارسال
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>

    );
}

export default function OnboardingPage() {

    const [voices, setVoices] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    async function getVoices() {
        const response = await GetDiaries(import.meta.env.VITE_CAFE_ID);
        setVoices(response.response.data.data);
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
                    voices.map((voice, index) => {
                        return (<AudioSection id={voice.id} name={voice.attributes.Name} createdAt={voice.attributes.createdAt} url={import.meta.env.VITE_API_BASE + voice.attributes.voice.data.attributes.url.slice(1)} key={voice.id} />)
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