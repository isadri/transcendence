import React, { useEffect } from 'react'
import { getContext } from '../../context/getContextData'
import './Alert.css'

interface Props{
    primaryColor: string,
    secondaryColor: string,
    children: React.ReactNode;
}

function Alert({primaryColor, secondaryColor, children}: Props) {
  const account = getContext()
  if (account)
  {
    useEffect(() => {
      if (account.Displayed === 2) {
        setTimeout(() => {
          account.setDisplayed(1)
        }, 900);
      }
    }, []);
    return (
    <div style={{backgroundColor: primaryColor, color:secondaryColor, borderColor:secondaryColor}}
         className={`alert-acountDeleted
         ${account.Displayed === 2 ? "show" : "hide"}`}
         >
        {children}
        <span>{account.createdAlert}</span>
    </div>
    )
  }
}

export default Alert
