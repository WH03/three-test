<template>
    <div class="canvasbox">
        <div class="canvasDom" id="canvasDom"></div>
        <a-space>
            <a-button type="primary" @click="curveMove">轨迹动画</a-button>
            <!-- <a-button type="primary" danger @click="clearObjects">清除</a-button> -->
        </a-space>
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
    let pcdModel = ref('/models/pcd/default/GlobalMap.pcd')


    let pointList = [
        new THREE.Vector3(-3, 4, 2),
        new THREE.Vector3(3, 4, 2),
        new THREE.Vector3(3, 4, -2),
        new THREE.Vector3(5, 2, -2),
    ];

    const curveMove = () => {

    }




    onMounted(() => {
        baseThree = new initThree('#canvasDom');
        // baseThree.init()
        // 加载 PCD 模型
        baseThree.loadPCDModel(pcdModel.value,
            { x: 1, y: 1, z: 1 },  // scale
            { x: Math.PI / 2, y: Math.PI, z: 0 },  // rotation
            // { x: 0, y: 0, z: 0 }   // position
        );

        baseThree.addCurveLine(pointList);
        baseThree.initRaycaster('click', baseThree.scene.children);

    });




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
