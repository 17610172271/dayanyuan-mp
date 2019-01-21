<template>
    <div>
        <!--搜索-->
        <div class="home-top-container bg-white relative">
            <a href="/pages/city/main" class="city-select">北京<i-icon type="unfold" size="14" style="margin-left: 6rpx;" color="#030303" /></a>
            <div class="search-box" style="margin-top: 2rpx;" @click="goSearch">
                <i-icon type="search" size="16" color="#ffa726" />
                搜索影片
            </div>
            <a href="/pages/cinema/main" class="cinema-select"><i-icon type="other" size="34" color="#030303" /></a>
        </div>
        <!--轮播-->
        <swiper
            class="swiper-container m-t-sm"
            :indicator-dots="indicatorDots"
            :autoplay="autoplay"
            :interval="interval"
            :duration="duration"
            indicator-active-color="#ef6c00">
            <block v-for="(item, index) in imgUrls" :key="index">
                <swiper-item class="swiper-container">
                    <image :src="item" class="slide-image" />
                </swiper-item>
            </block>
        </swiper>
        <!--榜单-->
        <div class="hotplay-title-container">
            <span class="title-normal title-select">热播榜</span>
            <span class="title-normal">上新榜</span>
            <span class="title-normal">武打</span>
            <span class="title-normal">动作</span>
            <span class="title-normal">爱情</span>
            <span class="title-normal">动画</span>
        </div>
        <div>
            <scroll-view scroll-x class="hotplay-container">
                <div class="image-container" v-for="(item, index) in 10" :key="index">
                    <div class="image-item-container"></div>
                    <div class="title-text title-p">乘风破浪</div>
                    <div class="subtitle-text p-l-sm">268次观看</div>
                </div>
            </scroll-view>
        </div>
        <div class="border m-t-md"></div>
        <!--每日推荐-->
        <div>
            <h3 class="day-recommend">每日推荐·你想看的都在这里</h3>
            <div>
                <div class="first-image-container">
                    <div class="first-image"></div>
                    <div>
                        <div class="title-text m-t-sm p-l-sm">蝙蝠侠大战超人</div>
                        <div class="subtitle-text p-l-sm" style="margin-top: 4rpx;">268次观看</div>
                    </div>
                </div>
            </div>
            <div class="m-t-sm p-o-sm">
                <i-row>
                    <i-col span="8" i-class="col-class" v-for="(item, index) in 20" :key="index">
                        <div :class="{'p-r-xs': index%3==0,'p-l-xs': index%3==2,'p-o-xxs': index%3==1}" class="m-b-md">
                            <div class="recommend-image-container"></div>
                            <div>
                                <div class="title-text m-t-sm">蝙蝠侠大战超人</div>
                                <div class="subtitle-text" style="margin-top: 4rpx;">268次观看</div>
                            </div>
                        </div>
                    </i-col>
                </i-row>
            </div>
        </div>
        <i-modal i-class="notice-modal" :visible="modal" ok-text="去预定" cancel-text="再看看" @ok="doOk" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(../../../static/img/3@3x.png);background-repeat: no-repeat;background-size: 100% 156px;padding:40px;">
                <div class="text-xlg">您没有可用的观影券 <br> 请先预定</div>
            </div>
        </i-modal>
        <i-modal i-class="notice-modal" :visible="modal1" ok-text="知道了" cancel-text="去导航" @ok="doOk1" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(../../../static/img/3@3x.png);background-repeat: no-repeat;background-size: 100% 156px;padding:40px;">
                <div class="text-xlg">不是该影仓观影券 <br> 请您到2号影仓</div>
            </div>
        </i-modal>
        <i-modal i-class="notice-modal" :visible="modal2" ok-text="知道了" cancel-text="再来一单" @ok="doOk2" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(../../../static/img/3@3x.png);background-repeat: no-repeat;background-size: 100% 156px;padding:20px;">
                <div class="text-md">离观影时间还有: <br> <span class="text-xlg">30分钟</span> <br> <span class="text-orange">(请在观影前10分钟内打开舱门)</span></div>
            </div>
        </i-modal>
        <i-modal i-class="notice-modal" :visible="modal3" ok-text="知道了" cancel-text="去登陆" @ok="doOk3" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(../../../static/img/3@3x.png);background-repeat: no-repeat;background-size: 100% 156px;padding:40px;">
                <div class="text-xlg">您还没有登录 <br> 请先登录</div>
            </div>
        </i-modal>
        <i-modal i-class="notice-modal" :visible="modal4" ok-text="再看看" cancel-text="去预定" @ok="doOk4" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(../../../static/img/3@3x.png);background-repeat: no-repeat;background-size: 100% 156px;padding:40px;">
                <div class="text-xlg p-v-sm">您没有该影院的订单</div>
            </div>
        </i-modal>
    </div>
