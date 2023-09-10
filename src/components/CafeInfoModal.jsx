import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CgClose } from 'react-icons/cg';

export default function CafeInfoModal({ isOpen, onClose }) {

    return (
        <Transition.Root
            show={isOpen}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"

            as={Fragment}
        >
            <Dialog onClose={onClose} className="fixed z-20 overflow-y-auto w-screen h-screen top-0 left-0">
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-100"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-100"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="z-30 fixed inset-0 flex w-screen items-center justify-center p-4">
                        <Dialog.Panel className={'relative mx-auto w-full max-w-md bg-white rounded-xl'}>
                            <div className="px-10 py-10 shadow-sm">
                                <Dialog.Title className={'text-2xl font-bold mt-2 mb-5'}>ردپای صدای خاطرات، در جغرافیای حضورتان</Dialog.Title>
                                <Dialog.Description className={'text-lg'}>
                                    لوکیو تجربه‌ای از داستان‌های صوتی مکان محور است که به شما امکان ضبط، اشتراک و شنیدن داستان‌ها، گفت‌ و گوها و آواهای موجود در لحظه‌ را می‌دهد.
                                </Dialog.Description>
                            </div>

                            <button
                                type="button"
                                className="absolute -top-12 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full w-[36px] h-[36px]"
                                onClick={onClose}
                            >
                                <CgClose className="w-5 h-5" />
                            </button>
                        </Dialog.Panel>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition.Root>
    )
}
