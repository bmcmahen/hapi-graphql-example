import mongoose from 'mongoose'

const HumanSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  }
})

HumanSchema.post('save', function (doc) {
  console.log('Human saved %o', doc)
})


const Human = mongoose.model('Human', HumanSchema)

/**
 * Insert a default user for us to manipulate
*/

async function insertDefaultUser() {

  var users = await Human.find({})

  if (users.length) {
    console.log('found default user %o', users[0])
    return
  }


  var user = new Human({ name: 'Ben' })
  try {
    await user.save()
  } catch(err) {
    console.error('Error saving default user', err)
  }

}

insertDefaultUser()

export default Human
