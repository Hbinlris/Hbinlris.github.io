import axios from 'axios'

const api = axios.create({
  // baseURL: "http://192.168.39.10:8080/",
  baseURL: "http://localhost:8080/",


})
export default api;



const apipublish = () => {
  return api.get('api/publish')

}

// 用户信息、
const apiusers=(username)=>{
  return api.get(`/api/clientusers/${username}`)

}



export { apipublish,apiusers }


