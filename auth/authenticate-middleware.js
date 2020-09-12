const jwt = require("jsonwebtoken")

function restrict () {
  return async (req, res, next) => {
    const authError = {
      message: "invalid credentials"
    }

    try {

      const token = req.header.authorization
      if (!token) {
        return res.status(401).json(authError)
      }

      jwt.verify(token, process.env.JWT_VERIFY, (error, decoded) => {
        if(error) {
          return res.status(401).json(authError)
        }
        
        req.token = decoded

        next()
      })

    } catch(error) { 
      next(error)
    }
  }
}


module.exports = {
  restrict
}
