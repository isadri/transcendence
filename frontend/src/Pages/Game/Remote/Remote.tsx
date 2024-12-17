import { Canvas, context } from "@react-three/fiber";
import "../Play/Play.css";
import winnerImg from "../../../assets/winner.png"
import vs from "../../Home/images/Group.svg"
import pic from "../../Home/images/profile.svg"
import "../../Home/styles/LastGame.css"

import { OrbitControls, useGLTF } from "@react-three/drei";
import {
  Api,
  Debug,
  Physics,
  useBox,
  useContactMaterial,
  useSphere,
} from "@react-three/cannon";
import { Material } from 'cannon-es';
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AxesHelper, DoubleSide, Fog, MathUtils, Object3D, Object3DEventMap, WebGLRenderer } from "three";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUser, getendpoint } from "../../../context/getContextData";
import { userDataType } from "../../../context/context";

const tableUrl = new URL("../../../assets/glb/tableLwa3ra.glb", import.meta.url).href;
useGLTF.preload(tableUrl);

// the context of the game result
interface ResultContext {
  error: string | null,
  user: userDataType,
  enemy: userDataType,
  result: [number, number],
  winner: userDataType | null,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setResult: React.Dispatch<React.SetStateAction<[number, number]>>,
  setEnemy: React.Dispatch<React.SetStateAction<userDataType>>,
  setWinner: React.Dispatch<React.SetStateAction<userDataType | null>>,
  socket: WebSocket,
  paddle1: any,
  paddle2: any,
  ball: any
}
const resultsContext = createContext<ResultContext | null>(null)

function Ball({ ball }: { ball: [number, number, number] }) {
  const [ref, api] = useSphere(() => ({
    mass: 0,
    position: [0, 0.2, 0],
    args: [0.12],
    ccdIterations: 10,
    ccdSpeedThreshold: 1e-2,
    material: new Material("ball_mat")
  }));

  useEffect(() => {
    if (api && api.position)
      api.position.set(ball[0], ball[1], ball[2])
  }, [ball, api])
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
    args: [6.1469, 0.0364 * 2, 8.65640],
    material: material
  }));

  return (
    <>
      <primitive
        scale={[1, 1, 1]}
        ref={ref}
        object={table.scene}
        position={[0, 0, 0]}
      />
    </>
  );
}


interface Paddlerops {
  position: any, // can be  Vector3 or Triplet,
  box: number
}

const move = (socket: WebSocket, username: string, direction: string) => {

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        event: "MOVE",
        username: username,
        direction: direction,
      })
    );
  }
}


function Paddle1({ position, box }: Paddlerops) { // my Paddle
  const context = useContext(resultsContext)

  const [ref, api] = useBox(() => ({
    type: "Kinematic",
    position: position,
    args: [1.5, 0.5, 0.5],
    material: new Material("paddle_mat")
  }));

  useEffect(() => {
    if (api && api.position)
      api.position.set(box, 0.09, +(8.65640 - 1) / 2)
  }, [box, api])
  useEffect(() => {
    if (context) {
      const { socket, user } = context
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key == "ArrowRight" || event.key == "ArrowUp")
          move(socket, user.username, "+")
        else if (event.key == "ArrowLeft" || event.key == "ArrowDown")
          move(socket, user.username, "-")
      }

      const onKeyUp = (event: KeyboardEvent) => {
        // if (unsubscribe) {
        //   unsubscribe();
        //   unsubscribe = null;
        // }
      }

      window.addEventListener("keydown", onKeyDown)
      window.addEventListener("keyup", onKeyUp)
      return (() => {
        window.removeEventListener("keydown", onKeyDown)
        window.removeEventListener("keyup", onKeyUp)
      }
      )
    }
  }, [context])

  return (
    <mesh ref={ref} position={position} name="paddle">
      <boxGeometry args={[1.5, 0.5, 0.5]} />
      <meshStandardMaterial />
    </mesh>
  )
}

function Paddle2({ position, box }: Paddlerops) {

  const [ref, api] = useBox(() => ({
    type: "Kinematic",
    position: position,
    args: [1.5, 0.5, 0.5],
    material: new Material("paddle_mat")
  }));

  useEffect(() => {
    if (api && api.position)
      api.position.set(box, 0.09, -(8.65640 - 1) / 2)
  }, [box, api])
  return (
    <mesh ref={ref} position={position} name="paddle">
      <boxGeometry args={[1.5, 0.5, 0.5]} />
      <meshStandardMaterial />
    </mesh>
  )
}


