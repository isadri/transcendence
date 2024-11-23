import { Canvas, Vector3 } from "@react-three/fiber";
import "./Play.css";
import vs from "../../Home/images/Group.svg"
import pic from "../../Home/images/profile.svg"
import "../../Home/styles/LastGame.css"

import { Box, OrbitControls, Text, useGLTF } from "@react-three/drei";
import {
  Debug,
  Physics,
  useBox,
  useContactMaterial,
  useSphere,
} from "@react-three/cannon";
import { Material } from 'cannon-es';
import { createContext, useContext, useEffect, useState } from "react";
import { AxesHelper, DoubleSide, Fog, MathUtils, PlaneGeometry } from "three";

const tableUrl = new URL("../images/pongTable.glb", import.meta.url).href;
useGLTF.preload(tableUrl);

// the context of the game result
interface ResultContext {
  result: [number, number];
  setResult: React.Dispatch<React.SetStateAction<[number, number]>>;
}
const resultsContext = createContext<ResultContext | null>(null)


function Ball() {
  const res = useContext(resultsContext);
  const material = new Material("ball_mat");

  const randomX = (Math.random() * 2 - 1) * (1.9038*2)
  
  const [ref, api] = useSphere(() => ({
    mass: 0.1,
    position: [0, 0.2, 0],
    args: [0.12],
    velocity: [randomX, 0, 7],
    ccdIterations: 20,
    ccdSpeedThreshold: 1e-4,
    material:material,
    // angularVelocity:[, 0, 0],
    // onCollide: (event) => {
    //   const {body, contact} = event
    //   if (body.name == "paddle")
    //     api.velocity.subscribe(([x, y, z]) => {if (!x) api.velocity.set(contact.rj[0] * 5 , y, z)})
    // },
  }));
  

  useEffect(() => {
    const reposition = api.position.subscribe(([x, y, z]) => {
      if (y < -3)
      {
        const randomX = (Math.random() * 2 - 1) * (1.9038*2)
        api.position.set(0, 0.2, 0)
        api.velocity.set(randomX, 0, 7)
        if (res){
          console.log("result flwl",res)
          const {result, setResult} = res
        if (z > 0)
          setResult([result[0], result[1]+1])
        else
          setResult([result[0]+1, result[1]])
        }
        // console.log(result)
      }
    })

    return () => {
      reposition()
    }
  }, [api, res])

  return (
    <>
      <mesh ref={ref} name="ball">
        <sphereGeometry args={[0.12, 30, 30]} />
        <meshStandardMaterial />
      </mesh>
    </>
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
        if  (event.key == "ArrowRight" && x < 1.4)
          api.position.set(x + 0.09, y, z)
         if  (event.key == "ArrowLeft" && x > -1.4)
          api.position.set(x - 0.09, y, z)
      }
      if (!mine) {
          if ((event.key == "D" || event.key == "d")  && x < 1.4)
            api.position.set(x + 0.09, y, z)
           if  ((event.key == "A" || event.key == "a") && x > -1.4)
            api.position.set(x - 0.09, y, z)
          
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
      // window.removeEventListener("keydown", onKeyDown);
      // window.removeEventListener("keyup", onKeyUp);
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
  const [result, setResult] = useState<[number, number]>([0, 0])
  return (
    <resultsContext.Provider value={{result, setResult}}>
      <div className="PlayScreen">
        <Canvas camera={{ position: [0, 2, 5] }}  onCreated={({ scene }) => { scene.fog = new Fog(0x000000, 1, 40); }}>
          <OrbitControls  maxPolarAngle={MathUtils.degToRad(100)}/>
          {/* <perspectiveCamera /> */}
          <directionalLight position={[-50, 9, 5]} intensity={1} />
          <directionalLight position={[-50, -9, -5]} intensity={1} />
          <pointLight position={[5, 9, -5]} intensity={1} />
          <directionalLight position={[3, 9, 5]} intensity={2} />
          <Physics iterations={40} gravity={[0, -9.81, 0]} step={1 / 120}>
            {/* <Debug> */}
              <mesh rotation={[Math.PI/2, 0, 0]} position={[0, -2.1,0]}>
                <planeGeometry args={[100, 100]}/>
                <meshStandardMaterial side={DoubleSide} color={"#c1596c"}/>
              </mesh>
              <GameTable />
            {/* </Debug> */}
          </Physics>
        </Canvas>
        <div className="Home-LastGame PlayResult">
          <div className='Home-RowEle'>
            <div className='Home-Row1'>
                <img src={pic} alt="" />
                <span>user1kkkkkkkkkk</span>
            </div>
            <div>
            <div className='Home-Row2'>
              <span className='Home-score1'>{result[0]}</span>
              <img src={vs} alt="" />
              <span className='Home-score2'>{result[1]}</span>
            </div>
            </div>
            <div className='Home-Row3'>
                <span>user2hhhhhhhhhh</span>
                <img src={pic} alt="" />
            </div>
          </div>
        </div>
      </div>
    </resultsContext.Provider>
  );
};

export default Play;
