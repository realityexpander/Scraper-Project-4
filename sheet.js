const { GoogleSpreadsheet } = require('google-spreadsheet');


// Stock Prices
// https://docs.google.com/spreadsheets/d/1fz1KCUkLiWRPZ2FThC-wlcZzjbEEE2EIPu8SGeCbwVA/edit#gid=0


class Sheet {
    constructor() {
        this.doc = new GoogleSpreadsheet('1fz1KCUkLiWRPZ2FThC-wlcZzjbEEE2EIPu8SGeCbwVA');
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
