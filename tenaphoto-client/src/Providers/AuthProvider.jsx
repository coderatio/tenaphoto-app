import {createContext, useContext, useEffect, useMemo, useState} from "react";
import * as UserApi from '../Api/UserApi'

const AuthContext = createContext({
    user: null,
    loading: true,
    login: () => {},
    signUp: () => {},
    logout: () => {},
})

export function AuthProvider({ children }) {
    const [user, setUser] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        UserApi.getCurrentUser()
            .then((user) => setUser(user))
            .catch((_error) => {})
            .finally(() => setLoading(false))
    }, []);

    function login(email: string, password: string) {
        setLoading(true);

        return UserApi.login(email, password)
            .then((user) => {
                setUser(user);
                return user
            })
            .catch((error) => {
                setError(error)
                throw error
            })
            .finally(() => setLoading(false));
    }

    function logout(uid) {
        return UserApi.logout(uid)
            .then(response => {
                localStorage.removeItem('IdToken')
                setUser(null)
                return response
            })
            .catch((error) => { throw error })
            .finally(() => setLoading(false))
    }

    const memoedValue = useMemo(
        () => ({ user, loading, error, login, logout,}),
        [user, loading, error]
    );

    return (
        <AuthContext.Provider value={memoedValue}>
            { children }
        </AuthContext.Provider>
    );
}

export default function useAuth() {
    return useContext(AuthContext);
}