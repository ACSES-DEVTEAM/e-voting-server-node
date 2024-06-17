const jwt = require('jsonwebtoken')
const Admin = require('../models/admin.model')

const Authenticate = async (req, res, next) => {
  // verify admin is authenticated
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({error: 'Authorization token required'})
  }

  const token = authorization.split(' ')[1]

  try {
    const { _id } = jwt.verify(token, process.env.SECRET)

    req.admin = await Admin.findOne({ _id }).select('_id')
    next()

  } catch (error) {
    //console.log(error)
    console.log('Request is not authorized')
    res.status(401).json({error: 'Request is not authorized'})
  }
}

module.exports = Authenticate