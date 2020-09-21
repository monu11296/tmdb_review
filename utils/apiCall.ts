import axios from 'axios'
import { BASE_URL, API_KEY, AUTHORIZATION_BEARER } from '../constants';

export const apiCall = async (
    method: 'get' | 'post',
    endpoint: string,
    body: any = {},
) => {

    let resp = await axios({
        method: method,
        baseURL: BASE_URL,
        url: endpoint,
        data: body,
        params: {
            ...body,
            api_key: API_KEY,
        },
        headers: {
            'Authorization': AUTHORIZATION_BEARER
        },
        transformRequest: data => {
            return data
        },
    })
        .then(response => response.data)
        .catch(error => error)

    return resp
}