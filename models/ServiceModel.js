const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Services = new Schema({
    serviceName: {
        type: String,
        required: true

    },
    plans: [

        {
            type: {
                type: String,
                required: true
            }
            , price: {
                type: String,
                required: true
            }, duration: {
                type: String,
                required: true
            },

            description: {
                type: String,
                required: true
            }

        }
    ]
})




// Services.pre('save', async function (next) {


//     return next();


// });




const Service = mongoose.model('Service', Services);

module.exports = Service;
