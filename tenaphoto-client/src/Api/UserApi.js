import AxiosServvice from "../Services/AxiosService";
import config from "../config";

const url = config.apiRoot

export async function getCurrentUser() {
    const response = await AxiosServvice().get(url + '/me')
    return response.data.data
}

export async function allUsers() {
    const response = await AxiosServvice().get(url + '/me/users')
    return response.data.data
}

export async function login(email, password) {
    const response = await AxiosServvice().post(url + '/login', {
        email, password
    })

    return response.data.data
}

export async function logout(uid) {
    return await AxiosServvice().get(url + '/logout', {
        headers: {uid}
    })
}