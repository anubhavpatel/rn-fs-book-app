import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true,
        unique: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
  
     password:{
        type: String,
        require: true,
        minlengh: 6
    },
     profileImage:{
        type: String,
        default: ""
    }
}, {timestamps: true}
);

// hash pass
userSchema.pre("save", async function (next) {
if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password=  await bcrypt.hash(this.password,salt)
    next()
 
})

// compare password function
userSchema.methods.comparePassword = async function (userPassword) {
    return  await bcrypt.compare(userPassword,this.password);
}

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;