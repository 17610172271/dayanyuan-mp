<template>
    <div class="border-top bg-f5">
        <div class="bg-white search-result-item relative">
            <div class="poster-container relative">
                <image v-if="filmInfo.cover" :src="filmInfo.cover" class="slide-image" mode="scaleToFill"></image>
                <div class="home-score-container" style="padding-right: 20rpx;">{{filmInfo.score}}</div>
            </div>
            <h5 class="text-lg text-line-normal over-omit" style="height: 48rpx;">
                {{filmInfo.film_name}}
                <button class="pull-right collect-btn" :open-type="openType" @getphonenumber="getPhoneNumber" @tap="doCollect">
                    <i-icon type="collection_fill" v-if="filmInfo.fav_status==0" size="20" color="#d8d8d8" />
                    <i-icon type="collection_fill" v-else size="20" color="#ff4747" />
                </button>
            </h5>
            <div class="text-gray text-sm over-omit">{{filmInfo.en_name}}</div>
            <div class="relative" @tap="nextDetailPage">
                <div class="text-sm text-gray text-line-18 m-t-sm over-omit">导演: {{filmInfo.director}}</div>
                <div class="text-sm text-gray text-line-18 over-omit">主演: {{filmInfo.actor}}</div>
                <div class="text-sm text-gray text-line-18 over-omit">类型: {{filmInfo.class}}</div>
                <div class="text-sm text-gray text-line-18">上映: {{filmInfo.release_date}}</div>
                <div class="text-sm text-gray text-line-18">时长: {{filmInfo.length || 0}}分钟</div>
                <div class="enter-film-detail"><i-icon type="enter" class="icon-center" size="16" color="#ffa726" /></div>
            </div>
            <div class="text-md text-orange text-line-20 text-bold">
                <span class="text-xs">¥</span>{{filmInfo.min_price}} - <span class="text-xs">¥</span>{{filmInfo.min_price}}
                <span class="pull-right text-xs" style="color: #de872d;">{{filmInfo.viewer || 0}}次观看</span>
            </div>
        </div>
        <div class="cienma-info-container bg-white m-t-xs relative" @tap="nextCinemaPage">
            <div class="text-md text-line-20">{{cinemaInfo.name}}
                <span class="m-l-sm text-xs text-gray" v-show="cinemaInfo.distance">距您{{cinemaInfo.distance}}</span>
            </div>
            <div class="text-sm text-gray text-line-20 over-omit" style="padding-right: 80rpx;">{{cinemaInfo.city}}{{cinemaInfo.address}}</div>
            <div class="cinema-icon"><i-icon type="other" size="26" color="#ffa726" /></div>
        </div>
        <div class="select-time-container bg-white p-v-md p-o-md m-t-xs">
            <div class="timer-container p-t-sm p-b-md">
                <h5 class="text-lg text-dark text-bold text-line-normal text-center">选择时间</h5>
                <i-tabs :current="current" @change="tabChange" color="#f98d0f">
                    <i-tab :key="0" :title="'今天'+today"></i-tab>
                    <i-tab :key="1" :title="'明天'+tomorrow"></i-tab>
                    <i-tab :key="2" :title="'后天'+aftertomorrow"></i-tab>
                </i-tabs>
                <picker-view
                    indicator-style="height: 40px;"
                    indicator-class="selected-style"
                    style="width: 100%; height: 400rpx; text-align: center;"
                    :value="pickerVal"
                    @change="timeChange">
                    <picker-view-column>
                        <view v-for="(item, index) in hours" :class="{'text-orange': pickerVal[0]==index}"  :key="index" style="line-height: 50px;font-size: 32rpx;">{{item}}时</view>
                    </picker-view-column>
                    <picker-view-column>
                        <view v-for="(item, index) in minutes" :class="{'text-orange': pickerVal[1]==index}" :key="index" style="line-height: 50px;font-size: 32rpx;">{{item}}分</view>
                    </picker-view-column>
                    <picker-view-column>
                        <view v-for="(item, index) in status" :class="{'text-orange': pickerVal[2]==index}" :key="index" style="line-height: 50px;font-size: 32rpx;">{{item}}</view>
                    </picker-view-column>
                </picker-view>
            </div>
        </div>
        <div class="text-center m-t-lg buy-tickets">
            <button class="select-time-btn text-center" :open-type="openType" @getphonenumber="getPhoneNumber" @tap="nextPage">立即购票</button>
        </div>
        <i-modal-normal i-class="notice-modal" :visible="modal" ok-text="前往支付" cancel-text="取消订单" @ok="goPay" @cancel="cancelOrder">
            <div class="notice-modal-container">
                <div class="p-v-sm">您当前还有未支付的订单待处理</div>
            </div>
        </i-modal-normal>
        <i-toast id="toast" />
    </div>
</template>

