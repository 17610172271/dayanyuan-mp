<template>
    <div class="border-top">
        <!--扫码中-->
        <div v-if="status===1">
            <div class="lock-img"></div>
            <div class="progress-container">
                <div class="progress-orange"></div>
            </div>
            <div class="progress-text text-lg text-dark">门锁将在5秒内打开，请稍后</div>
        </div>
        <!--开舱中-->
        <div v-else-if="status===2">
            <div class="unlock-img"></div>
            <div class="progress-container">
                <div class="progress-orange"></div>
            </div>
            <div class="progress-text text-lg text-dark">门锁将在5秒内打开，请稍后</div>
        </div>
        <div v-else-if="status===4" class="p-sm text-center text-orange">没有可以控制的设备</div>
        <div v-else>
            <i-cell-group>
                <i-cell title="新风">
                    <i-switch :value="data.air_switch_status==1" size="default" i-class="device-btn" @change="air_switchChange" slot="footer"></i-switch>
                </i-cell>
                <i-cell title="天窗">
                    <i-switch :value="data.skylight_status==1" size="default" i-class="device-btn" @change="skylightChange" slot="footer"></i-switch>
                </i-cell>
                <i-cell title="顶灯">
                    <i-switch :value="data.lamp_indoor_top_switch_status==1" size="default" i-class="device-btn" @change="top_switchChange" slot="footer"></i-switch>
                </i-cell>
                <i-cell title="地灯">
                    <i-switch :value="data.lamp_indoor_foot_switch_status==1" size="default" i-class="device-btn" @change="foot_switchChange" slot="footer"></i-switch>
                </i-cell>
                <i-cell i-class="border-top-large">
                    <div class="clear">
                        <span class="pull-left"><i class="fa fa-edit"></i>空调</span>
                        <i-switch :value="data.aircondition_switch_status==1" class="pull-right" size="default" i-class="device-btn" @change="airconditionChange" slot="footer"></i-switch>
                    </div>
                    <div class="relative conditioner-container" v-show="data.aircondition_switch_status==1">
                        <slider @change="tempChange" style="padding: 14rpx 0;" min="18" max="30" v-model="data.aircondition_temperature" show-value :activeColor="activeColor" block-size="18" :backgroundColor="backgroundColor" :block-color="blockColor" />
                        <!-- <div class="btn-cool-hot clear" @tap="isCool=!isCool">
                            <div class="pull-left" :class="{'btn-cool': isCool}">冷</div>
                            <div class="pull-right" :class="{'btn-hot': !isCool}">热</div>
                        </div> -->
                    </div>
                </i-cell>
                <i-cell i-class="border-top-large">
                    <div class="relative conditioner-container">
                        <slider @change="volChange" min="0" max="100" v-model="data.play_vloume" show-value activeColor="#f57c00" block-size="18" backgroundColor="#bdbdbd" block-color="#ffa726" />
                        <span class="voice-title">音量</span>
                    </div>
                    
                </i-cell>
            </i-cell-group>
        </div>
        <i-toast id="toast" />
    </div>
</template>

