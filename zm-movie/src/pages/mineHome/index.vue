<template>
    <div class="mine-home">
        <div class="info-container relative">
            <div class="mine-home-avatar"><open-data type="userAvatarUrl"></open-data></div>
            <div class="info-content">
                <div class="text-xxlg"><open-data type="userNickName"></open-data></div>
                <div class="info-tel" v-if="false">187****3344</div>
                <div v-else class="info-tel" style="color: #ef7008;" @click="modal=true">绑定手机号 <span class="info-tel-img"><img src="/static/img/invalid-name@3x.png" alt=""></span></div>
            </div>
        </div>
        <div>
            <i-cell-group>
                <i-cell title="我的收藏" is-link url="/pages/mineCollect/main"></i-cell>
                <i-cell title="我的订单" is-link url="/pages/mineOrder/main"></i-cell>
                <i-cell title="我的设备" i-class="border-bottom" is-link url="/pages/mineDevice/main"></i-cell>
            </i-cell-group>
        </div>
        <i-modal i-class="tel-modal" title="大眼猿 申请获得" :visible="modal" ok-text="允许" cancel-text="拒绝" @ok="doOk" @cancel="doCancel">
            <div class="text-left text-dark m-t-sm text-xlg modal-padding">你的手机号码</div>
            <div class="m-t-sm p-o-md"><input class="tel-ipt p-xs text-lg" type="text" v-model="telVal"></div>
        </i-modal>
        <i-tab-bar :current="currentTab" @change="tabChange" :fixed="true" color="#ef6c00">
            <i-tab-bar-item key="homepage" img="/static/img/ic-hot-nor@3x.png" current-img="/static/img/ic-hot-cat@3x.png" title="热映"></i-tab-bar-item>
            <i-tab-bar-item key="code" icon="scan" current-icon="scan" title="扫码"></i-tab-bar-item>
            <i-tab-bar-item key="mine" img="/static/img/ic-me-nor@3x.png" current-img="/static/img/ic-me@3x.png" title="我的"></i-tab-bar-item>
        </i-tab-bar>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                modal: false,
                telVal: '17610172271',
                currentTab: 'mine'
            }
        },
        methods: {
            doOk () {
                this.modal = false
            },
            doCancel () {
                this.modal = false
            },
            tabChange (detail) {
                if (detail.mp.detail.key == 'code') {
                    wx.scanCode({
                        success(res) {
                            console.log(res)
                        }
                    })
                } else if (detail.mp.detail.key == 'mine') {
                    wx.navigateTo({
                        url: '../mineHome/main'
                    })
                } else {
                    wx.navigateTo({
                        url: '../index/main'
                    })
                }
            }
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
