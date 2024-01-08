import { AddOutline, InformationCircle, InformationCircleOutline, Mic } from "react-ionicons";
import CafeInfoModal from "./CafeInfoModal";
import { useEffect, useState } from "react";
import { GetCafe } from "../api/cafe";
import LocioModal from "./LocioModal";
import { ToastContainer, Zoom } from "react-toastify";

export default function Header() {
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isLocioModalOpen, setIsLocioModalOpen] = useState(false);
    const [cafe, setCafe] = useState({});

    async function getCafeData() {
        const response = await GetCafe(import.meta.env.VITE_CAFE_ID);
        console.log(response);
        setCafe(response.response);
    }

    function closeLocioModal() {
        localStorage.setItem('is-firstTiem', true);
        setIsLocioModalOpen(false);
    }

    useEffect(() => {
        if (localStorage.getItem('is-firstTiem')) {
            setIsLocioModalOpen(false);
        }
        else {
            setIsLocioModalOpen(true);
        }
        // getCafeData();
    }, []);

    return (
        <>
            <header className="bg-red-500/80 py-[5px] fixed w-full backdrop-blur">
                <div className="mx-auto max-w-7xl flex items-center justify-between h-[36px] px-[16px] md:px-0">
                    <h1 className="font-bold text-white text-base">لوکیو</h1>

                    <button onClick={() => setIsInfoModalOpen(true)}>
                        <InformationCircleOutline color={'#fff'} />
                    </button>

                </div>
                <CafeInfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
                <LocioModal isOpen={isLocioModalOpen} onClose={() => closeLocioModal()} cafe={cafe} />
            </header>
            <div className="text-center shadow bg-cover bg-center h-[280px]" style={{ backgroundImage: "url('./images/nolan-thumbnail-new-v4.jpg')" }}>
            </div>

            <ToastContainer transition={Zoom} closeButton={false} position="bottom-center" rtl limit={1} autoClose={5000} hideProgressBar theme="dark" bodyClassName={'text-[14px] leading-[24px] !p-0 !my-0'} toastClassName="!rounded-[6px] !px-[16px] !py-[12px] !mx-[8px]" />
        </>
    )

}