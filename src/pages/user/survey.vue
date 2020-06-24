<template>
	<div class="survey">
		<div class="tabs">
			<div class="item" :class="{active: item.id === tabIndex}" v-for="item of tabs" :key="item.id"
			     @click="tabClick(item.id)">{{item.name}}
			</div>
		</div>
		<div class="list">
			<cube-scroll
				ref="scroll"
				:data="list"
				:options="options">
				<div class="Box" v-for="item of 10" :key="item">
					<div class="box">
						<div class="item">
							<div class="l">
								<span>线上就诊满意度调查表</span>
								<span>2020-04-23</span>
							</div>
							<div class="r">
								<img src="" alt="" @error="$api.defaultImg" :onerror="$api.defaultImg">
							</div>
						</div>
					</div>
				</div>
			</cube-scroll>
		</div>
	</div>
</template>

<script>
	export default {
		name: "survey",
		computed: {
			options() {
				return {
					useTransition: false,
				}
			},
		},
		data() {
			return {
				tabIndex: 0,
				tabs: [
					{name: '满意度调查', id: 0},
					{name: '历史调查', id: 1},
				],
				list: [],
			}
		},
		methods: {
			// tab点击
			tabClick(index) {
				if (index === this.tabIndex) return
				this.tabIndex = index
			}
		},
		created() {
			document.title = '满意度调查'
		}
	}
</script>

<style scoped lang="less">
	.survey {
		height: 100vh;
		
		.tabs {
			background-color: #fff;
			height: 45px;
			display: flex;
			align-items: center;
			justify-content: center;
			
			.item {
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
					bottom: 0;
					left: 50%;
					margin-left: -9px;
				}
			}
		}
		
		.list {
			margin-top: 8px;
			height: calc(100vh - 53px);
			
			.Box {
				width: 345px;
				border-radius: 10px;
				margin: 0  auto;
				margin-bottom: 8px;
				.box {
					padding: 15px;
					background-color: #fff;
					
					.item {
						display: flex;
						align-items: center;
						justify-content: space-between;
						
						.l {
							width: 170px;
							display: flex;
							flex-direction: column;
							justify-content: flex-start;
							align-items: flex-start;
							
							span:nth-child(1) {
								margin-bottom: 15px;
								font-size: 16px;
								font-weight: 500;
								color: rgba(34, 34, 34, 1);
							}
							
							span:nth-child(2) {
								font-size: 13px;
								font-weight: 500;
								color: rgba(153, 153, 153, 1);
								line-height: 23px;
							}
						}
						
						.r {
							width: 44px;
							height: 46px;
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
	}
</style>
