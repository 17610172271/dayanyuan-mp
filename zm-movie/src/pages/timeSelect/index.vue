<template>
    <div class="border-top bg-f5">
        <div class="film-name-container bg-white m-b-sm relative">
            <div class="select-time-img"></div>
            <h5 class="text-dark text-lg text-line-normal">后来的我们</h5>
            <div class="text-sm text-gray text-line-normal">朝阳区东大桥路9号芳草地大厦LG-26</div>
            <div class="price-container">
                <div class="text-orange text-line-normal text-center">¥123起</div>
            </div>
        </div>
        <div class="select-time-container bg-white p-v-lg p-o-md">
            <div class="timer-container p-t-sm p-b-md">
                <h5 class="text-lg text-dark text-bold text-line-normal text-center">选择时间</h5>
                <i-tabs :current="current" @change="tabChange" color="#f98d0f">
                    <i-tab key="today" title="今天01月21日"></i-tab>
                    <i-tab key="tomorrow" title="明天01月22日"></i-tab>
                    <i-tab key="aftertomorrow" title="后天01月23日"></i-tab>
                </i-tabs>
                <picker-view
                    indicator-style="height: 50px;"
                    indicator-class="selected-style"
                    style="width: 100%; height: 460rpx; text-align: center;"
                    :value="selectTime"
                    @change="bindChange">
                    <picker-view-column>
                        <view v-for="(item, index) in hours" :key="index" style="line-height: 50px;font-size: 32rpx;">{{item}}时</view>
                    </picker-view-column>
                    <picker-view-column>
                        <view v-for="(item, index) in minutes" :key="index" style="line-height: 50px;font-size: 32rpx;">{{item}}分</view>
                    </picker-view-column>
                    <picker-view-column>
                        <view v-for="(item, index) in status" :key="index" style="line-height: 50px;font-size: 32rpx;">{{item}}</view>
                    </picker-view-column>
                </picker-view>
            </div>
            <div class="text-center" style="margin-top: 112rpx;">
                <a href="/pages/orderConfirm/main" class="select-time-btn text-center">选定时间</a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                current: 'today',
                selectTime: '',
                hours: [],
                minutes: [],
                status: ['可预订'],
                hour: '',
                minute: ''
            }
        },
        methods: {
            tabChange (detail) {
                this.current = detail.target.key
            },
            bindChange(e) {
                console.log(e)
//                this.setData({
//                    year: this.data.hours[val[0]],
//                    month: this.data.minutes[val[1]],
//                    day: this.data.status[val[2]]
//                })
            }
        },
        created () {
            for (let i = 0; i < 24; i++) {
                this.hours.push(i < 10 ? '0' + i : i + '')
            }
            for (let i = 0; i < 60; i++) {
                this.minutes.push(i < 10 ? '0' + i : i + '')
            }
        }
    }
</script>

<style>
    .film-name-container {
        padding: 20rpx 160rpx 20rpx 140rpx;
    }
    .select-time-img {
        width: 64rpx;
        height: 92rpx;
        border: 2rpx solid #000;
        border-radius: 4rpx;
        position: absolute;
        top: 20rpx;
        left: 40rpx;
    }
    .price-container {
        position: absolute;
        top: 40rpx;
        right: 20rpx;
    }
    .timer-container {
        height: 660rpx;
        border-radius: 72rpx;
        box-shadow: 2rpx 12rpx 18rpx 0 rgba(164, 160, 155, 0.28), 0 0 6rpx 0 rgba(0, 0, 0, 0.08);
    }
    .selected-style {
        box-shadow: 0 2px 4px 0 rgba(255, 167, 38, 0.43);
        background-color: rgba(255, 167, 38, 0.1);
        color: #ffa726;
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
