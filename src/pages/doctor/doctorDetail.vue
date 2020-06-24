<template>
	<div class="doctorDetail">
		<div class="box">
			<div class="row">
				<div class="line">
					<div class="img"><img :src="data.image" alt="" @error="$api.defaultDoctorImg"
					                      :onerror="$api.defaultDoctorImg"></div>
					<div class="info">
						<span class="name">{{data.hisDoctorName}}<i v-if="data.position">{{data.position}}</i></span>
						<span class="Name">{{data.hisHospitalName}}</span>
						<span class="naMe">{{data.hisDepartmentName}}</span>
					</div>
				</div>
				<div class="introduction">
					<span class="title">个人简介</span>
					<span class="content" :class="{show: openIntroduction}">{{data.introduction}}</span>
					<i v-show="lenOne > 21" class="arrow" :class="{arrowUp: openIntroduction}"
					   @click="openIntroduction = !openIntroduction"></i>
				</div>
			</div>
			<div class="row" style="margin-top: 8px">
				<div class="professional">
					<span class="title">擅长专业</span>
					<span class="content" :class="{show: openProfessional}">{{data.goodAt}}</span>
					<i v-show="lenTwo > 21" class="arrow" :class="{arrowUp: openProfessional}"
					   @click="openProfessional = !openProfessional"></i>
				</div>
			</div>
		</div>
		<div class="Box">
			<div class="tabs">
				<div class="item" :class="{active: tabIndex === index}" v-for="(item,index) of tabs" :key="index"
				     @click="tabClick(index)">
					{{item.name}}
				</div>
			</div>
			<div class="list">
				<div class="noData" v-if="list.length === 0">
					<span>暂无数据~</span>
				</div>
				<div class="item" v-for="(item, index) of list" :key="index">
					<div class="l">
						<div class="t">
							<span class="month">{{item.scheduleDate}}</span>
							<span class="day">{{item.scheduleShift}}</span>
							<span class="hour"></span>
						</div>
						<div class="b">
							<span><i>{{item.totalFree/100}}</i>元（剩余：{{(item.registerLimitNum - item.registeredNum > 1000) ? '不限号' : (item.registerLimitNum - item.registeredNum)}}）</span>
						</div>
					</div>
					<div class="r">
						<div class="btn" @click="register(item)"
						     :class="{full: item.registerLimitNum - item.registeredNum === 0}">{{item.registerLimitNum -
							item.registeredNum === 0 ? '已满' : '挂号'}}
						</div>
					</div>
				</div>
<!--				<cube-scroll
					ref="scroll"
					:data="list"
					:options="options">
					
				</cube-scroll>-->
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "doctorDetail",
		computed: {
			options() {
				return {
					useTransition: false,
				}
			},
		},
		data() {
			return {
				openIntroduction: false,
				openProfessional: false,
				lenOne: 0,
				lenTwo: 0,
				doctorID: '',
				hospitalId: '',
				hisOrganizationId: '',
				data: '',
				tabs: [
					{name: '预约挂号', index: 0},
					{name: '全部号源', index: 1},
				],
				tabIndex: 0,
				list: [],
				allList: [],
				onlyList: [],
			}
		},
		methods: {
			// 获取医生详情
			getDetail() {
				this.$mask().show()
				let params = {
					doctorID: this.doctorID,
				}
				this.$api.doctorDetail(params).then(res => {
					if (res.data.code === 0) {
						this.data = res.data.doctorDTO
						this.lenOne = res.data.doctorDTO.introduction ? res.data.doctorDTO.introduction.length : 0
						this.lenTwo = res.data.doctorDTO.goodAt ? res.data.doctorDTO.goodAt.length : 0
						this.getSchedule()
					}
				})
			},
			// 获取医生排班信息
			getSchedule() {
				let params = {
					doctorID: this.doctorID,
				}
				if(parseInt(this.$route.query.tabIndex) === 0) params.date =  this.$route.query.date
				this.$api.doctorSchedule(params).then(res => {
					if (res.data.code === 0) {
						let data = res.data.OneDoctorScheduleDTO
						data.map(x => {
							if (x.morningDoctorList !== null && x.morningDoctorList.length !== 0) this.allList.push(...x.morningDoctorList)
							if (x.afternoonDoctorList !== null && x.afternoonDoctorList.length !== 0) this.allList.push(...x.afternoonDoctorList)
						})
						this.allList.map(x => {
							if ((x.registerLimitNum - x.registeredNum) !== 0) {
								this.onlyList.push(x)
							}
						})
						this.list = this.onlyList
						this.$mask().hide()
					}
				})
			},
			// tab点击
			tabClick(index) {
				if (index === this.tabIndex) return
				this.tabIndex = index
				this.list = (this.tabIndex === 0 ? this.onlyList : this.allList)
			},
			// 挂号按钮
			register(data) {
				if (data.registerLimitNum - data.registeredNum === 0) return
				this.$router.push({
					path: '/makeAnAppointment',
					query: {
						hisHospitalName: this.data.hisHospitalName,
						hisDepartmentName: this.data.hisDepartmentName,
						hospitalId: this.hospitalId,
						hisDoctorName: this.data.hisDoctorName,
						scheduleDate: data.scheduleDate,
						scheduleShift: data.scheduleShift,
						totalFree: data.totalFree,
						doctorID: this.doctorID,
						hisDepartmentId: this.data.hisDepartmentId,
						location: data.location,
						hisOrganizationId: this.hisOrganizationId,
						regId: data.regId,
						czjlid: data.czjlid,
						hbtime: data.hbtime,
					}
				})
			},
		},
		created() {
			document.title = '医生详情'
			this.doctorID = this.$route.query.doctorID
			this.hospitalId = this.$route.query.hospitalId
			this.hisOrganizationId = this.$route.query.hisOrganizationId
			this.getDetail()
		}
	}
