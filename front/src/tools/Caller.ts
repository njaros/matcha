import axios from "axios";
import { tokenReader } from "./TokenReader";

const ip = import.meta.env.VITE_IP;
const Axios = axios.create({
	baseURL: ip + "/api/",
})

// Intercepteur pour le token
// Intercepte la requete lorsqu'elle sort du front, la modifie et la relache vers le back
Axios.interceptors.request.use(request => {
    const token = tokenReader.getToken();
    if (tokenReader.isTokenValid(token))
        request.headers.Authorization = 'Bearer ' + token;
    return request;
})

export default Axios;