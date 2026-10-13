import axios from 'axios';
import {API_BASE_URL} from '../../config/apiConfig';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout:1500,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})