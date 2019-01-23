<template>
    <div>
        <!--搜索-->
        <div class="home-top-container bg-white relative">
            <a href="/pages/city/main" class="city-select">{{city}}<i-icon type="unfold" size="14" style="margin-left: 6rpx;" color="#030303" /></a>
            <div class="search-box" style="margin-top: 2rpx;" @click="goSearch">
                <i-icon type="search" size="16" color="#ffa726" />
                搜索影片
            </div>
            <a href="/pages/cinema/main" class="cinema-select"><i-icon type="other" size="34" color="#030303" /></a>
        </div>
        <div class="p-o-sm relative" v-if="cinemaInfo">
            <div class="text-line-normal">{{cinemaInfo.name}} <span class="text-sm text-gray">距我{{cinemaInfo.distance}}m</span></div>
            <div class="text-line-normal text-sm text-gray">{{cinemaInfo.address}}</div>
            <div class="cinema-location"><i-icon type="coordinates_fill" size="20" color="#ffa726" /></div>
        </div>
        <!--轮播-->
        <swiper
            class="swiper-container m-t-sm"
            :indicator-dots="indicatorDots"
            :autoplay="autoplay"
            :interval="interval"
            :duration="duration"
            indicator-active-color="#ef6c00">
            <block v-for="(item, index) in imgUrls" :key="item.id">
                <swiper-item class="swiper-container">
                    <image :src="item.image_url" class="slide-image" mode="widthFix" />
                </swiper-item>
            </block>
        </swiper>
        <!--分类-->
        <scroll-view scroll-x class="hotplay-title-container">
            <span class="title-normal" :class="{'title-select': selectedClass===item.category}" v-for="(item, index) in classList" :key="index" @click="selectClass(item.category)">{{item.category}}</span>
        </scroll-view>
        <div>
            <scroll-view scroll-x class="hotplay-container">
                <div class="image-container" v-for="(item, index) in selectedClassList" :key="item.id" @click="selectCinema(item.id)">
                    <div class="image-item-container"><image :src="item.image_url" class="slide-image" mode="scaleToFill"></image></div>
                    <div class="title-text title-p over-omit">{{item.title}}</div>
                    <div class="subtitle-text p-l-sm">{{item.viewer || 0}}次观看</div>
                </div>
            </scroll-view>
        </div>
        <div class="border m-t-md"></div>
        <!--每日推荐-->
        <div>
            <h3 class="day-recommend">每日推荐·你想看的都在这里</h3>
            <div>
                <div class="first-image-container" @click="selectCinema(recommend.id)">
                    <div class="first-image"><image :src="recommend.image_url" class="slide-image" mode="widthFix"></image></div>
                    <div>
                        <div class="title-text m-t-sm p-l-sm">{{recommend.title}}</div>
                        <div class="subtitle-text p-l-sm" style="margin-top: 4rpx;">{{recommend.subtitleZ}}次观看</div>
                    </div>
                </div>
            </div>
            <div class="m-t-sm p-o-sm">
                <i-row>
                    <i-col span="8" i-class="col-class" v-for="(item, index) in moreList" :key="item.id" @click="selectCinema(item.id)">
                        <div :class="{'p-r-xs': index%3==0,'p-l-xs': index%3==2,'p-o-xxs': index%3==1}" class="m-b-md">
                            <div class="recommend-image-container"><image :src="item.image_url" class="slide-image" mode="scaleToFill"></image></div>
                            <div>
                                <div class="title-text m-t-sm over-omit">{{item.film_name}}</div>
                                <div class="subtitle-text" style="margin-top: 4rpx;">{{item.viewer}}次观看</div>
                            </div>
                        </div>
                    </i-col>
                </i-row>
            </div>
            <div class="p-sm" v-show="loading || divideShow">
                <i-load-more i-class="devide-container" tip="没有更多数据了" :loading="loading" />
            </div>
        </div>
        <i-modal i-class="notice-modal" :visible="modal" ok-text="去预定" cancel-text="再看看" @ok="doOk" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(../../../static/img/3@3x.png);background-repeat: no-repeat;background-size: 100% 156px;padding:40px;">
                <div class="text-xlg">您没有可用的观影券 <br> 请先预定</div>
            </div>
        </i-modal>
        <i-modal i-class="notice-modal" :visible="modal1" ok-text="知道了" cancel-text="去导航" @ok="doOk1" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(../../../static/img/3@3x.png);background-repeat: no-repeat;background-size: 100% 156px;padding:40px;">
                <div class="text-xlg">不是该影仓观影券 <br> 请您到2号影仓</div>
            </div>
        </i-modal>
        <i-modal i-class="notice-modal" :visible="modal2" ok-text="知道了" cancel-text="再来一单" @ok="doOk2" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(../../../static/img/3@3x.png);background-repeat: no-repeat;background-size: 100% 156px;padding:20px;">
                <div class="text-md">离观影时间还有: <br> <span class="text-xlg text-orange">30分钟</span> <br> <span class="">(请在观影前10分钟内打开舱门)</span></div>
            </div>
        </i-modal>
        <i-modal i-class="notice-modal" :visible="modal3" ok-text="知道了" cancel-text="去登陆" @ok="doOk3" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(../../../static/img/3@3x.png);background-repeat: no-repeat;background-size: 100% 156px;padding:40px;">
                <div class="text-xlg">您还没有登录 <br> 请先登录</div>
            </div>
        </i-modal>
        <i-modal i-class="notice-modal" :visible="modal4" ok-text="再看看" cancel-text="去预定" @ok="doOk4" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(../../../static/img/3@3x.png);background-repeat: no-repeat;background-size: 100% 156px;padding:40px;">
                <div class="text-xlg p-v-sm">您没有该影院的订单</div>
            </div>
        </i-modal>
        <i-toast id="toast" />
        <i-tab-bar :current="currentTab" @change="tabChange" :fixed="true" color="#ef6c00">
            <i-tab-bar-item key="homepage" img="/static/img/ic-hot-nor@3x.png" current-img="/static/img/ic-hot-cat@3x.png" title="热映"></i-tab-bar-item>
            <i-tab-bar-item key="code" icon="scan" current-icon="scan" title="扫码"></i-tab-bar-item>
            <i-tab-bar-item key="mine" img="/static/img/ic-me-nor@3x.png" current-img="/static/img/ic-me@3x.png" title="我的"></i-tab-bar-item>
        </i-tab-bar>
    </div>
