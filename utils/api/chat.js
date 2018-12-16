const BASE_URL = '/api/messages'
import sendRequest from '~/utils/sendRequest'

export const joinRoom = (userName) =>
    sendRequest(`${BASE_URL}/user`, {
        body: JSON.stringify({user: userName})
    })

export const getMessageHistory = () =>
    sendRequest(`${BASE_URL}/messages`, {
        method: 'GET'
    })

export const getActiveUsers = () =>
    sendRequest(`${BASE_URL}/users`, {
        method: 'GET'
    })

export const sendMessageAndUser = (payload) =>
    sendRequest(`${BASE_URL}/message`, {
        body: JSON.stringify(payload)
    })

export const leaveRoom = (userName) =>
    sendRequest(`${BASE_URL}/user`, {
        method: 'DELETE',
        body: JSON.stringify({user: userName})
    })