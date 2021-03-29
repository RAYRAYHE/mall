<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <!-- <li v-for="item in cartList" :key="item.title">{{item}}</li> -->
      <cart-list-item v-for="(item, index) in cartList"
                      :key="index"
                      :product="item">
      </cart-list-item>
    </scroll>   
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Scroll from '../../../components/common/scroll/Scroll'
  import CartListItem from "./CartListItem"

  export default {
    name: "CartList",
    components: {
      Scroll,
      CartListItem   
    },
    computed: {
      ...mapGetters(['cartList'])
    },
    activated () {
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>
  .cart-list {
    position: relative;
  }

  .content {
    height: calc(100vh - 44px - 49px - 40px);
    overflow-y: hidden;
  }
</style>
