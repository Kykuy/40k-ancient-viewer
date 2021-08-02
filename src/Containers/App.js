import { useState, useEffect } from 'react'; 

import './App.css';
import Input from '../Components/Input';
import Output from '../Components/Output';

import GSheetReader from 'g-sheets-api'; // get the google-sheets reader libraryy

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
      <div className = 'wrapper'>
        <header>
          <h1 className = 'title'>40K: Inquisitor - Ancient Relic Viewer</h1> {/* React uses className HTML attribute instead of class */}
          <p className = 'hero'>
            By Kykuy, updated for <span>2.4.0c</span>. All displayed data provided by <a href='https://docs.google.com/spreadsheets/d/1SsMOf-6jhhhly36s2pf7aqWO96Y15lVN2alulkMJX1s/edit#gid=814775978'>Psojed</a> and <a href="https://github.com/mome-borogove/40K-ancient-list/">Mome Borogove</a>.
            For questions, visit <a href="https://discord.gg/inquisitor40k">40K: Inquisitor Discord</a>. Submit bugs at <a href="https://github.com/Kykuy/40K-ancient-list/issues">Github</a>.
          </p>
        </header>
        <main>
          <section className = 'selectGroup'>
            <Input enchants = {enchants} selectedItemType = {selectedItemType} selectedAffix = {selectedAffix}
              setSelectedItemType = {setSelectedItemType} setSelectedAffix = {setSelectedAffix}
              itemTypeList = {itemTypeList} itemsDictionary = {itemsDictionary}
            />
          </section>
          <section className = 'output'>
            <Output enchants = {enchants} unlockReqs = {unlockReqs}
              selectedItemType = {selectedItemType} selectedAffix = {selectedAffix}
            />
          </section>
        </main>
      </div>     
    )
  }
}
export default App;