import { useState, useEffect } from 'react'; 

import './App.css';
import GSheetReader from 'g-sheets-api'; // get the google-sheets reader library
import Select from 'react-select'; // get the select element library

function App() {
  const [error, setError] = useState(null); // error information will be stored here

  const [isLoading, setIsLoading] = useState(true);

  const [enchants, setEnchants] = useState({});
  const [unlockReqs, setUnlockReqs] = useState({});
  const [itemTypeList, setItemTypeList] = useState({});

  const [selectedItemType, setSelectedItemType] = useState({value: 'arc_blade', label: 'Arc Blade'});
  const [selectedAffix, setSelectedAffix] = useState({value: 'Ambush_4', label: 'Ambush'});

  const itemsDictionary = {
    arc_blade: "Arc Blade",
    arc_rifle: "Arc Rifle",
    arc_sword: "Arc Sword",
    assassin_power_sword: "Assassin Power Sword",
    autogun: "Autogun",
    autopistol: "Autopistol",
    belt: "Teleporter/Digital Weapons",
    belt_forcefield: "Force Field",
    belt_grenade: "Grenade",
    belt_mine: "Mine",
    belt_psyker: "Psychic Focus",
    belt_techadept: "Archeotech Item",
    bolt_pistol: "Bolt Pistol",
    boltgun: "Boltgun",
    carthean_sword: "Carthean Sword",
    chainsword: "Chainsword",
    death_cult_blade: "Death Cult Blade",
    eviscerator: "Eviscerator",
    exitus_rifle: "Exitus Rifle",
    eye_implant: "Eye Implant",
    force_rod: "Force Rod",
    force_rod_2: "Warp Rod",
    force_rod_3: "Telekinetic Rod",    
    force_staff: "Force Stave",
    force_staff_2: "Pyrokinetic Stave",
    force_staff_3: "Wyrdvane Stave",    
    force_sword: "Force Sword",
    force_sword_2: "Biomantic Sword",
    force_sword_3: "Aether Blade",
    grav_gun: "Grav Gun",
    grav_pistol: "Grav Pistol",
    greataxe: "Greataxe",
    greatsword: "Greatsword",
    grenade_launcher: "Grenade Launcher",
    heavy_bolter: "Heavy Bolter",
    heavy_flamer: "Heavy Flamer",
    inferno_pistol: "Inferno Pistol",
    inoculator: "Inoculator",
    lasgun: "Lasgun",
    laspistol: "Laspistol",
    longlas_rifle: "Longlas Rifle",
    main_implant: "Main Implant",
    melta_gun: "Melta Gun",
    multi_melta: "Multi Melta",
    needler_sniper_rifle: "Needler Sniper Rifle",
    neural_implant: "Neural Implant",
    null_rod: "Null Rod",
    omnissian_axe: "Omnissian Axe",
    plasma_cannon: "Plasma Cannon",
    plasma_gun: "Plasma Gun",
    plasma_pistol: "Plasma Pistol",
    power_armor: "Power Armor",
    power_axe: "Power Axes",
    power_hammer: "Power Hammer",
    power_sword: "Power Swords",
    psyker_armor: "Psyker Armor",
    purity_seal: "Purity Seal",
    radium_carbine: "Radium Carbine",
    shotgun: "Shotgun",
    signum: "Signum",
    sniper_rifle: "Sniper Rifle",
    storm_shield: "Storm Shield",
    suppression_shield: "Suppression Shield",
    synskin_armor: "Synskin Armor",
    techadept_armour: "Techadept Armor",
    thunder_hammer: "Thunder Hammer",
    voltaic_axe: "Voltaic Axe",
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

  function createAncientsData(spreadsheetData) {
    const enchants = {};
    const unlockReqs = {};

    const itemTypes = {
      armor: [],
      belts: [],
      implants: [],
      others: [],
      weapons: [],
    }

    for ( let key of Object.keys(spreadsheetData[0]) ) {  // key is an affix as defined in spreadsheet header(A1, B1, and so on)

      enchants[key] = { // set up an enchant template for each variant
        itemTypes: [],
        ancientEnch: '',
        ench1: '',
        ench2: '',
        ench3: '',
        ench4: '',
      };
      
      unlockReqs[key] = { // set up an unlock template for each variant
        ancientEnch: {
          condition: '',
          value: '',
        },

        ench1: {
          condition: '',
          value: '',
        },

        ench2: {
          condition: '',
          value: '',
        },

        ench3: {
          condition: '',
          value: '',
        },

        ench4: {
          condition: '',
          value: '',
        },
      }

      enchants[key].itemTypes = spreadsheetData[0][key].replace('Item types: ', '').split(', '); // assign item types to affixes

      for (let itemType of enchants[key].itemTypes) {        
        if ( itemType.includes('armor') || itemType.includes('armour') ) {
          if ( !itemTypes.armor.includes(itemType) ) {
            itemTypes.armor.push(itemType);
          }
        } else if ( itemType.includes('belt') ) {
          if ( !itemTypes.belts.includes(itemType) ) {
            itemTypes.belts.push(itemType);
          }
        } else if ( itemType.includes('implant') ) {
          if ( !itemTypes.implants.includes(itemType) ) {
            itemTypes.implants.push(itemType);
          }
        } else if ( itemType.includes('signum') || itemType.includes('inoculator') || itemType.includes('purity_seal') ) {
          if ( !itemTypes.others.includes(itemType) ) {
            itemTypes.others.push(itemType);
          }
        } else {                   
          if ( !itemTypes.weapons.includes(itemType) ) {
            itemTypes.weapons.push(itemType);
          }
        }
      }

      // sort item types in alphabetical order
      // itemTypes.armor.sort();
      // itemTypes.belts.sort();
      // itemTypes.implants.sort();
      // itemTypes.others.sort();
      // itemTypes.weapons.sort();

      setItemTypeList(itemTypes);
    }

    for ( let key of Object.keys(spreadsheetData[1]) ) { // set primary ancient enchant
      enchants[key].ancientEnch = spreadsheetData[1][key];
    }

    for (let i = 2; i < 6; i++) {
      for ( let key of Object.keys(spreadsheetData[i]) ) { // set 4 other enchants
        enchants[key][`ench${i-1}`] = spreadsheetData[i][key];
      }
    }

    //console.log(enchants);

    for ( let key of Object.keys(spreadsheetData[7]) ) { // set the unlocks for ancient enchants
      unlockReqs[key].ancientEnch.condition = spreadsheetData[7][key];
      unlockReqs[key].ancientEnch.value = spreadsheetData[8][key];
    }

    for (let i = 9, enchNum = 1; i < spreadsheetData.length; i += 2, enchNum++) { // set the unlocks for regular enchants
      for ( let key of Object.keys(spreadsheetData[i]) ) {
        unlockReqs[key][`ench${enchNum}`].condition = spreadsheetData[i][key];
        unlockReqs[key][`ench${enchNum}`].value = spreadsheetData[i + 1][key];
      }
    }

    //console.log(unlocks);

    setEnchants(enchants);
    setUnlockReqs(unlockReqs);        
  }

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

  useEffect(() => {
    GSheetReader(
      {
        sheetId: "1SsMOf-6jhhhly36s2pf7aqWO96Y15lVN2alulkMJX1s",
        sheetNumber: 2,
        returnAllResults: true,    
      },
      (results) => {
        //console.log(results);
        createAncientsData(results);
        setIsLoading(false);        
      },
      (error) => {
        setError(error);
      }
    );
  }, []) // an empty array as a second argument is just a way to tell React this effect with all this code above should only run once - on first render

  // useEffect(() => { // useEffect for native select
  //   setSelectedAffix( Object.keys(enchants).find( (key) => enchants[key].itemTypes.includes(selectedItemType.value) ) );
  // }, [enchants, selectedItemType]);

  useEffect(() => { // useEffect for react-select library select
    let hasExactSameEnchant = enchants[selectedAffix.value]?.itemTypes.includes(selectedItemType.value);    

    if (!hasExactSameEnchant) {
      let validSameAffixEnchants = Object.keys(enchants)
      .filter( affix => affix.includes( selectedAffix.value?.slice(0, selectedAffix.value?.indexOf('_')) ) && enchants[affix].itemTypes.includes(selectedItemType.value) );

      if (!validSameAffixEnchants.length) {
        let appropriateAffix = Object.keys(enchants).find( key => enchants[key].itemTypes.includes(selectedItemType.value) );
        setSelectedAffix({
          value: appropriateAffix,
          label: appropriateAffix?.slice(0, appropriateAffix.indexOf('_')),
        });
      } else {
        setSelectedAffix({
          value: validSameAffixEnchants[0],
          label: validSameAffixEnchants[0]?.slice(0, validSameAffixEnchants[0].indexOf('_')),
        })
      }
    }    
    
  }, [enchants, selectedAffix.value, selectedItemType.value]); // the array of dependencies determines when should the effect run - on change of any of the included dependency
  
  // return block defines rendered HTML 
  if (error) {
    return <div>Error: {error.message}</div>
  } else if (isLoading) {
    return <div>Loading data...</div>
  } else {
    return (
      <>
       <div className = 'App'>  {/* React uses className HTML attribute instead of class */}
        40K: Inquisitor - Ancient Relic Viewer
      </div>

      <div className = 'selectGroup'>

        {/* <label>Select item type:

          <select name = 'itemType' value = {selectedItemType} onChange = { (event) => setSelectedItemType(event.target.value) }>
            <optgroup label = 'Armor'>
              {itemTypeList.armor.map( (armorType) => {
                return <option key = {armorType} value = {armorType}>{armorType}</option>
              })}
            </optgroup>

            <optgroup label = 'belts'>
              {itemTypeList.belts.map( (beltType) => {
                return <option key = {beltType} value = {beltType}>{beltType}</option>
              })}
            </optgroup>

            <optgroup label = 'implants'>
              {itemTypeList.implants.map( (implantType) => {
                return <option key = {implantType} value = {implantType}>{implantType}</option>
              })}
            </optgroup>

            <optgroup label = 'other'>
              {itemTypeList.others.map( (otherType) => {
                return <option key = {otherType} value = {otherType}>{otherType}</option>
              })}
            </optgroup>

            <optgroup label = 'weapons'>
              {itemTypeList.weapons.map( (weaponType) => {
                return <option key = {weaponType} value = {weaponType}>{weaponType}</option>
              })}
            </optgroup>
          </select>

        </label>

        <label>Select Ancient Relic affix:
          
          <select name = 'ancientAffix' value = {selectedAffix} onChange = {(event) => setSelectedAffix(event.target.value)}>
            {Object.keys(enchants).filter( affix => enchants[affix].itemTypes.includes(selectedItemType) ).map( (affix) => {
              return <option key = {affix}              
              value = {affix}
              >of {affix.slice(0, affix.indexOf('_'))}</option>
            })}
          </select>
          
        </label> */}

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

      </div>

      <div className = 'output'>
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
      </div>
      </>
    )
  }
}
export default App;
