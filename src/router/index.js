/**
 * 路由
 * 登录拦截
 * **/
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const TITLE = '健康阆中'

const routes = [
	// 首页
	{
		path: '/',
		name: 'Home',
		meta: {
			title: ''
		},
		component: () => import('@/pages/index/index')
	},
	// 原首页
	{
		path: '/index2',
		name: 'index2',
		meta: {
			title: ''
		},
		component: () => import('@/pages/index/index2')
	},
	// 登录页
	{
		path: '/login',
		name: 'login',
		meta: {
			title: '登录'
		},
		component: () => import('@/pages/login/login')
	},
	// 搜索
	{
		path: '/search',
		name: 'search',
		meta: {
			title: '搜索'
		},
		component: () => import('@/pages/search/search')
	},
	// banner详情
	{
		path: '/bannerDetail',
		name: 'bannerDetail',
		meta: {
			title: 'banner详情'
		},
		component: () => import('@/pages/bannerDetail/bannerDetail')
	},
	// 选择医院
	{
		path: '/chooseHospital',
		name: 'chooseHospital',
		meta: {
			title: '选择医院'
		},
		component: () => import('@/pages/chooseHospital/chooseHospital')
	},
	// 科室列表
	{
		path: '/department',
		name: 'department',
		meta: {
			title: '科室列表'
		},
		component: () => import('@/pages/department/department')
	},
	// 医生列表
	{
		path: '/doctor',
		name: 'doctor',
		meta: {
			title: '医生列表'
		},
		component: () => import('@/pages/doctor/doctor')
	},
	// 医生详情
	{
		path: '/doctorDetail',
		name: 'doctorDetail',
		meta: {
			title: '医生详情'
		},
		component: () => import('@/pages/doctor/doctorDetail')
	},
	// 预约挂号
	{
		name: 'makeAnAppointment',
		path: '/makeAnAppointment',
		meta: {
			title: '预约挂号'
		},
		component: () => import('@/pages/makeAnAppointment/makeAnAppointment')
	},
	// 预约挂号记录
	{
		name: 'makeAnAppointmentRecord',
		path: '/makeAnAppointmentRecord',
		meta: {
			title: '预约挂号记录'
		},
		component: () => import('@/pages/makeAnAppointment/makeAnAppointmentRecord')
	},
	// 预约详情
	{
		name: 'makeAnAppointmentDetail',
		path: '/makeAnAppointmentDetail',
		meta: {
			title: '预约挂号详情'
		},
		component: () => import('@/pages/makeAnAppointment/makeAnAppointmentDetail')
	},
	// 确认挂号信息
	{
		name: 'confirmTheInformation',
		path: '/confirmTheInformation',
		meta: {
			title: '确认挂号信息'
		},
		component: () => import('@/pages/makeAnAppointment/confirmTheInformation')
	},
	// 健康卡列表
	{
		name: 'healthCard',
		path: '/healthCard',
		meta: {
			title: '添加健康卡'
		},
		component: () => import('@/pages/healthCard/healthCard')
	},
	// 添加健康卡
	{
		name: 'addHealthCard',
		path: '/addHealthCard',
		meta: {
			title: '添加健康卡'
		},
		component: () => import('@/pages/healthCard/addHealthCard')
	},
	// 健康卡详情
	{
		name: 'healthCardDetail',
		path: '/healthCardDetail',
		meta: {
			title: '选择就诊人'
		},
		component: () => import('@/pages/healthCard/healthCardDetail')
	},
	// 选择就诊人
	{
		name: 'choosePeople',
		path: '/choosePeople',
		meta: {
			title: '选择就诊人'
		},
		component: () => import('@/pages/choosePeople/choosePeople')
	},
	// 门诊缴费
	{
		name: 'pay',
		path: '/pay',
		meta: {
			title: '门诊缴费'
		},
		component: () => import('@/pages/pay/pay')
	},
	// 门诊缴费详情
	{
		name: 'payDetail',
		path: '/payDetail',
		meta: {
			title: '门诊缴费详情'
		},
		component: () => import('@/pages/pay/payDetail')
	},
	// 候诊查询
	{
		name: 'waiting',
		path: '/waiting',
		meta: {
			title: '候诊查询'
		},
		component: () => import('@/pages/waiting/waiting')
	},
	// 智能导诊
	{
		name: 'navigation',
		path: '/navigation',
		meta: {
			title: '智能导诊'
		},
		component: () => import('@/pages/navigation/navigation')
	},
	// 智能导诊二级页面
	{
		name: 'navigationDetail',
		path: '/navigationDetail',
		meta: {
			title: '智能导诊'
		},
		component: () => import('@/pages/navigation/navigationDetail')
	},
	// 住院预缴
	{
		name: 'hospitalPay',
		path: '/hospitalPay',
		meta: {
			title: '住院预缴'
		},
		component: () => import('@/pages/hospitalPay/hospitalPay')
	},
	// 预交金
	{
		name: 'payment',
		path: '/payment',
		meta: {
			title: '预交金'
		},
		component: () => import('@/pages/hospitalPay/payment')
	},
	// 预交金说明
	{
		name: 'payInstructions',
		path: '/payInstructions',
		meta: {
			title: '预交金说明'
		},
		component: () => import('@/pages/hospitalPay/payInstructions')
	},
	// 预交金充值
	{
		name: 'topUp',
		path: '/topUp',
		meta: {
			title: '预交金充值'
		},
		component: () => import('@/pages/hospitalPay/topUp')
	},
	// 预交金充值记录
	{
		name: 'payRecord',
		path: '/payRecord',
		meta: {
			title: '预交金充值记录'
		},
		component: () => import('@/pages/hospitalPay/payRecord')
	},
	// 预交金充值记录详情
	{
		name: 'payRecordDetail',
		path: '/payRecordDetail',
		meta: {
			title: '预交金充值记录详情'
		},
		component: () => import('@/pages/hospitalPay/payRecordDetail')
	},
	// 住院清单
	{
		name: 'listing',
		path: '/listing',
		meta: {
			title: '住院清单'
		},
		component: () => import('@/pages/hospitalPay/listing')
	},
	// 住院清单详情
	{
		name: 'listingDetail',
		path: '/listingDetail',
		meta: {
			title: '住院清单'
		},
		component: () => import('@/pages/hospitalPay/listingDetail')
	},
	// 电子报告
	{
		name: 'report',
		path: '/report',
		meta: {
			title: '电子报告'
		},
		component: () => import('@/pages/report/report')
	},
	// 电子报告详情
	{
		name: 'reportDetail',
		path: '/reportDetail',
		meta: {
			title: '电子报告详情'
		},
		component: () => import('@/pages/report/reportDetail')
	},
	// 健康宣传
	{
		name: 'propaganda',
		path: '/propaganda',
		meta: {
			title: '健康宣传'
		},
		component: () => import('@/pages/propaganda/propaganda')
	},
	// 健康宣传详情
	{
		name: 'propagandaDetail',
		path: '/propagandaDetail',
		meta: {
			title: '健康宣传详情'
		},
		component: () => import('@/pages/propaganda/propagandaDetail')
	},
	// 医院列表
	{
		name: 'hospital',
		path: '/hospital',
		meta: {
			title: '医院列表'
		},
		component: () => import('@/pages/hospital/hospital')
	},
	// 医院详情
	{
		name: 'hospitalDetail',
		path: '/hospitalDetail',
		meta: {
			title: '医院详情'
		},
		component: () => import('@/pages/hospital/hospitalDetail')
	},
	// 医院介绍
	{
		name: 'hospitalIntroduce',
		path: '/hospitalIntroduce',
		meta: {
			title: '医院介绍'
		},
		component: () => import('@/pages/hospital/hospitalIntroduce')
	},
	// 科室介绍
	{
		name: 'departmentDetail',
		path: '/departmentDetail',
		meta: {
			title: '科室介绍'
		},
		component: () => import('@/pages/department/departmentDetail')
	},
	// 就医指南
	{
		name: 'goDoctor',
		path: '/goDoctor',
		meta: {
			title: '就医指南'
		},
		component: () => import('@/pages/hospital/goDoctor')
	},
	// 特色科室
	{
		name: 'special',
		path: '/special',
		meta: {
			title: '特色科室'
		},
		component: () => import('@/pages/hospital/special')
	},
	// 缴费记录
	{
		name: 'record',
		path: '/record',
		meta: {
			title: '缴费记录'
		},
		component: () => import('@/pages/pay/record')
	},
	// 用户中心
	{
		name: 'user',
		path: '/user',
		meta: {
			title: '我的'
		},
		component: () => import('@/pages/user/user')
	},
	// 用户信息
	{
		name: 'userInfo',
		path: '/userInfo',
		meta: {
			title: '我的信息'
		},
		component: () => import('@/pages/user/userInfo')
	},
	// 消息中心
	{
		name: 'message',
		path: '/message',
		meta: {
			title: '消息中心'
		},
		component: () => import('@/pages/user/message')
	},
	// 消息详情
	{
		name: 'messageDetail',
		path: '/messageDetail',
		meta: {
			title: '消息详情'
		},
		component: () => import('@/pages/user/messageDetail')
	},
	// 帮助中心
	{
		name: 'help',
		path: '/help',
		meta: {
			title: '帮助中心'
		},
		component: () => import('@/pages/user/help')
	},
	// 意见反馈
	{
		name: 'suggest',
		path: '/suggest',
		meta: {
			title: '意见反馈'
		},
		component: () => import('@/pages/user/suggest')
	},
	// 满意度调查
	{
		name: 'survey',
		path: '/survey',
		meta: {
			title: '满意度调查'
		},
		component: () => import('@/pages/user/survey')
	},
]


const router = new VueRouter({
	base: process.env.BASE_URL,
	routes
})


// 检测是否登录
router.beforeEach((to, from, next) => {
	if(!window.location.href.split('?')[1]){
		next()
	}else if(window.location.href.split('?')[1] && window.location.href.split('?')[1].split('&')[0].split('=')[0] === 'token'){
		let token = window.location.href.split('?')[1].split('&')[0].split('=')[1]
		let weiXinId = window.location.href.split('?')[1].split('&')[2].split('=')[1]
		let isLoginOk = window.location.href.split('?')[1].split('&')[1].split('=')[1]
		let accountName = decodeURIComponent(window.location.href.split('?')[1].split('&')[3].split('=')[1].split('#')[0])
		window.localStorage.setItem('token', token)
		window.localStorage.setItem('weiXinId', weiXinId)
		window.localStorage.setItem('isLoginOk', isLoginOk)
		window.localStorage.setItem('accountName', accountName)
		next()
	}
})


export default router
