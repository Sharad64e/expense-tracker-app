import axios from 'axios'

const BASE_URL = 'http://localhost:5000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
})

/**
 * Fetch all expenses
 * @returns {Promise<Array>} list of expenses
 */
export const fetchExpenses = async () => {
  const res = await api.get('/expenses')
  return res.data
}

/**
 * Add a new expense via natural language input
 * @param {string} text - e.g. "Tea 20"
 * @returns {Promise<Object>} created expense
 */
export const addExpense = async (text) => {
  const res = await api.post('/add', { text })
  return res.data
}

/**
 * Delete an expense by ID
 * @param {string} id - MongoDB _id
 * @returns {Promise<Object>} response
 */
export const deleteExpense = async (id) => {
  const res = await api.delete(`/delete/${id}`)
  return res.data
}

export default api
