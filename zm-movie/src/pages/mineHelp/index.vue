<template>
    <div class="border-top">
        <ul style="margin-bottom: 50px;">
            <li v-for="item in list">
                <div class="p-sm text-lg m-t-sm" style="line-height: 44rpx;">{{item.question}}</div>
                <div class="p-sm text-md" style="background-color: #f1f1f1;line-height: 40rpx;">{{item.answer}}</div>
            </li>
        </ul>
        <i-toast id="toast" />
    </div>
</template>

<script type="text/ecmascript-6">
    import api from '@/api'
    export default {
        data () {
            return {
                list: [
                    {
                        question: 'Q:如何控制影厅的设备？',
                        answer: 'A:首次扫码打开影厅门时，弹出控制面板；在“我的”页面点击“我的设备”，进入后可以控制影厅的设备。'
                    },
                    {
                        question: 'Q:如何选择影院?',
                        answer: 'A:方法一，点击地图页右上角按钮，进入所有影院列表。方法二，选定影片之后，在选择影院。'
                    },
                    {
                        question: 'Q:如何收藏影片?',
                        answer: 'A:在影片详情页，点击影片收藏，收藏成功后，可在“我的”页面中“我的收藏”查看。'
                    },
                    {
                        question: 'Q:为什么不能预定指定影厅？',
                        answer: 'A:大眼猿目前所有影厅都是随机分配，不支持预定指定影厅。'
                    },
                    {
                        question: 'Q:如何评价影院?',
                        answer: 'A:从订单列表已使用订单下面的评价入口进入评价详情。'
                    },
                    {
                        question: 'Q:可以提前进入影厅吗？',
                        answer: '您可在预定影片开始前15分钟内进入影厅准备观影。'
                    },
                    {
                        question: 'Q:同一账户同一时间能预定多个订单吗？',
                        answer: '目前大眼猿只支持同一账户同一时间内预定一个订单。'
                    }
                ]
            }
        },
        methods: {
            
        }
    }
</script>

<style>
    page {
        background-color: #fff !important;
    }
</style>
