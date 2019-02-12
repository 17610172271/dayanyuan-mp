<template>
    <div class="search-result-container border-top">
        <div class="m-b-sm bg-white search-result-item relative">
            <div class="poster-container"><image :src="filmInfo.image_url" class="slide-image" mode="scaleToFill"></image></div>
            <h5 class="text-lg text-line-normal">{{filmInfo.film_name}} <span class="text-sm text-gray">2018年5月17日 12:24:54</span></h5>
            <div class="text-sm text-dark text-line-20 m-t-xs">{{cinema_name}}</div>
            <div class="text-sm text-gray text-line-20 m-t-xs">{{cinema_address}}</div>
        </div>
        <div class="comment-content bg-white p-v-md p-o-sm border-bottom">
            <ul>
                <li class="p-v-xs clear">
                    <span class="pull-left text-sm comments-text border">环境整洁干净</span>
                    <i-rate size="24" i-class="pull-right p-v-xs" v-model="valOne" @change="envChange"></i-rate>
                </li>
                <li class="p-v-xs clear">
                    <span class="pull-left text-sm comments-text border">座椅舒适</span>
                    <i-rate size="24" i-class="pull-right p-v-xs" v-model="valTwo" @change="seatChange"></i-rate>
                </li>
                <li class="p-v-xs clear">
                    <span class="pull-left text-sm comments-text border">灯光效果</span>
                    <i-rate size="24" i-class="pull-right p-v-xs" v-model="valThree" @change="lightChange"></i-rate>
                </li>
                <li class="p-v-xs clear">
                    <span class="pull-left text-sm comments-text border">音响效果</span>
                    <i-rate size="24" i-class="pull-right p-v-xs comments" v-model="valFour" @change="soundChange"></i-rate>
                </li>
            </ul>
        </div>
        <div class="p-sm text-gray text-sm bg-white">为了给您带来更好的服务，吐槽一下影仓的亮点和不足吧～</div>
        <div class="text-center film-detail-btn">
            <buttom class="select-time-btn text-center" @tap="doComment">提交评价</buttom>
        </div>
        <i-toast id="toast" />
    </div>
</template>

<script type="text/ecmascript-6">
    import api from '@/api'
    export default {
        data () {
            return {
                valOne: 5,
                valTwo: 5,
                valThree: 5,
                valFour: 5,
                filmInfo: {},
                cinema_name: '',
                cinema_address: '',
                trade_start_time: '',
                trade_id: '',
                userInfo: {}
            }
        },
        methods: {
            getFilmInfo (id) {
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
            envChange (e) {
                this.valOne = e.target.index
            },
            seatChange (e) {
                this.valTwo = e.target.index
            },
            lightChange (e) {
                this.valThree = e.target.index
            },
            soundChange (e) {
                this.valFour = e.target.index
            },
            doComment () {
                this.$http.post(api.order.comment, {
                    version: '1.0.0',
                    trade_id: this.trade_id,
                    evn: this.valOne,
                    seat: this.valTwo,
                    light: this.valThree,
                    sound: this.valFour
                }, {
                    headers: {
                        'AuthToken': this.userInfo.auth_token
                    }
                }).then((res) => {
                    if (res.data.code === 1) {
                        this.$Toast({
                            content: '提交成功',
                            type: 'success'
                        })
                        wx.navigateTo({
                            url: '../mineOrder/main'
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
        onLoad (option) {
            let that = this
            this.trade_id = option.trade_id
            this.cinema_name = option.cinema_name
            this.cinema_address = option.cinema_address
            this.trade_start_time = option.trade_start_time
            wx.getStorage({
                key: 'userInfo',
                success(res) {
                    that.userInfo = res.data
                    that.getFilmInfo(option.film_id)
                },
                fail () {
                    that.userInfo = {}
                }
            })
        }
    }
</script>

<style scoped>
    .search-result-container {
        background-color: #f5f5f5;
    }
    .search-result-item {
        padding: 20rpx 20rpx 20rpx 140rpx;
    }
    .poster-container {
        width: 100rpx;
        height: 144rpx;
        position: absolute;
        top: 20rpx;
        left: 20rpx;
        border-radius: 6rpx;
    }
    .comments-text {
        display: inline-block;
        padding: 16rpx 30rpx;
        border-radius: 32rpx;
    }
    .film-detail-btn {
        position: absolute;
        bottom: 150rpx;
        left: 50%;
        transform: translateX(-50%);
    }
</style>
