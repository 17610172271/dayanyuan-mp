<template>
    <div class="border-top">
        <div>
            <div class="relative">
                <i-input :value="tel" title="手机号码" :error="telError" type="number" autofocus placeholder="输入有效手机号" @blur="validateTel" @change="telChange"></i-input>
                <div class="btn-code" v-if="codeText==0" @click="getCode">获取验证码</div>
                <div class="btn-code" v-else>{{codeText}}秒</div>
            </div>
            <div class="relative">
                <i-input :value="code" title="验证码" placeholder="输入验证码"></i-input>
            </div>
            <div class="text-center film-detail-btn">
                <buttom class="select-time-btn text-center" @click="submit">完成</buttom>
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
                tel: '',
                telError: false,
                code: '',
                codeText: 0,
                device: '',
                timeout: '',
                userInfo: {}
            }
        },
        methods: {
            getCode () {
                this.validateTel()
                if (this.telError) return
                this.$http.post(api.common.sendCode, {
                    version: '1.0.0',
                    mobile: this.tel,
                    device_no: this.userInfo.last_visit_deviceid
                }).then((res) => {
                    if (res.data.code === 1) {
                        let that = this
                        this.$Toast({
                            content: '验证码已经发送到您手机,请注意查收',
                            type: 'success'
                        })
                        this.codeText = 60
                        this.timeout = setInterval(function () {
                            that.codeText -= 1
                            if (that.codeText === 0) clearInterval(that.timeout)
                        }, 1000)
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            getUserInfo () {
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
            },
            validateTel () {
                if (!/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(this.tel)) {
                    this.telError = true
                    this.$Toast({
                        content: '手机号格式不正确,请重新输入',
                        type: 'warning'
                    })
                } else {
                    this.telError = false
                }
            },
            telChange (e) {
                this.tel = e.target.detail.value
            },
            submit () {
                this.validateTel()
                if (this.telError) return
                if (this.code) {
                    this.$http.post(api.common.editTel, {
                        version: '1.0.0',
                        mobile: this.tel
                    }).then((res) => {
                        if (res.data.code === 1) {

                        } else {
                            this.$Toast({
                                content: res.data.msg,
                                type: 'error'
                            })
                        }
                    })
                }
            }
        },
        onShow () {
            clearInterval(this.timeout)
            this.getUserInfo()
        }
    }
</script>

<style>
    .btn-code {
        position: absolute;
        top: 24rpx;
        right: 20rpx;
        border-radius: 8rpx;
        border: 2rpx solid #ffa726;
        width: 168rpx;
        height: 56rpx;
        line-height: 56rpx;
        text-align: center;
        color: #ffa726;
        z-index: 999;
    }
    .film-detail-btn {
        position: absolute;
        bottom: 150rpx;
        left: 50%;
        transform: translateX(-50%);
    }
</style>
