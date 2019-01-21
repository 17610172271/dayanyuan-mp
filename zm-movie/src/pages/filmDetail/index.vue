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
        <div class="search-result-container">
            <div class="m-b-sm bg-white search-result-item relative">
                <div class="poster-container"></div>
                <h5 class="text-lg text-line-normal">
                    后来的外卖
                    <i-icon type="like_fill" v-if="false" class="pull-right m-r-sm" size="20" color="#edeced" />
                    <i-icon type="like_fill" v-else class="pull-right m-r-sm" size="20" color="#ff4747" />
                </h5>
                <div class="text-gray text-sm">Us and Them</div>
                <div class="text-sm text-gray text-line-20 m-t-xs">导演: 刘若英</div>
                <div class="text-sm text-gray text-line-20">主演: 周冬雨,井柏然</div>
                <div class="text-sm text-gray text-line-20">类型: 剧情,爱情</div>
                <div class="text-sm text-gray text-line-20">上映: 2018-04-28</div>
                <div class="text-sm text-gray text-line-20">时长: 148分钟 <span class="pull-right text-xs text-orange">32543次观看</span></div>
            </div>
            <ul class="cinema-list-container bg-white">
                <li v-for="(item, index) in 10" :key="index" @click="nextPage" class="cinema-list-item border-bottom relative">
                    <h5 class="text-bold">卢米埃影城(芳草地店)</h5>
                    <div class="text-sm m-t-sm text-line-20">朝阳区东大桥路9号芳草地大厦LG-26</div>
                    <div class="text-gray text-sm m-t-xs">近期可观看场次：15:45 | 23:00</div>
                    <div class="price-container">
                        <div class="text-orange text-bold text-line-normal text-center">¥123起</div>
                        <div class="text-sm text-gray text-center">0.4km</div>
                    </div>
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
            },
            nextPage () {
                wx.navigateTo({
                    url: '../timeSelect/main'
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
        background-color: #f5f5f5;
    }
    .search-result-item {
        height: 340rpx;
        padding: 30rpx 20rpx 30rpx 240rpx;
    }
    .poster-container {
        width: 192rpx;
        height: 280rpx;
        border: 2rpx solid #000;
        position: absolute;
        top: 30rpx;
        left: 20rpx;
    }
    .cinema-list-container {
        padding: 0 20rpx;;
    }
    .cinema-list-item {
        height: 196rpx;
        padding: 30rpx 200rpx 30rpx 0;
    }
    .cinema-list-item h5 {
        font-size: 30rpx;
    }
    .price-container {
        position: absolute;
        top: 56rpx;
        right: 70rpx;
    }
</style>
