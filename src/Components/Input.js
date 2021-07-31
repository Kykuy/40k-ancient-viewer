import Select from 'react-select'; // get the select element librar

function Input(props) {
  const { enchants, selectedItemType, selectedAffix, setSelectedItemType, setSelectedAffix, itemTypeList, itemsDictionary } = props;

  const groupStyles = { // style for the group delimiter of react-select
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const groupBadgeStyles = { // style for the number indicator of the elements in a group
    backgroundColor: '#EBECF0',
    borderRadius: '2em',
    color: '#172B4D',
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: '1',
    minWidth: 1,
    padding: '0.16666666666667em 0.5em',
    textAlign: 'center',
  };
  
  const formatGroupLabel = data => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  function sortItemLabels(label1, label2) {
    let nameA = label1.label.toUpperCase(); // ignore upper and lowercase
    let nameB = label2.label.toUpperCase(); // ignore upper and lowercase

    if (nameA < nameB) {
      return -1;
    }

    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  }

  return (       
    <>
      <Select isClearable formatGroupLabel = {formatGroupLabel} defaultValue = {selectedItemType} onChange = {setSelectedItemType}
      options = {[
        {
          label: 'Armor',
          options: Array.from( itemTypeList.armor.map( (armorType) => ({value: armorType, label: itemsDictionary[armorType]}) ) ).sort(sortItemLabels),
        },

        {
          label: 'Belts',
          options: Array.from( itemTypeList.belts.map( (beltType) => ({value: beltType, label: itemsDictionary[beltType]}) ) ).sort(sortItemLabels),
        },

        {
          label: 'Implants',
          options: Array.from( itemTypeList.implants.map( (implantType) => ({value: implantType, label: itemsDictionary[implantType]}) ) ).sort(sortItemLabels),
        },

        {
          label: 'Other',
          options: Array.from( itemTypeList.others.map( (otherType) => ({value: otherType, label: itemsDictionary[otherType]}) ) ).sort(sortItemLabels),
        },

        {
          label: 'Weapons',
          options: Array.from( itemTypeList.weapons.map( (weaponType) => ({value: weaponType, label: itemsDictionary[weaponType]}) ) ).sort(sortItemLabels),
        },
        ]}          
      />

      <Select isClearable value = {selectedAffix} defaultValue = {selectedAffix} onChange = {setSelectedAffix}
      options = {Array.from(Object.keys(enchants)
        .filter( affix => enchants[affix].itemTypes.includes(selectedItemType.value) )
        .map( affix => {
          return { 
            value: affix,
            label: affix.slice(0, affix.indexOf('_')),
          }
          })
      )}        
      />
  </>
  )
}

export default Input;