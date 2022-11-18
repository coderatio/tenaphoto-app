import axios from "axios";

export default function AxiosServvice() {
    const idToken = localStorage.getItem('IdToken')
    const axiosClient = axios
    if (idToken) {
        return axios.create({
            headers: {
                IdToken : idToken
            }
        })
    }

    return axiosClient
}