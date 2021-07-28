import { useState, useEffect } from 'react'; 

import './App.css';
import GSheetReader from 'g-sheets-api'; // get the google-sheets reader library

function App() {
  const [error, setError] = useState(null); // error information will be stored here

  const [isLoading, setIsLoading] = useState(true);

  const [enchants, setEnchants] = useState({});
  const [unlockReqs, setUnlockReqs] = useState({});
  const [itemTypeList, setItemTypeList] = useState({});

  const [selectedItemType, setSelectedItemType] = useState('arc_blade');
  const [selectedAffix, setSelectedAffix] = useState('Anguish');

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
        itemTypes: '',
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
      itemTypes.armor.sort();
      itemTypes.belts.sort();
      itemTypes.implants.sort();
      itemTypes.others.sort();
      itemTypes.weapons.sort();

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
  }, []) // an empty array as a second argument is just a way to tell React this effect with all this unoptimized spaghetti code should only run once - on first render

  useEffect(() => {
    setSelectedAffix( Object.keys(enchants).find( (key) => enchants[key].itemTypes.includes(selectedItemType) ) );
  }, [enchants, selectedItemType]);
  
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

        <label>Select item type:

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
            {Object.keys(enchants).map( (affix) => {
              return <option key = {affix}               
              disabled = {!enchants[affix].itemTypes.includes(selectedItemType)}
              value = {affix}
              >of {affix}</option>
            })}
          </select>
          
        </label>

      </div>
      </>
    )
  }
}
export default App;
