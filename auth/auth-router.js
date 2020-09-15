const router = require('express').Router();
const database_access = require("../database/dbConfig")
const secure = require("bcryptjs")
const jwt = require("jsonwebtoken")


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
    .first()
}

// * sign up users by entering creds in the database
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await database_access__findByFilter({ username })

    if(user) {
      return res.status(409).json({
        message: "user already exists"
      })
    }
    

    const newUser = await database_access__add({
      username: username,
      password: await secure.hash(password, 10)
    })

    res.status(201).json(newUser)
  } catch(error) {
    next(error) 
  }
});

// router.post('/login', async (req, res, next) => {
//   try {
//     const {username, password} = req.body
//     const user = await database_access__findByFilter({ username })

//     if(!user) {
//       return res.status(401).json({
//         message: "user credentials are invalid"
//       })
//     }

//     const passwordValid = await secure.compare(req.body.password, user.password)

//     if(!passwordValid) {
//       return res.status(401).json({
//         message: "invalid credentials"
//       })
//     }

//     const token = generateToken(user)

//     function generateToken (user) {
//       const payload =  {
//         subject: user.id,
//         username: user.username
//       }
//     }

//     // res.status(200).json({
//     //   message: `welcome, ${user.username}`
//     // })

//     return jwt.sign(payload, process.env.JWT_VERIFY)

//   } catch(error) { 
//     next(error) 
//   }
// });


router.post('/login', (req, res) => {
    const {username, password} = req.body

    database_access__findByFilter({ username })
      .then((user) => {
        if (user && secure.compareSync(password, user.password)) {
          const token = generateToken(user)

          res.status(200).json({
            message: `welcome, ${user.username}`,
            token: token
          })
        } else {
          res.status(401).json({
            message: 'invalid credentials'
          })
        }
      })
      .catch((error) => {
        res.status(500).json(error)
      })
});




module.exports = router;
