import { Canvas } from "@react-three/fiber";
import "./Play.css";
import { OrbitControls, useGLTF } from "@react-three/drei";
import {
  Debug,
  Physics,
  useBox,
  useContactMaterial,
  useSphere,
} from "@react-three/cannon";
import { Material } from 'cannon-es';

const tableUrl = new URL("../images/pongTable.glb", import.meta.url).href;
useGLTF.preload(tableUrl);

function Ball() {
  const ballMaterial = new Material();
  ballMaterial.name = "ball_mat"
  const [ball_ref, ball_api] = useSphere(() => ({
    mass: 0.1,
    position: [0, 2, 0],
    args: [0.07],
    material:ballMaterial
    // material: {
    //   restitution: 0.9, // Makes the ball bouncy
    // },
  }));

  return (
    <mesh ref={ball_ref}>
      <sphereGeometry args={[0.07, 30, 30]} />
      <meshStandardMaterial />
    </mesh>
  );
}

function Table() {
  const tableMaterial = new Material();
  tableMaterial.name = "table_mat"
  const table = useGLTF(tableUrl);
  const [table_ref, table_api] = useBox(() => ({
    position: [0, 0, 0],
    type: "Static",
    args: [1.9038, 0.0364, 3.629],
    material: tableMaterial
  }));

  return (
    <>
      {/*
      <mesh ref={table_ref} position={[0, -0.0351, 0]}>
        <boxGeometry args={[1.9038, 0.07, 3.629]} />
      </mesh>
      */}

      <primitive
        ref={table_ref}
        object={table.scene}
        position={[0, 0, 0]}
      />
    </>
  );
}

function GameTable() {

  // contact  beetween the ball and the table 
  useContactMaterial("ball_mat", "table_mat", {
    restitution: 0.8,
  });

  return (
    <>
      <Ball />
      <Table />
    </>
  );
}

const Play = () => {
  return (
    <Canvas camera={{ position: [0, 2, 5] }}>
      <OrbitControls />
      <perspectiveCamera />
      <directionalLight position={[-33, 9, 5]} intensity={2} />
      <directionalLight position={[3, 9, 5]} intensity={2} />
      <Physics gravity={[0, -9.81, 0]}>
        <Debug>
          <GameTable />
        </Debug>
      </Physics>
    </Canvas>
  );
};

export default Play;
