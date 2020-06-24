<template>
	<div class="propaganda">
		<div class="list">
			<div class="noData" v-if="list.length === 0">
				<span>暂无数据~</span>
			</div>
			<cube-scroll
				ref="scroll"
				:data="list"
				@pulling-up="onPullingUp"
				:options="options">
				<ul>
					<router-link tag="div" :to="`/propagandaDetail?articleId=${item.id}`" class="item" v-for="item of list"
					             :key="item.id">
						<div class="l">
							<div class="title">
								{{item.title}}
							</div>
							<div class="subtitle">
								<span>{{item.publishUser}}</span>
								<span>{{getDateDiff(item.createTime)}}</span>
							</div>
						</div>
						<div class="r">
							<img :src="item.cover" alt="" @error="$api.defaultImg" :onerror="$api.defaultImg">
						</div>
					</router-link>
				</ul>
			</cube-scroll>
		</div>
	</div>
</template>

<script>
	export default {
		name: "propaganda",
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
				list: [],
				page: 1,
				limit: 10,
				total: 0,
			}
		},
		methods: {
			// 获取文章列表
			getList(flag = false) {
				if (!flag) this.$mask().show()
				this.$api.articleList({
					page: this.page,
					limit: this.limit,
					hospitalId: this.$route.query.hospitalId
				}).then(res => {
					if (res.data.code === 0) {
						this.list = this.list.concat(res.data.page.list)
						this.total = res.data.page.totalPage
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
		}
		,
		created() {
			document.title = '健康宣教'
			this.getList()
		}
	}
</script>

<style scoped lang="less">
	.propaganda {
		height: 100vh;
		width: 100%;
		
		.list {
			height: 100vh;
			
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
			
			ul {
				padding: 0 15px;
				background-color: #fff;
				
				.item {
					padding: 15px 0;
					border-bottom: 1px solid #ccc;
					display: flex;
					align-items: flex-start;
					justify-content: space-between;
					
					.l {
						width: 207px;
						height: 87px;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.title {
							width: 100%;
							font-size: 16px;
							font-weight: 500;
							color: rgba(34, 34, 34, 1);
							margin-bottom: 34.5px;
							line-height: 1.2;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}
						
						.subtitle {
							font-size: 12px;
							font-weight: 500;
							color: rgba(153, 153, 153, 1);
							display: flex;
							align-items: flex-start;
							justify-content: space-between;
							
							span:first-child {
								display: block;
								line-height: 1.2;
							}
						}
					}
					
					.r {
						width: 116px;
						height: 87px;
						border-radius: 5px;
						overflow: hidden;
						
						img {
							width: 100%;
							height: 100%;
						}
					}
				}
			}
		}
	}
</style>
