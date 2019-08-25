<template>
  <div class="music-detail">
    <div class="detail-content" :style="'background: url('+musicData.pic+'}) no-repeat center;background-size: 100% 100%;'">
      <div class="detail-title">
        <h5>{{ musicData.name }} --- {{ musicData.singer }}</h5>
      </div>
      <div class="detail-lrc">
        <scroll-view class="scroll-view" scroll-y=true :scroll-top="scrollTop" scroll-with-animation=true>
          <div class="item" :class="{ 'active' :  (currentNum - 1) == index && scrollTop }" v-for="(item, index) in lrc" :key="index" :data-time="item[0]" :data-top="item[1] ? index * 60 +'rpx' : ''">
            {{ item[1] }}
          </div>
        </scroll-view> 
      </div>
    </div>
    <div class="detail-bottom" :class="{ 'fix-iphonex-button' : isIphoneX }">
      <div class="detail-pre">上一首</div>
      <div class="detail-play"  @click="audioPlay">
        <img :src="musicData.pic" alt="" class="play-active" :style="isPlay ? 'animation-play-state:running': 'animation-play-state:paused'">
      </div>
      <div class="detail-next">下一首</div>
    </div>
  </div>
</template>

<script>
import Api from '@/utils/api'

export default {
  data () {
    return {
      musicData: {},
      isPlay: true,
      isIphoneX: false,
      lrc: [],
      backgroundAudioManager: null,
      scrollTop: 0,
      scrollData: [],
      currentNum: 5
    }
  },
  onLoad () {
    const that = this
    this.scrollData = []
    wx.getBackgroundAudioPlayerState({
      success (res) {
        const status = res.status
        if (status !== 1) {
          that.isPlay = false
        } else {
          that.isPlay = true
        }
      }
    })
    this.isIphoneX = wx.getStorageSync('isIphoneX')
    this.musicData = wx.getStorageSync('music')
    console.log(wx.getStorageSync('historyMusicId') === this.$mp.query.id)
    if (wx.getStorageSync('historyMusicId') === this.$mp.query.id && this.currentNum !== 5) {
      return
    }
    this.currentNum = 5
    this.scrollTop = 0
    Api._qqLrc(this.musicData.id).then(res => {
      const data = res.data.split('\n')
      const data1 = data.map((item, index) => {
        item = item.split(']')
        return item
      })
      const data2 = data1.map((items, index) => {
        items[0] = items[0].replace(/^\[/g, '').split(':')
        items[0] = items[0][0] * 60 + +items[0][1]
        const obj = {}
        obj.time = items[0]
        obj.scrollTop = items[0] ? index * 60 - 300 : ''
        this.scrollData.push(obj)
        return items
      })
      this.backgroundAudioManager = wx.getBackgroundAudioManager()
      this.backgroundAudioManager.title = this.musicData.name
      this.backgroundAudioManager.epname = this.musicData.name
      this.backgroundAudioManager.singer = this.musicData.singer
      this.backgroundAudioManager.coverImgUrl = this.musicData.pic
      this.backgroundAudioManager.src = this.musicData.url
      this.backgroundAudioManager.onPlay(() => {
        this.isPlay = true
        wx.setStorage({
          key: 'historyMusicId',
          data: this.musicData.id
        })
        this.backgroundAudioManager.onTimeUpdate(() => {
          const currentTime = this.backgroundAudioManager.currentTime
          if (currentTime >= scrollData[this.currentNum].time) {
            this.scrollTop = scrollData[this.currentNum].scrollTop + 'rpx'
            this.currentNum++
          }
        })
      })
      this.backgroundAudioManager.onPause(() => {
        this.isPlay = false
      })
      this.backgroundAudioManager.onEnded(() => {
        this.isPlay = false
      })
      let scrollData = this.scrollData
      this.lrc = data2
    })
  },
  methods: {
    audioPlay (e) {
      if (!this.isPlay) {
        this.backgroundAudioManager.play()
      } else {
        this.backgroundAudioManager.pause()
      }
      this.isPlay = !this.isPlay
    }
  }
}
</script>
<style lang="scss">
page {
  height: 100%;
  background: #fff;
}
.music-detail {
  height: 100%;
  .detail-content {
    height: 100%;
    overflow-y: scroll;
     .detail-title {
      position: relative;
      height: 72rpx;
      top: 60rpx;
      background-color: rgba(245,245,245, 0.6);
      h5 {
        text-align: center;
        line-height: 72rpx;
        font-size: 36rpx;
        background-image:-webkit-linear-gradient(bottom,#000000,#696969,#D3D3D3); 
        -webkit-background-clip:text; 
        -webkit-text-fill-color:transparent;
      }
    }
    .detail-lrc {
      width: 700rpx;
      height: 1000rpx;
      padding-top: 1rpx;
      margin: 76rpx auto;
      border-radius: 20rpx;
      background-color: rgba(245,245,245, 0.6);
      box-shadow: 0 0 10rpx #F0F8FF;
      .scroll-view {
        height: 920rpx;
        margin: 40rpx 0;
        div {
          height: 60rpx;
          padding: 0 30rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
          font-size: 30rpx;
          text-align: center;
          color: rgba(0,0,0,.9);
          line-height: 60rpx;
          transition: all .3s linear;
        }
        .active {
          color: rgba(0,100,0, .9);
          transform: scale(1.1);
        }
      }
    }
  }
  .detail-bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 20rpx 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 0 20rpx #DCDCDC;
    background: rgba(211,211,211, 0.6);
    border-radius: 26%;
    div {
      font-size: 32rpx;
    }
    .detail-pre {
      font-size: 32rpx;
    }
    .detail-play {
      img {
        width: 128rpx;
        height: 128rpx;
        border-radius: 50%;
      }
      .play-active {
        animation: rot 3s linear infinite;
      }
    }
    @keyframes rot {
      0% {
        transform: rotate(0) scale(1);
        box-shadow: 0 0 30rpx #FFA500;
      }
      50% {
        box-shadow: 0 0 20rpx #D2691E;
        transform: rotate(180deg) scale(0.9);
      }
      100% {
         box-shadow: 0 0 30rpx #FFA500;
         transform: rotate(360deg) scale(1);
      }
    }
  }
}
</style>