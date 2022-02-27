import './Help.scss'

interface Props {
    setHelp: any
}

const Help = (Props: Props) => {
    return (
        <div className="help">
            <h3>Help</h3>
            <p>Hangle generates a 7 letter word</p>
            <p>Click on each letter you think is in the word</p>
            <p>If a letter does exist, the tile will turn <span className='green'>GREEN</span></p>
            <p>Be careful of your selection, 9 wrong letters means you lose!</p>
            <button className="close" onClick={() => Props.setHelp(false)}>X</button>
        </div>
    )
}

export default Help