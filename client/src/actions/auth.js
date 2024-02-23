import { useNavigate } from 'react-router-dom';
import * as api from '../api/index';
import { AUTH } from './constants';


export const signin = (formData, openSnackbar, setLoading) => async (dispatch) => {

    try {
        //login the user
        const loginData = new URLSearchParams();
        loginData.append('username', formData.email);
        loginData.append('password', formData.password);
        const { data } = await api.signIn(loginData.toString())
        dispatch({ type: AUTH, data })
        openSnackbar("Signin successfull")
        window.location.href = "/homepage"

    } catch (error) {
        openSnackbar(error?.response?.data?.message)
        setLoading(false)
    }
}

export const signup = (formData, openSnackbar, setLoading) => async (dispatch) => {

    try {
        const { data } = await api.signUp(formData)
        dispatch({ type: AUTH, data })
        openSnackbar("Sign up successfull!")
        window.location.href = "/homepage"

    } catch (error) {
        openSnackbar(error?.response?.data?.detail)
        setLoading(false)
    }
}



export const forgot = (formData) => async (dispatch) => {
    try {
        await api.forgot(formData)
    } catch (error) {
        console.log(error)
    }
}


export const reset = (formData, history) => async (dispatch) => {
    const navigate = useNavigate()
    try {
        await api.reset(formData)
        navigate('/homepage')

    } catch (error) {
        alert(error)
    }
}
