import './landing.css'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Group } from 'three';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// TODO: change the color of floating
const modelUrl = new URL('../../assets/glb/sceen_without_balls.glb', import.meta.url).href;
const welcomeUrl = new URL('../../assets/glb/welcome_text.glb', import.meta.url).href;
const welcomeButtonUrl = new URL('../../assets/glb/welcome_button.glb', import.meta.url).href;

useGLTF.preload(modelUrl);
useGLTF.preload(welcomeUrl);
useGLTF.preload(welcomeButtonUrl);


function Model() {
  const sceneRef = useRef<Group>(null!)
  const navigate = useNavigate()

  useFrame((_state, delta) => {
    sceneRef.current.rotation.y += delta * 0.75
  })

  const table = useGLTF(modelUrl)
  const welcome = useGLTF(welcomeUrl)
  const button = useGLTF(welcomeButtonUrl)


  return (
    <>
      <group position={[0, 1, 0]}>
        <group ref={sceneRef}>
          <mesh position={[-0.5, 1.609, 1]}>
            <sphereGeometry args={[0.08, 30, 30]} />
            <meshStandardMaterial color={'white'} />
          </mesh>
          <mesh position={[-0.5, 1.609, -1.5]}>
            <sphereGeometry args={[0.08, 30, 30]} />
            <meshStandardMaterial color={'white'} />
          </mesh>
          <mesh position={[0.7, 1.609, -0.8]}>
            <sphereGeometry args={[0.08, 30, 30]} />
            <meshStandardMaterial color={'white'} />
          </mesh>
          <mesh position={[0.9, 0.54, -0.8]}>
            <sphereGeometry args={[0.08, 30, 30]} />
            <meshStandardMaterial color={'white'} />
          </mesh>
          <mesh position={[1.5, 0.54, 0.8]}>
            <sphereGeometry args={[0.08, 30, 30]} />
            <meshStandardMaterial color={'white'} />
          </mesh>
          <mesh position={[-1.4, 0.54, 1]}>
            <sphereGeometry args={[0.08, 30, 30]} />
            <meshStandardMaterial color={'white'} />
          </mesh>
          <primitive object={table.scene} />
        </group>
        <primitive object={welcome.scene} position={[0, -0.5, 3.25]} rotation={[Math.PI / 4, 0, 0]} />
        <primitive object={button.scene} position={[0, -0.5, 3.25]} rotation={[Math.PI / 4, 0, 0]} onClick={()=> {navigate("/Auth")}}/>
      </group>
    </>
  )
}

function LandingSceen() {
  
  return (
    <>
      <OrbitControls enableZoom={false} />
      <perspectiveCamera />
      <directionalLight position={[0, 5, 0]} intensity={2} />
      <directionalLight position={[0, 9, 15]} intensity={2} />
      <Model />
    </>
  )
}

function Landing() {
    return (
      <>
        <div className='landing'>
          <div className='landing3d'>
            <Canvas camera={{ position: [0, 3, 7] }}>
              <LandingSceen />
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
  // }
}

export default Landing