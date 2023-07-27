const {Schema , model} = require("mongoose");

const DeptFinancialsSchema = new Schema({
    
    Project: {
        type : String,
    },
    Proposal: {
        type : String,
    },
    Quotations: {
        type : String,
    },
    SignOff: {
        type : String,
    },
    Quoted: {
        type : Number,
    },
    Invoiced: {
        type : String,
    },
    TimeProposal: {
        type : [Date],
    },
    TimeActual: {
        type : [Date],
    },
    Status: {
        type : String,
    },
});

//model to extract from database
//model(what do you want to extract, how)
const DeptFinancialsModel = model("deptFinancials",DeptFinancialsSchema);

//to use this model in the server side
module.exports=DeptFinancialsModel;
