import { useState, useEffect } from 'react'; 

import './App.css';
import GSheetReader from 'g-sheets-api'; // get the google-sheets reader library

function App() {
  const [error, setError] = useState(null); // error information will be stored here

  const [isLoading, setIsLoading] = useState(true);

  const [enchants, setEnchants] = useState({});
  const [unlockReqs, setUnlockReqs] = useState({});

  function setAncientsData(spreadsheetData) {
    const enchants = {};
    const unlocks = {};

    for ( let key of Object.keys(spreadsheetData[0]) ) {  // key is an affix as defined in spreadsheet header(A1, B1, and so on)

      enchants[key] = { // set up an enchant template for all affixes
        itemTypes: '',
        ancientEnch: '',
        ench1: '',
        ench2: '',
        ench3: '',
        ench4: '',
      };
      
      unlocks[key] = { // set up an unlock template for all affixes 
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

      enchants[key].itemTypes = spreadsheetData[0][key].replace('Item types: ', '').split(', '); // set itemtypes
    }

    for ( let key of Object.keys(spreadsheetData[1]) ) {
      enchants[key].ancientEnch = spreadsheetData[1][key];
    }

    for (let i = 2; i < 6; i++) {
      for ( let key of Object.keys(spreadsheetData[i]) ) {
        enchants[key][`ench${i-1}`] = spreadsheetData[i][key];
      }
    }

    //console.log(enchants);

    for ( let key of Object.keys(spreadsheetData[7]) ) { // set the unlocks for ancient enchants
      unlocks[key].ancientEnch.condition = spreadsheetData[7][key];
      unlocks[key].ancientEnch.value = spreadsheetData[8][key];
    }

    for (let i = 9, enchNum = 1; i < spreadsheetData.length; i += 2, enchNum++) { // set the unlocks for regular enchants
      for ( let key of Object.keys(spreadsheetData[i]) ) {
        unlocks[key][`ench${enchNum}`].condition = spreadsheetData[i][key];
        unlocks[key][`ench${enchNum}`].value = spreadsheetData[i + 1][key];
      }
    }

    //console.log(unlocks);

    setEnchants(enchants);
    setUnlockReqs(unlocks);        
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
        setAncientsData(results);
        setIsLoading(false);        
      },
      (error) => {
        setError(error);
      }
    );
  }, []) // an empty array as a second argument is just a way to tell React this effect with all this unoptimized spaghetti code should only run once - on first render
  
  // return ( // return block defines actual HTML that is seen
  //   error ? <div>Error: {error.message}</div> : isLoading ? <div>Loading data...</div> :
    
  //     <div className="App">
  //       40K: Inquisitor - Ancient Relic Viewer
  //     </div>      
    
  // );

  if (error) {
    return <div>Error: {error.message}</div>
  } else if (isLoading) {
    return <div>Loading data...</div>
  } else {
    return (
      <div className="App">
        40K: Inquisitor - Ancient Relic Viewer
      </div>
    )
  }
}
export default App;
