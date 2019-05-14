<template>
    <div class="">
        <!--搜索-->
        <div class="home-location-container">
            <div class="cinema-info-container" v-if="!searchPageShow" @tap="nextCinemaPage">
                <div class="text-lg">{{cinemaInfo.name || '附近暂无影院' }}<i-icon color="#030303" type="enter" /></div>
                <div class="text-xs text-gray p-v-sm" v-show="cinemaInfo.distance">距您{{(cinemaInfo.distance > 1000 ? (cinemaInfo.distance / 100  | Int) / 10 + 'km' : cinemaInfo.distance + 'm') || ''}}</div>
                <div class="sm text-gray over-omit">{{cinemaInfo.city}}{{cinemaInfo.address}}</div>
            </div>
            <div class="search-box relative" :animation="animationSearch" @tap="searchShow">
                <i-icon type="search" class="pull-left search-box-icon" size="16" color="#ffa726" />
                <form action="">
                    <input type="text" class="search-input search-ipt-container" confirm-type="search" v-model="searchText" :placeholder="placeholder" @confirm="doSearch">
                </form>
                <span class="search-cancel text-gray" v-if="searchPageShow" @click.stop="searchHide">取消</span>
            </div>
        </div>
        <div class="home-search-container" v-show="searchPageShow">
            <div class="m-t-xs p-o-sm" v-if="listShow">
                <div v-show="hotKeys.length>0">
                    <div class="search-top-head text-line-normal text-gray text-md">热门搜索</div>
                    <div>
                        <span class="hot-search-item bg-eee" v-for="(item, index) in hotKeys" :key="index" @tap="selectItem(item)">{{item}}</span>
                    </div>
                </div>
                <div>
                    <div class="search-top-head text-line-normal text-gray text-md" style="margin-top: 30rpx;">历史搜索 <span class="pull-right clear-btn" @tap="clearHistory">清除</span></div>
                    <div>
                        <span class="hot-search-item bg-eee" v-for="(item, index) in history" :key="index" @tap="selectItem(item)">{{item}}</span>
                    </div>
                </div>
            </div>
            <div class="search-result-container" v-else>
                <ul>
                    <li class="m-b-sm bg-white search-result-item relative" @tap="selectCinema(item.id)" v-for="(item,index) in data" :key="item.id">
                        <div class="poster-container"><image :lazy-load="true" :src="item.image_url" v-if="item.image_url" class="slide-image" mode="scaleToFill"></image></div>
                        <h5 class="text-lg text-line-normal over-omit">{{item.film_name}}</h5>
                        <div class="text-sm text-gray text-line-20 m-t-sm over-omit">导演: {{item.director}}</div>
                        <div class="text-sm text-gray text-line-20 over-omit">主演: {{item.actor}}</div>
                        <div class="text-sm text-gray text-line-20 over-omit">类型: {{item.clazz}} <span class="pull-right text-xs text-orange">{{item.viewer || 0}}次观看</span></div>
                    </li>
                    <li class="text-orange p-sm text-center" v-if="data.length===0">没有搜索到影片</li>
                </ul>
            </div>
        </div>
        <div class="home-content-container m-b-lg" v-show="!searchPageShow">
            <div v-for="(plate, plate_id) in homeData" :key="plate.id">
                <!--轮播-->
                <div v-if="plate.style_type==1" class="border-bottom">
                    <swiper
                        class="swiper-container bg-eee"
                        :indicator-dots="indicatorDots"
                        :autoplay="autoplay"
                        :interval="interval"
                        :duration="duration"
                        :circular="circular"
                        indicator-active-color="#ef6c00">
                        <block v-for="(item, index) in plate.info" :key="item.id">
                            <swiper-item class="swiper-container" @tap="nextTopicPage(item)">
                                <image :lazy-load="true" :src="item.pic_url" class="slide-image" mode="widthFix" />
                            </swiper-item>
                        </block>
                    </swiper>
                </div>
                <!--榜单-->
                <div v-if="plate.style_type==2" class="border-bottom p-b-sm">
                    <div class="scroll-x-container">
                        <scroll-view scroll-x class="hotplay-title-container">
                            <div style="height: 50rpx;" :class="{'bg-eee': classList.length==0}">
                                <span class="title-normal" :class="{'title-select': selectedClass===item.plate_name}" v-for="(item, index) in classList" :key="index" @tap="selectClass(item.plate_name, item.info[0].id)">{{item.plate_name}}</span>
                            </div>
                        </scroll-view>
                    </div>
                    <div>
                        <scroll-view scroll-x class="hotplay-container" :scroll-into-view="viewTo">
                            <div class="image-container relative" style="padding-top: 7px;vertical-align: top;" v-for="(item, index) in selectedClassList" :key="item.id" :id="item.id" @tap="selectCinema(item.id)">
                                <div class="image-item-container bg-eee relative">
                                    <image :lazy-load="true" :src="item.pic_url" class="slide-image" mode="scaleToFill"></image>
                                    <div class="home-score-container">{{item.tips}}</div>
                                </div>
                                <div class="title-text title-p over-omit">{{item.title}}</div>
                                <div class="subtitle-text p-l-sm over-omit">{{item.subtitle}}</div>
                                <div class="num-icon num-icon1"v-if="index===0">NO.1</div>
                                <div class="num-icon num-icon2" v-else-if="index===1">NO.2</div>
                                <div class="num-icon num-icon3" v-else-if="index===2">NO.3</div>
                                <div class="num-icon num-icon4" v-else>NO.{{index + 1}}</div>
                            </div>
                        </scroll-view>
                    </div>
                </div>
                
                <!-- <div class="border m-t-md"></div> -->
                <!-- 推荐一 -->
                <div v-if="plate.style_type==3" class="border-bottom p-b-sm">
                    <h3 class="day-recommend"><span class="day-recommend-img"></span>{{plate.plate_name}}</h3>
                    <scroll-view scroll-x class="hotplay-container">
                        <div class="image-container vertical-top" v-for="(item, index) in plate.info" :key="item.id" @tap="selectCinema(item.id)">
                            <div class="image-item-container bg-eee relative">
                                <image :lazy-load="true" :src="item.pic_url" class="slide-image" mode="scaleToFill"></image>
                                <div class="home-score-container">{{item.tips}}</div>
                            </div>
                            <div class="title-text title-p over-omit">{{item.title}}</div>
                            <div class="subtitle-text p-l-sm over-omit" style="margin-top: 4rpx;height:20rpx;">{{item.subtitle}}</div>
                        </div>
                    </scroll-view>
                </div>
                <!--推荐二-->
                <div v-if="plate.style_type==4" class="border-bottom p-b-sm">
                    <h3 class="day-recommend"><span class="day-recommend-img"></span>{{plate.plate_name}}</h3>
                    <div class="">
                        <i-row>
                            <i-col span="8" i-class="col-class vertical-top" v-for="(item, index) in plate.info" :key="item.id" @tap="selectCinema(item.id)">
                                <div :class="{'p-o-xxs': index%3==1}" class="m-b-md">
                                    <div class="recommend-image-container bg-eee relative">
                                        <image :lazy-load="true" :src="item.pic_url" class="slide-image" mode="scaleToFill"></image>
                                        <div class="home-score-container">{{item.tips}}</div>
                                    </div>
                                    <div>
                                        <div class="title-text m-t-sm over-omit">{{item.title}}</div>
                                        <div class="subtitle-text over-omit" style="margin-top: 4rpx;height:20rpx;">{{item.subtitle}}</div>
                                    </div>
                                </div>
                            </i-col>
                        </i-row>
                    </div>
                    <!-- <div class="p-sm" style="padding-bottom: 60rpx;" v-show="loading">
                        <i-load-more i-class="devide-container" tip="上拉加载更多" :loading="loading" />
                    </div> -->
                </div>
                <!-- 推荐三 -->
                <div class="border-bottom p-b-sm" v-if="plate.style_type == 5">
                    <h3 class="day-recommend"><span class="day-recommend-img"></span>{{plate.plate_name}}</h3>
                    <div class="">
                        <i-row>
                            <i-col span="12" i-class="col-class vertical-top" v-for="(item, index) in plate.info" :key="item.id" @tap="selectCinema(item.id)">
                                <div :class="{'p-r-xs': index%2==0,'p-l-xs': index%2==1}" class="m-b-sm">
                                    <div class="recommend3-image-container bg-eee relative">
                                        <image :lazy-load="true" :src="item.pic_url" class="slide-image" mode="widthFix"></image>
                                        <div class="home-score-container">{{item.tips}}</div>
                                    </div>
                                    <div>
                                        <div class="title-text m-t-xs over-omit">{{item.title}}</div>
                                        <div class="subtitle-text over-omit" style="margin-top: 4rpx;height:20rpx;">{{item.subtitle}}</div>
                                    </div>
                                </div>
                            </i-col>
                        </i-row>
                    </div>
                </div>
                <!-- 专题一 -->
                <div class="border-bottom p-b-sm" v-if="plate.style_type == 6">
                    <h3 class="day-recommend"><span class="day-recommend-img"></span>{{plate.plate_name}}</h3>
                    <div class="">
                        <i-row>
                            <i-col span="12" i-class="col-class vertical-top" v-for="(item, index) in plate.info" :key="item.id" @tap="nextTopicPage(item)">
                                <div :class="{'p-r-xxs': index%2==0}" class="m-b-sm">
                                    <div class="recommend3-image-container bg-eee">
                                        <image :lazy-load="true" :src="item.pic_url" class="slide-image" mode="widthFix"></image>
                                    </div>
                                    <div>
                                        <div class="title-text m-t-xs over-omit">{{item.title}}</div>
                                        <div class="subtitle-text over-omit" style="margin-top: 4rpx;height:20rpx;">{{item.subtitle}}</div>
                                    </div>
                                </div>
                            </i-col>
                        </i-row>
                    </div>
                    <div class="text-center text-orange" @tap="changeTopic(plate, plate_id)"><span><i-icon type="refresh" size="16" color="#ffa726" />换一换</span></div>
                </div>
                <!-- 专题二 -->
                <div class="border-bottom p-b-sm" v-if="plate.style_type == 7">
                    <h3 class="day-recommend"><span class="day-recommend-img"></span>{{plate.plate_name}}</h3>
                    <div class="">
                        <swiper
                            class="swiper-container bg-eee"
                            :indicator-dots="indicatorDots"
                            :autoplay="autoplay"
                            :interval="interval"
                            :duration="duration"
                            :circular="circular"
                            indicator-active-color="#ef6c00">
                            <block v-for="(item, index) in plate.info" :key="item.id">
                                <swiper-item class="swiper-container" @tap="nextTopicPage(item)">
                                    <image :lazy-load="true" :src="item.pic_url" class="slide-image" mode="widthFix" />
                                </swiper-item>
                            </block>
                        </swiper>
                    </div>
                </div>
            </div>
            <div class="p-v-sm text-sm text-gray text-center" v-if="loadall" style="padding-bottom: 100rpx;">────── 已经加载完毕 ──────</div>
        </div>
        
        <i-modal i-class="notice-modal" :visible="modal" ok-text="去预定" cancel-text="再看看" @ok="doOk" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(https://img01.wanfangche.com/public/upload/201901/29/5c4fc50127400.png);background-repeat: no-repeat;background-size: 100% 156px;padding:40px;">
                <div class="text-xlg">您没有可用的观影券 <br> 请先预定</div>
            </div>
        </i-modal>
        <i-modal i-class="notice-modal" :visible="modal1" ok-text="再来一单" cancel-text="知道了" @ok="doOk" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(https://img01.wanfangche.com/public/upload/201901/29/5c4fc50127400.png);background-repeat: no-repeat;background-size: 100% 156px;padding:40px;">
                <div class="text-xlg">不是该影仓观影券 <br> 请您到{{orderInfo && orderInfo.hall_name}}</div>
            </div>
        </i-modal>
        <i-modal i-class="notice-modal" :visible="modal2" ok-text="再来一单" cancel-text="知道了" @ok="doOk" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(https://img01.wanfangche.com/public/upload/201901/29/5c4fc50127400.png);background-repeat: no-repeat;background-size: 100% 156px;padding:20px;">
                <div class="text-md">离观影时间还有: <br> <span class="text-xlg text-orange">{{orderInfo && orderInfo.count_down}}</span> <br> <span class="">(请在观影前15分钟内打开舱门)</span></div>
            </div>
        </i-modal>
        <i-toast id="toast" />
        <i-tab-bar :current="currentTab" @change="tabChange" :fixed="true" color="#ef6c00" v-if="!searchPageShow">
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
            isRequest: false,
            placeholder: '搜索',
            refresh: false,
            city: '北京',
            city_id: '110000',
            cinemaInfo: {
                distance : 0
            },
            homeData: [],
            classList: [],
            location: [],
            selectedClass: '',
            selectedClassList: [],
            page: 1,
            page_size: 3,
            loadall: false,
            loading: true,
            currentTab: 'homepage',
            indicatorDots: true,
            autoplay: true,
            interval: 3000,
            duration: 1000,
            circular: true,
            modal: false,
            modal1: false,
            modal2: false,
            userInfo: '',
            searchPageShow: false,
            listShow: true,
            animationSearch: '',
            searchText: '',
            history: [],
            data: [],
            search_page: 1,
            search_page_size: 30,
            hotKeys: [],
            orderInfo: {
                count_down: 0
            },
            viewTo: ''
        }
    },
    methods: {
        getHomeList () {
            wx.showLoading({
              title: '加载中',
            })
            this.$http.post(api.film.home, {
                version: '1.0.0',
                client_type: 3,
                city_id: this.city_id || '',
                page: this.page,
                page_size: this.page === 1 ? 5 : this.page_size
            }).then((res) => {
                setTimeout(function () {
                    wx.hideLoading()
                }, 500)
                if (res.data.code === 1) {
                    if (this.homeData.length > 0 && res.data.data.page > 1) {
                        this.homeData = this.homeData.concat(res.data.data.item)
                    } else if (res.data.data.page === 1) {
                        this.homeData = res.data.data.item
                        this.classList = []
                        this.selectedClassList = []
                    }
                    if (res.data.data.item.length > 0) {
                        this.page = res.data.data.page + 1
                        this.loadall = false
                    } else {
                        this.loadall = true
                    }
                    let rankArr = []
                    this.homeData.map((val, index) => {
                        if (val.style_type === '2') {
                            this.classList.push(val)
                            rankArr.push(index)
                        }
                    })
                    if (this.classList.length > 0) {
                        this.selectedClassList = this.classList[0].info
                        this.selectedClass = this.classList[0].plate_name
                        this.homeData.splice(rankArr[0], rankArr.length, {style_type: '2'})
                    }
                } else {
                    this.$Toast({
                        content: res.data.msg,
                        type: 'error'
                    })
                }
            })
        },

        // 搜索
        getSearchList (type) {
            wx.showLoading({
                title: '加载中',
            })
            this.$http.post(api.film.searchResult, {
                version: '1.0.0',
                title: this.searchText,
                page: this.search_page,
                page_size: this.search_page_size
            }).then(res => {
                setTimeout(function () {
                    wx.hideLoading()
                }, 500)
                this.listShow = false
                if (res.data.code === 1) {
                    if (type) {
                        this.data = this.data.concat(res.data.data.films)
                    } else {
                        this.data = res.data.data.films
                    }
                    if (res.data.data.films.length > 0) {
                        this.search_page += 1
                    }
                } else {
                    this.data = []
                    this.$Toast({
                        content: res.data.msg,
                        type: 'error'
                    })
                }
            })
        },
        getCinemaList () {
            let that = this
            wx.getStorage({
                key: 'cinemaInfo',
                success(res) {
                    that.cinemaInfo = res.data || {}
                },
                fail () {
                    that.$http.post(api.common.cinemaNearby, {
                        version: '1.0.0',
                        center: that.location.length === 2 ? that.location.join(',') : '116.403847,39.915526',
                        city: that.city || '北京',
                        limit: 1,
                        page: 1,
                        radius: 50000,
                        keywords: ''
                    }).then(res => {
                        if (res.data.code === 1) {
                            that.cinemaInfo = res.data.data.cinemas[0] || {}
                            wx.setStorage({
                                key: 'cinemaInfo',
                                data: res.data.data.cinemas[0] || {}
                            })
                        } else {
                            that.cinemaInfo = {}
                            that.$Toast({
                                content: res.data.msg,
                                type: 'error'
                            })
                        }
                    })
                }
            })
        },
        getHotKeys () {
            this.$http.post(api.film.hotKeys, {
                version: '1.0.0'
            }).then(res => {
                if (res.data.code === 1) {
                    this.hotKeys = res.data.data
                } else {
                    this.hotKeys = []
                    this.$Toast({
                        content: res.data.msg,
                        type: 'error'
                    })
                }
            })
        },
        selectItem (keywords) {
            this.searchText = keywords
            this.doSearch()
        },
        clearHistory () {
            this.history = []
            wx.setStorage({
                key: 'history',
                data: this.history
            })
        },
        doSearch () {
            this.search_page = 1
            this.getSearchList()
            if (this.searchText && this.history.indexOf(this.searchText) === -1) {
                this.history.push(this.searchText)
                wx.setStorage({
                    key: 'history',
                    data: this.history
                })
            }
        },
        nextCinemaPage () {
            wx.navigateTo({
                url: '../cinema/main'
            })
        },
        nextPage (id) {
            wx.navigateTo({
                url: '../filmIntro/main?id=' + id
            })
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
            this.searchPageShow = false
        },
        selectClass (className, id) {
            this.selectedClass = className
            this.classList.map(val => {
                if (val.plate_name === className) {
                    this.selectedClassList = val.info
                }
            })
            this.viewTo = id
        },
        selectCinema (id) {
            wx.navigateTo({
                url: '../timeSelect/main?id=' + id
            })
        },
        nextTopicPage (item) {
            if (item.content_url.indexOf('web/webview') > -1) {
                let url = decodeURIComponent(item.content_url.slice(item.content_url.indexOf('web/webview') + 16)).replace('?', '&')
                wx.navigateTo({
                    url: '../webview/main?website=' + url
                })
                console.log(url)
            } else {
                this.selectCinema(item.id)
            }
            
        },
        doOk () {
            this.modal = false
            this.modal1 = false
            this.modal2 = false
        },
        doCancel () {
            this.modal = false
            this.modal1 = false
            this.modal2 = false
        },
        tabChange (detail) {
            let that = this
            if (detail.mp.detail.key == 'code') {
                // 扫码开舱
                wx.scanCode({
                    success(res) {
                        let hall_id = res.result.slice(res.result.indexOf('hall_id=')).split('=')[1]
                        if (!hall_id) {
                            that.$Toast({
                                content: '请扫描正确的二维码',
                                type: 'error'
                            })
                            return
                        }
                        that.$http.post(api.common.open, {
                            version: '1.0.0',
                            hall_id: hall_id
                        }, {
                            headers: {
                                'AuthToken': that.userInfo.auth_token
                            }
                        }).then((res) => {
                            if (res.data.code === 1) {
                                // 允许控制
                                wx.setStorage({
                                    key: 'hall_id',
                                    data: {
                                        hall_id: hall_id,
                                        trade_id: res.data.data[0].trade_id
                                    },
                                    success () {
                                        wx.navigateTo({
                                            url: '../mineDevice/main?id=' + hall_id + '&trade_id=' + res.data.data[0].trade_id
                                        })
                                    }
                                })
                                
                            } else if (res.data.code === 0) {
                                that.modal = true
                                that.orderInfo = res.data.data[0]
                            } else if (res.data.code === 2) {
                                that.modal2 = true
                                that.orderInfo = res.data.data[0]
                                that.$set(that.orderInfo, 'count_down', that.returnDate(parseInt((that.orderInfo.trade_start_time * 1000 - new Date().getTime()) / 1000 / 60)))
                            } else if (res.data.code === 3) {
                                that.modal1 = true
                                that.orderInfo = res.data.data[0]
                            } else {
                                that.$Toast({
                                    content: '未知异常',
                                    type: 'error'
                                })
                            }
                        })
                    }
                })
            } else if (detail.mp.detail.key == 'mine') {
                wx.reLaunch({
                    url: '../mineHome/main'
                })
            } else {
                wx.reLaunch({
                    url: '../index/main'
                })
            }
        },
        getCity () {
            this.isRequest = true
            let that = this
            wx.getStorage({
                key: 'location',
                success(res) {
                    that.city = res.data.city || '北京'
                    that.city_id = res.data.city_id
                    that.city = that.city.replace('市', '')
                    that.location = res.data.location
                    // if (that.city_id) that.getHomeList()
                    if (res.data.location && res.data.city) that.getCinemaList()
                    if (that.city.length > 2) {
                        that.city = that.city.slice(0, 2) + '..'
                    } else {
                        that.city = that.city
                    }
                    that.getLocation(1)
                },
                fail () {
                    that.city = '北京'
                    that.getLocation(2)
                }
            })
        },
        changeTopic (topic, index) {
            this.$http.post(api.film.topicChange, {
                version: '1.0.0',
                id: topic.id
            }).then((res) => {
                if (res.data.code === 1) {
                    this.homeData[index].info = res.data.data
                } else {
                    this.$Toast({
                        content: res.data.msg,
                        type: 'error'
                    })
                }
            })
        },
        returnDate (time) {
            time *= 1
            if (time > 1440) {
                return parseInt(time / 1440) + '天' + parseInt((time % 1440) / 60) + '小时' + time % 60 + '分钟'
            } else if (time > 60) {
                return parseInt(time / 60) + '小时' + time % 60 + '分钟'
            } else {
                return time + '分钟'
            }
        },
        getLocation (isLocation) {
            let that = this
            this.page = 1
            // 获取用户信息及地理位置授权并存储城市位置信息
            wx.getSetting({
                success(res) {
                // 获取位置信息
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success() {
                            wx.getLocation({
                                type: 'wgs84',
                                success(res) {
                                    let location = [res.longitude, res.latitude]
                                    that.location = [res.longitude, res.latitude]
                                    let city = ''
                                    let id = ''
                                    that.$http.get('https://restapi.amap.com/v3/geocode/regeo?output=json&location=' + res.longitude + ',' + res.latitude + '&key=602d412b5c8841798676c8fc4a8aa094&extensions=all').then((res) => {
                                        that.city = city = res.data.regeocode.addressComponent.city.length === 0 ? res.data.regeocode.addressComponent.province : res.data.regeocode.addressComponent.city
                                        if (isLocation === 2) {
                                            wx.setStorage({
                                                key: 'location',
                                                data: {
                                                    location: location,
                                                    city: city,
                                                    locationCity: city,
                                                    city_id: id
                                                }
                                            })
                                        }
                                        
                                        that.city = that.city.replace('市', '')
                                        that.getCinemaList()
                                        that.$http.post(api.common.cityList, {
                                            version: '1.0.0'
                                        }).then((res) => {
                                            if (res.data.code === 1) {
                                                let flag = false
                                                res.data.data.cities.map(val => {
                                                    if (val.city === city) {
                                                        flag = true
                                                        id = val.id ||val.city_code
                                                        that.city_id = id
                                                        that.getHomeList()
                                                        if (isLocation === 2) {
                                                            wx.setStorage({
                                                                key: 'location',
                                                                data: {
                                                                    location: location,
                                                                    city: city,
                                                                    locationCity: city,
                                                                    city_id: id
                                                                }
                                                            })
                                                        }
                                                        that.city = that.city.replace('市', '')
                                                    }
                                                })
                                                if (!flag) {
                                                    that.city_id = 110000
                                                    console.log(123)
                                                    that.getHomeList()
                                                    wx.setStorage({
                                                        key: 'location',
                                                        data: {
                                                            location: [116.403847,39.915526],
                                                            city: '北京市',
                                                            locationCity: '北京市',
                                                            city_id: 110000
                                                        }
                                                    })
                                                }
                                            } else {
                                                that.getHomeList()
                                            }
                                        })
                                    })
                                },
                                fail () {
                                    that.getCinemaList()
                                    that.getHomeList()
                                }
                            })
                        },
                        fail () {
                            that.getCinemaList()
                            that.getHomeList()
                        }
                    })
                }
            })
        }
    },
    onReachBottom () {
        if (this.searchPageShow) {
            this.getSearchList('more')
        } else {
            this.getHomeList()
        }
    },
    created () {
        let that = this
        // this.page = 1
        // this.listShow = true
        // this.getCity()
        this.getHotKeys()
        wx.login({
            success: function(res) {
                if (res.code) {
                    that.$http.post(api.common.login, {
                        version: '1.0.0',
                        device_no: res.code,
                        platform: 'wx',
                        openid: res.code
                    }).then((res) => {
                        if (res.data.code === 1) {
                            that.userInfo = res.data.data
                            wx.setStorage({
                                key: 'userInfo',
                                data: res.data.data
                            })
                        } else {
                            that.$Toast({
                                content: res.data.msg,
                                type: 'error'
                            })
                        }
                    })
                }
            }
        })
    },
    onShow () {
        let that = this
        if (this.refresh || this.homeData.length === 0) {
            this.getCity()
        }
        this.searchHide()
        this.searchPageShow = false
        this.listShow = true
        this.data = []
        this.searchText = ''
        
        // 获取搜索历史
        wx.getStorage({
            key: 'history',
            success(res) {
                that.history = res.data || []
            },
            fail () {
                that.history = []
            }
        })
    },
    onLoad (option) {
        this.refresh = option.type ? true : false
    },
    watch: {
        searchPageShow (val) {
            let that = this
            if (!val) {
                this.searchText = ''
                this.listShow = true
                this.placeholder = '搜索'
            } else {
                this.placeholder = ''
                setTimeout(function () {
                    that.placeholder = '搜索影片'
                }, 400)
            }
        }
    }
}
</script>

