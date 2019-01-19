<template>
    <div>
        <div class="home-top-container relative">
            <div class="search-box">
                <i-icon type="search" class="pull-left search-box-icon" size="16" color="#ffa726" />
                <!--<i-input :value="searchText" i-class="search-input" maxLength="100" placeholder="搜索影片" />-->
                <form action="">
                    <input type="text" class="search-input" v-model="searchText" placeholder="搜索影片" @confirm="doSearch">
                </form>
            </div>
        </div>
        <div class="cinema-select-container">
            <ul>
                <li class="cinema-select-item relative" v-for="(item,index) in 10" :key="index">
                    <h5 class="text-lg text-line-normal text-bold">万达影城(芳草地店)</h5>
                    <div class="text-sm cinema-address">朝阳区东大桥路9号芳草地大厦Lg-26朝阳区东大桥路9号芳草地大厦Lg-26朝阳区东大桥</div>
                    <div class="text-sm text-gray">379m</div>
                    <div class="location-icon"><i-icon type="coordinates_fill" class="icon-item" size="16" color="#fff" /></div>
                </li>
            </ul>
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

<style scoped>
    .cinema-select-container {
        padding: 30rpx 20rpx;
    }
    .cinema-select-item {
        height: 200rpx;
        border-radius: 2px;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.11), 0 0 2px 0 rgba(0, 0, 0, 0.12);
        margin-bottom: 10rpx;
        padding: 24rpx 100rpx 20rpx 14rpx;
    }
    .cinema-address {
        color: #484848;
        height: 80rpx;
        line-height: 36rpx;
        padding: 4rpx 0;
    }
    .location-icon {
        position: absolute;
        top: 66rpx;
        right: 24rpx;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        box-shadow: 0 4px 4px 0 rgba(255, 161, 80, 0.24), 0 0 20px 0 rgba(255, 143, 0, 0.37);
        background-image: linear-gradient(302deg, #f57c00, #ffa726);
    }
    .location-icon .icon-item {
        position: absolute;
        top: 16rpx;
        left: 16rpx;
    }
</style>
