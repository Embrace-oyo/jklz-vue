<template>
	<div class="bannerDetail">
		<div class="box">
			<div class="cont" v-html="html"></div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "bannerDetail",
		data(){
			return {
				html: ''
			}
		},
		methods: {
			getDetail(){
				this.$mask().show()
				this.$api.bannerDetail({id: this.$route.query.id}).then(res => {
					if(res.data.code === 0){
						if(res.data.advertisement.mediaType === 1){
							window.location.href = res.data.advertisement.content
						}else{
							this.html = res.data.advertisement.content
						}
						this.$mask().hide()
					}
				})
			}
		},
		created() {
			document.title = '详情'
			this.getDetail()
		}
	}
</script>

<style scoped lang="less">
.bannerDetail{
	height: 100vh;
	overflow: auto;
	.box{
		padding: 15px;
		overflow: hidden;
		.cont{
			width: 100%;
		}
	}
}
</style>
