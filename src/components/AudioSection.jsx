import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Heart, HeartOutline, Pause, Play } from "react-ionicons";
import Visualizer from "../utils/Visualizer";
import { AudioVisualizer } from "react-audio-visualize";
import { toJalaali } from "jalaali-js";
import { LikeDiary } from "../api/diary";
import { toast } from "react-toastify";

export default function AudioSection(props) {
    const [playing, setPlay] = useState(false);
    const [isLiked, setLike] = useState(false);
    const [isLikeUploading, setLikeUploading] = useState(false);
    const [duration, setDuration] = useState(0);
    const [blob, setBlob] = useState(null)
    const visualizerRef = useRef(null)

    const timeUpdate = (event) => {
        setDuration(event.target.currentTime);
    }

    async function SubmitLikeDiary() {
        setLikeUploading(true);
        const response = await LikeDiary(props.id);

        if (response?.response?.status === 'success') {
            setLikeUploading(false);
            setLike(!isLiked);
        }
        else {
            toast.error(response?.response?.message);
        }
    }

    const audioRef = useRef();

    const {
        id,
        name,
        url,
        createdAt
    } = props;


    useEffect(() => {
        setPlay(false);

        if (url) {
            // fetch as api for cors problem
            fetch(url)
                .then((response) => response.blob())
                .then((blob) => {
                    setBlob(blob);
                })
                .catch((err) => console.log(err));
        }
    }, [url]);


    return (
        <section index={id} className={"mx-auto bg-white md:rounded-[12px] max-w-4xl px-[16px] py-[20px] shadow-lg rounded-xl transition-all " + (playing ? 'scale-105 -translate-y-[5px]' : '')}>
            <div className="flex flex-col justify-center items-center mb-3">
                <audio controls className="hidden" onTimeUpdate={timeUpdate} id={`audio${id}`} src={url} ref={audioRef} />
                <AudioVisualizer
                    ref={visualizerRef}
                    blob={blob}
                    width={300}
                    height={75}
                    barWidth={2}
                    currentTime={duration}
                    barPlayedColor='#f76565'
                    barColor='#e4e4e4'
                    gap={0}
                />
                {/* <Visualizer url={url} currentTime={duration} /> */}
            </div>
            <div className="flex items-center justify-between">
                <p className="text-xs"><span className="font-bold text-base">{name} | </span>{new Date(createdAt).toLocaleDateString('fa-IR', { day: "numeric", month: "short" })}</p>
                <button className=" w-[36px] h-[36px] flex items-center justify-center rounded-full"
                    onClick={() => {
                        setPlay(!playing);
                        playing ? audioRef.current.pause() : audioRef.current.play();
                    }}
                >
                    {
                        playing ?
                            <Pause color={'#404040'} width={'36px'} /> : <Play color={'#404040'} width={'36px'} />
                    }
                </button>

                <button onClick={SubmitLikeDiary}>
                    {
                        isLikeUploading ?
                            <div className="animate-pulse">
                                <HeartOutline color={'#404040'} width={'36px'} />
                            </div>
                            :
                            // if isLiked is true, show Heart, else show HeartOutline
                            isLiked ?
                                <Heart color={'#ef4444'} width={'36px'} />
                                :
                                <HeartOutline color={'#404040'} width={'36px'} onClick={SubmitLikeDiary} />
                    }
                </button>
            </div>

        </section>
    )

}