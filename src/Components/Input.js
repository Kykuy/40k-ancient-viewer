import Select from 'react-select'; // get the select element librar

function Input(props) {
  const { screenWidth, enchants, selectedItemType, selectedAffix, setSelectedItemType, setSelectedAffix, itemTypeList, itemsDictionary } = props;

  let itemTypeLabel = screenWidth > 700 ? <span className = 'inputLabel itemTypeLabel'>Item type:</span> : null;
  let affixLabel = screenWidth > 700 ? <span className = 'inputLabel affixLabel'>Ancient Relic affix:</span> : null;


  //styling via CSS is possible but would require setting !important on most of the properties
  const customStyles = {
    container: (provided, state) => ({
      ...provided,
      color: 'initial',
      width: 'min(100vw, 450px)',      
      display: 'inline-block',
    }),

    control: (provided, state) => ({
      ...provided,           
      border: state.isFocused ? 0 : '1px solid #ced4da;',      
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgb(187 254 250 / 25%)' : 'none',
      borderTopLeftRadius: screenWidth > 700 ? 0 : 4,
      borderBottomLeftRadius: screenWidth > 700 ? 0 : 4, 
    }),

    clearIndicator: (provided, state) => ({
      ...provided,
      '&:hover': {
        color: 'red',
      }
    }),

    menu: (provided, state) => ({
      ...provided,      
      marginTop: 0,      
    }),

    menuList: (provided, state) => ({
      ...provided,
      '&::-webkit-scrollbar': {
        width: '0.4em',
      },

      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgb(187, 179, 179)',
        border: '1px solid slategrey',
        borderRadius: '25px',

        '&:hover': {
          backgroundColor: 'rgba(169, 0, 0, 1)',
        }
      },
    }),

    // valueContainer: (provided, state) => ({
    //   ...provided,
    //   justifyContent: 'center',
    // }),
  };

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
    <div className = 'selectWrapper'>    
      <article className = 'inputGroup'>
        {itemTypeLabel}
        <Select styles = {customStyles} isClearable formatGroupLabel = {formatGroupLabel} defaultValue = {selectedItemType} onChange = {setSelectedItemType}
        className = 'react-select' classNamePrefix = 'react-select1'
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
      </article>

      <article className = 'inputGroup'>
        {affixLabel}
        <Select styles = {customStyles} isClearable value = {selectedAffix} defaultValue = {selectedAffix} onChange = {setSelectedAffix}
        className = 'react-select' classNamePrefix = 'react-select2'
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
      </article>
  </div>
  )
}

export default Input;