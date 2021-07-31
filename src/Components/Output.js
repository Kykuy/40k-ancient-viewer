function Output(props) {
  const { enchants, unlockReqs, selectedItemType, selectedAffix } = props;

  return (
    <>
      <p className = 'itemName'>{selectedItemType.label} of {selectedAffix.value.slice(0, selectedAffix.value.indexOf('_'))}</p>
      <p className = 'ancientEnch'
      data-tooltip = {`${unlockReqs[selectedAffix.value].ancientEnch.condition}(${unlockReqs[selectedAffix.value].ancientEnch.value})`}
      >Ancient Relic enchant: {enchants[selectedAffix.value].ancientEnch}</p>
      
      {[1, 2, 3, 4].map( number => { // there are 4 base enchants, create a description for each
        // dangerouslySetInnerHTML may theoretically expose us to XSS attack, but since we don't store any sensitive data we just don't care
        return <p key = {`enchant#${number}`} className = 'primaryEnch' 
        dangerouslySetInnerHTML = {{__html: `Regular enchant №${number}: ${enchants[selectedAffix.value][`ench${number}`]}`}}
        data-tooltip = {`${unlockReqs[selectedAffix.value][`ench${number}`].condition}(${unlockReqs[selectedAffix.value][`ench${number}`].value})`}></p> // outputs 'condition text(value)'
      })}
    </>
  )

}

export default Output;