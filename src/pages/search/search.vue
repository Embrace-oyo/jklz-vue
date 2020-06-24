<template>
	<div class="SEARCH">
		<div class="box">
			<div class="search">
				<div class="inputBox">
					<i></i>
					<form action="javascript:return true;">
						<input v-model="keyword" type="search" placeholder="医院名字/医生" @keyup="searchClick" @change="searchClick">
					</form>
				</div>
				<span v-if="keyword.length === 0">搜索</span>
				<span v-if="keyword.length !== 0" @click="cancelSearch">取消</span>
			</div>
			<div class="nav">
				<div class="item" :class="{active: index === navIndex}" v-for="(item, index) of navList" :key="index"
				     @click="switchTab(item, index)">
					{{item.name}}
				</div>
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
						<ul v-if="navIndex === 0">
							<div class="item" v-for="(item, index) of list" :key="index" @click.stop="goDepartment(item)">
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
						</ul>
						<ul v-if="navIndex === 1">
							<div class="doctor" v-for="(item, index) of list" :key="index" @click.stop="guahao(item)">
								<div class="poster">
									<img :src="item.image" @error="$api.defaultDoctorImg" :onerror="$api.defaultDoctorImg">
								</div>
								<div class="detail">
									<span class="name">{{item.hisDoctorName}}</span>
									<span class="grade">擅长：{{item.goodAt}}</span>
									<span class="distance" @click.stop="navigation(item)"><i></i>{{item.hisHospitalName}}</span>
									<span class="addr"><span v-if="item.hisDepartmentName">{{item.hisDepartmentName}}</span><span
										v-if="item.position">{{item.position}}</span></span>
								</div>
								<div class="number"><i></i>有号</div>
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
		name: "search",
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
				keyword: '',
				navIndex: 0,
				navList: [
					{name: '医院', id: 0},
					{name: '医生', id: 1},
				],
				page: 1,
				limit: 10,
				total: 0,
				list: [],
				timer: null,
			}
		},
		methods: {
			// tab切换
			switchTab(item, index) {
				if (index === this.navIndex) return
				this.navIndex = index
				this.page = 1
				this.total = 0
				this.list = []
				this.getList()
			},
			// 距离转换
			distance(dis) {
				if (!dis) return '未知距离'
				return parseFloat(dis / 1000).toFixed(2) + 'km'
			},
			// 获取医生和医院列表
			getList(flag = false){
				if(!flag) this.$mask().show()
				let params = {
					lat: localStorage.lat ? localStorage.lat : '',
					lng: localStorage.lng ? localStorage.lng : '',
					queryKey: this.keyword,
					page: this.page,
					limit: this.limit,
					status: this.navIndex === 0 ? 2 : 1
				}
				this.$api.doctorAndHospitalInfo(params).then(res => {
					if(res.data.code === 0){
						let list = []
						if(this.navIndex === 0){
							if (res.data.doctorAndHospitalDTO.hospitalDTOPage.curPage === res.data.doctorAndHospitalDTO.hospitalDTOPage.totalPage && res.data.doctorAndHospitalDTO.hospitalDTOPage.curPage !== 1) {
								this.$refs.scroll.forceUpdate(true, false)
								return
							}
							list = res.data.doctorAndHospitalDTO.hospitalDTOPage.list
							this.total = res.data.doctorAndHospitalDTO.hospitalDTOPage.totalPage
						}else{
							if (res.data.doctorAndHospitalDTO.doctorDTOPage.currPage === res.data.doctorAndHospitalDTO.doctorDTOPage.totalPage && res.data.doctorAndHospitalDTO.doctorDTOPage.currPage !== 1) {
								this.$refs.scroll.forceUpdate(true, false)
								return
							}
							list = res.data.doctorAndHospitalDTO.doctorDTOPage.list
							this.total = res.data.doctorAndHospitalDTO.doctorDTOPage.totalPage
						}
						this.$mask().hide()
						if (this.page === 1) {
							this.list = list
							this.$nextTick(() => {
								this.$refs.scroll.forceUpdate(true, false)
								this.$refs.scroll.scrollTo(0, 0)
							})
						} else {
							this.list = this.list.concat(list)
							this.$refs.scroll.forceUpdate(true, false)
						}
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
				this.getList()
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
					that.getList()
				}, 500)
			},
			// 取消搜索
			cancelSearch(){
				this.keyword = ''
				this.getList()
			},
			// 跳转科室列表
			goDepartment(data){
				this.$router.push({
					path: `/department?hospitalId=${data.hospitalId}`
				})
			},
			// 跳转挂号
			guahao(data){
				this.$router.push({
					path: '/doctorDetail?doctorID=' + data.doctorID
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
		created() {
			document.title = '搜索'
			this.keyword = this.$route.query.keyword
			this.getList()
		}
	}
</script>

<style scoped lang="less">
	.SEARCH {
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
					width: 81.066vw;
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
						display: flex;
						height: 100%;
						input {
							height: 100%;
							width: 66.66vw;
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
						width: 18px;
						height: 2px;
						background-color: rgba(29, 144, 255, 1);
						position: absolute;
						left: 50%;
						margin-left: -9px;
						bottom: 0;
					}
				}
			}
			
			.scroll {
				width: 100%;
				height: calc(100vh - 93px);
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
						border-radius: 50%;
						display: flex;
						justify-content: center;
						align-items: center;
						overflow: hidden;
						img {
							width: 100%;
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
								overflow: hidden;
								text-overflow:ellipsis;
								white-space: nowrap;
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
