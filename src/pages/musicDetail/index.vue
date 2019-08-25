<template>
  <div class="music-detail">
    <div class="detail-content" :style="'background: url('+musicData.pic+'}) no-repeat center;background-size: 100% 100%;'">
      <div class="detail-title">
        <h5>{{ musicData.name }} --- {{ musicData.singer }}</h5>
      </div>
    </div>
    <div class="detail-bottom" :class="{ 'fix-iphonex-button' : isIphoneX }">
      <div class="detail-pre">上一首</div>
      <div class="detail-play"  @click="audioPlay">
        <img :src="musicData.pic" alt="" class="play-active" :style="isPlay ? 'animation-play-state:running': 'animation-play-state:paused'">
      </div>
      <div class="detail-next">下一首</div>
    </div>
    <div class="controls">
      <audio :poster="musicData.pic" :name="musicData.name" :author="musicData.singer" :src="musicData.url" id="myAudio"></audio>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      musicData: {},
      isPlay: false,
      isIphoneX: false,
      windowWidth: 0
    }
  },
  onReady: function (e) {
    this.windowWidth = wx.getSystemInfoSync().windowWidth
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  onShow () {
    this.isPlay = false
    this.isIphoneX = wx.getStorageSync('isIphoneX')
    this.musicData = wx.getStorageSync('music')
  },
  methods: {
    audioPlay (e) {
      if (!this.isPlay) {
        this.audioCtx.play()
      } else {
        this.audioCtx.pause()
      }
      this.isPlay = !this.isPlay
    }
  }
}
</script>
<style lang="scss">
page {
  height: 100%;
}
.music-detail {
  height: 100%;
  .detail-content {
    height: 100%;
     .detail-title {
      position: relative;
      height: 72rpx;
      top: 60rpx;
      h5 {
        text-align: center;
        line-height: 72rpx;
        font-size: 32 rpx;
        background-image:-webkit-linear-gradient(bottom,#FF4500,#FFDEAD,#FF8C00); 
        -webkit-background-clip:text; 
        -webkit-text-fill-color:transparent;
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
    box-shadow: 0 0 10rpx #DCDCDC;
    background: linear-gradient(45deg, #FFE4C4, #DCDCDC);
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
  .controls {
    display: none;
  }
}
</style>