interface SideWallProps {
  position: any
}

function SideWall({ position }: SideWallProps) {
  const material = new Material("side_mat");
  const [ref, api] = useBox(() => ({
    position: position,
    args: [0.5, 0.8, 8.65640],
    material: material
  }));

  return (
    <mesh ref={ref} position={position} name="side_wall" visible={false}>
      <boxGeometry args={[0.5, 0.8, 8.65640]} />
      <meshStandardMaterial />
    </mesh>
  )
}

interface GoalWallProps {
  position: any
}

function GoalWall({ position }: GoalWallProps) {
  const material = new Material("goal_mat");
  const [ref, api] = useBox(() => ({
    position: position,
    args: [6.1469, 0.8, 0.5],
    material: material
  }));

  return (
    <mesh ref={ref} position={position} name="goal_wall">
      <boxGeometry args={[6.1469, 0.5, 0.5]} />
      <meshStandardMaterial />
    </mesh>
  )
}


function GameTable() {
  const [loading, setLoading] = useState(true)
  const context = useContext(resultsContext)
  // contact  beetween the ball and the table 
  useContactMaterial("ball_mat", "table_mat", {
    friction: 0,
    restitution: 0,
  });
  // contact  beetween the racket and the table 
  useContactMaterial("paddle_mat", "table_mat", {
    friction: 0.5,
    restitution: 0,
  });

  useContactMaterial("paddle_mat", "ball_mat", {
    friction: 0,
    restitution: 1,
  });
  useContactMaterial("side_mat", "ball_mat", {
    friction: 0,
    restitution: 1,
  });
  useContactMaterial("goal_mat", "ball_mat", {
    friction: 0,
    restitution: 1,
  });
  const [paddle1, setpaddle1] = useState<number>(0)
  const [paddle2, setpaddle2] = useState<number>(0)
  const [ball, setball] = useState<[number, number, number]>([0, 0.2, 0])

  if (context) {
    useEffect(() => {
      const { socket, setEnemy, enemy, user, setResult, setError, setWinner } = context
      socket.onmessage = (e) => {

        const data = JSON.parse(e.data)
        if (data.event == "ABORT") {
          console.log(data.message);

          setError(data.message)
        }
        if (data.event == "START") {
          console.log(data);
          setEnemy(data.enemy)
          setLoading(false)
        }
        if (data.event == "GAME_UPDATE") {
          if (data.ball) {
            let xyz: [number, number, number] = data.ball
            if (data[user.username] && data[user.username] == 'player2')
              xyz[2] *= -1 // to reverse the ball for one of them
            setball(xyz)
          }
          if (data[user.username]) {
            let x = data[data[user.username]]
            if (data[user.username] == 'player2')
              setpaddle1(-x)
            else
              setpaddle1(x)
          }
          if (data[enemy.username]) {
            let x = data[data[enemy.username]]
            if (data[enemy.username] == 'player1')
              setpaddle2(-x)
            else
              setpaddle2(x)
          }
          if (data[enemy.username] && data[user.username]) {
            let s1 = data[data[user.username] + '_score']
            let s2 = data[data[enemy.username] + '_score']
            setResult([s1, s2])
          }
        }
        if (data.event == 'WINNER') {
          if (data.winner == user.username)
            setWinner(user)
          else
            setWinner(enemy)
        }
      }
    }, [context])
    if (!loading)
      return (
        <>
          <Table />
          <Ball ball={ball} />
          <Paddle1 position={[0, 0.09, +(8.65640 - 1) / 2]} box={paddle1} />
          <Paddle2 position={[0, 0.09, -(8.65640 - 1) / 2]} box={paddle2} />
          <SideWall position={[(6.1469 + 0.5) / 2, 0, 0]} />
          <SideWall position={[-(6.1469 + 0.5) / 2, 0, 0]} />
          <GoalWall position={[0, 0, (8.65640 + 0.5) / 2]} />
          <GoalWall position={[0, 0, -(8.65640 + 0.4) / 2]} />
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
            <planeGeometry args={[300, 300]} />
            <meshStandardMaterial side={DoubleSide} color={"#c1596c"} />
          </mesh>
        </>
      );
    return <></>
  }
}


