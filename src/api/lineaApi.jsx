import axios from "axios";
import { urlApi, urlInterno, urlLinea } from "./myApiData";


export const GetLineasApi = ({ notif }) => {
    /*var Linea = {
        id: "",
        name: "",
        description: "",
        phone: "",
        directionLat: "",
        directionLon: "",
        roleId: ""
    };*/
    axios.get(urlApi + urlLinea)
        .then((res) => { return res })
}

export const PostLineaApi = ({ notif, data }) => {
    axios.post(urlApi + urlLinea, data)
        .then((response) => { notif(data.name + " creado con exito", { variant: 'success' }); })
        .catch((e) => { notif(JSON.stringify(e.response.data.message), { variant: 'error' }); });
}