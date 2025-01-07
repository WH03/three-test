<template>
    <div class="canvasbox">
        <div class="canvasDom" id="canvasDom"></div>
        <!-- <a-space>
            <a-button type="primary" danger @click="clearObjects">清除</a-button>
        </a-space> -->
    </div>




</template>

<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import * as THREE from "three";
    import initThree from "@/utils/three/initThree.js";
    import { clearScene, disposeChild } from "@/utils/three/clearScene.js";



    let baseThree;


    onMounted(() => {
        baseThree = new initThree('#canvasDom');
        baseThree.loadCubeModel(0xffff00, 2, 2, 2, { x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0 }, { x: -5, y: 0, z: 0 });

        baseThree.loadCubeModel(0xffff00, 3, 3, 3, { x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
        baseThree.initRaycaster('mousemove', baseThree.scene.children);
        // baseThree.initRaycaster('click', baseThree.scene.children);
    });

    // 销毁
    onUnmounted(() => {
        if (baseThree) {
            clearScene(baseThree.scene.children, baseThree.scene, baseThree.camera, baseThree.renderer);
        }
    })
</script>

<style scoped lang="scss">
    .canvasbox {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        box-sizing: border-box;
    }

    .ant-space {
        position: absolute;
        top: 10px;
        left: 10px;
    }

    .canvasDom {
        width: 100%;
        height: 100%;
    }

</style>
