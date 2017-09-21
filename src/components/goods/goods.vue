<template>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item, index) in goods" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index, $event)">
            <span class="text border-1px">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
              {{ item.name }}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="item in goods" class="foods-list food-list-hook">
            <h1 class="title">{{ item.name }}</h1>
            <ul>
              <li v-for="food in item.foods" @click="selectFood(food, $event)" class="food-item border-1px">
                <div class="icon">
                  <img :src="food.icon" width="57" height="57" alt="">
                </div>
                <div class="content">
                  <h2 class="name">{{ food.name }}</h2>
                  <p class="desc">{{ food.description }}</p>
                  <div class="extra">
                    <span class="count">月售{{ food.sellCount }}份</span><span>好评率{{ food.rating }}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{ food.price }}</span><span class="old" v-show="food.oldPrice">￥{{ food.oldPrice }}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food" :element.sync="element"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
      <food :food="selectedFood" ref="food"></food>
    </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';
  import { mapState } from 'vuex';

  const ERR_OK = 0;
  export default {
    // 将seller数据传递过来
    props: {
      seller: {
        type: Object
      }
    },
    /**
     * @param 初始化一些数据
     * @returns {{goods: Array, listHeight: Array, scrollY: number}}
     * @goods 商品列表
     * @listHeight 右侧商品区域个数
     * @scrollY 监听滚动的Y轴
     */
    data () {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {},
        element: null,
      };
    },
    watch: {
      'element' () {
        this.element = this.$store.state.ballDom;
        this._drop(this.element);
        this.element = null;
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      });
    },
    /**
     * @param 计算器属性
     * @currentIndex 返回滚动的区域索引
     */
    computed: {
      currentIndex () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          // 如有有height2或者滚动的Y轴大于上一个的height并且小于下一个height
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods () {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      },
      ...mapState({
        ele (state) {
          console.log(state);
        }
      })
    },
    /**
     * @param 事件处理器
     * @selectMenu 点击左侧菜单右侧列表滚动到响应位置
     * @_initScroll 初始化滚动
     */
    methods: {
      /**
       * @selectMenu
       * @param index 索引值
       * @param event vue--@click事件传递过来的$event
       */
       selectMenu (index, event) {
             // vue事件私有的_contructed,因为在PC端better没有禁止掉click事件，所以点击会响应两次，判断到若没有_contructed，就return
         if (!event._constructed) {
           return;
         }
         let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
         let el = foodList[index];
         this.foodsScroll.scrollToElement(el, 300);
       },
      _drop (target) {
        /* 体验优化，异步执行下落动画 */
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      },
      _initScroll () {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          // 因为better-scoll库里面监听的click事件，所以直接调用click事件会没有响应，此处需要设置click为true
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3
        });
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight () {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      selectFood (food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$nextTick(() => {
          this.$refs.food.show();
        });
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        line-height: 14px
        padding: 0 12px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          .text
            font-weight: 700
            border-none();
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height:12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          font-size: 12px
          border-1px(rgba(7, 17, 27, 0.1))

    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px;
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0px
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            margin-bottom: 8px
            line-height: 12px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 20px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20);
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0px
            bottom: 12px











</style>
