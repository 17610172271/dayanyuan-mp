<template>
    <div class="border-top">
        <div class="order-info bg-white">
            <!-- <h5 class="text-xlg text-bold text-line-normal">{{orderInfo.film_name}}</h5>
            <div class="text-gray text-line-normal" style="margin-top: 14rpx;">{{orderInfo.film_en_name}}</div>
            <div class="text-lg text-line-normal" style="margin-top: 28rpx;">观影时间</div>
            <div class="text-gray text-line-normal" style="margin-top: 14rpx;">{{watch_time}}</div>
            <div class="text-lg text-line-normal" style="margin-top: 28rpx;">{{orderInfo.cinema_name}} {{orderInfo.hall_name}}</div>
            <div class="text-sm text-gray text-line-normal">{{orderInfo.cinema_address}}</div>
            <div class="m-t-md border-top-dashed clear p-t-lg">
                <div class="pull-left m-l-sm" style="line-height: 52rpx;">订单金额</div>
                <div class="pull-right text-sm text-orange">¥ <span class="text-xxlg">{{((orderInfo.trade_money - orderInfo.discount_money)*100|Int)/100}}</span></div>
            </div> -->
            <i-row i-class="line-height-24">
                <i-col span="6">影片名称:</i-col>
                <i-col span="18" i-class="text-gray text-right text-sm over-omit">{{orderInfo.film_name}}</i-col>
            </i-row>
            <i-row i-class="line-height-24 m-t-14">
                <i-col span="6">观影时间:</i-col>
                <i-col span="18" i-class="text-gray text-right text-sm over-omit">{{watch_time}}</i-col>
            </i-row>
            <i-row i-class="line-height-24 m-t-14">
                <i-col span="6">观影影院:</i-col>
                <i-col span="18" i-class="text-gray text-right text-sm over-omit">{{orderInfo.cinema_name}}-{{orderInfo.hall_name}}</i-col>
            </i-row>
            <i-row i-class="line-height-24 m-t-14">
                <i-col span="6">观影地址:</i-col>
                <i-col span="18" i-class="text-gray text-right text-sm over-omit">{{orderInfo.cinema_address}}<i-icon type="coordinates_fill" size="17" color="#ffa726" /></i-col>
            </i-row>
            <i-row i-class="line-height-24 m-t-14">
                <i-col span="6">订单金额:</i-col>
                <i-col span="18" i-class="text-gray text-right text-sm over-omit">￥{{((orderInfo.trade_money - orderInfo.discount_money)*100|Int)/100}}</i-col>
            </i-row>
            <i-row i-class="line-height-24 m-t-14">
                <i-col span="6">优惠券:</i-col>
                <i-col span="18" i-class="text-gray text-right text-sm over-omit"><navigator :url="'/pages/couponList/main?trade_id='+orderInfo.trade_id+'&coupon_id='+coupon_id">{{coupon_name?coupon_name:'请选择'}}<i-icon type="enter" size="14" style="vertical-align: 4rpx;margin-left: 10rpx;" /></navigator></i-col>
            </i-row>
            <i-row i-class="line-height-24 m-t-14">
                <i-col span="6">需付:</i-col>
                <i-col span="18" i-class="text-gray text-right text-sm over-omit text-orange">￥<span class="text-xxlg">{{(orderInfo.trade_money - orderInfo.discount_money - coupon_money) > 0 ? ((orderInfo.trade_money - orderInfo.discount_money - coupon_money)*100|Int)/100 : 0}}</span></i-col>
            </i-row>
        </div>
        <div class="p-md">
            <h5 class="text-dark text-bold text-line-normal">购票须知:</h5>
            <div class="text-gray text-sm m-t-sm text-line-normal">影舱影票一经售出不可退换，请提前10分钟到达指定影舱，不可更改放映影舱。如遇问题请与客服人员联系。</div>
            <div class="text-center" style="margin-top: 108rpx;">
                <button class="select-time-btn text-center" @tap="goPay">确认支付</button>
                <div class="text-center text-gray text-sm m-t-sm">
                    支付剩余时间
                    <i-count-down
                        :target="effective_time"
                        :clear-timer="false"
                    ></i-count-down>
                </div>
            </div>
        </div>
        <i-toast id="toast" />
    </div>
</template>

<script type="text/ecmascript-6">
    import api from '@/api'
    import format from '@/utils/format'
    export default {
        data () {
            return {
                orderInfo: '',
                clearTime: false,
                userInfo: {},
                watch_time: '',
                effective_time: 9999999999999,
                modal: false,
                coupon_id: 0,
                coupon_name: '',
                coupon_money: 0
            }
        },
        methods: {
            getOrderData (id) {
                let that = this
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
                        this.effective_time = parseInt(new Date().getTime()) + this.orderInfo.effective_time * 1000
                    } else {
                        that.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            goPay () {
                let that = this
                this.$http.post(api.common.pay, {
                    version: '1.0.0',
                    trade_id: this.orderInfo.trade_id,
                    openid: this.userInfo.open_id,
                    coupon_id: this.coupon_id || 0
                }, {
                    headers: {
                        'AuthToken': this.userInfo.auth_token
                    }
                }).then((res) => {
                    if (res.data.code === 1) {
                        wx.requestPayment({
                            timeStamp: res.data.data.timeStamp,
                            nonceStr: res.data.data.nonceStr,
                            package: res.data.data.package,
                            signType: res.data.data.signType,
                            paySign: res.data.data.paySign,
                            success(res) {
                                if (res.errMsg === 'requestPayment:ok') {
                                    wx.navigateTo({
                                        url: '/pages/orderDetail/main?id=' + that.orderInfo.trade_id
                                    })
                                } else {
                                    that.$Toast({
                                        content: res.errMsg,
                                        type: 'error'
                                    })
                                }
                            },
                            fail(res) {
                                that.$Toast({
                                    content: '支付失败',
                                    type: 'error'
                                })
                            }
                        })
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                }).catch(res => {
                console.log(res)
                    this.$Toast({
                        content: res.response.data.msg,
                        type: 'error'
                    })
                })
            },
            format: format
        },
        onLoad (option) {
            let that = this
            this.coupon_id = option.coupon_id
            console.log(this.coupon_id)
            this.coupon_name = option.coupon_name
            this.coupon_money = option.coupon_money || 0
            wx.getStorage({
                key: 'userInfo',
                success(res) {
                    that.userInfo = res.data
                    that.getOrderData(option.trade_id)
                }
            })
        }
    }
</script>

<style scoped>
    page {
        background-color: #f5f5f5 !important;
    }
    .order-info {
        /*height: 640rpx;*/
        padding: 30rpx 40rpx;
    }
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
