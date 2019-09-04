const Api = {
  _core: (options) => {
    return new Promise((resolve, reject) => {
      wx.request(
        Object.assign(options, {
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'post',
          success: resolve,
          fail: reject
        }))
    })
  },
  _qqTopList (id = 26) {
    const options = {
      url: `http://www.guowenfu.com/tencent/music_list`,
      data: {
        id
      }
    }
    return this._core(options)
  },
  _qqLrc (id) {
    const options = {
      url: `http://www.guowenfu.com/tencent/lrc`,
      data: {
        id
      }
    }
    return this._core(options)
  }
}

export default Api
