<template>
  <div class="my-info">
    <ul>
      <li>
        <img :src="info.avatarUrl" alt="">
        <dl>
          <dt>
            {{info.nickName}}
          </dt>
          <dd>
            {{info.province}}-{{info.city}}
          </dd>
        </dl>
      </li>
      <li @click="goPage('disclaimer')">
        <span class="iconfont">&#xe87d;</span>
        <div>
          免责声明
        </div>
      </li>
    </ul>
    <div class="mask" v-if="isShowMask">
      <button open-type="getUserInfo" lang="zh_CN" @getuserinfo="getuserinfo">授权登录</button>
    </div>
  </div>
</template>

<script>
// Use Vuex

export default {
  data () {
    return {
      info: {
        nickName: '趣善帮',
        avatarUrl: '',
        province: '北京市',
        city: '西城区'
      },
      isShowMask: true
    }
  },
  onShow () {
    this.info.avatarUrl = ['../../static/tabs/q.png', '../../static/tabs/s.png', '../../static/tabs/b.png'][parseInt(Math.random() * 3)]
    if (wx.getStorageSync('myinfo')) {
      this.info = wx.getStorageSync('myinfo')
      this.isShowMask = false
    }
  },
  methods: {
    getuserinfo (e) {
      console.log(e.target.userInfo)
      if (!e.target.userInfo) {
        return
      }
      this.isShowMask = false
      this.info = e.target.userInfo
      wx.setStorage({
        key: 'myinfo',
        data: e.target.userInfo
      })
    },
    goPage (path) {
      wx.navigateTo({
        url: `/pages/${path}/main`
      })
    }
  }
}
</script>

<style lang="scss">
page {
  background-color: #ececec;
  height: 100%;
}
.my-info {
  ul {
    li {
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding: 20rpx 40rpx;
      margin-bottom: 20rpx;
      background-color: #fff;
      img {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
      }
      span {
        font-size: 80rpx;
      }
      div {
        padding: 0 30rpx;
        font-size: 36rpx;
        line-height: 94rpx;
      }
      dl {
        padding: 15rpx 30rpx;
        text-align: right;
        dt {
          margin-bottom: 10rpx;
          font-size: 36rpx;
        }
        dd {
          font-size: 30rpx;
        }
      }
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
