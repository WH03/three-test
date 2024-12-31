<template>
    <div class="canvasbox">
        <a-space>
            <!-- <a-button type="primary" @click="togglePencilMode">按钮</a-button>
            <a-button type="primary" @click="saveCanvas">保存</a-button>
            <a-button type="primary" @click="clearCanvas">清除</a-button>
            <a-button type="primary" @click="prevImage">上一张</a-button>
            <a-button type="primary" @click="nextImage">下一张</a-button> -->
        </a-space>
        <canvas ref="canvasDom" class="canvas">
        </canvas>
    </div>


</template>


<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import initThree from "@/utils/three/initThree.js";
    // three
    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
    import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    import { clearScene, disposeChild } from "@/utils/three/clearScene.js";

    import { Pathfinding, PathfindingHelper } from 'three-pathfinding';

    let canvasDom = ref(null);

    let baseThree, controls;

    let group = ref(null);
    // 创建一个组并添加多个立方体
    group.value = new THREE.Group();

    let objMesh;
    // 加载点云模型
    // let model = ref('/models/pcd/test.pcd')
    let model = ref('/models/pcd/pcl_logo.pcd')
    // let model = ref('/models/WoodTower/Wood_Tower.glb')
    // 加载点云
    function loadModel(model, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ, positionX, positionY, positionZ) {
        const loader = new PCDLoader();
        // const loader = new GLTFLoader();
        loader.load(model, function (obj) {
            obj.geometry.center();

            obj.name = 'pcd';
            obj.scale.set(scaleX, scaleY, scaleZ);
            obj.rotation.set(rotationX, rotationY, rotationZ);
            obj.position.set(positionX, positionY, positionZ);

            group.value.add(obj);
            baseThree.scene.add(obj);
            baseThree.scene.add(group.value);


        });
    }

    let playerPosition = new THREE.Vector3(10, 10, 10);
    let targetPosition = new THREE.Vector3(5, 8, 7);
    const pathfinding = new Pathfinding();
    const helper = new PathfindingHelper();

    function loadGltfModel(model, scaleX, scaleY, scaleZ, rotationX, rotationY, rotationZ, positionX, positionY, positionZ) {
        const loader = new GLTFLoader();
        loader.load(model, function (obj) {

            obj.scene.traverse((node) => {
                if (node.isMesh) {
                    objMesh = node
                    console.log(`output->@@@666objMesh`, objMesh)
                    // Create level.
                    const ZONE = 'level1';
                    pathfinding.setZoneData(ZONE, Pathfinding.createZone(objMesh.geometry));

                    // Find path from A to B.
                    const groupID = pathfinding.getGroup(ZONE, playerPosition);
                    const path = pathfinding.findPath(playerPosition, targetPosition, ZONE, groupID);

                };

            });


            obj.scene.name = 'pcd';
            obj.scene.scale.set(scaleX, scaleY, scaleZ);
            obj.scene.rotation.set(rotationX, rotationY, rotationZ);
            obj.scene.position.set(positionX, positionY, positionZ);

            group.value.add(obj.scene);
            baseThree.scene.add(obj.scene);
            baseThree.scene.add(group.value);


        });
    }





    onMounted(() => {
        console.log(`output->canvasDom.value`, canvasDom.value)
        baseThree = new initThree(canvasDom.value);
        baseThree.camera.position.set(10, 10, 10);
        baseThree.initAxesHelper();
        baseThree.addAmbientLight()
        baseThree.addDirLight()

        baseThree.scene.add(helper);
        loadModel(model.value, 1, 1, 1, -Math.PI / 2, 0, 0, 1, 1, 1);
        // loadGltfModel(model.value, 1, 1, 1, 0, 0, 0, 1, 1, 1);




        controls = new OrbitControls(baseThree.camera, baseThree.renderer.domElement);
        controls.enableDamping = true//开启阻尼,让动画更平滑
        animate();



        window.addEventListener("resize", resize);

    });

    let i = 0
    function animate() {
        i++
        requestAnimationFrame(animate);
        // console.log(`output->i@@@`, i)
        baseThree.update();
        controls.update();
    }


    function resize() {
        console.log(`output->窗口变化`, canvasDom.value.offsetWidth)
        // let canvasDom = ref(null);
        baseThree.resize(canvasDom.value)
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

    .canvas {
        width: 100%;
        height: 100%;
        border: 5px solid #000;
    }

</style>
