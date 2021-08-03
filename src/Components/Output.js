import './Output.css'

function Output(props) {
  const { screenWidth, enchants, unlockReqs, selectedItemType, selectedAffix } = props;

  const tip = screenWidth > 568 ? <p className = 'tip'>Hover on the respective enchant's <span className = 'lock'></span> symbol to see unlock requirements</p> : null;

  return (
    <>
      {tip}
      <article className = 'itemCard'>
        <p className = 'itemName'>{selectedItemType.label} of {selectedAffix.value.slice(0, selectedAffix.value.indexOf('_'))}</p>

        <p className = 'ancientEnch enchantDescription' >
          <span className = 'enchTypeIndicator'></span>
          <span className = 'enchText'>{enchants[selectedAffix.value].ancientEnch}</span>
          <span className = 'lock' data-tooltip = {`${unlockReqs[selectedAffix.value].ancientEnch.condition}(${unlockReqs[selectedAffix.value].ancientEnch.value})`}></span>
        </p>
        
        {[1, 2, 3, 4].map( number => { // there are 4 base enchants, create a description for each
          // dangerouslySetInnerHTML may theoretically expose us to XSS attack, but since we don't store any sensitive data we just don't care
          return <p key = {`enchant#${number}`} className = 'primaryEnch enchantDescription' 
          dangerouslySetInnerHTML = {
            {
              __html: `<span class = 'enchTypeIndicator'></span>              
              <span class = 'enchText'>${enchants[selectedAffix.value][`ench${number}`]}</span>              
              <span class = 'lock' data-tooltip = '${unlockReqs[selectedAffix.value][`ench${number}`].condition}(${unlockReqs[selectedAffix.value][`ench${number}`].value})'></span>`
            }
          }
          ></p> // outputs 'condition text(value)'
        })}
      </article>
    </>
  )

}

export default Output;