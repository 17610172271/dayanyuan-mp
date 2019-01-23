<template>
    <div class="border-top">
        <!--<div class="home-top-container relative">-->
            <!--<div class="search-box">-->
                <!--<i-icon type="search" class="pull-left search-box-icon" size="16" color="#ffa726" />-->
                <!--&lt;!&ndash;<i-input :value="searchText" i-class="search-input" maxLength="100" placeholder="搜索影片" />&ndash;&gt;-->
                <!--<form action="">-->
                    <!--<input type="text" class="search-input" v-model="searchText" placeholder="搜索影片" @confirm="doSearch">-->
                <!--</form>-->
            <!--</div>-->
        <!--</div>-->
        <div class="search-result-container">
            <div class="m-b-sm bg-white search-result-item relative">
                <div class="poster-container"><image :src="filmInfo.image_url" class="slide-image" mode="scaleToFill"></image></div>
                <h5 class="text-lg text-line-normal">
                    {{filmInfo.film_name}}
                    <div class="pull-right p-sm" @click="doCollect">
                        <i-icon type="like_fill" v-if="filmInfo.fav_status==0" size="20" color="#d8d8d8" />
                        <i-icon type="like_fill" v-else size="20" color="#ff4747" />
                    </div>
                </h5>
                <div class="text-gray text-sm">{{filmInfo.film_en_name}}</div>
                <div class="text-sm text-gray text-line-20 m-t-xs over-omit">导演: {{filmInfo.director}}</div>
                <div class="text-sm text-gray text-line-20 over-omit">主演: {{filmInfo.actor}}</div>
                <div class="text-sm text-gray text-line-20 over-omit">类型: {{filmInfo.clazz}}</div>
                <div class="text-sm text-gray text-line-20">上映: {{filmInfo.release_date}}</div>
                <div class="text-sm text-gray text-line-20">时长: {{filmInfo.length || 0}}分钟 <span class="pull-right text-xs text-orange">{{filmInfo.viewer || 0}}次观看</span></div>
            </div>
            <ul class="cinema-list-container bg-white">
                <li v-for="(item, index) in cinemaList" :key="item.id" @click="nextPage" class="cinema-list-item border-bottom relative">
                    <h5 class="text-bold">{{item.name}}</h5>
                    <div class="text-sm m-t-sm text-line-20">{{item.address || '暂无地址'}}</div>
                    <div class="text-gray text-sm m-t-xs">近期可观看场次：15:45 | 23:00</div>
                    <div class="price-container">
                        <div class="text-orange text-bold text-line-normal text-center">¥{{item.price}}起</div>
                        <div class="text-sm text-gray text-center">{{item.distance}}km</div>
                    </div>
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
                filmInfo: {},
                cinemaList: []
            }
        },
        methods: {
//            doSearch () {
//                console.log(this.searchText)
//                this.history.push(this.searchText)
//                wx.setStorage({
//                    key: 'history',
//                    data: this.history
//                })
//            },
            getfilmData (id) {
                if (!id) return
                this.$http.post(api.film.detail, {
                    version: '1.0.0',
                    film_id: id
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
            getcinemaList (id) {
                if (!id) return
                this.$http.post(api.film.cinemaList, {
                    film_id: id,
                    city_id: 110000
                }).then((res) => {
                    if (res.data.code === 1) {
                        this.cinemaList = res.data.data.cinemas
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            doCollect () {
                this.$http.post(api.mine.collect, {
                    version: '1.0.0',
                    film_id: this.filmInfo.id
                }, {
                    headers: {
                        'AuthToken': 'ntPgSqdhiNyShvWPiFGhQzNFHzjXSuSr'
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
                wx.navigateTo({
                    url: '../timeSelect/main'
                })
            }
        },
        onShow () {
            this.getfilmData()
            this.getcinemaList()
        },
        onLoad (option) {
            this.getfilmData(option.id)
            this.getcinemaList(option.id)
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
        background-color: #f5f5f5;
    }
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
    .cinema-list-container {
        padding: 0 20rpx;;
    }
    .cinema-list-item {
        height: 196rpx;
        padding: 30rpx 200rpx 30rpx 0;
    }
    .cinema-list-item h5 {
        font-size: 30rpx;
    }
    .price-container {
        position: absolute;
        top: 56rpx;
        right: 70rpx;
    }
</style>
