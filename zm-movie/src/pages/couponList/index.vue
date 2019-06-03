<template>
    <div class="border-top couponlist-container bg-f5">
        <div class="couponlist-item relative p-t-md p-r-lg" v-for="item in couponList" :key="item.coupon_id" @tap="selectItem(item)">
            <div class="couponlist-item-left" :class="item.satisfy_money===0?'couponlist-item-left1':'couponlist-item-left2'">
                <p class="text-center text-white text-22 m-t-md">{{item.preferential_money || 0}}元</p>
                <p class="text-center text-white text-sm m-t-sm" v-if="item.satisfy_money===0">无门槛优惠券</p>
                <p class="text-center text-white text-sm m-t-sm" v-else>满减优惠券</p>
            </div>
            <p class="text-center" style="color: #747474;line-height:24px;">有效日期</p>
            <p class="text-center" style="color: rgba(42, 42, 42, 0.87);line-height:24px;">{{item.coupon_start_time}}-{{item.coupon_end_time}}</p>
            <span v-if="selectVal===item.coupon_id" class="selected text-center"><i-icon type="right" color="#fff" style="vertical-align:-1px;" /></span>
            <span v-else class="unselect"></span>
        </div>
        <div v-if="couponList.length==0" class="text-gray p-v-sm text-center">暂无可用优惠券</div>
        <i-toast id="toast" />
    </div>
</template>

<script>
    import api from '@/api'
    export default {
        data () {
            return {
                selectVal: '',
                id: '',
                type: '',
                userInfo: {},
                couponList: []
            }
        },
        methods: {
            getList () {
                wx.showLoading({
                    title: '加载中',
                })
                this.$http.post(api.coupon.getCoupon, {
                    version: '1.0.0',
                    order_id: this.id
                }, {
                    headers: {
                        'AuthToken': this.userInfo.auth_token
                    }
                }).then((res) => {
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 500)
                    if (res.data.code === 1) {
                        this.couponList = res.data.data.coupons
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            selectItem (item) {
                if (this.type) {
                    console.log(item.coupon_id,item.coupon_name,item.preferential_money)
                    wx.navigateTo({
                        url: '../myOrderDetail/main?coupon_id=' + item.coupon_id + '&coupon_name=' + item.coupon_name + '&coupon_money=' + item.preferential_money
                    })
                } else {
                    wx.navigateTo({
                        url: '../orderConfirm/main?coupon_id=' + item.coupon_id + '&coupon_name=' + item.coupon_name + '&coupon_money=' + item.preferential_money
                    })
                }
            }
        },
        onLoad (option) {
            this.selectVal = parseInt(option.coupon_id)
            this.id = option.trade_id
            this.type = option.type
            let that = this
            wx.getStorage({
                key: 'userInfo',
                success(res) {
                    that.userInfo = res.data
                    that.getList()
                }
            })
        }
    }
</script>

<style>
    page {
        background-color: #f5f5f5 !important;
    }
    .couponlist-container {
        padding: 36rpx 54rpx;
    }
    .couponlist-item {
        height: 184rpx;
        background-color: #fff;
        padding-left: 116px;
        margin-bottom: 28rpx;
    }
    .couponlist-item-left {
        width: 116px;
        height: 92px;
        position: absolute;
        top: 0;
        left: 0;
    }
    .couponlist-item-left1 {
        background: url(../../../static/img/img-discount-yellow.png);
        -webkit-background-size: cover;
        background-size: cover;
    }

    .couponlist-item-left2 {
        background: url(../../../static/img/copy-mask.png);
        -webkit-background-size: cover;
        background-size: cover;
    }
    .text-22 {
        font-size: 22px;
    }
    .unselect {
        width: 17px;
        height: 17px;
        border: solid 1px #747474;
        border-radius: 50%;
        position: absolute;
        top: 35px;
        right: 14px;
    }
    .selected {
        width: 17px;
        height: 17px;
        border-radius: 50%;
        background-color: #f67e02;
        position: absolute;
        top: 35px;
        right: 14px;
    }
</style>
