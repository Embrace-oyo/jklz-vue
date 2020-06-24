<template>
	<div class="hospitalDetail">
		<div class="box">
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
				<router-link class="item" :to="`/department?hospitalId=${this.hospitalId}&type=1`" tag="div">
					<img src="~@/assets/images/icon/icon_yygh.png" alt="">
					<span>预约挂号</span>
				</router-link>
				<router-link class="item" :to="`/pay?hospitalId=${this.hospitalId}&hisOrganizationId=${this.hisOrganizationId}`"
				             tag="div">
					<img src="~@/assets/images/icon/icon_mzjf.png" alt="">
					<span>门诊缴费</span>
				</router-link>
				<router-link class="item" :to="`/department?hospitalId=${this.hospitalId}&type=2`" tag="div">
					<img src="~@/assets/images/icon/icon_hzcx.png" alt="">
					<span>候诊查询</span>
				</router-link>
			</div>
			<div class="menu">
				<router-link class="item" :to="'/hospitalIntroduce?hospitalId='+this.hospitalId" tag="div">
					<img src="~@/assets/images/icon/icon_yssf.png" alt="">
					<span>医院介绍</span>
				</router-link>
				<div class="item" tag="div" @click="toDepartment">
					<img src="~@/assets/images/icon/icon_zhzx.png" alt="">
					<span>特色科室</span>
				</div>
				<div class="item" @click="goto">
					<img src="~@/assets/images/icon/icon_jydp.png" alt="">
					<span>来院导航</span>
				</div>
				<router-link class="item" :to="`/goDoctor?hospitalId=${this.hospitalId}`" tag="div">
					<img src="~@/assets/images/icon/icon_zndz.png" alt="">
					<span>就医指南</span>
				</router-link>
			</div>
		</div>
		<div class="Box">
			<div class="jkxj">
				<span>健康宣教</span>
				<router-link tag="span" :to="`/propaganda?hospitalId=${hospitalId}`">查看更多<i></i></router-link>
			</div>
			<div class="list">
				<div class="noData" v-if="list.length === 0">
					<span>暂无数据~</span>
				</div>
				<router-link tag="div" :to="`/propagandaDetail?articleId=${item.id}`" class="item" v-for="item of list"
				             :key="item.id">
					<div class="l">
						<span class="title">{{item.title}}</span>
						<span class="subtitle"><i>{{item.publishUser}}</i><i>{{getDateDiff(item.createTime)}}</i></span>
					</div>
					<div class="r">
						<img :src="item.cover" alt="" @error="$api.defaultImg" :onerror="$api.defaultImg">
					</div>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "hospitalDetail",
		data() {
			return {
				bannerList: [],
				list: [],
				hospitalId: '',
				hisOrganizationId: '',
				lat: '',
				lng: '',
				hisHospitalName: '',
			}
		},
		methods: {
			// 获取banner图
			getBannerList() {
				this.$api.banner({hospitalId: this.hospitalId}).then(res => {
					if (res.data.code === 0) {
						this.bannerList = (res.data.advertisement.length === 0 ? [{image: ''}] : res.data.advertisement)
					}
				})
			},
			bannerClick(item) {
				if (item.mediaType == 2) return
				// 1URL链接” 2无  3“自定义ID” 4富文本
				this.$router.push({path: '/bannerDetail', query: {id: item.id}})
			},
			// 获取文章列表
			getList() {
				this.$api.articleList({page: 1, limit: 3, hospitalId: this.hospitalId}).then(res => {
					if (res.data.code === 0) {
						this.list = res.data.page.list
					}
				})
			},
			// 导航
			goto() {
				let name = this.hisHospitalName
				let from = `${window.localStorage.lng},${window.localStorage.lat},我的位置`
				let to = `${this.lng},${this.lat},${name}`
				let url = `//uri.amap.com/navigation?from=${from}&to=${to}`
				console.log(url)
				window.location.href = url
			},
			// 时间转换
			getDateDiff(dateTimeStamp) {
				let oldYear = parseInt(dateTimeStamp.split(' ')[0].split('-')[0])
				let oldMonth = parseInt(dateTimeStamp.split(' ')[0].split('-')[1])
				let oldDay = parseInt(dateTimeStamp.split(' ')[0].split('-')[2])
				let curYear = new Date().getFullYear()
				let curMonth = new Date().getMonth() + 1
				let curDay = new Date().getDay()
				if (curYear - oldYear > 1) {
					return dateTimeStamp.split(' ')[0]
				} else if (curYear - oldYear === 1) {
					let difMonth = 12 - oldMonth + curMonth
					if(difMonth > 1){
						return dateTimeStamp.split(' ')[0]
					}else if(difMonth === 1){
						let date = new Date()
						date.setMonth(curMonth -1)
						date.setDate(0)
						let days = date.getDate()
						let difDay = days - oldDay + curDay
						if(difDay === 4){
							return '4天前'
						}else if(difDay === 3){
							return '3天前'
						}else if(difDay === 2){
							return '2天前'
						}else if(difDay === 1){
							return '1天前'
						}else{
							return dateTimeStamp.split(' ')[0]
						}
					}
				} else if (curYear === oldYear) {
					if (curMonth - oldMonth > 1) {
						return dateTimeStamp.split(' ')[0]
					} else if (curMonth - oldMonth === 1) {
						let date = new Date()
						date.setMonth(curMonth -1)
						date.setDate(0)
						let days = date.getDate()
						let difDay = days - oldDay + curDay
						if(difDay === 4){
							return '4天前'
						}else if(difDay === 3){
							return '3天前'
						}else if(difDay === 2){
							return '2天前'
						}else if(difDay === 1){
							return '1天前'
						}else{
							return dateTimeStamp.split(' ')[0]
						}
					} else if (curMonth === oldMonth) {
						if (curDay - oldDay > 4) {
							return dateTimeStamp.split(' ')[0]
						} else if (curDay - oldDay === 4) {
							return '4天前'
						} else if (curDay - oldDay === 3) {
							return '3天前'
						} else if (curDay - oldDay === 2) {
							return '2天前'
						} else if (curDay - oldDay === 1) {
							return '1天前'
						} else if (curDay === oldDay) {
							return dateTimeStamp.split(' ')[1]
						}
					}
				}
			},
			// 特色科室跳转
			toDepartment(){
				this.$router.push({
					path: '/special',
					query: {
						hospitalId: this.hospitalId,
						type: 3,
						hisHospitalName: this.hisHospitalName,
						hisOrganizationId: this.hisOrganizationId
					}
				})
			},
		},
		mounted() {

		},
		created() {
			this.hospitalId = this.$route.query.hospitalId
			this.hisOrganizationId = this.$route.query.hisOrganizationId
			this.hisHospitalName = this.$route.query.hisHospitalName
			this.lng = this.$route.query.lan
			this.lat = this.$route.query.lat
			document.title = this.hisHospitalName
			this.getBannerList()
			this.getList()
		}
	}