const Play = () => {
  const context = useContext(resultsContext)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  if (context) {
    const { result, user, enemy, error, winner, socket } = context

    useEffect(() => {
      let renderer: WebGLRenderer | null = null;

      const handleContextLost = (event: Event) => {
        event.preventDefault()
        if (socket.readyState === WebSocket.OPEN)
          socket.close()
      };

      if (canvasRef.current) {
        renderer = new WebGLRenderer({ canvas: canvasRef.current });
        const glCanvas = renderer.domElement;
        glCanvas.addEventListener("webglcontextlost", handleContextLost);
      }

      return () => {
        if (renderer) {
          const glCanvas = renderer.domElement;
          glCanvas.removeEventListener("webglcontextlost", handleContextLost);
        }
        if (socket.readyState === WebSocket.OPEN) {
          socket.close(1000, "Component unmounted");
        }
      };
    }, [socket]);

    return (
      <>
        <div className="PlayScreen">
          <Canvas frameloop="always" camera={{ position: [0, 5, 8] }} onCreated={({ scene }) => { scene.fog = new Fog(0x000000, 1, 100); }}>
            <OrbitControls maxPolarAngle={MathUtils.degToRad(100)} />
            <directionalLight position={[-50, 9, 5]} intensity={1} />
            <directionalLight position={[-50, -9, -5]} intensity={1} />
            <pointLight position={[5, 9, -5]} intensity={1} />
            <directionalLight position={[3, 9, 5]} intensity={2} />
            <Physics iterations={40} gravity={[0, -9.81, 0]} step={1 / 240} isPaused={false}>
              {/* <Debug> */}
              <GameTable />
              {/* </Debug> */}
            </Physics>
          </Canvas>
          <div className="Home-LastGame PlayResult">
            <div className='Home-RowEle'>
              <div className='Home-Row1'>
                <img src={getendpoint("http", user.avatar)} alt="" />
                <span>{user.username}</span>
              </div>
              <div>
                <div className='Home-Row2'>
                  <span className='Home-score1'>{result[0]}</span>
                  <img src={vs} alt="" />
                  <span className='Home-score2'>{result[1]}</span>
                </div>
              </div>
              <div className='Home-Row3'>
                <span>{enemy.username}</span>
                <img src={enemy.id !== -1 ? getendpoint("http", enemy.avatar) : pic} alt="" />
              </div>
            </div>
          </div>
          {
            error ?
              <div className="winnerPopUp">
                <h2>Abort</h2>
                <span>
                  {error}
                </span>
                <div className="winnerBtns">
                  <Link to={"/"}><i className="fa-solid fa-house"></i></Link>
                  <Link to={"../"}><i className="fa-solid fa-arrow-left"></i></Link>
                </div>
              </div>
              :
              <></>
          }
          {
            winner
              ?
              <div className="winnerPopUp">
                <h2>The Winner</h2>
                <img src={winnerImg} alt="" className="winnerPic" />
                <img src={getendpoint('http', winner.avatar)} className="winnerAvatar" />
                <h3>{winner.username}</h3>
                <div className="winnerBtns">
                  <Link to={"/"}><i className="fa-solid fa-house"></i></Link>
                  <Link to={"../"}><i className="fa-solid fa-arrow-left"></i></Link>
                </div>
              </div>
              :
              <></>
          }
        </div>
      </>
    );
  }
};

// interface ProviderData {
//   socket: WebSocket,
//   gameId
// }

const emptyUser = {
  id: -1,
  username: "Enemy",
  email: "",
  avatar: ""
}

const Provider = ({ socket }: { socket: WebSocket }) => {
  const user = getUser()
  const [error, setError] = useState<string | null>(null)
  const [enemy, setEnemy] = useState<userDataType>(emptyUser)
  const [winner, setWinner] = useState<userDataType | null>(null)
  const [result, setResult] = useState<[number, number]>([0, 0])

  return (
    <resultsContext.Provider value={{ result, setResult, user, socket, enemy, setEnemy, error, setError, winner, setWinner }}>
      <Play />
    </resultsContext.Provider>
  )
}



const Remote = () => {
  const { id } = useParams();
  const [gameId] = useState<number>(id && !isNaN(parseInt(id, 10)) ? parseInt(id, 10) : -1)
  const [socket] = useState<WebSocket>(new WebSocket(getendpoint('ws', `/ws/game/remote/${gameId}`)))
  socket.onclose = (e) => console.log('closed')
  return (<Provider socket={socket} />)
}

export default Remote;
