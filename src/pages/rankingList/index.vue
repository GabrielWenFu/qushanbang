<template>
  <div class="ranking-list">
    <h5>排行榜</h5>
    <ul>
      <li v-for="(item, index) in rankingList" :key="index" @click="goPage(item)">
        {{item.name}}
      </li>
    </ul>
    <div class="mask" v-if="isShowMask">
      <button open-type="getUserInfo" lang="zh_CN" @getuserinfo="getuserinfo">授权登录</button>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      rankingList: [{
        name: '流行指数榜',
        id: 4
      }, {
        name: '热歌榜',
        id: 26
      }, {
        name: '新歌榜',
        id: 27
      }, {
        name: '内地榜',
        id: 5
      }, {
        name: '欧美榜',
        id: 3
      }, {
        name: '抖音榜',
        id: 60
      }, {
        name: '网路歌曲榜',
        id: 28
      }, {
        name: 'K歌金曲榜',
        id: 28
      }, {
        name: '电音榜',
        id: 57
      }],
      isShowMask: true
    }
  },
  onShow () {
    if (wx.getStorageSync('myinfo')) {
      this.isShowMask = false
    }
  },
  methods: {
    goPage (item) {
      wx.navigateTo({
        url: `/pages/index/main?id=${item.id}`
      })
    },
    getuserinfo (e) {
      if (!e.target.userInfo) {
        return
      }
      this.isShowMask = false
      wx.setStorage({
        key: 'myinfo',
        data: e.target.userInfo
      })
    }
  }
}
</script>
<style lang="scss">
  .ranking-list {
    h5 {
      font-size: 40rpx;
      color: #000;
      text-align: center;
      margin-bottom: 20rpx;
    }
    ul {
      li {
        font-size: 36rpx;
        padding: 0 40rpx;
        color: #000;
        line-height: 80rpx;
        border-bottom: 2rpx solid #eee;
      }
    }
    .mask {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(192,192,192, 0.3);
      animation: mask .3s linear;
      button {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -120rpx;
        margin-top: -50rpx;
        width: 260rpx;
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 100rpx;
        background-color: #00FF00;
      }
    }
    @keyframes mask {
      0% {
        transform: scale(0.8);
        border-radius: 100%;
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
        border-radius: 0;
      }
    }
  }
</style>