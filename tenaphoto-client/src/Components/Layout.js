import React from "react";
import Navbar from "./Navbar";

export default class Layout extends React.Component {
    render() {
        return (
            <>
                <div className="min-h-full">
                    <Navbar/>
                    <header className="bg-white shadow">
                        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                { this.props.pageTitle || 'Dashboard'}
                            </h1>
                        </div>
                    </header>
                    <main>
                        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                            { this.props.children }
                        </div>
                    </main>
                </div>
            </>
        )
    }
}