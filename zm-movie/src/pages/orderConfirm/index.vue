<template>
    <div class="border-top">
        <div class="order-info bg-white">
            <h5 class="text-xlg text-bold text-line-normal">{{orderInfo.film_name}}</h5>
            <div class="text-gray text-line-normal" style="margin-top: 28rpx;">{{orderInfo.film_en_name}}</div>
            <div class="text-lg text-line-normal" style="margin-top: 28rpx;">观影时间</div>
            <div class="text-orange text-line-normal" style="margin-top: 28rpx;">{{format(orderInfo.trade_start_time, orderInfo.trade_end_time)}}</div>
            <div class="text-lg text-line-normal" style="margin-top: 28rpx;">观影地点</div>
            <div class="text-bold text-orange text-line-normal" style="margin-top: 28rpx;">{{orderInfo.cinema_name}} {{orderInfo.hall_name}}</div>
            <div class="m-t-md border-top-dashed clear p-t-lg">
                <div class="pull-left m-l-md">总票价</div>
                <div class="pull-right text-sm text-orange">¥ <span class="text-xxlg">{{orderInfo.trade_money}}</span></div>
            </div>
        </div>
        <div class="p-md">
            <h5 class="text-dark text-bold text-line-normal">购票须知:</h5>
            <div class="text-gray text-sm m-t-sm text-line-normal">影舱影票一经售出不可退换，请提前10分钟到达指定影舱，不可更改放映影舱。如遇问题请与客服人员联系。</div>
            <div class="text-center" style="margin-top: 108rpx;">
                <a :href="'/pages/orderDetail/main?id='+orderInfo.trade_id" class="select-time-btn text-center">确认支付</a>
                <div class="text-center text-gray text-sm m-t-sm">
                    支付剩余时间
                    <i-count-down
                        :target="orderInfo.effective_time"
                        :clear-timer="clearTime"
                    ></i-count-down>
                </div>
            </div>
        </div>
        <i-modal i-class="tel-modal" title="大眼猿 申请获得" :visible="modal" ok-text="允许" cancel-text="拒绝" @ok="doOk" @cancel="doCancel">
            <div class="text-left text-dark m-t-sm text-xlg modal-padding">你的手机号码</div>
            <div class="m-t-sm p-o-md"><input class="tel-ipt p-xs text-lg" type="text" v-model="telVal"></div>
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
                modal: false,
                telVal: '17610111283',
                orderInfo: '',
                clearTime: false,
                userInfo: {}
            }
        },
        methods: {
            getOrderData (id) {
                if (!id) return
                this.$http.post(api.order.detail, {
                    version: '1.0.0',
                    order_id: id
                }, {
                    headers: {
                        'AuthToken': this.userInfo.auth_token
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
            doOk () {
                this.modal = false
            },
            doCancel () {
                this.modal = false
            },
            format: format
        },
        onLoad (option) {
            let that = this
            wx.getStorage({
                key: 'userInfo',
                success(res) {
                    that.userInfo = res.data
                    that.getOrderData(option.trade_id)
                },
                fail () {
                    that.userInfo = {}
                }
            })
        },
        watch: {
        }
    }
</script>

<style>
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
