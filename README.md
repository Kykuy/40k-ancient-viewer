# WH40k: Inquisitor - Martyr Ancient Relic Viewer

A tool to see all possible combinations for Ancient Relic items for a WH40k videogame.

### Table of contents

- [General descriptions](#general-description)
- [Usage guide](#usage-guide)
- [Running locally](#running-locally)
- [How to update this for the future](#how-to-update-this-for-the-future)

### General description

_____

All displayed data is fetched from [this Google spreadsheet](https://docs.google.com/spreadsheets/d/1SsMOf-6jhhhly36s2pf7aqWO96Y15lVN2alulkMJX1s/edit#gid=814775978)(sheet #2 - Ancient Relic + Unlocks).

The response is in the form of an array of objects(1 per row), with keys corresponding to headers(A1, B1, so on) and their values are taken from cell data.
Thus, the first item of the response array will store item types data for each Ancient Relic enchant(row 2).

### Usage guide

_____

Use the provided select fields for Item type and Affix to display a desired combination. Both fields are searchable if you are looking for a particular item/affix.

To see each enchant unlock requirements, hover on the red lock symbol on a particular enchantment.

### Running locally

_____

To run the app locally

1. Clone the repo
`git clone https://github.com/Kykuy/40k-ancient-viewer.git`
2. Install the dependencies
`npm install` or `yarn install`
3. Run the app
`npm start` or `npm start`

### How to update this for the future

_____

Until Ancient Relic-specific data scrapping tools are created, you'll need to manually fill out and/or update the existing info in the [source Google spreadsheet](https://docs.google.com/spreadsheets/d/1SsMOf-6jhhhly36s2pf7aqWO96Y15lVN2alulkMJX1s/edit#gid=814775978)(you may need to contact the creator for the permissions to update it). 

If adding new affixes, make sure to exactly follow the existing structure as seen in the source spreadsheet.

