import {Link} from "react-router-dom";
import LoadingButton from "../../../Components/LoadingButton";
import {ShareIcon} from "@heroicons/react/24/outline";
import {useEffect, useState} from "react";
import SharePhotoSlideOver from "../../../Components/SharePhotoSlideOver";
import {allUsers} from "../../../Api/UserApi";

export default function DashboardGallery({ loaded, hasError, userPhotos }) {
    const [openModal, setOpenModal] = useState(false)
    const [selectedPhoto, setSelectedPhoto] = useState(null)
    const [users, setUsers] = useState([])

    useEffect(() => {
        allUsers()
            .then((users) => setUsers(users))
            .catch()
    })

    function triggerSlide(photo) {
        setOpenModal(true)
        setSelectedPhoto(photo)
    }

    if (!loaded) {
        return (
            <div className="mt-10">
                <LoadingButton title="Fetching photos..."/>
            </div>
        )
    }

    if (hasError) {
        return <h2 className="mt-10 bg-red-100 text-red-700 p-3 rounded-md">Unable to get photos!</h2>
    }

    if (!userPhotos.length) {
        return (
            <div>
                <div className="mt-10 bg-indigo-100 text-indigo-700 p-3 rounded-md">
                    <h2 className="text-lg -mb-1">You do not have any photos yet.</h2>
                    <span className="text-xs text-indigo-500 italic">Choose photos from your machine to upload.</span>
                </div>
            </div>
        )
    }

    return (
        <>
            <section className="overflow-hidden text-gray-700">
                <div className="container py-2 mx-auto pt-3">
                    <div className="flex flex-wrap w-full">
                        {userPhotos.map((photo) => (
                            <div key={photo.id} className="flex flex-wrap sm:w-1/4 mb-3 sm:mb-0">
                                <div className="w-full p-1 md:p-2">
                                    <div className="pb-3 shadow-md bg-gray-50 rounded-lg">
                                        <Link to="#" onClick={() => triggerSlide(photo) }>
                                            <img alt="gallery" className="block object-cover object-center w-full h-48 w-96 rounded-2xl"
                                                 src={photo.url} loading="lazy"/>
                                        </Link>
                                        {
                                            !photo?.sender
                                            ?   <div className="flex justify-between items-center text-xs mt-3 px-3 font-medium">
                                                    <button type="button" className="cursor-pointer text-indigo-500 flex" onClick={() => triggerSlide(photo)}>
                                                        <ShareIcon className="h3 w-3 mr-2"/>
                                                        Share
                                                    </button>
                                                    <button type="button" className="text-red-500" onClick={() => alert('Delete not available!')}>
                                                        Delete
                                                    </button>
                                                </div>
                                            :   <div className="flex justify-between items-center text-xs text-gray-400 mt-3 px-3 font-medium">
                                                    Received file
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <SharePhotoSlideOver open={openModal} setOpen={setOpenModal} photo={selectedPhoto} users={users}/>
            </section>
        </>
    )
}