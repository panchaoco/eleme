<template>
    <div class="cartcontrol">
      <transition name="move">
        <div class="cart-decrease " v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
          <span class="inner icon-remove_circle_outline"></span>
        </div>
      </transition>
      <div class="cart-count" v-show="food.count>0">{{ food.count }}</div>
      <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
    </div>
</template>

<script>
  import Vue from 'vue';
  export default {
    props: ['food'],
    methods: {
      addCart (event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          // 因为js特性无法检测到一个对象新增了属性从而给出反应，所以vue提供的了set方法，可以设置
          Vue.set(this.food, 'count', 1);
          this.food.count = 1;
        } else {
          this.food.count++;
        }
      },
      decreaseCart (event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px
      &.move-enter-active, &.move-leave-active
        transition: all 0.4s linear
      &.move-enter, &.move-leave-to
        opacity: 0
        transform: translate3D(24px, 0, 0)
        .inner
          transform: rotate(270deg)
      .inner
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 200)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 200)
</style>
