import * as THREE from 'three'
// 导入相机
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// GLTF加载器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// 环境贴图加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

let mixer;
let donuts;

// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10);
// 创建WebGL渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 将webgl渲染的canvas内容添加到body中
document.body.appendChild(renderer.domElement);

camera.position.set(0.3, 0.3, 0.5);
const controls = new OrbitControls(camera, renderer.domElement);
// 创建环境光
const directionLight = new THREE.DirectionalLight(0xffffff, 0.4);
// 讲环境光添加到场景
scene.add(directionLight);

new GLTFLoader().load('./resources/models/donuts.glb', (gltf) => {

  console.log(gltf);
  scene.add(gltf.scene);
  donuts = gltf.scene;

  // gltf.scene.traverse((child)=>{
  //     console.log(child.name);
  // })

  mixer = new THREE.AnimationMixer(gltf.scene);
  const clips = gltf.animations; // 播放所有动画
  clips.forEach(function (clip) {
      const action = mixer.clipAction(clip);
      action.loop = THREE.LoopOnce;
      // 停在最后一帧
      action.clampWhenFinished = true;
      action.play();
  });

})

// 加载HDR贴图
new RGBELoader()
    .load('./resources/sky.hdr', function (texture) {
        scene.background = texture;
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.render(scene, camera);
});

// 播放动画
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);

  controls.update();

  if (donuts){
      donuts.rotation.y += 0.01;
  }

  if (mixer) {
      mixer.update(0.02);
  }
}

animate();