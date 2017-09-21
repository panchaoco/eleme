import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const ALL = 2;
const onlyContent = true;
// 将所有要检测的属性列入state，为了代码的直观，再加各自要调用的组件里面动态传入这些属性
const state = {
  ballDom: null,
  selectType: ALL,
  onlyContent: onlyContent // onlyContent在组件food里面传入了
};

const mutations = {
  changeSelectType (state, type) {
    state.selectType = type;
  },
  changeOnlyContent (state, fs) {
    state.onlyContent = fs;
  },
  selectBallDom (state, dom, callback) {
    if (dom !== 0) {
      state.ballDom = dom;
    }
    if (typeof callback === 'function') {
      callback();
    }
  }
};
export default new Vuex.Store({
  state,
  mutations
});
