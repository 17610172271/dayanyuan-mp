<template>
    <div class="search-result-container border-top">
        <ul>
            <li class="m-b-sm bg-white search-result-item relative" v-for="(item,index) in data" :key="item.id" v-if="item.is_collect">
                <div class="poster-container bg-eee"><image :src="item.pic" class="slide-image" mode="scaleToFill"></image></div>
                <h5 class="text-lg text-line-normal">
                    {{item.title}}
                    <div class="p-sm pull-right" @tap="doCollect(item)">
                        <i-icon type="like_fill" v-if="!item.is_collect" size="20" color="#edeced" />
                        <i-icon type="like_fill" v-else size="20" color="#ff4747" />
                    </div>
                </h5>
                <div class="text-sm text-gray text-line-20 m-t-sm over-omit">导演: {{item.director}}</div>
                <div class="text-sm text-gray text-line-20 over-omit">主演: {{item.actor}}</div>
                <div class="text-sm text-gray text-line-20 over-omit">类型: {{item.class}}</div>
            </li>
            <li class="p-v-sm text-center text-orange" v-show="data.length==0">没有更多数据</li>
        </ul>
        <i-toast id="toast" />
    </div>
</template>

<script type="text/ecmascript-6">
    import api from '@/api'
    export default {
        data () {
            return {
                data: [],
                page: 1,
                page_size: 30
            }
        },
        methods: {
            getList (type) {
                wx.showLoading({
                    title: '加载中',
                })
                this.$http.post(api.mine.collectList, {
                    version: '1.0.0',
                    page: this.page,
                    page_size: this.page_size
                }, {
                    headers: {
                        'AuthToken': this.userInfo.auth_token
                    }
                }).then((res) => {
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 500)
                    if (res.data.code === 1) {
                        if (this.page === 1) this.data = []
                        if (res.data.data.films.length > 0) {
                            this.page += 1
                        }
                        if (type) {
                            this.data = this.data.concat(res.data.data.films).map(val => {
                                return {
                                    ...val,
                                    is_collect: true
                                }
                            })
                        } else {
                            this.data = res.data.data.films.map(val => {
                                return {
                                    ...val,
                                    is_collect: true
                                }
                            })
                        }
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            doCollect (item) {
                this.$http.post(api.mine.collect, {
                    version: '1.0.0',
                    film_id: item.id
                }, {
                    headers: {
                        'AuthToken': this.userInfo.auth_token
                    }
                }).then((res) => {
                    if (res.data.code === 1) {
                        item.is_collect = !item.is_collect
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
        onReachBottom () {
            this.getList('more')
        },
        onLoad (option) {
            let that = this
            wx.getStorage({
                key: 'userInfo',
                success(res) {
                    that.userInfo = res.data
                    that.page = 1
                    that.getList(option.id)
                },
                fail () {
                    that.userInfo = {}
                }
            })
        }
    }
</script>

<style>
    page {
        background-color: #f5f5f5 !important;
    }
    .search-result-container {
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
        border-radius: 8rpx;
        overflow: hidden;
        top: 20rpx;
        left: 20rpx;
    }
</style>
