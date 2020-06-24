<template>
	<div class="payment">
		<div class="box">
			<div class="info" @click="pickerClick">
				<span class="tit">{{idCard}}</span>
				<span class="line">当前就诊人：<i class="word">{{name}}</i><i class="choose">选择<i></i></i></span>
			</div>
			<div class="money">
				<div class="word">
					<span>钱包余额 <i class="icon" @click="isRead = true"></i></span>
					<span>{{balance}}元</span>
				</div>
			</div>
			<div class="btn" @click="toUp" v-if="isLive">充值</div>
			<router-link v-if="isLive" tag="div" :to="`/payRecord?hospitalId=${$route.query.hospitalId}&inPatientNo=${detail.inPatientNo}&healthCardId=${curSelect.healthCardId}`" class="record">充值记录</router-link>
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
		name: "payment",
		data(){
			return{
				name: '',
				idCard: '',
				peopleIndex: 0,
				peopleList: [],
				pickerData: [],
				curSelect: '',
				balance: 0,
				detail: '',
				isRead: false,
				content: '',
				agreement: '',
				isLive: false,
			}
		},
		methods: {
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
						this.idCard = this.peopleList.length !== 0 ? this.peopleList[this.peopleIndex].healthCardId.replace(/(.{6}).*(.{5})/,"$1*********$2") : '请先添加就诊人'
						this.curSelect = this.peopleList[this.peopleIndex]
						if (this.peopleList.length !== 0) {
							this.getMoney()
						}else{
							this.$mask().hide()
						}
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
				this.idCard = this.peopleList[this.peopleIndex].healthCardId.replace(/(.{6}).*(.{5})/,"$1*********$2")
				this.curSelect = this.peopleList[this.peopleIndex]
				this.getMoney()
			},
			// 获取余额
			getMoney(){
				let params = {
					hospitalId: this.$route.query.hospitalId,
					id: this.curSelect.id,
					healthCardId: this.curSelect.healthCardId
				}
				this.$api.queryInpatientBalanceInfo(params).then(res => {
					if(res.data.code === 0){
						this.isLive = true
						this.balance = res.data.hospitalizationBalanceReponse.balance
						this.detail = res.data.hospitalizationBalanceReponse
						this.$mask().hide()
					}
				})
			},
			// 充值跳转
			toUp(){
				if(this.peopleList.length === 0) {
					this.$toast('请先添加就诊人')
					setTimeout(() => {
						this.$router.push({
							path: '/healthCard'
						})
					}, 2000)
					return
				}
				this.$router.push({
					path: '/topUp',
					query: {
						sex: this.curSelect.gender === 0 ? '男' : '女',
						age: this.age(this.curSelect.birthday),
						hisHospitalName: this.$route.query.hisHospitalName,
						name: this.detail.name,
						deptName: this.detail.deptName,
						hospitalId: this.$route.query.hospitalId,
						idCardNo: this.detail.idCardNo,
						elecCertId: this.detail.inPatientNo,
						healthCardId: this.curSelect.healthCardId
					}
				})
			},
			// 年龄计算
			age(val){
				let age = val.split('-')[0]
				let curY = new Date().getFullYear()
				return curY - age
			},
			// 获取协议
			getAgreement() {
				this.$api.getHelpDetail({dataKey: 'key_prepay'}).then(res => {
					let data = res.data.data
					this.agreement = data.content
					this.title = data.title
				})
			},
		},
		created() {
			document.title = '住院预交金'
			this.getPeople()
			this.getAgreement()
		}
	}
</script>

<style scoped lang="less">
	.payment {
		height: 100vh;
		
		.box {
			padding: 0 15px;
			
			.info {
				margin-top: 8px;
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
			
			.money {
				margin-top: 8px;
				height: 130px;
				background-image: url("~@/assets/images/other/moneybg.png");
				background-repeat: no-repeat;
				background-size: cover;
				background-position: center center;
				border-radius: 10px;
				overflow: hidden;
				display: flex;
				align-items: center;
				justify-content: center;
				
				.word {
					font-size: 16px;
					font-weight: 500;
					color: rgba(255, 255, 255, 1);
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					span:first-child{
						display: flex;
						align-items: center;
						justify-content: flex-start;
						.icon{
							display: block;
							width: 17px;
							height: 17px;
							background-image: url("~@/assets/images/icon/icon_wh.png");
							background-size: cover;
							background-repeat: no-repeat;
							background-position: center center;
							margin-left: 12px;
						}
					}
					span:last-child {
						margin-top: 14px;
						font-size: 26px;
						font-weight: bold;
					}
					
				}
			}
			
			.btn {
				margin: 30px auto;
				width: 160px;
				height: 44px;
				background: rgba(29, 144, 255, 1);
				border-radius: 10px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 16px;
				font-weight: 500;
				color: rgba(255, 255, 255, 1);
			}
			
			.record {
				margin: 0 auto;
				text-align: center;
				font-size: 14px;
				font-weight: 500;
				color: rgba(29, 144, 255, 1);
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
	}
</style>
