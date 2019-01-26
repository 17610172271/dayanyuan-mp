<template>
    <div class="border-top">
        <div class="p-sm">
            <h5 class="text-xlg text-bold text-line-normal">{{orderInfo.film_name}} <span class="text-gray text-md">{{orderInfo.film_en_name}}</span></h5>
            <div class="text-lg text-line-normal m-t-lg">观影时间: <span class="text-orange text-md p-l-sm">{{format(orderInfo.trade_start_time, orderInfo.trade_end_time)}}</span></div>
            <div class="text-lg text-line-normal m-t-md">观影地点: <span class="p-l-sm">{{orderInfo.hall_name}}</span></div>
            <div class="text-gray text-line-normal m-t-sm" style="padding-left: 160rpx;">
                {{orderInfo.cinema_address}}
                <i-icon type="coordinates_fill" size="20" color="#ffa726" />
            </div>
            <div class="text-lg text-line-normal m-t-sm">订单编号: <span class="p-l-sm">{{orderInfo.trade_id}}</span></div>
            <div class="text-lg text-line-normal m-t-sm">订单总价: <span class="text-orange p-l-sm"><span class="text-sm">¥</span>{{orderInfo.trade_money}}</span></div>
            <div class="text-center" style="margin-top: 200rpx;">
                <button class="select-time-btn text-center">
                    <i-icon type="scan" size="22" color="#fff" />
                    扫码入舱
                </button>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import format from '@/utils/format'
    import api from '@/api'
    export default {
        data () {
            return {}
        },
        methods: {
            getOrderData (id) {
                if (!id) return
                this.$http.post(api.order.detail, {
                    version: '1.0.0',
                    order_id: id
                }, {
                    headers: {
                        'AuthToken': 'ntPgSqdhiNyShvWPiFGhQzNFHzjXSuSr'
                    }
                }).then((res) => {
                    if (res.data.code === 1) {
                        this.orderInfo = res.data.data
                        let effective_time = this.orderInfo.effective_time
                        this.orderInfo.effective_time = new Date().getTime() + this.orderInfo.effective_time * 1000
                        let that = this
                        setTimeout(function () {
                            that.clearTime = true
                        }, effective_time)
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            format: format
        },
        onLoad (option) {
            this.getOrderData(option.trade_id)
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
