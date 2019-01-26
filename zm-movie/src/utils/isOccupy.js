/**
 * Created by LiKui on 2019/1/24.
 */
//根据影院占用时间判断是否占用
const isOccupy = function (start, end, list) {
    let result = ''
    for (let i = 0; i < list.length; i++) {
        console.log(list[i])
        let isOccupy = false
        list[i].times.map(time => {
            if (!(start > time.end_time || end < time.start_time)) {
                isOccupy = true // 发生冲突
            }
        })
        if (!isOccupy) {
            result =  list[i].hall_id
            console.log(result)
            break
        }
    }
    return result
}
export default isOccupy

