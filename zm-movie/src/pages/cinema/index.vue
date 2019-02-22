<template>
    <div>
        <div class="home-top-container relative">
            <div class="search-box">
                <i-icon type="search" class="pull-left search-box-icon" size="16" color="#ffa726" />
                <!--<i-input :value="searchText" i-class="search-input" maxLength="100" placeholder="搜索影片" />-->
                <form action="">
                    <input type="text" class="search-input" v-model="searchText" placeholder="搜索附近的影院" @confirm="searchCinemaList">
                </form>
            </div>
        </div>
        <div class="cinema-select-container">
            <ul>
                <li class="cinema-select-item relative" v-for="(item,index) in cinemaList" :key="item.id" @tap="selectCinema(item)">
                    <h5 class="text-lg text-line-normal text-bold">{{item.name}}</h5>
                    <div class="text-sm cinema-address">{{item.address}}</div>
                    <div class="text-sm text-gray">{{item.distance}}m</div>
                    <div class="location-icon icon-item"><i-icon type="coordinates_fill" class="icon-item" size="16" color="#fff" /></div>
                </li>
                <li class="text-orange text-center p-v-sm" v-if="cinemaList.length===0">暂时没有更多数据</li>
            </ul>
        </div>
        <i-toast id="toast" />
    </div>
</template>

<script type="text/ecmascript-6">
    import api from '@/api'
    export default {
        data () {
            return {
                city: '北京',
                cinemaList: [],
                page: 1,
                limit: 10,
                searchText: ''
            }
        },
        methods: {
            getCinemaList () {
                wx.showLoading({
                    title: '加载中',
                })
                this.$http.post(api.common.cinemaNearby, {
                    city_id: this.location.city_id,
                    longitude: this.location.location[0],
                    latitude: this.location.location[1]
                }).then((res) => {
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 500)
                    if (res.data.code === 1) {
                        this.cinemaList = res.data.data.cinemas
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            searchCinemaList () {
                wx.showLoading({
                    title: '加载中',
                })
                this.$http.post(api.common.cinemaList, {
                    keywords: this.searchText,
                    city: this.city,
                    longitude: this.location.location[0],
                    latitude: this.location.location[1],
                    limit: this.limit,
                    page: this.page
                }).then((res) => {
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 500)
                    if (res.data.code === 1) {
                        this.cinemaList = res.data.data.cinemas
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            selectCinema (cinemaInfo) {
                wx.setStorage({
                    key: 'cinemaInfo',
                    data: cinemaInfo
                })
                wx.navigateTo({
                    url: '../index/main'
                })
            }
        },
        onShow () {
            let that = this
            wx.getStorage({
                key: 'location',
                success(res) {
                    that.city = res.data.city.replace('市', '')
                    that.location = res.data
                    that.getCinemaList()
                },
                fail () {
                    that.getCinemaList()
                }
            })
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
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
</style>
