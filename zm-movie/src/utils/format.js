/**
 * Created by LiKui on 2019/1/25.
 */
module.exports = function (start, end) {
    let start_time = new Date(start * 1000).getFullYear() + '年' + (new Date(start * 1000).getMonth() + 1) + '月'
            + new Date(start * 1000).getDate() + '日 ' + new Date(start * 1000).getHours() + ':' + new Date(start * 1000).getMinutes() + '-'
    let end_time = new Date(end * 1000).getHours() + ':' + new Date(end * 1000).getMinutes()
    return start_time + end_time

}
