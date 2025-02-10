<template>
    <div class="canvasBox">
        <div class="canvasDom" id="canvasDom"></div>
        <a-space>

        </a-space>
    </div>

</template>

<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import baseScene from "@/utils/three/BaseScene.js";
    import * as THREE from "three";
    let baseThree, geometry, material, cube;


    // 创建一个立方体
    const createCube = () => {
        // 创建裁剪平面
        const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1);

        geometry = new THREE.BoxGeometry(2, 2, 2);
        material = new THREE.MeshNormalMaterial({
            color: 0x80ee10,
            shininess: 100,
            side: THREE.DoubleSide,
            clippingPlanes: [clipPlane],//裁剪平面
            clipShadows: true,//裁剪阴影

            alphaToCoverage: true,//开启alphaToCoverage
        });
        cube = new THREE.Mesh(geometry, material);
        baseThree.scene.add(cube);

        baseThree.renderer.localClippingEnabled = true;//开启裁剪

    }




    onMounted(async () => {
        baseThree = await new baseScene('#canvasDom');
        console.log(`output->baseThree`, baseThree)
        baseThree.initAxesHelper()
        // baseThree.addStats()

        createCube()


        // 动画效果
        baseThree.sceneAnimation(() => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        })
    })

    // 销毁
    onUnmounted(() => {
        if (baseThree) {
            // 清除场景中的所有对象
            baseThree.clearScene(baseThree.scene);
            console.log(`output->baseThree`, baseThree)
            console.log('Scene cleared!');
        }
    })

</script>

<style scoped lang="scss">
    .canvasBox {
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
