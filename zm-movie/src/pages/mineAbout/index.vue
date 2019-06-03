<template>
    <div class="border-top">
        <div class="about-logo"></div>
        <div class="about-company-container text-center">
            <p>北京大眼猿信息技术有限公司</p>
            <p class="text-md">1.0.0</p>
        </div>
        <div class="about-copyright-container text-center">
            <p>CopyRight 2019 大眼猿 版权所有</p>
            <p>All Rights Reserved</p>
        </div>
    </div>
</template>

<script>
    import api from '@/api'
    export default {
        data () {
            return {
                
            }
        },
        methods: {

        },
        onLoad () {
        }
    }
</script>

<style>
    .about-logo {
        width: 76px;
        height: 76px;
        margin: 92rpx auto 44rpx;
        background: url(../../../static/img/ic-ape.png) no-repeat;
        -webkit-background-size: cover;
        background-size: cover;
    }
    .about-company-container {
        font-family: PingFangSC;
        font-size: 16px;
        font-weight: 500;
        color: #454545;
        line-height: 48rpx;
    }
    .about-copyright-container {
        position: absolute;
        bottom: 64rpx;
        left: 50%;
        transform: translateX(-50%);
        font-family: PingFangSC;
        font-size: 12px;
        color: #b6b7b9;
        line-height: 34rpx;
    }
</style>
