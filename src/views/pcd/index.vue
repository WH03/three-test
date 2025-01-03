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
    import initThree from "@/utils/three/initThree.js";
    // three
    import * as THREE from "three";
    import { clearScene, disposeChild } from "@/utils/three/clearScene.js";



    let baseThree;
    // 加载点云模型
    // let model = ref('/models/pcd/test.pcd')
    let pcdModel = ref('/models/pcd/pcl_logo.pcd')
    let gltfModel = ref('/models/DJ.glb')


    onMounted(() => {
        baseThree = new initThree('#canvasDom');
        // baseThree.init()
        // 加载 PCD 模型
        baseThree.loadPCDModel(pcdModel.value,
            { x: 10, y: 10, z: 10 },  // scale
            { x: Math.PI, y: 0, z: 0 },  // rotation
            { x: 0, y: 0, z: 0 }   // position
        );
    });



    // // 清除场景中的模型
    // const clearObjects = () => {
    //     if (baseThree) {
    //         // 通过 baseThree 获取场景的子对象，并清除
    //         const myObjects = [...baseThree.scene.children]; // 获取场景中的所有子对象
    //         clearScene(myObjects, baseThree.scene);
    //         console.log('Scene cleared!');
    //     }
    // };



    // 销毁
    onUnmounted(() => {

        if (baseThree) {
            // clearScene(baseThree.scene.children, baseThree.scene);  // 清除场景中的所有对象
            clearScene(baseThree.scene.children, baseThree.scene, baseThree.camera, baseThree.renderer);
            console.log(`output->baseThree`, baseThree)
            console.log('Scene cleared!');
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
        // border: 5px solid #000;
    }

</style>
