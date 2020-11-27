<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
    <detail-swiper :top-images="topImages" />
    <detail-base-info :goods="goods"/>
    <detail-shop-info :shop="shop"/>
    <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
    <detail-param-info ref="param" :param-info="paramInfo"/>
    <detail-comment-info ref="comment" :comment-info="commentInfo"/>
    <goods-list ref="recommend" :goods="recommends"/>

    
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <detail-bottom-bar @addCart="addToCart"/>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar';
  import DetailSwiper from './childComps/DetailSwiper.vue';
  import DetailBaseInfo from './childComps/DetailBaseInfo';
  import DetailShopInfo from './childComps/DetailShopInfo.vue';
  import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue';
  import DetailParamInfo from './childComps/DetailParamInfo.vue';
  import DetailCommentInfo from './childComps/DetailCommentInfo.vue';
  import DetailBottomBar from './childComps/DetailBottomBar.vue';
  import BackTop from '../../components/content/back-top/BackTop.vue';
  
  import Scroll from '../../components/common/scroll/Scroll.vue';
  import GoodsList from '../../components/content/goods/GoodsList.vue';

  import {getDetail, Goods, Shop, GoodsParam, getRecomment} from 'network/ditail';
  import {debounce} from 'common/utils';
  import {itemListemerMixin, backTopMixin} from 'common/mixin';


  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,      

    },
    mixins: [itemListemerMixin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop:{},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [], 
        currentIndex: 0,
      }
    },
    created() {
      //1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求数据
      getDetail(this.iid).then(res => {
        //1.获取顶部的图片轮播数据
        const data = res.result;
        this.topImages = res.result.itemInfo.topImages

        //2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        //3.创建店铺信息对象
        this.shop = new Shop(data.shopInfo)

        //4.保存商品的详情数据
        this.detailInfo = data.detailInfo

        //5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        //6.取出评论信息
        if(data.rate.cRate !==0){
          this.commentInfo = data.rate.list[0]
        }

        // this.$nextTick(() => {
        //   //更具最新的数据，对应的DOM时i经被渲染出来
        //   //但是图片依然是没有加载完（目前获取到offsetTop不包含其中的图片）。
        //   // offsetTop值不对的时候，都是因为图片的问题
        //   this.themeTopYs = []

        //   this.themeTopYs.push(0);
        //   this.themeTopYs.push(this.$refs.param.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        //   console.log(this.themeTopYs);
        // })
      })

      //3.请求推荐数据
      getRecomment().then(res => {
        this.recommends = res.data.list
      })
    },
    methods: {
      imageLoad() {
        // this.$refs.scroll.refresh()

        this.themeTopYs = []

        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.param.$el.offsetTop - 44)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44)
        // 向数组中传入一个最大值
        this.themeTopYs.push(Number.MAX_VALUE)
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300)
      },
      contentScroll(position) {
        //1.获取postionY值
        const positionY = -position.y

        //2.positionY和主题中的值进行对比
        let length = this.themeTopYs.length
        for(let i = 0; i < length-1; i++) {
          // if(positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]){
          //   console.log(i)
          // }

          if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex
          }

          // if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length -1 && positionY >= this.themeTopYs[i]))){
          //   this.currentIndex = i;
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }

          //3.是否显示回到顶部
          this.listenShoBackTop(position)
        }
      },
      addToCart() {
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        // 2.将商品添加到购物车里
        // this.$store.cartList.push(product)
        // this.$store.commit('addCart',product)
        this.$store.dispatch('addCart', product)
      }


    },
    destroyed(){
      this.$bus.$off('itemImageLoad', this.itemImgListener)
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
    
  }

</script>
<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px - 49px);
    overflow: hidden;
  }
  
</style>