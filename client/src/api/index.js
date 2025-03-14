import axios from 'axios';

const NODE_ENV = import.meta.env.VITE_NODE_ENV

let url;
if (NODE_ENV === 'development') {
    url = 'http://localhost:8000'
} else {
    url = import.meta.env.VITE_NODE_ENV_REACT_APP_API
}
export const baseURL = url;
const API = axios.create({ baseURL: baseURL})
export const AI_URL = import.meta.env.VITE_NODE_ENV_AI_APP_API;
const AI_APP_API = axios.create({ baseURL: 'http://localhost:8000'})

API.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')) {
        req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
    }
    return req
})


export const fetchClient = (id) => API.get(`/clients/${id}`);
export const fetchClients = (page) => API.get(`/clients?page=${page}`);
export const addClient =( client ) => API.post('/clients', client)
export const updateClient = (id, updatedClient) => API.patch(`/clients/${id}`, updatedClient)
export const deleteClient =(id) => API.delete(`/clients/${id}`)
export const fetchClientsByUser = (searchQuery) => API.get(`/clients/user?searchQuery=${searchQuery.search}`);


export const signIn =(formData)=> API.post('/users/signin', formData)
export const signUp =(formData)=> API.post('/users/signup', formData)
export const forgot = (formData) => API.post('/users/forgot', formData);
export const reset = (formData) => API.post('/users/reset', formData);
export const refresh = (formData) => API.post('/users/refresh', formData);

export const fetchProfilesBySearch = (searchQuery) => API.get(`/profiles/search?searchQuery=${searchQuery.search || searchQuery.year || 'none'}`);
export const fetchProfile = (id) => API.get(`/profiles/${id}`)
export const fetchProfiles = () => API.get('/profiles');
export const fetchProfilesByUser = (searchQuery) => API.get(`/profiles?searchQuery=${searchQuery.search}`)
export const createProfile = (newProfile) => API.post('/profiles', newProfile);
export const updateProfile = (id, updatedProfile) => API.patch(`/profiles`, updatedProfile);
export const deleteProfile = (id) => API.delete(`/profiles/${id}`);

export const getInterviewsCandidate = (id) => API.get(`/interviews/candidate/${id}`);
export const getInterviewsHR = (id) => API.get(`/interviews/hr/${id}`);
export const getInterviewDetailsById = (id) => API.get(`/interviews/${id}`);

export const listMeetings = () => API.get('/interview');
export const getMeeting = (id) => API.get(`/interviews/${id}`);
// export const scheduleMeeting = (meetingData) => API.post('/schedule', meetingData);
export const scheduleMeeting = (formData) => API.post(`/interviews/schedule`, formData);
export const changeMeetingStatus = (id, status) => API.patch(`/interviews/update/${id}`, status);
export const changeInterviewHiringStatus = (id, status) => API.patch(`/interviews/hiring/${id}`, status);

export const processCandidateAnswer = (formData) => AI_APP_API.post('/post_audio/', formData);
export const saveUserDetails = (userDetails) => AI_APP_API.post('/user/', userDetails);

// there will be two different ways to get evaluation
export const getEvaluation = (id) => AI_APP_API.get(`/evaluate/${id}`); // todo modify this to another way
export const getEvaluationUsingInterviewId = (id) => AI_APP_API.get(`/evaluate/${id}`);
export const sendInterviewStatusEmail = (data) => AI_APP_API.post('/mail', data);