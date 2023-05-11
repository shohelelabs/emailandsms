const util = require('util');
const multer = require('multer');
const addrs = require("email-addresses");
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

module.exports = async (req, res) => { 
    const client = twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);
    await util.promisify(multer().any())(req, res);

    const from = req.body.from;
    //const toNumbers = Array.from(req.body.to);
    const toNumberobj = req.body.to;
    const toNumbers = addrs.parseAddressList(toNumberobj); 
    //const toNumbers = ["4915155067743","01785221533"];
    const subject = req.body.subject;
    const body = req.body.text;
    
    //Using email-addresses library to extract email details.
    console.log({toNumberobj});
    console.log({toNumbers});
     
    const numberAddresses = toNumber.map( (item) => item.address);
    console.log(numberAddresses);
   //Start mobile number Iteration
    numberAddresses.forEach((toNumber) => {  
   
    const toAddress = addrs.parseOneAddress(result);
    const toName = toAddress.local;
    const fromAddress = addrs.parseOneAddress(from);
    const fromName = fromAddress.local;
    
        console.log({toName});
    
    
    //Sending SMS with Twilio Client
    client.messages.create({
        to: `+${toName}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: `Message from:${fromName}\n${body}`
    }).then(msg => {
        console.log(msg)
        res.status(200).send(msg.sid);
    }).catch(err => {
        console.log(err);
        //If we get an error when sending the SMS email the error message back to the sender
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        // Create Email
        const email = {
            to: fromAddress.address,
            from: toAddress.address,
            subject: `Error Sending SMS to ${toAddress.local}`,
            text: `${err}\n For email from ${fromAddress.address}`,
        };
        //Send Email
        sgResp = sgMail.send(email)
            .then(response => {
                res.status(200).send("Sent Error Email");
            })
            .catch(error => {
                res.status(500);
            });
    });
    
  });//End of mobile number iteration
    
};
