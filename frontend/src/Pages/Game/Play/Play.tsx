import { Canvas } from "@react-three/fiber";
import "./Play.css";
import winner from "../../../assets/winner.png"
import vs from "../../Home/images/Group.svg"
import pic from "../../Home/images/profile.svg"
import "../../Home/styles/LastGame.css"

import { OrbitControls, useGLTF } from "@react-three/drei";
import {
  Debug,
  Physics,
  useBox,
  useContactMaterial,
  useSphere,
} from "@react-three/cannon";
import { Material } from 'cannon-es';
import { createContext, useContext, useEffect, useState } from "react";
import { AxesHelper, DoubleSide, Fog, MathUtils } from "three";
import { Link } from "react-router-dom";

const tableUrl = new URL("../../../assets/glb/tableLwa3ra.glb", import.meta.url).href;
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
  const [canScore, setCanScore] = useState(true);

  var randomX = (Math.random() * 2 - 1) * 3
  
  const [ref, api] = useSphere(() => ({
    mass: 0.1,
    position: [0, 0.2, 0],
    args: [0.12],
    velocity: [randomX, 0, 5],
    ccdIterations: 20,
    ccdSpeedThreshold: 1e-4,
    material:material,
    onCollide: (event) => {
      const {body} = event
      if (body.name === "goal_wall" && canScore)
        setCanScore(false)
    },
  }));
  

  useEffect(() => {
    const reposition = api.position.subscribe(([x, y, z]) => {
      if (!canScore)
      {
        
        const randomX = (Math.random() * 2 - 1) * 3
        api.position.set(0, 0.2, 0)
        api.velocity.set(0, 0, 0)
        setTimeout(() => api.velocity.set(randomX, 0, z < 0 ?-7 :7), 500);
        if (res) {
          const {result, setResult} = res
          setResult((z > 0) ? [result[0], result[1]+1]: [result[0]+1, result[1]]) 
        }
        setCanScore(true)
      }
    })

    return () => {
      reposition()
    }
  }, [api, res, canScore, setCanScore])

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
    args: [6.1469, 0.0364*2, 8.65640],
    material: material
  }));

  return (
    <>
      <primitive
        scale={[1,1,1]}
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
    args: [1.5, 0.5, 0.5],
    material: material
  }));
  const speed = 2.5
  const [direction, setDirection] = useState<[number, number, number]>([0, 0, 0]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      api.position.subscribe(([x, y, z]) =>{
        if (mine){
          if  ((event.key == "ArrowRight" && x < (3.07345 - 0.5)) || (event.key == "ArrowUp" && x < (3.07345 - 0.5)))
            setDirection([speed, 0, 0])
          if  ((event.key == "ArrowLeft" && x > -(3.07345 - 0.5)) || (event.key == "ArrowDown" && x > -(3.07345 - 0.5)))
            setDirection([-speed, 0,0])
        }
        if (!mine) {
            if ((event.key == "D" || event.key == "d" || event.key == "W" || event.key == "w")  && x < (3.07345 - 0.5))
              setDirection([speed, 0, 0])
            if  ((event.key == "A" || event.key == "a" || event.key == "S" || event.key == "s") && x > -(3.07345 - 0.5))
              setDirection([-speed, 0, 0])
            
        }
      })
    }

    const onKeyUp = (event: KeyboardEvent) => {
      api.velocity.subscribe(() => {
        const {key} = event
        console.log(key);
        
        if (mine && (key == "ArrowRight" || key == "ArrowLeft" || key == "ArrowUp" || key == "ArrowDown"))
          setDirection([0, 0, 0])
        if (!mine && (key == "A" || key == "a" || key == "d" || key == "D" || key == "S" || key == "s" || key == "W" || key == "w"))
          setDirection([0, 0, 0])
      })
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [mine, direction])


  useEffect(() => {
    api.velocity.set(...direction);
  }, [direction, api, mine]);

  return (
    <mesh ref={ref} position={position}  name="paddle">
      <boxGeometry args={[1.5, 0.5, 0.5]} />
      <meshStandardMaterial />
    </mesh>
  )
}

