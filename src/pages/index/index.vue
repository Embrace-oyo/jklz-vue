<template>
	<div class="index">
		<div class="box">
			<div class="search">
				<router-link tag="div" :to="'/search?keyword='+val" class="inputBox">
					<i></i>
					<input v-model="val" type="text" placeholder="医院名字/医生" disabled>
				</router-link>
				<router-link :to="'/search?keyword='+val" tag="span">搜索</router-link>
			</div>
		</div>
		<div class="banner">
			<cube-slide ref="slide" :data="bannerList">
				<cube-slide-item v-for="(item, index) in bannerList" :key="index">
					<a href="javascript:" @click="bannerClick(item)">
						<img :src="item.image" @error="$api.defaultImg" :onerror="$api.defaultImg">
					</a>
				</cube-slide-item>
			</cube-slide>
		</div>
		<div class="navigation">
			<router-link class="L" to="/hospital?type=0" tag="div">
				<span class="icon"></span>
				<span class="tit">预约挂号</span>
				<span class="desc">线上预约/方便快捷</span>
			</router-link>
			<div class="R">
				<router-link class="t" to="/hospital?type=1" tag="div">
					<span class="l"></span>
					<span class="r">
						<span>门诊缴费</span>
						<span>互联网医院在线缴费</span>
					</span>
				</router-link>
				<router-link class="b" to="/navigation" tag="div">
					<span class="l"></span>
					<span class="r">
						<span>智能导诊</span>
						<span>智能导诊专用通道</span>
					</span>
				</router-link>
			</div>
		</div>
		<div class="Box">
			<div class="item" v-for="item of menuList" :key="item.id" @click="itemClick(item)">
				<span class="icon" :style="{backgroundImage: 'url('+item.img+')'}"></span>
				<span class="word">{{item.name}}</span>
			</div>
		</div>
		<div class="mask" v-if="isMask">
			<div class="font"></div>
			<div class="btn" @click="maskTo"></div>
			<div class="btn1" @click="mask"></div>
		</div>
	</div>
</template>

