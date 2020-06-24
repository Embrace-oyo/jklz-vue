<template>
	<div class="userInfo">
		<div v-if="step === 0">
			<div class="box">
				<div class="item">
					<span class="title">姓名</span>
					<span class="cont">
					{{userInfo.realname}}
				</span>
				</div>
				<div class="item">
					<span class="title">性别</span>
					<span class="cont">
					{{gender}}
				</span>
				</div>
				<div class="item">
					<span class="title">民族</span>
					<span class="cont">
					{{userInfo.nation}}
				</span>
				</div>
<!--				<div class="item">
					<span class="title">证件类型</span>
					<span class="cont">
					{{type}}
					</span>
				</div>-->
				<div class="item">
					<span class="title">身份证号</span>
					<span class="cont">
					{{userInfo.idNumber}}
				</span>
				</div>
<!--				<div class="item">
					<span class="title">出生日期</span>
					<span class="cont">
					{{userInfo.birthday}}
					</span>
				</div>-->
				<div class="item">
					<span class="title">电话</span>
					<span class="cont">
					{{userInfo.phone}}
				</span>
				</div>
<!--				<div class="item">
					<span class="title">地址</span>
					<span class="cont">
					{{userInfo.addr}}
				</span>
				</div>-->
			</div>
			<div class="btn" @click=" step = 1">修改手机号</div>
		</div>
		
		<div class="fixed" v-if="step !== 0">
			<div class="box" v-if="step === 1">
				<div class="item">
					<span class="title">当前绑定手机号码</span>
					<span class="cont">{{userInfo.phone}}</span>
				</div>
				<div class="item">
					<span class="title">验证码</span>
					<span class="cont">
						<input type="number" placeholder="请输入验证码" v-model="code">
						<span class="yzm" @click="getCode">{{codeVal}}</span>
					</span>
				</div>
				<div class="btn" @click="regPhone">下一步</div>
			</div>
			<div class="box" v-if="step === 2">
				<div class="item">
					<span class="title">新手机号</span>
					<span class="cont">
						<input type="number" v-model="newPhone" placeholder="请输入新手机号码">
					</span>
				</div>
				<div class="item">
					<span class="title">验证码</span>
					<span class="cont">
						<input type="number" placeholder="请输入验证码" v-model="newCode">
						<span class="yzm" @click="getCode">{{codeValNew}}</span>
					</span>
				</div>
				<div class="btn" @click="upDatePhone">确定</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "setUserInfo",
		computed: {
			gender() {
				switch (this.userInfo.gender) {
					case 0:
						return '男'
						break
					case 1:
						return '女'
						break
					default:
						return ''
				}
			},
			type() {
				switch (this.userInfo.idType) {
					case 1:
						return '身份证'
						break
					default:
						return '其他'
				}
			}
		},
		data() {
			return {
				userInfo: '',
				step: 0,
				codeVal: '获取验证码',
				codeValNew: '获取验证码',
				mobile: '',
				timer: null,
				newPhone: '',
				code: '',
				newCode: '',
				token: '',
			}
		},
		methods: {
			// 获取用户信息
			getUserInfo() {
				this.$api.getUserInfo().then(res => {
					if (res.data.code === 0) {
						this.userInfo = res.data.patient
						this.mobile = this.userInfo.phone
						this.userInfo.idNumber = this.userInfo.idNumber.replace(/(.{3}).*(.{4})/, "$1*********$2")
						this.userInfo.phone = this.userInfo.phone.replace(/(.{3}).*(.{4})/, "$1****$2")
					}
				})
			},
			// 获取验证码
			getCode() {
				if (this.step === 2 && !/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.newPhone)) {
					this.$toast('请输入正确的手机号')
					return
				}
				if (this.step === 1) {
					if (this.codeVal !== '获取验证码') return
				}
				if (this.step === 2) {
					if (this.codeValNew !== '获取验证码') return
				}
				this.$mask().show()
				let params = {
					phone: this.step === 1 ? this.mobile : this.newPhone,
					verificationCodeType: this.step === 1 ? 203 : 205
				}
				this.$api.smsCode(params).then(res => {
					if (res.data.code === 0) {
						this.$toast('发送成功')
						clearInterval(this.timer)
						this.timer = null
						let s = 61
						this.timer = setInterval(() => {
							s--
							if (this.step === 1) {
								this.codeVal = `剩余${s}秒`
							} else {
								this.codeValNew = `剩余${s}秒`
							}
							if (s === 0) {
								if (this.step === 1) {
									this.codeVal = `获取验证码`
								} else {
									this.codeValNew = `获取验证码`
								}
								clearInterval(this.timer)
								this.timer = null
							}
						}, 1000)
					}
				})
			},
			// 验证手机号
			regPhone() {
				if (this.code === '') {
					this.$toast('请输入验证码')
					return
				}
				this.$mask().show()
				let params = {
					code: this.code,
					phone: this.mobile,
					patientId: this.userInfo.id
				}
				this.$api.validation(params).then(res => {
					if (res.data.code === 0) {
						this.$mask().hide()
						this.token = res.data.msg
						clearInterval(this.timer)
						this.timer = null
						this.codeVal = '获取验证码'
						this.codeValNew = '获取验证码'
						this.step = 2
					}
				})
			},
			// 更新手机号
			upDatePhone() {
				if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.newPhone)) {
					this.$toast('请输入正确的手机号')
					return
				}
				if (this.newCode === '') {
					this.$toast('请输入验证码')
					return
				}
				this.$mask().show()
				let params = {
					code: this.newCode,
					patientId: this.userInfo.id,
					phone: this.newPhone,
					token: this.token
				}
				this.$api.updatePhone(params).then(res => {
					if (res.data.code === 0) {
						this.$toast('更新手机号成功')
						this.code = ''
						this.newCode = ''
						this.newPhone = ''
						clearInterval(this.timer)
						this.timer = null
						this.codeVal = '获取验证码'
						this.codeValNew = '获取验证码'
						this.token = ''
						this.step = 0
						this.getUserInfo()
					}
				})
			}
		},
		created() {
			document.title = '个人信息'
			this.getUserInfo()
		}
	}
</script>

<style scoped lang="less">
	.userInfo {
		width: 100%;
		height: 100vh;
		
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
					justify-content: flex-end;
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
		
		.btn {
			width: 300px;
			height: 40px;
			background-color: #1D90FF;
			color: #fff;
			border-radius: 5px;
			margin: 50px auto;
			font-size: 16px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		.fixed {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100vh;
			background-color: #fff;
			
			.box {
				padding: 0 15px;
				
				.item {
					position: relative;
					justify-content: space-between;
					
					.title {
						width: auto;
						margin-right: 0;
					}
					
					.cont {
						width: auto;
						position: static;
						
						input {
							position: absolute;
							width: 170px;
							left: 55%;
							display: block;
							height: 40px;
							margin-left: -100px;
							font-size: 14px;
						}
						
						.yzm {
							position: absolute;
							right: 0;
							border: 1px solid #1D90FF;
							color: #1D90FF;
							padding: 5px 10px;
							border-radius: 5px;
						}
					}
				}
			}
		}
	}
</style>
