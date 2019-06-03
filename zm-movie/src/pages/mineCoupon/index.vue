<template>
    <div style="min-height: 100%;"@touchstart='touchStart' @touchend="touchEnd">
        <i-tabs :current="current" @change="tabChange" color="#f98d0f">
            <i-tab key="unused" class="width-50" :title="'未使用('+(couponNum.unused||0)+')'"></i-tab>
            <i-tab key="used" class="width-50" :title="'已使用('+(couponNum.used||0)+')'"></i-tab>
            <i-tab key="pasted" class="width-50" :title="'已过期('+(couponNum.overdue||0)+')'"></i-tab>
        </i-tabs>
        <div class="bg-f5 order-container">
            <div class="relative" style="height: 100%;" v-if="loading">
                <i-spin custom i-class="p-b-sm">
                    <div class="text-gray text-center p-v-sm">加载中...</div>
                </i-spin>
            </div>
            <div class="coupon-item-container" v-for="(item,index) in data" :key="item.coupon_id" v-show="!loading||data.length>0">
                <div class="coupon-item-content text-white relative" v-if="item.satisfy_money>0" style="background: url(../../../static/img/img-discountcoupon-red.png) no-repeat;">
                    <div>{{item.coupon_name}}</div>
                    <div class="relative">￥<span style="font-size: 80rpx;font-weight: 500;margin-right: 10rpx;">{{item.preferential_money}}</span>满{{item.satisfy_money}}元可用 <span class="coupon-date-container text-xs text-white1">{{item.coupon_start_time + ' - ' + item.coupon_end_time}}</span></div>
                    <div class="clear" style="margin-top: 40rpx;"><navigator :url="'/pages/rule/main?id='+item.coupon_id" class="pull-right text-sm">查看更多规则</navigator></div>
                    <div class="coupon-status" :class="{'coupon-status-used': item.status===1, 'coupon-status-pasted': item.status===3}"></div>
                </div>
                <div class="coupon-item-content text-white relative" v-else style="background: url(../../../static/img/img-discountcoupon-orange.png) no-repeat;">
                    <div>{{item.coupon_name}}</div>
                    <div class="relative">￥<span style="font-size: 80rpx;font-weight: 500;margin-right: 10rpx;">{{item.preferential_money}}</span>无门槛 <span class="coupon-date-container text-xs text-white1">{{item.coupon_start_time + ' - ' + item.coupon_end_time}}</span></div>
                    <div class="clear" style="margin-top: 40rpx;"><navigator :url="'/pages/rule/main?rule='+JSON.stringify(item.remarks)" class="pull-right text-sm">查看更多规则</navigator></div>
                    <div class="coupon-status" :class="{'coupon-status-used': item.status===1, 'coupon-status-pasted': item.status===3}"></div>
                </div>
            </div>

            <div v-if="data.length===0 && !loading" class="text-gray text-center p-v-sm">暂时没有优惠券</div>
        </div>

        <i-toast id="toast" />
    </div>
</template>
<script>
    import api from '@/api'
    import format from '@/utils/format'
    export default {
        data () {
            return {
                current: 'unused',
                data: [],
                couponNum: {
                    overdue: 0,
                    used: 0,
                    unused: 0
                },
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
            getCouponNum () {
                this.$http.post(api.coupon.getNum, {
                }, {
                    headers: {
                        'AuthToken': this.userInfo.auth_token
                    }
                }).then((res) => {
                    if (res.data.code === 1) {
                        this.couponNum = res.data.data.nums
                    } else {
                        this.couponNum = {
                            overdue: 0,
                            used: 0,
                            unused: 0
                        }
                    }
                })
            },
            getList (type) {
                this.loading = true
                // wx.showLoading({
                //     title: '加载中',
                // })
                this.$http.post(api.coupon.list, {
                    version: '1.0.0',
                    status: this.current === 'unused' ? '2' : (this.current === 'used' ? '1' : '3'),
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
                        // wx.hideLoading()
                    }, 500)
                    if (res.data.code === 1) {
                        if (this.page === 1) this.data = []
                        if (res.data.data.coupons.length > 0) {
                            this.page += 1
                        }
                        if (type) {
                            this.data = this.data.concat(res.data.data.coupons).map(val => {
                                return {
                                    ...val,
                                    effective_time: new Date().getTime() + val.effective_time * 1000,
                                    play_time: this.format(val.trade_start_time, val.trade_end_time)
                                }
                            })
                        } else {
                            this.data = res.data.data.coupons.map(val => {
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
            format: format,
            touchStart (e) {
                if (!e.mp.changedTouches[0]) return
                this.startX = e.mp.changedTouches[0].clientX
                this.startY = e.mp.changedTouches[0].clientY
            },
            touchEnd (e) {
                if (!e.mp.changedTouches[0]) return
                let endX = e.mp.changedTouches[0].clientX
                let endY = e.mp.changedTouches[0].clientY
                if (endX - this.startX > 50 && Math.abs(endY - this.startY) < 50) {      //右滑
                    if (this.current === 'pasted') {
                        this.current = 'used'
                    } else if (this.current === 'used') {
                        this.current = 'unused'
                    }
                } else if (endX - this.startX < -50 && Math.abs(endY - this.startY) < 50) {   //左滑
                    if (this.current === 'unused') {
                        this.current = 'used'
                    } else if (this.current === 'used') {
                        this.current = 'pasted'
                    }
                }
            }
        },
        onReachBottom () {
            this.getList('more')
        },
        onShow () {
            this.current = 'unused'
        },
        onLoad () {
            this.page = 1
            let that = this
            wx.getStorage({
                key: 'userInfo',
                success(res) {
                    that.userInfo = res.data
                    that.getList()
                    that.getCouponNum()
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
        padding: 0rpx 60rpx;
    }
    .coupon-item-container {
        margin-top: 20rpx;
        height: 240rpx;
    }
    .coupon-item-content {
        width: 100%;
        height: 100%;
        background-size: cover;
        padding: 30rpx 34rpx;
    }
    .coupon-date-container {
        position: absolute;
        right: 0;
        bottom: 6rpx;
    }
    .text-white1 {
        color: rgba(255,255,255,0.8);
    }
    .coupon-status {
        position: absolute; 
        width: 75px;
        height: 75px;
        top: 6rpx;  
        right: 50rpx;   
    }
    .coupon-status-pasted {
        background: url(../../../static/img/ic-stale.png) no-repeat;
        background-size: cover;
    }
    .coupon-status-used {
        background: url(../../../static/img/ic-used.png) no-repeat;
        background-size: cover;
    }
</style>
