/**
 * axios实例化
 * **/

import axios from 'axios'
import urlConfig from '@/utils/urlConfig'
import {Toast} from "cube-ui";

const baseURL = urlConfig.baseUrl
const uploadUrl = urlConfig.uploadUrl

let instance = axios.create({
	baseURL: baseURL,
	timeout: 10000,
});

let upload = axios.create({
	baseURL: uploadUrl,
	timeout: 10000,
})


/* 发送拦截器 */
instance.interceptors.request.use(
	(config) => {
		let token = localStorage.getItem('token') ? localStorage.getItem('token') : ''
		if (config.params && config.params.token) token = config.params.token
		config.headers['token'] = token
		return config
	},
	(err) => {
		return Promise.reject(err)
	}
)


/* 请求拦截器 */

instance.interceptors.response.use(
	(response) => {
		switch (response.data.code) {
			case 0:
				return response;
				break;
			case 101:
				return response;
				break;
			case 500:
				Toast.$create({
					txt: response.data.msg,
					type: 'txt',
					time: 2000
				}).show()
				break
			default:
				Toast.$create({
					txt: response.data.msg,
					type: 'txt',
					time: 2000
				}).show()
				break
		}
	},
	(error) => {
		if (error.response.code === 401) {
			window.localStorage.removeItem('token')
			window.localStorage.removeItem('islogin')
			return Promise.reject({code: 401, msg: '请重新登录'})
		}
		return Promise.reject(error)
	}
)

export default instance
