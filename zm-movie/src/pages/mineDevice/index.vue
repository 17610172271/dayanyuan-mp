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
    </div>
</template>

<script>
    export default {
        data () {
            return {
                switch1: true,
                tempVal: 20,
                volVal: 25
            }
        },
        methods: {
            tempChange () {},
            volChange () {},
        }
    }
</script>

<style scoped>

</style>
