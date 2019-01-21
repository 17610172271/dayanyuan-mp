<template>
    <div>
        <i-tabs :current="current" @change="tabChange" color="#f98d0f">
            <i-tab key="unused" class="width-50" title="未使用">aa</i-tab>
            <i-tab key="all" class="width-50" title="全部">bb</i-tab>
        </i-tabs>
        <div class="bg-f5 order-container">
            <div class="order-item-container bg-white" v-for="(item,index) in 10" :key="index">
                <div class="order-item-top relative">
                    <div>2号影仓</div>
                    <div class="text-gray m-t-sm">北京市东城区崇文门外大街40号</div>
                    <div class="location-icon icon-item"><i-icon type="coordinates_fill" class="icon-item" size="16" color="#fff" /></div>
                </div>
                <div class="order-item-bottom">
                    <div class="text-lg">后来的我们 <span class="pull-right text-sm text-line-normal">支付剩余 <span class="text-orange">12分46秒</span></span></div>
                    <div class="text-xs text-gray" style="margin-top: 30rpx;">2018年5月20日 12:00-14:00</div>
                    <div style="margin-top: 30rpx;">
                        <span class="text-orange">未支付</span>
                        <div class="pull-right">
                            <i-button type="ghost" size="small" i-class="btn-order pull-left m-r-8">取消支付</i-button>
                            <i-button type="warning" size="small" i-class="btn-order pull-left">立即支付</i-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                current: 'all'
            }
        },
        methods: {
            tabChange (detail) {
                this.current = detail.target.key
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
        height: 420rpx;
        margin-bottom: 30rpx;
        border: 2rpx solid #e5e5e5;
        border-radius: 8rpx;
    }
    .order-item-top {
        height: 150rpx;
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
