<template>
	<div class="waiting">
		<div class="chooseDoctor" @click="doctorClick">
			<span>{{doctorName}}</span>
			<i></i>
		</div>
		<div class="box">
			<div class="info">
				<span class="tit">{{peoplerIdCard}}</span>
				<span class="line" @click="peopleClick">当前就诊人：<i class="word">{{peopleName}}</i><i class="choose">选择<i></i></i></span>
				<span class="line" @click="departClick">当前科室：<i class="word">{{departName}}</i><i class="choose">选择<i></i></i></span>
			</div>
		</div>
		<div class="box">
			<div class="list">
				<div class="row header bg">
					<span>诊室</span>
					<span>候诊人</span>
					<span>医生</span>
					<span>排号</span>
					<span>状态</span>
				</div>
				<div class="row normal" :class="{bg: index%2 === 1}" v-for="(item, index) of list" :key="item">
					<span>{{item.waitingRoom}}</span>
					<span>{{item.name}}</span>
					<span>{{item.doctName}}</span>
					<span>{{item.waitNo}}</span>
					<span>{{item.status}}</span>
				</div>
			</div>
		</div>
		<!--		<div class="box">
					<div class="noData">
						<img src="~@/assets/images/other/pic_zwsj2.png" alt="">
						<span>暂无候诊信息~</span>
					</div>
				</div>-->
	</div>
</template>

<script>
	export default {
		name: "waiting",
		data() {
			return {
				query: '',
				
				// 用户
				peopleList: [],
				peopleData: [],
				peopleIndex: 0,
				peopleName: '',
				peoplerIdCard: '',
				peopleCurSelect: '',
				
				// 科室
				departList: [],
				departData: [],
				departIndex: 0,
				departName: '',
				departCurSelect: '',
				
				// 医生
				doctorList: [],
				doctorData: [],
				doctorIndex: 0,
				doctorName: '',
				doctorCurSelect: '',
				
				// 数据
				list: [],
			}
		},
		methods: {
			// 就诊人选择器
			peopleClick() {
				if(this.peopleList.length === 0){
					this.$router.push({
						path: '/healthCard'
					})
					return
				}
				this.picker = this.$createPicker({
					title: '选择就诊人',
					data: [this.peopleData],
					selectedIndex: [this.peopleIndex],
					onSelect: this.peopleSclect,
				})
				this.picker.show()
			},
			peopleSclect(selectedVal, selectedIndex, selectedText) {
				this.peopleIndex = selectedVal[0]
				this.peopleName = this.peopleList[this.peopleIndex].name
				this.peoplerIdCard = this.peopleList[this.peopleIndex].healthCardId.replace(/(.{6}).*(.{5})/, "$1*********$2")
				this.peopleCurSelect = this.peopleList[this.peopleIndex]
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
					this.peopleData = [...arr]
					this.peopleName = this.peopleList.length !== 0 ? this.peopleList[this.peopleIndex].name : '添加就诊人'
					this.peoplerIdCard = this.peopleList.length !== 0 ? this.peopleList[this.peopleIndex].healthCardId.replace(/(.{6}).*(.{5})/, "$1*********$2") : '请先添加就诊人'
					this.peopleCurSelect = this.peopleList[this.peopleIndex]
				})
			},
			// 获取科室
			getDepart(){
				let params = {
					hospitalId: this.query.hospitalId,
				}
				this.$api.department(params).then(res => {
					if (res.data.code === 0) {
						let list = res.data.hospitalDepartmentDTOS
						this.departList = list
						let arr = []
						list.map((x, index) => {
							let obj = {text: x.hisDepartmentName, value: index}
							arr.push(obj)
							if(x.hisDepartmentId === this.query.hisDepartmentId){
								this.departCurSelect = x
								this.departName =  x.hisDepartmentName
							}
						})
						this.departData = [...arr]
						this.getDoctor()
					}
				})
			},
			// 科室选择器
			departClick(){
				this.departPicker = this.$createPicker({
					title: '选择科室',
					data: [this.departData],
					selectedIndex: [this.departIndex],
					onSelect: this.departSclect,
				})
				this.departPicker.show()
			},
			departSclect(selectedVal, selectedIndex, selectedText){
				this.departIndex = selectedVal[0]
				this.departName = this.departList[this.departIndex].hisDepartmentName
				this.departCurSelect = this.departList[this.departIndex]
				this.getDoctor()
			},
			// 获取当前科室医生
			getDoctor() {
				let params = {
					hisOrganizationId: this.departCurSelect.hisOrganizationId,
					hisDepartmentId: this.departCurSelect.hisDepartmentId,
					type: 1,
					queryKey: '',
				}
				let array = []
				this.$api.schedule(params).then(res => {
					if (res.data.code === 0) {
						let data = res.data.scheduleList
						data.map(x => {
							let year = x.scheduleDate.split('-')[0]
							let month = x.scheduleDate.split('-')[1]
							let day = x.scheduleDate.split('-')[2]
							let topArr = x.morningDoctorList === null ? [] : x.morningDoctorList
							let bottomArr = x.afternoonDoctorList === null ? [] : x.afternoonDoctorList
							let arr = [...topArr, ...bottomArr]
							array.push(arr)
						})
						this.doctorList = []
						this.doctorData = []
						this.doctorList = array[0]
						if(this.doctorList.length === 0){
							this.doctorName = '请选择其他科室'
						}else{
							this.doctorCurSelect = this.doctorList[this.doctorIndex]
							this.doctorName = this.doctorList[this.doctorIndex].hisDoctorName
							this.getWaiting()
						}
						this.doctorList.map((x, index) => {
							let data = {text: x.hisDoctorName, value: index}
							this.doctorData.push(data)
						})
					}
				})
			},
			// 医生选择器
			doctorClick(){
				this.doctorPicker = this.$createPicker({
					title: '选择医生',
					data: [this.doctorData],
					selectedIndex: [this.doctorIndex],
					onSelect: this.doctorSelect,
				})
				this.doctorPicker.show()
			},
			doctorSelect(selectedVal, selectedIndex, selectedText){
				this.doctorIndex = selectedVal[0]
				this.doctorName = this.doctorList[this.doctorIndex].hisDoctorName
				this.doctorCurSelect = this.doctorList[this.doctorIndex]
				this.getWaiting()
			},
			// 获取候诊查询数据
			getWaiting(){
				this.$mask().show()
				let params = {
					doctorId: this.doctorCurSelect.doctorID,
					hisDepartmentId: this.departCurSelect.hisDepartmentId,
					hospitalId: this.query.hospitalId,
				}
				this.$api.queryWait(params).then(res => {
					if(res.data.code === 0){
						this.list = res.data.queryWaitResponses
						this.$mask().hide()
					}
				})
			}
		},
		created() {
			document.title = '候诊查询'
			this.query = this.$route.query
			this.getPeople()
			this.getDepart()
		}
	}
