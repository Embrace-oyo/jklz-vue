<template>
	<div class="record">
		<div class="box">
			<div class="info">
				<div class="id">{{idCard}}</div>
				<div class="people" @click="pickerClick">
					<span>当前就诊人：</span>
					<span>{{name}}</span>
					<span>选择<i></i></span>
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
				<div class="item" v-for="item of list" :key="item.itemId" @click="detailJump(item)">
					<div class="l">
						<span>{{type(item.type)}}</span>
						<span>订单号：{{item.orderSn}}</span>
						<span>金额：<i>{{item.totalPrice / 100}}</i>元</span>
					</div>
					<div class="r">
						<span :class="{blue: item.status === 2}">{{item.statusName}}</span>
						<span>{{item.createTime.split(' ')[0]}}</span>
					</div>
				</div>
			</cube-scroll>
		</div>
	</div>
</template>

<script>
	export default {
		name: "record",
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
				name: '',
				idCard: '',
				peopleIndex: 0,
				curSelect: '',
				peopleList: [],
				list: [],
				limit: 10,
				page: 1,
				total: 0
			}
		},
		methods: {
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
				this.page = 1
				this.list = []
				this.getList()
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
						this.getList()
					}
				})
			},
			// 获取住院清单
			getList(flag = false) {
				if (!flag) this.$mask().show()
				let params = {
					limit: this.limit,
					page: this.page,
					patientId: this.curSelect.id,
					healthCardId: this.curSelect.healthCardId
				}
				this.$api.recordList(params).then(res => {
					if (res.data.code === 0) {
						this.list = this.list.concat(res.data.Page.list)
						this.total = res.data.Page.totalPage
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
				this.getList(true)
			},
			// 类型
			type(id) {
				switch (id) {
					case 1:
						return '预约挂号'
						break
					case 3:
						return '门诊缴费'
						break
					case 4:
						return '预交金充值'
						break
					default:
						return ''
				}
			},
			// 详情跳转
			detailJump(data) {
				switch (data.type) {
					case 1:
						this.$router.push({
							path: 'makeAnAppointmentDetail',
							query: {
								registid: data.registid,
								id: data.id,
							}
						})
						break
					case 3:
						this.$router.push({
							path: `/payDetail`,
							query: {
								orderId: data.id,
							}
						})
						break
					case 4:
						this.$router.push({
							path: '/payRecordDetail',
							query: {
								id: data.orderSn
							}
						})
						break
					default:
						return ''
				}
			},
		},
		created() {
			document.title = '缴费记录'
			this.getPeople()
		}
	}
</script>

<style scoped lang="less">
	.record {
		height: 100vh;
		
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
			
		}
		
		.list {
			height: calc(100vh - 116px);
			
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
				margin-top: 8px;
				padding: 13px 15px;
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
				font-size: 13px;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
				
				.l {
					display: flex;
					align-items: flex-start;
					justify-content: center;
					flex-direction: column;
					
					span {
						margin-bottom: 7.5px;
					}
					
					span:nth-child(1) {
						font-size: 16px;
						color: rgba(34, 34, 34, 1);
						margin-bottom: 15px;
						
						i {
							font-style: normal;
							margin-left: 10px;
						}
					}
					
					span:last-child {
						i {
							font-size: 16px;
							color: #FF660C;
							font-style: normal;
						}
					}
				}
				
				.r {
					color: rgba(153, 153, 153, 1);
					font-size: 13px;
					display: flex;
					flex-direction: column;
					
					span:last-child {
						margin-top: 17.5px;
					}
				}
			}
		}
	}
	
	.blue {
		color: #1D90FF;
		font-size: 15px;
		text-align: right;
	}
</style>
