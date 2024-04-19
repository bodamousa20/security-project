const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bycrpt = require ('bcrypt')
 
const userschema  = new mongoose.Schema({

email : {
  type :String,
  require : [true,'please Enter an Email'] ,
  unique : true,
  lowercase : true ,
  validate :[isEmail,'Please Enter Vaild Email']
},
password : {
    type : String ,
    require :  [true,'please Enter an Password'] ,
    minlength :  [6,'Minimum Password Length is 6 charcter']
    
}
})

//fire a function before Saved to db
userschema.pre('save', async function(next){
    const salt = await bycrpt.genSalt();
    this.password = await bycrpt.hash(this.password,salt);
    next();
})

userschema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
      const auth = await bycrpt.compare(password, user.password);
      if (auth) {
          return user;
      }
      throw new Error('Incorrect password');
  }
  throw new Error('Incorrect email');
};


const user = mongoose.model('user',userschema) ; // => created model called user
module.exports = user ;