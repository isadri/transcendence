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
  const material = new Material("ball_mat");
  // material.name = "ball_mat"
  const [ref, api] = useSphere(() => ({
    mass: 0.1,
    position: [0, 0.2, 0],
    args: [0.12],
    velocity: [0, 0, 10],
    ccdIterations: 20,
    ccdSpeedThreshold: 1e-4,
    material:material,
    angularVelocity:[0, 0, 0],
    onCollide: (event) => {
      const {body, contact} = event
      const { velocity } = body
      if (body.name == "paddle"){
        const spinFactor = 2;
        // api.angularVelocity.set(
        //   velocity[2] * spinFactor,
        //   0,
        //   -velocity[0] * spinFactor
        // )
      }
    },
  }));
  

  useEffect(() => {
    const reposition = api.position.subscribe(([x, y, z]) => {
      if (y < -3)
      {
        api.position.set(0, 0.2, 0)
        api.velocity.set(0, 0, 10)
      }
    })

    const interval = setInterval(() => {
      api.velocity.subscribe(([vx, vy, vz]) => {
        const maxSpeed = 10;
        api.velocity.set( // later
          Math.max(-maxSpeed, Math.min(maxSpeed, vx)),
          Math.max(-maxSpeed, Math.min(maxSpeed, vy)),
          Math.max(-maxSpeed, Math.min(maxSpeed, vz))
        );
      });
    }, 50); // Update every 50ms

    return () => {
      reposition()
      clearInterval(interval)
    }
  }, [api])

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.12, 30, 30]} />
      <meshStandardMaterial />
    </mesh>
  );
}

function Table() {
  const material = new Material("table_mat");
  const table = useGLTF(tableUrl);
  const [ref, api] = useBox(() => ({
    position: [0, 0, 0],
    type: "Static",
    args: [1.9038*2, 0.0364*2, 3.629*2],
    material: material
  }));


  return (
    <>
      <primitive
        scale={[2,2,2]}
        ref={ref}
        object={table.scene}
        position={[0, 0, 0]}
      />
    </>
  );
}


interface Paddlerops {
  position: any, // can be  Vector3 or Triplet,
  mine?:boolean
}

function Paddle({position, mine=false}: Paddlerops){
  const material = new Material();
  material.name = "paddle_mat"
  const [ref, api] = useBox(() => ({
    type: "Kinematic",
    position: position,
    args: [1, 0.25, 0.4],
    material: material
  }));

  const onKeyDown = (event: KeyboardEvent) => {
    api.position.subscribe(([x, y, z]) =>{
      if (mine){
        if  (event.key == "ArrowRight" )
          api.position.set(x + 0.04, y, z)
        else if  (event.key == "ArrowLeft")
          api.position.set(x - 0.04, y, z)
        // else if  (event.key == "keyA")
          //   api.position.set(x, y, z - 0.04)
        // else if  (event.key == "ArrowDown")
        //   api.position.set(x, y, z + 0.04)
      }
      else {
          if  (event.key == "A" || event.key == "a")
            api.position.set(x + 0.04, y, z)
          else if  (event.key == "D" || event.key == "d")
            api.position.set(x - 0.04, y, z)
          
      }
    })
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
    <mesh ref={ref} position={position}  name="paddle">
      <boxGeometry args={[1, 0.25, 0.4]} />
      <meshStandardMaterial/>
    </mesh>
  )
}

interface SideWallProps {
  position: any
}
function SideWall({position} : SideWallProps) {
  const material = new Material();
  material.name = "side_mat"
  const [ref, api] = useBox(() => ({
    position: position,
    args: [0.5, 0.8, 3.629*2],
    material: material
  }));

  return (
    <mesh position={position}  name="side_wall" visible={false}>
      <boxGeometry args={[0.5, 0.8, 3.629*2]} />
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
  useContactMaterial("paddle_mat", "table_mat", {
    friction:0.9,
    restitution: 0,
  });

  useContactMaterial("paddle_mat", "ball_mat", {
    friction:0,
    restitution: 1,
  });
  useContactMaterial("side_mat", "ball_mat", {
    friction:0,
    restitution: 1,
  });

  return (
    <>
      <Ball />
      <Table />
      <Paddle position={[0, 0.09, +3.2]} mine/>
      <Paddle position={[0, 0.09, -3.2]}/>
      <primitive object={new AxesHelper(5)} />
      <SideWall position={[2.15, 0, 0]}/>
      <SideWall position={[-2.15, 0, 0]}/>
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
      <Physics iterations={40} gravity={[0, -9.81, 0]} step={1 / 120}>
        <Debug>
          <GameTable />
        </Debug>
      </Physics>
    </Canvas>
  );
};

export default Play;
