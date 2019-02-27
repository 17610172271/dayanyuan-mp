<template>
    <div class="mine-home">
        <div class="info-container relative">
            <div class="mine-home-avatar"><open-data type="userAvatarUrl"></open-data></div>
            <div class="info-content">
                <div class="text-xxlg"><open-data type="userNickName"></open-data></div>
                <div class="info-tel" v-if="userInfo.user_mobile">{{userInfo.user_mobile}}</div>
                <button v-else open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="info-tel" style="color: #ef7008;">绑定手机号 <span class="info-tel-img"><img src="/static/img/invalid-name@3x.png" alt=""></span></button>
            </div>
        </div>
        <div>
            <i-cell-group>
                <i-cell title="我的收藏" is-link url="/pages/mineCollect/main"></i-cell>
                <i-cell title="我的订单" is-link url="/pages/mineOrder/main"></i-cell>
                <i-cell title="我的设备" i-class="border-bottom" is-link url="/pages/mineDevice/main"></i-cell>
            </i-cell-group>
        </div>
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
                <div class="text-md">离观影时间还有: <br> <span class="text-xlg text-orange">{{orderInfo && orderInfo.count_down}}分钟</span> <br> <span class="">(请在观影前15分钟内打开舱门)</span></div>
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

<script type="text/ecmascript-6">
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
            doOk () {
                this.modal = false
                this.modal1 = false
                this.modal2 = false
            },
            doCancel () {
                this.modal = false
                this.modal1 = false
                this.modal2 = false
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
                                        data: hall_id
                                    })
                                    wx.navigateTo({
                                        url: '../mineDevice/main?id=' + hall_id + '&trade_id=' + res.data.data[0].trade_id
                                    })
                                } else if (res.data.code === 0) {
                                    that.modal = true
                                    that.orderInfo = res.data.data[0]
                                } else if (res.data.code === 2) {
                                    that.modal2 = true
                                    that.orderInfo = res.data.data[0]
                                    that.$set(that.orderInfo, 'count_down', parseInt((that.orderInfo.trade_start_time * 1000 - new Date().getTime()) / 1000 / 60))
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
                    wx.redirectTo({
                        url: '../mineHome/main'
                    })
                } else {
                    wx.redirectTo({
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


</style>
