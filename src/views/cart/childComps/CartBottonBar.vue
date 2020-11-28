<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button 
      :is-checked="isSelectAll" 
      class="check-button"
      @click.native="checkClick"
      />
      <span>全选</span>
      
    </div>
      <div class="price">合计：{{totalPrice}}</div>
      <div class="calculate" @click="calcClick">去计算:{{checkLength}}</div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton.vue'
  import {mapGetters} from 'vuex'
  export default {
  components: { 
    CheckButton
    },
    name: "CartBottonBar",
    computed: {
      ...mapGetters(['cartList']),
      totalPrice(){
        return  this.cartList.filter(item => item.checked
        ).reduce((preValue, item)=> {
          return (preValue + item.price * item.count).toFixed(2)
        },0)
      // totalPrice(){
      // return  this.$store.state.cartList.filter(item => item.checked
      // ).reduce((preValue, item)=> {
      //   return preValue + item.price * item.count
      // },0)
      },
      checkLength(){
      // return console.log(this.$store.state.cartList); 
      return this.cartList.filter(item => item.checked).length
      },
      isSelectAll() {
        if (this.cartList.length === 0) return false
        // return !this.cartList.filter(item => !item.checked).length
        // if (this.cartList.length === 0) return false
        // return !this.cartList.find(item => !item.checked)

        //3.普通遍历
        for (let item of this.cartList) {
          if (!item.checked) {
            return false
          }
        }
        return true
      }
    },
    methods: {
      checkClick(){
      if (this.isSelectAll){
        this.$store.getters.cartList.forEach(item => item.checked = false)
      }else {
        this.$store.getters.cartList.forEach(item => item.checked = true)
      }
      },
      calcClick() {
        if(!this.isSelectAll) {
          this.$toast.show('请选择购买的商品',2000)
        }
      }
    }
  }

</script>
<style scoped>
 .bottom-bar{
  position: relative;
  display: flex;
  height: 40px;
  background-color: #eee;

  width: 100%;

 }
 .check-content{
   height: 40px;
   display: flex;
   align-items: center;
   margin-left: 10px;
 }
 .check-content span{
   font-size: 14px;
 }
 .check-button{
   width: 20px;
   height: 20px;
   margin-right: 5px;
 }
 .price{
   font-size: 14px;
   width: 60%;
   line-height: 40px;
   text-align: center;
 }
 .calculate{
   font-size: 14px;
   position: absolute;
   right: 0px;
   width: 70px;
   line-height: 40px;
   text-align: center;
   background-color: var(--color-tint);
   color: #fff;
 }
</style>