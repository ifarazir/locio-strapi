import { Fragment, useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import { Dialog, Transition } from "@headlessui/react";
import { TbCheck } from 'react-icons/tb';
import { CgClose } from 'react-icons/cg';

export default function LocioModal({ isOpen, onClose, cafe }) {

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
                        <Dialog.Panel className={'relative mx-auto w-full max-w-xl bg-white rounded-xl'}>
                            <div className="px-5 py-10 shadow-sm">
                                <Dialog.Description className={'text-lg font-bold'}>
                                    مکان و صدا دو جز یادآوری خاطرات و داستان‌های ماست. این داستان‌ها بدون حضور اتفاق و یا هم‌دستی دوستان ما بوجود نمی‌آیند و پیوند این داستان‌ها به مکانی مشخص عنصری است برای یادآوری آن‌ها و تجربه‌ی مجدد لحظه.
                                    شما می‌توانید با اسکن این کد داستان‌ها و گفت‌ و گوهای خود در کافه نولان را بگویید و یا داستان دیگران را بشنوید.
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