</script>

<style scoped lang="less">
	.hospitalDetail {
		height: 100vh;
		float: left;
		overflow: auto;
		width: 100%;
		.box {
			padding: 15px;
			background-color: #fff;
			
			.banner {
				width: 92vw;
				height: 162px;
				border-radius: 5px;
			}
			
			.nav {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 30px;
				
				.item {
					width: 28vw;
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
		}
		
		.Box {
			padding: 0 15px;
			background-color: #fff;
			margin-top: 8px;
			
			.jkxj {
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-top: 10px;
				
				span:first-child {
					font-size: 18px;
					font-weight: bold;
					color: rgba(34, 34, 34, 1);
				}
				
				span:last-child {
					font-size: 12px;
					font-weight: 500;
					color: rgba(153, 153, 153, 1);
					display: flex;
					align-items: center;
					justify-content: flex-start;
					
					i {
						display: block;
						width: 10px;
						height: 10px;
						background-image: url("~@/assets/images/icon/icon_down.png");
						background-size: contain;
						background-position: center center;
						background-repeat: no-repeat;
						margin-left: 5px;
						transform: rotate(-90deg);
					}
				}
			}
			
			.list {
				font-size: 12px;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
				
				.noData {
					margin: 0 auto;
					width: 236.5px;
					height: 202.5px;
					padding-bottom: 20px;
					background-image: url("~@/assets/images/default/img_zwsj.png");
					background-size: contain;
					background-position: center center;
					background-repeat: no-repeat;
					position: relative;
					
					span {
						width: 100%;
						font-size: 13px;
						font-weight: 500;
						color: rgba(153, 153, 153, 1);
						position: absolute;
						bottom: 15px;
						text-align: center;
					}
				}
				
				.item {
					border-bottom: 1px solid #E8E8E8;
					display: flex;
					align-items: flex-start;
					justify-content: space-between;
					margin-top: 15px;
					padding-bottom: 25px;
					
					.l {
						width: 207px;
						height: 87px;
						display: flex;
						flex-direction: column;
						align-items: flex-start;
						justify-content: space-between;
						
						.title {
							width: 100%;
							font-size: 16px;
							font-weight: 500;
							color: rgba(34, 34, 34, 1);
							line-height: 1.2;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}
						
						.subtitle {
							width: 100%;
							font-size: 12px;
							font-weight: 500;
							color: rgba(153, 153, 153, 1);
							margin-top: 36px;
							display: flex;
							align-items: flex-start;
							justify-content: space-between;
							
							i {
								font-style: normal;
							}
						}
					}
					
					.r {
						width: 116px;
						height: 87px;
						overflow: hidden;
						border-radius: 5px;
						
						img {
							width: 100%;
							height: 100%;
						}
					}
				}
			}
		}
	}
</style>
