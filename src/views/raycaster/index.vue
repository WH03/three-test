<!--
 * @Author: kkk 847666794www@163.com
 * @Date: 2025-01-13 10:54:54
 * @LastEditors: kkk 847666794www@163.com
 * @LastEditTime: 2025-01-14 17:33:38
 * @FilePath: \three-test\src\views\raycaster\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="canvasbox">
        <div class="canvasDom" id="canvasDom"></div>
        <a-space>
            <a-button type="primary" danger @click="clearObjects">清除</a-button>
        </a-space>
    </div>




</template>

<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import * as THREE from "three";
    import { baseScene } from "@/utils/three/baseScene.js";
    import { clearScene, disposeChild } from "@/utils/three/clearScene.js";



    let baseThree;

    let gltfModel1 = ref('/models/DJ.glb')
    let gltfModel3 = ref('/models/gltf/shiji-v4.glb')
    let gltfModel4 = ref('models/20240222/body.gltf')



    onMounted(() => {
        baseThree = new baseScene('#canvasDom');
        // baseThree.loadCubeModel(0xff00cc, 2, 2, 2, { x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0 }, { x: -5, y: 0, z: 0 });

        // baseThree.loadCubeModel(0xffff00, 3, 3, 3, { x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });

        // baseThree.loadGLTFModel(gltfModel1.value,
        //     { x: 1, y: 1, z: 1 },  // scale
        //     { x: 0, y: 0, z: 0 },  // rotation
        //     { x: 0, y: 0, z: 0 }   // position
        // );
        // baseThree.loadGLTFModel(gltfModel3.value,
        //     { x: 1, y: 1, z: 1 },  // scale
        //     { x: 0, y: 0, z: 0 },  // rotation
        //     { x: 2, y: 0, z: 0 }   // position
        // );
        // baseThree.loadGLTFModel(gltfModel4.value,
        //     { x: 10, y: 10, z: 10 },  // scale
        //     { x: 0, y: 0, z: 0 },  // rotation
        //     { x: 3, y: -5, z: 0 }   // position
        // );



        // baseThree.initRaycaster('mousemove', baseThree.scene.children);
        // baseThree.initRaycaster('mousemove', baseThree.modelsArr);
        // baseThree.initRaycaster('mousemove', baseThree.modelsArr);

        // console.log(`output-> baseThree.modelsArr`, baseThree.modelsArr);

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
