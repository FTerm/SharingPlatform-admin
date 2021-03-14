import request from '@/utils/request'

export function pagination() {
    return request({
      url: '/sp-admin/admin/findPage',
      method: 'post'
    })
}

export function Delete() {
    return request({
      url: '/sp-admin/admin/del',
      method: 'delete'
    })
}
export function Create() {
    return request({
      url: '/sp-admin/admin/add',
      method: 'post'
    })
}
export function Modify() {
    return request({
      url: '/sp-admin/admin/modification',
      method: 'put'
    })
}
export function Role() {
    return request({
      url: '/sp-admin/admin/role',
      method: 'post'
    })
}

export function profile() {
    return request({
      url: '/sp-admin/admin/profile',
      method: 'post'
    })
}

