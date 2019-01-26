<template>
    <div class="border-top bg-f5">
        <div class="film-name-container bg-white m-b-sm relative">
            <div class="select-time-img"><image :src="filmInfo.image_url" class="slide-image" mode="scaleToFill"></image></div>
            <h5 class="text-dark text-lg text-line-normal">{{filmInfo.film_name}}</h5>
            <div class="text-sm text-gray text-line-normal">{{cinemaInfo.name}}</div>
            <div class="price-container">
                <div class="text-orange text-line-normal text-center" @click="submitOrder">¥{{cinemaInfo.price}}起</div>
            </div>
        </div>
        <div class="select-time-container bg-white p-v-lg p-o-md">
            <div class="timer-container p-t-sm p-b-md">
                <h5 class="text-lg text-dark text-bold text-line-normal text-center">选择时间</h5>
                <i-tabs :current="current" @change="tabChange" color="#f98d0f">
                    <i-tab :key="0" :title="'今天'+today"></i-tab>
                    <i-tab :key="1" :title="'明天'+tomorrow"></i-tab>
                    <i-tab :key="2" :title="'后天'+aftertomorrow"></i-tab>
                </i-tabs>
                <picker-view
                    indicator-style="height: 50px;"
                    indicator-class="selected-style"
                    style="width: 100%; height: 460rpx; text-align: center;"
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
            <div class="text-center" style="margin-top: 112rpx;">
                <button class="select-time-btn text-center" :open-type="openType" @getphonenumber="getPhoneNumber" @click="nextPage">选定时间{{openType}}</button>
            </div>
        </div>
        <i-toast id="toast" />
    </div>
</template>

<script type="text/ecmascript-6">
    import api from '@/api'
    import occupy from '@/utils/isOccupy'
    export default {
        data () {
            return {
                filmInfo: '',
                cinemaInfo: '',
                timeList: '',
                current: 0,
                currentTime: 0,
                selectTime: '',
                hours: [],
                minutes: [],
                status: [''],
                hour: '',
                minute: '',
                hall_id: '',
                list: [],
                pickerVal: [0, 0, 0],
                userInfo: {}
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
                return this.filmInfo.user_mobile ? '' : 'getPhoneNumber'
            }
        },
        methods: {
            getFilmData (id) {
                if (!id) return
                this.$http.post(api.film.detail, {
                    version: '1.0.0',
                    film_id: id,
                    user_id: this.userInfo.user_id
                }).then((res) => {
                    if (res.data.code === 1) {
                        this.filmInfo = res.data.data
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            getCinemaData (id) {
                if (!id) return
                this.$http.post(api.common.cinemaDetail, {
                    version: '1.0.0',
                    cinema_id: id
                }).then((res) => {
                    if (res.data.code === 1) {
                        this.cinemaInfo = res.data.data
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            getTimeList (cinema_id, film_id) {
                this.$http.post(api.common.timeList, {
                    cinema_id: cinema_id,
                    film_id: film_id
                }).then((res) => {
                    if (res.data.code === 1) {
                        this.timeList = res.data.data
                        this.currentTime = parseInt(new Date().getTime() / 1000) + 3600
                        let endTime = this.currentTime + this.filmInfo.length * 60
                        this.hall_id = this.isOccupy(this.currentTime, endTime, this.timeList)
                        this.status = this.hall_id ? ['可预订'] : ['不可预定']
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
                this.currentTime = new Date().setHours(0, 0, 0, 0) / 1000 + this.selectTime + this.current * 24 * 60 *60
                let endTime = this.currentTime + this.filmInfo.length * 60
                this.hall_id = this.isOccupy(this.currentTime, endTime, this.timeList)
                this.status = this.hall_id ? ['可预订'] : ['不可预定']
            },
            timeChange(e) {
                this.pickerVal = e.target.value
                this.selectTime = e.target.value[0] * 60 * 60 + e.target.value[1] * 60
                this.currentTime = new Date().setHours(0, 0, 0, 0) / 1000 + this.selectTime + this.current * 24 * 60 *60
                let endTime = this.currentTime + this.filmInfo.length * 60
                console.log(this.currentTime, endTime, this.filmInfo.length)
                this.hall_id = this.isOccupy(this.currentTime, endTime, this.timeList) // 判断起止时间是否与list冲突   不冲突返回影仓id
                console.log(this.hall_id)
                this.status = this.hall_id ? ['可预订'] : ['不可预定']
            },
            getPhoneNumber (e) {
                console.log('获取手机号', e)
            },
            nextPage () {
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
                        } else if (res.data.msg === '用户手机号不存在') {
                            this.modal = true
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
            isOccupy: occupy
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
            this.pickerVal = [date.getHours() + 1, date.getMinutes(), 0]
            this.getCinemaData(option.cinema_id)
            this.getTimeList(option.cinema_id, option.id)
            let that = this
            wx.getStorage({
                key: 'userInfo',
                success(res) {
                    that.userInfo = res.data
                    that.getFilmData(option.id)
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
    .price-container {
        position: absolute;
        top: 40rpx;
        right: 20rpx;
    }
    .timer-container {
        height: 660rpx;
        border-radius: 72rpx;
        box-shadow: 2rpx 12rpx 18rpx 0 rgba(164, 160, 155, 0.28), 0 0 6rpx 0 rgba(0, 0, 0, 0.08);
    }
    .selected-style {
        box-shadow: 0 2px 4px 0 rgba(255, 167, 38, 0.43);
        background-color: rgba(255, 167, 38, 0.1);
        color: #ffa726;
    }
</style>
