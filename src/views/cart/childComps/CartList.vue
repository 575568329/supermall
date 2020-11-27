<template>
  <div class="cart-list" >
    <cart-list-item v-for="(item,index) in cartList" 
    :key="index" 
    :item-info="item" />

  </div>
</template>

<script>
  import CartListItem from './CartListItem.vue'

  import { mapGetters } from 'vuex'



  export default {
    name: "CartList",
    computed: {
      ...mapGetters(['cartList'])
    },
    components: {
        CartListItem 
    },
  }

</script>
<style scoped>
  .cart-list{
    height: 100%
  }
</style>