<script>
	import wx from "weixin-js-sdk";
	
	export default {
		name: "index",
		data() {
			return {
				menuList: [
					{name: '医院列表', id: 1, img: require('@/assets/images/index/icon_yylb.png'), url: '/hospital'},
					{name: '住院服务', id: 2, img: require('@/assets/images/index/icon_zyjf.png'), url: '/hospital?type=4'},
					{name: '电子报告', id: 3, img: require('@/assets/images/index/icon_dzbg.png'), url: '/hospital?type=3'},
					{name: '健康卡', id: 4, img: require('@/assets/images/index/icon_jkk.png'), url: '/healthCard'},
					{name: '健康宣教', id: 5, img: require('@/assets/images/index/icon_jkxj.png'), url: '/propaganda'},
					{name: '候诊查询', id: 6, img: require('@/assets/images/index/icon_zndz.png'), url: '/hospital?type=2'},
					{name: '预约挂号记录', id: 7, img: require('@/assets/images/index/icon_yyxx.png'), url: '/makeAnAppointmentRecord'},
					{name: '满意度调查', id: 8, img: require('@/assets/images/index/icon_myddc.png')},
					{name: '入院服务', id: 9, img: require('@/assets/images/index/icon_ryfw.png')},
					{name: '门诊信息公示', id: 10, img: require('@/assets/images/index/icon_mzxxgs.png')},
					{name: '电子病例', id: 11, img: require('@/assets/images/index/icon_dzbg1.png')},
					{name: '电子处方', id: 12, img: require('@/assets/images/index/icon_dzcf.png')},
					{name: '电子发票', id: 13, img: require('@/assets/images/index/icon_dzfp.png')},
					{name: '新药临床试验', id: 14, img: require('@/assets/images/index/icon_xylcsy.png')},
					{name: '院内导航', id: 15, img: require('@/assets/images/index/icon_yndh.png')},
					{name: '医保办理指南', id: 16, img: require('@/assets/images/index/icon_ybzn.png')},
					{name: '就诊卡', id: 17, img: require('@/assets/images/index/icon_jzk.png')},
					{name: '医保审核查询', id: 18, img: require('@/assets/images/index/icon_ybshcx.png')},
					{name: '门特预交金', id: 19, img: require('@/assets/images/index/icon_mtyjj.png')},
					{name: '更多', id: 20, img: require('@/assets/images/index/icon_more.png')},
				],
				val: '',
				lng: '',
				lat: '',
				address: '',
				bannerList: [],
				hospitalList: [],
				artList: [],
				isMask: false,
			}
		},
		methods: {
			// 获取banner图
			getBannerList() {
				this.bannerList = [{image: require('../../assets/images/index/banner.png')}]
				this.$api.banner().then(res => {
					if (res.data.code === 0) {
						this.bannerList = (res.data.advertisement.length === 0 ? [{image: require('../../assets/images/index/banner.png')}] : res.data.advertisement)
					}
				}).catch(err => {
					this.bannerList = [{image: require('../../assets/images/index/banner.png')}]
				})
			},
			// banner点击事件
			bannerClick(item) {
				if (item.mediaType == 2) return
				// 1URL链接” 2无  3“自定义ID” 4富文本
				this.$router.push({path: '/bannerDetail', query: {id: item.id}})
			},
			// 按钮点击
			itemClick(item) {
				if (!item.url) {
					this.$toast('暂未开放，敬请期待')
					return
				}
				this.$router.push({
					path: item.url
				})
			},
			// 获取用户信息
			getUserInfo(){
				this.$mask().show()
				this.$api.getUserInfo().then(res => {
					if(res.data.code === 0){
						let data = res.data.patient
						this.$mask().hide()
						if(localStorage.isMask) return
						if((data.realname === null || data.realname === '') && !localStorage.isMask){
							this.isMask = true
						}else{
							this.isMask = false
							localStorage.isMask = false
						}
					}
				})
			},
			// 遮罩处理
			mask(){
				this.isMask = false
				localStorage.isMask = false
			},
			// 遮罩跳转
			maskTo(){
				this.isMask = false
				localStorage.isMask = false
				this.$router.push({
					path: '/help'
				})
			}
		},
		created() {
			document.title = '健康阆中'
			this.getUserInfo()
			this.getBannerList()
		},
	}
</script>

