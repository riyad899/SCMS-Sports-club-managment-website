import axios from 'axios'
const axiousSecure = axios.create({
    baseURL:`http://localhost:5000`
})
export const UseaxiousSecure = () => {
  return axiousSecure;
}
