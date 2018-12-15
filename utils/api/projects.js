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

export const assignFreelancerToProject = (userId, projectId) =>
    sendRequest(`${BASE_PATH}/assign-freelancer-to-project`, {
        body: JSON.stringify({userId, projectId})
    })

export const toggleProjectCompletionStatus = (projectId) =>
    sendRequest(`${BASE_PATH}/toggle-complete?projectId=${projectId}`, {
        method: 'GET'
    })