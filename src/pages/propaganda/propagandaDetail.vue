<template>
	<div class="propagandaDetail">
		<div class="box">
			<div class="title">{{detail.title}}</div>
			<div class="date">{{detail.publishUser}} <span>{{detail.createTime ? getDateDiff(detail.createTime) : ''}}</span></div>
			<div class="content" v-html="detail.content"></div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "propagandaDetail",
		data(){
			return{
				detail: ''
			}
		},
		methods: {
			// 获取文章详情
			getDetail(){
				this.$mask().show()
				let params = {
					articleId: this.$route.query.articleId,
					weiXinId: 1
				}
				this.$api.article(params).then(res => {
					if(res.data.code === 0){
						this.detail = res.data.articleDTO
						this.$mask().hide()
					}
				})
			},
			// 时间转换
			getDateDiff(dateTimeStamp) {
				let oldYear = parseInt(dateTimeStamp.split(' ')[0].split('-')[0])
				let oldMonth = parseInt(dateTimeStamp.split(' ')[0].split('-')[1])
				let oldDay = parseInt(dateTimeStamp.split(' ')[0].split('-')[2])
				let curYear = new Date().getFullYear()
				let curMonth = new Date().getMonth() + 1
				let curDay = new Date().getDay()
				if (curYear - oldYear > 1) {
					return dateTimeStamp.split(' ')[0]
				} else if (curYear - oldYear === 1) {
					let difMonth = 12 - oldMonth + curMonth
					if(difMonth > 1){
						return dateTimeStamp.split(' ')[0]
					}else if(difMonth === 1){
						let date = new Date()
						date.setMonth(curMonth -1)
						date.setDate(0)
						let days = date.getDate()
						let difDay = days - oldDay + curDay
						if(difDay === 4){
							return '4天前'
						}else if(difDay === 3){
							return '3天前'
						}else if(difDay === 2){
							return '2天前'
						}else if(difDay === 1){
							return '1天前'
						}else{
							return dateTimeStamp.split(' ')[0]
						}
					}
				} else if (curYear === oldYear) {
					if (curMonth - oldMonth > 1) {
						return dateTimeStamp.split(' ')[0]
					} else if (curMonth - oldMonth === 1) {
						let date = new Date()
						date.setMonth(curMonth -1)
						date.setDate(0)
						let days = date.getDate()
						let difDay = days - oldDay + curDay
						if(difDay === 4){
							return '4天前'
						}else if(difDay === 3){
							return '3天前'
						}else if(difDay === 2){
							return '2天前'
						}else if(difDay === 1){
							return '1天前'
						}else{
							return dateTimeStamp.split(' ')[0]
						}
					} else if (curMonth === oldMonth) {
						if (curDay - oldDay > 4) {
							return dateTimeStamp.split(' ')[0]
						} else if (curDay - oldDay === 4) {
							return '4天前'
						} else if (curDay - oldDay === 3) {
							return '3天前'
						} else if (curDay - oldDay === 2) {
							return '2天前'
						} else if (curDay - oldDay === 1) {
							return '1天前'
						} else if (curDay === oldDay) {
							return dateTimeStamp.split(' ')[1]
						}
					}
				}
			}
		},
		created() {
			document.title = '文章详情'
			this.getDetail()
		}
	}
</script>

<style scoped lang="less">
	.propagandaDetail {
		height: 100vh;
		overflow: auto;
		
		.box {
			padding: 15px;
			background-color: #fff;
			
			.title {
				font-size: 17px;
				font-weight: bold;
				color: rgba(34, 34, 34, 1);
			}
			
			.date {
				margin-top: 8px;
				font-size: 10px;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
				line-height: 18px;
				span{
					margin-left: 30px;
				}
			}
			
			.content {
				margin-top: 16.5px;
				font-size: 14px;
				font-weight: 500;
				color: rgba(102, 102, 102, 1);
				line-height: 18px;
				overflow: hidden;
				img{
					width: 100%;
				}
			}
		}
	}
</style>
<style lang="less">
	video{
		width: 100%;
		height: 200px;
		background-color: #000;
	}
	img{
		width: 100%;
	}
	strong{
		font-weight: bold;
		span{
			font-weight: bold;
		}
	}
</style>
