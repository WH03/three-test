<template>
    <div class="canvasbox">
        <div class="canvasDom" id="canvasDom"></div>
        <a-space>
            <a-button type="primary" @click="curveMove">轨迹动画</a-button>
            <a-button type="primary" @click="startMove = !startMove">结束动画</a-button>
            <!-- <a-button type="primary" danger @click="clearObjects">清除</a-button> -->
        </a-space>
    </div>

</template>

<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import baseScene from "@/utils/three/BaseScene.js";
    import { LoadModel } from '@/utils/three/LoadModel.js'
    // three
    import * as THREE from "three";

    let baseThree;
    // 加载模型
    let pcdModel = ref('/models/pcd/default/GlobalMap.pcd')
    let gltfModel = ref('/models/robot.glb')

    let clock = new THREE.Clock();

    let pointList = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(3, 4, 2),
        new THREE.Vector3(3, 4, -2),
        new THREE.Vector3(5, 2, -2),
    ];

    let startMove = false
    const curveMove = () => {
        startMove = true
        // baseThree.addCurveLine(pointList);
        modelLoader.addCurveLine(pointList)
        let newPos = { x: -2.4837260836273516, y: 2.821124069329464, z: -4.7607499148596535 }
        baseThree.flyTo(newPos)

        // 加载 gltf 模型
        // modelLoader.loadGLTFModel(gltfModel.value, (model) => {
        //     model.scene.scale.set(3, 3, 3)
        //     model.scene.rotation.set(0, Math.PI, 0)
        //     model.scene.position.set(pointList[0].x, pointList[0].y, pointList[0].z)   // 模型位置
        //     modelLoader.startAnimation(model, 3)

        // })
    }

    let modelLoader = null

    let cubeImg = ref([
        'img/Park3Med/px.jpg',
        'img/Park3Med/nx.jpg',
        'img/Park3Med/py.jpg',
        'img/Park3Med/ny.jpg',
        'img/Park3Med/pz.jpg',
        'img/Park3Med/nz.jpg',
    ])
    let clickPoints = []
    onMounted(async () => {
        baseThree = await new baseScene('#canvasDom');
        modelLoader = new LoadModel(baseThree)
        baseThree.loadEnvMap(cubeImg.value)
        // // 加载 gltf 模型
        // modelLoader.loadGLTFModel(gltfModel.value, (model) => {
        //     model.scene.scale.set(3, 3, 3)
        //     model.scene.rotation.set(0, Math.PI, 0)
        //     model.scene.position.set(pointList[0].x, pointList[0].y, pointList[0].z)   // 模型位置
        //     // baseThree.scene.add(model.scene);
        //     // modelLoader.startAnimation(model, 3)
        // })

        // 加载 PCD 模型
        modelLoader.loadPCDModel(pcdModel.value, (model) => {
            model.geometry.center();
            model.rotation.set(Math.PI / 2, Math.PI, 0)
            model.position.set(0, 0, 0);
        })

        baseThree.initRaycaster('click', (intersect) => {
            console.log(`output->intersect`, intersect)
            // modelLoader.loadSphere(intersect.point, true);//添加圆点
            // clickPoints.push(intersect.point)//保存原点
            // modelLoader.loadLine(clickPoints)//画线
            baseThree.changeSelect(intersect)
        });

        baseThree.initAxesHelper()
        baseThree.addStats()




        // 动画效果
        baseThree.sceneAnimation(() => {
            const delta = clock.getDelta()

            // baseThree.update();
            // baseThree.controls.update()

            // baseThree.renderer.render(baseThree.scene, baseThree.camera)

            if (baseThree.mixer) {
                baseThree.mixer.update(delta);
            }

            if (startMove) {
                modelLoader.modelMove()
            }
        })

    });




    // 销毁
    onUnmounted(() => {
        if (baseThree) {
            // clearScene(baseThree.scene.children, baseThree.scene);  // 清除场景中的所有对象
            baseThree.clearScene(baseThree.scene);
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
