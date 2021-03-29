<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll" 
                    class="check-button" @click.native="checkClick">
      </check-button>
      <span>全选</span>
    </div>

    <div class="price">
      合计: {{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from '../../../components/content/checkButton/CheckButton'

  export default {
    name: "CartBottomBar",
    components: {
      CheckButton
    },
    computed: {
      //计算价格
      totalPrice() {
        return '￥' + this.$store.state.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.realPrice * item.count
        }, 0).toFixed(2)
      },
      checkLength() {
        return this.$store.state.cartList.filter(item => {
          return item.checked
        }).length
      },
      isSelectAll() {
        if(this.$store.state.cartList.length === 0) return false
        return !(this.$store.state.cartList.filter(item => !item.checked).length)
      }
    },
    methods: {
      checkClick() {
        if (this.isSelectAll) {
          this.$store.state.cartList.forEach(item => item.checked = false)
        } else { //部分或全部不选中
          this.$store.state.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick() {
        if (!this.isSelectAll) {
          this.$toast.show('请选择购买的商品', 2000)
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    position: relative;
    height: 40px;
    /* background-color: red; */ 
    line-height: 40px;
    /* bottom: 40px; */
    display: flex;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2);
  }

  .check-content {
    display: flex;
    align-items: center;
    margin-left: 5px;
    width: 60px;
  }

  .check-button {
    width: 18px;
    height: 18px;
    margin-right: 3px;
    line-height: 20px;
  }

  .price {
    margin-left: 20px;
    flex: 1;
  }

  .calculate {
    width: 90px;
    text-align: center;
    background-color: var(--color-high-text);
  }
</style>
