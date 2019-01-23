<template>
    <div class="search-result-container border-top">
        <ul>
            <li class="m-b-sm bg-white search-result-item relative" v-for="(item,index) in data" :key="item.id">
                <div class="poster-container"><image :src="item.pic" class="slide-image" mode="scaleToFill"></image></div>
                <h5 class="text-lg text-line-normal">
                    {{item.title}}
                    <div class="p-sm pull-right" @click="doCollect(item)">
                        <i-icon type="like_fill" v-if="!item.is_collect" size="20" color="#edeced" />
                        <i-icon type="like_fill" v-else size="20" color="#ff4747" />
                    </div>
                </h5>
                <div class="text-sm text-gray text-line-20 m-t-sm over-omit">导演: {{item.director}}</div>
                <div class="text-sm text-gray text-line-20 over-omit">主演: {{item.actor}}</div>
                <div class="text-sm text-gray text-line-20 over-omit">类型: {{item.class}}</div>
            </li>
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
                page_size: 10
            }
        },
        methods: {
            getList (type) {
                this.$http.post(api.mine.collectList, {
                    version: '1.0.0',
                    page: this.page,
                    page_size: this.page_size
                }, {
                    headers: {
                        'AuthToken': 'ntPgSqdhiNyShvWPiFGhQzNFHzjXSuSr'
                    }
                }).then((res) => {
                    if (res.data.code === 1) {
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
                        'AuthToken': 'ntPgSqdhiNyShvWPiFGhQzNFHzjXSuSr'
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
            this.page += 1
            this.getList('more')
        },
        onShow () {
            this.getList()
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
        top: 20rpx;
        left: 20rpx;
    }
</style>
