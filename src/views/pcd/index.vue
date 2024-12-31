<template>
    <div class="canvasbox">
        <a-space>
            <a-button type="primary" @click="togglePencilMode">按钮</a-button>
            <a-button type="primary" @click="saveCanvas">保存</a-button>
            <a-button type="primary" @click="clearCanvas">清除</a-button>
            <a-button type="primary" @click="prevImage">上一张</a-button>
            <a-button type="primary" @click="nextImage">下一张</a-button>
        </a-space>
        <canvas ref="canvasDom" class="canvas"></canvas>
    </div>


</template>


<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import initThree from "@/utils/three/initThree.js";
    // three
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';
    import { clearScene, disposeChild } from "@/utils/three/clearScene.js";
    const canvasDom = ref(null);

    let baseThree, controls;

    let group = ref(null);
    // 创建一个组并添加多个立方体
    group.value = new THREE.Group();

    // 加载点云模型
    let model = ref('/models/pcd/test.pcd')
    // 加载点云
    function loadModel(model, scaleX, scaleY, scaleZ) {
        const loader = new PCDLoader();
        loader.load(model, function (obj) {
            obj.geometry.center();
            obj.geometry.rotateX(-Math.PI / 2);
            obj.name = 'pcd';
            obj.scale.set(scaleX, scaleY, scaleZ);

            group.value.add(obj);
            baseThree.scene.add(obj);
            baseThree.scene.add(group.value);

        });
    }





    onMounted(() => {
        console.log(`output->canvasDom.value`, canvasDom.value)
        baseThree = new initThree(canvasDom.value);
        baseThree.camera.position.set(30, 30, 30);
        baseThree.initAxesHelper();
        loadModel(model.value, 10, 10, 10)
        controls = new OrbitControls(baseThree.camera, baseThree.renderer.domElement);
        controls.enableDamping = true//开启阻尼,让动画更平滑
        update();

    });

    let i = 0
    function update() {
        i++
        requestAnimationFrame(update);
        console.log(`output->i@@@`, i)
        baseThree.update();
        controls.update();
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
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .ant-space {
        position: absolute;
        top: 10px;
        left: 10px;
    }

    .canvas {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

</style>
