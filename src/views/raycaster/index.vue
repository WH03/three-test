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
        <!-- <a-space>
            <a-button type="primary" danger @click="clearObjects">清除</a-button>
        </a-space> -->
    </div>




</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from "three";
import BaseScene from "@/utils/three/BaseScene.js";
import { LoadModel } from '@/utils/three/LoadModel.js'



let baseThree;
let modelLoader = null
let gltfModel1 = ref('/models/DJ.glb')
let gltfModel3 = ref('/models/gltf/shiji-v4.glb')
let gltfModel4 = ref('models/20240222/body.gltf')
// let gltfModel5 = ref('models/testModel.glb')
// let gltfModel5 = ref('models/无标题.glb')
let gltfModel5 = ref('models/雕刻单元-压缩.glb')
let clock = new THREE.Clock();


onMounted(() => {
    baseThree = new BaseScene('#canvasDom');
    modelLoader = new LoadModel(baseThree);
    // 加载 gltf 模型
    modelLoader.loadGLTFModel(gltfModel5.value, (model) => {
        // model.scene.scale.set(3, 3, 3)
        // model.scene.rotation.set(0, Math.PI, 0)
        // baseThree.scene.add(model.scene);
        // modelLoader.startAnimation(model, 3)
    })

    // baseThree.initRaycaster('mousemove', (intersect) => {
    //     console.log(`output->intersect`, intersect)
    //     // modelLoader.loadSphere(intersect.point, true);//添加圆点
    //     // clickPoints.push(intersect.point)//保存原点
    //     // modelLoader.loadLine(clickPoints)//画线
    //     baseThree.changeSelect(intersect, '0xff0000')
    // });



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

    })


});

// 销毁
onUnmounted(() => {
    // if (baseThree) {
    //     baseThree.clearScene(baseThree.scene.children);
    // }
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
