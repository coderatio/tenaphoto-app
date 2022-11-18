import AuthLayout from "../Components/AuthLayout";
import {useForm} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Success from "../Components/Alerts/Success";
import Error from "../Components/Alerts/Error";
import useAuth from "../Providers/AuthProvider";
import Loader from "../Components/Loader";

const schema = yup.object({
    email: yup.string()
        .email('Invalid email provided')
        .required('The email field is required'),
    password: yup.string()
        .required('The password field is required')
        .min(6, 'The password must be atleast 6 character long')
}).required();


export default function Login() {
    let { register, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const { user, login, loading: authenticating } = useAuth()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [failedLogin, setFailedLogin] = useState(false)
    const [loginError, setLoginError] = useState(null)
    const navigate = useNavigate()


    useEffect(() => {
        setTimeout(() => {
            setFailedLogin(false)
        }, 1000)
    }, [loginError, failedLogin])

    useEffect(() => {
        if (user) {
            navigate('/dashboard')
        }
    }, [user, navigate])

    const onSubmit = async (data) => {
        setLoading(true)

        try {
            const response = await login(data.email, data.password)
            localStorage.removeItem('IdToken')
            localStorage.setItem('IdToken', response.idToken)

            setSuccess(true)
            setLoading(false)

            navigate('/dashboard')

            // Uncomment to show message
            /*setTimeout(() => {
                setLoading(false)
                setSuccess(false)
                setLoginError(null)
                navigate('/dashboard')
            }, 500)*/
        } catch (error) {
            setLoading(false)
            if (error.response.status === 406) {
                const valErrors = error.response.data.errors
                Object.keys(valErrors).forEach(field => {
                    if (valErrors[field][0]) {
                        setError(field, { type: 'server', message: valErrors[field][0].message })
                    }
                })
            }

            else if(error.response.status === 401) {
                setFailedLogin(true)
                setLoginError(error.response.data.message)
            }
            else {
                console.log(error)
                setFailedLogin(true)
            }
        }
    };

    if (loading && authenticating) {
        return <Loader title="Authenticating..."/>
    }

    return  (
        <AuthLayout title="Login to your account">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <Success title="Success" className={`${success ? 'visible' : 'hidden' }`}>
                    <p>Login was succssful.
                        <br/><b>Redirecting...</b>
                    </p>
                </Success>
                <Error title="Login failed!" className={`${failedLogin ? 'visible' : 'hidden' }`}>
                    <p>{loginError ? loginError : 'Unable to login. Please try again!'}</p>
                </Error>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" action="#" method="POST">
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
                            {loading ? 'Please wait...' : 'Login'}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Don't have an account?</span>
                        </div>
                    </div>

                    <div className="mt-6 w-full">
                        <div>
                            <Link
                                to="/register"
                                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                            >
                                <span className="sr-only">Create New Account</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"/>
                                </svg>
                                Create New Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    )
}