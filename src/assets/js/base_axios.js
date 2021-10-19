import instance from './post'
import { Message } from 'element-ui';
import router from '../../router'
import axios from 'axios'

let jsonAxios = axios
jsonAxios.interceptors.request.use(
    config => {
        if (localStorage.token) { //判断token是否存在
            config.headers.Authorization = localStorage.token
            //  = 'Bearer f71b0217-6cdc-4f96-b752-6722cc8bf818';  //将token设置成请求头
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

instance.interceptors.request.use(
    config => {
        if (localStorage.token) { //判断token是否存在
            config.headers.Authorization = localStorage.token
            //  = 'Bearer f71b0217-6cdc-4f96-b752-6722cc8bf818';  //将token设置成请求头
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

instance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response.status === 401) {
            localStorage.clear()
            Message.error('登录过期，请退出重新登录')
            return router.replace('/Login');
        } else if (error.response.status === 502 || error.response.status === 400) {
            return Message.error('服务器响应失败，请稍后重试')
        } else {
            return Promise.reject(error);
        }
    }
);

export default {instance, jsonAxios}