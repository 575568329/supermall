<template>
  <div class="cart">
    <nav-bar class="nva-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>

    <!-- 商品的列表 -->
    <scroll class="content" ref="scroll">
    <cart-list></cart-list>
    </scroll>

    <!-- 底部汇总 -->
    <cart-botton-bar/>

  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar.vue'
  import CartList from './childComps/CartList.vue'
  import Scroll from '../../components/common/scroll/Scroll.vue'
  import CartBottonBar from './childComps/CartBottonBar.vue'

  import { mapGetters } from 'vuex'




  export default {
    name: "Cart",
    components: { 
    NavBar,
    CartList,
    Scroll,
    CartBottonBar, 
    },
    computed: {
      //两种语法
      //...mapGetters(['cartaLength', 'cartList'])
      ...mapGetters({
        length: 'cartaLength',
      })
      },
    activated() {
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>
  .cart{
    height: 100vh;
  }
  .nva-bar{
    background-color: var( --color-tint);
    color: #fff;
  }
  .content {
    height: calc(100% - 44px - 49px - 40px);
    overflow: hidden;
  }
</style>
