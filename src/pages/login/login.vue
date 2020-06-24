<template>
	<div class="login">
		<div class="box">
			<div class="inputBox">
				<label>手机号码</label>
				<input type="number" maxlength="11" v-model="mobile" placeholder="请输入手机号码">
			</div>
			<div class="inputBox">
				<label>验证码</label>
				<input type="number" maxlength="6" v-model="code" placeholder="请输入验证码">
				<span class="getCode" @click="getCode">{{val}}</span>
			</div>
			<div class="agreement" @click.stop="checked = !checked">
				<img v-if="checked" src="~@/assets/images/icon/icon_gou1.png" alt="">
				<img v-if="!checked" src="'~@/assets/images/icon/icon_circle1.png'" alt="">
				<span class="sp1">注册即同意<span class="sp2" @click.stop="clickAgreement">《隐私协议》</span></span>
			</div>
			<div class="btn" @click="login">登录</div>
		</div>
		<div class="model" v-if="toggleAgreement">
			<div class="a-1">
				<div class="a-1-1">
					用户注册隐私协议
				</div>
				<div class="a-1-2" v-html="agreement">
				
				</div>
				<div class="a-1-3" @click="toggleAgreement = false">
					<span>确认</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "login",
		data() {
			return {
				checked: true,
				toggleAgreement: false,
				agreement: '',
				val: '获取验证码',
				mobile: null,
				code: null,
				timer: null,
				s: 121,
			}
		},
		methods: {
			// 获取隐私协议
			getAgreement() {
				let params = {
					agreementName: '用户注册隐私协议'
				}
				this.$api.agreement(params).then((res) => {
					if (res.data.code === 0) {
						this.agreement = res.data.agreementEntity.content
					}
				})
			},
			//	展示隐藏协议
			clickAgreement() {
				this.toggleAgreement = !this.toggleAgreement
			},
			// 获取验证码
			getCode() {
				if (this.val !== '获取验证码') return;
				let reg = /^1[0-9]{10}$/;
				if (!reg.test(this.mobile)) {
					this.$toast('请输入正确手机号')
					return
				}
				this.$toast('', 'loading', 0, true)
				this.$api.smsCode({verificationCodeType: 208, phone: this.mobile}).then(res => {
					this.$toast('', 'loading', 0, true).hide()
					if(res.data.code === 0){
						this.s--
						this.timer = setInterval(() => {
							this.val = `${this.s}秒`
							this.s--
							if (this.s < 0) {
								clearInterval(this.timer);
								this.val = `获取验证码`
								this.s = 121
							}
						}, 1000)
					}else{
						this.$toast(res.data.msg)
					}
				})
			},
			// 注册
			login() {
				let mobileReg = /^1[0-9]{10}$/;
				if (!mobileReg.test(this.mobile)) {
					this.$toast('请输入正确手机号')
					return
				}
				if (!this.code) {
					this.$toast('请输入验证码')
					return
				}
				if (!this.checked) {
					this.$toast('请同意隐私协议')
					return
				}
				this.$api.regSMS({phoneNum: this.mobile, code: this.code}).then(res => {
					if(res.data.code === 0){
						localStorage.setItem('isLoginOk', 'true')
						this.$router.push({
							path: '/'
						})
					}
				})
			}
		},
		mounted() {
			this.getAgreement()
		}
	}
</script>

<style scoped lang="less">
	.login {
		width: 100%;
		height: 100vh;
		background-color: #fff;
		
		.box {
			padding: 0 15px;
			
			.inputBox {
				width: 100%;
				border-bottom: 1px solid #ededed;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				font-size: 16px;
				color: #222222;
				height: 50px;
				
				label {
					min-width: 64px;
				}
				
				input {
					margin-left: 34px;
					outline: none;
					border: none;
					font-size: 14px;
					
					&::placeholder {
						color: #ccc;
					}
				}
				
				.getCode {
					display: inline-block;
					width: 92px;
					height: 30px;
					text-align: center;
					line-height: 30px;
					color: #34c4da;
					font-size: 12px;
					border: 1px solid #34c4da;
					border-radius: 2px;
				}
			}
			
			.agreement {
				margin: 13px 0;
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				color: #666666;
				font-size: 12px;
				
				img {
					width: 13px;
					height: 13px;
				}
				
				.sp1 {
					margin-left: 10px;
				}
				
				.sp2 {
					color: #34C4DA;
				}
			}
			
			.btn {
				margin: 0 auto;
				width: 300px;
				height: 44px;
				background: #34c4da;
				border-radius: 5px;
				text-align: center;
				line-height: 44px;
				font-size: 17px;
				font-weight: bold;
				color: #fff;
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