</template>

<script>
export default {
    data () {
        return {
            imgUrls: [
                'http://dummyimage.com/125x125',
                'http://dummyimage.com/160x600',
                'http://dummyimage.com/180x150',
                'http://dummyimage.com/125x125',
                'http://dummyimage.com/160x600',
                'http://dummyimage.com/180x150'
            ],
            indicatorDots: true,
            autoplay: false,
            interval: 5000,
            duration: 1000,
            modal: false,
            modal1: false,
            modal2: true,
            modal3: false,
            modal4: false,
        }
    },
    methods: {
        goSearch () {
            wx.navigateTo({
                url: '../search/main'
            })
        },
        doOk () {
            this.modal = false
        },
        doCancel () {
            this.modal = false
            this.modal1 = false
            this.modal2 = false
            this.modal3 = false
            this.modal4 = false
        },
        doOk1 () {
            this.modal1 = false
        },
        doOk2 () {
            this.modal2 = false
        },
        doOk3 () {
            this.modal3 = false
        },
        doOk4 () {
            this.modal4 = false
        },
    },
    created () {
    }
}
</script>

<style scoped>
    .home-top-container {
        padding: 0 94rpx 20rpx 130rpx;
    }
    .city-select {
        position: absolute;
        left: 0;
        top: 0;
        padding: 20rpx 18rpx;
        font-size: 28rpx;
        color: #030303;
    }
    .cinema-select {
        position: absolute;
        top: 0;
        right: 0;
        padding: 4rpx 14rpx;
    }
    .swiper-container {
        width: 100%;
        height: 364rpx;
    }
    .slide-image {
        width: 100%;
        height: 100%;
    }
    .hotplay-title-container {
        padding: 34rpx 18rpx 32rpx 58rpx;
        line-height: 48rpx;
    }
    .title-normal {
        color: #9a9a9a;
        margin-right: 40rpx;
        font-size: 32rpx;
    }
    .title-select {
        font-size: 36rpx;
        color: #454545;
        font-weight: bold;
    }
    .image-container {
        width: 200rpx;
        display: inline-block;
        margin-right: 8rpx;
    }
    .image-item-container {
        width: 200rpx;
        height: 324rpx;
        border: 1rpx solid #000;
        border-radius: 8rpx;
        overflow: hidden;
    }
    .hotplay-container {
        white-space: nowrap;
    }
    .title-p {
        padding: 16rpx 0 4rpx 20rpx;
    }
    .day-recommend {
        font-size: 36rpx;
        line-height: 48rpx;
        font-weight: bold;
        padding: 32rpx 0 40rpx 20rpx;
    }
    .first-image {
        height: 340rpx;
        border: 1px solid #000;
    }
    .recommend-image-container {
        height: 316rpx;
        border: 2rpx solid #000;
    }
    .p-r-xs {
        padding-right: 10rpx;
    }
    .p-o-xxs {
        padding-left: 5rpx;
        padding-right: 5rpx;
    }
    .p-l-xs {
        padding-left: 10rpx;
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
</style>
