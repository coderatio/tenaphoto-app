import React from "react";
import LoadingButton from "./LoadingButton";

export default function Loader({ title }) {
    return (
        <div className='App relative z-10 bg-gray-600'>
            <div className="fixed inset-0 bg-gray-500 bg-opacity-60 transition-opacity" />
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <LoadingButton title={title}/>
                </div>
            </div>
        </div>
    )
}