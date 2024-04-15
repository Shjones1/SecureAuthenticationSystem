const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())


//in a real application you would use a database instead to store users
const users = []

//in a real case you would not want to have a route that exposes password info. But is used for testing
app.get('/users', (req, res) => {
    res.json(users)
})

//Create users with a post request
app.post('/users', async (req, res) => {
    
    try {
        const salt = await bcrypt.genSalt() //create a salt using bcrypt default is 10
        const hashedPassword = await bcrypt.hash(req.body.password, salt) //returns a hashed passworde  example: asdafsdfadsfasdf 
        //but with 'salt' produces a different hashed password every time
        console.log("Salt" + salt)
        console.log("Hashed Password: " + hashedPassword);
        //bcrypt automatically saves salt with the hashed password
        const user = {name: req.body.name, password: hashedPassword}
        //Push user into the array
        users.push(user)
        res.status(201).send()

    }

    catch {
        res.status(500).send()
    }

    //The below code can't be used as it doesn't hash the password leaving it open for anyone who can access the database
   
    // const user = {name: req.body.name, password: req.body.password}
    
})

// Login

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name = req.body.name)
    if(user == null){
        return res.status(400).send("Cannot find user")
    }

    try {
        //bcrypt compare protects against timing attacks
       if( await bcrypt.compare(req.body.password, user.password) ){
        res.send('Success')
       } else {
        res.send('Not Allowed')
       }
    }
    catch {
        res.status(500).send()
    }
})

app.listen(3000)

