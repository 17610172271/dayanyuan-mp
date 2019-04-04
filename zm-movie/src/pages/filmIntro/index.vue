<template>
    <div class="border-top bg-f5">
        <div class="search-result-container">
            <div class="bg-white search-result-item relative">
                <div class="poster-container bg-eee"><image :src="filmInfo.cover" v-if="filmInfo.cover" class="slide-image" mode="scaleToFill"></image></div>
                <h5 class="text-lg text-line-normal">
                    {{filmInfo.film_name}}
                    <button class="pull-right collect-btn" :open-type="openType" @getphonenumber="getPhoneNumber" @tap="doCollect">
                        <i-icon type="collection_fill" v-if="filmInfo.fav_status==0" size="20" color="#d8d8d8" />
                        <i-icon type="collection_fill" v-else size="20" color="#ff4747" />
                    </button>
                </h5>
                <div class="text-gray text-sm over-omit">{{filmInfo.film_en_name}}</div>
                <div class="m-t-sm text-xlg text-line-20 text-orange">{{filmInfo.score}} <span class="text-sm">分</span></div>
                <div class="text-sm text-gray text-line-18 over-omit">导演: {{filmInfo.director}}</div>
                <div class="text-sm text-gray text-line-18 over-omit">主演: {{filmInfo.actor}}</div>
                <div class="text-sm text-gray text-line-18 over-omit">类型: {{filmInfo.class}}</div>
                <div class="text-sm text-gray text-line-18">上映: {{filmInfo.release_date}}</div>
                <div class="text-sm text-gray text-line-18">时长: {{filmInfo.length || 0}}分钟 <span class="pull-right text-xs text-orange">{{filmInfo.viewer || 0}}次观看</span></div>
            </div>

            <div class="bg-white p-v-sm p-o-sm film-desc-container m-t-xs">
                <span class="text-bold">影片简介:</span> {{filmInfo.information}}
            </div>
            <div class="m-t-xs p-sm bg-white" v-if="filmInfo.poster">
                <h3 class="text-sm text-bold">影片海报</h3>
                <div class="film-detail-img p-v-sm">
                    <!-- <image  mode="widthFix" :src="filmInfo.poster"></image> -->
                    <rich-text :nodes="filmInfo.poster"></rich-text>
                </div>
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
                id: '',
                cinema_id: '',
            }
        },
        computed: {
            openType () {
                return this.userInfo.user_mobile ? '' : 'getPhoneNumber'
            }
        },
        methods: {
            getfilmData (id, cinema_id) {
                wx.showLoading({
                    title: '加载中',
                })
                if (!id) return
                this.$http.post(api.film.details, {
                    cinema_id: cinema_id,
                    film_id: id,
                    member_id: this.userInfo.user_id
                }).then((res) => {
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 500)
                    if (res.data.code === 1) {
                        this.filmInfo = res.data.data.filmInfo[0]
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
                            content: '手机号获取失败',
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
            console.log(this.id, '影片详情')
            if (this.id) {
                console.log(this.id, '影片详情1')
                this.getfilmData(this.id, this.cinema_id)
            }
        },
        onLoad (option) {
            let that = this
            this.id = option.id
            this.cinema_id = option.cinema_id
            wx.getStorage({
                key: 'userInfo',
                success(res) {
                    that.userInfo = res.data
                    that.getfilmData(option.id, option.cinema_id)
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
        height: 364rpx;
        padding: 30rpx 20rpx 30rpx 265rpx;
    }
    .poster-container {
        width: 220rpx;
        height: 320rpx;
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
    .collect-btn {
        margin-top: -18rpx;
    }
    .film-detail-img image {
        width: 100%;
        margin-top: 20rpx;
        background-color: #eee;
    }
</style>
