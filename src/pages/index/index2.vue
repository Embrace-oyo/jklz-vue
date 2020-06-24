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
			<div class="banner">
				<cube-slide ref="slide" :data="bannerList">
					<cube-slide-item v-for="(item, index) in bannerList" :key="index">
						<a href="javascript:" @click="bannerClick(item)">
							<img :src="item.image" @error="$api.defaultImg" :onerror="$api.defaultImg" width="100%">
						</a>
					</cube-slide-item>
				</cube-slide>
			</div>
			<div class="nav">
				<router-link class="item" to="/hospital?type=0" tag="div">
					<img src="~@/assets/images/icon/icon_yygh.png" alt="">
					<span>预约挂号</span>
				</router-link>
				<router-link class="item" to="/hospital?type=1" tag="div">
					<img src="~@/assets/images/icon/icon_mzjf.png" alt="">
					<span>门诊缴费</span>
				</router-link>
				<router-link class="item" to="/hospital?type=2" tag="div">
					<img src="~@/assets/images/icon/icon_hzcx.png" alt="">
					<span>候诊查询</span>
				</router-link>
			</div>
			<div class="menu">
				<router-link class="item" to="/navigation" tag="div">
					<img src="~@/assets/images/icon/icon_yssf.png" alt="">
					<span>智能导诊</span>
				</router-link>
				<router-link class="item" to="/hospital?type=4" tag="div">
					<img src="~@/assets/images/icon/icon_zhzx.png" alt="">
					<span>住院预缴</span>
				</router-link>
				<router-link class="item" to="/hospital?type=3" tag="div">
					<img src="~@/assets/images/icon/icon_jydp.png" alt="">
					<span>电子报告</span>
				</router-link>
				<router-link class="item" to="/healthCard" tag="div">
					<img src="~@/assets/images/icon/icon_zndz.png" alt="">
					<span>健康卡</span>
				</router-link>
			</div>
			<div class="pic">
				<div class="tit">健康宣教</div>
				<span class="icon"></span>
				<ul>
					<router-link tag="li" :to="`/propagandaDetail?articleId=${item.id}`" class="item" v-for="item of artList" :key="item.id">
						<i></i>
						<span>{{item.title}}</span>
					</router-link>
				</ul>
			</div>
		</div>
		<div class="box interval">
			<div class="hosptail">
				<div class="title">
					<span>医院列表</span>
					<router-link to="/hospital" tag="span">查看更多<i></i></router-link>
				</div>
				<div class="list">
					<div class="item" v-for="(item, index) of hospitalList" :key="index" @click.stop="goHospital(item)">
						<div class="poster">
							<img :src="item.logo" @error="$api.defaultHospitalImg" :onerror="$api.defaultHospitalImg">
						</div>
						<div class="detail">
							<span class="name">{{item.hisHospitalName}}</span>
							<span class="grade">{{item.grade}}</span>
							<span class="distance" @click.stop="navigation(item)"><i></i>{{distance(item.distance)}}</span>
							<span class="addr">{{item.hisHospitaladdr}}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import wx from "weixin-js-sdk";
	
	export default {
		name: "index2",
		data() {
			return {
				val: '',
				lng: '',
				lat: '',
				address: '',
				bannerList: [],
				hospitalList: [],
				artList: []
			}
		},
		methods: {
			// 距离转换
			distance(dis) {
				if (!dis) return '未知距离'
				return parseFloat(dis / 1000).toFixed(2) + 'km'
			},
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
				if(item.mediaType == 2) return
				// 1URL链接” 2无  3“自定义ID” 4富文本
				this.$router.push({path: '/bannerDetail', query: {id: item.id}})
			},
			// 获取医院列表
			getHospital() {
				let params = {
					page: 1,
					limit: 3,
					lat: localStorage.lat ? localStorage.lat : '',
					lng: localStorage.lng ? localStorage.lng : ''
				}
				return this.$api.hospitalSearch(params).then(res => {
					if(res.data.code === 0){
						let data = res.data.Page
						this.hospitalList = data.list
					}
				})
			},
			// 获取未读消息
			getReader() {
				this.$api.readState().then(res => {
					console.log(res)
				})
			},
			// 跳转医院详情
			goHospital(data) {
				this.$router.push({
					path: '/hospitalDetail',
					query: {data: encodeURIComponent(JSON.stringify(data))}
				})
			},
			// 获取文章列表
			getList(){
				this.$api.articleList({page: 1, limit: 2}).then(res => {
					if(res.data.code === 0){
						this.artList = res.data.page.list
					}
				})
			},
			// 导航
			navigation(item){
				let position = `${item.lng},${item.lat}`
				let name = item.hisHospitalName
				let url = `//uri.amap.com/marker?position=${position}&name=${name}`
				window.location.href = url
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.getHospital()
			})
		},
		created() {
			document.title = '健康阆中'
			this.getBannerList()
			this.getList()
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
					width: 304px;
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
						width: 250px;
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
			
			.banner {
				margin-top: 18px;
				width: 345px;
				height: 162px;
				border-radius: 10px;
				overflow: hidden;
			}
			
			.nav {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 30px;
				
				.item {
					width: 105px;
					height: 120px;
					background: rgba(255, 255, 255, 1);
					box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.08);
					border-radius: 10px;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					
					img {
						width: 33.5px;
						height: 34.5px;
					}
					
					span {
						margin-top: 10px;
						color: #222222;
						font-size: 13px;
						font-weight: 500;
					}
				}
			}
			
			.menu {
				width: 100%;
				margin-top: 30.5px;
				display: flex;
				justify-content: space-around;
				align-items: center;
				
				.item {
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					
					img {
						width: 27px;
						height: 27px;
					}
					
					span {
						font-size: 13px;
						color: #222222;
						font-weight: 500;
						margin-top: 9px;
					}
				}
			}
			
			.pic {
				padding: 0 15px;
				height: 94px;
				margin-top: 21px;
				margin-bottom: 14.5px;
				border: 1px dashed #cccccc;
				background-color: #f6f8fc;
				display: flex;
				align-items: flex-start;
				justify-content: center;
				flex-direction: column;
				position: relative;
				.icon {
					width: 28.8px;
					height: 34.2px;
					background-image: url("~@/assets/images/other/pic_zf.png");
					background-size: cover;
					background-repeat: no-repeat;
					background-position: center center;
					position: absolute;
					right: 15px;
					bottom: 15px;
				}
				.tit{
					font-size: 18px;
					margin-bottom: 10px;
					font-weight: 500;
					color: #222222;
				}
				ul{
					width: 100%;
					.item{
						width: 100%;
						font-size: 16px;
						margin: 5px;
						font-weight: 500;
						color: #999999;
						display: flex;
						align-items: center;
						justify-content: flex-start;
						i{
							display: flex;
							width: 5px;
							height: 5px;
							border-radius: 50%;
							background-color: #999;
							margin-right: 5px;
						}
						span{
							width: 350px;
							display: block;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
					}
				}
			}
			
			.hosptail {
				width: 100%;
				
				.title {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 18px;
					
					span {
						&:first-child {
							color: #222222;
							font-weight: bold;
							font-size: 18px;
						}
						
						&:last-child {
							font-weight: 500;
							color: rgba(153, 153, 153, 1);
							font-size: 12px;
							display: flex;
							align-items: center;
							
							i {
								display: block;
								width: 5.5px;
								height: 9px;
								background-image: url("~@/assets/images/icon/icon_gd.png");
								background-size: cover;
								background-repeat: no-repeat;
								background-position: center center;
								margin-left: 5.5px;
							}
						}
					}
				}
				
				.list {
					width: 100%;
					margin-top: 7px;
					
					.item {
						width: 100%;
						margin-top: 15px;
						border-bottom: 1px solid rgba(232, 232, 232, 1);
						display: flex;
						justify-content: flex-start;
						align-items: center;
						padding-bottom: 15px;
						
						.poster {
							width: 100px;
							height: 100px;
							border-radius: 5px;
							
							img {
								width: 100px;
								height: 100px;
								border-radius: 5px;
							}
						}
						
						.detail {
							width: 221px;
							color: #222222;
							font-size: 16px;
							margin-left: 16px;
							display: flex;
							flex-direction: column;
							align-items: flex-start;
							justify-content: center;
							
							.name {
								font-size: 16px;
								font-weight: 500;
								color: rgba(34, 34, 34, 1);
								margin-bottom: 9px;
							}
							
							.grade {
								font-size: 14px;
								font-weight: 500;
								color: rgba(102, 102, 102, 1);
								line-height: 20px;
								margin-bottom: 11px;
							}
							
							.distance {
								font-size: 12px;
								font-weight: 500;
								color: rgba(102, 102, 102, 1);
								margin-bottom: 9.5px;
								display: flex;
								align-items: center;
								
								i {
									display: block;
									width: 11px;
									height: 12px;
									background-image: url("~@/assets/images/icon/icon_dz.png");
									background-size: cover;
									background-repeat: no-repeat;
									background-position: center center;
									margin-right: 2px;
								}
							}
							
							.addr {
								font-size: 12px;
								font-weight: 500;
								color: rgba(153, 153, 153, 1);
								line-height: 18px;
							}
						}
					}
				}
			}
		}
		
		.interval {
			border-top: 8px solid #f7f7f7;
			border-bottom: 8px solid #f7f7f7;
		}
	}
</style>
