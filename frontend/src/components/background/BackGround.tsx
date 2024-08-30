import { ReactNode } from 'react'
import './BackGround.css'
import circl from './images/circle.png'
interface Props {
    children: ReactNode,
}

const BackGround = ({children}: Props) => {
  return (
    <>
        <div className='rectangle0'></div>
        <div className='rectangle1'></div>
        <img src={circl} alt="#" className='circle' />
        <div className='rectangle2'></div>
        <div className='rectangle3'></div>
        {children}
    </>
  )
}

export default BackGround
