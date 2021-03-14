
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/vue-admin-template/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-admin-template/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },


  {
    url: 'sp-user/user/findPage',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: {
          "pageNum": 1,
          "pageSize": 10,
          "totalSize": 3,
          "totalPages": 1,
          "errMsg": "数据获取成功",
          "ts": 1615704067132,
          "errCode": 1,
          "success": true,
          "results": [
            {
              "username": "aaa",
              "gender": 1,
              "email": "1760700972@qq.com",
              "phone": "13417698911",
              "status": 1,
              "createTime": 1613821893176,
              "updateTime": 1613821893176
            },
            {
              "username": "bbb",
              "gender": 2,
              "email": null,
              "phone": null,
              "status": 1,
              "createTime": 1613821971175,
              "updateTime": 1613821971175
            },
            {
              "username": "ccc",
              "gender": 0,
              "email": null,
              "phone": null,
              "status": 1,
              "createTime": 1613822002706,
              "updateTime": 1613822002706
            }
          ]
        }
      }
    }
  }
]
