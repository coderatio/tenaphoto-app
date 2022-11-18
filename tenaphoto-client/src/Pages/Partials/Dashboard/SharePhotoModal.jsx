import {ShareIcon} from "@heroicons/react/24/outline";
import { Dialog } from '@headlessui/react'
import Modal from "../../../Components/Modal";
import Select from "../../../Components/Select";

const sampleUsers = [
    { id: 1, name: 'Wade Cooper' },
    { id: 2, name: 'Arlene Mccoy' },
    { id: 3, name: 'Devon Webb' },
    { id: 4, name: 'Tom Cook' },
]

export default function SharePhotoModal({ open, setOpen }) {
    return (
        <>
            <Modal open={open}>
                <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <ShareIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                            Share this photo
                        </Dialog.Title>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Select a user from the list below to share the photo with
                            </p>
                        </div>

                        <div className="my-2">
                            <Select items={sampleUsers}/>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-10 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none sm:col-start-2 sm:text-sm"

                    >
                        Deactivate
                    </button>
                    <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                        onClick={setOpen}

                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </>
    )
}