<style scoped>
    .home-location-container {
        height: 132rpx;
        padding: 0 16rpx;
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
        padding: 0 30rpx;
        z-index: 9999;
    }
    .swiper-container {
        width: 100%;
        height: 364rpx;
    }
    .scroll-x-container {
        overflow-x: hidden;
        padding: 34rpx 18rpx 30rpx 18rpx;
    }
    .hotplay-title-container {
        width: 100%;
        line-height: 48rpx;
        white-space: nowrap;
    }
    .title-text {
        padding-left: 20rpx;
    }
    .subtitle-text {
        padding-left: 20rpx;
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
        margin-right: 5rpx;
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
        padding: 32rpx 0 40rpx 16rpx;
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
    .recommend3-image-container {
        height: 216rpx;
        border-radius: 8rpx;
        overflow: hidden;
    }
    .p-r-xs {
        padding-right: 10rpx;
    }
    .p-r-xxs {
        padding-right: 5rpx;
    }
    .p-o-xxs {
        padding-left: 5rpx;
        padding-right: 5rpx;
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
        position: absolute;
        top: 20rpx;
        left: 20rpx;
    }
    .num-icon {
        position: absolute;
        top: 0;
        left: 0;
        width: 40px;
        height: 25px;
        background-size: cover;
        background-repeat: no-repeat;
        text-align: center;
        color: rgba(255,255,255,0.87);
        font-size: 10px;
        padding-top: 6px;
    }
    .num-icon1 {
        background-image: url(../../../static/img/bg-no-1-red@3x.png);
    }
    .num-icon2 {
        background-image: url(../../../static/img/bg-no-2-red@3x.png);
    }
    .num-icon3 {
        background-image: url(../../../static/img/bg-no-3-red@3x.png);
    }
    .num-icon4 {
        background-image: url(../../../static/img/bg-no-4-red@3x.png);
    }
    .day-recommend-img {
        display: inline-block;
        width: 36rpx;
        height: 32rpx;
        background: url(../../../static/img/zero-yellow@3x.png) no-repeat;
        background-size: cover;
        margin-right: 14rpx;
    }
    .search-ipt-container {
        min-width: 40px;
        position: absolute;
        top: 1px;
        left: 28px;
        width: 80%;
    }
    .vertical-top {
        vertical-align: top;
    }
    .clear-btn {
        border:1px solid #ddd;
        padding:0 10rpx;
        border-radius:10rpx;
        background-color:#f6f6f6;
        font-size: 24rpx;
        height:40rpx;
        line-height:40rpx;
    }
</style>
