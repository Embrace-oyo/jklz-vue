<template>
	<div class="pay">
		<div class="box">
			<div class="info">
				<div class="id">{{idCard}}</div>
				<div class="people" @click="pickerClick">
					<span>当前就诊人：</span>
					<span>{{name}}</span>
					<span>选择<i></i></span>
				</div>
			</div>
			<div class="tabs">
				<div class="item" :class="{active: item.id === tabIndex}" v-for="item of tabs" :key="item.id"
				     @click="tabClick(item)">{{item.name}}
				</div>
			</div>
		</div>
		<div class="list">
			<div class="noData" v-if="list.length === 0">
				<span>暂无数据~</span>
			</div>
			<cube-scroll
				ref="scroll"
				:data="list"
				@pulling-up="onPullingUp"
				:options="options">
				<div class="item" v-for="(item, index) of list" :key="index" @click.stop="goToDetail(item)">
					<div class="top">
						<div class="l">
							<span class="title">{{item.orderName}}</span>
							<span>医院：{{item.hospitalName}}</span>
							<span>科室：{{item.departName}}</span>
							<span>医生：{{item.doctorName}}</span>
						<!--	<span>订单号：{{item.orderSn}}</span>-->
							<span>合计：<i class="yellow">{{item.totalPrice/100}}</i>元</span>
						</div>
						<div class="r">
							<span class="status" :class="{blue: item.status === 2}">{{item.statusName}}</span>
							<span>{{item.createTime.split(' ')[0]}}</span>
						</div>
					</div>
					<div class="bottom">
						<div class="btnBlue" v-if="item.status === 1" @click.stop="pay(item)">去缴费</div>
					</div>
				</div>
			</cube-scroll>
		</div>
	</div>

</template>

<script>
	export default {
		name: "pay",
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
				tabIndex: 0,
				tabs: [
					{name: '缴费', id: 0},
					{name: '缴费历史', id: 1},
				],
				name: '',
				idCard: '',
				peopleIndex: 0,
				peopleList: [],
				list: [],
				pickerData: [],
				curSelect: '',
				page: 1,
				limit: 10,
				total: 0
			}
		},
		methods: {
			// tab点击
			tabClick(data) {
				if (data.id === this.tabIndex) return
				this.tabIndex = data.id
				this.list = []
				this.page = 1
				this.total = 0
				if (this.peopleList.length !== 0) {
					this.getOrderList()
				}
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
				this.idCard = this.peopleList[this.peopleIndex].healthCardId.replace(/(.{6}).*(.{5})/, "$1*********$2")
				this.curSelect = this.peopleList[this.peopleIndex]
				this.list = []
				this.page = 1
				this.total = 0
				this.getOrderList()
			},
			// 获取就诊人
			getPeople() {
				this.$api.healthCardList().then(res => {
					let list = res.data.page.list
					this.peopleList = list
					let arr = []
					list.map((x, index) => {
						let obj = {text: x.name, value: index}
						arr.push(obj)
					})
					this.pickerData = [...arr]
					this.name = this.peopleList.length !== 0 ? this.peopleList[this.peopleIndex].name : '添加就诊人'
					this.idCard = this.peopleList.length !== 0 ? this.peopleList[this.peopleIndex].healthCardId.replace(/(.{6}).*(.{5})/, "$1*********$2") : '请先添加就诊人'
					this.curSelect = this.peopleList[this.peopleIndex]
					if (this.peopleList.length !== 0) {
						this.getOrderList()
					}
				})
			},
			// 获取订单列表
			getOrderList(flag = false) {
				if (!flag) this.$mask().show()
				let params = {
					patientId: this.curSelect.patientId,
					hospitalId: this.$route.query.hospitalId,
					payStatus: this.tabIndex,
					page: this.page,
					limit: this.limit,
					healthCardId: this.curSelect.healthCardId
				}
				this.$api.orderList(params).then(res => {
					if (res.data.code === 0) {
						this.total = res.data.Page.totalPage
						this.list = this.list.concat(res.data.Page.list)
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
				this.getOrderList(true)
			},
			// 支付
			pay(data) {
				this.$mask().show()
				let params = {
					id: data.id,
				}
				let that = this
				this.$api.orderListPay(params).then(res => {
					if (res.data.code === 0) {
						this.$api.payFuc({
							appId: res.data.order.appId,
							timeStamp: res.data.order.timeStamp,
							nonceStr: res.data.order.nonceStr,
							Package: res.data.order.packageValue,
							signType: res.data.order.signType,
							paySign: res.data.order.paySign ,
							callBack(e){
								that.$mask().hide()
								let val = ''
								if (e.err_msg == "get_brand_wcpay_request:ok") {
									val = '您已支付成功'
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
										that.list = []
										that.page = 1
										that.total = 0
										that.getOrderList()
									},
								}).show()
							}
						})
					}
				})
			},
			// 跳转详情
			goToDetail(data){
				this.$router.push({
					path: `/payDetail?orderId=${data.id}&registrationId=${data.registid}`
				})
			}
		},
		created() {
			document.title = '缴费'
			this.getPeople()
		}
	}
