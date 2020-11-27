<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button"/>
      <span>全选</span>
    </div>

    <div>合计：{{totalPrice}}</div>

  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton.vue'

  export default {
  components: { 
    CheckButton
    },
    name: "CartBottonBar",
    computed: {
      totalPrice(){
        return  this.$store.state.cartList.filter(item => item.checked
        ).reduce((preValue, item)=> {
          return preValue + item.price * item.count
        },0)
      // totalPrice(){
      // return  this.$store.state.cartList.filter(item => item.checked
      // ).reduce((preValue, item)=> {
      //   return preValue + item.price * item.count
      // },0)
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
</style>