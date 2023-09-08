import React, { useEffect, useRef, useState } from 'react';
import { AudioVisualizer } from 'react-audio-visualize';

export default function Visualizer(props) {
    const { url, currentTime } = props;

    const [blob, setBlob] = useState(null)
    const visualizerRef = useRef(null)

    useEffect(() => {
        if (url) {
            fetch(url)
                .then((response) => response.blob())
                .then((tmpBlob) => {
                    setBlob(tmpBlob)
                })
        }
    }, [url])

    return (
        <div>
            {blob && (
                <>
                    <AudioVisualizer
                        ref={visualizerRef}
                        blob={blob}
                        width={500}
                        height={75}
                        barWidth={2}
                        currentTime={currentTime}
                        barPlayedColor='#f76565'
                        barColor='#e4e4e4'
                        gap={0}
                    />
                </>
            )}
        </div>
    )
}
