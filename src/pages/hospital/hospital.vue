<template>
	<div class="hospital">
		<div class="box">
			<div class="search">
				<div class="inputBox">
					<i></i>
					<form action="javascript:return true;">
						<input v-model="keyword" type="search" placeholder="医院名字" @keyup="searchClick" @change="searchClick">
					</form>
				</div>
				<span @click="searchClick">搜索</span>
			</div>
		</div>
		<div class="box border">
			<div class="scroll">
				<div class="noData" v-if="list.length === 0">
					<span>暂无数据~</span>
				</div>
				<div class="scroll-list-wrap">
					<cube-scroll
						ref="scroll"
						:data="list"
						@pulling-up="onPullingUp"
						:options="options">
						<ul>
							<div class="item" v-for="(item, index) of list" :key="index" @click="goDepartment(item)">
								<div class="poster">
									<img :src="item.logo" @error="$api.defaultHospitalImg" :onerror="$api.defaultHospitalImg">
								</div>
								<div class="detail">
									<span class="name">{{item.hisHospitalName}}</span>
									<span class="grade">{{item.grade}}</span>
									<span class="distance"><i></i>{{distance(item.distance)}}</span>
									<span class="addr">{{item.hisHospitaladdr}}</span>
								</div>
							</div>
						</ul>
					</cube-scroll>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "hospital",
		computed: {
			options() {
				return {
					useTransition: false,
					pullUpLoad: {
						threshold: 60,
					},
				}
			},
		},
		data() {
			return {
				//  0: 预约挂号  1：门诊缴费  2：候诊查询
				type: '',
				keyword: '',
				page: 1,
				limit: 10,
				total: 0,
				list: [],
				timer: null,
			}
		},
		methods: {
			// 距离转换
			distance(dis) {
				if (!dis) return '未知距离'
				return parseFloat(dis / 1000).toFixed(2) + 'km'
			},
			// 医院列表
			getHospital(flag = false) {
				if(!flag) this.$mask().show()
				let params = {
					lat: localStorage.lat ? localStorage.lat : '',
					lng: localStorage.lng ? localStorage.lng : '',
					queryKey: this.keyword,
					page: this.page,
					limit: this.limit,
					hospitalGrade: '',
					hospitalType: '',
					label: ''
				}
				this.$api.hospitalSearch(params).then(res => {
					if(res.data.code === 0){
						if (res.data.Page.curPage === res.data.Page.totalPage && res.data.Page.curPage !== 1) {
							this.$refs.scroll.forceUpdate(true, false)
							return
						}
						let list = res.data.Page.list
						this.total = res.data.Page.totalPage
						if (this.page === 1) {
							this.list = list
							this.$refs.scroll.forceUpdate()
							this.$refs.scroll.scrollTo(0, 0)
						} else {
							this.list = this.list.concat(list)
							this.$refs.scroll.forceUpdate()
						}
/*						let l = this.list
						l.sort((a, b) => {
							if(a.distance !== null && b.distance !== null){
								return a.distance - b.distance
							}
						})
						this.list = l*/
						this.$mask().hide()
					}
				})
				
			},
			// 上拉加载
			onPullingUp() {
				let page = this.page + 1
				if (page > this.total) {
					this.$refs.scroll.forceUpdate()
					return
				}
				this.page++
				this.getHospital(true)
			},
			// 搜索点击
			searchClick() {
				let that = this
				clearTimeout(this.timer)
				this.timer = null
				this.timer = setTimeout(() => {
					that.page = 1
					that.total = 0
					that.list = []
					this.getHospital()
				}, 500)
			},
			// 医院点击跳转
			goDepartment(data){
				switch (this.type) {
					case 0:
						this.$router.push({
							path: `/department?hospitalId=${data.hospitalId}&hisOrganizationId=${data.hisOrganizationId}&type=1`
						})
						break
					case 1:
						this.$router.push({
							path: `/pay?hospitalId=${data.hospitalId}&hisOrganizationId=${data.hisOrganizationId}`
						})
						break
					case 2:
						this.$router.push({
							path: `/department?hospitalId=${data.hospitalId}&hisOrganizationId=${data.hisOrganizationId}&type=2`
						})
						break
					case 3:
						this.$router.push({
							path: `/report?hospitalId=${data.hospitalId}&hisOrganizationId=${data.hisOrganizationId}`
						})
						break
					case 4:
						this.$router.push({
							path: `/hospitalPay`,
							query: data
						})
						break
					case 5:
						this.$router.push({
							path: `/makeAnAppointmentRecord?hospitalId=${data.hospitalId}&hisOrganizationId=${data.hisOrganizationId}`
						})
						break
					case 6:
						this.$router.push({
							path: `/record?hospitalId=${data.hospitalId}&hisOrganizationId=${data.hisOrganizationId}`
						})
						break
					default:
						this.$router.push({
							path: '/hospitalDetail',
							query: {
								hospitalId: data.hospitalId,
								hisOrganizationId: data.hisOrganizationId,
								lan: data.lng,
								lat: data.lat,
								hisHospitalName: data.hisHospitalName
							}
						})
						break
				}
			}
		},
		created() {
			document.title = '选择医院'
			this.keyword = this.$route.query.keyword
			this.type = parseInt(this.$route.query.type)
			this.getHospital()
		}
	}
