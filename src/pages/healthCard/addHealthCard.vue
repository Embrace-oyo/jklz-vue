<template>
	<div class="addHealthCard">
		<div class="box">
			<div class="item">
				<span class="title">姓名</span>
				<span class="cont">
					<input type="text" v-model="form.name" placeholder="请输入姓名">
				</span>
			</div>
			<div class="item">
				<span class="title">性别</span>
				<span class="cont" @click="PickerClick">
					<span>{{sexSelect}}</span>
					<i></i>
				</span>
			</div>
			<div class="item">
				<span class="title">民族</span>
				<span class="cont">
					<input type="text" v-model="form.national" placeholder="请输入民族">
				</span>
			</div>
			<div class="item">
				<span class="title">家庭关系</span>
				<span class="cont" @click="pickerRelation">
					<span>{{relation}}</span>
					<i></i>
				</span>
			</div>
			<div class="item">
				<span class="title">身份证号</span>
				<span class="cont">
					<input type="text" placeholder="请输入身份证号码" v-model="form.idCard">
				</span>
			</div>
<!--			<div class="item">
				<span class="title">地址</span>
				<span class="cont">
					<input type="text" placeholder="请输入联系地址" v-model="form.addr">
				</span>
			</div>-->
		</div>
		<div class="box margin">
			<div class="item">
				<div class="title">手机号</div>
				<div class="cont">
					<input type="number" v-model="form.mobile" placeholder="请输入手机号">
				</div>
			</div>
			<div class="item" v-if="cardList.length === 0">
				<div class="title">验证码</div>
				<div class="cont">
					<input type="number" v-model="form.code" placeholder="请输入验证码">
				</div>
				<div class="getCode" @click="getCode">{{codeVal}}</div>
			</div>
		</div>
		<div class="Box">
			<div class="agreement" @click.stop="isCheck = !isCheck">
				<span class="icon" :class="{checked: isCheck}"></span>
				<span class="word">我已阅读<i class="blue" @click.stop="isRead = !isRead">《用户隐私协议》</i></span>
			</div>
			<div class="sure" @click="postCard">提交</div>
		</div>
		<div class="model" v-if="isRead">
			<div class="a-1">
				<div class="a-1-1">{{title}}</div>
				<div class="a-1-2" v-html="agreement"></div>
				<div class="a-1-3" @click="isRead = false"><span>确认</span></div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	
	export default {
		name: "addHealthCard",
		data() {
			return {
				timer: null,
				isCheck: false,
				isRead: false,
				agreement: '',
				title: '',
				codeVal: '发送验证码',
				sexPicker: null,
				sex: [
					{text: '男', value: 0},
					{text: '女', value: 1},
				],
				sexIndex: 0,
				relationData: [
					{text: '本人', value: 1},
					{text: '父母', value: 2},
					{text: '子女', value: 3},
					{text: '夫妻', value: 4},
					{text: '亲属', value: 5},
					{text: '朋友', value: 6},
					{text: '其他', value: 7},
				],
				relationIndex: 1,
				relation: '选择家庭关系',
				sexSelect: '选择性别',
				form: {
					relation: '',
					code: '',
					name: '',
					sex: '',
					national: '',
					type: 1,
					mobile: '',
					idCard: '',
					addr: '',
					timetamps: '',
				},
				cardList: []
			}
		},
		methods: {
			// 家庭关系选择
			pickerRelation() {
				this.relationPicker = this.$createPicker({
					title: '家庭关系选择',
					data: [this.relationData],
					selectedIndex: [this.relationIndex - 1],
					onSelect: this.onRelationPicker,
				})
				this.relationPicker.show()
			},
			// 确定家庭关系选择
			onRelationPicker(selectedVal, selectedIndex, selectedText) {
				this.relationIndex = selectedVal[0]
				this.form.relation = selectedVal[0]
				this.relation = selectedText[0]
			},
			// 性别选择
			PickerClick(data, index) {
				this.sexPicker = this.$createPicker({
					title: '性别选择',
					data: [this.sex],
					selectedIndex: [this.sexIndex],
					onSelect: this.picker,
				})
				this.sexPicker.show()
			},
			// 确定选择的性别
			picker(selectedVal, selectedIndex, selectedText) {
				this.sexIndex = selectedVal[0]
				this.sexSelect = selectedText[0]
				this.form.sex = selectedVal[0]
			},
			// 获取协议
			getAgreement() {
				this.$api.getHelpDetail({dataKey: 'key_sign'}).then(res => {
					let data = res.data.data
					this.agreement = data.content
					this.title = data.title
				})
			},
			// 获取验证码
			getCode() {
				if (this.codeVal !== '发送验证码') return;
				let phoneReg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
				if (!phoneReg.test(this.form.mobile)) {
					this.$toast('请输入正确手机号')
					return
				}
				let params = {
					phone: this.form.mobile,
					verificationCodeType: 209
				}
				this.$api.smsCode(params).then(res => {
					if (res.data.code === 0) {
						this.$toast('发送成功')
						clearInterval(this.timer)
						this.timer = null
						let time = 60
						this.timer = setInterval(() => {
							time--
							if (time === 0) {
								this.codeVal = '发送验证码'
								clearInterval(this.timer)
								this.timer = null
							} else {
								this.codeVal = `剩余${time}秒`
							}
						}, 1000)
					}
				})
			},
			// 获取健康卡列表
			healthCardList() {
				this.$api.healthCardList().then(res => {
					if (res.data.code === 0) {
						this.cardList = res.data.page.list
					}
				})
			},
			// 获取身份证号上的生日
			getBirth(idCard) {
				var birthday = "";
				if (idCard != null && idCard != "") {
					if (idCard.length == 15) {
						birthday = "19" + idCard.slice(6, 12);
					} else if (idCard.length == 18) {
						birthday = idCard.slice(6, 14);
					}
					birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
					//通过正则表达式来指定输出格式为:1990-01-01
				}
				return birthday;
			},
			// 提交健康卡信息
			postCard() {
				let nameReg = /^((?![\u3000-\u303F])[\u2E80-\uFE4F]|\·)*(?![\u3000-\u303F])[\u2E80-\uFE4F](\·)*$/
				let phoneReg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
				let idReg = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/
				if(this.cardList.length > 0 &&  this.form.relation === 1){
					this.$toast('本人关系已存在')
					return
				}
				if (!nameReg.test(this.form.name)) {
					this.$toast('请输入正确姓名')
					return
				}
				if (this.form.sex === '') {
					this.$toast('请选择性别')
					return
				}
				if (this.form.national === '') {
					this.$toast('请输入民族')
					return
				}
				if (this.form.relation === '') {
					this.$toast('请选择家庭关系')
					return
				}
				if (this.form.type === '') {
					this.$toast('请选择证件类型')
					return
				}
				if (!idReg.test(this.form.idCard)) {
					this.$toast('请输入正确身份证号')
					return
				}
				/*				if (this.form.timetamps === '') {
									this.$toast('请选择出生日期')
									return
								}*/
/*				if (this.form.addr === '') {
					this.$toast('请输入地址')
					return
				}*/
				if (!phoneReg.test(this.form.mobile)) {
					this.$toast('请输入正确手机号')
					return
				}
				if (this.form.code === '' && this.cardList.length === 0) {
					this.$toast('请输入验证码')
					return
				}
				if (!this.isCheck) {
					this.$toast('请勾选用户协议')
					return;
				}
				this.form.timetamps = this.getBirth(this.form.idCard)
				let params = {
					gender: this.form.sex,
					idCard: this.form.idCard,
					idType: this.form.type,
					name: this.form.name,
					nation: this.form.national,
					address: this.form.addr,
					birthday: this.form.timetamps,
					relation: this.form.relation,
					phone1: this.form.mobile
				}
				if (this.cardList.length === 0) {
					params.code = this.form.code
				}
				this.$mask().show()
				this.$api.addHealthCardList(params).then(res => {
					if (res.data.code === 0) {
						this.$mask().hide()
						this.$toast('信息提交成功')
						setTimeout(() => {
							this.$router.push({
								path: '/user'
							})
						}, 2000)
					}
				})
			},
		},
		created() {
			document.title = '健康卡信息完善'
			this.healthCardList()
			this.getAgreement()
		}
	}
