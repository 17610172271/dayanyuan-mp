<template>
    <div>
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
                    <div>{{item.cinema_name}}</div>
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
                    <div class="text-xs text-gray" style="margin-top: 30rpx;">2018年5月20日 12:00-14:00</div>
                    <div style="margin-top: 30rpx;" class="clear">
                        <span class="text-orange">{{item.trade_status===0 ? '未支付' : (item.trade_status===1 ? '未使用' : '已使用')}}</span>
                        <div class="pull-right clear" v-if="item.trade_status===0">
                            <i-button type="ghost" size="small" i-class="btn-order pull-left m-r-8" @click="cancelPay(item.trade_id)">取消支付</i-button>
                            <i-button type="warning" size="small" i-class="btn-order pull-left" @click="goPay(item.trade_id)">立即支付</i-button>
                        </div>
                        <div class="pull-right clear" v-else-if="item.trade_status===1">
                            <i-button type="warning" size="small" i-class="btn-order pull-left">扫码入舱</i-button>
                        </div>
                        <div class="pull-right clear" v-else>
                            <i-button type="warning" size="small" i-class="btn-order pull-left" @click="doComments(item)">评价</i-button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="data.length===0 && !loading" class="text-gray text-center">你暂时没有订单</div>
        </div>
        <i-modal-normal i-class="notice-modal" :visible="modal" ok-text="确定" cancel-text="取消" @ok="cancelOrder" @cancel="modal=false">
            <div class="notice-modal-container">
                <div class="p-v-sm">您确定要取消该订单吗?</div>
            </div>
        </i-modal-normal>
        <i-toast id="toast" />
    </div>
</template>

<script type="text/ecmascript-6">
    import api from '@/api'
    export default {
        data () {
            return {
                current: 'unused',
                data: [],
                page: 1,
                page_size: 10,
                modal: false,
                id: '',
                loading: false,
                userInfo: {}
            }
        },
        methods: {
            getList (type) {
                this.loading = true
                this.$http.post(api.mine.orderList, {
                    version: '1.0.0',
                    status: this.current === 'unused' ? '0' : null,
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
                    }, 500)
                    if (res.data.code === 1) {
                        console.log(new Date().getTime())
                        if (type) {
                            this.data = this.data.concat(res.data.data.orders).map(val => {
                                return {
                                    ...val,
                                    effective_time: new Date().getTime() + val.effective_time * 1000
                                }
                            })
                        } else {
                            this.data = res.data.data.orders.map(val => {
                                return {
                                    ...val,
                                    effective_time: new Date().getTime() + val.effective_time * 1000
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
                this.current = detail.target.key
                this.getList()
            },
            doComments (item) {
                wx.navigateTo({
                    url: '../mineComments/main?trade_id=' + item.trade_id + '&film_id=' + item.goods_id + '&cinema_address=' + item.cinema_address
                    + '&cinema_name=' + item.cinema_name + '&trade_start_time=' + item.trade_start_time
                })
            },
            goPay (trade_id) {
                this.$http.post(api.common.pay, {
                    version: '1.0.0',
                    trade_id: trade_id
                }, {
                    headers: {
                        'AuthToken': this.userInfo.auth_token
                    }
                }).then((res) => {
                    if (res.data.code === 1) {
                        wx.requestPayment({
                            timeStamp: res.data.data.timestamp,
                            nonceStr: res.data.data.noncestr,
                            package: res.data.data.package,
                            signType: 'MD5',
                            paySign: res.data.data.sign,
                            success(res) {
                                console.log(res)
                            },
                            fail(res) {
                                console.log(res)
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
            cancelPay (id) {
                this.id = id
                this.modal = true
            },
            cancelOrder () {
                this.$http.post(api.order.cancel, {
                    trade_id: this.id
                }, {
                    headers: {
                        'AuthToken': this.userInfo.auth_token
                    }
                }).then((res) => {
                    if (res.data.code === 1) {
                        this.modal = false
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
            }
        },
        onReachBottom () {
            this.page += 1
            this.getList('more')
        },
        onLoad () {
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
