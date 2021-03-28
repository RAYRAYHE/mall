<template>
  <div class="detail">
    <detail-nav-bar @titleClick="titleClick" class="detail-nav" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" 
            :probe-type="3" @scroll="contentScroll">
      <ul>
        <li v-for="item in $store.state.cartList" :key="item.title">
          {{item}}
        </li>
      </ul>
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
      <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
      <good-list :goods="recommends" ref="recommend"/>

      <div>{{$store.state.cartList.length}}</div>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>
<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import Scroll from '../../components/common/scroll/Scroll'
  import GoodList from "../../components/content/goods/GoodList"
  import BackTop from '../../components/content/backTop/BackTop'

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "../../network/detail"
  import {debounce} from "../../common/utils";

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodList,
      DetailBottomBar,
      BackTop
    },
 
    data () {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        isShowBackTop: 0,
        isTabFixed: false,
      }
    },
    created () {
      //1.保存传入的id
      this.iid = this.$route.params.iid
      //2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        const data = res.result
        console.log(data);
        this.topImages = data.itemInfo.topImages

        //3.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        //4.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        //5.保存商品的详情数据
        this.detailInfo = data.detailInfo

        //6.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        //7.取出评论的信息
        if(data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
      })
      getRecommend().then(res => {
        console.log(res);
        this.recommends = res.data.list;
      });
      //给getthemeTopY赋值(进行防抖）
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44);

        // console.log(this.themeTopYs);
      }, 500);
    },
    mounted () {

    },
    methods: {
      imageLoad() {
        this.$refs.scroll.refresh()
      },
      titleClick(index) {
        // console.log(index);
        // scrollTo(x, y, time)
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position) {
        // console.log(position);
        // 获取y值
        const positionY = -position.y

        // positionY和主题中值进行对比
        for(let i = 0; i < this.themeTopYs.length; i++) {
          // if(positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) {
          //   console.log(i);
          // }
          let length = this.themeTopYs.length
          for(let i = 0; i < length; i++) {
            if(this.currentIndex !== i
            && ((i < length - 1 && positionY >= this.themeTopYs[i]
            && positionY < this.themeTopYs[i + 1])
            || (i === length -1 && positionY >= this.themeTopYs[i]))) {
              this.currentIndex = i
              // console.log(this.currentIndex);
              this.$refs.nav.currentIndex = this.currentIndex
            }
          }
        }
        //1.判断BackTop是否显示
        this.isShowBackTop = -position.y > 1000 

        //2.决定tabControl是否吸顶
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0, 800)
      },
      addToCart() {
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.newPrice;
        product.iid = this.iid;
        product.realPrice = this.goods.realPrice;

        //将商品添加到购物车里
        this.$store.dispatch('addCart', product)
      }
    }
  }
</script> 

<style scoped>
  .detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }


  .content {
    height: calc(100% - 44px - 49px);
  }
</style>
