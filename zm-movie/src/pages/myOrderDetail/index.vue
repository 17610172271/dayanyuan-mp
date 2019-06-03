<template>
    <div class="border-top">
        <div class="p-sm">
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
            <i-row i-class="line-height-24 border-bottom p-v-7" v-if="orderInfo.trade_status!=0">
                <i-col span="6">支付方式:</i-col>
                <i-col span="18" i-class="text-gray text-right text-sm over-omit">{{orderInfo.pay_type}}</i-col>
            </i-row>
            <i-row i-class="line-height-24 border-bottom p-v-7">
                <i-col span="6">订单金额:</i-col>
                <i-col span="18" i-class="text-gray text-right text-sm over-omit">￥{{((orderInfo.trade_money - orderInfo.discount_money)*100|Int)/100}}</i-col>
            </i-row>
            <div v-if="orderInfo.trade_status===0">
                <i-row i-class="line-height-24 m-t-14">
                    <i-col span="6">优惠券:</i-col>
                    <i-col span="18" i-class="text-gray text-right text-sm over-omit">{{orderInfo.coupon_name||'无'}}<i-icon type="enter" size="14" style="vertical-align: 4rpx;margin-left: 10rpx;" /></navigator></i-col>
                </i-row>
                <div class="line-height-24 m-t-14 text-right">需付: <span class="text-orange">￥<span class="text-xxlg">{{(orderInfo.trade_money - orderInfo.discount_money - coupon_money) > 0 ? ((orderInfo.trade_money - orderInfo.discount_money - coupon_money)*100|Int)/100 : 0}}</span></span></div>
                <div class="text-center" style="margin-top: 80rpx;">
                    <button class="select-time-btn text-center" @tap="goPay">立即支付</button>
                </div>
                <div class="text-center">
                    <button class="select-time-btn1 text-center" @tap="modal0 = true">取消订单</button>
                </div>
                <div>
                    <div class="text-center text-gray text-sm m-t-sm">
                        支付剩余时间
                        <i-count-down
                            :target="effective_time"
                            :clear-timer="false"
                        ></i-count-down>
                    </div>
                </div>
            </div>
            <div v-else-if="orderInfo.trade_status>0&&orderInfo.trade_status<13">
                <i-row i-class="line-height-24 border-bottom p-v-7">
                    <i-col span="6">优惠券:</i-col>
                    <i-col span="18" i-class="text-gray text-right text-sm over-omit">{{orderInfo.coupon_name||'无'}}</i-col>
                </i-row>
                <i-row i-class="line-height-24 border-bottom p-v-7">
                    <i-col span="6">实付:</i-col>
                    <i-col span="18" i-class="text-gray text-right text-sm over-omit">￥{{orderInfo.pay_money||'0.00'}}</i-col>
                </i-row>
                <div class="text-center" style="margin-top: 90rpx;">
                    <button class="select-time-btn text-center" @tap="openHall"><i-icon style="margin-right: 20rpx" type="scan" color="#fff" size="20"/>扫码入舱</button>
                </div>
            </div>
            <div v-else>
                <i-row i-class="line-height-24 border-bottom p-v-7">
                    <i-col span="6">优惠券:</i-col>
                    <i-col span="18" i-class="text-gray text-right text-sm over-omit">{{orderInfo.coupon_name||'无'}}</i-col>
                </i-row>
                <i-row i-class="line-height-24 border-bottom p-v-7">
                    <i-col span="6">实付:</i-col>
                    <i-col span="18" i-class="text-gray text-right text-sm over-omit">￥{{orderInfo.pay_money||'0.00'}}</i-col>
                </i-row>
                <div class="text-center" style="margin-top: 90rpx;">
                    <button class="select-time-btn2 text-center"><i-icon style="margin-right: 20rpx" type="scan" color="#fff" size="20"/>扫码入舱</button>
                </div>
            </div>
            
        </div>
        <i-modal-normal i-class="notice-modal" :visible="modal0" ok-text="确定" cancel-text="取消" @ok="cancelOrder" @cancel="modal0=false">
            <div class="notice-modal-container">
                <div class="p-v-sm">您确定要取消该订单吗?</div>
            </div>
        </i-modal-normal>
        <i-modal i-class="notice-modal" :visible="modal" ok-text="去预定" cancel-text="再看看" @ok="doOk" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(https://img01.wanfangche.com/public/upload/201901/29/5c4fc50127400.png);background-repeat: no-repeat;background-size: 100% 156px;padding:40px;">
                <div class="text-xlg">您没有可用的观影券 <br> 请先预定</div>
            </div>
        </i-modal>
        <i-modal i-class="notice-modal" :visible="modal1" ok-text="再来一单" cancel-text="知道了" @ok="doOk" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(https://img01.wanfangche.com/public/upload/201901/29/5c4fc50127400.png);background-repeat: no-repeat;background-size: 100% 156px;padding:40px;">
                <div class="text-xlg">不是该影仓观影券 <br> 请您到{{orderInfo.hall_name}}</div>
            </div>
        </i-modal>
        <i-modal i-class="notice-modal" :visible="modal2" ok-text="再来一单" cancel-text="知道了" @ok="doOk" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(https://img01.wanfangche.com/public/upload/201901/29/5c4fc50127400.png);background-repeat: no-repeat;background-size: 100% 156px;padding:20px;">
                <div class="text-md">离观影时间还有: <br> <span class="text-xlg text-orange">{{orderInfo.count_down}}</span> <br> <span class="">(请在观影前15分钟内打开舱门)</span></div>
            </div>
        </i-modal>
        <i-toast id="toast" />
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
                watch_time: '',
                coupon_name: '',
                coupon_id: 0,
                coupon_money: 0,
                effective_time: 9999999999999,
                modal0: false,
                modal: false,
                modal1: false,
                modal2: false,
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
                        if (this.orderInfo.coupon_name) {
                            this.coupon_name = this.orderInfo.coupon_name
                            this.coupon_money = this.orderInfo.coupon_money
                        }
                        this.watch_time = format(this.orderInfo.trade_start_time, this.orderInfo.trade_end_time)
                        this.effective_time = parseInt(new Date().getTime()) + this.orderInfo.effective_time * 1000
                    } else {
                        this.$Toast({
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
                    trade_id: that.orderInfo.trade_id,
                    openid: that.userInfo.open_id,
                    coupon_id: 0
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
                                    that.getOrderData(that.orderInfo.trade_id)
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
                })
            },
            cancelOrder () {
                this.$http.post(api.order.cancel, {
                    trade_id: this.orderInfo.trade_id
                }, {
                    headers: {
                        'AuthToken': this.userInfo.auth_token
                    }
                }).then((res) => {
                    if (res.data.code === 1) {
                        this.modal0 = false
                        this.$Toast({
                            content: '订单取消成功',
                            type: 'success'
                        })
                        wx.navigateTo({
                            url: '../mineOrder/main'
                        })
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            openHall () {
                let that = this
                // 扫码开舱
                wx.scanCode({
                    success(res) {
                        let hall_id = res.result.slice(res.result.indexOf('hall_id=')).split('=')[1]
                        that.$http.post(api.common.open, {
                            version: '1.0.0',
                            hall_id: hall_id
                        }, {
                            headers: {
                                'AuthToken': that.userInfo.auth_token
                            }
                        }).then((res) => {
                            if (res.data.code === 1) {
                                // 允许控制
                                wx.setStorage({
                                    key: 'hall_id',
                                    data: {
                                        hall_id: hall_id,
                                        trade_id: res.data.data[0].trade_id
                                    },
                                    success () {
                                        wx.navigateTo({
                                            url: '../mineDevice/main?id=' + hall_id + '&trade_id=' + res.data.data[0].trade_id
                                        })
                                    }
                                })
                            } else if (res.data.code === 0) {
                                that.modal = true
                                that.orderInfo = res.data.data[0]
                            } else if (res.data.code === 2) {
                                that.modal2 = true
                                that.orderInfo = res.data.data[0]
                                that.$set(that.orderInfo, 'count_down', that.returnDate(parseInt((that.orderInfo.trade_start_time * 1000 - new Date().getTime()) / 1000 / 60)))
                            } else if (res.data.code === 3) {
                                that.modal1 = true
                                that.orderInfo = res.data.data[0]
                            } else {
                                that.$Toast({
                                    content: res.data.msg,
                                    type: 'error'
                                })
                            }
                        })
                    }
                })
            },
            returnDate (time) {
                time *= 1
                console.log(parseInt(time / 1440) + '天' + parseInt((time % 1440) / 60) + '小时' + time % 60 + '分钟', 'time')
                if (time > 1440) {
                    return parseInt(time / 1440) + '天' + parseInt((time % 1440) / 60) + '小时' + time % 60 + '分钟'
                } else if (time > 60) {
                    return parseInt(time / 60) + '小时' + time % 60 + '分钟'
                } else {
                    return time + '分钟'
                }
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
            this.coupon_id = option.coupon_id
            this.coupon_name = option.coupon_name
            this.coupon_money = option.coupon_money || 0
            console.log(this.coupon_id, this.coupon_name, this.coupon_money)
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
    .select-time-btn1 {
        display: block;
        margin: 36rpx auto 16rpx;
        width: 556rpx;
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 40rpx;
        color: #454545;
        font-size: 28rpx;
        border: solid 1px #c6c6c7;
        background-color: #fafafa;
    }
    .select-time-btn2 {
        display: block;
        margin: 36rpx auto 16rpx;
        width: 556rpx;
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 40rpx;
        color: #fff;
        font-size: 28rpx;
        background-image: linear-gradient(to right, #eeeeee, #d8d8d8);
    }
    .p-v-7 {
        padding-top: 7px;
        padding-bottom: 7px;
    }
</style>
