import { AddOutline, InformationCircle, InformationCircleOutline, Mic } from "react-ionicons";

export default function Header() {

    return (
        <>
            <header className="bg-red-500 py-[5px] relative">
                <div className="mx-auto max-w-7xl flex items-center justify-between h-[36px] px-[16px] md:px-0">
                    <h1 className="font-black text-white text-base">لوکیو</h1>

                    <button>
                        <InformationCircleOutline color={'#fff'} />
                    </button>
                </div>
            </header>
            <div className=" text-center shadow bg-cover bg-center h-[200px]" style={{ backgroundImage: "url('./images/nolan-thumbnail.png')" }}>
            </div>
        </>
    )

}