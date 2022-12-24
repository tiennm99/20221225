main();

function main() {
  const scene = initScene();

  const radialSegments = 64;
  const heightSegments = 32;
  const rootRadius = 7;
  const rootHeight = 21;
  const numLeaf = 3;
  const leafRadius = 13;
  const leafRadiusIncrement = 2;
  const leafHeight = 20;
  const leafHeightIncrement = 3;
  const leafOffset = -7;

  const rootGeometry = new THREE.CylinderGeometry(
    rootRadius,
    rootRadius,
    rootHeight,
    radialSegments
  );
  const rootMaterial = new THREE.MeshBasicMaterial({ color: "#613B16" });
  const root = new THREE.Mesh(rootGeometry, rootMaterial);
  root.position.y = -rootHeight;
  scene.add(root);

  const leafMaterial = new THREE.MeshBasicMaterial({ color: "green" });
  for (let i = 0; i < numLeaf; i++) {
    const leafGeometry = new THREE.ConeGeometry(
      leafRadius + leafRadiusIncrement * (numLeaf - i),
      leafHeight + leafHeightIncrement * (numLeaf - i),
      radialSegments,
      heightSegments
    );
    const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf.position.y = (leafHeight + leafOffset) * i;
    scene.add(leaf);
  }

  //region star
  const numbVertices = 5;
  const starInnerRadius = 3;
  const starOuterRadius = 6;
  const innerStarVertices = [];
  const outerStarVertices = [];
  const angleOfAPart = (2 * Math.PI) / numbVertices;
  const innerOffset = -Math.PI / 2;
  const outerOffset = innerOffset + angleOfAPart / 2;
  for (let i = 0; i < numbVertices; i++) {
    const innerStarAngle = innerOffset + angleOfAPart * i;
    const outerStarAngle = outerOffset + angleOfAPart * i;
    innerStarVertices.push({
      x: starInnerRadius * Math.cos(innerStarAngle),
      y: starInnerRadius * Math.sin(innerStarAngle),
    });
    outerStarVertices.push({
      x: starOuterRadius * Math.cos(outerStarAngle),
      y: starOuterRadius * Math.sin(outerStarAngle),
    });
  }

  const points = [{ x: 0, y: 0 }];
  for (let i = 0; i < numbVertices; i++) {
    points.push(innerStarVertices[i]);
    points.push(outerStarVertices[i]);
  }
  points.push(innerStarVertices[0]);

  const starShape = new THREE.Shape();
  starShape.setFromPoints(points);

  const geometry = new THREE.ShapeGeometry(starShape);
  const material = new THREE.MeshBasicMaterial({ color: "yellow" });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  mesh.position.y = 41;
  //endregion
}

function initScene() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 100;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });

  const canvas = renderer.domElement;
  document.body.appendChild(canvas);

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.update();

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onWindowResize);

  return scene;
}
