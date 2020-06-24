/**
 * 请求接口集合
 * **/
import http from '@/utils/http'
import wx from "weixin-js-sdk"

export default {
	// 默认图片
	defaultImg: (event) => event.target.src = require('../assets/images/default/img_zwsj.png'),
	// 默认头像
	defaultHead: (event) => event.target.src = require('../assets/images/default/img_mrtx.png'),
	// 默认医院图片
	defaultHospitalImg: (event) => event.target.src = require('../assets/images/default/img_hospital.png'),
	// 默认医生图片
	defaultDoctorImg: (event) => event.target.src = require('../assets/images/default/img_doctor.png'),
	
	// 用户注册隐私协议
	agreement: (params) => http.get('/api/agreement/privacy/', {params}),
	// 发送验证码
	smsCode: (params) => http.get(`/api/patient/sms/${params.verificationCodeType}/${params.phone}`, {params}),
	// 验证手机号
	validation: (params) => http.post(`/api/patient/update/proCheckPhone`, params),
	// 修改手机号
	updatePhone: (params) => http.post(`/api/patient/update/phone`, params),
	// 验证验证码
	regSMS: (params) => http.post('/api/addinfo', params),
	
	// banner
	banner: (params) => http.get(`/api/pushnotification/banner/list`, {params}),
	// banner详情
	bannerDetail: (params) => http.get(`/api/pushnotification/banner/info/${params.id}`, {params}),
	
	// 获取微信签名
	getSignature: (params) => http.get('/api/jsApiSignature', {params}),
	
	// 是否有未读
	readState: (params) => http.get(`/api/pushnotification/survey/readState`, {params}),
	
	// 医院列表
	hospitalList: (params) => http.post('/api/hospital/list', params),
	// 医院搜索
	hospitalSearch: (params) => http.get('/api/hospital/all', {params}),
	// 医院详情
	hospitalDetail: (params) => http.get(`/api/hospital/info/${params.id}`, {params}),
	// 医院科室
	department: (params) => http.get(`/api/hospital/department/${params.hospitalId}`, {params}),
	// 获取科室排班信息
	schedule: (params) => http.get(`/api/hospital/schedule`, {params}),
	// 医生详情
	doctorDetail: (params) => http.get(`/api/work/doctor/info/${params.doctorID}`, {params}),
	// 医生排班信息
	doctorSchedule: (params) => http.get(`/api/work/doctor/schedule/${params.doctorID}`, {params}),
	// 更多医生
	doctorSearch: (params) => http.get('/api/work/doctor/all', {params}),
	// 候诊查询
	queryWait: (params) => http.post('/api/work/doctor/queryWait', params),
	
	
	//健康卡列表
	healthCardList: (params) => http.get('/api/doctor/ehealthcard/list', {params}),
	//保存健康卡
	addHealthCardList: (params) => http.post('/api/doctor/ehealthcard/save', params),
	//健康卡详情
	healthCardDetail: (params) => http.get(`/api/doctor/ehealthcard/info/${params.id}`, {params}),
	// 生成就诊卡
	generateVisitCard: (params) => http.post('/api/doctor/ehealthcard/generateVisitCard', params),
	// 解绑健康卡
	deleteEhealthcard: (params) => http.post('/api/doctor/ehealthcard/delete', params),
	// 健康卡卡包跳转
	ehealthcardUrl: (params) => http.get(`/api/doctor/ehealthcard/url/${params.id}`, {params}),
	
	
	//获取用户信息
	getUserInfo: (params) => http.get('/api/patient/info', {params}),
	//修改个人信息
	setUserInfo: (params) => http.post('/api/patient/update', params),
	
	// 预约挂号记录列表
	makeList: (params) => http.post('/api/pay/orderList', params),
	// 预约挂号记录详情
	makeDetail: (params) => http.get(`/api/pay/registration/info/${params.id}`, {params}),
	// 预约挂号记录订单删除
	makeOrderDelete: (params) => http.get(`/api/pay/deleteOrder/${params.id}`, {params}),
	// 预约挂号记录订单退款
	refund: (params) => http.post(`/api/pay/refund/${params.orderSn}`, params),
	// 生成挂号订单
	registerNewOrder: (params) => http.post(`/api/pay/createOrder/registerNew`, params),
	// 挂号订单取消
	makeCancel: (params) => http.get(`/api/pay/abolishOrder/${params.orderId}`, {params}),
	// 判断今天已经预约次数
	checkIsHaveAppointment: (params) => http.post(`/api/pay/checkIsHaveAppointment`, params),
	
	
	//门诊缴费列表
	orderList: (params) => http.post(`/api/pay/order/findUnpayPatientOrderList`, params),
	//门诊缴费列表详情
	orderListDetail: (params) => http.get(`/api/pay/outpatient/orderItem/${params.orderId}`, params),
	//门诊缴费支付
	orderListPay: (params) => http.get(`/api/pay/createOrder/outpatientPaymentNew/${params.id}`, {params}),
	
	
	//住院清单
	queryInpatientBillList: (params) => http.post(`/api/hospital/queryInpatientBillList`, params),
	//住院余额
	queryInpatientBalanceInfo: (params) => http.post(`/api/pay/queryInpatientBalanceInfo`, params),
	//充值记录列表
	queryInpatientBalanceInfoList: (params) => http.get(`/api/pay/queryRechargeRecords`, {params}),
	//充值记录详情
	queryRechargeDetail: (params) => http.get(`/api/pay/queryRechargeDetail`, {params}),
	
	
	// 检验报告
	queryLabReportList: (params) => http.post(`/api/hospital/queryLabReportList`, params),
	// 检验报告详情
	queryLabReportDetails: (params) => http.post(`/api/hospital/queryLabReportDetails`, params),
	// 检查报告
	queryCheckReportList: (params) => http.post(`/api/hospital/queryCheckReportList`, params),
	// 检查报告详情
	queryCheckReportDetails: (params) => http.post(`/api/hospital/queryCheckReportDetails`, params),
	
	
	// 获取平台全部文章列表
	articleList: (params) => http.get(`/api/article/platform/list`, {params}),
	// 获取平台文章详情
	article: (params) => http.get(`/api/article/details/${params.articleId}/1`, {params}),
	
	
	// 科室介绍
	departmentIntroduction: (params) => http.post(`/api/hospital/departmentIntroduction`, params),
	// 就医指南
	guide: (params) => http.get(`/api/hospital/guide`, {params}),
	
	// 缴费记录
	recordList: (params) => http.post(`/api/pay/queryPaidOrderList`, params),
	
	// 特色科室
	characteristicDepartments: (params) => http.get(`/api/hospital/characteristicDepartments`, {params}),
	
	// 帮助中心
	getHelpDetail: (params) => http.get(`/api/agreement/getHelpDetail`, {params}),
	
	// 模糊查询医生或医院
	doctorAndHospitalInfo: (params) => http.get(`/api/work/doctor/doctorAndHospitalInfo`, {params}),
	
	// 就医消息
	informationList: (params) => http.post(`/api/pushnotification/informationList`, params),
	
	// 就医消息已读
	updateInformationStatus: (params) => http.get(`/api/pushnotification/information/updateInformationStatus/${params.id}`, {params}),
	
	// 消息公告
	notice: (params) => http.get(`/api/patient/notice`, {params}),
	
	// 意见反馈
	feedback: (params) => http.post(`/api/pushnotification/feedback`, params),
	
	// 图片上传
	fileUpload: (params) => http.post(`/api/image/fileUpload`, params),
	
	// 充值预交金-生成住院预交费订单
	hospitalization: (params) => http.post(`/api/pay/createOrder/hospitalization`, params),
	
	// 获取不同医院预约日期集合
	getDaysByHostpitalId: (params) => http.get(`/api/hospital/getDaysByHostpitalId`, {params}),
	
	// 支付方法
	payFuc({appId, timeStamp, nonceStr, Package, signType, paySign, callBack}) {
		WeixinJSBridge.invoke(
			'getBrandWCPayRequest', {
				"appId": appId,     //公众号名称，由商户传入
				"timeStamp": timeStamp,         //时间戳，自1970年以来的秒数
				"nonceStr": nonceStr, //随机串
				"package": Package,
				"signType": signType,         //微信签名方式：
				"paySign": paySign, //微信签名
			},
			function (res) {
				callBack(res)
			})
	}
	
}
