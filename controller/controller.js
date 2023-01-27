const {read_file, write_file} = require('../fs/fs_api');
const {uuid} = require('uuidv4');
const fs = require('fs');


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

        console.log(req.files.image.data);
        var image = req.files.image.data;
        let time = new Date()

        let fileName = (time.getMinutes()+time.getSeconds()+req.body.fullname).trim();
        let ext = (req.files.image.name).split('.').at(-1)
        fs.writeFile(`uploads/${fileName}.${ext}`, image, function(err){
            if (err) throw err;
        });
       
        let elon = req.body
        let elonlar = read_file('elonlar.json');
        let yunalishlar = ["Information Technologies", "Grafik Dizayn", "SMM"]
        let sub_yunalishlar = [["Node.js", "Python", "Flutter"], ["Grafik pro", "Adobe illustrator", "Photoshop"], ["SMM","Marketing"]]
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
        let elonlar = read_file('elonlar.json').filter(elon => elon.status == 'tasdiqlangan');
        res.render('elonlar', {
            title: "E'lonlar",
            elonlar
        })
    },
    LOGIN_ADMIN: (req, res) => {
        let admin = req.body;
        let users = read_file('users.json');
        let foundUser = users.find(u => {
            if(u.login == admin.login && u.password == admin.password){
                return u;
            }
        })
        if(foundUser){
            req.session.isAuthenticated = true
            req.session.logedUser = foundUser;
            res.redirect('/admin_panel');
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
            elonlar
        })
    }
}

module.exports = Controller;