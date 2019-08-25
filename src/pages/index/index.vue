<template>
  <div class="index">
    <h4>{{ title }}</h4>
    <ul>
      <li v-for="(item, index) in list" :key="index" @click="goPage(item)">
        <img :src="item.pic" alt="" lazy-load="static/tabs/s.png">
        <dl>
          <dt>{{item.name}}&nbsp;&nbsp;{{item.singer}}</dt>
        </dl>
        <div>
          <em></em>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Api from '@/utils/api'

export default {
  data () {
    return {
      list: [],
      title: ''
    }
  },
  onLoad () {
    this.title = {
      3: '欧美榜',
      4: '流行指数榜',
      5: '内地榜',
      26: '热歌榜',
      27: '新歌榜',
      28: '网路歌曲榜',
      36: 'K歌金曲榜',
      57: '电音榜',
      60: '抖音榜'
    }[this.$mp.query.id]
    Api._qqTopList(this.$mp.query.id).then(res => {
      const { code, data, msg } = res.data
      if (code === 200) {
        this.list = data
      } else {
        console.log(msg)
      }
    })
  },
  methods: {
    goPage (item) {
      wx.setStorage({
        key: 'music',
        data: item
      })
      wx.navigateTo({
        url: `/pages/musicDetail/main?id=${item.id}`
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .index {
    background-color: #ececec;
    padding-top: 1rpx;
    h4 {
      color: #000;
      font-size: 40rpx;
      padding: 10rpx;
      text-align: center;
      margin: 10rpx auto;
      border-radius: 8rpx;
      background-color: rgba(64,224,208, .8);
    }
    ul {
      li {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-bottom: 10rpx;
        padding: 20rpx 0;
        background-color: #fff;
        box-shadow: 0 4rpx 4rpx #C0C0C0;
        img {
          width: 120rpx;
          height:120rpx;
          border-radius: 10rpx;
        }
        dl {
          width: 380rpx;
        }
        div {
          position: relative;
          width: 120rpx;
          height: 120rpx;
          em {
            position: absolute;
            display: block;
            width: 70rpx;
            height: 16rpx;
            border-radius: 16rpx;
            background-color: #F5F5F5;
            transform: rotate(40deg);
            top: 34rpx;
            left: 30rpx;
          }
        }
        div:after {
          position: absolute;
          content: '';
          display: block;
          height: 16rpx;
          width: 70rpx;
          background-color: #F5F5F5;
          left: 30rpx;
          top: 78rpx;
          border-radius: 16rpx;
          transform: rotate(140deg);
        }
        div:before {
          position: absolute;
          content: '';
          display: block;
          height: 16rpx;
          width: 90rpx;
          left: -10rpx;
          top: 58rpx;
          background-color: #F5F5F5;
          border-radius: 16rpx;
          transform: rotate(90deg);
        }
      }
    }
  }
</style>
