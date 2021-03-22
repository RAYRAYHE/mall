<template>
  <div class="wrapper" ref="aaaa">
    <ul class="content">
      <button @click="btnClick">按钮</button>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
      <li>w</li>
    </ul>
  </div>
</template>

<script>
  import BScroll, { PullUpLoad } from 'better-scroll'

  export default {
    name: "Category",
    data () {
      return {
        scroll: null
      }
    },
    created () {
      
    },
    mounted () {
      this.scroll = new BScroll(document.querySelector('.wrapper'), {
        probeType: 3,
        pullUpLoad: true
      })

      this.scroll.on('pullingUp', () => {
        console.log('上拉加载更多');
        //发送网络请求，请求更多页的数据

        //等数据请求完成，并且将新的数据显示出来后
        setTimeout(() => {
          this.scroll.finishPullUp()
        }, 2000)
      })
    },
    methods: {
      btnClick() {
        console.log(11);
      }
    }
  }
</script>

<style scoped>
  .wrapper {
      height: 200px;
      background-color: pink;
      overflow: hidden;
  }
</style>
