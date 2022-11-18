import {useNavigate} from "react-router-dom";
import AxiosServvice from "../../../Services/AxiosService";
import config from "../../../config";
import {useEffect, useRef, useState} from "react";
import DashboardGallery from "./DashboardGallery";
import LoadingButton from "../../../Components/LoadingButton";
import Success from "../../../Components/Alerts/Success";
import Error from "../../../Components/Alerts/Error";
import {DocumentArrowUpIcon, TagIcon} from "@heroicons/react/24/outline";
import {ArrowLeftIcon} from "@heroicons/react/20/solid";

export default function PhotosCard() {
    const [photo, setPhoto] = useState()
    const navigate = useNavigate()

    const photoFile = useRef(null)
    const tagsRef = useRef()
    const [userPhotos, setuserPhotos] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const [failedUpload, setFailedUpload] = useState(false)
    let [addTags, setAddTags] = useState(false)

    const fetchPhotos = async () => {
        try {
            const response = await AxiosServvice().get(config.apiRoot + '/me/files')
            if (response.data) {
                setuserPhotos(response.data.data)
            }
            setLoaded(true)
        } catch (e) {
            setLoaded(true)
            setHasError(true)
        }
    }

    useEffect(() => {
        fetchPhotos().catch()
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setUploaded(false)
            setFailedUpload(false)
        }, 5000)
    }, [failedUpload, uploaded])

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
    }

    const sortFiles = () => {
        setuserPhotos(userPhotos.sort().reverse())
    }

    const toggleTagsField = () => {
        setAddTags(addTags = !addTags)
    }

    const upload = async () => {
        if (!photo) {
            alert('Select an image to proceed!')
            return
        }

        setUploading(true)
        const formData = new FormData()
        formData.append('file', photo)
        formData.append('tags', tagsRef.current.value)

        AxiosServvice().post(config.apiRoot + '/me/upload', formData)
            .then(() => {
                fetchPhotos()
                setUploaded(true)
                setUploading(false)
                photoFile.current.value = null
            })
            .catch((err) => {
                if (err.code === 401) {
                    navigate('/login')
                }

                setUploading(false)
                setFailedUpload(true)
                console.log(err)
            })
    }

    return (
        <div>
            { uploaded ? <Success title="Successful">The image was uploaded successfully.</Success> : '' }
            { failedUpload ? <Error title="Failed">Failed to upload the image</Error> : '' }

            <div className="bg-white shadow-sm rounded-md">
                <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
                    <div className="sm:flex flex-wrap items-center justify-between sm:flex-nowrap">
                        <div className="">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                My Photos
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                All my uploaded photos
                            </p>
                        </div>
                        <div className="mt-4 flex-shrink-0">
                            <div className={uploading ? 'visible' : 'hidden' }>
                                <LoadingButton title="Uploading..."/>
                            </div>
                            <form onSubmit={upload} className={uploading ? 'hidden' : 'visible'}>
                                <div className="flex flex-wrap md:flex-nowrap my-5 bg-indigo-50 rounded-md sm:rounded-none p-3 sm:p-0 sm:bg-white sm:mt-0 items-center justify-right">
                                    <div>
                                    <div className={!addTags ? 'visible': 'hidden'}>
                                        <label htmlFor="file" className="sr-only">
                                            Choose a photo
                                        </label>
                                        <input
                                            ref={photoFile}
                                            required
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            type="file"
                                            name="file"
                                            id="file"
                                            className="block w-full md:w-60 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    <div className={addTags ? 'visible' : 'hidden'}>
                                        <label htmlFor="tags" className="sr-only">
                                            Add tags
                                        </label>
                                        <input
                                            ref={tagsRef}
                                            required
                                            type="text"
                                            name="tags"
                                            id="tags"
                                            placeholder="Enter tags. E.g Good, Nice"
                                            className="block w-full md:w-60 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-5 md:mt-0">
                                        <div className="md:ml-4">
                                            <button type="button" onClick={toggleTagsField} className="text-sm text-indigo-500">
                                                {
                                                    !addTags ?
                                                        <div className="underline flex items-center">
                                                            <span>Add tags</span>
                                                            <TagIcon className="w-5 h-5 ml-2"/>
                                                        </div>
                                                    :   <div className="underline flex font-semibold items-center text-gray-500">
                                                            <ArrowLeftIcon className="w-5 h-5 mr-2"/>
                                                            <span>Back</span>
                                                        </div>
                                                }
                                            </button>
                                        </div>
                                        <div className="ml-3 md:ml-0">
                                            <button
                                                onClick={upload}
                                                type="button"
                                                className="relative md:ml-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                <DocumentArrowUpIcon className="h5 w-5 mr-2"/>
                                                Upload
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="sm:px-4 px-4 pb-5">
                    <div className="container py-2 mx-auto lg:pt-8 pt-3">
                        <div className="flex justify-end items-center pr-2">
                            <label htmlFor="sort" className="mr-2">Order by: </label>
                            <select name="sort" onChange={sortFiles} id="sort" defaultValue="desc" className="mt-1 min-w-60 cursor-pointer rounded-md border-gray-300 py-2 pl-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                                <option value="desc">Latest</option>
                                <option value="asc">Oldest</option>
                            </select>
                        </div>
                    </div>
                    <DashboardGallery
                        userPhotos={userPhotos}
                        hasError={hasError}
                        loaded={loaded}
                    />
                </div>
            </div>
        </div>
    )
}