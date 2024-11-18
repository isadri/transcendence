import { Canvas, Vector3 } from "@react-three/fiber";
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
import { useEffect } from "react";
import { AxesHelper } from "three";

const tableUrl = new URL("../images/pongTable.glb", import.meta.url).href;
useGLTF.preload(tableUrl);

function Ball() {
  const material = new Material();
  material.name = "ball_mat"
  const [ref, api] = useSphere(() => ({
    mass: 0.1,
    position: [0, 0.2, 0],
    args: [0.06],
    material:material
  }));
  

  api.velocity.set(0, 0, 9);
  useEffect(() => {
    const reposition = api.position.subscribe(([x, y, z]) => {
      if (y < -3)
      {
        api.position.set(0, 0.2, 0);
        api.velocity.set(0, 0, 9);
      }

    })
  }, [api])

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.06, 30, 30]} />
      <meshStandardMaterial />
    </mesh>
  );
}

function Table() {
  const material = new Material();
  material.name = "table_mat"
  const table = useGLTF(tableUrl);
  const [ref, api] = useBox(() => ({
    position: [0, 0, 0],
    type: "Static",
    args: [1.9038, 0.0364, 3.629],
    material: material
  }));


  return (
    <>
      <primitive
        ref={ref}
        object={table.scene}
        position={[0, 0, 0]}
      />
    </>
  );
}


interface RacketProps {
  position: any, // can be  Vector3 or Triplet,
  mine?:boolean
}
function Racket({position, mine=false}: RacketProps){
  const material = new Material();
  material.name = "racket_mat"
  const [ref, api] = useBox(() => ({
    mass: 10,
    type:"Static",
    position: position,
    args: [0.5, 0.15, 0.2],
    material: material
  }));

  const onKeyDown = (event: KeyboardEvent) => {
    if (mine){
      api.position.subscribe(([x, y, z]) =>{
        if  (event.key == "ArrowRight")
          api.position.set(x + 0.02, y, z)
        if  (event.key == "ArrowLeft")
          api.position.set(x - 0.02, y, z)
      })
    }
  }

  const onKeyUp = (event: KeyboardEvent) => {
    api.position.subscribe(([x, y, z]) =>{
      api.position.set(x, y, z);
    })
  }
  useEffect(() => {
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [api, onKeyDown, onKeyUp, mine])

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.5, 0.15, 0.2]} />
      <meshStandardMaterial/>
    </mesh>
  )
}

function GameTable() {
  // contact  beetween the ball and the table 
  useContactMaterial("ball_mat", "table_mat", {
    friction:0,
    restitution: 0,
  });
  // contact  beetween the racket and the table 
  useContactMaterial("racket_mat", "table_mat", {
    friction:0.9,
    restitution: 0,
  });
  useContactMaterial("racket_mat", "ball_mat", {
    friction:0,
    restitution: 1,
  });

  return (
    <>
      <Ball />
      <Table />
      <Racket position={[0, 0.09, +1.6]} mine/>
      <Racket position={[0, 0.09, -1.6]}/>
      <primitive object={new AxesHelper(5)} />

    </>
  );
}

const Play = () => {
  return (
    <Canvas camera={{ position: [0, 2, 5] }}>
      <OrbitControls />
      <perspectiveCamera />
      <directionalLight position={[-50, 9, 5]} intensity={1} />
      <directionalLight position={[-50, 9, -5]} intensity={1} />
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
