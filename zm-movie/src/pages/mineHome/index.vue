<template>
    <div class="mine-home">
        <div class="info-container relative">
            <div class="mine-home-avatar bg-white"><open-data type="userAvatarUrl"></open-data></div>
            <div class="info-content">
                <div class="text-xxlg"><open-data type="userNickName"></open-data></div>
                <div class="info-tel" v-if="userInfo.user_mobile">{{userInfo.user_mobile}}</div>
                <button v-else open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="info-tel" style="color: #ef7008;">绑定手机号 <span class="info-tel-img"><img src="/static/img/invalid-name@3x.png" alt=""></span></button>
            </div>
        </div>
        <div class="text-center p-v-sm">
            <navigator class="home-btn-item m-r-lg" url="/pages/mineCollect/main"><span class="mine-item-img mine-item-collect"></span>收藏</navigator>
            <navigator class="home-btn-item" url="/pages/mineCoupon/main"><span class="mine-item-img mine-item-coupon"></span>优惠券</navigator>
        </div>
        <div class="line-f5"></div>
        <ul class="mine-list-container">
            <li @tap="navigateTo('mineOrder')"><span class="mine-list-img mine-list-order"></span>我的订单<i-icon type="enter" class="pull-right mine-list-icon" size="16" color="#cacaca" /></li>
            <li @tap="navigateTo('mineHelp')"><span class="mine-list-img mine-list-help"></span>帮助中心<i-icon type="enter" class="pull-right mine-list-icon" size="16" color="#cacaca" /></li>
            <li @tap="navigateTo('mineAbout')"><span class="mine-list-img mine-list-about"></span>关于我们<i-icon type="enter" class="pull-right mine-list-icon" size="16" color="#cacaca" /></li>
            <li @tap="navigateTo('mineDevice')"><span class="mine-list-img mine-list-device"></span>设备控制<i-icon type="enter" class="pull-right mine-list-icon" size="16" color="#cacaca" /></li>
        </ul>
