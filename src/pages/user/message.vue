<template>
	<div class="message">
		<div class="tabs">
			<div class="item" :class="{active: item.id === tabIndex}" v-for="item of tabs" :key="item.id"
			     @click="tabClick(item.id)">{{item.name}}
			</div>
		</div>
		<div class="list">
			<cube-scroll
				ref="scroll"
				:data="list"
				@pulling-up="onPullingUp"
				:options="options">
				<router-link tag="div" :to="`/messageDetail?type=${tabIndex}&data=${encodeURIComponent(JSON.stringify(item))}`" class="item" v-for="item of list" :key="item.id">
					<div class="box" v-if="tabIndex === 0">
						<div class="l">
							<span>{{item.title}}</span>
							<span>姓名：{{item.content.name}}</span>
							<span>医院：{{item.content.hisHospitalName}}</span>
							<span>科室：{{item.content.departName}}</span>
						</div>
						<div class="r">{{item.creatTime}}</div>
						<div class="dot" v-if="item.isRead === 0"></div>
					</div>
					<div class="Box" v-if="tabIndex === 1">
						<span>{{item.title}}</span>
						<span>{{item.createTime}}</span>
						<span class="txt">{{item.html}}</span>
						<div class="dot" v-if="item.isRead === 0"></div>
					</div>
				</router-link>
			</cube-scroll>
		</div>
	</div>
</template>

<script>
	export default {
		name: "message",
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
				tabIndex: 0,
				tabs: [
					{name: '就医消息', id: 0},
					{name: '消息公告', id: 1},
				],
				list: [],
				page: 1,
				limit: 10,
				total: 0
			}
		},
		methods: {
			// tab点击
			tabClick(index) {
				if (index === this.tabIndex) return
				this.tabIndex = index
				this.list = []
				this.page = 1
				this.$refs.scroll.scrollTo(0, 0)
				if(this.tabIndex === 0){
					this.limit = 10
					this.getListOne()
				}else{
					this.limit = 100
					this.getListTwo()
				}
			},
			// 就医消息获取
			getListOne(flag = false) {
				if(!flag) this.$mask().show()
				let params = {
					page: this.page,
					limit: this.limit,
					patientId: this.$route.query.patientId
				}
				this.$api.informationList(params).then(res => {
					if (res.data.code === 0) {
						res.data.page.list.map(x => {
							x.content = JSON.parse(x.content)
						})
						this.list = this.list.concat(res.data.page.list)
						this.total = res.data.page.totalPage
						this.$mask().hide()
					}
				})
			},
			// 消息公告获取
			getListTwo(flag = false){
				if(!flag) this.$mask().show()
				let reg = /<[^>]+>/g
				let reg2 = /&nbsp;/g
				this.$api.notice().then(res => {
					if(res.data.code === 0){
						res.data.list.map(x => {
							let str = x.content.replace(reg, '')
							let str1 = str.replace(reg2, '')
							x.html = str1
						})
						this.list = this.list.concat(res.data.list)
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
				this.tabIndex === 0 ? this.getListOne(true) : this.$refs.scroll.forceUpdate()
			},
		},
		created() {
			document.title = '消息中心'
			this.getListOne()
		}
	}
</script>

<style scoped lang="less">
	.message {
		height: 100vh;
		
		.tabs {
			background-color: #fff;
			height: 45px;
			display: flex;
			align-items: center;
			justify-content: center;
			
			.item {
				width: 75px;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 14px;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
				margin: 0 43px;
			}
			
			.active {
				color: rgba(29, 144, 255, 1);
				font-size: 16px;
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				
				&:after {
					content: '';
					position: absolute;
					width: 18px;
					height: 2px;
					background: rgba(29, 144, 255, 1);
					border-radius: 2px;
					left: 50%;
					margin-left: -9px;
					bottom: 0;
				}
			}
		}
		
		.list {
			margin-top: 8px;
			height: calc(100vh - 53px);
			
			.item {
				padding: 15px;
				background-color: #fff;
				margin-bottom: 8px;
				
				.box {
					position: relative;
					display: flex;
					align-items: flex-start;
					justify-content: space-between;
					
					.l {
						font-size: 13px;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
						display: flex;
						align-items: flex-start;
						justify-content: flex-start;
						flex-direction: column;
						
						span {
							margin-bottom: 7.5px;
						}
						
						span:nth-child(1) {
							font-size: 16px;
							font-weight: 500;
							color: rgba(34, 34, 34, 1);
							margin-bottom: 15px;
						}
					}
					
					.r {
						margin-top: 30px;
						font-size: 12px;
						font-weight: 500;
						color: rgba(153, 153, 153, 1);
						line-height: 23px;
					}
					
					.dot {
						position: absolute;
						right: 0;
						top: 0;
						width: 8px;
						height: 8px;
						border-radius: 50%;
						background-color: #FF3C1C;
					}
				}
				
				.Box {
					display: flex;
					align-items: flex-start;
					justify-content: flex-start;
					flex-direction: column;
					position: relative;
					
					span:nth-child(1) {
						font-size: 16px;
						font-weight: 500;
						color: rgba(34, 34, 34, 1);
						margin-bottom: 15px;
					}
					
					span:nth-child(2) {
						font-size: 13px;
						font-weight: 500;
						color: rgba(153, 153, 153, 1);
						line-height: 23px;
						margin-bottom: 10px;
					}
					
					span:nth-child(3) {
						font-size: 13px;
						font-weight: 500;
						color: rgba(102, 102, 102, 1);
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						width: 100%;
						line-height: 1.5;
					}
					
					.dot {
						position: absolute;
						right: 0;
						top: 0;
						width: 8px;
						height: 8px;
						border-radius: 50%;
						background-color: #FF3C1C;
					}
				}
			}
		}
	}
</style>
