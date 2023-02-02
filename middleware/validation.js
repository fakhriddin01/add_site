const Joi = require('joi');

const validate = (req, res, next) => {
    let {error} = validationForm(req.body);
    if(error){
        return res.status(400).json({msg: error.details[0].message});
    }

    next();
}




function validationForm(data){
    const scheme = Joi.object({
        date: Joi.string().required(),
        time: Joi.string().pattern(new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')).required(),
        phone: Joi.string().pattern(new RegExp('^[+]998[389][012345789][0-9]{7}$')).required(),
        yunalish: Joi.required(),
        ichki_yunalish: Joi.required(),
        optradio: Joi.string().allow(null).allow('').optional(),
        fullname: Joi.string().min(4).max(20).required(),
        image: Joi.string().allow(null).allow('').optional(),
        link: Joi.optional()
    }) 

    return scheme.validate(data)
}

module.exports = {
    validate
}