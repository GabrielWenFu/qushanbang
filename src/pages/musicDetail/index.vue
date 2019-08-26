<template>
  <div class="music-detail">
    <div class="detail-content" :style="'background: url('+musicData.pic+'}) no-repeat center;background-size: 100% 100%;'">
      <div class="detail-title">
        <h5>{{ musicData.name }} --- {{ musicData.singer }}</h5>
      </div>
      <div class="detail-lrc" :style="isIphoneX ? 'top: 150rpx;' : ''">
        <div class="scroll-current">
          <div>---</div>
          <div @click="selectPlay">{{ selectTime }}</div>
        </div>
        <scroll-view id="scroll" class="scroll-view" scroll-y=true @scroll="scroll" :scroll-top="scrollTop" scroll-with-animation=true>
          <div class="scroll-content" id="content">
            <div class="item" :class="{ 'active' :  (currentNum - 1) == index && scrollTop }" v-for="(item, index) in lrc" :key="index" :data-time="item[0]" :data-top="(index + 1) * 60" :data-index="index">
              {{ item[1] }}
            </div>
          </div>
        </scroll-view> 
      </div>
    </div>
    <div class="detail-bottom" :class="{ 'fix-iphonex-button' : isIphoneX }">
      <div class="detail-pre" @click="pre">上一首</div>
      <div class="detail-play"  @click="audioPlay">
        <img :src="musicData.pic" alt="" class="play-active" :style="isPlay ? 'animation-play-state:running': 'animation-play-state:paused'">
      </div>
      <div class="detail-next" @click="next">下一首</div>
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
      currentNum: 5,
      list: [],
      index: 0,
      selectTime: 0,
      scrollEleHeight: null,
      contentEleHeight: null
    }
  },
  onReady () {
    const that = this
    const query = wx.createSelectorQuery()
    query.select('#scroll').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log(res)
      that.scrollEleHeight = res[0].height
    })
    setTimeout(() => {
      const queryContent = wx.createSelectorQuery()
      queryContent.selectViewport().scrollOffset()
      queryContent.select('#content').boundingClientRect()
      queryContent.exec(function (res) {
        that.contentEleHeight = res[1].height
      })
    }, 500)
  },
  onShow () {
    this.index = +this.$mp.query.index
    this.list = wx.getStorageSync('musiclist')
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
    if (wx.getStorageSync('historyMusicId') === this.$mp.query.id && this.currentNum !== 5) {
      return
    }
    this.backgroundAudio()
  },
  methods: {
    scroll (e) {
      const selectTopB = e.target.scrollTop
      const scrollData = this.scrollData
      const item = this.contentEleHeight / (scrollData.length + 5)
      const y = selectTopB % +item
      let z = parseInt(selectTopB / item) + 5
      if (y > 0) {
        z++
      }
      this.selectTime = scrollData[z].time + 's'
    },
    selectPlay () {

    },
    audioPlay (e) {
      if (!this.isPlay) {
        this.backgroundAudioManager.play()
      } else {
        this.backgroundAudioManager.pause()
      }
      this.isPlay = !this.isPlay
    },
    pre () {
      if (this.index === 0) return
      const index = (this.index - 1) >= 0 ? this.index - 1 : 0
      this.index = index
      this.musicData = this.list[index]
      wx.setStorage({
        key: 'music',
        data: this.list[index]
      })
      this.backgroundAudio()
    },
    next () {
      if (this.index === this.list.length - 1) return
      const index = (this.index + 1) <= this.list.length - 1 ? this.index + 1 : this.list.length - 1
      this.index = index
      this.musicData = this.list[index]
      wx.setStorage({
        key: 'music',
        data: this.list[index]
      })
      this.backgroundAudio()
    },
    backgroundAudio () {
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
          items[0] = (items[0][0] * 60 + +items[0][1]).toFixed(2)
          const obj = {}
          obj.time = items[0]
          obj.scrollTop = items[0] ? index * 60 - 300 : ''
          this.scrollData.push(obj)
          return items
        })
        // this.selectTime = this.scrollData[5].time + 's'
        let scrollData = this.scrollData
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
            if (!scrollData[this.currentNum].time) {
              return
            }
            const currentTime = this.backgroundAudioManager.currentTime
            if (currentTime >= scrollData[this.currentNum].time) {
              this.scrollTop = scrollData[this.currentNum].scrollTop + 'rpx'
              this.currentNum++
            }
          })
        })
        this.backgroundAudioManager.onPrev(() => {
          this.pre()
        })
        this.backgroundAudioManager.onNext(() => {
          this.next()
        })
        this.backgroundAudioManager.onPause(() => {
          this.isPlay = false
        })
        this.backgroundAudioManager.onEnded(() => {
          this.backgroundAudioManager.stop()
          this.next()
          this.isPlay = false
        })
        this.lrc = data2
      })
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
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
        background-image:-webkit-linear-gradient(bottom,#000000,#696969,#D3D3D3); 
        -webkit-background-clip:text; 
        -webkit-text-fill-color:transparent;
      }
    }
    .detail-lrc {
      width: 700rpx;
      height: 740rpx;
      padding-top: 1rpx;
      margin: 76rpx auto;
      border-radius: 20rpx;
      background-color: rgba(245,245,245, 0.6);
      box-shadow: 0 0 10rpx #F0F8FF;
      position: relative;
      .scroll-current {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        top: 340rpx;
        height: 60rpx;
        width: 690rpx;
        padding: 0 5rpx;
        line-height: 60rpx;
        div {
          padding: 0 10rpx;
        }
      }
      .scroll-view {
        height: 660rpx;
        margin: 40rpx 0;
        position: relative;
        .scroll-content {
          position: absolute;
          left: 0;
          width: 100%;
          top: 0;
          padding-bottom: 300rpx;
          font-size: 0;
          div {
            height: 60rpx;
            padding: 0 30rpx;
            width: 510rpx;
            margin: 0 auto;
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