import { useCallback, useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Heart, HeartOutline, Pause, Play } from "react-ionicons";
// import { AudioVisualizer } from "react-audio-visualize";
import { LikeDiary } from "../api/diary";
import { toast } from "react-toastify";
import { CgSpinner } from "react-icons/cg";

import WaveSurfer from 'wavesurfer.js'
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js'

// WaveSurfer hook
const useWavesurfer = (containerRef, options) => {
    const [wavesurfer, setWavesurfer] = useState(null)
    
    // Initialize wavesurfer when the container mounts
    // or any of the props change
    useEffect(() => {
        if (!containerRef.current) return

        // height = { 100}
        // waveColor = "#e4e4e4"
        // progressColor = "#f76565"
        // cursorColor = "rgba(0,0,0,0)"

        const ws = WaveSurfer.create({
            ...options,
            height: 100,
            waveColor: "#e4e4e4",
            progressColor: "#f76565",
            cursorColor: "rgba(0,0,0,0)",
            barWidth: 3,
            container: containerRef.current,
            backend: 'MediaElement',
        })

        setWavesurfer(ws)

        return () => {
            ws.destroy()
        }
    }, [options, containerRef])

    return wavesurfer
}

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

    async function SubmitLikeDiary() {
        if (!isLiked) {
            setLikeUploading(true);
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
        }
    }

    useEffect(() => {
        setPlay(false);
    }, [url]);

    const containerRef = useRef()
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const wavesurfer = useWavesurfer(containerRef, props)

    // On play button click
    const onPlayClick = useCallback(() => {
        wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
    }, [wavesurfer])

    // Initialize wavesurfer when the container mounts
    // or any of the props change
    useEffect(() => {
        if (!wavesurfer) return

        setCurrentTime(0)
        setIsPlaying(false)

        const subscriptions = [
            wavesurfer.on('play', () => setIsPlaying(true)),
            wavesurfer.on('pause', () => setIsPlaying(false)),
            wavesurfer.on('timeupdate', (currentTime) => setCurrentTime(currentTime)),
        ]

        return () => {
            subscriptions.forEach((unsub) => unsub())
        }
    }, [wavesurfer])

    return (
        <section index={id} className={"mx-auto bg-white md:rounded-[12px] max-w-4xl px-[16px] py-[20px] shadow-lg rounded-xl transition-all space-y-2" + (playing ? 'scale-105 -translate-y-[5px]' : '')}>
            <span className="font-bold text-base">{name}</span>
            <div className="flex flex-col justify-center items-center mb-3 bg-neutral-100/80 rounded-xl ">
                <div ref={containerRef} style={{ minHeight: '120px', width: '100%', padding: '6px 16px' }} />
            </div>
            <div className="flex items-center justify-between">
                <p className="text-xs flex items-center w-max"><span className="mr-1">{new Date(createdAt).toLocaleDateString('fa-IR', { day: "numeric", month: "short" })}</span></p>
                <button className=" w-[36px] h-[36px] flex items-center justify-center rounded-full"
                    onClick={onPlayClick}
                >
                    {
                        isPlaying ?
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