import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pinCode: { type: String, required: true },
    addressType: {
        type: String,
        enum: ["Home", "Work", "Other"],
        default: "Home"
    }
}, { _id: true });

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: false },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        }
    },
    fullname: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    dob: { type: Date },
    role: {
        type: String,
        enum: [ "buyer", "seller" ],
        default: "buyer"
    },
    googleId: {
        type: String,
    },
    addresses: [addressSchema]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.virtual('age').get(function () {
    if (!this.dob) return null;
    const diff = Date.now() - this.dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
});

userSchema.pre("save", function () {
    if ((!this.firstName || !this.lastName) && this.fullname) {
        const parts = this.fullname.trim().split(" ");
        this.firstName = this.firstName || parts[0];
        this.lastName = this.lastName || parts.slice(1).join(" ") || this.lastName;
    }
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model('user', userSchema);

export default userModel;