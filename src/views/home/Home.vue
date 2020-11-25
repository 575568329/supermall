<template>
  <div id="home"> 
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <scroll class="content" ref="scroll" 
    :probe-type="3" 
    @scroll="contentScroll"
    :pull-up-load="true" 
    @pullingUp="loadMore"
    >
    <home-swiper :banners="banners"/>
    <recommend-view :recommends="recommends" />
    <feature-view/>
    <tab-control class="tab-control" 
                  :titles="['流行','新款','精选']" 
                  @tabClick="tabClick" />
    <!-- ['pop'] 可以写成 goods.pop.list吗，有什么区别。 -->
    <goods-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>  
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from "components/content/goods/GoodsList"
  import Scroll from "components/common/scroll/Scroll"
  import BackTop from "components/content/back-top/BackTop"

  import {getHomeMultidata, getHomeGoods} from 'network/home'

  export default {
    name:"Home",
    components:{
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods:{
          'pop': {page: 0,list: []},
          'new': {page: 0,list: []},
          'sell': {page: 0,list: []}
        },
        currentType : 'pop',
        isShowBackTop: false
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    created() {
      //1.请求多个数据
      this.getHomeMultidata()
      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
    },
    methods: {
      /**
       * 事件监听相关
       */  
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
        }
      },
      backClick(){
        this.$refs.scroll.scrollTo(0, 0,)
      },
      contentScroll(position){
        this.isShowBackTop = (-position.y) > 1000
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
      },


      /**
       * 网络请求相关
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
        // this.result = res;
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1 
        getHomeGoods(type, page).then(res => {
          //这里的...是将res.data.list这个数组中的数据分解成类似1，2，3，4然后一个一个push进list
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1 

          this.$refs.scroll.finishPullUp()
      })
      }
    }
  }

</script>
<style scoped>
  #home{
    padding-top: 44px;
    /* 视口高度 */
    height: 100vh;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: white;

    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }
  .tab-control {
    position: sticky;
    top: 44px;
    z-index: 9;
  }
  .content {
    /* height: 300px; */
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  /* .content{
    height: calc(100% - 93px);
    overflow: hidden;
  } */
</style>