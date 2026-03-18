const API="http://localhost:3000"

function showMessage(text,type){

const msg=document.getElementById("msg")

if(!msg) return

msg.innerHTML=text
msg.className="msg "+type
msg.style.display="block"

}


/* SIGNUP */

async function signup(){

const res=await fetch(API+"/signup",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({

name:document.getElementById("name").value,
register_number:document.getElementById("register").value,
email:document.getElementById("email").value,
phone:document.getElementById("phone").value,
role:document.getElementById("role").value,
department_id:document.getElementById("department").value,
password:document.getElementById("password").value

})

})

const text=await res.text()

showMessage(text,"success")

setTimeout(()=>{

window.location="login.html"

},1500)

}



/* LOGIN */

async function login(){

const role=document.getElementById("role").value

const res=await fetch(API+"/login",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({

login_id:document.getElementById("login_id").value,
password:document.getElementById("password").value,
role:role

})

})

if(res.status===401){

showMessage("Invalid Login","error")
return

}

const data=await res.json()

showMessage("Login Successful","success")

setTimeout(()=>{

if(role==="Admin"){
window.location="admin.html"
}else{
localStorage.setItem("user_id",data.user_id)
window.location="dashboard.html"
}

},1000)

}



/* SUBMIT COMPLAINT */

async function submitComplaint(){

const res=await fetch(API+"/add-complaint",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({

user_id:localStorage.getItem("user_id"),
title:document.getElementById("title").value,
description:document.getElementById("description").value,
location:document.getElementById("location").value,
priority:document.getElementById("priority").value

})

})

const data=await res.json()

showMessage(
"Complaint Submitted Successfully<br>Complaint ID: "+data.complaint_code,
"success"
)

}



/* LOAD MY COMPLAINTS */

if(document.getElementById("table")){

loadComplaints()

}

async function loadComplaints(){

const id=localStorage.getItem("user_id")

const res=await fetch(API+"/my-complaints/"+id)

const data=await res.json()

let rows=""

data.forEach(c=>{

rows+=`
<tr>
<td>${c.complaint_code}</td>
<td>${c.title}</td>
<td>
<span class="status-badge ${c.status.toLowerCase()}">
${c.status}
</span>
</td>
<td>${c.priority}</td>
</tr>
`

})

document.getElementById("table").innerHTML=rows

}



/* ADMIN PANEL */

if(document.getElementById("adminTable")){

loadAdmin()

}

async function loadAdmin(){

const res=await fetch(API+"/all-complaints")

const data=await res.json()

let rows=""

data.forEach(c=>{

rows+=`
<tr>
<td>${c.complaint_code}</td>
<td>${c.name}</td>
<td>${c.title}</td>
<td>
<span class="status-badge ${c.status.toLowerCase()}">
${c.status}
</span>
</td>
<td>
<select onchange="updateStatus(${c.complaint_id},this.value)">
<option ${c.status==="Pending"?"selected":""}>Pending</option>
<option ${c.status==="Assigned"?"selected":""}>Assigned</option>
<option ${c.status==="Resolved"?"selected":""}>Resolved</option>
</select>
</td>
</tr>
`

})

adminTable.innerHTML=rows

}



async function updateStatus(id,status){

await fetch(API+"/update-status",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({

complaint_id:id,
status:status

})

})

showMessage("Status Updated Successfully","success")

}