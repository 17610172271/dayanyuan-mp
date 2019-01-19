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
        <div class="m-t-xs p-o-sm" v-if="false">
            <div class="search-top-head text-line-normal text-gray text-md">热门搜索</div>
            <div><span class="hot-search-item bg-eee" v-for="(item, index) in 10" :key="index">后来的外卖</span></div>
            <div class="search-top-head text-line-normal text-gray text-md" style="margin-top: 30rpx;">历史搜索</div>
            <div><span class="hot-search-item bg-eee" v-for="(item, index) in history" :key="index">{{item}}</span></div>
        </div>
        <div class="search-result-container" v-else>
            <ul>
                <li class="m-b-sm bg-white search-result-item relative" v-for="(item,index) in 5" :key="index">
                    <div class="poster-container"></div>
                    <h5 class="text-lg text-line-normal">后来的外卖</h5>
                    <div class="text-sm text-gray text-line-20 m-t-sm">导演: 刘若英</div>
                    <div class="text-sm text-gray text-line-20">主演: 周冬雨,井柏然</div>
                    <div class="text-sm text-gray text-line-20">类型: 剧情,爱情 <span class="pull-right text-xs text-orange">32543次观看</span></div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                history: [],
                searchText: ''
            }
        },
        methods: {
            doSearch () {
                console.log(this.searchText)
                this.history.push(this.searchText)
                wx.setStorage({
                    key: 'history',
                    data: this.history
                })
            }
        },
        onShow () {
            let that = this
            wx.getStorage({
                key: 'history',
                success(res) {
                    console.log(res)
                    that.history = res.data || []
                },
                fail () {
                    that.history = []
                }
            })
        }
    }
</script>

<style scoped>
    .home-top-container {
        padding: 16rpx 58rpx 12rpx 62rpx;
    }
    .search-box {
        font-size: 28rpx;
        color: #b0b1b3;
        height: 68rpx;
        padding: 0 30rpx;
        line-height: 76rpx;
        border-radius: 34rpx;
        box-shadow: 0 4rpx 4rpx 0 rgba(0, 0, 0, 0.04), 0 0 4rpx 0 rgba(0, 0, 0, 0.12);
        background-color: #ffffff;
    }
    .search-input {
        height: 68rpx;
        line-height: 68rpx;
        padding-left: 10rpx;
    }
    .hot-search-item {
        display: inline-block;
        padding: 6rpx 18rpx;
        margin: 20rpx 16rpx 0 0;
        line-height: 48rpx;
        border-radius: 8rpx;
    }
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
