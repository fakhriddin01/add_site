const {read_file, write_file} = require('../fs/fs_api');

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
    SENT_ELON: (req, res) =>{
        let elon = req.body
        let elonlar = read_file('elonlar.json');
        let yunalishlar = ["Information Technologies", "Grafik Dizayn", "SMM"]
        let sub_yunalishlar = [["Node.js", "Python", "Flutter"], ["Grafik pro", "Adobe illustrator", "Photoshop"], ["SMM","Marketing"]]
        
    }
}

module.exports = Controller;