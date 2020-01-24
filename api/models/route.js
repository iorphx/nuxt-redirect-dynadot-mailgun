import mongoose from 'mongoose'

const RouteSchema = new mongoose.Schema({
  from: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  to: {
    type: String,
    required: true
  }
},
{
  versionKey: false
})

const Route = mongoose.model('routes', RouteSchema, 'routes')
export { Route }