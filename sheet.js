const { GoogleSpreadsheet } = require('google-spreadsheet');


// Reddit Comments
// https://docs.google.com/spreadsheets/d/1WDxlusy9tCNU8vdVyEjRrXIkkAOdsn45wGrTw2F4nzQ/edit#gid=0


class Sheet {
    constructor() {
        this.doc = new GoogleSpreadsheet('1WDxlusy9tCNU8vdVyEjRrXIkkAOdsn45wGrTw2F4nzQ');
    }
    
    async load() {
        await this.doc.useServiceAccountAuth(require('./credentials.json'))
        await this.doc.loadInfo(); // loads document properties and worksheets
    }

    async addRows(rows, sheetIndex) {
        const sheet = this.doc.sheetsByIndex[sheetIndex];
        await sheet.addRows(rows)
    }

    async getRows(sheetIndex) {
        const sheet = this.doc.sheetsByIndex[sheetIndex];
        const rows = await sheet.getRows()
        return rows
    }

    async addSheet(title, headerValues) {
        const newSheet = await this.doc.addSheet({ title, headerValues }); 
        return this.doc.sheetsByIndex.length - 1  // returns index of this newly added sheet
    }
}


// async function test() {
//     const sheet = new Sheet()

//     await sheet.load()
//     await sheet.addRows([
//         { name: "Chris Athanas", email:'jimmy@ho.com'},
//         { name: "Crap crapasaurus", email:'uyyy@hos.com'}
//     ])
// }
// test()


module.exports = Sheet
