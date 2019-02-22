<template>
    <div>
        <div class="current-city">
            <div class="current-city-head">当前定位城市</div>
            <div class="current-city-body bg-white">{{locationCity}}</div>
        </div>
        <div class="current-city">
            <div class="current-city-head">选择城市</div>
            <ul>
                <li class="current-city-body bg-white" :class="{'text-orange': item.city===city}" v-for="(item, index) in cities" :key="index" @tap="selectCity(item)">
                    {{item.city}}
                    <i-icon type="success_fill" v-if="item.city===city" class="pull-right m-r-sm" size="22" color="#ffa726" />
                </li>
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
                cities: [],
                city: '北京市',
                locationCity: '北京市',
                location: ''
            }
        },
        methods: {
            getcinemaList () {
                wx.showLoading({
                    title: '加载中',
                })
                this.$http.post(api.common.cityList, {
                    version: '1.0.0'
                }).then((res) => {
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 500)
                    if (res.data.code === 1) {
                        this.cities = res.data.data.cities
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            selectCity (item) {
                wx.setStorage({
                    key: 'location',
                    data: {
                        location: this.location,
                        city: item.city,
                        locationCity: this.locationCity,
                        city_id: item.id || item.city_code
                    }
                })
                wx.navigateTo({
                    url: '../index/main'
                })
            },
            getLocation () {
                let that = this
                wx.getStorage({
                    key: 'location',
                    success(res) {
                        that.city = res.data.city || '北京市'
                        that.location = res.data.location
                        that.locationCity = res.data.locationCity
                    },
                    fail () {
                        that.city = '北京市'
                    }
                })
            }
        },
        onShow () {
            this.getLocation()
            this.getcinemaList()
        }
    }
</script>

<style scoped>
    .current-city-head {
        background-color: #f5f5f5;
        font-size: 12px;
        color: #b0b1b3;
        line-height: 56rpx;
        padding-left: 24rpx;
    }
    .current-city-body {
        height: 96rpx;
        font-size: 32rpx;
        line-height: 96rpx;
        border-bottom: 2rpx solid #e4e4e4;
        padding-left: 20rpx;
    }
</style>
