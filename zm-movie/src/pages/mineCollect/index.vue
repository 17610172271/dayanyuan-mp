<template>
    <div class="search-result-container">
        <ul>
            <li class="m-b-sm bg-white search-result-item relative" v-for="(item,index) in 5" :key="index">
                <div class="poster-container"></div>
                <h5 class="text-lg text-line-normal">
                    后来的外卖
                    <i-icon type="like_fill" v-if="index>2" class="pull-right" size="20" color="#edeced" />
                    <i-icon type="like_fill" v-else class="pull-right" size="20" color="#ff4747" />
                </h5>
                <div class="text-sm text-gray text-line-20 m-t-sm">导演: 刘若英</div>
                <div class="text-sm text-gray text-line-20">主演: 周冬雨,井柏然</div>
                <div class="text-sm text-gray text-line-20">类型: 剧情,爱情</div>
            </li>
        </ul>
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

<style scoped>
    .search-result-container {
        margin-top: 20rpx;
        background-color: #f5f5f5;
    }
    .search-result-item {
        height: 244rpx;
        padding: 20rpx 20rpx 20rpx 190rpx;
    }
    .poster-container {
        width: 140rpx;
        height: 200rpx;
        border: 2rpx solid #000;
        position: absolute;
        top: 20rpx;
        left: 20rpx;
    }
</style>
