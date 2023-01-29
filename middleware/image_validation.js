module.exports = function(req, res, next){
        if(!(req.files.image.mimetype == 'image/png' || req.files.image.mimetype == 'image/apng' || req.files.image.mimetype == 'image/avif' || req.files.image.mimetype == 'image/gif' || req.files.image.mimetype == 'image/jpeg' || req.files.image.mimetype == 'image/svg+xml' || req.files.image.mimetype == 'image/webp' || req.files.image.mimetype == 'image/jpg')){
            res.render('elon_berish', {
                title: "E'lon berish",
                msg: "Please choose correct image format!!!"
            })
        }
        if(req.files.image.size > 5*1024*1024){
            res.render('elon_berish', {
                title: "E'lon berish",
                msg: "Image size must be less then 5Mb !!!"
            })
        }
    next()
}