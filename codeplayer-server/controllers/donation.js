const { check, validationResult } = require("express-validator");
const { ers } = require("./error");
const Razorpay = require("razorpay");
const crypto = require("crypto");

exports.order = (req, res) => {
	const error = validationResult(req);
    if (!error.isEmpty()) {
        return ers(res, 422, error.array()[0].msg);
    }

    const instance = new Razorpay({
    	key_id: process.env.RAZORPAY_API_ID,
  		key_secret: process.env.RAZORPAY_API_SECRET
    })

    const options = {
    	"amount": req.body.amount * 100,
		"currency": "INR",
	    "receipt": "Coffee for CodePlayer"
    }

    instance.orders.create(options, (err, order) => {
        console.log(order);
    	if(err) {
    		return ers(res, 400, "Something went wrong, Please retry")
    	}
    	return res.json({order_id: order.id});
    })


}

exports.verify = (req, res) => {
    console.log(req.body)
    if(!req.body.response || req.body.response == undefined) {
        return res.json({success: false});
    }

    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body.response;

    const genSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
    
    if(genSignature == razorpay_signature) {
        return res.json({success: true});
    } else {
        return res.json({success: false});
    }


}