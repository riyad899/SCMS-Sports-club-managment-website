import axios from 'axios'
const axiosPublic = axios.create({
    baseURL:`https://sports-club-backend-mwe3s4o3v-riyad899s-projects.vercel.app`
})
export const UseAxiosPublic = () => {
  return axiosPublic;
}