</template>

<script type="text/ecmascript-6">
import api from '@/api'
export default {
    data () {
        return {
            city: '北京',
            cinemaInfo: '',
            imgUrls: [],
            classList: [],
            selectedClass: '',
            selectedClassList: [],
            recommend: {},
            moreList: [],
            page: 1,
            page_size: 12,
            loading: true,
            divideShow: false,
            currentTab: 'homepage',
            indicatorDots: true,
            autoplay: true,
            interval: 3000,
            duration: 1000,
            modal: false,
            modal1: false,
            modal2: false,
            modal3: false,
            modal4: false,
        }
    },
    methods: {
        getData () {
            this.getBannerList()
            this.getClassList()
            this.getRecommondList()
            this.getMoreList()
        },
        getBannerList () {
            this.$http.post(api.film.banner, {
                version: '1.0.0',
                client_type: 3
            }).then((res) => {
                if (res.data.code === 1) {
                    this.imgUrls = res.data.data
                } else {
                    this.$Toast({
                        content: res.data.msg,
                        type: 'error'
                    })
                }
            })
        },
        getClassList () {
            this.$http.post(api.film.class, {
                version: '1.0.0'
            }).then((res) => {
                if (res.data.code === 1) {
                    this.classList = res.data.data
                    this.selectedClass = this.classList[0].category
                    this.selectedClassList = this.classList[0].films
                } else {
                    this.$Toast({
                        content: res.data.msg,
                        type: 'error'
                    })
                }
            })
        },
        getRecommondList () {
            this.$http.post(api.film.recommend, {
                version: '1.0.0'
            }).then((res) => {
                if (res.data.code === 1) {
                    this.recommend = res.data.data
                } else {
                    this.$Toast({
                        content: res.data.msg,
                        type: 'error'
                    })
                }
            })
        },
        getMoreList () {
            this.loading = true
            this.$http.post(api.film.more, {
                version: '1.0.0',
                page: this.page,
                page_size: this.page_size
            }).then((res) => {
                this.loading = false
                if (res.data.code === 1) {
                    this.moreList = this.moreList.concat(res.data.data.films)
                    if (res.data.data.films.length === 0) this.divideShow = true
                } else {
                    this.$Toast({
                        content: res.data.msg,
                        type: 'error'
                    })
                }
            })
        },
        selectClass (className) {
            this.selectedClass = className
            this.classList.map(val => {
                if (val.category === className) {
                    this.selectedClassList = val.films
                }
            })
        },
        selectCinema (id) {
            wx.navigateTo({
                url: '../filmDetail/main?id=' + id
            })
        },
        goSearch () {
            wx.navigateTo({
                url: '../search/main'
            })
        },
        doOk () {
            this.modal = false
        },
        doCancel () {
            this.modal = false
            this.modal1 = false
            this.modal2 = false
            this.modal3 = false
            this.modal4 = false
        },
        doOk1 () {
            this.modal1 = false
        },
        doOk2 () {
            this.modal2 = false
        },
        doOk3 () {
            this.modal3 = false
        },
        doOk4 () {
            this.modal4 = false
        },
        tabChange (detail) {
            if (detail.mp.detail.key == 'code') {
                wx.scanCode({
                    success(res) {
                        console.log(res)
                    }
                })
            } else if (detail.mp.detail.key == 'mine') {
                wx.navigateTo({
                    url: '../mineHome/main'
                })
            } else {
                wx.navigateTo({
                    url: '../index/main'
                })
            }
        },
        getCinemaInfo () {
            let that = this
            wx.getStorage({
                key: 'cinemaInfo',
                success(res) {
                    that.cinemaInfo = res.data || ''
                },
                fail () {
                    that.cinemaInfo = ''
                }
            })
        },
        getUserInfo () {
            wx.getUserInfo({
                success(res) {
                    console.log(res)
                }
            })
        }
    },
    onReachBottom () {
        this.page += 1
        this.getMoreList()
    },
    onShow () {
        this.getData()
        this.getCinemaInfo()
    },
    onLoad () {
//        获取appId
        let accountInfo = wx.getAccountInfoSync()
        wx.setStorage({
            key: 'appId',
            data: accountInfo.miniProgram.appId
        })
        let that = this
//        获取用户信息及地理位置授权并存储城市位置信息
        wx.getSetting({
            success(res) {
//                获取用户资料
                if (res.authSetting['scope.userInfo']) {
                    that.getUserInfo()
                } else {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success () {
                            that.getUserInfo()
                        }
                    })
                }
//                获取位置信息
                if (!res.authSetting['scope.userLocation']) {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success() {
                            wx.getLocation({
                                type: 'wgs84',
                                success(res) {
                                    let location = [res.longitude, res.latitude]
                                    let city = ''
                                    let id = ''
                                    that.$http.get('https://restapi.amap.com/v3/geocode/regeo?output=json&location=' + res.longitude + ',' + res.latitude + '&key=f9bc06292ee628b75291ba3922f65ed4&extensions=all').then((res) => {
                                        that.city = city = res.data.regeocode.addressComponent.city.length === 0 ? res.data.regeocode.addressComponent.province : res.data.regeocode.addressComponent.city
                                        wx.setStorage({
                                            key: 'location',
                                            data: {
                                                location: location,
                                                city: city,
                                                city_id: id
                                            }
                                        })
                                        that.$http.post(api.common.cityList, {
                                            version: '1.0.0'
                                        }).then((res) => {
                                            if (res.data.code === 1) {
                                                res.data.data.cities.map(val => {
                                                    if (val.city === city) {
                                                        id = val.id
                                                        wx.setStorage({
                                                            key: 'location',
                                                            data: {
                                                                location: location,
                                                                city: city,
                                                                city_id: id
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    }
}
</script>

<style scoped>
    .home-top-container {
        padding: 0 94rpx 20rpx 130rpx;
    }
    .city-select {
        position: absolute;
        left: 0;
        top: 0;
        padding: 20rpx 18rpx;
        font-size: 28rpx;
        color: #030303;
    }
    .cinema-select {
        position: absolute;
        top: 0;
        right: 0;
        padding: 4rpx 14rpx;
    }
    .swiper-container {
        width: 100%;
        height: 364rpx;
    }
    .hotplay-title-container {
        padding: 34rpx 18rpx 32rpx 18rpx;
        line-height: 48rpx;
        white-space: nowrap;
    }
    .title-normal {
        color: #9a9a9a;
        margin-right: 40rpx;
        font-size: 32rpx;
    }
    .title-select {
        font-size: 36rpx;
        color: #454545;
        font-weight: bold;
    }
    .image-container {
        width: 200rpx;
        display: inline-block;
        margin-right: 8rpx;
    }
    .image-item-container {
        width: 200rpx;
        height: 324rpx;
        border-radius: 8rpx;
        overflow: hidden;
    }
    .hotplay-container {
        white-space: nowrap;
    }
    .title-p {
        padding: 16rpx 0 4rpx 20rpx;
    }
    .day-recommend {
        font-size: 36rpx;
        line-height: 48rpx;
        font-weight: bold;
        padding: 32rpx 0 40rpx 20rpx;
    }
    .first-image {
        height: 340rpx;
        overflow: hidden;
    }
    .recommend-image-container {
        height: 316rpx;
        border-radius: 8rpx;
        overflow: hidden;
    }
    .p-r-xs {
        padding-right: 10rpx;
    }
    .p-o-xxs {
        padding-left: 5rpx;
        padding-right: 5rpx;
    }
    .p-l-xs {
        padding-left: 10rpx;
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
    .cinema-location {
        position: absolute;
        top: 20rpx;
        right: 20rpx;
    }

</style>