<script type="text/ecmascript-6">
    import api from '@/api'
    export default {
        data () {
            return {
                data: {
                    aircondition_switch_status: 0, // 空调
                    skylight_status: 0, // 天窗
                    air_switch_status: 0, // 新风
                    lamp_indoor_top_switch_status: 0, // 顶灯
                    lamp_indoor_foot_switch_status: 0, // 底灯
                    play_vloume: 0
                },
                id: '',
                trade_id: '',
                userInfo: {},
                tempVal: 20,
                status: 1,
                isCool: true
            }
        },
        computed: {
            activeColor () {
                return this.isCool ? '#6d9af9' : '#f8634e'
            },
            backgroundColor () {
                return '#bdbdbd'
            },
            blockColor () {
                return this.isCool ? '#cedeff' : '#ff9688'
            }
        },
        methods: {
            getData () {
                let that = this
                console.log(this.id)
                if (!this.id) {
                    this.status = 4
                    return
                }
                wx.showLoading({
                    title: '加载中',
                })
                this.$http.post(api.mine.deviceStatus, {
                    version: '1.0.0',
                    hall_id: this.id
                }, {
                    headers: {
                        'AuthToken': this.userInfo.auth_token
                    }
                }).then((res) => {
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 500)
                    if (res.data.code === 1) {
                        this.data = res.data.data
                        if (this.status === 1) {
                            this.status = 2
                            setTimeout(function () {
                                that.status = 3
                            }, 1000)
                        }
                    } else if (res.data.msg === '请先获取控制授权') {
                        this.status = 4
                    } else {
                            setTimeout(function () {
                                that.getData()
                            }, 1000)
                        }
                })
            },
            airconditionChange (e) {
                this.data.aircondition_switch_status = e.target.value
                let status = e.target.value ? 'aircondition_on' : 'aircondition_off'
                this.deviceContol(status)
            },
            tempChange (e) {
                this.data.aircondition_temperature = e.target.value
                let status = 'aircondition_set_value'
                this.deviceContol(status, this.data.aircondition_temperature)
            },
            skylightChange (e) {
                this.data.skylight_status = e.target.value
                let status = e.target.value ? 'skylight_on' : 'skylight_off'
                this.deviceContol(status)
            },
            air_switchChange (e) {
                this.data.air_switch_status = e.target.value
                let status = e.target.value ? 'switch_air_on' : 'switch_air_off'
                this.deviceContol(status)
            },
            top_switchChange (e) {
                this.data.lamp_indoor_top_switch_status = e.target.value
                let status = e.target.value ? 'switch_lamp_top_on' : 'switch_lamp_top_off'
                this.deviceContol(status)
            },
            foot_switchChange (e) {
                this.data.lamp_indoor_foot_switch_status = e.target.value
                let status = e.target.value ? 'switch_lamp_foot_on' : 'switch_lamp_foot_off'
                this.deviceContol(status)
            },
            volChange (e) {
                this.data.play_vloume = e.target.value
                this.deviceContol('volume_set_value', this.data.play_vloume)
            },
            deviceContol (status, value) {
                this.$http.post(api.mine.control, {
                    hall_id: this.id,
                    trade_id: this.trade_id,
                    version: '1.0.0',
                    cmd: status,
                    data: value ? {value: value} : ''
                }, {
                    headers: {
                        'AuthToken': this.userInfo.auth_token
                    }
                }).then(res => {
                    if (res.data.code === 1) {
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
        onLoad (option) {
            this.status = 1
            if (option.id) {
                this.status = 1
                this.id = option.id
                this.trade_id = option.trade_id
            } else {
                this.status = 3
            }

            let that = this
            wx.getStorage({
                key: 'userInfo',
                success (res) {
                    that.userInfo = res.data
                    wx.getStorage({
                        key: 'hall_id',
                        success(res) {
                            console.log(res.data, 'hall_id')
                            that.id = res.data.hall_id || that.id
                            that.trade_id = res.data.trade_id || that.trade_id
                            that.getData()
                        },
                        fail (error) {
                            console.log('err')
                            that.getData()
                        }
                    })
                },
                fail () {
                    that.userInfo = {}
                }
            })
        }
    }
</script>

<style>
    .lock-img {
        margin: 180rpx auto 188rpx;
        width: 132rpx;
        height: 172rpx;
        background-image: url(../../../static/img/ic-lock@3x.png);
        background-repeat: no-repeat;
        background-size: cover;
    }
    .unlock-img {
        margin: 180rpx auto 188rpx;
        width: 196rpx;
        height: 168rpx;
        background-image: url(../../../static/img/ic-unlock@3x.png);
        background-repeat: no-repeat;
        background-size: cover;
    }
    .progress-container {
        width: 600rpx;
        height: 12rpx;
        background-color: #efeff0;
        margin: 0 auto;
    }
    .progress-orange {
        display: block;
        width: 60%;
        height: 12rpx;
        background-color: #f57c00;
        border-radius: 6rpx;
    }
    .progress-text {
        margin-top: 90rpx;
        text-align: center;
    }
    .conditioner-container {
        padding-left: 240rpx;
    }
    .voice-title {
        position: absolute;
        left: 0;
        top: 0;
    }
    .btn-cool-hot > div {
        width: 50%;
        height: 100%;
        text-align: center;
        color: #fff;
        line-height: 36px;
    }
    .btn-hot {
        background-color: #f8634e;
    }
    .btn-cool {
        background-color: #6d9af9;
    }
    .border-top-large {
        border-top: 9px solid #f5f6f6;
    }
</style>
