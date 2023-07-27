/*CREAT SERVER*/
// To make this file work as server we need from [node model] Express package, How?
// And to use it later we saved in the varible 
const express = require("express");
// This varible app will be work as function for Express PAckage
const app = express();

//CORS
const cors = require("cors");
app.use(cors())

//header
app.use(express.json())

const _port=process.env.PORT;


/*CONECT TO DB*/
const username = process.env.USERNAME,
    password = process.env.PASSWORD,
    database = process.env.DATABASE;

//To conentct the server with DB
const mongoose = require("mongoose");
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.b0yyzgm.mongodb.net/${database}?retryWrites=true&w=majority`)



/*IMPORT DeptFinancials MODEL*/
//Call the model to be used in the server
//This model will be return by server
const DeptFinancialsModel = require('./models/DeptFinancials');

//get(where will happen , what will happen)
//res: what will return from the server
app.get("/deptFinancial", async (req, res) => {
    //will take the info from the db
    const DeptFinancials = await DeptFinancialsModel.find();

    //present it in the browser
    res.json(DeptFinancials);
})

//Creat Propsal 
app.post("/creatProposal", async (req, res) => {
    //will take the info from the db
    const newprposal = new DeptFinancialsModel(req.body);
    await newprposal.save();

    res.json(req.body);
})

app.delete("/deleteProposal/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const deletedProposal = await DeptFinancialsModel.findByIdAndDelete(id);
      if (!deletedProposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      res.json({ message: "Deleted successfully", deletedProposal });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/updateProposal/:id", async (req, res) => {
    try {
      const id = req.params.id; 
      const { Project, Proposal, Quotations, SignOff, Quoted, 
        Invoiced, TimeProposal, TimeActual, Status } = req.body;
        
      const updatedProposal = await DeptFinancialsModel.findByIdAndUpdate(
        id, 
        { 
          Project, 
          Proposal,
          Quotations,
          SignOff,  
          Quoted,
          Invoiced,
          TimeProposal,
          TimeActual,
          Status 
        },
        { new: true } 
      );
      
      res.json(updatedProposal);
      
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  });

// First Function Listen(port , what i should do when i listen from that port)
app.listen(_port, () => {
    console.log("Server Works!!");
});