</script>

<style scoped lang="less">
	.addHealthCard {
		width: 100%;
		height: 100vh;
		overflow: auto;
		
		.box {
			padding: 0 15px;
			background-color: #fff;
			
			.item {
				width: 100%;
				height: 50px;
				border-bottom: 1px solid rgba(237, 237, 237, 1);
				display: flex;
				align-items: center;
				justify-content: flex-start;
				position: relative;
				
				.title {
					width: 120px;
					margin-right: 30px;
					font-size: 16px;
					font-weight: 500;
					color: rgba(34, 34, 34, 1);
				}
				
				.cont {
					width: 450px;
					font-size: 14px;
					font-weight: 500;
					color: rgba(102, 102, 102, 1);
					display: flex;
					align-items: center;
					justify-content: flex-start;
					position: relative;
					
					input {
						background-color: transparent;
						outline: none;
						border: none;
						width: 100%;
						
						&::placeholder {
							color: rgba(204, 204, 204, 1);
						}
					}
					
					i {
						width: 0;
						height: 0;
						border: 4px solid transparent;
						border-top: 4px solid #222222;
						position: absolute;
						right: 0;
					}
				}
				
				.getCode {
					position: absolute;
					right: 0;
					top: 50%;
					margin-top: -15px;
					width: 80px;
					height: 30px;
					background: rgba(29, 144, 255, 1);
					border-radius: 15px;
					font-size: 12px;
					font-weight: 500;
					color: rgba(255, 255, 255, 1);
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
		
		.margin {
			margin-top: 8px;
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
		
		.blue {
			font-style: normal;
			color: #1D90FF;
		}
	}
</style>
