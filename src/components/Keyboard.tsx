import React from 'react'
import './Keyboard.scss'

interface Props {
    daily: string,
    guess: (event: React.MouseEvent<HTMLButtonElement>) => void,
    guessed: any,
    disabled: boolean,
    result: boolean,
    word: any   
}
const Keyboard = (Props: Props) => {
    const keys = 'qwertyuiopasdfghjklzxcvbnm'

   
    return (
        <div className="keyboard">
          {keys.split("").map((letter) => {
              if(Props.word().includes(letter) || Props.daily.includes(letter)) {
                 const el = document.getElementById(letter) as HTMLInputElement
                 el.style.backgroundColor = "rgb(50, 130, 50)"
              } 
              return (
               <button 
               className='key'
               id={letter}
               name={letter}
               key={letter}
               onClick={Props.guess}
               disabled={Props.guessed.includes(letter) || Props.result || Props.disabled}
               value={letter}
               >
                   {letter}
               </button>
              )
          })}
        </div>
    )
}

export default Keyboard