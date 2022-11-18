import React from "react";
import {Link} from "react-router-dom";

export default class AuthLayout extends React.Component {
    render() {
        const { title, children } = this.props
        return (
            <>
                <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <Link to="/">
                            <img
                                className="mx-auto h-12 w-auto"
                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                alt="Your Company"
                            />
                        </Link>
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            { title }
                        </h2>
                        {/*<p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                            start your 14-day free trial
                        </a>
                    </p>*/}
                    </div>

                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        { children }
                    </div>
                </div>
            </>
        )
    }
}