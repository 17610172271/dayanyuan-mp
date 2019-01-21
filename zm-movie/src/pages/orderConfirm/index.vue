<template>
    <div class="border-top">
        <div class="order-info bg-white">
            <h5 class="text-xlg text-bold text-line-normal">后来的我们</h5>
            <div class="text-gray text-line-normal" style="margin-top: 28rpx;">Us and Them</div>
            <div class="text-lg text-line-normal" style="margin-top: 28rpx;">观影时间</div>
            <div class="text-orange text-line-normal" style="margin-top: 28rpx;">2018年5月17日 14:20-16:40</div>
            <div class="text-lg text-line-normal" style="margin-top: 28rpx;">观影地点</div>
            <div class="text-bold text-orange text-line-normal" style="margin-top: 28rpx;">万达国际影城(耳东）世贸天阶店1号影舱</div>
            <div class="m-t-md border-top-dashed clear p-t-lg">
                <div class="pull-left m-l-md">总票价</div>
                <div class="pull-right text-sm text-orange">¥ <span class="text-xxlg">121</span></div>
            </div>
        </div>
        <div class="p-md">
            <h5 class="text-dark text-bold text-line-normal">购票须知:</h5>
            <div class="text-gray text-sm m-t-sm text-line-normal">影舱影票一经售出不可退换，请提前10分钟到达指定影舱，不可更改放映影舱。如遇问题请与客服人员联系。</div>
            <div class="text-center" style="margin-top: 108rpx;">
                <a href="/pages/orderDetail/main" class="select-time-btn text-center">确认支付</a>
                <div class="text-center text-gray text-sm m-t-sm">支付剩余时间 03:30</div>
            </div>
        </div>
        <i-modal i-class="tel-modal" title="大眼猿 申请获得" :visible="modal" ok-text="允许" cancel-text="拒绝" @ok="doOk" @cancel="doCancel">
            <div class="text-left text-dark m-t-sm text-xlg modal-padding">你的手机号码</div>
            <div class="m-t-sm p-o-md"><input class="tel-ipt p-xs text-lg" type="text" v-model="telVal"></div>
        </i-modal>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                modal: false,
                telVal: '17610111283'
            }
        },
        methods: {
            doOk () {
                this.modal = false
            },
            doCancel () {
                this.modal = false
            }
        }
    }
</script>

<style>
    page {
        background-color: #f5f5f5 !important;
    }
    .order-info {
        /*height: 640rpx;*/
        padding: 30rpx 40rpx;
    }
    .select-time-btn {
        display: block;
        margin: 0 auto;
        width: 556rpx;
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 40rpx;
        box-shadow: 0 4px 4px 0 rgba(255, 161, 80, 0.24), 0 0 20px 0 rgba(255, 143, 0, 0.37);
        background-image: linear-gradient(275deg, #f57c00, #ffa726);
        color: #fff;
        font-size: 28rpx;
    }
</style>
