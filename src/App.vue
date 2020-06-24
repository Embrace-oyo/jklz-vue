<template>
	<div id="app">
		<div class="content" :class="{miniContent: isFooter}">
			<router-view/>
		</div>
		<page-footer v-if="isFooter" :curPath="path"/>
	</div>
</template>
<script>
	import pageFooter from '@/components/footer'
	import wx from "weixin-js-sdk";
	export default {
		name: "app",
		components: {
			pageFooter
		},
		watch: {
			// 监听路由地址
			$route(to) {
				this.path = to.path
				this.path === '/' || this.path === '/user' ? this.isFooter = true : this.isFooter = false
			}
		},
		data() {
			return {
				path: '',
				isFooter: false,
			}
		},
		methods: {
			// 获取微信 JSSDk
			getWxJSSDK() {
				let params = {
					appUrl: encodeURIComponent(`${window.location.href.split('#')[0]}`),
					weiXinId: localStorage.getItem('weiXinId')
				}
				this.$api.getSignature(params).then(res => {
					let that = this
					let {appId, timestamp, nonceStr, signature} = res.data.jsapiSignature
					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: appId, // 必填，公众号的唯一标识
						timestamp: timestamp, // 必填，生成签名的时间戳
						nonceStr: nonceStr, // 必填，生成签名的随机串
						signature: signature,// 必填，签名
						jsApiList: ['openLocation', 'getLocation', 'chooseWXPay'] // 必填，需要使用的JS接口列表
					});
					wx.ready(() => {
						console.log('jsSDK调用成功')
						// 获取用户坐标
						wx.getLocation({
							success(res) {
								that.lat = res.latitude;
								that.lng = res.longitude;
								let geo = new AMap.Geocoder();
								let lngLat = [that.lng, that.lat]
								geo.getAddress(lngLat, (status, result) => {
									if (status === 'complete' && result.regeocode) {
										that.address = result.regeocode.addressComponent.city
										localStorage.lat = res.latitude
										localStorage.lng = res.longitude
									} else {
										that.$toast('根据经纬度查询地址失败')
									}
								})
							},
							cancel(err) {
								that.$toast('用户拒绝授权获取地理位置')
							}
						})
					}),
					wx.error(() => {
						console.log('jsSDK调用失败')
					})
				})
			},
			// 软键盘兼容
			keybord(){
				;(/iphone|ipod|ipad/i.test(navigator.appVersion)) && document.addEventListener('blur', (e) => {
					// 这里加了个类型判断，因为a等元素也会触发blur事件
					['input', 'textarea'].includes(e.target.localName) && document.body.scrollIntoView(false)
				}, true)
			},
		},
		created() {
			this.getWxJSSDK()
			this.keybord()
		}
	}
</script>
<style lang="less">
	html {
		font-family: PingFang SC;
	}
	
	#app {
		width: 100%;
		height: 100vh;
		background-color: #f7f7f7;
		overflow: hidden;
		
		.content {
			width: 100%;
		}
		
		.miniContent {
			height: calc(100vh - 59px);
		}
	}
</style>
