const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "/public/images" });
//makes index the home page

mongoose
    .connect("mongodb+srv://dillionnorris:dillydilly@mongoprod.1ghn74n.mongodb.net/?retryWrites=true&w=majority")
    .then(()=> {console.log("Connected to MongoDB..")})
    .catch ((error)=>console.log("Cannot connect to MongoDB..", error));

const teamSchema = new mongoose.Schema({
    //_id:mongoose.SchemaTypes.ObjectId,
    name: String,
    qb: String,
    rb: String,
    wr1: String,
    wr2: String,
    wr3: String,
});

const Team  = mongoose.model('Team', teamSchema);


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


// makes sure team has nessisarry requirements 
const validateTeam = (team) => {
    
  const schema = Joi.object({
    _id: Joi.allow(""),
    name: Joi.string().required(),
    qb: Joi.string().required(),
    rb: Joi.string().required(),
    wr1: Joi.string().required(),
    wr2: Joi.string().required(),
    wr3: Joi.string().required(),
  });
  return schema.validate(team);
};

// able to accsess the api via the browser
app.get("/api/teams", (req, res) => {
  getTeams(res);

});


const getTeams = async (res) => {
    const teams = await Team.find();
    res.send(teams);
}

app.post("/api/teams", upload.single("img"),(req, res) => {
  const result = validateTeam(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  const team = new Team({
    //_id: teams.length + 1,
    name: req.body.name,
    qb: req.body.qb,
    rb: req.body.rb,
    wr1: req.body.wr1,
    wr2: req.body.wr2,
    wr3: req.body.wr3,
  });

  if (req.file){
    team.img = "images/"+req.file.filename;
  }

  createTeam(res,team);
});

const createTeam = async(res, team) => {
    const result = await team.save();
    res.send(team);
}
app.put("/api/teams/:id", upload.single("img"),(req, res) => {
   // const id = parseInt(req.params.id);
    //const team = teams.find((t) => t._id === id);;
    const result = validateTeam(req.body);

    if (result.error){
        res.status(400).send(result.error.details[0].message)
        return;
    }

   updateTeam(req,res);

});

const updateTeam = async(req, res) =>{
    let feildsToUpdate ={
      name: req.body.name,
      qb:req.body.qb,
      rb:req.body.rb,
      wr1:req.body.wr1,
      wr2:req.body.wr2,
      wr3:req.body.wr3,
    };

    if(req.file){
        feildsToUpdate.img = "images/"+ req.file.filename;
    }

    const result = await Team.updateOne({_id:req.params.id},feildsToUpdate);
    res.send(result);
};

app.delete("/api/teams/:id",(req,res) =>{

  removeTeam(res,req.params.id);

});
const removeTeam = async(res,id)=>{
  const team = await Team.findByIdAndDelete(id);
  res.send(team);
}

//sever start
app.listen(3000, () => {
  console.log("listening on port 3000...");
});
