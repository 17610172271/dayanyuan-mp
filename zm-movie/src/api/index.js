/**
 * Created by LiKui on 2019/1/22.
 */
// 通用api
export const common = {
    cityList: '/api/v1/cinema/cities', // 城市列表
    cinemaList: '/api/v1/cinema/search', // 搜索-影院列表
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
}
export default {
    common,
    film,
    mine
}
