<template>
  <div class="index">
    <h4>排行榜</h4>
    <ul>
      <li v-for="(item, index) in list" :key="index" @click="goPage(item)">
        <img :src="item.pic" alt="">
        <dl>
          <dt>{{item.name}}</dt>
          <dd>{{item.singer}}</dd>
        </dl>
      </li>
    </ul>
  </div>
</template>

<script>
import Api from '@/utils/api'

export default {
  data () {
    return {
      list: []
    }
  },
  onLoad () {
    Api._qqTopList().then(res => {
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
        url: `/pages/musicDetail/main`
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .index {
    background-color: #ececec;
    h4 {
      color: #000;
    }
    ul {
      li {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-bottom: 20rpx;
        padding: 20rpx 0;
        background-color: #fff;
        img {
          width: 120rpx;
          height:160rpx;
          border-radius: 10rpx;
        }
        dl {
          width: 380rpx;
        }
      }
    }
  }
</style>
