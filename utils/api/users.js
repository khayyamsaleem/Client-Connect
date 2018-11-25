const BASE_PATH = '/api/users'
import sendRequest from '~/utils/sendRequest'

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