import axios from 'axios'
const axiosPublic = axios.create({
    baseURL:`https://sports-kappa.vercel.app`
})
export const UseaxiosPublic = () => {
  return axiosPublic;
}
