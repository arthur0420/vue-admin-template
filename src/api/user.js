import request from '@/utils/request'

export function login(data) {
  var params = new URLSearchParams();
  for(var i in data){
    params.append(i,data[i]);
  }
  params.append("funcNo",'1017');
  return request({
    url: '',
    method: 'post',
    data:params
  })
}

/* export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
} */

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
