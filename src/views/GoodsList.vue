<!-- href="javascript:;" -->
<!-- javascript: 是一个伪协议
javascript:是表示在触发<a>默认动作时，执行一段JavaScript代码，而 javascript:; 表示什么都不执行，这样点击<a>时就没有任何反应。

href="javascript:;"就是去掉a标签的默认行为，跟href="javascript:void(0)"是一样的 -->

<template>
	<div>
		<nav-header></nav-header>
		<nav-bread>
			<span>Goods</span>
		</nav-bread>
		<div class="accessory-result-page accessory-page">
			<div class="container">
				<div class="filter-nav">
					<span class="sortby">Sort by:</span>
					<a href="javascript:void(0)" class="default cur">Default</a>
					<a href="javascript:void(0)" class="price" @click="sortGoods">
						Price
						<svg class="icon icon-lower" :class="{'sort-up':!sortFlag}">
							<use xlink:href="#icon-lower"></use>
						</svg>
					</a>
					<a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
				</div>
				<div class="accessory-result">
					<!-- filter -->
					<div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
						<dl class="filter-price">
							<dt>Price:</dt>
							<dd><a href="javascript:void(0)"@click="showAll()" >All</a></dd>
							<dd v-for="(item,index) in priceFilter">
								<a href="javascript:void(0)" @click="setPriceFilter(index)">{{item.startPrice}} - {{item.endPrice}}</a>
							</dd>
						</dl>
					</div>

					<!-- search result accessories list -->
					<div class="accessory-list-wrap">
						<div class="accessory-list col-4">
							<ul>
								<li v-for="(item,index) in goodsList">
									<div class="pic">
										<a href="#"><img v-lazy="'static/'+item.productImage" alt=""></a>
									</div>
									<div class="main">
										<div class="name">{{item.productName}}</div>
										<div class="price">{{item.salePrice}}</div>
										<div class="btn-area">
											<a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
										</div>
									</div>
								</li>
							</ul>
							<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
								<img src="../assets/loading-cubes.svg" v-if="loading" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
		<model :mdShow="mdShow" v-on:close="closeModel">
			<p slot="message">
				请先登陆，否则无法加入购物车!
			</p>
			<div slot="btnGroup">
				<a class="btn btn--m" href="javascript:;" @click="mdShow=false">关闭</a>
			</div>
		</model>
		<model :mdShow="mdShowCart" v-on:close="closeModel">
			<p slot="message">
				<svg class="icon">
					<use xlink:href="#icon-chenggong"></use>
				</svg>
				<span>加入购物车成功!</span>
			</p>
			<div slot="btnGroup">
				<a class="btn btn--m" href="javascript:;" @click="mdShowCart=false">继续购物</a>
				<router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
			</div>
		</model>
		<nav-footer></nav-footer>
	</div>
</template>

<style>
	.icon {
	  width: 1em;
	  height: 1em;
	  vertical-align: -0.15em;
	  fill: currentColor;
	  overflow: hidden;
	}
	.sort-up{
		transform:rotate(180deg);
		transition: all .3s ease-out;
	}
	.icon-lower{
		width: 11px;
		height: 11px;
		transition: all .3s ease-out;
	}
</style>

<script>
	// import './../assets/css/base.css'
	// import './../assets/css/product.css'
	import Model from './../components/Model.vue'
	import NavHeader from '@/components/Header.vue'
	import NavFooter from '@/components/Footer.vue'
	import NavBread from '@/components/Bread.vue'
	import axios from 'axios'
	export default {
		data() {
			return {
				goodsList: [],
				priceFilter: [{
						startPrice: '0.00',
						endPrice: '100.00'
					},
					{
						startPrice: '100.00',
						endPrice: '500.00'
					},
					{
						startPrice: '500.00',
						endPrice: '1000.00'
					},
					{
						startPrice: '1000.00',
						endPrice: '5000.00'
					}
				],
				priceChecked: 'all',
				filterBy: false,
				overLayFlag: false,
				sortFlag: true,
				page: 1,
				pageSize: 8,
				busy: true,
				loading:false,
				mdShow:false,
				mdShowCart:false
			}
		},
		components: {
			NavHeader: NavHeader,
			NavFooter,
			NavBread,
			Model
		},
		mounted() {
			this.getGoodsList();
		},
		methods: {
			// getGoodsList(){
			// 	axios.get("/goods").then((result)=>{
			// 		var res=result.data;
			// 		this.goodsList=res.result;
			// 	});
			// },
			showFilterPop() {
				this.filterBy = true;
				this.overLayFlag = true;
			},
			closePop() {
				this.filterBy = false;
				this.overLayFlag = false;
			},
			getGoodsList(flag) {
				let param = {
					page: this.page,
					pageSize: this.pageSize,
					sort: this.sortFlag ? 1 : -1,
					priceLevel:this.priceChecked
				}
				this.loading=true;
				axios.get("/goods", {
					params: param
				}).then((response) => {
					let res = response.data;
					this.loading=false;
					if (res.status == "0") {
						if(flag){
							this.goodsList =this.goodsList.concat(res.result.list);
							if(res.result.count==0){
								this.busy=true;
							}else{
								this.busy=false;
							}
						}else{
							this.goodsList =res.result.list;
							this.busy=false;
						}
					} else {
						this.goodsList = []
					}
				});
			},
			sortGoods() {
				this.sortFlag = !this.sortFlag;
				this.page = 1;
				this.getGoodsList();
			},
			loadMore() {
				this.busy=true;
				setTimeout(() => {
					this.page++;
					this.getGoodsList(true);
				}, 500);
			},
			setPriceFilter(index){
				this.priceChecked = index;
				this.page = 1;
				this.getGoodsList();
			},
			addCart(productId){
				axios.post("/goods/addCart",{
					productId:productId
				}).then((response)=>{
					let res = response.data;
					if(res.status==0){
						this.mdShowCart=true;
					}else{
						this.mdShow=true;
					}
				});
			},
			showAll(){
				this.priceChecked='all';
				this.page=1;
				this.getGoodsList();
			},
			closeModel(){
				this.mdShow=false;
				this.mdShowCart=false;
			}
		}
	}
</script>