interface SideWallProps {
  position: any
}
function SideWall({position} : SideWallProps) {
  const material = new Material("side_mat");
  const [ref, api] = useBox(() => ({
    position: position,
    args: [0.5, 0.8, 8.65640],
    material: material
  }));

  return (
    <mesh ref={ref} position={position}  name="side_wall" visible={false}>
      <boxGeometry args={[0.5, 0.8, 8.65640]} />
      <meshStandardMaterial/>
    </mesh>
  )
}

interface GoalWallProps {
  position: any
}

function GoalWall({position} : GoalWallProps) {
  const material = new Material("goal_mat");
  const [ref, api] = useBox(() => ({
    position: position,
    args: [6.1469, 0.8, 0.5],
    material: material
  }));

  return (
    <mesh ref={ref} position={position}  name="goal_wall">
      <boxGeometry args={[6.1469, 0.5, 0.5]} />
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
  useContactMaterial("goal_mat", "ball_mat", {
    friction:0,
    restitution: 1,
  });

  return (
    <>
      <Ball />
      <Table />
      <Paddle position={[0, 0.09, +(8.65640 -1)/ 2]} mine/>
      <Paddle position={[0, 0.09, -(8.65640 -1)/ 2]}/>
      <primitive object={new AxesHelper(5)} />
      <SideWall position={[(6.1469 + 0.5)/2, 0, 0]}/>
      <SideWall position={[-(6.1469 + 0.5)/2, 0, 0]}/>
      <GoalWall position={[0, 0, (8.65640+ 0.5)/2]}/>
      <GoalWall position={[0, 0, -(8.65640+ 0.4)/2]}/>
    </>
  );
}


const Play = () => {
  const [result, setResult] = useState<[number, number]>([0, 0]) 
  return (
    <resultsContext.Provider value={{result, setResult}}>
      <div className="PlayScreen">
        <Canvas camera={{ position: [0, 2, 5] }}  onCreated={({ scene }) => { scene.fog = new Fog(0x000000, 1, 100); }}>
          <OrbitControls  maxPolarAngle={MathUtils.degToRad(100)}/>
          <directionalLight position={[-50, 9, 5]} intensity={1} />
          <directionalLight position={[-50, -9, -5]} intensity={1} />
          <pointLight position={[5, 9, -5]} intensity={1} />
          <directionalLight position={[3, 9, 5]} intensity={2} />
          <Physics iterations={40} gravity={[0, -9.81, 0]} step={1 / 120} isPaused={result[0] === 7 || result[1] === 7}>
            {/* <Debug> */}
              <mesh rotation={[Math.PI/2, 0, 0]} position={[0, -5,0]}>
                <planeGeometry args={[300, 300]}/>
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
                <span>Player 1</span>
            </div>
            <div>
            <div className='Home-Row2'>
              <span className='Home-score1'>{result[0]}</span>
              <img src={vs} alt="" />
              <span className='Home-score2'>{result[1]}</span>
            </div>
            </div>
            <div className='Home-Row3'>
                <span>Player 2</span>
                <img src={pic} alt="" />
            </div>
          </div>
        </div>
        {
           result[0] === 7 || result[1] === 7 
          ?
          <div className="winnerPopUp">
            <h2>The Winner</h2>
            <img src={winner} alt="" className="winnerPic"/>
            <img src={pic} alt="" />
            <h3>{result[0] === 7 ? "Player 1" : "Player 2"}</h3>
            <div className="winnerBtns">
              <Link to={"/"}><i className="fa-solid fa-house"></i></Link>
              <Link to={"../"}><i className="fa-solid fa-arrow-left"></i></Link>
            </div>
          </div>
          :
          <></>
        }
      </div>
    </resultsContext.Provider>
  );
};

export default Play;
