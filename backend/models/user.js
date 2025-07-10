const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

require("dotenv").config();

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
})


//* Post Middleware
userSchema.post("save", async function(doc){
    try {
        
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        })

        let info  = await transporter.sendMail({
            from:`Khushal at EasySign`,
            to:doc.email,
            subject:`Your EasySign login (and more)`,
            html:`<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; background-color: #ffffff; margin: auto; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">Hey ${doc.name}! 👋</h2>
          <p>As the founder, I wanted to personally say hello and welcome you. By using <strong>SignWell</strong>, you’ll be able to get your documents signed <strong>40% to 60% faster</strong> than email or paper.</p>
          
          <p>You can always log in to your account here:</p>
          <p><a href="https://www.easysign.com/sign_in/" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Log In to EasySign</a></p>

          <h3>Here are a few other things you might find helpful:</h3>
          <ul>
            <li>You can use SignWell for contracts, proposals, HR documents, and most other documents.</li>
            <li>You can fill out your own PDFs and documents (even if you’re the only person completing the document).</li>
            <li>I’d love to hear from you, so feel free to reply to this email with any suggestions or feature requests :)</li>
          </ul>

          <p>— Khushal<br>
          Founder, EasySign</p>
        </div>
      </div>
    `
        })

    } catch (error) {
        console.log(error);
    }
}) 


const User = new mongoose.model("User",userSchema);
module.exports = User;