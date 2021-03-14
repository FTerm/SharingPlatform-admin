export default [
    {
        url: '/sp-admin/admin/add',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
            
        }
    },

    {
        url: '/sp-admin/admin/findPage',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: {
                    "pageNum": 1,
                    "pageSize": 10,
                    "totalSize": 1,
                    "totalPages": 1,
                    "errMsg": "数据获取成功",
                    "ts": 1615705606420,
                    "errCode": 1,
                    "success": true,
                    "results": [
                      {
                        "id": 2,
                        "userName": "aaa",
                        "createTime": null,
                        "updateTime": null,
                        "loginIp": null,
                        "lastLoginTime": null
                      }
                    ]
                }
            }
        }
    }

]