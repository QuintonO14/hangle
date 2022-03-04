import { useEffect, useRef, useState } from "react"
import { words } from "../words"
import Keyboard from "./Keyboard"
import Help from './Help'
import './Hangman.scss'
import mistake0 from '../images/mistake0.png'
import mistake1 from '../images/mistake1.png'
import mistake2 from '../images/mistake2.png'
import mistake3 from '../images/mistake3.png'
import mistake4 from '../images/mistake4.png'
import mistake5 from '../images/mistake5.png'
import mistake6 from '../images/mistake5.png'
import mistake7 from '../images/mistake7.png'
import mistake8 from '../images/mistake8.png'
import mistake9 from '../images/mistake9.png'


interface Hang {
    current: HTMLDivElement | null
}


const Hangman = () => {
    const maxTries = 9
    const time = 84600
    const images = [mistake0, mistake1, mistake2, mistake3, mistake4, mistake5, mistake6, mistake7,
    mistake8, mistake9]
    const theme = localStorage.getItem("theme")
    let vh = window.innerHeight * 0.01
    let wordList: any = []
    let message!: string
    let result!: boolean
    let streak: number = 0
    const [dailyWord, setWord] = useState('')
    const [answer, setAnswer] = useState('')
    const [guess, setGuess] = useState<any>([])
    const [mistake, setMistake] = useState(0)
    const [dailyStreak, setStreak] = useState(0)
    const [disabled, setDisabled] = useState(false)
    const [darkMode, setDarkMode] = useState(theme === 'dark' ? true : false)
    const [help, setHelp] = useState(false)
    const hangerman: Hang = useRef(null)
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    })
    if(darkMode === true) {
        hangerman.current?.classList.add('dark')
        localStorage.setItem("theme", "dark")
    } else {
        hangerman.current?.classList.remove('dark')
        localStorage.setItem("theme", "light")
    }
    
    const wordOfTheDay = () => {
            let index = Math.floor(Math.random() * words.length)
            let word = words.splice(index, 1).toString()   
            wordList.push(word)
            return word.toLowerCase()
    }

    const guessedWord = () => {
        if(dailyWord) {
            return dailyWord.split("").map(letter => guess.includes(letter) ? letter : " _ ")
        } else {
            return Array(7).fill('_')
        }
    }

    const guessHandler = (e: any) => {
        let letter = e.target.value
        setGuess(guess.concat(letter))
        setMistake(mistake + (dailyWord.includes(letter) ? 0 : 1))   
    }

    const getToken = (key: string) => {
        const item = localStorage.getItem(key)
        if(!item) {
            return null;
        }

        const i = JSON.parse(item)
        if(Date.now() > i.ttl) {
            localStorage.removeItem(key)
            return null
        }
        return i.value
    }

    const setToken = (keyName: string, keyValue: any, ttl: number) => {
        const data = {
            value: keyValue,
            ttl: Date.now() + (ttl * 1000) 
        }

        localStorage.setItem(keyName, JSON.stringify(data))
    }

    const winner = guessedWord().join("") === dailyWord
    const loser = mistake >= maxTries

    const gameResult = () => {
        const token = getToken("result")
       
        if(winner) {
            if(dailyStreak) {
                streak = dailyStreak
                streak++
            } else {
                streak++ 
            }
            setToken("streak", streak, time * 2)
            setToken("result", "winner", time)
            setToken("answer", dailyWord, time)
            setToken("mistake", mistake, time)
            message = 'You Won! Come back tomorrow to further your streak!' 
            result = true
        } else if(loser) {
            streak = 0
            localStorage.removeItem("streak")
            setToken("result", "loser", time)
            setToken("answer", dailyWord, time)
            setToken("mistake", mistake, time)
            message = `You Lost! Don't worry, there is always tomorrow!`
            result = true
        }

        switch(token) {
            case "winner":
                message = 'You Won! Come back tomorrow to further your streak!'
                break;
            case "loser" :
                message = `You Lost! Don't worry, there is always tomorrow!`
                break;
            default: 
            return null;
        }
    }

    const letters = () => {
        if(answer) {
            return answer
        } else if(result) {
            return dailyWord
        } else {
            return guessedWord()
        }
    }

    useEffect(() => {
        const answer = getToken("answer")
        const streak = getToken("streak")
        const res = getToken("result")
        const mistake = getToken("mistake")
        setStreak(streak)
        if(res){
            setDisabled(true)
            setMistake(mistake)
        }
        if(!answer) { 
        const word = wordOfTheDay()
            setWord(word)
        if(!words.length) {
            words.push(...wordList)
            wordList.length = 0
        }
        wordOfTheDay()
        } else {
          setWord(answer)
          setAnswer(answer)
        }
    }, [])
    if(dailyStreak) {
        streak = dailyStreak
    }

    gameResult()

    return (
        <div className="container" ref={hangerman}>
            <header className="header">
                <div className="header-item">
                    <label className="switch">
                        <input 
                         type="checkbox" 
                         id="checkbox"
                         checked={darkMode}
                         onChange={() => setDarkMode(!darkMode)}/>
                        <div className="slider round"></div>
                    </label>
                    <svg onClick={() => setHelp(!help)} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                        <path fill={darkMode ? 'white' : 'black'} d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"></path>
                    </svg>
                </div>
                <div className="header-item">HANGLE</div>
                <div className="header-item">Streak: {streak}</div>
            </header>
            <div className="hangman">
                <img className="image" src={images[mistake]} alt={`${mistake}`} />
                <div className="game-info">
                    <h1 className="letters">{letters()}</h1>
                    <p className="guesses">{!result && guess}</p>
                </div>
            </div>
            <div className="message">
                {message}
            </div>
            <Keyboard 
            daily={answer}
            disabled={disabled}
            guess={guessHandler} 
            guessed={guess}
            result={result}
            word={guessedWord}
            />
            {help === true && (
                <Help setHelp={setHelp} />
            )}
        </div>
    )
}

export default Hangman