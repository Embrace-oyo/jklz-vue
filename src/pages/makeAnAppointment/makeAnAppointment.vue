<template>
	<div class="makeAnAppointment">
		<div class="box">
			<div class="item">
				<span class="title">就诊医院</span>
				<span class="cont">{{query.hisHospitalName}}</span>
			</div>
			<div class="item">
				<span class="title">就诊科室</span>
				<span class="cont">{{query.hisDepartmentName}}</span>
			</div>
			<div class="item">
				<span class="title">医生</span>
				<span class="cont">{{query.hisDoctorName}}</span>
			</div>
			<div class="item">
				<span class="title">就诊地点</span>
				<span class="cont">{{query.location}}</span>
			</div>
			<div class="item">
				<span class="title">日期</span>
				<span class="cont">{{query.scheduleDate}}</span>
			</div>
			<div class="item">
				<span class="title">时段</span>
				<span class="cont">{{query.scheduleShift}}</span>
			</div>
			<div class="item">
				<span class="title">预约费用</span>
				<span class="cont color">{{query.totalFree/100}}元</span>
			</div>
			<div class="item" @click="pickerClick">
				<span class="title">选择就诊人</span>
				<span class="cont"><span>{{name}}</span><i></i></span>
			</div>
		</div>
		<div class="Box">
			<div class="agreement" @click.stop="isCheck = !isCheck">
				<span class="icon" :class="{checked: isCheck}"></span>
				<span class="word">我已阅读<i class="blue" @click.stop="isRead = !isRead">《预约挂号须知》</i></span>
			</div>
			<div class="sure" @click="post">确定</div>
		</div>
		<div class="model" v-if="isRead">
			<div class="a-1">
				<div class="a-1-1">
					{{title}}
				</div>
				<div class="a-1-2" v-html="agreement">
				
				</div>
				<div class="a-1-3" @click="isRead = false">
					<span>确认</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "makeAnAppointment",
		data() {
			return {
				isCheck: false,
				isRead: false,
				agreement: '',
				title: '',
				query: '',
				name: '',
				peopleIndex: 0,
				peopleList: [],
				list: [],
				pickerData: [],
				curSelect: '',
				isPost: false,
			}
		},
		methods: {
			// 获取协议
			getAgreement() {
				this.$api.getHelpDetail({dataKey: 'key_reg_kno'}).then(res => {
					if (res.data.code === 0) {
						if (!res.data.data) return
						let data = res.data.data
						this.agreement = data.content
						this.title = data.title
					}
				})
			},
			// 获取就诊人
			getPeople() {
				this.$mask().show()
				this.$api.healthCardList().then(res => {
					if (res.data.code === 0) {
						let list = res.data.page.list
						this.peopleList = list
						let arr = []
						list.map((x, index) => {
							let obj = {text: x.name, value: index}
							arr.push(obj)
						})
						this.pickerData = [...arr]
						this.name = this.peopleList.length !== 0 ? this.peopleList[this.peopleIndex].name : '添加就诊人'
						this.curSelect = this.peopleList[this.peopleIndex]
						this.$mask().hide()
					}
				})
			},
			// 选择器
			pickerClick() {
				if (this.peopleList.length === 0) {
					this.$router.push({
						path: '/healthCard'
					})
					return
				}
				this.picker = this.$createPicker({
					title: '选择就诊人',
					data: [this.pickerData],
					selectedIndex: [this.peopleIndex],
					onSelect: this.selectHandle,
					onCancel: this.cancelHandle
				})
				this.picker.show()
			},
			selectHandle(selectedVal, selectedIndex, selectedText) {
				this.peopleIndex = selectedVal[0]
				this.name = this.peopleList[this.peopleIndex].name
				this.curSelect = this.peopleList[this.peopleIndex]
			},
			// 生成就诊卡
			generateVisitCard() {
				this.$mask().show()
				let params = {
					id: this.curSelect.id,
					hospitalId: this.query.hospitalId,
				}
				this.$api.generateVisitCard(params).then(res => {
					if (res.data.code === 0) {
						this.postInfo()
					}
				})
			},
			// 提交挂号信息
			postInfo() {
				let params = {
					departmentName: this.query.hisDepartmentName,
					doctorId: this.query.doctorID,
					fee: Number(this.query.totalFree),
					hisDepartmentId: this.query.hisDepartmentId,
					hospitalId: this.query.hospitalId,
					location: this.query.location,
					patientId: this.curSelect.patientId,
					scheduleDate: this.query.scheduleDate,
					scheduleShift: this.query.scheduleShift,
					status: 1,
					regId: this.query.regId,
					healthCardId: this.curSelect.healthCardId,
					czjlid: this.query.czjlid,
					hbtime: this.query.hbtime,
				}
				let that = this
				this.$api.registerNewOrder(params).then(res => {
					if (res.data.code === 0) {
						this.$api.payFuc({
							appId: res.data.order.appId,
							timeStamp: res.data.order.timeStamp,
							nonceStr: res.data.order.nonceStr,
							Package: res.data.order.packageValue,
							signType: res.data.order.signType,
							paySign: res.data.order.paySign,
							callBack(e) {
								that.$mask().hide()
								let val = ''
								if (e.err_msg == "get_brand_wcpay_request:ok") {
									val = '您已经预约成功\n请确认就诊时间及时就诊'
								} else if (e.err_msg == 'get_brand_wcpay_request:cancel') {
									val = '您已经取消支付'
								} else if (e.err_msg == 'get_brand_wcpay_request:fail') {
									val = '支付失败'
								}
								that.$createDialog({
									type: 'alert',
									icon: 'cubeic-alert',
									title: '提示',
									content: val,
									confirmBtn: {
										text: '知道了',
										active: true,
										disabled: false,
										href: 'javascript:;'
									},
									onConfirm: () => {
										that.$router.push({
											path: `/makeAnAppointmentRecord?hospitalId=${that.query.hospitalId}&hisOrganizationId=${that.query.hisOrganizationId}`
										})
									},
								}).show()
							}
						})
					} else if (res.data.code === 101) {
						that.$mask().hide()
						that.$router.push({
							path: `/makeAnAppointmentRecord?hospitalId=${that.query.hospitalId}&hisOrganizationId=${that.query.hisOrganizationId}`
						})
					}
				})
			},
			// 生成挂号订单
			post() {
				if (!this.isCheck) {
					this.$toast('请勾选预约挂号协议')
					return
				}
				if (this.peopleList.length === 0) {
					this.$toast('请添加健康卡')
					return
				}
				if (this.isPost) {
					this.generateVisitCard()
				} else {
					this.$createDialog({
						type: 'alert',
						icon: 'cubeic-alert',
						title: '注意事项',
						content: `只能预约当天号源信息，挂号成功后暂不支持退号退款，请仔细确认后再进行操作`,
						confirmBtn: {
							text: '知道了',
							active: true,
							disabled: false,
							href: 'javascript:;'
						},
						onConfirm: () => {
							this.checkIsHaveAppointment()
						},
					}).show()
				}
			},
			// 判断今天挂号次数
			checkIsHaveAppointment() {
				let params = {
					doctorId: this.query.doctorID,
					healthCardId: this.curSelect.healthCardId,
					hosptailID: this.query.hospitalId
				}
				this.$api.checkIsHaveAppointment(params).then(res => {
					if (res.data.code === 0) {
						if(res.data.num >= 1){
							this.$createDialog({
								type: 'confirm',
								icon: 'cubeic-alert',
								title: '注意事项',
								content: `您已成功预约${this.query.hisDoctorName}医生，确认继续预约吗？`,
								confirmBtn: {
									text: '知道了',
									active: true,
									disabled: false,
									href: 'javascript:;'
								},
								cancelBtn: {
									text: '取消',
									active: false,
									disabled: false,
									href: 'javascript:;'
								},
								onConfirm: () => {
									this.isPost = true
								},
								onCancel:() => {
									this.isPost = false
								}
							}).show()
						}else if(res.data.num === 0){
							this.isPost = true
						}
					}
				})
			}
		},
		created() {
			document.title = '预约挂号'
			this.query = this.$route.query
			this.getPeople()
			this.getAgreement()
		}
	}
