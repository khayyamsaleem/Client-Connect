const BASE_PATH = '/api/users'
import sendRequest from '~/utils/sendRequest'
import { getFromStorage } from '~/utils/storage'

export const registerUser = newUser =>
    sendRequest(`${BASE_PATH}/register`, {
        body: JSON.stringify(newUser)
    })

export const searchUser = query => 
    sendRequest(`${BASE_PATH}/search`, {
        body: JSON.stringify({ query })
    })

export const checkExists = userName =>
    sendRequest(`${BASE_PATH}/exists`, {
        body: JSON.stringify({ userName })
    })

export const loginUser = (userName, password) => 
    sendRequest(`${BASE_PATH}/login`, {
        body: JSON.stringify({userName, password})
    })

export const logoutUser = (token) =>
    sendRequest(`${BASE_PATH}/logout?token=${token}`, {
        method: 'GET'
    })

export const verifyToken = (token) =>
    sendRequest(`${BASE_PATH}/verify?token=${token}`, {
        method: 'GET'
    })

export const updateUser = (userName, field, newValue) => 
    sendRequest(`${BASE_PATH}/update`, {
        method: 'PUT',
        body: JSON.stringify({userName: userName, field: field, newValue: newValue})
    })

export const getCurrentUser = () => {
    const tokenObj = getFromStorage('clientconnect')
    if (tokenObj && tokenObj.token){
        const { token } = tokenObj
        return sendRequest(`${BASE_PATH}/get?token=${token}`, {
            method: 'GET'
        })
    } else {
        return {error: 'Not Logged In'}
    }
}