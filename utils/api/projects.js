const BASE_PATH = '/api/projects'
import sendRequest from '~/utils/sendRequest'

export const addProject = (project) =>
    sendRequest(`${BASE_PATH}/new`, {
        body: JSON.stringify(project)
    })

export const getProjectsByUser = (userId) => 
    sendRequest(`${BASE_PATH}/get?userId=${userId}`, {
        method: 'GET'
    })