<!--         <div>
            <i-cell-group>
                <i-cell title="我的收藏" is-link url="/pages/mineCollect/main"></i-cell>
                <i-cell title="我的订单" is-link url="/pages/mineOrder/main"></i-cell>
                <i-cell title="我的设备" is-link url="/pages/mineDevice/main"></i-cell>
                <i-cell title="帮助中心" i-class="border-bottom" is-link url="/pages/mineHelp/main"></i-cell>
            </i-cell-group>
        </div> -->
        <i-modal i-class="notice-modal" :visible="modal" ok-text="去预定" cancel-text="再看看" @ok="doOk" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(https://img01.wanfangche.com/public/upload/201901/29/5c4fc50127400.png);background-repeat: no-repeat;background-size: 100% 156px;padding:40px;">
                <div class="text-xlg">您没有可用的观影券 <br> 请先预定</div>
            </div>
        </i-modal>
        <i-modal i-class="notice-modal" :visible="modal1" ok-text="再来一单" cancel-text="知道了" @ok="doOk" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(https://img01.wanfangche.com/public/upload/201901/29/5c4fc50127400.png);background-repeat: no-repeat;background-size: 100% 156px;padding:40px;">
                <div class="text-xlg">不是该影仓观影券 <br> 请您到{{orderInfo && orderInfo.hall_name}}</div>
            </div>
        </i-modal>
        <i-modal i-class="notice-modal" :visible="modal2" ok-text="再来一单" cancel-text="知道了" @ok="doOk" @cancel="doCancel">
            <div class="notice-modal-container" style="height: 156px;background-image: url(https://img01.wanfangche.com/public/upload/201901/29/5c4fc50127400.png);background-repeat: no-repeat;background-size: 100% 156px;padding:20px;">
                <div class="text-md">离观影时间还有: <br> <span class="text-xlg text-orange">{{orderInfo && orderInfo.count_down}}</span> <br> <span class="">(请在观影前15分钟内打开舱门)</span></div>
            </div>
        </i-modal>
        <i-tab-bar :current="currentTab" @change="tabChange" :fixed="true" color="#ef6c00">
            <i-tab-bar-item key="homepage" img="/static/img/ic-hot-nor@3x.png" current-img="/static/img/ic-hot-cat@3x.png" title="热映"></i-tab-bar-item>
            <i-tab-bar-item key="code" icon="scan" current-icon="scan" title="扫码"></i-tab-bar-item>
            <i-tab-bar-item key="mine" img="/static/img/ic-me-nor@3x.png" current-img="/static/img/ic-me@3x.png" title="我的"></i-tab-bar-item>
        </i-tab-bar>
        <i-toast id="toast" />
    </div>
</template>

<script>
    import api from '@/api'
    export default {
        data () {
            return {
                modal: false,
                telVal: '17610172271',
                currentTab: 'mine',
                userInfo: '',
                modal: false,
                modal1: false,
                modal2: false,
                orderInfo: {}
            }
        },
        methods: {
            getPhoneNumber (e) {
                console.log(e)
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
            returnDate (time) {
                time *= 1
                console.log(parseInt(time / 1440) + '天' + parseInt((time % 1440) / 60) + '小时' + time % 60 + '分钟', 'time')
                if (time > 1440) {
                    return parseInt(time / 1440) + '天' + parseInt((time % 1440) / 60) + '小时' + time % 60 + '分钟'
                } else if (time > 60) {
                    return parseInt(time / 60) + '小时' + time % 60 + '分钟'
                } else {
                    return time + '分钟'
                }
            },
            doOk () {
                this.modal = false
                this.modal1 = false
                this.modal2 = false
                wx.navigateTo({
                    url: '../index/main'
                })
            },
            doCancel () {
                this.modal = false
                this.modal1 = false
                this.modal2 = false
            },
            navigateTo (target) {
                wx.navigateTo({
                    url: '../' + target +'/main'
                })
            },
            tabChange (detail) {
                let that = this
                if (detail.mp.detail.key == 'code') {
                    // 扫码开舱
                    wx.scanCode({
                        success(res) {
                            console.log(res, 'url')
                            let hall_id = res.result.slice(res.result.indexOf('hall_id=')).split('=')[1]
                            that.$http.post(api.common.open, {
                                version: '1.0.0',
                                hall_id: hall_id
                            }, {
                                headers: {
                                    'AuthToken': that.userInfo.auth_token
                                }
                            }).then((res) => {
                                if (res.data.code === 1) {
                                    // 允许控制
                                    wx.setStorage({
                                        key: 'hall_id',
                                        data: {
                                            hall_id: hall_id,
                                            trade_id: res.data.data[0].trade_id
                                        },
                                        success () {
                                            wx.navigateTo({
                                                url: '../mineDevice/main?id=' + hall_id + '&trade_id=' + res.data.data[0].trade_id
                                            })
                                        }
                                    })
                                } else if (res.data.code === 0) {
                                    that.modal = true
                                    that.orderInfo = res.data.data[0]
                                } else if (res.data.code === 2) {
                                    that.modal2 = true
                                    that.orderInfo = res.data.data[0]
                                    that.$set(that.orderInfo, 'count_down', that.returnDate(parseInt((that.orderInfo.trade_start_time * 1000 - new Date().getTime()) / 1000 / 60)))
                                } else if (res.data.code === 3) {
                                    that.modal1 = true
                                    that.orderInfo = res.data.data[0]
                                } else {
                                    that.$Toast({
                                        content: res.data.msg,
                                        type: 'error'
                                    })
                                }
                            })
                        }
                    })
                } else if (detail.mp.detail.key == 'mine') {
                    wx.reLaunch({
                        url: '../mineHome/main'
                    })
                } else {
                    wx.reLaunch({
                        url: '../index/main'
                    })
                }
            }
        },
        onLoad () {
            wx.checkSession({
                success() {
                    // session_key 未过期，并且在本生命周期一直有效
                },
                fail() {
                    // session_key 已经失效，需要重新执行登录流程
                    console.log('relogin')
                    wx.login() // 重新登录
                }
            })
            let that = this
            wx.getStorage({
                key: 'userInfo',
                success(res) {
                    that.userInfo = res.data
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
        background-color: #fff !important;
    }
    .info-container {
        height: 220rpx;
        background-color: #f5f5f5;
        padding: 40rpx 40rpx 40rpx 24rpx;
    }
    .info-content {
        padding-left: 184rpx;
        position: absolute;
        top: 48rpx;
        left: 0;
    }
    .info-tel {
        color: #494949;
        font-size: 30rpx;
        line-height: 48rpx;
        margin-top: 18rpx;
        border: 0;
        outline: none;
        background-color: #f5f5f5;
        padding: 0;
    }
    .info-tel::after {
        border:none;
    }
    .info-tel-img {
        display: inline-block;
        width: 32rpx;
        height: 24rpx;
    }
    .info-tel-img img {
        width: 100%;
        height: 100%;
        vertical-align: middle;
    }
    .home-btn-item {
        display: inline-block;
        width: 292rpx;
        height: 92rpx;
        line-height: 92rpx;
        color: #fff;
        font-weight: 500;
        font-size: 30rpx;
        border-radius: 4px;
        box-shadow: 0 4px 4px 0 rgba(255, 206, 206, 0.98);
        background-image: linear-gradient(to right, #ffa862, #fa667d);
    }
    .line-f5 {
        height: 16rpx;
        background-color: #f5f5f5;
    }
    .mine-item-img {
        display: inline-block;
        width: 72rpx;
        height: 72rpx;
        margin-right: 14rpx;
        vertical-align: -20rpx;
    }
    .mine-item-collect {
        background: url(../../../static/img/ic@3x.png) no-repeat;
        background-size: cover;
    }
    .mine-item-coupon {
        background: url(../../../static/img/ic-discount@3x.png) no-repeat;
        background-size: cover;
    }
    .mine-list-container li {
        height: 96rpx;
        line-height: 96rpx;
        font-family: PingFangSC;
        font-size: 14px;
        color: rgba(42, 42, 42, 0.87);
        padding-left: 74rpx;
        border-bottom: 2rpx solid #e4e4e4;
    }
    .mine-list-icon {
        margin-right: 56rpx;
        font-weight: bold;
    }
    .mine-list-img {
        display: inline-block;
        width: 56rpx;
        height: 56rpx;
        margin-right: 36rpx;
        vertical-align: -16rpx;
    }
    .mine-list-order {
        background: url(../../../static/img/ic-mony@3x.png) no-repeat;
        background-size: cover;
    }
    .mine-list-help {
        background: url(../../../static/img/ic-help@3x.png) no-repeat;
        background-size: cover;
    }
    .mine-list-about {
        background: url(../../../static/img/ic-aboutus@3x.png) no-repeat;
        background-size: cover;
    }
    .mine-list-device {
        background: url(../../../static/img/ic-equipment@3x.png) no-repeat;
        background-size: cover;
    }
</style>
