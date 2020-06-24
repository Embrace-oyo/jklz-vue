<template>
	<div class="report">
		<div class="box">
			<div class="info">
				<div class="id">{{idCard}}</div>
				<div class="people" @click="pickerClick">
					<span>当前就诊人：</span>
					<span>{{name}}</span>
					<span>选择<i></i></span>
				</div>
			</div>
			<div class="tab">
				<div class="item" :class="{active: item.id === TabIndex}" v-for="item of Tabs" :key="item.id"
				     @click="TabClick(item, item.id)">
					{{item.name}}
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
				:options="options">
				<router-link tag="div"
				             :to="`/reportDetail?type=${TabIndex === 0 ? '1' : '2'}&repId=${item.repId}&id=${curSelect.id}&hospitalId=${hospitalId}`"
				             class="item" v-for="(item, index) of list" :key="index">
					<div class="l" v-if="TabIndex === 0">
						<span>{{item.repName}}</span>
						<span>医院：{{item.hospitalName}}</span>
						<span>科室：{{item.sendDeptName}}</span>
						<span>报告时间：{{item.sendTime}}</span>
					</div>
					<div class="l" v-if="TabIndex === 1">
						<span>{{item.repName}}</span>
						<span>医院：{{item.hospitalName}}</span>
						<span>科室：{{item.repDeptName}}</span>
						<span>报告时间：{{item.repTime}}</span>
					</div>
				</router-link>
			</cube-scroll>
		</div>
	</div>
</template>

<script>
	export default {
		name: "report",
		computed: {
			options() {
				return {
					useTransition: false,
				}
			},
		},
		data() {
			return {
				hospitalId: '',
				TabIndex: 0,
				Tabs: [
					{name: '检验报告', id: 0},
					{name: '检查报告', id: 1},
				],
				tabIndex: 0,
				tabs: [
					{name: '全部', id: 0},
					{name: '近三月', id: 1},
					{name: '近半年', id: 2},
					{name: '近一年', id: 3},
				],
				name: '',
				idCard: '',
				peopleIndex: 0,
				peopleList: [],
				pickerData: [],
				list: [],
				curSelect: '',
				page: 1,
				limit: 10,
				total: 0
			}
		},
		methods: {
			// 类型切换
			TabClick(data) {
				if (data.id === this.TabIndex) return
				this.TabIndex = data.id
				this.page = 1
				this.list = []
				if(this.peopleList.length !== 0){
					this.TabIndex === 0 ? this.getQueryLabReportList() : this.getQueryCheckReportList()
				}
			},
			// 日期范围切换
			tabClick(data) {
				if (data.id === this.tabIndex) return
				this.tabIndex = data.id
				this.list = []
				this.page = 1
				if(this.peopleList.length !== 0){
					this.TabIndex === 0 ? this.getQueryLabReportList() : this.getQueryCheckReportList()
				}
			},
			// 选择器
			pickerClick() {
				if(this.peopleList.length === 0){
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
				if(this.peopleList.length !== 0){
					this.TabIndex === 0 ? this.getQueryLabReportList() : this.getQueryCheckReportList()
				}
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
					this.name = this.peopleList.length !== 0 ? this.peopleList[this.peopleIndex].name : '请添加就诊人'
					this.curSelect = this.peopleList[this.peopleIndex]
					this.idCard = this.peopleList.length !== 0 ? this.peopleList[this.peopleIndex].healthCardId.replace(/(.{6}).*(.{5})/, "$1*********$2") : '请添加就诊人'
					if(this.peopleList.length !== 0){
						this.TabIndex === 0 ? this.getQueryLabReportList() : this.getQueryCheckReportList()
					}
				})
			},
			// 获取检验报告
			getQueryLabReportList(flag = false) {
				if (!flag) this.$mask().show()
				let params = {
					hospitalId: this.hospitalId,
					id: this.curSelect.id,
					pageSize: this.limit,
					pageStart: this.page,
					type: this.tabIndex,
					healthCardId: this.curSelect.healthCardId
				}
				this.$api.queryLabReportList(params).then(res => {
					if (res.data.code === 0) {
						this.list = this.list.concat(res.data.queryLabReportListReponses)
						this.$mask().hide()
					}
				})
			},
			// 获取检查报告
			getQueryCheckReportList(flag = false) {
				if (!flag) this.$mask().show()
				let params = {
					hospitalId: this.hospitalId,
					id: this.curSelect.id,
					pageSize: this.limit,
					pageStart: this.page,
					type: this.tabIndex,
					healthCardId: this.curSelect.healthCardId
				}
				this.$api.queryCheckReportList(params).then(res => {
					if (res.data.code === 0) {
						this.list = this.list.concat(res.data.queryCheckReportListReponses)
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
				if(this.peopleList.length !== 0){
					this.TabIndex === 0 ? this.getQueryLabReportList(true) : this.getQueryCheckReportList(true)
				}
			},
		},
		created() {
			document.title = '电子报告'
			this.hospitalId = this.$route.query.hospitalId
			this.getPeople()
		}
	}
</script>

<style scoped lang="less">
	.report {
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
			
			.tab {
				margin: 4px;
				height: 45px;
				background: rgba(255, 255, 255, 1);
				display: flex;
				align-items: center;
				justify-content: space-around;
				
				.item {
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					font-size: 14px;
					font-weight: 500;
					color: rgba(153, 153, 153, 1);
				}
				
				.active {
					font-size: 16px;
					font-weight: bold;
					color: rgba(29, 144, 255, 1);
					position: relative;
					
					&:after {
						content: '';
						width: 18px;
						height: 2px;
						background: rgba(29, 144, 255, 1);
						border-radius: 2px;
						position: absolute;
						bottom: 0;
						left: 50%;
						margin-left: -9px;
					}
				}
			}
			
			.tabs {
				height: 50px;
				display: flex;
				align-items: center;
				justify-content: space-around;
				
				.item {
					width: 60px;
					height: 23px;
					font-size: 14px;
					color: rgba(153, 153, 153, 1);
					position: relative;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
				}
				
				.active {
					background: rgba(29, 144, 255, 1);
					border-radius: 11.5px;
					color: rgba(255, 255, 255, 1);
				}
			}
		}
		
		.list {
			height: calc(100vh - 219px);
			
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
				}
			}
		}
	}
</style>
