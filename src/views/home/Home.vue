<template>
  <div id="home"> 
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']" 
                  @tabClick="tabClick" 
                  ref="tabControl1"
                  class="tab-control"
                  v-show="isTabFixed"
                  />
    <scroll class="content" ref="scroll" 
    :probe-type="3" 
    @scroll="contentScroll"
    :pull-up-load="true" 
    @pullingUp="loadMore"
    > 
    
    <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
    <recommend-view :recommends="recommends" />
    <feature-view/>
    <tab-control :titles="['流行','新款','精选']" 
                  @tabClick="tabClick" 
                  ref="tabControl2"
                  />
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


  import {getHomeMultidata, getHomeGoods} from 'network/home'
  import {debounce} from 'common/utils'
  import {itemListemerMixin, backTopMixin} from 'common/mixin';

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
    },
    mixins: [itemListemerMixin, backTopMixin],
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

        tabOffsetTop: 0,
        isTabFixed: false,

      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY , 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      //1.保存y值
      this.saveY = this.$refs.scroll.getScrollY()

      // 2.离开首页后取消全局事件监听
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    created() {
      //1.请求多个数据
      this.getHomeMultidata()
      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')
      
    },
    mounted() {
      // //3.监听item中图片加载完成
      // //所有的组件都一个属性$el: 用于获取组件中的元素
      // const refresh = debounce(this.$refs.scroll.refresh, 100)

      // // 对监听的事件进行保存
      // this.itemImgListener = () => {
      //   refresh()
      // }
      // //监听并执行刷新
      // this.$bus.$on('itemImageLoad', this.itemImgListener)
      /**见mixin 混入函数中 */
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
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      contentScroll(position){
        // 1.判断BackTop是否显示
        this.listenShoBackTop(position)

        //2.判断tabControl是否吸顶(position：fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
        //2.获取tabControl的offsetTop
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
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
    /* padding-top: 44px; */
    /* 视口高度 */
    height: 100vh;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: white;

    /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
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
  .tab-control{
    position: relative;
    z-index: 9;
  }
  /* .content{
    height: calc(100% - 93px);
    overflow: hidden;
  } */
</style>