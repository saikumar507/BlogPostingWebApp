// jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const https=require("https");
const { send } = require("process");
const mongoose = require("mongoose");


// var paraItems="Lacus vel facilisis volutpat est velit egest pellentesque adipiscing.";
// var titleItems="Home" ;
// items.push({heading:titleItems,value:paraItems});

//USING MODULES
const app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true})) ;
app.use(express.static("public")) ;
mongoose.connect("mongodb+srv://admin-ruthwik:Ruthwik2001@cluster0.azmtf.mongodb.net/blogDB?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true});
console.log("successfully connected to mongoose");

//schemas
const itemSchema=new mongoose.Schema({
    heading:String,
    value:String
})
const Item=mongoose.model("Item",itemSchema);
const item1=new Item({
    heading:"Day 1",
    value:"This is the first day of my trip."
});

//ALL GET REQUESTS
app.get("/",(req,res)=>{
    Item.find({},(err,foundItems)=>{
        if(!err)
        {
            if(foundItems.length==0)
            {
                item1.save();
                res.redirect("/");
            }
            else
            {
                res.render("home",{items:foundItems});
            }
       }
    })
})
app.get("/about",(req,res)=>{
    res.render("about");
})
app.get("/contact",(req,res)=>{
    res.render("contact") ;
})
app.get("/compose",(req,res)=>{
    res.render("compose") ;
})
app.get("/posts/:task",(req,res)=>{
    Item.findOne({heading:req.params.task},(err,foundItems)=>{
       if(!err) res.render("posts",{item:foundItems});
    })
})
//ALL POST REQUESTS
app.post("/",(req,res)=>{
    var tempItem=new Item({
        heading:req.body.title,
        value:req.body.para 
    })
    tempItem.save();
    res.redirect("/") ;
})
app.post("/delete",(req,res)=>{
    var deleteId=req.body.button;
    // console.log(deleteId);
    Item.findByIdAndRemove(deleteId,(err)=>{
        if(err) console.log(err);
        // console.log(deleteId);
    })
    res.redirect("/");
})



//listen
let port=process.env.PORT;
if(port == null || port=="")
{
    port=3000;
}
app.listen(port,()=>{
    console.log("server has started successfully");
})