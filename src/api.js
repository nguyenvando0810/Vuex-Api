import axios from 'axios'

export function getUser() {
  return axios.get('http://192.168.3.190:9000/api/users')
}

export function addUser(data) {
  return axios.post('http://192.168.3.190:9000/api/users', data)
}

export function deleteUser(id) {
  return axios.delete(`http://192.168.3.190:9000/api/users/${id}`)
}

export function searchUser(search) {
  return axios.get(`http://192.168.3.190:9000/api/users/filter-user?search=${search}`)
}

export function editUser(id, data) {
  return axios.put(`http://192.168.3.190:9000/api/users/${id}`, data)
}