<template>
	<div class="DOCTOR">
		<div class="box">
			<div class="tabs">
				<div class="item" :class="{active: index === tabIndex}" v-for="(item,index) of tabs" :key="index"
				     @click="tabClick(index)">
					{{item.name}}
				</div>
			</div>
		</div>
		<div class="date" v-if="tabIndex === 0">
			<ul class="list-wrapper">
				<li v-for="(item, index) of dateList" :key="index" class="list-item" @click="dateClick(index)">
					<div class="item" :class="{active: index === dateIndex}">
						<!--<span class="bold">{{ item.year }}</span>-->
						<span>{{item.month}}-{{ item.day }}</span>
					</div>
				</li>
			</ul>
		</div>
		<div class="box margin">
			<div class="search">
				<i></i>
				<input type="text" v-model="keyword" placeholder="医生" @keydown="search">
			</div>
		</div>
		<div class="box">
			<div class="list" :class="{list2: tabIndex === 1}">
				<div class="noData" v-if="list.length === 0">
					<span>暂无数据~</span>
				</div>
				<cube-scroll
					ref="scroll"
					:data="list"
					:options="options2">
					<ul>
						<div class="doctor" v-for="(item, index) of list" :key="index" @click="goDetail(item)">
							<div class="poster">
								<img :src="item.image" @error="$api.defaultDoctorImg" :onerror="$api.defaultDoctorImg">
							</div>
							<div class="detail">
								<span class="name">
									{{item.hisDoctorName}}
										<span class="addr">
											<span v-if="item.position">{{item.position}}</span>
										</span>
								</span>
								<span class="grade">擅长：{{item.goodAt}}</span>
							</div>
							<div class="number"><i></i>{{item.registerLimitNum - item.registeredNum === 0 ? '无号' : '有号'}}</div>
						</div>
					</ul>
				</cube-scroll>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "doctor",
		computed: {
			options() {
				return {
					useTransition: false,
				}
			},
			options2() {
				return {
					useTransition: false,
				}
			},
		},
		data() {
			return {
				timer: null,
				hisOrganizationId: '',
				hisDepartmentId: '',
				hospitalId: '',
				tabIndex: 0,
				dateIndex: 0,
				keyword: '',
				tabs: [
					{name: '按日期挂号', index: 0},
					{name: '按医生挂号', index: 1},
				],
				dateList: [],
				allDoctorList: [],
				list: [],
			}
		},
		methods: {
			// tab切换
			tabClick(index) {
				if (index === this.tabIndex) return
				this.list = []
				this.tabIndex = index
				this.dateIndex = 0
				this.getList()
			},
			// 日期点击
			dateClick(index) {
				if (index === this.dateIndex) return
				this.list = []
				this.dateIndex = index
				this.getList()
			},
			// 跳转医生详情
			goDetail(data) {
				this.$router.push({
					path: '/doctorDetail',
					query: {
						doctorID: data.doctorID,
						hospitalId: this.hospitalId,
						hisOrganizationId: this.hisOrganizationId,
						tabIndex: this.tabIndex,
						date: `${this.dateList[this.dateIndex].year}-${this.dateList[this.dateIndex].month}-${this.dateList[this.dateIndex].day}`,
					}
				})
			},
			// 获取医生列表
			getList(flag = false) {
				if(!flag) this.$mask().show()
				let type = this.tabIndex === 0 ? 1 : 2;
				let params = {
					hisOrganizationId: this.hisOrganizationId,
					hisDepartmentId: this.hisDepartmentId,
					type: type,
					queryKey: this.keyword,
				}
				if(type === 1) params.date = `${this.dateList[this.dateIndex].year}-${this.dateList[this.dateIndex].month}-${this.dateList[this.dateIndex].day}`
				this.$api.schedule(params).then(res => {
					if (res.data.code === 0) {
						let data = res.data.scheduleList
						this.allDoctorList = []
						data.map(x => {
							let topArr = x.morningDoctorList === null ? [] : x.morningDoctorList
							let bottomArr = x.afternoonDoctorList === null ? [] : x.afternoonDoctorList
							let arr = [...topArr, ...bottomArr]
							this.allDoctorList.push(...arr)
						})
						this.list = this.allDoctorList
						this.$mask().hide()
					}
				})
			},
			// 搜索
			search() {
				clearTimeout(this.timer)
				this.timer = null
				this.timer = setTimeout(() => {
					this.getList()
				}, 300)
			},
			// 获取日期
			getDate(){
				this.$api.getDaysByHostpitalId({hospitalId: this.hospitalId}).then(res => {
					if(res.data.code === 0){
						let date = res.data.days
						let newDate = []
						date.map(x => {
							let year = x.split('-')[0]
							let month = x.split('-')[1]
							let day = x.split('-')[2]
							let obj = {
								year,
								month,
								day
							}
							newDate.push(obj)
						})
						this.dateList = newDate
						this.getList()
					}
				})
			}
		},
		created() {
			this.hisOrganizationId = this.$route.query.hisOrganizationId
			this.hisDepartmentId = this.$route.query.hisDepartmentId
			this.hospitalId = this.$route.query.hospitalId
			document.title = this.$route.query.hisDepartmentName
			this.getDate()
		}
	}
</script>

<style scoped lang="less">
	.DOCTOR {
		width: 100%;
		height: 100vh;
		float: left;
		
		.box {
			padding: 0 15px;
			background: rgba(255, 255, 255, 1);
			
			.tabs {
				width: 100%;
				height: 45px;
				display: flex;
				align-items: center;
				justify-content: space-around;

				.item {
					height: 100%;
					font-size: 14px;
					font-weight: 500;
					color: rgba(153, 153, 153, 1);
					display: flex;
					align-items: center;
					flex-direction: column;
					justify-content: center;
				}
				
				.active {
					font-weight: bold;
					color: rgba(29, 144, 255, 1);
					font-size: 16px;
					position: relative;
					
					&:after {
						content: '';
						width: 18px;
						height: 2px;
						background: rgba(29, 144, 255, 1);
						border-radius: 1px;
						position: absolute;
						bottom: 0;
						left: 50%;
						margin-left: -9px;
					}
				}
			}
			
			.search {
				width: 100%;
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
					width: 280px;
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
			
			.list {
				width: 100%;
				height: calc(100vh - 45px - 35px - 8px - 50px);
				
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
						display: flex;
						align-items: center;
						justify-content: center;
						overflow: hidden;
						border-radius: 50%;
						img {
							width:100%;
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
								margin-left: 11.5px;
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
					margin: 0 auto;
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
			
			.list2 {
				height: calc(100vh - 45px - 35px - 8px);
			}
		}
		
		.margin {
			padding: 4px 15px;
		}
	}
</style>
<style lang="less">
	.date {
		width: 100%;
		height: 50px;
		background: rgba(233, 235, 242, 1);
		overflow: auto;
		.list-wrapper {
			width: 100%;
			height: 100%;
			white-space: nowrap;
			.list-item {
				margin: 0 15px;
				display: inline-block;
				height: 100%;
				.item {
					height: 100%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					font-size: 12px;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
					
					.bold {
						font-size: 14px;
						font-weight: 500;
						color: rgba(34, 34, 34, 1);
						margin-bottom: 6px;
					}
				}
				
				.active {
					color: rgba(29, 144, 255, 1);
					
					.bold {
						color: rgba(29, 144, 255, 1);
					}
				}
			}
		}
	}
</style>
