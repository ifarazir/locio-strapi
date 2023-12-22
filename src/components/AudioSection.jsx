import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Heart, HeartOutline, Pause, Play } from "react-ionicons";
import { AudioVisualizer } from "react-audio-visualize";
import { LikeDiary } from "../api/diary";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";

export default function AudioSection(props) {
    const {
        id,
        name,
        url,
        createdAt,
        likes_count,
        is_liked = false
    } = props;

    const [playing, setPlay] = useState(false);
    const [likesCount, setLikesCount] = useState(likes_count);
    const [isLiked, setLike] = useState(is_liked);
    const [isLikeUploading, setLikeUploading] = useState(false);
    const [duration, setDuration] = useState(0);
    const [blob, setBlob] = useState(null)
    const visualizerRef = useRef(null)

    const timeUpdate = (event) => {
        setDuration(event.target.currentTime);

        // if voice is finished, stop playing
        if (event.target.currentTime === event.target.duration) {
            setPlay(false);
        }
    }

    async function SubmitLikeDiary() {
        setLikeUploading(true);
        if (!isLiked) {
            const response = await LikeDiary(props.id);

            if (response?.response?.data?.status === 'success') {
                setLikeUploading(false);
                setLike(!isLiked);
                setLikesCount(likesCount + 1);
            }
            else {
                toast.error(response?.response?.response?.data?.message);
                setLikeUploading(false);
            }
        } else {
            setLikeUploading(false);
            setLike(!isLiked);
            setLikesCount(likesCount - 1);
        }
    }

    const audioRef = useRef();


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
        <section index={id} className={"mx-auto bg-white md:rounded-[12px] max-w-4xl px-[16px] py-[20px] shadow-lg rounded-xl transition-all space-y-2" + (playing ? 'scale-105 -translate-y-[5px]' : '')}>
            <span className="font-bold text-base">{name}</span>
            <div className="flex flex-col justify-center items-center mb-3 bg-neutral-100/80 rounded-xl ">
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
                <p className="text-xs flex items-center w-max"><span className="mr-1">{new Date(createdAt).toLocaleDateString('fa-IR', { day: "numeric", month: "short" })}</span></p>
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

                <button className="flex items-center" onClick={SubmitLikeDiary}>
                    <span className="text-neutral-900 text-xs">{likesCount}</span>
                    {
                        isLikeUploading ?
                            <div className="animate-spin">
                                <CgSpinner className="text-[30px] text-[#ef4444]" />
                            </div>
                            :
                            // if isLiked is true, show Heart, else show HeartOutline
                            isLiked ?
                                <Heart color={'#ef4444'} width={'36px'} />
                                :
                                <HeartOutline color={'#404040'} width={'36px'} />
                    }
                </button>
            </div>

        </section>
    )

}