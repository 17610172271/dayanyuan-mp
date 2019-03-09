<template>
    <div style="min-height: 100%;"@touchstart='touchStart' @touchend="touchEnd">
        <i-tabs :current="current" @change="tabChange" color="#f98d0f">
            <i-tab key="unused" class="width-50" title="未使用"></i-tab>
            <i-tab key="all" class="width-50" title="全部"></i-tab>
        </i-tabs>
        <div class="bg-f5 order-container">
            <div class="relative" style="height: 100%;" v-if="loading">
                <i-spin custom i-class="p-b-sm">
                    <div class="text-gray text-center">加载中...</div>
                </i-spin>
            </div>
            <div class="order-item-container bg-white" v-for="(item,index) in data" :key="item.trade_id" v-show="!loading||data.length>0">
                <div class="order-item-top relative">
                    <div>{{item.hall_name}}</div>
                    <div class="text-gray m-t-sm text-line-20 p-r-lg">{{item.cinema_address}}</div>
                    <div class="location-icon icon-item"><i-icon type="coordinates_fill" class="icon-item" size="16" color="#fff" /></div>
                </div>
                <div class="order-item-bottom">
                    <div class="text-lg">
                        {{item.film_name}}
                        <span class="pull-right text-sm text-line-normal clear" v-if="item.trade_status===0">
                            <span class="pull-left">支付剩余</span>
                            <i-count-down
                                countdown-class="text-orange"
                                :target="item.effective_time"
                                :clear-timer="false"
                            ></i-count-down>
                        </span>
                    </div>
                    <div class="text-xs text-gray" style="margin-top: 30rpx;">{{item.play_time}}</div>
                    <div style="margin-top: 30rpx;" class="clear">
                        <span class="text-orange">{{item.trade_status===0 ? '未支付' : (item.trade_status===1 ? '未使用' : '已使用')}}</span>
                        <div class="pull-right clear" v-if="item.trade_status===0">
                            <i-button type="ghost" size="small" i-class="btn-order pull-left m-r-8" @tap="cancelPay(item.trade_id)">取消支付</i-button>
                            <i-button type="warning" size="small" i-class="btn-order pull-left" @tap="goPay(item.trade_id)">立即支付</i-button>
                        </div>
                        <div class="pull-right clear" v-else-if="item.trade_status===1">
                            <i-button type="warning" size="small" i-class="btn-order pull-left" @tap="openHall()">扫码入舱</i-button>
                        </div>
                        <div class="pull-right clear" v-else>
                            <i-button type="warning" size="small" i-class="btn-order pull-left" @tap="doComments(item)">评价</i-button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="data.length===0 && !loading" class="text-gray text-center">你暂时没有订单</div>
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
    import api from '@/api'
    import format from '@/utils/format'
    export default {
        data () {
            return {
                current: 'all',
                data: [],
                page: 1,
                page_size: 30,
                modal0: false,
                id: '',
                loading: false,
                userInfo: {},
                modal: false,
                modal1: false,
                modal2: false,
                orderInfo: {},
                startX: 0,
                startY: 0
            }
        },
        methods: {
            getList (type) {
                this.loading = true
                wx.showLoading({
                    title: '加载中',
                })
                this.$http.post(api.mine.orderList, {
                    version: '1.0.0',
                    status: this.current === 'unused' ? '1' : '',
                    page: this.page,
                    page_size: this.page_size
                }, {
                    headers: {
                        'AuthToken': this.userInfo.auth_token
                    }
                }).then((res) => {
                    let that = this
                    setTimeout(function () {
                        that.loading = false
                        wx.hideLoading()
                    }, 500)
                    if (res.data.code === 1) {
                        if (this.page === 1) this.data = []
                        if (res.data.data.orders.length > 0) {
                            this.page += 1
                        }
                        if (type) {
                            this.data = this.data.concat(res.data.data.orders).map(val => {
                                return {
                                    ...val,
                                    effective_time: new Date().getTime() + val.effective_time * 1000,
                                    play_time: this.format(val.trade_start_time, val.trade_end_time)
                                }
                            })
                        } else {
                            this.data = res.data.data.orders.map(val => {
                                return {
                                    ...val,
                                    effective_time: new Date().getTime() + val.effective_time * 1000,
                                    play_time: this.format(val.trade_start_time, val.trade_end_time)
                                }
                            })
                        }
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            tabChange (detail) {
                this.page = 1
                this.current = detail.target.key
            },
            doComments (item) {
                wx.navigateTo({
                    url: '../mineComments/main?trade_id=' + item.trade_id + '&film_id=' + item.goods_id + '&cinema_address=' + item.cinema_address
                    + '&cinema_name=' + item.cinema_name + '&trade_start_time=' + item.trade_start_time
                })
            },
            goPay (trade_id) {
                let that = this
                this.$http.post(api.common.pay, {
                    version: '1.0.0',
                    trade_id: trade_id,
                    openid: that.userInfo.open_id
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
                                    that.getList()
                                    that.current = 'all'
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
            cancelPay (id) {
                this.id = id
                this.modal0 = true
            },
            format: format,
            cancelOrder () {
                this.$http.post(api.order.cancel, {
                    trade_id: this.id
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
                        this.getList()
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
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
            doOk () {
                this.modal = false
                this.modal1 = false
                this.modal2 = false
                wx.navigateTo({
                    url: '../index/main'
                })
            },
            doCancel () {
                this.modal = false
                this.modal1 = false
                this.modal2 = false
            },
            touchStart (e) {
                this.startX = e.mp.changedTouches[0].clientX
                this.startY = e.mp.changedTouches[0].clientY
            },
            touchEnd (e) {
                let endX = e.mp.changedTouches[0].clientX
                let endY = e.mp.changedTouches[0].clientY
                if (endX - this.startX > 50 && Math.abs(endY - this.startY) < 50) {      //右滑
                    this.current = 'unused'
                } else if (endX - this.startX < -50 && Math.abs(endY - this.startY) < 50) {   //左滑
                    this.current = 'all'
                }
            }
        },
        onReachBottom () {
            this.getList('more')
        },
        onLoad () {
            this.page = 1
            let that = this
            wx.getStorage({
                key: 'userInfo',
                success(res) {
                    that.userInfo = res.data
                    that.getList()
                },
                fail () {
                    that.userInfo = {}
                }
            })
        },
        watch: {
            current () {
                this.page = 1
                this.getList()
            }
        }
    }
</script>

<style>
    page {
        background-color: #f5f5f5 !important;
    }
    .width-50 {
        width: 50%;
    }
    .order-container {
        padding: 30rpx 20rpx;
    }
    .order-item-container {
        margin-bottom: 30rpx;
        border: 2rpx solid #e5e5e5;
        border-radius: 8rpx;
    }
    .order-item-top {
        padding: 20px 40rpx;
        border-bottom: 2rpx dashed #d5d5d5;
    }
    .order-item-bottom {
        padding: 30rpx 40rpx;
    }
    .m-r-8 {
        margin-right: 16rpx !important;
    }
    .location-icon {
        position: absolute;
        top: 52rpx;
        right: 40rpx;
        border-radius: 50%;
        width: 64rpx;
        height: 64rpx;
        box-shadow: 0 8rpx 8rpx 0 rgba(255, 161, 80, 0.24), 0 0 40rpx 0 rgba(255, 143, 0, 0.37);
        background-image: linear-gradient(302deg, #f57c00, #ffa726);
    }
    .location-icon .icon-item {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }

</style>
