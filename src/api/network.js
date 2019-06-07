import request from '@/utils/request'

export function post(params) {
  var data = new URLSearchParams();
  for(var i in params){
    data.append(i,params[i]);
  }
  return request({
    method: 'post',
    data:data
  })
}
