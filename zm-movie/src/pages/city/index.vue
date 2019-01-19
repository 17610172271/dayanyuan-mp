<template>
    <div>
        <div class="current-city">
            <div class="current-city-head">当前定位城市</div>
            <div class="current-city-body bg-white">北京</div>
        </div>
        <div class="current-city">
            <div class="current-city-head">选择城市</div>
            <ul>
                <li class="current-city-body bg-white" :class="{'text-orange': index==3}" v-for="(item, index) in cities" :key="index">
                    {{item}}
                    <i-icon type="success_fill" v-if="index==3" class="pull-right m-r-sm" size="22" color="#ffa726" />
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                cities: ['北京', '上海', '广州', '深圳', '重庆', '天津','北京', '上海', '广州', '深圳', '重庆', '天津','北京', '上海', '广州', '深圳', '重庆', '天津']
            }
        },
        methods: {
        },
        onShow () {
        }
    }
</script>

<style scoped>
    .current-city-head {
        background-color: #f5f5f5;
        font-size: 12px;
        color: #b0b1b3;
        line-height: 56rpx;
        padding-left: 24rpx;
    }
    .current-city-body {
        height: 96rpx;
        font-size: 32rpx;
        line-height: 96rpx;
        border-bottom: 2rpx solid #e4e4e4;
        padding-left: 20rpx;
    }
</style>
