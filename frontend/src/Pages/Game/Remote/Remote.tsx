import { Canvas, context, useThree } from "@react-three/fiber";
import "../Play/Play.css";
import vs from "../../Home/images/Group.svg"
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
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { getUser, getendpoint } from "../../../context/getContextData";
import { FriendDataType, userDataType } from "../../../context/context";

const tableUrl = new URL("../../../assets/glb/tableLwa3ra.glb", import.meta.url).href;
useGLTF.preload(tableUrl);

// the context of the game result
interface ResultContext {
  ball: any,
  paddle1: any,
  paddle2: any,
  gameId:number,
  error: string | null,
  user: FriendDataType,
  enemy: FriendDataType,
  result: [number, number],
  winner: FriendDataType | null,
  socketRef: React.MutableRefObject<WebSocket | null>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setEnemy: React.Dispatch<React.SetStateAction<FriendDataType>>,
  setResult: React.Dispatch<React.SetStateAction<[number, number]>>,
  setWinner: React.Dispatch<React.SetStateAction<userDataType | FriendDataType | null>>,
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

interface PaddleBox {
  xyz: [number, number, number],
  right: string,
  left: string
}

interface Paddlerops {
  position: any, // can be  Vector3 or Triplet,
  box: PaddleBox
}

const move = (socket: WebSocket|null, username: string, direction: string) => {

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
      api.position.set(...box.xyz)
  }, [box, api])
  useEffect(() => {
    if (context) {
      const { socketRef, user } = context
      if (!socketRef) return
      const socket = socketRef.current
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key == "ArrowRight" || event.key == "ArrowUp")
          move(socket, user.username, box.right)
        else if (event.key == "ArrowLeft" || event.key == "ArrowDown")
          move(socket, user.username, box.left)
      }

      const onKeyUp = (event: KeyboardEvent) => {
        move(socket, user.username, '*')
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
      api.position.set(...box.xyz)
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
  const { camera } = useThree();
  const [paddle1, setpaddle1] = useState<PaddleBox>({
    xyz: [0, 0.09, +(8.65640 - 0.6) / 2],
    left: '-',
    right: '+'
  })
  const [paddle2, setpaddle2] = useState<PaddleBox>({
    xyz: [0, 0.09, -(8.65640 - 0.6) / 2],
    left: '+',
    right: '-'
  })
  const [ball, setball] = useState<[number, number, number]>([0, 0.2, 0])

  if (context) {
    const { socketRef, setEnemy, enemy, user, setResult, setError, setWinner, gameId } = context
    useEffect(() => {
      if (!socketRef || !socketRef.current)
        socketRef.current = new WebSocket(getendpoint('ws', `/ws/game/remote/${gameId}`))
      const socket = socketRef.current
      socket.onmessage = (e) => {

        const data = JSON.parse(e.data)
        if (data.event == "ABORT") {
          console.log(data.message);

          setError(data.message)
        }
        if (data.event == "START" && enemy.id == -1) {
          console.log(data);
          socket.send(
            JSON.stringify({
              event: "DONE",
            })
          );
          setEnemy(data.enemy)
          setLoading(false)
          if (data[user.username] && data[user.username] == 'player2') {
            camera.position.set(0, 5, -8)
            setpaddle1({
              xyz: [0, 0.09, -(8.65640 - 0.6) / 2],
              left: '+',
              right: '-'
            })
            setpaddle2({
              xyz: [0, 0.09, +(8.65640 - 0.6) / 2],
              left: '+',
              right: '-'
            })
          }
        }
        if (data.event == "GAME_UPDATE") {
          if (data.ball) {
            let xyz: [number, number, number] = data.ball
            // if (data[user.username] && data[user.username] == 'player2')
            // camera.position.set(0, 5, -8)
            // xyz[2] *= -1 // to reverse the ball for one of them
            setball(xyz)
          }
          if (data[user.username]) {
            let x = data[data[user.username]]
            const newData: PaddleBox = ({
              xyz: [x, 0.09, paddle1.xyz[2]],
              left: paddle1.left,
              right: paddle1.right
            })
            setpaddle1(newData)
          }
          if (data[enemy.username]) {
            let x = data[data[enemy.username]]
            const newData: PaddleBox = ({
              xyz: [x, 0.09, paddle2.xyz[2]],
              left: paddle2.left,
              right: paddle2.right
            })
            setpaddle2(newData)
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
          else//need tn9ah
            setWinner(enemy)
        }
      }
    }, [context])

    if (!loading)
      return (
        <>
          <Table />
          <Ball ball={ball} />
          <Paddle1 position={[0, 0.09, +(8.65640 - 0.6) / 2]} box={paddle1} />
          <Paddle2 position={[0, 0.09, -(8.65640 - 0.6) / 2]} box={paddle2} />
          <SideWall position={[(6.1469 + 0.1) / 2, 0, 0]} />
          <SideWall position={[-(6.1469 + 0.1) / 2, 0, 0]} />
          <GoalWall position={[0, 0, (8.65640 + 0.5) / 2]} />
          <GoalWall position={[0, 0, -(8.65640 + 0.4) / 2]} />
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
            <planeGeometry args={[300, 300]} />
            <meshStandardMaterial side={DoubleSide} color={"#c1596c"} />
          </mesh>

          {/* <primitive object={new AxesHelper(5)} /> */}
        </>
      );
    return <></>
  }
}


const Play = () => {
  const context = useContext(resultsContext)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  if (context) {
    const { result, user, enemy, error, winner, socketRef } = context

    useEffect(() => {
      let renderer: WebGLRenderer | null = null;
      const socket = socketRef.current
      const handleContextLost = (event: Event) => {
        event.preventDefault()
        if (socket && socket.readyState === WebSocket.OPEN)
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
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.close(1000, "Component unmounted");
        }
      };
    }, [socketRef]);

    return (
      <>
        <div className="PlayScreen">
          <Canvas ref={canvasRef} frameloop="always" camera={{ position: [0, 5, 8] }} onCreated={({ scene }) => { scene.fog = new Fog(0x000000, 1, 100); }}>
            <OrbitControls maxPolarAngle={MathUtils.degToRad(100)} />
            <directionalLight position={[-50, 9, 5]} intensity={1} />
            <directionalLight position={[-50, -9, -5]} intensity={1} />
            <pointLight position={[5, 9, -5]} intensity={1} />
            <directionalLight position={[3, 9, 5]} intensity={2} />
            <Physics iterations={40} gravity={[0, -9.81, 0]} stepSize={1 / 120} isPaused={false}>
              {/* <Debug> */}
              <GameTable />
              {/* </Debug> */}
            </Physics>
          </Canvas>
          <div className="Home-LastGame PlayResult">
            <div className="lastgames-ele">
              <div className="Home-RowEle">
                <div className="Home-Row1">
                  <img src={getendpoint("http", user.avatar)} alt="" />
                  <span >{user.username}</span>
                </div>
                <div>
                  <div className="Home-Row2">
                    <div className="Home-Row2-content">
                      <span className="Home-score1">{result[0]}</span>
                      <img src={vs} alt="" />
                      <span className="Home-score2">{result[1]}</span>
                    </div>
                    <div className="date">
                      <span>remote game</span>
                    </div>
                  </div>
                </div>
                <div className="Home-Row3">
                  <span >{enemy.username}</span>
                  <img src={getendpoint("http", enemy.avatar)} alt="" />
                </div>
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
                {/* <img src={winnerImg} alt="" className="winnerPic" /> */}
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
          <div className="quitGame">
            <Link to={"../"}><i className="fa-solid fa-arrow-right-from-bracket fa-sm"></i> Exit</Link>
          </div>
        </div>
      </>
    );
  }
};

// interface ProviderData {
//   socket: WebSocket,
//   gameId
// }

const emptyUser: FriendDataType = {
  id: -1,
  username: "Enemy",
  email: "",
  avatar: "/media/default.jpeg",
  is_blocked: false,
  is_online: true,
  stats: {
    xp: 0,
    win: 0,
    lose: 0,
    level: 0,
    user: -1,
    badge: -1,
    nbr_games: 0,
  },
  rank: 0,
}

const Provider = ({ socketRef, gameId }: { socketRef: React.MutableRefObject<WebSocket | null> , gameId:number}) => {
  const user = getUser()
  const [error, setError] = useState<string | null>(null)
  const [enemy, setEnemy] = useState<FriendDataType>(emptyUser)
  const [winner, setWinner] = useState<userDataType | FriendDataType | null>(null)
  const [result, setResult] = useState<[number, number]>([0, 0])

  return (
    <resultsContext.Provider value={{ result, setResult, user, socketRef, enemy, setEnemy, error, setError, winner, setWinner, gameId }}>
      <Play />
    </resultsContext.Provider>
  )
}



const Remote = () => {
  const { id } = useParams();
  const [gameId] = useState<number>(id && !isNaN(parseInt(id, 10)) ? parseInt(id, 10) : -1)
  if (gameId == -1)
    return <Navigate to={"/"}/>
  const socket = useRef<WebSocket|null>(null)
  return (<Provider socketRef={socket} gameId={gameId}/>)
}

export default Remote;
