<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物车</div></nav-bar>
    <tab-control class="tab-control_"
                     :titles="['流行', '新款', '精选']" 
                     @tabClick="tabClick" 
                     ref="tabControl1" v-show="isTabFixed">
    </tab-control>
      <scroll class="content" ref="scroll" 
              :probe-type="3" 
              @scroll="contentScroll"
              :pull-up-load="true"
              @pullingUp="loadMore">
        <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
        <recommend-view :recommends="recommends"></recommend-view>
        <feature-view></feature-view>
        <tab-control class="tab-control"
                     :titles="['流行', '新款', '精选']" 
                     @tabClick="tabClick" 
                     ref="tabControl2">
                     </tab-control>
        <good-list :goods="goods[currentType].list"></good-list>  
      </scroll>
      <!-- 监听原生组件时，必须加上native修饰符才能进行监听 -->
      <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
      <div></div>
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import NavBar from '../../components/common/navbar/NavBar.vue'
import TabControl from '../../components/content/tabControl/TabControl'
import GoodList from '../../components/content/goods/GoodList'
import Scroll from '../../components/common/scroll/Scroll'
import BackTop from '../../components/content/backTop/BackTop'

import {getMultiData, getProductData} from "../../network/home.js"
import {debounce} from "../../common/utils";


  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodList,
      Scroll,
      BackTop,
    },
    //将请求来的数据保存起来
    //函数中的数据在函数调用结束后就会销毁
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 1, list: []},
          'new': {page: 1, list: []},
          'sell': {page: 1, list: []},
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
      }
    },
    activated() {
      this.$refs.scroll.refresh();
      // console.log('actived');
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
    },
    deactivated() {
      // console.log('deactived');
      //1、保存Y值
      this.saveY = this.$refs.scroll.getScrollY();

      // 2、取消全局事件监听
      this.$bus.$off('itemImgLoad', this.itemImgListener);

    },
    created() {
      //1.请求多个数据
      this.getMultiData()

      //2.请求商品数据
      this.getProductData('pop')
      this.getProductData('new')
      this.getProductData('sell')
    },
    mounted () {
    //3.监听item中图片加载完成
    const refresh = () => debounce(this.$refs.scroll.refresh, 50)
      this.$bus.$on('itemImageLoad', () => {
        refresh()
      })

    //获取tabControl的offsetTop
    //$el拿到的是组件的元素
    // this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop
    },
    methods: {    
      //事件监听相关的方法
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0, 800)
      },
      contentScroll(position) {
        //1.判断BackTop是否显示
        this.isShowBackTop = -position.y > 1000 

        //2.决定tabControl是否吸顶
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getProductData(this.currentType)
      },
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },
      //网络请求相关的方法
      getMultiData() {
        getMultiData().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
        })
      },
      getProductData(type) {
        const page = this.goods[type].page + 1;
        getProductData(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    height: 100vh;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: white;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 999;
  }

  .tab-control {
    position: sticky;
    top: 44px;
  }

  .tab-control_ {
    position: relative;
    top: 44px;
    z-index: 6;
  }

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>
