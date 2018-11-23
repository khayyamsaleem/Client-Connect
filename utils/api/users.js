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

export const checkExists = query =>
    sendRequest(`${BASE_PATH}/exists`, {
        body: JSON.stringify({ query })
    })