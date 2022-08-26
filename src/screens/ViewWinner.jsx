import './index.css'

export function ViewWinner({ winner }){
  return(
    <div className='section'>
      <h3>
        {
          winner === 0 && 'Player One '
        }
        {
          winner === 2 && 'Player Two '
        }
        {
          winner === 1 && 'Nobody '
        }
         Wins!!
      </h3>
    </div>
  )
}