<template>
    <div class="border-top">
        <i-cell-group>
            <i-cell title="灯光">
                <!--<i-icon type="unfold" size="14" color="#030303" />-->
                <switch slot="footer" checked color="#f57c00" />
            </i-cell>
            <i-cell title="灯光">
                <switch slot="footer" checked color="#f57c00" />
            </i-cell>
            <i-cell title="空调">
                <slider @change="tempChange" min="0" max="30" v-model="tempVal" show-value activeColor="#f57c00" block-size="18" backgroundColor="#bdbdbd" block-color="#ffa726" />
            </i-cell>
            <i-cell i-class="border-bottom" title="音量">
                <slider @change="volChange" min="0" max="100" v-model="volVal" show-value activeColor="#f57c00" block-size="18" backgroundColor="#bdbdbd" block-color="#ffa726" />
            </i-cell>
        </i-cell-group>
        <i-toast id="toast" />
    </div>
</template>

<script type="text/ecmascript-6">
    import api from '@/api'
    export default {
        data () {
            return {
                data: {

                },
                switch1: true,
                tempVal: 20,
                volVal: 25
            }
        },
        methods: {
            getData () {
                this.$http.post(api.mine.deviceStatus, {
                    version: '1.0.0'
                }, {
                    headers: {
                        'AuthToken': 'ntPgSqdhiNyShvWPiFGhQzNFHzjXSuSr'
                    }
                }).then((res) => {
                    if (res.data.code === 1) {
                        this.data = res.data.data
                    } else {
                        this.$Toast({
                            content: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            },
            tempChange () {},
            volChange () {},
        },
        onShow () {
            this.getData()
        }
    }
</script>

<style scoped>

</style>
