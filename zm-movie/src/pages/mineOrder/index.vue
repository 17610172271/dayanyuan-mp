<template>
    <div>
        <i-tabs :current="current" @change="tabChange" color="#f98d0f">
            <i-tab key="unused" class="width-50" title="未使用"></i-tab>
            <i-tab key="all" class="width-50" title="全部"></i-tab>
        </i-tabs>
        <div class="bg-f5 order-container">
            <div class="order-item-container bg-white" v-for="(item,index) in data" :key="item.trade_id">
                <div class="order-item-top relative">
                    <div>{{item.cinema_name}}</div>
                    <div class="text-gray m-t-sm text-line-20 p-r-lg">{{item.cinema_address}}</div>
                    <div class="location-icon icon-item"><i-icon type="coordinates_fill" class="icon-item" size="16" color="#fff" /></div>
                </div>
                <div class="order-item-bottom">
                    <div class="text-lg">{{item.film_name}} <span class="pull-right text-sm text-line-normal">支付剩余 <span class="text-orange">12分46秒</span></span></div>
                    <div class="text-xs text-gray" style="margin-top: 30rpx;">2018年5月20日 12:00-14:00</div>
                    <div style="margin-top: 30rpx;" class="clear">
                        <span class="text-orange">{{item.trade_status===0 ? '未支付' : (item.trade_status===1 ? '未使用' : '已使用')}}</span>
                        <div class="pull-right clear" v-if="item.trade_status===0">
                            <i-button type="ghost" size="small" i-class="btn-order pull-left m-r-8">取消支付</i-button>
                            <i-button type="warning" size="small" i-class="btn-order pull-left">立即支付</i-button>
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
        </div>
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
                page_size: 10
            }
        },
        methods: {
            getList (type) {
                this.$http.post(api.mine.orderList, {
                    version: '1.0.0',
                    status: this.current === 'unused' ? '0' : null,
                    page: this.page,
                    page_size: this.page_size
                }, {
                    headers: {
                        'AuthToken': 'ntPgSqdhiNyShvWPiFGhQzNFHzjXSuSr'
                    }
                }).then((res) => {
                    if (res.data.code === 1) {
                        if (type) {
                            this.data = this.data.concat(res.data.data.orders)
                        } else {
                            this.data = res.data.data.orders
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
            }
        },
        onReachBottom () {
            this.page += 1
            this.getList('more')
        },
        onShow () {
            this.getList()
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
