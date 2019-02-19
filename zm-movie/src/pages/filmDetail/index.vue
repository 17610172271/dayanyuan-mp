<template>
    <div class="border-top">
        <div class="search-result-container">
            <div class="m-b-sm bg-white search-result-item relative">
                <div class="poster-container"><image :src="filmInfo.image_url" class="slide-image" mode="scaleToFill"></image></div>
                <h5 class="text-lg text-line-normal">
                    {{filmInfo.film_name}}
                    <button class="pull-right p-sm collect-btn" :open-type="openType" @getphonenumber="getPhoneNumber" @tap="doCollect">
                        <i-icon type="like_fill" v-if="filmInfo.fav_status==0" size="20" color="#d8d8d8" />
                        <i-icon type="like_fill" v-else size="20" color="#ff4747" />
                    </button>
                </h5>
                <div class="text-gray text-sm">{{filmInfo.film_en_name}}</div>
                <div class="text-sm text-gray text-line-20 m-t-xs over-omit">导演: {{filmInfo.director}}</div>
                <div class="text-sm text-gray text-line-20 over-omit">主演: {{filmInfo.actor}}</div>
                <div class="text-sm text-gray text-line-20 over-omit">类型: {{filmInfo.clazz}}</div>
                <div class="text-sm text-gray text-line-20">上映: {{filmInfo.release_date}}</div>
                <div class="text-sm text-gray text-line-20">时长: {{filmInfo.length || 0}}分钟 <span class="pull-right text-xs text-orange">{{filmInfo.viewer || 0}}次观看</span></div>
            </div>

            <div class="bg-f5 p-v-sm p-o-sm film-desc-container">
                <span class="text-bold">影片简介:</span> {{filmInfo.introduction}}
            </div>
            <div class="text-center film-detail-btn">
                <buttom class="select-time-btn text-center" @tap="nextPage">预定影片</buttom>
            </div>
        </div>
        <i-toast id="toast" />
    </div>
</template>

<script type="text/ecmascript-6">
    import api from '@/api'
    export default {
        data () {
            return {
                filmInfo: {
                    fav_status: 0
                },
                userInfo: {},
                id: ''
            }
        },
        computed: {
            openType () {
                return this.userInfo.user_mobile ? '' : 'getPhoneNumber'
            }
        },
        methods: {
            getfilmData (id) {
                wx.showLoading({
                    title: '加载中',
                })
                if (!id) return
                this.$http.post(api.film.detail, {
                    version: '1.0.0',
                    film_id: id,
                    member_id: this.userInfo.user_id
                }).then((res) => {
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 500)
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
            nextPage () {
                let that = this
                wx.getStorage({
                    key: 'cinemaInfo',
                    success(res) {
                        console.log(res.data)
                        if (res.data && res.data.id) {
                            wx.navigateTo({
                                url: '../timeSelect/main?id=' + that.filmInfo.id + '&cinema_id=' + res.data.id
                            })
                        } else {
                            wx.navigateTo({
                                url: '../cinemaSelect/main?id=' + that.filmInfo.id
                            })
                        }
                    },
                    fail () {
                        wx.navigateTo({
                            url: '../cinemaSelect/main?id=' + that.filmInfo.id
                        })
                    }
                })

            }
        },
        onShow () {
            this.filmInfo = {
                film_name: '',
                image_url: '',
                film_en_name: '',
                director: '',
                actor: '',
                clazz: '',
                release_date: '',
                length: '',
                viewer: 0,
                introduction: '',
                fav_status: 0
            }
            if (this.id) this.getfilmData(this.id)
        },
        onLoad (option) {
            let that = this
            this.id = option.id
            wx.getStorage({
                key: 'userInfo',
                success(res) {
                    that.userInfo = res.data
                    that.getfilmData(option.id)
                },
                fail () {
                    that.userInfo = {}
                }
            })
        }
    }
</script>

<style>
    .search-result-item {
        height: 340rpx;
        padding: 30rpx 20rpx 30rpx 240rpx;
    }
    .poster-container {
        width: 192rpx;
        height: 280rpx;
        position: absolute;
        border-radius: 10rpx;
        overflow: hidden;
        top: 30rpx;
        left: 20rpx;
    }
    .film-desc-container {
        color: #484848;
        font-size: 24rpx;
        line-height: 34rpx;
    }
    .film-detail-btn {
        position: absolute;
        bottom: 150rpx;
        left: 50%;
        transform: translateX(-50%);
    }

</style>
