const cors = require('cors');
const express = require('express')
const app = express();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
app.use(cors());
app.use(express.json())
const User = require('./models/user.model')
const bcrypt = require('bcryptjs')

mongoose.set('strictQuery',false);
mongoose.connect('mongodb://localhost:27017/full-mern-test')


app.post('/api/register', async (req,res)=>{
    console.log(req.body)
    try{
            const newPassword = await bcrypt.hash(req.body.password, 10)
            await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
        })
        res.json({status:'ok'})
    }catch(e){
        res.json({status:'error',error: 'Duplicate Email'+ e})
    }})

    app.post('/api/login', async (req,res)=>{
        const user= await User.findOne({
            email: req.body.email,
        });
            
        if(!user){ return { status: 'error', error:'Invalid Login'} }
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password)

if(isPasswordValid){

    const token = jwt.
    sign({
        name: user.name,
        email: req.body.email
    },"secret123")

return res.json({ status:'ok', user:token})
    }else{
return res.json({ status: 'error', user:false})
    }
    }
)

app.get('/api/quote', async (req,res)=>{
    const token = req.header['x-access-token'];
    try{
    const decoded = jwt.verify(token,'secret123')
    const email = decoded.email
    const user = await User.findOne({email:email})
        return res.json({ status: 'ok', quote:user.quote})
    }
    catch(error){
    console.log(error)
    res.json({ status:'error', error:'invalid token'})
    }
})

app.post('/api/quote', async (req,res)=>{
    const token = req.header['x-access-token'];
    try{
    const decoded = jwt.verify(token,'secret123')
    const email = decoded.email
    await User.updateOne(
        {email:email}, 
        {$set:{quote: req.body.quote}})
        return res.json({ status: 'ok'})
    }
    catch(error){
    console.log(error)
    res.json({ status:'error', error:'invalid token'})
    }
})




app.listen(1337, () => {
    console.log('Server started at 1337')
})