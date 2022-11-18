import AuthLayout from "../Components/AuthLayout";
import axios from "axios";
import config from "../config";
import {useForm} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Success from "../Components/Alerts/Success";

const schema = yup.object({
    displayName: yup.string()
        .required('The name field is required')
        .min(3, 'Minimum of 3 characters required'),
    email: yup.string()
        .email('Invalid email provided')
        .required('The email field is required'),
    password: yup.string()
        .required('The password field is required')
        .min(6, 'The password must be atleast 6 character long')
}).required();


export default function Register() {
    let { register, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    const onSubmit = async (data, e) => {
        setLoading(true)

        try {
            await axios.post(config.apiRoot + '/register', data)
            setSuccess(true)

            setTimeout(() => {
                setLoading(false)
                setSuccess(false)
                navigate('/login')
            }, 3000)
        } catch (error) {
            setLoading(false)
            if (error.response && error.response.status === 406) {
                const valErrors = error.response.data.errors
                Object.keys(valErrors).forEach(field => {
                    if (valErrors[field][0]) {
                        setError(field, { type: 'server', message: valErrors[field][0].message })
                    }
                })
            } else {
                console.log(error)
                alert('An error occured')
            }
        }
    };

    return (
        <AuthLayout title="Create an account">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <Success title="Success" className={`${success ? 'visible' : 'hidden' }`}>
                    <p>Your account was created successfully.
                        <br/><b>Redirecting in 3secs.</b>

                    </p>
                </Success>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" action="#" method="POST">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Display Name
                        </label>
                        <div className="mt-1">
                            <input
                                {...register('displayName', { required: true })}
                                id="displayName"
                                name="displayName"
                                type="text"
                                autoComplete="name"
                                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            />
                            {
                                errors.displayName &&
                                <span role="alert" className="text-xs text-red-600">
                                    {errors.displayName?.message}
                                </span>
                            }
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                {...register('email', { required: true })}
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            />
                            {errors.email && <span role="alert" className="text-xs text-red-600">{errors.email?.message}</span>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                {...register('password', { required: true })}
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            />
                            {errors.password && <span role="alert" className="text-xs text-red-600">{errors.password?.message}</span>}
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={handleSubmit(onSubmit)}
                            disabled={loading}
                            type="submit"
                            className="disabled:opacity-30 disabled:cursor-not-allowed flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Have an account?</span>
                        </div>
                    </div>

                    <div className="mt-6 w-full">
                        <div>
                            <Link
                                to="/login"
                                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                            >
                                <span className="sr-only">Login instead</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                                </svg>

                                Login instead
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </AuthLayout>
    )
}