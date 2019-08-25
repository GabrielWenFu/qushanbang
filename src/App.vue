<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */

    let logs
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({key: 'logs'}).data || []
      logs.unshift(Date.now())
      mpvue.setStorageSync({
        key: 'logs',
        data: logs
      })
    } else {
      logs = mpvue.getStorageSync('logs') || []
      logs.unshift(Date.now())
      mpvue.setStorageSync('logs', logs)
    }
    wx.getSystemInfo({
      success: res => {
        let modelmes = res.model
        if (modelmes.search('iPhone X') !== -1 || modelmes.search('iPhone Xs') !== -1 || modelmes.search('iPhone XsMax') !== -1 || modelmes.search('iPhone XR') !== -1) {
          wx.setStorage({
            key: 'isIphoneX',
            data: true
          })
        }
      }
    })
  },
  onHide () {
    wx.getBackgroundAudioPlayerState({
      success (res) {
        const status = res.status
        if (status === 1) {
          wx.getBackgroundAudioManager().play()
        }
      }
    })
  }
}
</script>

<style>
@import '../static/images/iconfont.css';
.fix-iphonex-button {    bottom:66rpx!important;}
</style>
