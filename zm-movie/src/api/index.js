/**
 * Created by LiKui on 2019/1/22.
 */
// 通用api
export const common = {
    cityList: '/api/v1/cinema/cities', // 城市列表
    cinemaList: '/api/v1/cinema/search', // 搜索-影院列表
    cinemaDetail: '/api/v1/cinema/detail', // 影院详情
    timeList: '/api/v1/cinema/hall_times', // 影院占用时间表
    pay: '/api/v1/pay/wechat_mini', // 微信支付
    sendCode: '/api/v1/account/sms/send', // 发送短信验证码
    bindTel: '/api/v1/account/mobile/mobileBindingProgram', // 绑定手机号
    login: '/api/v1/account/login/unionProgram', // 微信第三方登录
    open: '/api/v1/device/open', // 扫码入舱
    getTel: '/api/v1/account/mobile/getWechatMobile', // 获取手机号
}
// 影片
export  const film = {
    banner: '/api/v1/movies/column/contents', // 轮播
    class: '/api/v1/movies/category', // 分类
    more: '/api/v1/movies/list', // 更多列表
    recommend: '/api/v1/movies/recommend', // 每日推荐
    detail: '/api/v1/movies/detail', // 影片详情
    cinemaList: '/api/v1/movies/cinema', // 影片下影院列表
    searchResult: '/api/v1/movies/search/results', // 搜索结果
    hotKeys: '/api/v1/movies/search/keywords/hot', // 热门关键词
}
// 我的
export  const mine = {
    collectList: '/api/v1/profile/favorites_list', // 我的收藏列表
    collect: '/api/v1/movies/add_favorite', // 加入/取消收藏
    orderList: '/api/v1/order/my_list', // 我的订单列表
    orderDetail: '/api/v1/order/detail', // 订单详情
    createOrder: '/api/v1/order/create', // 创建订单
    closeOrder: '/api/v1/order/close', // 关闭订单
    deviceStatus: '/api/v1/device/status', // 设备状态
    control: '/api/v1/device/control', // 设备控制
}
// 订单
export  const order = {
    create: '/api/v1/order/create', // 创建订单
    detail: '/api/v1/order/detail', // 订单详情
    cancel: '/api/v1/order/close', // 取消订单
    comment: '/api/v1/profile/post_movie_evaluate', // 提交评价
}
export default {
    common,
    film,
    mine,
    order
}
