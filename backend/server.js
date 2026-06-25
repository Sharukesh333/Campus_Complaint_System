const express=require("express")
const cors=require("cors")
const bodyParser=require("body-parser")
const db=require("./db")

const app=express()

app.use(cors())
app.use(bodyParser.json())

/* SIGNUP */

app.post("/signup",(req,res)=>{

const {name,email,phone,role,department_id,password,register_number}=req.body

const sql=`
INSERT INTO users
(name,email,phone,role,department_id,password,register_number)
VALUES(?,?,?,?,?,?,?)`

db.query(sql,[name,email,phone,role,department_id,password,register_number],(err,result)=>{

if(err){
console.log(err)
return res.status(500).send("Signup Failed")
}

res.send("Signup Successful")

})

})



/* LOGIN */

app.post("/login",(req,res)=>{

const {login_id,password,role}=req.body


if(role==="Admin"){

const sql="SELECT * FROM admins WHERE email=? AND password=?"

db.query(sql,[login_id,password],(err,result)=>{

if(err) return res.status(500).send("Server Error")

if(result.length===0){
return res.status(401).send("Invalid Login")
}

res.json(result[0])

})

}

else{

const sql=`
SELECT * FROM users 
WHERE (register_number=? OR email=?)
AND password=?`

db.query(sql,[login_id,login_id,password],(err,result)=>{

if(err) return res.status(500).send("Server Error")

if(result.length===0){
return res.status(401).send("Invalid Login")
}

res.json(result[0])

})

}

})



/* ADD COMPLAINT */

app.post("/add-complaint",(req,res)=>{

const {user_id,title,description,location,priority}=req.body

const complaint_code="CMP"+Date.now()

const sql=`
INSERT INTO complaints
(complaint_code,user_id,title,description,location,priority)
VALUES(?,?,?,?,?,?)`

db.query(sql,[complaint_code,user_id,title,description,location,priority],(err,result)=>{

if(err){
console.log(err)
return res.status(500).send("Complaint Failed")
}

res.json({
message:"Complaint Submitted",
complaint_code:complaint_code
})

})

})



/* VIEW MY COMPLAINTS */

app.get("/my-complaints/:id",(req,res)=>{

const sql="SELECT * FROM complaints WHERE user_id=?"

db.query(sql,[req.params.id],(err,result)=>{

if(err) return res.status(500).send("Database Error")

res.json(result)

})

})



/* ADMIN VIEW */

app.get("/all-complaints",(req,res)=>{

const sql=`
SELECT c.*,u.name
FROM complaints c
JOIN users u ON c.user_id=u.user_id
`

db.query(sql,(err,result)=>{

if(err) return res.status(500).send("Database Error")

res.json(result)

})

})



/* UPDATE STATUS */

app.post("/update-status",(req,res)=>{

const {complaint_id,status}=req.body

const sql="UPDATE complaints SET status=? WHERE complaint_id=?"

db.query(sql,[status,complaint_id],(err,result)=>{

if(err) return res.status(500).send("Update Failed")

res.send("Status Updated")

})

})



app.listen(3000,()=>{

console.log("Campus Complaint API Running")

})