</script>

<style scoped lang="less">
	.pay {
		height: 100%;
		
		.box {
			padding: 15px;
			padding-bottom: 0;
			background-color: #fff;
			
			.info {
				height: 101px;
				background: rgba(255, 255, 255, 1);
				border-radius: 10px;
				box-shadow: 0 0 10px #cccccc;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: flex-start;
				
				.id {
					width: 314.5px;
					height: 50px;
					border-bottom: 1px solid rgba(238, 238, 238, 1);
					display: flex;
					align-items: center;
					justify-content: flex-start;
					font-size: 19px;
					font-weight: bold;
					color: rgba(29, 144, 255, 1);
				}
				
				.people {
					width: 314.5px;
					height: 50px;
					display: flex;
					align-items: center;
					justify-content: flex-start;
					font-weight: 500;
					color: #666666;
					font-size: 15px;
					position: relative;
					
					span:first-child {
						font-size: 16px;
						color: #222222;
					}
					
					span:last-child {
						font-size: 14px;
						position: absolute;
						right: 0;
						display: flex;
						align-items: center;
						
						i {
							display: block;
							width: 20px;
							height: 20px;
							background-image: url("~@/assets/images/icon/icon_down.png");
							background-size: 10px 5.5px;
							background-position: center center;
							background-repeat: no-repeat;
							transform: rotate(-90deg);
						}
					}
				}
			}
			
			.tabs {
				height: 50px;
				display: flex;
				align-items: center;
				justify-content: space-around;
				
				.item {
					font-size: 14px;
					height: 100%;
					color: rgba(153, 153, 153, 1);
					position: relative;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
				}
				
				.active {
					font-size: 16px;
					font-weight: bold;
					color: rgba(29, 144, 255, 1);
					
					&:after {
						content: '';
						width: 18px;
						height: 2px;
						background-color: rgba(29, 144, 255, 1);
						position: absolute;
						bottom: 0;
						left: 50%;
						margin-left: -9px;
					}
				}
			}
		}
		
		.list {
			height: calc(100vh - 166px);
			
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
			
			.item {
				background-color: #fff;
				padding: 0 15px;
				margin-top: 8px;
				
				.top {
					display: flex;
					align-items: flex-start;
					justify-content: space-between;
					font-size: 13px;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
					padding-bottom: 15px;
					border-bottom: 1px solid #eee;
					
					.l {
						font-size: 13px;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
						display: flex;
						align-items: flex-start;
						justify-content: center;
						flex-direction: column;
						
						.title {
							font-size: 16px;
							font-weight: 500;
							color: rgba(34, 34, 34, 1);
							margin: 15px 0 !important;
						}
						
						span {
							margin-bottom: 7.5px;
							
							.yellow {
								font-size: 16px;
								color: #FF660C;
								font-style: normal;
							}
						}
					}
					
					.r {
						font-size: 13px;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
						display: flex;
						align-items: flex-end;
						justify-content: center;
						flex-direction: column;
						
						.status {
							font-size: 15px;
							font-weight: 500;
							color: rgba(153, 153, 153, 1);
							margin-top: 15px;
							margin-bottom: 16px;
						}
						
						.blue {
							color: #1D90FF;
						}
					}
				}
				
				.bottom {
					display: flex;
					align-items: center;
					justify-content: flex-end;
					padding: 10px 0;
					div {
						font-size: 13px;
						font-weight: 500;
						width: 17.6vw;
						height: 25px;
						border: 1px solid rgba(153, 153, 153, 1);
						border-radius: 12.5px;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-left: 12px;
					}
					
					.btnGray {
						color: rgba(153, 153, 153, 1);
						border: 1px solid rgba(153, 153, 153, 1);
					}
					
					.btnGrayDelete {
						color: rgba(153, 153, 153, 1);
						border: 1px solid rgba(153, 153, 153, 1);
					}
					
					.btnBlue {
						color: rgba(131, 195, 255, 1);
						border: 1px solid rgba(131, 195, 255, 1);
					}
					
					.btnBlack {
						color: rgba(34, 34, 34, 1);
						border: 1px solid rgba(34, 34, 34, 1);
					}
				}
			}
		}
	}
</style>
