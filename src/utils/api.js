const Api = {
  _core: (method, options) => {
    return new Promise((resolve, reject) => {
      wx.request(
        Object.assign(options, {
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method,
          success: resolve,
          fail: reject
        }))
    })
  },
  _ranking_list () {
    const options = {
      url: `https://www.guowenfu.com/tencent/ranking_list`
    }
    return this._core('post', options)
  },
  _qqTopList (id = 26) {
    const options = {
      url: `https://www.guowenfu.com/tencent/music_list`,
      data: {
        id
      }
    }
    return this._core('post', options)
  },
  _qqLrc (id) {
    const options = {
      url: `https://www.guowenfu.com/tencent/lrc`,
      data: {
        id
      }
    }
    return this._core('post', options)
  },
  getSongVkey (songmid) {
    const options = {
      url: `https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg`,
      data: {
        loginUin: 3051522991,
        format: 'json',
        platform: 'yqq',
        needNewCode: 0,
        cid: 205361747,
        uin: 3051522991,
        guid: 5931742855,
        songmid: songmid,
        filename: `C400${songmid}.m4a`
      }
    }
    return this._core('get', options)
  }
}

export default Api
