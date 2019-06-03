<template>
    <div class="rule-container bg-f5">
        <div class="rule-content  relative">
            <div class="rule-title text-center">使用规则</div>
            <p v-for="(item,index) in ruleList" :key="index">{{index + 1}}、{{item}}；</p>
            <p class="text-center" v-if="ruleList.length===0">没有更多规则</p>
        </div>
    </div>
</template>

<script>
    import api from '@/api'
    export default {
        data () {
            return {
                id: '',
                ruleList: [],
                userInfo: {}
            }
        },
        methods: {
            getData () {
                this.$http.post(api.coupon.getRule, {
                    coupon_id: this.id
                }, {
                    headers: {
                        'AuthToken': this.userInfo.auth_token
                    }
                }).then((res) => {
                    if (res.data.code === 1) {
                        this.ruleList = res.data.data.activity_rules
                    } else {
                        this.ruleList = []
                    }
                })
            }
        },
        onLoad (option) {
            this.id = option.id
            let that = this
            wx.getStorage({
                key: 'userInfo',
                success(res) {
                    that.userInfo = res.data
                    that.getData()
                },
                fail () {
                    that.userInfo = {}
                }
            })
        }
    }
</script>

<style>
    .rule-container {
        padding: 92rpx 24rpx 24rpx 24rpx;
    }
    .rule-content {
        border-radius: 5px;
        border: solid 1px #f9b12d;
        background-color: #fff3dd;
        padding: 80rpx 60rpx 60rpx 60rpx;
        font-family: PingFangSC;
        font-size: 14px;
        font-weight: 500;
        color: #ef6c00;
        line-height: 40rpx;
    }
    .rule-title {
        width: 258px;
        height: 39px;
        background: url(../../../static/img/img-service-regulation.png) no-repeat;
        background-size: cover;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -65%);
        line-height: 35px;
        font-family: PingFangSC;
        font-size: 15px;
        font-weight: 500;
        color: #fef3d7;
    }
</style>
