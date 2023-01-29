const {read_file, write_file} = require('../fs/fs_api');
const {uuid} = require('uuidv4');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const Controller = {
    OPEN_LOGIN: (req, res)=>{
        res.render('login', {
            title: 'Login page'
        })
    },
    OPEN_ELON_BERISH: (req, res) => {
        res.render('elon_berish', {
            title: "E'lon berish"
        })
    }, 
    SENT_ELON: async(req, res) =>{
        var image = req.files.image.data;

        let time = new Date()
        let fileName = Date.now()+req.body.fullname.split(' ')[0];
        let ext = (req.files.image.name).split('.').at(-1)
        fs.writeFile(`uploads/${fileName}.${ext}`, image, function(err){
            if (err) throw err;
        });
       
        let elon = req.body
        let elonlar = read_file('elonlar.json');
        let yunalishlar = ["Information Technologies", "Grafik Dizayn", "SMM"]
        let sub_yunalishlar = [["Node.js", "Python", "Flutter", "Java"], ["Grafik pro", "Adobe illustrator", "Photoshop"], ["SMM","Marketing"]]
        yunalish = yunalishlar[elon.yunalish]
        ichki_yunalish = sub_yunalishlar[elon.yunalish][elon.ichki_yunalish[elon.yunalish]]
        elonlar.push({
            id: uuid(),
            date: elon.date,
            time: elon.time,
            yunalish: yunalish,
            ichki_yunalish: ichki_yunalish,
            format: elon.optradio,
            fullname: elon.fullname,
            phone: elon.phone,
            image: fileName+'.'+ext,
            status: "kutilmoqda"
        })
        await write_file('elonlar.json', elonlar);
        res.redirect('/elonlar')
    },
    ELONLAR: (req, res) => {
        let today = Date.now()
        
        let elonlar = read_file('elonlar.json').filter(elon => elon.status == 'tasdiqlangan')
        elonlar=elonlar.filter(elon => {
            let date_ = elon.date +" "+elon.time;
            let date =  new Date(date_);
            
            if(date.getTime()>today){
                return elon;
            }
        })
        res.render('elonlar', {
            title: "E'lonlar",
            elonlar
        })
    },
    LOGIN_ADMIN: async(req, res) => {
        let admin = req.body;
        let users = read_file('users.json');
        let foundUser = users.find(u => {
            if(u.login == admin.login && u.password == admin.password){
                return u;
            }
        })
        if(foundUser){
            req.session.isAuthenticated = true
            let token =  jwt.sign({id: foundUser.id, adminName: foundUser.adminName}, process.env.SECRET_KEY, {
                expiresIn: "30m"
            })
            req.session.token = token;
            res.redirect('/admin_panel');
        }
        else{
            res.redirect('/elonlar');
        }
    },
    LOGOUT: (req,res)=>{
        req.session.destroy(()=>{
            res.redirect('/elonlar')
        })
    },
    LOAD_ADMIN_PANEL: (req, res)=> {
        let elonlar = read_file('elonlar.json').filter(elon => elon.status == "kutilmoqda");
        res.render('admin_panel', {
            isAdminPanel: true,
            elonlar,
            kutilmoqda: true
        })
    },
    TASDIQLASH: async(req, res) => {
        let id = req.params.id;
        let elonlar = read_file('elonlar.json')
        elonlar.forEach(elon => {
            if(elon.id == id){
                elon.status = "tasdiqlangan"
            }
        });
        await write_file('elonlar.json', elonlar);
        res.redirect('/admin_panel')
    },
    BEKOR_QILISH: async(req, res) => {
        let id = req.params.id;
        let elonlar = read_file('elonlar.json')
        elonlar.forEach(elon => {
            if(elon.id == id){
                elon.status = "rad etilgan"
            }
        });
        await write_file('elonlar.json', elonlar);
        res.redirect('/admin_panel')
    },
    LOAD_ADMIN_PANEL_QABUL: (req, res)=> {
        let elonlar = read_file('elonlar.json').filter(elon => elon.status == "tasdiqlangan");
        res.render('admin_panel', {
            isAdminPanel: true,
            elonlar,
            qabul: true
        })
    },
    LOAD_ADMIN_PANEL_RAD: (req, res)=> {
        let elonlar = read_file('elonlar.json').filter(elon => elon.status == "rad etilgan");
        res.render('admin_panel', {
            isAdminPanel: true,
            elonlar,
            rad: true
        })
    },
    FILTER_ELONLAR: (req, res) =>{
        let {date, format, fullname, yunalish} = req.body;
        let elonlar=read_file('elonlar.json').filter(elon => elon.status == 'tasdiqlangan');
        if(date != ""){
            elonlar = elonlar.filter(elon => elon.date == date);
        }
        if(format){
            elonlar = elonlar.filter(elon => elon.format == format);
        }
        if(yunalish){
            elonlar = elonlar.filter(elon => elon.yunalish == yunalish);
        }
        if(fullname != ""){
            elonlar = elonlar.filter(elon => {
                if(elon.fullname.toLowerCase().includes(fullname.toLowerCase())){
                    return elon
                }
            });
        }
        res.render('elonlar', {
            title: "E'lonlar",
            elonlar
        })

    }
}

module.exports = Controller;