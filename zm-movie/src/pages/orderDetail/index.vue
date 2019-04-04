<template>
    <div class="border-top">
        <div class="p-sm">
            <div class="text-md text-line-normal" style="margin-top: 10rpx;">订单编号: <span class="text-gray text-sm p-l-sm">{{orderInfo.trade_id}}</span></div>
            <div class="text-md text-line-normal m-t-sm">影片名称: <span class="text-gray text-sm p-l-sm">{{orderInfo.film_name}}</span></div>
            <div class="text-md text-line-normal m-t-sm">观影时间: <span class="text-gray text-sm p-l-sm">{{watch_time}}</span></div>
            <div class="text-md text-line-normal m-t-sm">观影影院: <span class="text-gray text-sm p-l-sm">{{orderInfo.cinema_name}} {{orderInfo.hall_name}}</span></div>
            <div class="text-md text-line-normal m-t-sm">观影地点: <span class="text-gray text-sm p-l-sm">
                {{orderInfo.cinema_address}}<i-icon type="coordinates_fill" size="16" color="#ffa726" /></span>
            </div>
            <div class="text-md text-line-normal m-t-sm">支付方式: <span class="text-gray text-sm p-l-sm">{{orderInfo.pay_type}}</span></div>
            <div class="text-md text-line-normal m-t-sm">订单金额: <span class="text-orange p-l-sm text-xxlg"><span class="text-sm">¥</span>{{((orderInfo.trade_money - orderInfo.discount_money)*100|Int)/100}}</span></div>
            <div class="text-center" style="margin-top: 200rpx;">
                <button class="select-time-btn text-center" @tap="backHome">返回首页</button>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import format from '@/utils/format'
    import api from '@/api'
    export default {
        data () {
            return {
                userInfo: '',
                orderInfo: '',
                watch_time: ''
            }
        },
        methods: {
            getOrderData (id) {
                if (!id) return
                wx.showLoading({
                    title: '加载中',
                })
                this.$http.post(api.order.detail, {
                    version: '1.0.0',
                    order_id: id
                }, {
                    headers: {
                        'AuthToken': this.userInfo.auth_token
                    }
                }).then((res) => {
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 500)
                    if (res.data.code === 1) {
                        this.orderInfo = res.data.data
                        this.watch_time = format(this.orderInfo.trade_start_time, this.orderInfo.trade_end_time)
                        console.log(this.watch_time)
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            backHome () {
                wx.reLaunch({
                    url: '../index/main'
                })
            },
            format: format
        },
        onLoad (option) {
            let that = this
            wx.getStorage({
                key: 'userInfo',
                success(res) {
                    that.userInfo = res.data
                    that.getOrderData(option.id)
                }
            })

        }
    }
</script>

<style>
    .select-time-btn {
        display: block;
        margin: 0 auto;
        width: 556rpx;
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 40rpx;
        box-shadow: 0 4px 4px 0 rgba(255, 161, 80, 0.24), 0 0 20px 0 rgba(255, 143, 0, 0.37);
        background-image: linear-gradient(275deg, #f57c00, #ffa726);
        color: #fff;
        font-size: 28rpx;
    }
</style>
