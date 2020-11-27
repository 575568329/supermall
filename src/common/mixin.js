import {debounce} from './utils';
import BackTop from "components/content/back-top/BackTop"

export const itemListemerMixin = {
  data(){
    return {
      itemImgListener: null,
    }
  },
  mounted() {
    //3.监听item中图片加载完成
    //所有的组件都一个属性$el: 用于获取组件中的元素
    const refresh = debounce(this.$refs.scroll.refresh, 100)

    // 对监听的事件进行保存
    this.itemImgListener = () => {
      refresh()
    }
    //监听并执行刷新
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  },

}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return{
      isShowBackTop: false,
    }
  },
  methods: {
    backClick(){
      this.$refs.scroll.scrollTo(0, 0, 300)
    },
    listenShoBackTop(position) {
      //3.是否显示回到顶部
        this.isShowBackTop = (-position.y) > 1000
    }
  }
}