</script>

<style scoped lang="less">
	.hospital {
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
				margin: 8px 0;
				font-size: 16px;
				color: #222222;
				
				.inputBox {
					width: 81.06vw;
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
					form{
						height: 100%;
						display: flex;
						input {
							width: 66.6vw;
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
			
			.nav {
				margin-top: 5px;
				width: 100%;
				height: 45px;
				background: rgba(255, 255, 255, 1);
				display: flex;
				align-items: center;
				justify-content: space-around;
				font-size: 14px;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
				
				.item {
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					position: relative;
				}
				
				.active {
					color: rgba(29, 144, 255, 1);
					font-size: 16px;
					
					&:after {
						content: '';
						display: block;
						width: 17px;
						height: 2px;
						background-color: rgba(29, 144, 255, 1);
						position: absolute;
						bottom: 0;
					}
				}
			}
			
			.scroll {
				width: 100%;
				height: calc(100vh - 51px);
				overflow: hidden;
				
				.scroll-list-wrap {
					width: 100%;
					height: 100%;
				}
				
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
						display: flex;
						align-items: center;
						justify-content: center;
						overflow: hidden;
						img {
							width: 100%;
							height: auto;
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
				
				.doctor {
					width: 100%;
					margin-top: 15px;
					border-bottom: 1px solid rgba(232, 232, 232, 1);
					display: flex;
					justify-content: flex-start;
					align-items: center;
					padding-bottom: 15px;
					position: relative;
					
					.poster {
						width: 92px;
						height: 92px;
						border-radius: 5px;
						
						img {
							width: 92px;
							height: 92px;
							border-radius: 5px;
						}
					}
					
					.detail {
						width: 221px;
						color: #222222;
						font-size: 16px;
						margin-left: 21.5px;
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
							font-size: 12px;
							font-weight: 500;
							color: #666666;
							line-height: 20px;
							margin-bottom: 11px;
						}
						
						.distance {
							font-size: 12px;
							font-weight: 500;
							color: #999999;
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
							margin-top: 10px;
							
							span {
								width: 60px;
								height: 20px;
								background: rgba(242, 242, 242, 1);
								border-radius: 2px;
								color: #999999;
								padding: 5px 13px;
								margin-right: 10px;
							}
						}
					}
					
					.number {
						position: absolute;
						width: 50px;
						height: 20px;
						border: 1px solid rgba(131, 195, 255, 1);
						border-radius: 10px;
						right: 0;
						top: 0;
						font-size: 12px;
						font-weight: 500;
						color: rgba(29, 144, 255, 1);
						display: flex;
						align-items: center;
						justify-content: center;
						
						i {
							width: 4px;
							height: 4px;
							background: rgba(9, 226, 81, 1);
							border-radius: 50%;
							margin-right: 4px;
						}
					}
					
					.noNumber {
						border: 1px solid rgba(204, 204, 204, 1);
						color: #ccc;
						i {
							background: rgba(153, 153, 153, 1);
						}
					}
				}
				
				.noData {
					margin: 101px auto;
					width: 236.5px;
					height: 202.5px;
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
						bottom: 0;
						text-align: center;
					}
				}
			}
		}
		
		.border {
			border-top: 8px solid #f7f7f7;
		}
	}
</style>
