### Basic info

All displayed data is fetched from [this Google spreadsheet](https://docs.google.com/spreadsheets/d/1SsMOf-6jhhhly36s2pf7aqWO96Y15lVN2alulkMJX1s/edit#gid=814775978)(sheet #2 - Ancient Relic + Unlocks).

The response is in the form of an array of objects(1 per row), with keys corresponding to headers(A1, B1, so on) and their values are taken from cell data.
Thus, the first item of the response array will store item types data for each Ancient Relic enchant(row 2).

### How to update this for the future

Until Ancient Relic-specific data scrapping tools are created, you'll need to manually fill out and/or update the existing info in the source Google spreadsheet(you may need to contact the creator for the permissions to update it). If adding new affixes, make sure to exactly follow the existing structure as seen in the source spreadsheet.

### How to post redeploy this on Github Pages

To deploy on github pages, follow [these instructions](https://create-react-app.dev/docs/deployment/#github-pages). You will have to clone the repo and use ``npm install``.