<template>
    <div class="bordr-top">
        <!--扫码中-->
        <div v-if="false">
            <div class="lock-img"></div>
            <div class="progress-container">
                <div class="progress-orange"></div>
            </div>
            <div class="progress-text text-lg text-dark">门锁将在5秒内打开，请稍后</div>
        </div>
        <!--开舱中-->
        <div v-else>
            <div class="unlock-img"></div>
            <div class="progress-container">
                <div class="progress-orange"></div>
            </div>
            <div class="progress-text text-lg text-dark">门锁将在5秒内打开，请稍后</div>
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
    .lock-img {
        margin: 180rpx auto 188rpx;
        width: 132rpx;
        height: 172rpx;
        background-image: url(../../../static/img/ic-lock@3x.png);
        background-repeat: no-repeat;
        background-size: cover;
    }
    .unlock-img {
        margin: 180rpx auto 188rpx;
        width: 196rpx;
        height: 168rpx;
        background-image: url(../../../static/img/ic-unlock@3x.png);
        background-repeat: no-repeat;
        background-size: cover;
    }
    .progress-container {
        width: 600rpx;
        height: 12rpx;
        background-color: #efeff0;
        margin: 0 auto;
    }
    .progress-orange {
        display: block;
        width: 60%;
        height: 12rpx;
        background-color: #f57c00;
        border-radius: 6rpx;
    }
    .progress-text {
        margin-top: 90rpx;
        text-align: center;
    }
</style>
