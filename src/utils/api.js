const Api = {
  _core: (options) => {
    return new Promise((resolve, reject) => {
      wx.request(
        Object.assign({
          header: {
            'content-type': 'application/json'
          },
          success: resolve,
          fail: reject
        }, options))
    })
  },
  _qqTopList (id = 26) {
    const options = {
      url: `https://v1.itooi.cn/tencent/topList?id=${id}&pageSize=30&page=0&format=1`
    }
    return this._core(options)
  },
  _qqSong (id) {
    const options = {
      url: `https://v1.itooi.cn/tencent/song?id=${id}`
    }
    return this._core(options)
  },
  _qqUrl (id) {
    const options = {
      url: `https://v1.itooi.cn/tencent/url?id=${id}`
    }
    return this._core(options)
  },
  _qqLrc (id) {
    const options = {
      url: `https://v1.itooi.cn/tencent/lrc?id=${id}`
    }
    return this._core(options)
  }
}

export default Api
