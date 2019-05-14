//根据观影时间计算价格
const calculatePrice = function (startTime, priceInfo) {
    console.log('cal')
    let price = 0
    let week = new Date(startTime * 1000).getDay() + ''
    let hour = new Date(startTime * 1000).getHours() + new Date(startTime * 1000).getMinutes() / 60
    let ruleList = []
    if (priceInfo.length ===0) {
        price = ''
    } else {
        priceInfo.map(val => {
            if(val.type === 1 || val.type === '1') {
                ruleList.push(val)
            } else if (startTime >= val.start_time && startTime <= val.end_time && val.week.split(',').indexOf(week) > -1 &&
                hour >= val.play_start_hours && hour <= val.play_end_hours) {
                if (ruleList.length > 0) {
                    ruleList.map((rule, index) => {
                        if (rule.type === val.type && val.update_time > rule.update_time) {
                            ruleList[index] = val
                        } else if (rule.type !== val.type) {
                            ruleList.push(val)
                        }
                    })
                } else {
                    ruleList.push(val)
                }
                
            }
        })
        let price1 = 0
        let price2 = 0
        let price3 = 0
        console.log(ruleList, 'rule')
        ruleList.map(rule => {
            if (rule.type === '1' || rule.type === 1) {
                if (startTime >= rule.discount_start_time && startTime <= rule.discount_end_time) {
                    price1 = rule.price - rule.discount_price
                } else {
                    price1 = rule.price
                }
            }
            if (rule.type === '2' || rule.type === 2) {
                if (startTime >= rule.discount_start_time && startTime <= rule.discount_end_time) {
                    price2 = rule.price - rule.discount_price
                } else {
                    price2 = rule.price
                }
            }
            if (rule.type === '3' || rule.type === 3) {
                if (startTime >= rule.discount_start_time && startTime <= rule.discount_end_time) {
                    price3 = rule.price - rule.discount_price
                } else {
                    price3 = rule.price
                }
            }
        })
        console.log(price1, price2, price3)
        price = (price2 * 1 || price3 * 1 || price1 * 1 || 0).toFixed(2)
    }
    
    return price
}
// startTime >= val.discount_start_time && startTime <= val.discount_end_time
export default calculatePrice