</script>

<style scoped lang="less">
	.makeAnAppointment {
		width: 100%;
		height: 100vh;
		
		.box {
			padding: 0 15px;
			background: #fff;
			
			.item {
				width: 100%;
				height: 50px;
				border-bottom: 1px solid rgba(237, 237, 237, 1);
				display: flex;
				align-items: center;
				justify-content: flex-start;
				
				.title {
					width: 85px;
					font-size: 16px;
					font-weight: 500;
					color: rgba(34, 34, 34, 1);
					margin-right: 17px;
				}
				
				.cont {
					width: 200px;
					font-size: 14px;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
					display: flex;
					align-items: center;
					
					i {
						display: block;
						width: 20px;
						height: 20px;
						background-image: url("~@/assets/images/icon/icon_down.png");
						background-size: 10px 5.5px;
						background-repeat: no-repeat;
						background-position: center center;
						transform: rotate(-90deg);
						right: 15px;
						position: absolute;
					}
				}
				
				.color {
					color: rgba(255, 102, 12, 1);
				}
			}
		}
		
		.Box {
			padding: 0 15px;
			
			.agreement {
				margin-top: 10.5px;
				font-size: 14px;
				font-weight: 500;
				color: rgba(34, 34, 34, 1);
				display: flex;
				align-items: center;
				justify-content: flex-start;
				
				.icon {
					width: 19px;
					height: 19px;
					border: 1px solid #ccc;
					margin-right: 8.5px;
					border-radius: 50%;
				}
				
				.checked {
					background-image: url("~@/assets/images/icon/icon_gou.png");
					background-size: cover;
					background-repeat: no-repeat;
					background-position: center center;
				}
			}
			
			.sure {
				margin: 73px auto;
				width: 300px;
				height: 44px;
				background: rgba(29, 144, 255, 1);
				border-radius: 5px;
				font-size: 17px;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
		
		.model {
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			z-index: 10000;
			background-color: rgba(0, 0, 0, 0.3);
			
			.a-1 {
				width: 280px;
				height: 385px;
				background: rgba(255, 255, 255, 1);
				border-radius: 10px;
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
				line-height: 20px;
				
				.a-1-1 {
					text-align: center;
					height: 45px;
					line-height: 45px;
					font-size: 15px;
					font-weight: bold;
					color: rgba(34, 34, 34, 1);
				}
				
				.a-1-2 {
					height: 285px;
					padding: 0 20px;
					overflow: scroll;
					font-size: 12px;
				}
				
				.a-1-3 {
					height: 56px;
					display: flex;
					justify-content: center;
					align-items: center;
					
					span {
						display: inline-block;
						width: 240px;
						height: 40px;
						background: rgba(52, 196, 218, 1);
						border-radius: 4px;
						text-align: center;
						line-height: 40px;
						font-size: 15px;
						color: rgba(255, 255, 255, 1);
					}
				}
			}
		}
		
		.color {
			color: rgba(255, 102, 12, 1);
		}
		
		.gray {
			color: rgba(204, 204, 204, 1);
		}
		
		.blue {
			font-style: normal;
			color: #1D90FF;
		}
	}
</style>
