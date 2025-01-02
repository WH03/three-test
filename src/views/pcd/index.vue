<template>
    <div class="canvasbox">
        <a-space>
            <!-- <a-button type="primary" @click="togglePencilMode">按钮</a-button>
            <a-button type="primary" @click="saveCanvas">保存</a-button>
            <a-button type="primary" @click="clearCanvas">清除</a-button>
            <a-button type="primary" @click="prevImage">上一张</a-button>
            <a-button type="primary" @click="nextImage">下一张</a-button> -->
        </a-space>
        <!-- <canvas ref="canvasDom" class="canvas" id="canvasDom">
        </canvas> -->
        <div class="canvasDom" id="canvasDom"></div>
    </div>

</template>

<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import initThree from "@/utils/three/initThree.js";
    // three
    import * as THREE from "three";
    import { clearScene, disposeChild } from "@/utils/three/clearScene.js";



    let baseThree;

    let group = ref(null);
    // 创建一个组并添加多个立方体
    group.value = new THREE.Group();

    // 加载点云模型
    // let model = ref('/models/pcd/test.pcd')
    let pcdModel = ref('/models/pcd/pcl_logo.pcd')
    let gltfModel = ref('/models/DJ.glb')






    onMounted(() => {
        baseThree = new initThree('#canvasDom');
        baseThree.init()
        // baseThree.loadPCDModel(pcdModel.value, 1, 1, 1, Math.PI, 0, 0, 0, 0, 0);
        baseThree.loadGLTFModel(gltfModel.value, 10, 10, 10, 0, 0, 0, 0, 0, 0);
    });


    let i = 0
    function animate() {
        i++
        requestAnimationFrame(animate);
        // console.log(`output->i@@@`, i)
        baseThree.update();
        baseThree.controls.update();
    }



    // 销毁
    onUnmounted(() => {
        if (baseThree.scene) {
            console.log(`output->group.value`, group.value)
            clearScene([group.value], baseThree.scene);
        }
        if (baseThree.renderer) {

            baseThree.renderer.dispose();  // 清理 WebGL 渲染器
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
