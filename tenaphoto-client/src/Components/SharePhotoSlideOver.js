import {Fragment, useRef, useState} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {ShareIcon, XMarkIcon} from '@heroicons/react/24/outline'
import Loader from "./Loader";
import AxiosServvice from "../Services/AxiosService";
import config from "../config";
import {InformationCircleIcon} from "@heroicons/react/20/solid";

export default function SharePhotoSlideOver({ open, setOpen, photo, users }) {
    const [sharing, setSharing] = useState(false)

    const recipientRef = useRef()
    const messageRef = useRef()

    async function sharePhoto(e) {
        e.preventDefault()
        setSharing(true)

        const recipient = recipientRef.current.value
        const message = messageRef.current.value
        const file = photo.name

        if (!recipient) {
            alert('Please select a person')
            setSharing(false)
            return
        }

        AxiosServvice().post(config.apiRoot + '/me/files/share', {
            recipient,
            message,
            file
        }).then((response) => {
            setSharing(false)
            console.log(response.data)
            alert('File shared successfully')
        }).catch(error => {
            setSharing(false)
            console.log(error)
            alert(`Sharing failed`)
        })
    }

    if (sharing) {
        return <Loader title="Sharing..."/>
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <div className="fixed inset-0 bg-indigo-100 opacity-75" />

                <div className="fixed inset-0 overflow-hidden ">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <form onSubmit={sharePhoto} className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                                        <div className="h-0 flex-1 overflow-y-auto">
                                            <div className="bg-indigo-700 py-6 px-4 sm:px-6">
                                                <div className="flex items-center justify-between">
                                                    <Dialog.Title className="text-lg font-medium text-white">Share photo</Dialog.Title>
                                                    <div className="ml-3 flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none"
                                                            onClick={() => setOpen(false)}
                                                        >
                                                            <span className="sr-only">Close panel</span>
                                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="mt-1">
                                                    <p className="text-sm text-indigo-300">
                                                        Your photos are not accessible in the public but you can share with people.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-full px-4 py-2">
                                                <img src={photo?.url} alt="" className="block object-center object-contain w-full h-56 rounded-2xl"/>
                                                { photo?.metadata?.tags && <div className="pt-2">
                                                    <span className="font-semibold">Tags:</span>
                                                    <span className="text-gray-400 text-sm italic">{photo?.metadata.tags}</span>
                                                </div> }
                                            </div>
                                            {
                                                !photo?.sender
                                                ? <div className="flex flex-1 flex-col justify-between">
                                                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                                                            <div className="space-y-6 pt-6 pb-5">
                                                                <div>
                                                                    <label htmlFor="recipient" className="block text-sm font-medium text-gray-900">
                                                                        Person
                                                                    </label>
                                                                    <div className="mt-1">
                                                                        <select
                                                                            ref={recipientRef}
                                                                            id="recipient"
                                                                            name="recipient"
                                                                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                                            defaultValue=""
                                                                        >
                                                                            <option value=''>Choose a person...</option>
                                                                            {users.length && users.map((user) => (
                                                                                <option key={user.uid} value={user.uid}>{user.name} - {user.email}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                                                                        Message
                                                                    </label>
                                                                    <div className="mt-1">
                                                                <textarea
                                                                    ref={messageRef}
                                                                    id="message"
                                                                    name="message"
                                                                    rows={4}
                                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                    defaultValue={''}
                                                                    placeholder="Share something subtle about the photo"
                                                                />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                :   <div className="px-4 py-4 md:pt-10">
                                                        {photo?.message && <div>
                                                            <h2 className="font-semibold">Notes from sender:</h2>
                                                            <div className="border border-gray-300 text-sm rounded-md p-3">
                                                                {photo.message}
                                                            </div>
                                                        </div>}
                                                    </div>
                                            }
                                        </div>
                                        { !photo?.sender ? <div className="flex flex-shrink-0 justify-between px-4 py-4">
                                            <button
                                                type="button"
                                                className="rounded-md border border-red-300 bg-white py-2 px-4 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                onClick={() => setOpen(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={sharePhoto}
                                                type="submit"
                                                className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                Share <ShareIcon className="h5 w-5 ml-2"/>
                                            </button>
                                        </div> : <div className="bg-blue-500 p-4">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                                                </div>
                                                <div className="ml-3 flex-1 md:flex md:justify-between items-center">
                                                    <p className="text-sm text-blue-50">
                                                        You do not own this file. However, you may be able to download but won't share.
                                                    </p>
                                                    <p className="mt-3 text-sm md:mt-0 md:ml-6">
                                                        <a href="#!" className="whitespace-nowrap font-bold text-blue-50 hover:text-blue-600">
                                                            Learn more
                                                            <span aria-hidden="true"> &rarr;</span>
                                                        </a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div> }
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}