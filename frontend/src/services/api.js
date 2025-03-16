import axios from 'axios'

const BASE_URL = '/api'

// Create an axios instance with default headers
const api = axios.create({
    baseURL: BASE_URL
})

// Add an interceptor to include the auth token in all requests
api.interceptors.request.use(config => {
    const user = localStorage.getItem('user')
    const token = user ? JSON.parse(user).token : null
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// users
export const createUser = (userData) => api.post('/users', userData)
export const getAllUsers = () => api.get('/users')
export const getUserById = (id) => api.get(`/users/${id}`)
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData)
export const deleteUser = (id) => api.delete(`/users/${id}`)

// user management
export const loginUser = (username, password) => api.post('/login', { username, password })
export const updatePassword = (id, passwordData) => api.put(`/users/${id}/password`, passwordData)

// items
export const createItem = (itemData) => api.post('/menu-items', itemData)
export const getAllItems = () => api.get('/menu-items')
export const getItemById = (id) => api.get(`/menu-items/${id}`)
export const updateItem = (id, itemData) => api.put(`/menu-items/${id}`, itemData)
export const deleteItem = (id) => api.delete(`/menu-items/${id}`)

// orders
export const createOrder = (orderData) => api.post('/orders', orderData)
export const getAllOrders = () => api.get('/orders')
export const getOrderById = (id) => api.get(`/orders/${id}`)
export const updateOrder = (id, orderData) => api.put(`/orders/${id}`, orderData)
export const deleteOrder = (id) => api.delete(`/orders/${id}`)

// statistics
export const getStatistics = () => api.get('/statistics')
