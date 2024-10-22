import { Canvas, ThreeElements, useFrame } from '@react-three/fiber'
import './landing.css'
import { OrbitControls, useGLTF } from '@react-three/drei'


function Model(){
  const url = new URL("./../../assets/sceen_without_balls.glb", import.meta.url);
  const nodes = useGLTF(url.pathname)

  return (
    <group>
      <primitive object={nodes}/>
    </group>
  )
}

function LandingSceen() {


  // const tableGltf = useRef<Scene>(null!);

  // useFrame((state, delta)=>{
  //   tableGltf.current.rotation.y += delta*0.75;
  // })

  return (
    <>
      <OrbitControls />
      <perspectiveCamera/>
      <directionalLight position={[0 , 5, 0]} intensity={2}/>
      <Model/>
      {/* <Gltf src={(new URL("./../../assets/sceen_without_balls.glb", import.meta.url)).pathname} ref={tableGltf}/> */}
    </>
  )
}


function Landing() {
  return (
    <>
      <div className='landing'>
        <div className='landing3d'>
          <Canvas camera={{position: [0, 3, 7]}}>
            <LandingSceen/>
          </Canvas>
        </div>
        {/* <div className='landingCon'>
          <h1>welcome to our game </h1>
          <div className='paragraph'>
            <p>Are you ready to show off your ping pong skills? Play now and experience the ultimate table tennis game with realistic physics, thrilling gameplay, and endless competition!</p>
          </div>
          <div className="buttons">
            <button className="btn" id="loginBtn">Join Us</button>
          </div>
        </div> */}
        
      </div>
    </>
  )
}

export default Landing
