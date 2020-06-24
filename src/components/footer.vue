<template>
	<div class="pageFooter">
		<router-link class="item" tag="div" to="/">
			<img v-if="pageWitch === 0" src="~@/assets/images/tabs/icon_sy1.png" alt="">
			<img v-if="pageWitch !== 0" src="~@/assets/images/tabs/icon_sy2.png" alt="">
			<span :class="{blue: pageWitch === 0}">首页</span>
		</router-link>
		<router-link class="item" tag="div" to="/user">
			<img v-if="pageWitch === 1" src="~@/assets/images/tabs/icon_wd2.png" alt="">
			<img v-if="pageWitch !== 1" src="~@/assets/images/tabs/icon_wd1.png" alt="">
			<span :class="{blue: pageWitch === 1}">我的</span>
		</router-link>
	</div>
</template>

<script>
	export default {
		name: "pageFooter",
		props: ['curPath'],
		watch: {
			curPath(val) {
				this.path = val
				this.checkIcon(this.path)
			}
		},
		data() {
			return {
				path: '/',
				pageWitch: 0,
			}
		},
		methods: {
			checkIcon(path) {
				if (path === '/') {
					this.pageWitch = 0
				} else if (path === '/user') {
					this.pageWitch = 1
				}
			}
		},
		created() {
			let path = this.$route.path
			this.path = path
			this.checkIcon(path)
		}
	}
</script>

<style scoped lang="less">
	.pageFooter {
		width: 100%;
		height: 59px;
		background: rgba(250, 250, 252, 1);
		position: absolute;
		left: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: space-around;
		
		.item {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			
			img {
				width: 25px;
				height: 25px;
			}
			
			span {
				margin-top: 4px;
				font-size: 10px;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
			}
			
			.blue {
				color: #1D90FF;
			}
		}
	}
</style>
