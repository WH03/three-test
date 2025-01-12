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
import {initThree} from "@/utils/three/initThree.js";
// three
import * as THREE from "three";
import { clearScene, disposeChild } from "@/utils/three/clearScene.js";



let baseThree;
// 加载点云模型
let pcdModel = ref('/models/pcd/default/GlobalMap.pcd')
let gltfModel = ref('/models/gltf/Soldier.glb')



const curveMove = () => {
    if (curve == null || model == null) {
        console.log("Loading")
    } else {
        if (progress <= 1 - velocity) {
            const point = curve.getPointAt(progress); //获取样条曲线指定点坐标
            const pointBox = curve.getPointAt(progress + velocity); //获取样条曲线指定点坐标

            if (point && pointBox) {
                model.position.set(point.x, point.y, point.z);
                // model.lookAt(pointBox.x, pointBox.y, pointBox.z);//因为这个模型加载进来默认面部是正对Z轴负方向的，所以直接lookAt会导致出现倒着跑的现象，这里用重新设置朝向的方法来解决。

                var targetPos = pointBox   //目标位置点
                var offsetAngle = 0 //目标移动时的朝向偏移

                // //以下代码在多段路径时可重复执行
                var mtx = new THREE.Matrix4()  //创建一个4维矩阵
                // .lookAt ( eye : Vector3, target : Vector3, up : Vector3 ) : this,构造一个旋转矩阵，从eye 指向 target，由向量 up 定向。
                mtx.lookAt(model.position, targetPos, model.up) //设置朝向
                mtx.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, offsetAngle, 0)))
                var toRot = new THREE.Quaternion().setFromRotationMatrix(mtx)  //计算出需要进行旋转的四元数值
                model.quaternion.slerp(toRot, 0.2)
            }

            progress += velocity;
        } else {
            progress = 0;
        }


    }
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
    baseThree.initRaycaster('click', baseThree.scene.children);

    baseThree.loadGLTFModel(gltfModel.value,
        { x: 1, y: 1, z: 1 },  // scale
        { x: 0, y: 0, z: 0 },  // rotation
        { x: 0, y: 0, z: 0 }   // position
    );

    console.log(baseThree)


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
