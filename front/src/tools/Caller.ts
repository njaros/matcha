import axios from "axios";
import { tokenReader } from "./TokenReader";

const ip = process.env.SERVER_URL;
const Axios = axios.create({
	baseURL: ip,
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