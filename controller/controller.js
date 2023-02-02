const {read_file, write_file} = require('../fs/fs_api');
const {uuid} = require('uuidv4');
const fs = require('fs');
const jwt = require('jsonwebtoken');
let IT = ["Node.js", "Python", "Flutter", "Java"]
let GD = ["Grafik pro", "Adobe illustrator", "Photoshop"]
let SMM = ["SMM","Marketing"]


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

        let times = new Date()
        let fileName = Date.now()+req.body.fullname.split(' ')[0];
        let ext = (req.files.image.name).split('.').at(-1)
        fs.writeFile(`uploads/${fileName}.${ext}`, image, function(err){
            if (err) throw err;
        });
       
        let elon = req.body

        let {date} = req.body

        let result = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(date);
        if(!result){
            return res.status(400).json({msg: "please input correct date as per format YYYY-MM-DD"});
        }
        
        let elonlar = read_file('elonlar.json');
        let yunalishlar = ["Information Technologies", "Grafik Dizayn", "SMM"]
        let sub_yunalishlar = [IT, GD, SMM]
        yunalish = yunalishlar[elon.yunalish]
        ichki_yunalish = sub_yunalishlar[elon.yunalish][elon.ichki_yunalish[elon.yunalish]]
        elonlar.push({
            id: uuid(),
            date: elon.date,
            time: elon.time,
            yunalish: yunalish,
            ichki_yunalish: ichki_yunalish,
            format: elon.optradio,
            link: elon.link,
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
        let isElon = true;
        let page_number;  
        if(!Object.values(req.query)[0]){
            page_number=1
        }else{
            page_number=Object.values(req.query)[0];
        }   
        let elonlar = read_file('elonlar.json').filter(elon => elon.status == 'tasdiqlangan')
        let authors = [];
        let yunalish = [];
        let ichki_yunalish = [];
        elonlar=elonlar.filter(elon => {
            let date_ = elon.date +" "+elon.time;
            let date =  new Date(date_);
            
            if(date.getTime()>today){
                return elon;
            }
        })

        elonlar.forEach(elon => {
            if(!authors.includes(elon.fullname)){
                authors.push(elon.fullname);
            }
            if(!yunalish.includes(elon.yunalish)){
                yunalish.push(elon.yunalish);
            }
            if(!ichki_yunalish.includes(elon.ichki_yunalish)){
                ichki_yunalish.push(elon.ichki_yunalish);
            }
        })
     

        
        elonlar.sort((a,b) => {
            let date_a = a.date +" "+a.time;
            let date_a_ms =  new Date(date_a);
            let date_b = b.date +" "+b.time;
            let date_b_ms =  new Date(date_b);
            return date_a_ms - date_b_ms
        })

        let page_size=4
        let pageCount = Math.ceil(elonlar.length/page_size);
        elonlar = paginate(elonlar, page_size, page_number);
        
        res.render('elonlar', {
            title: "E'lonlar",
            elonlar,
            authors,
            yunalish,
            IT,
            GD,
            SMM,
            pagination: {
                page: page_number,
                pageCount: pageCount
            },
            isElon
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
            res.render('login', {
                title: 'Login page',
                msg: "Wrong login or password!"
            })
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
        // let isFilter = true;
        // let page_number;  
        // if(!Object.values(req.query)[0]){
        //     page_number=1
        // }else{
        //     page_number=Object.values(req.query)[0];
        // }   

        let {date, format, fullname, yunalish, ichki_yunalish} = req.body;
        
        
        let elonlar=read_file('elonlar.json').filter(elon => elon.status == 'tasdiqlangan');

        let authors =[]
        elonlar.forEach(elon => {
            if(!authors.includes(elon.fullname)){
                authors.push(elon.fullname);
            }
        })
        
     
        if(date != ""){
            elonlar = elonlar.filter(elon => elon.date == date);
        }
        if(format){
            elonlar = elonlar.filter(elon => elon.format == format);
        }
        if(yunalish){
           elonlar = elonlar.filter(elon => {
            if(yunalish.includes(elon.yunalish)){
                return elon;
            }
           })
        }

        if(ichki_yunalish){
            elonlar = elonlar.filter(elon => {
                if(ichki_yunalish.includes(elon.ichki_yunalish)){
                    return elon;
                }
            })
        }

        if(fullname){
            elonlar = elonlar.filter(elon => {
                if(fullname.includes(elon.fullname)){
                    return elon;
                }
            })
        }
        // req.session.elonlar=elonlar;
        // console.log(res.session.elonlar);
        
        // let page_size=4
        
        // let pageCount = Math.ceil(elonlar.length/page_size);

        // elonlar = paginate(elonlar, page_size, page_number);

        res.render('elonlar', {
            title: "E'lonlar",
            elonlar,
            authors,
            IT,
            GD,
            SMM,
            // pagination: {
            //     page: page_number,
            //     pageCount: pageCount
            // },
            // isFilter
        })

    }
    // FILTER_ELONLAR_PAGE: (req, res) =>{
    //     let isFilter = true
    //     let page = req.path.slice(-1)
      
    //     console.log(page[0]);

    //     // let {date, format, fullname, yunalish, ichki_yunalish} = req.body;
        


    //     let elonlar_auth=read_file('elonlar.json').filter(elon => elon.status == 'tasdiqlangan');

    //     let authors =[]
    //     elonlar_auth.forEach(elon => {
    //         if(!authors.includes(elon.fullname)){
    //             authors.push(elon.fullname);
    //         }
    //     })
    //     // console.log(req.session.elonlar);
    //     let elonlar=[]
    //     if(req.session.elonlar){
    //         elonlar=req.session.elonlar;
    //     }
    //     let page_size=4
        
    //     let pageCount = Math.ceil(elonlar.length/page_size);
        
    //     elonlar = paginate(elonlar, page_size, page);
        
       
    //     res.render('elonlar', {
    //         title: "E'lonlar",
    //         elonlar,
    //         authors,
    //         IT,
    //         GD,
    //         SMM,
    //         pagination: {
    //             page: page,
    //             pageCount: pageCount
    //         },
    //         isFilter
    //     })

    // }

    
}

function paginate(array, page_size, page_number) {
    return  array.slice((page_number - 1) * page_size, page_number * page_size);
    
}

module.exports = Controller;