<script type="text/ecmascript-6">
    import api from '@/api'
    import occupy from '@/utils/isOccupy'
    import calculatePrice from '@/utils/calculatePrice'
    export default {
        data () {
            return {
                data: {
                    cinema: '',
                    film: '',
                    time: ''
                },
                filmInfo: '',
                cinemaInfo: '',
                timeList: '',
                priceInfo: [],
                current: 0,
                currentTime: 0,
                selectTime: 0,
                hours: [],
                minutes: [],
                status: [''],
                hour: '',
                minute: '',
                hall_id: '',
                list: [],
                pickerVal: [0, 0, 0],
                userInfo: {},
                modal: false,
                trade_id: ''
            }
        },
        computed: {
            today () {
                let date = new Date()
                return  new Date(Date.parse(date)).getMonth() + 1 + '月' + new Date(Date.parse(date)).getDate() + '日'
            },
            tomorrow () {
                let date = new Date()
                return  new Date(Date.parse(date) + 24 * 60 * 60 * 1000).getMonth() + 1 + '月' + new Date(Date.parse(date) + 24 * 60 * 60 * 1000).getDate() + '日'
            },
            aftertomorrow () {
                let date = new Date()
                return  new Date(Date.parse(date) + 48 * 60 * 60 * 1000).getMonth() + 1 + '月' + new Date(Date.parse(date) + 48 * 60 * 60 * 1000).getDate() + '日'
            },
            openType () {
                return this.userInfo.user_mobile ? '' : 'getPhoneNumber'
            }
        },
        methods: {
            // 获取数据
            getFilmData (film_id, cinema_id) {
                if (!film_id || !cinema_id) return
                wx.showLoading({
                    title: '加载中',
                })
                this.$http.post(api.film.details, {
                    cinema_id: cinema_id,
                    film_id: film_id,
                    member_id: this.userInfo.user_id
                }).then((res) => {
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 500)
                    if (res.data.code === 1) {
                        this.filmInfo = res.data.data.filmInfo[0]
                        this.timeList = res.data.data.useTime
                        this.priceInfo = res.data.data.priceInfo
                        this.currentTime = parseInt(new Date().getTime() / 1000) + 3600
                        let endTime = this.currentTime + this.filmInfo.length * 60
                        this.hall_id = this.isOccupy(this.currentTime, endTime, this.timeList)
                        this.status = this.hall_id ? [this.calculatePrice(this.currentTime, this.priceInfo) === '' ? '不可预订' : ('¥' + this.calculatePrice(this.currentTime, this.priceInfo))] : ['不可预定']

                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            doCollect () {
                if (!this.userInfo.user_mobile) return
                this.$http.post(api.mine.collect, {
                    version: '1.0.0',
                    film_id: this.filmInfo.id
                }, {
                    headers: {
                        'AuthToken': this.userInfo.auth_token
                    }
                }).then((res) => {
                    if (res.data.code === 1) {
                        this.filmInfo.fav_status = this.filmInfo.fav_status === 0 ? 1 : 0
                        this.$Toast({
                            content: res.data.msg,
                            type: 'success'
                        })
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            tabChange (detail) {
                this.current = detail.target.key
                this.selectTime =this.pickerVal[0] * 60 * 60 + this.pickerVal[1] * 60
                this.currentTime = new Date().setHours(0, 0, 0, 0) / 1000 + this.selectTime + this.current * 24 * 60 *60
                let endTime = this.currentTime + this.filmInfo.length * 60
                this.hall_id = this.isOccupy(this.currentTime, endTime, this.timeList)
                this.status = this.hall_id ? ['¥' + this.calculatePrice(this.currentTime, this.priceInfo)] : ['不可预定']
            },
            timeChange(e) {
                this.pickerVal = e.target.value
                this.selectTime = e.target.value[0] * 60 * 60 + e.target.value[1] * 60
                this.currentTime = new Date().setHours(0, 0, 0, 0) / 1000 + this.selectTime + this.current * 24 * 60 *60
                let endTime = this.currentTime + this.filmInfo.length * 60
                this.hall_id = this.isOccupy(this.currentTime, endTime, this.timeList) // 判断起止时间是否与list冲突   不冲突返回影仓id
                this.status = this.hall_id ? ['¥' + this.calculatePrice(this.currentTime, this.priceInfo)] : ['不可预定']
            },
            getPhoneNumber (e) {
                this.$http.post(api.common.getTel, {
                    iv: e.target.iv,
                    encryptedData: e.target.encryptedData,
                    session_key: this.userInfo.session_key
                }).then((res) => {
                    if (res.data.code === 1) {
                        this.$http.post(api.common.bindTel, {
                            mobile: res.data.data.phoneNumber,
                            user_id: this.userInfo.user_id,
                            platform: 'wx'
                        }).then(res => {
                            if (res.data.code === 1) {
                                this.$Toast({
                                    content: '手机号绑定成功',
                                    type: 'success'
                                })
                                this.userInfo = res.data.data
                                wx.setStorage({
                                    key: 'userInfo',
                                    data: res.data.data
                                })
                            } else {
                                this.$Toast({
                                    content: res.data.msg,
                                    type: 'error'
                                })
                            }
                        })
                    } else {
                        this.$Toast({
                            content: '手机号获取失败',
                            type: 'error'
                        })
                    }
                })
            },
            nextPage () {
                if (!this.userInfo.user_mobile) return
                if (this.hall_id) {
                    this.$http.post(api.order.create, {
                        goods_id: this.filmInfo.id,
                        trade_start_time: this.currentTime,
                        goods_hall_id: this.hall_id
                    }, {
                        headers: {
                            'AuthToken': this.userInfo.auth_token
                        }
                    }).then(res => {
                        if (res.data.code === 1) {
                            wx.navigateTo({
                                url: '/pages/orderConfirm/main?trade_id=' + res.data.data.trade_id
                            })
                        } else if (res.data.msg === '请先支付或关闭上个订单') {
                            this.modal = true
                            this.trade_id = res.data.data.trade_id
                        } else {
                            this.$Toast({
                                content: res.data.msg,
                                type: 'error'
                            })
                        }
                    })

                } else {
                    this.$Toast({
                        content: '当前时间不可预定,请重新选择',
                        type: 'error'
                    })
                }
            },
            cancelOrder () {
                this.$http.post(api.order.cancel, {
                    trade_id: this.trade_id
                }, {
                    headers: {
                        'AuthToken': this.userInfo.auth_token
                    }
                }).then((res) => {
                    if (res.data.code === 1) {
                        this.modal = false
                        this.$Toast({
                            content: '订单取消成功',
                            type: 'success'
                        })
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            nextCinemaPage () {
                wx.navigateTo({
                    url: '../cinema/main?film_id=' + this.filmInfo.id + '&cinema_id=' + this.cinemaInfo.id 
                })
            },
            nextDetailPage () {
                wx.navigateTo({
                    url: '../filmIntro/main?id=' + this.filmInfo.id + '&cinema_id=' + this.cinemaInfo.id 
                })
            },
            goPay () {
                wx.navigateTo({
                    url: '/pages/orderConfirm/main?trade_id=' + this.trade_id
                })
            },
            isOccupy: occupy,
            calculatePrice: calculatePrice
        },
        onShow () {
            this.modal = false
        },
        created () {
            for (let i = 0; i < 24; i++) {
                this.hours.push(i < 10 ? '0' + i : i + '')
            }
            for (let i = 0; i < 60; i++) {
                this.minutes.push(i < 10 ? '0' + i : i + '')
            }
        },
        onLoad (option) {
            let date = new Date()
            this.current = 0
            this.pickerVal = [date.getHours() + 1, date.getMinutes(), 0]
            let that = this
            wx.getStorage({
                key: 'userInfo',
                success(res) {
                    that.userInfo = res.data
                    wx.getStorage({
                        key: 'cinemaInfo',
                        success(res1) {
                            that.cinemaInfo = res1.data
                            that.cinemaInfo.distance = that.cinemaInfo.distance > 1000 ? parseInt(that.cinemaInfo.distance / 100) / 10 + 'km' : that.cinemaInfo.distance + 'm'
                            that.getFilmData(option.id, res1.data.id)
                        },
                        fail () {
                            that.userInfo = {}
                        }
                    })
                },
                fail () {
                    that.userInfo = {}
                }
            })
        }
    }
</script>

<style>
    .film-name-container {
        padding: 20rpx 160rpx 20rpx 140rpx;
    }
    .select-time-img {
        width: 64rpx;
        height: 92rpx;
        border-radius: 4rpx;
        position: absolute;
        top: 20rpx;
        left: 40rpx;
        overflow: hidden;
    }
    .search-result-item {
        height: 340rpx;
        padding: 16rpx 20rpx 30rpx 240rpx;
    }
    .poster-container {
        width: 192rpx;
        height: 280rpx;
        position: absolute;
        border-radius: 10rpx;
        overflow: hidden;
        top: 30rpx;
        left: 20rpx;
        background-color: #eee;
    }
    .price-container {
        position: absolute;
        top: 40rpx;
        right: 20rpx;
    }
    .timer-container {
        height: 540rpx;
        border-radius: 72rpx;
        box-shadow: 2rpx 12rpx 18rpx 0 rgba(164, 160, 155, 0.28), 0 0 6rpx 0 rgba(0, 0, 0, 0.08);
    }
    .selected-style {
        box-shadow: 0 2px 4px 0 rgba(255, 167, 38, 0.43);
        background-color: rgba(255, 167, 38, 0.1);
        color: #ffa726;
    }
    .collect-btn {
        margin-top: -18rpx;
    }
    .cienma-info-container {
        height: 124rpx;
        padding: 20rpx 20rpx;
    }
    .cinema-icon {
        position: absolute;
        top: 40rpx;
        right: 26rpx;
    } 
    .enter-film-detail {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 36rpx;
        right: 20rpx;
        background-color: #ffeacb;
        border-radius: 50%;
    }
    .icon-center {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .buy-tickets {
        position: absolute;
        bottom: 40rpx;
        left: 50%;
        margin-left: -278rpx;
    }
</style>
