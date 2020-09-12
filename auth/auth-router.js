const router = require('express').Router();
const database_access = require("../database/dbConfig")
const secure = require("bcryptjs")


// * adding users to the database
const database_access__add = async (user) => {
  const [id] = await database_access("users")
    .insert(user)
  return database_access__findById(id)
}


// * finding users in DB with ID
const database_access__findById = (id) => {
  return database_access("users")
    .select("id", "username", "password")
    .where({ id })
    .first()
}


// * finding users in teh database w/ filter param 
const database_access__findByFilter = (filter) => {
  return database_access("users")
    .select("id", "username", "password")
    .where(filter)
}

// * sign up users by entering creds in the database
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await database_access__findByFilter({ username })


    // * attempted to implement this check but returns a false positive 
    // * limiting the functionality 
    // * validation of existent user already exists in the table requirements 
    // * don't know what else to do. Encoutnered server errors trying to debug
    // * had to change port ###s? no idea why. 
    // if(user) {
    //   return res.status(409).json({
    //     message: "user already exists"
    //   })
    // }
    

    const newUser = await database_access__add({
      username: username,
      password: await secure.hash(password, 10)
    })

    res.status(201).json(newUser)
  } catch(error) {
    next(error) 
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const {username, password} = req.body
    const user = await database_access__findByFilter({ username })

    if(!user) {
      return res.status(401).json({
        message: "user credentials are invalid"
      })
    }

    const passwordValid = await secure.compare(req.body.password, user.password)

    if(!passwordValid) {
      return res.status(401).json({
        message: "invalid credentials"
      })
    }

    req.session.user = user

    res.json({
      message: `welcome, ${user.username}`
    })

  } catch(error) { 
    next(error) 
  }
});

module.exports = router;
