<template>
  <div class="toast" v-show="isShow">
    <div>{{message}}</div>
  </div>
</template>

<script>
  export default {
    name:"Toast",
    props: {
      // message: {
      //   type:String,
      //   defaned: ''
      // },
      // show: {
      //   type:Boolean,
      //   defaned: false
      // }
    },
    data() {
      return{
        message: '',
        isShow: false
      }
    },
    methods: {
      show(message='默认文字', duration=2000) {
        this.isShow = true;
        this.message = message

        setTimeout(() => {
          this.isShow = false;
          this.message = ''
        },duration)
      }
    }
  }

</script>
<style scoped>
 .toast{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    padding: 8px 10px;
    color: #ffffff;
    background-color: rgba(0,0,0,.35);
    z-index: 999;
 }
</style>