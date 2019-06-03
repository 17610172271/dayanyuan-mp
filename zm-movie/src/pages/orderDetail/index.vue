<template>
    <div class="border-top">
        <div class="p-sm">
            <!-- <div class="text-md text-line-normal" style="margin-top: 10rpx;">订单编号: <span class="text-gray text-sm p-l-sm">{{orderInfo.trade_id}}</span></div>
            <div class="text-md text-line-normal m-t-sm">影片名称: <span class="text-gray text-sm p-l-sm">{{orderInfo.film_name}}</span></div>
            <div class="text-md text-line-normal m-t-sm">观影时间: <span class="text-gray text-sm p-l-sm">{{watch_time}}</span></div>
            <div class="text-md text-line-normal m-t-sm">观影影院: <span class="text-gray text-sm p-l-sm">{{orderInfo.cinema_name}} {{orderInfo.hall_name}}</span></div>
            <div class="text-md text-line-normal m-t-sm">观影地点: <span class="text-gray text-sm p-l-sm">
                {{orderInfo.cinema_address}}<i-icon type="coordinates_fill" size="16" color="#ffa726" /></span>
            </div>
            <div class="text-md text-line-normal m-t-sm">支付方式: <span class="text-gray text-sm p-l-sm">{{orderInfo.pay_type}}</span></div>
            <div class="text-md text-line-normal m-t-sm">订单金额: <span class="text-orange p-l-sm text-xxlg"><span class="text-sm">¥</span>{{((orderInfo.trade_money - orderInfo.discount_money)*100|Int)/100}}</span></div> -->
            <i-row i-class="line-height-24 border-bottom p-v-7">
                <i-col span="6">订单编号:</i-col>
                <i-col span="18" i-class="text-gray text-right text-sm over-omit">{{orderInfo.trade_id}}</i-col>
            </i-row>
            <i-row i-class="line-height-24 border-bottom p-v-7">
                <i-col span="6">影片名称:</i-col>
                <i-col span="18" i-class="text-gray text-right text-sm over-omit">{{orderInfo.film_name}}</i-col>
            </i-row>
            <i-row i-class="line-height-24 border-bottom p-v-7">
                <i-col span="6">观影时间:</i-col>
                <i-col span="18" i-class="text-gray text-right text-sm over-omit">{{watch_time}}</i-col>
            </i-row>
            <i-row i-class="line-height-24 border-bottom p-v-7">
                <i-col span="6">观影影院:</i-col>
                <i-col span="18" i-class="text-gray text-right text-sm over-omit">{{orderInfo.cinema_name}}-{{orderInfo.hall_name}}</i-col>
            </i-row>
            <i-row i-class="line-height-24 border-bottom p-v-7">
                <i-col span="6">观影地址:</i-col>
                <i-col span="18" i-class="text-gray text-right text-sm over-omit">{{orderInfo.cinema_address}}<i-icon type="coordinates_fill" size="17" color="#ffa726" /></i-col>
            </i-row>
            <i-row i-class="line-height-24 border-bottom p-v-7">
                <i-col span="6">支付方式:</i-col>
                <i-col span="18" i-class="text-gray text-right text-sm over-omit">{{orderInfo.pay_type}}</i-col>
            </i-row>
            <i-row i-class="line-height-24 border-bottom p-v-7">
                <i-col span="6">订单金额:</i-col>
                <i-col span="18" i-class="text-gray text-right text-sm over-omit">￥{{((orderInfo.trade_money - orderInfo.discount_money)*100|Int)/100}}</i-col>
            </i-row>
            <i-row i-class="line-height-24 border-bottom p-v-7">
                <i-col span="6">优惠券:</i-col>
                <i-col span="18" i-class="text-gray text-right text-sm over-omit">{{orderInfo.coupon_name||'无'}}</i-col>
            </i-row>
            <div class="line-height-24 m-t-14 text-right">实付: <span class="text-orange">￥<span class="text-xxlg">{{orderInfo.pay_money||0}}</span></span></div>
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
    .p-v-7 {
        padding-top: 7px;
        padding-bottom: 7px;
    }
</style>
