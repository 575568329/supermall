<template>
<!-- ref/children 获取子组件 -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from "better-scroll"

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null,
      }
    },
    mounted() {
      this.scroll = new BScroll(this.$refs.wrapper,{
        click:true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      }) 

      //监听滚动的位置
      //判断是否执行监听
      if (this.probeType ===2 || this.probeType === 3){
      this.scroll.on('scroll',(position) => {
        // console.log(position)
        this.$emit('scroll', position)
      })
      }
      //监听上拉事件,监听scroll滚动到底部
      //判断是否执行监听
      if (this.pullUpLoad){
        this.scroll.on('pullingUp',() => {
        this.$emit('pullingUp')
      })
    }
    },
    methods: {
      scrollTo(x, y, time=300) {
        this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time)
      },
      finishPullUp() {
        this.scroll.finishPullUp()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      getScrollY() {
        return this.scroll ? this.scroll.y : 0
      }
    }
  }

</script>
<style scoped>
</style>