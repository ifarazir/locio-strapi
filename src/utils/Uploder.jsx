import Uppy from "@uppy/core";
import { Dashboard, DragDrop } from "@uppy/react";

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/drag-drop/dist/style.css'
import '@uppy/file-input/dist/style.css'
import '@uppy/audio/dist/style.min.css';

import Persian from '@uppy/locales/lib/fa_IR';
import XHRUpload from "@uppy/xhr-upload";
import { useEffect } from "react";

export default function Uploader(props) {
    const { url, setUrl } = props;

    const headers = {
        authorization: `Bearer something`,
    };

    const uppy = new Uppy({
        id: 'uppy',
        autoProceed: true,
        debug: true
    }).use(Dashboard, { inline: true, target: 'body' })
        .use(Audio, { target: Dashboard });

    useEffect(() => {
        uppy.on('complete', (result) => {
            console.log('Upload complete! We’ve uploaded these files:', result.successful)
            setUrl(result.successful[0].response.body.file.url);
        });
    }, [url]);


    // uppy.on('complete', (result) => {
    //     console.log('Upload complete! We’ve uploaded these files:', result.successful)
    //     setUrl(result.successful[0].response.body.file.url);
    // });

    return (
        <>
            <DragDrop
                uppy={uppy}
                locale={Persian}
                id="uppy"
            />
        </>
    )

}