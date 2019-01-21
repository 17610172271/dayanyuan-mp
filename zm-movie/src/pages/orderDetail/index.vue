<template>
    <div class="border-top">
        <div class="p-sm">
            <h5 class="text-xlg text-bold text-line-normal">后来的我们 <span class="text-gray text-md">Us and Them</span></h5>
            <div class="text-lg text-line-normal m-t-lg">观影时间: <span class="text-orange text-md p-l-sm">2018年5月17日 14:20-16:40</span></div>
            <div class="text-lg text-line-normal m-t-md">观影地点: <span class="p-l-sm">一号影仓</span></div>
            <div class="text-gray text-line-normal m-t-sm" style="padding-left: 160rpx;">
                北京市东城区崇文门外大街40号
                <i-icon type="coordinates_fill" size="20" color="#ffa726" />
            </div>
            <div class="text-lg text-line-normal m-t-sm">订单编号: <span class="p-l-sm">10081825739</span></div>
            <div class="text-lg text-line-normal m-t-sm">订单总价: <span class="text-orange p-l-sm"><span class="text-sm">¥</span>192.00</span></div>
            <div class="text-center" style="margin-top: 200rpx;">
                <button class="select-time-btn text-center">
                    <i-icon type="scan" size="22" color="#fff" />
                    扫码入舱
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {}
        },
        methods: {

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
</style>
