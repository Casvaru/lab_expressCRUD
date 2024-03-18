import express from "express";
import fs from "fs"
import bodyParser from "body-parser"
import path from "path";

const __dirname = path.resolve(path.dirname(''))

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
const port = 3000

const readData = ()=>{
  try {
    const data = fs.readFileSync("./db.json")
    return(JSON.parse(data))
  }
  catch(error){
    console.log(error)
  }
}
readData()

const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data))
  }
  catch(error){
    console.log(error)
  }
}

app.get("/", (req,res) => {
  res.sendFile(path.join(__dirname, 'static/index.html'))
})
app.get("/users", (req,res)=>{
  const data = readData()
  res.json(data.users)
})
app.get("/users/:cedula", (req,res) =>  {
  const data = readData()
  const cedula = parseInt(req.params.cedula)
  const findUsers = data.users.find((users)=> users.cedula === cedula)
  res.json(findUsers)
})
app.post("/users",(req,res) => {
  const data = readData()
  const body = req.body
  body.cedula = parseInt(body.cedula)
  const newUser = {
    id: data.users.length + 1,
    ...body,
  }
  data.users.push(newUser)
  writeData(data)
  res.json(newUser)
})
app.put("/users/:id", (req,res)=>{
  const data = readData()
  const body = req.body
  const id = parseInt(req.params.id)

  const userIndex = data.users.findIndex((users)=> users.id === id)
  data.users[userIndex] = {
    ...data.users[userIndex],
    ...body,
  }
  writeData(data)
  res.json({message: "Usuario actualizado"})
})
app.delete("/users/:id", (req,res)=>{
  const data = readData()
  const id = parseInt(req.params.id)
  const userIndex = data.users.findIndex((users)=> users.id === id)

  data.users.splice(userIndex,1)
  writeData(data)
  res.json({message: "Usuario eliminado"})
})


app.listen(port, ()=>{
  console.log(`Escuchando en el puerto: localhost:${port}`)
})