const express=require('express')
const cors=require('cors')
const studentAppRoutes=require('./app/routes/studentApp.routes')


const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors())
app.use('/api/student',studentAppRoutes)






app.listen(8080,()=>{
    console.log("Server running on port 8080.")
})