</script>

<style scoped lang="less">
	.waiting {
		height: 100vh;
		overflow: auto;
		
		.chooseDoctor {
			height: 44px;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #fff;
			
			span {
				font-size: 16px;
				font-weight: 500;
				color: rgba(34, 34, 34, 1);
			}
			
			i {
				display: block;
				width: 30px;
				height: 16px;
				background-image: url("~@/assets/images/icon/icon_arrow_down.png");
				background-size: 7.5px 4px;
				background-position: center center;
				background-repeat: no-repeat;
			}
		}
		
		.box {
			padding: 7.5px 15px;
			
			.info {
				background-color: #fff;
				padding: 0 15px;
				border-radius: 10px;
				display: flex;
				align-items: flex-start;
				justify-content: center;
				flex-direction: column;
				position: relative;
				
				span {
					width: 100%;
					height: 46.5px;
					border-bottom: 1px solid rgba(238, 238, 238, 1);
					display: flex;
					align-items: center;
				}
				
				.tit {
					font-size: 19px;
					font-weight: bold;
					color: rgba(29, 144, 255, 1);
				}
				
				.line {
					font-size: 16px;
					font-weight: 500;
					color: rgba(34, 34, 34, 1);
					
					.word {
						font-size: 14px;
						color: #666666;
						font-style: normal;
					}
					
					.choose {
						font-style: normal;
						font-size: 14px;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
						position: absolute;
						right: 15px;
						display: flex;
						align-items: center;
						
						i {
							display: block;
							width: 11px;
							height: 5.5px;
							background-image: url("~@/assets/images/icon/icon_down.png");
							background-size: cover;
							background-repeat: no-repeat;
							background-position: center center;
							margin-left: 4.5px;
							transform: rotate(-90deg);
						}
					}
				}
			}
			
			.list {
				border: 1px solid rgba(228, 228, 238, 1);
				
				.row {
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 14px;
					
					span {
						width: 68px;
						height: 50px;
						display: flex;
						align-items: center;
						justify-content: center;
						border-right: 1px solid rgba(228, 228, 238, 1);
						font-size: 12px;
						&:last-child {
							border: none;
						}
					}
				}
				
				.header {
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
				}
				
				.normal {
					color: rgba(34, 34, 34, 1);
					border-top: 1px solid rgba(228, 228, 238, 1);
				}
				
				.bg {
					background: rgba(248, 248, 255, 1);
				}
			}
			
			.noData {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				
				img {
					width: 153.5px;
					height: 85px;
					margin-top: 60.5px;
				}
				
				span {
					font-size: 13px;
					font-weight: 500;
					color: rgba(153, 153, 153, 1);
					margin-top: 17.5px;
				}
			}
		}
	}
</style>