</script>

<style scoped lang="less">
	.doctorDetail {
		width: 100%;
		height: 100vh;
		overflow: auto;
		.box {
			padding: 8px 15px;
			
			.row {
				padding: 8px 15px;
				background-color: #fff;
				border-radius: 10px;
				
				.line {
					width: 100%;
					padding-bottom: 15px;
					border-bottom: 1px solid #E8E8E8;
					display: flex;
					align-items: center;
					justify-content: flex-start;
					
					.img {
						width: 70px;
						height: 70px;
						border-radius: 50%;
						margin-right: 15.5px;
						display: flex;
						align-items: center;
						justify-content: center;
						overflow: hidden;
						
						img {
							width: 100%;
						}
					}
					
					.info {
						display: flex;
						flex-direction: column;
						font-size: 12px;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
						font-weight: 500;
						
						.name {
							font-size: 16px;
							font-weight: 500;
							color: rgba(34, 34, 34, 1);
							margin-bottom: 7px;
							display: flex;
							align-items: center;
							
							i {
								padding: 5px 9px;
								background: rgba(242, 242, 242, 1);
								border-radius: 2px;
								font-style: normal;
								font-size: 11px;
								font-weight: 500;
								color: rgba(153, 153, 153, 1);
								margin-left: 11.5px;
							}
						}
						
						.Name {
							font-size: 12px;
							margin-bottom: 10px;
						}
						
						.naMe {
						}
					}
					
				}
				
				.introduction {
					width: 100%;
					
					.title {
						display: inline-block;
						margin-top: 13px;
						margin-bottom: 9.5px;
						font-size: 15px;
						font-weight: 500;
						color: rgba(34, 34, 34, 1);
						background-image: linear-gradient(90deg, #BDE5FF, #fff);
						padding: 4px;
					}
					
					.content {
						display: inline-block;
						font-size: 15px;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
						line-height: 1.2;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					
					.show {
						overflow: initial;
						text-overflow: ellipsis;
						white-space: normal;
					}
					
					.arrow {
						display: block;
						width: 20px;
						height: 20px;
						background-image: url("~@/assets/images/icon/icon_down.png");
						background-size: 10px 5.5px;
						background-position: center center;
						background-repeat: no-repeat;
						margin: 0 auto;
					}
					
					.arrowUp {
						background-image: url("~@/assets/images/icon/icon_up.png");
					}
				}
				
				.professional {
					width: 100%;
					
					.title {
						display: inline-block;
						margin-top: 13px;
						margin-bottom: 9.5px;
						font-size: 15px;
						font-weight: 500;
						color: rgba(34, 34, 34, 1);
						background-image: linear-gradient(90deg, #BDE5FF, #fff);
						padding: 4px;
					}
					
					.content {
						display: inline-block;
						font-size: 15px;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
						line-height: 1.2;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					
					.show {
						overflow: initial;
						text-overflow: ellipsis;
						white-space: normal;
					}
					
					.arrow {
						display: block;
						width: 20px;
						height: 20px;
						background-image: url("~@/assets/images/icon/icon_down.png");
						background-size: 10px 5.5px;
						background-position: center center;
						background-repeat: no-repeat;
						margin: 0 auto;
					}
					
					.arrowUp {
						background-image: url("~@/assets/images/icon/icon_up.png");
					}
				}
			}
		}
		
		.Box {
			padding: 0 15px;
			background: #fff;
			
			.tabs {
				width: 100%;
				height: 45px;
				display: flex;
				align-items: center;
				justify-content: space-evenly;
				
				.item {
					height: 100%;
					font-size: 14px;
					font-weight: 500;
					color: rgba(153, 153, 153, 1);
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
				}
				
				.active {
					color: rgba(29, 144, 255, 1);
					font-size: 16px;
					font-weight: bold;
					position: relative;
					
					&:after {
						content: '';
						display: block;
						width: 18px;
						height: 2px;
						background: rgba(29, 144, 255, 1);
						border-radius: 1px;
						position: absolute;
						left: 50%;
						margin-left: -9px;
						bottom: 0;
					}
				}
			}
			
			.list {
				width: 100%;
				/*height: calc(100vh - 328px);*/
				
				.noData {
					margin: 40px auto;
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
				
				.item {
					width: 100%;
					height: 71px;
					border-bottom: 1px solid rgba(232, 232, 232, 1);
					display: flex;
					align-items: center;
					justify-content: space-between;
					
					.l {
						font-size: 14px;
						font-weight: 500;
						color: rgba(34, 34, 34, 1);
						
						.t {
							margin-bottom: 15px;
							
							.month {
								margin-right: 10px;
							}
							
							.day {
								margin-right: 10px;
							}
							
							.hour {
								font-weight: 500;
								color: rgba(153, 153, 153, 1);
							}
						}
						
						.b {
							span {
								color: #999999;
								
								i {
									font-style: normal;
									font-weight: bold;
									font-size: 16px;
									color: #FF660C;
								}
							}
						}
					}
					
					.r {
						float: right;
						
						.btn {
							width: 67px;
							height: 31px;
							background: rgba(29, 144, 255, 1);
							border-radius: 4px;
							font-size: 15px;
							color: rgba(255, 255, 255, 1);
							display: flex;
							align-items: center;
							justify-content: center;
						}
						
						.full {
							background: rgba(204, 204, 204, 1);
							color: #fff;
						}
					}
				}
			}
		}
	}
</style>
