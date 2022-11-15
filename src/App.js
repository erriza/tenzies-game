import './App.css';
import Confetti from 'react-confetti'
import Die from './Components/Die';
import { useEffect, useState } from 'react';
import {nanoid} from "nanoid"
import Timecode from 'react-timecode';
import Timer from 'react-timer-wrapper'


function App() {

  /*cosas por anadir: CSS agregar puntos a los datos en lugar de numeros
                      hacer conteo del tiempo que tomo para ganar
                      guardar el mejor tiempo en local para competir
  */
  var initialCounterState = 1
  const [dice, setDice] = useState(allNewDice())
  const [counter, setCounter] = useState(initialCounterState)
  const [tenzies, setTenzies] = useState(false)
  
  useEffect( (die)=> {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if(allHeld && allSameValue){
      setTenzies(true)
    }
  }, [dice]) 

  function generateNewDice()  {
    return {
      value: Math.ceil(Math.random() * 6), 
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i=0; i < 10; i++){
       newDice.push(generateNewDice())
    }
    return newDice
}

  function rollDices () {
      if(!tenzies){
        setCounter(counter+1)
        setDice(oldDice => oldDice.map(die => {
          return die.isHeld ? die : generateNewDice()
        }))
      } else {
        setTenzies(false)
        setDice(allNewDice())
        setCounter(initialCounterState)
        console.log("entro a else en rolldices")
      }
      console.log(counter)
    }

  function holdDice (id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? 
        {...die, isHeld: !die.isHeld} :
        die
    }))
  }

const diceElements = dice.map(die => 
  <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)}/>)
  
  return (
    <main>
      { tenzies && <Confetti/> }
      <h1 className="title">Tenzies</h1>
      { tenzies && <h2 className='counter-title'>You won in {counter} turns</h2>}
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className='dice-container' onClick={holdDice}>
        {diceElements}
      </div>
      <Timer active duration={null}>
        <Timecode />
      </Timer>
      <button className='roll-button' onClick={rollDices}>{ tenzies ? "New Game" : "Roll" }</button> 
    </main>
  );
}

export default App;
