<template>
    <web-view :src="website"></web-view>
</template>

<script type="text/ecmascript-6">
    import api from '@/api'
    export default {
        data () {
            return {
                website: ''
            }
        },
        methods: {
            
        },
        onLoad (option) {
            this.website = option.website + '?special_id=' + option.special_id
            console.log(this.website)
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
