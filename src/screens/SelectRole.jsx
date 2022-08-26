import { useState } from 'react'
import './index.css'

export function SelectRole({deploy, attach, setWager, setCostOfMove}){
  const [ host, setHost ] = useState(false)
  const [ cost, setCost ] = useState(false)
  return(
    <div className='section'>
      {
        cost ?
        <>
          <h4>Set Cost Of Each Move(ALGO)</h4>
          <input
            type='number'
            onChange={(e) => setCostOfMove(parseInt(e.target.value))}
          />
          <button onClick={() => deploy()} className='button'>Next</button>
        </>
        :
        host ?
        <>
          <h4>Set Wager (ALGO)</h4>
          <input
            type='number'
            onChange={(e) => setWager(parseInt(e.target.value))}
          />
          <button onClick={() => setCost(true)} className='button'>Next</button>
        </>
        :
        <>
          <button className='button' onClick={() => setHost(true)}>Host Game</button>
          <hr />
          <button className='button' onClick={() => attach(true)}>Attach as player one</button>
          <hr />
          <button className='button' onClick={() => attach(false)}>Attach as player two</button>
        </>
        
      }
    </div>
  )
}