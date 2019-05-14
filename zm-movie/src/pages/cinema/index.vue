<template>
    <div>
        <div class="relative">
            <div class="search-box-container">
                <div class="cinema-info-container text-lg text-bold" style="padding: 34rpx 0 0 20rpx;color: #2a2a2a;" v-if="!searchPageShow"  @tap="nextCityPage">
                    {{city1}} <i-icon type="enter" size="16" color="#2a2a2a" />
                </div>
                <div class="search-box relative" :animation="animationSearch" @tap="searchShow">
                    <i-icon type="search" class="pull-left search-box-icon" size="16" color="#ffa726" />
                    <form action="" class="">
                        <input type="text" class="search-input search-ipt-container" confirm-type="search" v-model="searchText" :placeholder="placeholder" @confirm="doSearch">
                    </form>
                    <span class="search-cancel text-gray" v-if="searchPageShow" @click.stop="searchHide">取消</span>
                </div>
            </div>
        </div>
        <div class="cinema-select-container">
            <ul>
                <li class="cinema-select-item relative" v-for="(item,index) in cinemaList" :key="item.id" @tap="selectCinema(item)">
                    <h5 class="text-lg text-line-normal text-bold">{{item.name}}</h5>
                    <div class="text-sm cinema-address over-omit m-t-sm">{{item.address}}</div>
                    <div class="location-icon text-center text-gray">
                        <i-icon type="coordinates_fill" class="icon-item" size="20" color="#ffa726" />
                        <div class="text-center m-t-sm">{{item.distance_m}}</div>
                    </div>
                </li>
                <li class="text-orange text-center p-v-sm" v-if="cinemaList.length===0 || noData">没有更多数据</li>
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
                placeholder: '搜索',
                searchPageShow: false,
                animationSearch: '',
                city: '北京',
                city1: '北京市',
                cinemaList: [],
                page: 1,
                limit: 30,
                searchText: '',
                location: {
                    city: '北京',
                    city_id: '110000',
                    location: []
                },
                film_id: '',
                cinema_id: '',
                noData: false
            }
        },
        methods: {
            getCinemaList () {
                wx.showLoading({
                    title: '加载中',
                })
                this.$http.post(api.common.cinemaNearby, {
                    version: '1.0.0',
                    center: this.location.location.length === 2 ? this.location.location.join(',') : '116.403847,39.915526',
                    city: this.city || '北京',
                    limit: this.limit,
                    page: this.page,
                    radius: 50000,
                    keywords: this.searchText
                }).then((res) => {
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 500)
                    if (res.data.code === 1) {
                        if (this.cinemaList.length > 0) {
                            this.cinemaList = this.cinemaList.concat(res.data.data.cinemas).map(val => {
                                return {
                                    ...val,
                                    distance_m: val.distance > 1000 ? parseInt(val.distance / 100) / 10 + 'km' : val.distance + 'm'
                                }
                            })
                        } else {
                            this.cinemaList = res.data.data.cinemas.map(val => {
                                return {
                                    ...val,
                                    distance_m: val.distance > 1000 ? parseInt(val.distance / 100) / 10 + 'km' : val.distance + 'm'
                                }
                            })
                        }
                        if (res.data.data.cinemas.length > 0) {
                            this.page += 1
                        } else {
                            this.noData = true
                        }
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            doSearch () {
                this.page = 1
                this.cinemaList = []
                this.getCinemaList()
            },
            searchShow () {
                let animation = wx.createAnimation({
                    duration: 400,
                    timingFunction: "ease-in",
                    delay: 0,
                    transformOrigin: "50% 50%",

                })
                //设置动画
                animation.width('710rpx').step()
                this.animationSearch = animation.export()
                this.searchPageShow = true
            },
            searchHide () {
                let animation = wx.createAnimation({
                    duration: 400,
                    timingFunction: "ease-in",
                    delay: 0,
                    transformOrigin: "50% 50%",

                })
                //设置动画
                animation.width('160rpx').step()
                this.animationSearch = animation.export()
                this.searchText = ''
                this.searchPageShow = false
            },
            nextCityPage () {
                wx.navigateTo({
                    url: '../city/main'
                })
            },
            selectCinema (cinemaInfo) {
                wx.setStorage({
                    key: 'cinemaInfo',
                    data: cinemaInfo
                })
                if (this.film_id && this.cinema_id) {
                    wx.navigateBack({
                        url: '../timeSelect/main?id=' + this.film_id
                    })
                } else {
                    wx.reLaunch({
                        url: '../index/main?type=refresh'
                    })
                }
                
            },
        },
        onReachBottom () {
            this.getCinemaList()
        },
        onShow () {
            this.page = 1
            let that = this
            this.searchHide()
            this.cinemaList = []
            this.searchText = ''
            this.searchPageShow = false
            wx.getStorage({
                key: 'location',
                success(res) {
                    that.city = res.data.city.replace('市', '')
                    that.city1 = res.data.city
                    that.location = res.data
                    that.getCinemaList()
                },
                fail () {
                    that.getCinemaList()
                }
            })
        },
        onLoad (option) {
            this.cinema_id = option.cinema_id
            this.film_id = option.film_id
        },
        watch: {
            searchPageShow (val) {
                let that = this
                if (!val) {
                    this.placeholder = '搜索'
                } else {
                    this.placeholder = ''
                    setTimeout(function () {
                        that.placeholder = '搜索影院'
                    }, 400)
                }
            }
        }
    }
</script>

<style scoped>
    .search-box-container {
        height: 116rpx;
    }
    .search-box {
        font-size: 28rpx;
        color: #b0b1b3;
        height: 68rpx;
        padding: 0 108rpx 0 30rpx;
        line-height: 76rpx;
        border-radius: 34rpx;
        box-shadow: 0 4rpx 4rpx 0 rgba(0, 0, 0, 0.04), 0 0 4rpx 0 rgba(0, 0, 0, 0.12);
        background-color: #ffffff;
        position: absolute;
        top: 10rpx;
        right: 20rpx;
        width: 160rpx;
        overflow: hidden;
    }
    .search-input {
        height: 68rpx;
        line-height: 68rpx;
        padding-left: 10rpx;
        color: #666;
    }
    .search-box .search-box-icon {
        margin-top: -4rpx;
    }
    .search-cancel {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 12px;
        display: inline-block;
        text-align: center;
        height:70rpx;
        line-height:70rpx;
        padding: 0 30rpx 0 50rpx;
        z-index: 9999;
    }
    .cinema-select-container {
        padding: 0 20rpx 30rpx;
    }
    .cinema-select-item {
        height: 152rpx;
        border-radius: 2px;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.11), 0 0 2px 0 rgba(0, 0, 0, 0.12);
        margin-bottom: 10rpx;
        padding: 24rpx 130rpx 20rpx 14rpx;
    }
    .cinema-address {
        color: #484848;
        line-height: 36rpx;
        padding: 4rpx 0;
    }
    .location-icon {
        position: absolute;
        top: 40rpx;
        right: 30rpx;
        border-radius: 50%;
        width: 50px;
        height: 50px;
    }
    .search-ipt-container {
        position: absolute;
        top: 1px;
        left: 28px;
        min-width: 40px;
        width: 80%;
    }
</style>
