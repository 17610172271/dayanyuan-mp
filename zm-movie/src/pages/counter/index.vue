<template>
    <div class="counter-warp">
        <p>Vuex counter：{{ count }}</p>
        <p>
            <button @tap="increment">+</button>
            <button @tap="decrement">-</button>
        </p>

        <a href="/pages/index/main" class="home">去往首页</a>
    </div>
</template>

<script>
    // Use Vuex
    import store from './store'

    export default {
        computed: {
            count () {
                return store.state.count
            }
        },
        methods: {
            getData () {
                wx.request({
                    url: 'http://rap2api.taobao.org/app/mock/121595/api/v1/login/getCode?id=6666', // 仅为示例，并非真实的接口地址
                    data: {
                    },
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success(res) {
                        console.log(res.data)
                    }
                })
            },
            increment () {
                store.commit('increment')
            },
            decrement () {
                store.commit('decrement')
            }
        },
        onShow () {
            this.getData()
        }
    }
</script>

<style>
    .counter-warp {
        text-align: center;
        margin-top: 100px;
    }

    .home {
        display: inline-block;
        margin: 100px auto;
        padding: 5px 10px;
        color: blue;
        border: 1px solid blue;
    }
</style>
