<template>
    <div>
        <div class="home-top-container relative">
            <div class="search-box">
                <i-icon type="search" class="pull-left search-box-icon" size="16" color="#ffa726" />
                <!--<i-input :value="searchText" i-class="search-input" maxLength="100" placeholder="搜索影片" />-->
                <form action="">
                    <input type="text" class="search-input" v-model="searchText" placeholder="搜索影片" @confirm="doSearch">
                </form>
            </div>
        </div>
        <div class="m-t-xs p-o-sm" v-if="listShow">
            <div class="search-top-head text-line-normal text-gray text-md">热门搜索</div>
            <div>
                <span class="hot-search-item bg-eee" v-for="(item, index) in hotKeys" :key="index" @tap="selectItem(item.word)">{{item.word}}</span>
                <span class="hot-search-item bg-eee" v-if="hotKeys.length===0">暂无热门搜索</span>
            </div>
            <div class="search-top-head text-line-normal text-gray text-md" style="margin-top: 30rpx;">历史搜索</div>
            <div><span class="hot-search-item bg-eee" v-for="(item, index) in history" :key="index" @tap="selectItem(item)">{{item}}</span></div>
        </div>
        <div class="search-result-container" v-else>
            <ul>
                <li class="m-b-sm bg-white search-result-item relative" @tap="nextPage(item.id)" v-for="(item,index) in data" :key="item.id">
                    <div class="poster-container"><image :src="item.image_url" class="slide-image" mode="scaleToFill"></image></div>
                    <h5 class="text-lg text-line-normal over-omit">{{item.film_name}}</h5>
                    <div class="text-sm text-gray text-line-20 m-t-sm over-omit">导演: {{item.director}}</div>
                    <div class="text-sm text-gray text-line-20 over-omit">主演: {{item.actor}}</div>
                    <div class="text-sm text-gray text-line-20 over-omit">类型: {{item.clazz}} <span class="pull-right text-xs text-orange">{{item.viewer || 0}}次观看</span></div>
                </li>
                <li class="text-orange p-sm text-center" v-if="data.length===0">没有搜索到影片</li>
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
                listShow: true,
                history: [],
                searchText: '',
                data: [],
                page: 1,
                page_size: 1,
                hotKeys: []
            }
        },
        methods: {
            getList (type) {
                wx.showLoading({
                    title: '加载中',
                })
                this.$http.post(api.film.searchResult, {
                    version: '1.0.0',
                    title: this.searchText,
                    page: this.page,
                    page_size: this.page_size
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
                    } else {
                        this.data = []
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
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
            doSearch () {
                this.getList()
                if (this.history.indexOf(this.searchText) === -1) {
                    this.history.push(this.searchText)
                    wx.setStorage({
                        key: 'history',
                        data: this.history
                    })
                }
            },
            nextPage (id) {
                wx.navigateTo({
                    url: '../filmDetail/main?id=' + id
                })
            }
        },
        onReachBottom () {
            this.page += 1
            this.getList('more')
        },
        onShow () {
            this.listShow = true
            this.data = []
            this.searchText = ''
            let that = this
            this.getHotKeys()
            wx.getStorage({
                key: 'history',
                success(res) {
                    console.log(res)
                    that.history = res.data || []
                },
                fail () {
                    that.history = []
                }
            })
        }
    }
</script>

<style scoped>
    .home-top-container {
        padding: 16rpx 58rpx 12rpx 62rpx;
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
    .search-input {
        height: 68rpx;
        line-height: 68rpx;
        padding-left: 10rpx;
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
</style>