<style scoped lang="less">
	.index {
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: #fff;
		float: left;
		
		.box {
			padding: 0 15px;
			
			.search {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 8px;
				font-size: 16px;
				color: #222222;
				
				.inputBox {
					width: 81vw;
					height: 35px;
					background: rgba(237, 238, 242, 1);
					border-radius: 17.5px;
					display: flex;
					align-items: center;
					justify-content: flex-start;
					
					i {
						display: block;
						width: 17px;
						height: 17px;
						margin-left: 15px;
						background-image: url("~@/assets/images/icon/icon_sous.png");
						background-size: contain;
						background-position: center center;
						background-repeat: no-repeat;
					}
					
					input {
						width: 66.6vw;
						height: 100%;
						font-size: 13px;
						margin-left: 8px;
						outline: none;
						border: none;
						background-color: transparent;
						
						&::placeholder {
							color: #848898;
						}
					}
				}
			}
		}
		
		.banner {
			margin-top: 8px;
			width: 100%;
			height: 159px;
			overflow: hidden;
		}
		
		.navigation {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.L {
				width: 40vw;
				height: 127px;
				border-bottom: 2px solid rgba(238, 236, 234, 1);
				border-right: 2px solid rgba(238, 236, 234, 1);
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				
				.icon {
					display: block;
					width: 37px;
					height: 38px;
					margin-bottom: 19px;
					background-image: url("~@/assets/images/index/icon_yygh.png");
					background-size: cover;
					background-position: center center;
					background-repeat: no-repeat;
				}
				
				.tit {
					font-size: 14px;
					font-weight: 400;
					color: rgba(34, 34, 34, 1);
					margin-bottom: 4px;
				}
				
				.desc {
					font-size: 11px;
					font-weight: 400;
					color: rgba(102, 102, 102, 1);
				}
			}
			
			.R {
				width: 59.4vw;
				display: flex;
				justify-content: center;
				align-items: flex-start;
				flex-direction: column;
				
				.t {
					width: 100%;
					height: 62px;
					border-bottom: 2px solid rgba(238, 236, 234, 1);
					display: flex;
					align-items: center;
					justify-content: center;
					
					.l {
						display: flex;
						width: 26px;
						height: 30px;
						background-image: url("~@/assets/images/index/icon_mzjf.png");
						background-size: cover;
						background-position: center center;
						background-repeat: no-repeat;
						margin-right: 15px;
					}
					
					.r {
						display: flex;
						flex-direction: column;
						align-items: center;
						
						span:first-child {
							font-size: 14px;
							font-weight: 400;
							color: rgba(34, 34, 34, 1);
							margin-bottom: 4px;
						}
						
						span:last-child {
							font-size: 11px;
							font-weight: 400;
							color: rgba(102, 102, 102, 1);
						}
					}
				}
				
				.b {
					width: 100%;
					height: 63px;
					border-bottom: 2px solid rgba(238, 236, 234, 1);
					display: flex;
					align-items: center;
					justify-content: center;
					
					.l {
						display: flex;
						width: 26px;
						height: 30px;
						background-image: url("~@/assets/images/index/icon_hzcx.png");
						background-size: cover;
						background-position: center center;
						background-repeat: no-repeat;
						margin-right: 15px;
					}
					
					.r {
						display: flex;
						flex-direction: column;
						align-items: center;
						
						span:first-child {
							font-size: 14px;
							font-weight: 400;
							color: rgba(34, 34, 34, 1);
							margin-bottom: 4px;
						}
						
						span:last-child {
							font-size: 11px;
							font-weight: 400;
							color: rgba(102, 102, 102, 1);
						}
					}
				}
			}
		}
		
		.Box {
			padding: 10px 15px;
			overflow: hidden;
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-wrap: wrap;
			
			.item {
				width: 20vw;
				float: left;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				position: relative;
				margin: 30px 0;
				
				.icon {
					display: block;
					width: 45px;
					height: 45px;
					background-size: contain;
					background-position: center center;
					background-repeat: no-repeat;
					margin-bottom: 8px;
				}
				
				.word {
					text-align: center;
					width: 130px;
					position: absolute;
					bottom: -20px;
					left: 50%;
					margin-left: -65px;
					font-size: 14px;
					font-weight: 400;
					color: rgba(34, 34, 34, 1);
				}
			}
		}
		
		.mask{
			position: fixed;
			left: 0;
			top: 0;
			z-index: 999;
			width: 100%;
			height: 100%;
			background-color: rgba(0,0,0,0.5);
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			.font{
				width: 220.5px;
				height: 23px;
				background-image: url("~@/assets/images/icon/font1.png");
				background-size: 220.5px 23px;
				background-position: center center;
				background-repeat: no-repeat;
				margin-bottom: 40px;
			}
			.btn{
				width: 90px;
				height: 41px;
				background-image: url("~@/assets/images/icon/work.png");
				background-size: 90px 41px;
				background-position: center center;
				background-repeat: no-repeat;
				margin-bottom: 30px;
			}
			.btn1{
				width: 90px;
				height: 41px;
				background-image: url("~@/assets/images/icon/work2.png");
				background-size: 90px 41px;
				background-position: center center;
				background-repeat: no-repeat;
			}
		}
	}
</style>
<style lang="less">
	.cube-slide {
		.cube-slide-item {
			a {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				
				img {
					width: 100%;
					height: auto;
				}
			}
		}
	}
</style>
