<template>
	<div class="suggest">
		<div class="box">
			<textarea v-model="value" cols="30" rows="10" maxlength="200" placeholder="请提出你的宝贵建议或意见（200字以内）"></textarea>
		</div>
		<div class="box" style="margin-top: 10px">
			<div class="imgUpload">
				<cube-upload
					:action="action"
					:max="3"
					:multiple="false"
					:simultaneous-uploads="3"
					@file-removed="fileRemove"
					@file-error="fileError"
					@file-success="fileSuccess"/>
			</div>
		</div>
		<div class="btn" @click="feedback">提交</div>
	</div>
</template>

<script>
	import url from '@/utils/urlConfig'
	export default {
		name: "suggest",
		data() {
			return {
				list: [],
				value: '',
				file: '',
				action: {
					target: url.baseUrl + '/api/image/fileUpload',
					data: (files) => {
						return {files: files.file}
					}
				}
			}
		},
		methods: {
			// 图片上传成功
			fileSuccess(data){
				let img = data.response.fileUrl
				this.list.push(img)
			},
			// 图片上传失败
			fileError(error){
				console.log(error)
			},
			// 图片删删除
			fileRemove(data){
				let img = data.response.fileUrl
				let list = this.list
				let index = null
				list.map((x, i) => {
					if(x === img){
						index = i
					}
				})
				this.list.splice(index, 1)
			},
			// 提交反馈
			feedback(){
				this.$mask().show()
				let params = {
					content: this.value,
					images: this.list.join(','),
				}
				this.$api.feedback(params).then(res => {
					if(res.data.code === 0){
						this.$toast('提交成功')
						setTimeout(() => {
							this.$router.go(-1)
						}, 2000)
					}
				})
			},
		},
		created() {
			document.title = '意见反馈'
		}
	}
</script>

<style scoped lang="less">
	.suggest {
		height: 100vh;
		
		.box {
			padding: 15px;
			background-color: #fff;
			
			textarea {
				width: 100%;
				height: 161px;
				outline: none;
				border: none;
				font-size: 16px;
			}
			
			.imgUpload {
				width: 100%;
				height: 138px;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				position: relative;
/*				input{
					display: block;
					width: 100%;
					height: 100%;
					background-color: transparent;
					opacity: 0;
				}
				.img {
					width: 105px;
					height: 105px;
					border: 1px dashed #999;
					position: relative;
					&:before{
						content: '';
						width: 40px;
						height: 2px;
						position: absolute;
						left: 50%;
						top: 50%;
						margin-left: -20px;
						margin-top: -1px;
						background-color: #999;
					}
					&:after{
						content: '';
						width: 40px;
						height: 2px;
						position: absolute;
						left: 50%;
						top: 50%;
						margin-left: -20px;
						margin-top: -1px;
						background-color: #999;
						transform: rotate(90deg);
					}
				}*/
			}
		}
		
		.btn {
			width: 300px;
			height: 44px;
			background: rgba(29, 144, 255, 1);
			border-radius: 5px;
			color: #fff;
			font-size: 17px;
			font-weight: bold;
			color: rgba(255, 255, 255, 1);
			margin: 60px auto;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
