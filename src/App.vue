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
  log () {
    console.log(`log at:${Date.now()}`)
  }
}
</script>

<style>
.fix-iphonex-button {    bottom:68rpx!important;}.fix-iphonex-button::after {    content: ' ';    position: fixed;    bottom: 0!important;    height: 68rpx!important;    width: 100%;    background: #fff;}
</style>
