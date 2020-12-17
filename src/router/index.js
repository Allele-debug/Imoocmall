import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from './../views/GoodsList'
import Cart from '@/views/Cart'
import Address from './../views/Address'
import OrderConfirm from './../views/OrderConfirm'

// import Title from '@/views/Title'
// import Image from '@/views/Image'
// import Cart from '@/views/Cart'
Vue.use(Router)

export default new Router({
	mode:'history',
	routes: [
    {
		path: '/',
		name: 'GoodsList',
		component:GoodsList,
		// children:[
		// 	{
		// 		path:'title',
		// 		name:'title',
		// 		component:Title
		// 	}
		// ]
		// components: {
		// 	default:GoodsList,
		// 	title:Title,
		// 	img:Image
		// }
    },
	// {
	// 	path:'/cart/:cartId',
	// 	component:Cart,
	// 	name:'Cart'
	// }
	{
		path:'/cart',
		name:'Cart',
		component:Cart
	},
	{
		path:'/address',
		name:'Address',
		component:Address
	},
	{
		path:'/orderConfirm',
		name:'OrderConfirm',
		component:OrderConfirm
	}
  ]
})
