import './index.css'

export function AcceptTerms({wager, costOfMove, accept, decline}){

  return(
    <div className='section'>
      <h4>Do you accept wager of {wager} ALG? Each move costs {costOfMove} ALG</h4>
      <button className='button' onClick={() => accept()}>Accept</button>
      <button className='button' onClick={() => decline()}>Decline</button>
    </div>
  )
}