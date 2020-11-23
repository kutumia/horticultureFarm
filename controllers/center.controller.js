const db=require('../models');
const Op = db.Sequelize.Op;
const { fn, col, cast } = db.sequelize;

const center = db.center;
const centerInfo = db.centerInfo;
const topSheet = db.topSheet;
const charaKolom = db.charaKolom;
const folMosholla = db.folMosholla;
const otherFlower = db.otherFlower;
const seasonalFlower = db.seasonalFlower;
const summerVeg = db.summerVeg;
const winterVeg = db.winterVeg;
const regularWorker = db.regularWorker;
const irregularWorker = db.irregularWorker;
const apa = db.apa;
const loan = db.loan;
const specialCoconut = db.specialCoconut;
const revolvingFund = db.revolvingFund;
const chak1 = db.chak1;
const chak2 = db.chak2;
const rajossho = db.rajossho;
const expense = db.expense;
const monthlyProgress = db.monthlyProgress;
const cropCategory = db.cropcategory;

const production = db.production;
const daeprapti = db.daeprapti;
const bitoron = db.bitoron;
const daeprodan = db.daeprodan;
const mrito = db.mrito;
const mojud = db.mojud;
const comment = db.comment;

const jwt= require('jsonwebtoken');
const bcrypt= require('bcryptjs'); 

const { request, response } = require('express');
const express = require('express');

module.exports.centertable=async(req,res)=>{
    res.json({ message: "hello center" });
};

module.exports.allcenter=async(req,res)=>{
    res.json({ message: "hello center" });
};
module.exports.allCenterInfo=async(req,res)=>{
    await centerInfo.findAll()
    .then(data => {
        console.log(data);
        res.render('allCenterInfo', { title: 'সেন্টারের যোগাযোগ তথ্য',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('allCenterInfo', { title: 'সেন্টারের যোগাযোগ তথ্য',success:'', records: err });
    })
};
module.exports.charaKolomFixed=async(req,res)=>{
    
    try {
        const charaKoloms= await charaKolom.findAll();
        const folMoshollas= await folMosholla.findAll();
        const winterVegs= await winterVeg.findAll();
        const otherFlowers= await otherFlower.findAll();
        const seasonalFlowers= await seasonalFlower.findAll();
        const summerVegs= await summerVeg.findAll();
        console.log("inside");
        res.render('charaKolomFixed', { title: 'হরটিকালচার সেন্টারের চারা/কলমের বিক্রয়মূল্য',success:'', record1: charaKoloms,record2: folMoshollas,record3:winterVegs ,record4: summerVegs,record5:otherFlowers  ,record6:seasonalFlowers  });
    }
    catch(err) {
        console.log("outside");
        res.render('charaKolomFixed', { title: 'হরটিকালচার সেন্টারের চারা/কলমের বিক্রয়মূল্য',success:'',record1: err,record2: err,record3: err,record4: err,record5: err,record6: err });
    }
    
};
module.exports.centerlogin=async(req,res)=>{
    res.render('center/login', { title: 'Horticulture Wing Central Management Software',msg:'' });
    res.send("log");
};

module.exports.centerloginpost=async(req,res)=>{
    try {
        const uname = req.body.uname;
        const password = req.body.password;
        center.findAll({ where: {uname: uname} })
        .then(data => {
            if(data.length > 0){
                bcrypt.compare(password,data[0].password,function(err, result) {
                    if(result== true){
                        req.session.type = "center";
                        req.session.user_id = data[0].id;
                        const id=req.session.user_id;
                        // res.locals.type = req.session.type;
                        // res.locals.user_id = req.session.user_id;
                        console.log("session=", req.session.type,res.locals);
                        // const token=jwt.sign({id},process.env.JWT_SECRET,token{
                        //     expiresIn:process.env.JWT_EXPIRES_IN
                        // });
                        // console.log("the token is :"+)
                        res.redirect('/center/dashboard');
                    }
                    else{
                        return res.status(200).render('center/login', { title: 'Horticulture Wing Central Management Software',msg:'Please provide a username and password' });
                    }
                });
            }else{
                return res.status(200).render('center/login', { title: 'Horticulture Wing Central Management Software',msg:'Please provide a username and password' });
            }
        })
        .catch(err => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while retrieving tutorials."
              });
            });
        // center.findAll({ where: {uname: uname} })
        // .then(data => {
        //     if(data.length > 0){
        //         bcrypt.compareSync(password , center.password, function(err, result) {
        //             if(result== true){
        //                 res.redirect('/center/dashboard');
        //             }
        //             else{
        //                 res.redirect('/center/dashboard');
        //             }
        //         });
        //     }else{
        //         return res.status(200).render('center/login', { title: 'Horticulture Wing Central Management Software',msg:'Please provide a username and password' });
        //     }
        // })
        // .catch(err => {
        //   res.status(500).send({
        //     message:
        //       err.message || "Some error occurred while retrieving tutorials."
        //   });
        // });

        
    }
    catch(error){
        console.log(error);
    } 
};

module.exports.centerDashboard = async(req,res) => {
    try{
        const monthly_progress = await monthlyProgress.findAll();

        var startRange = "";
        var endRange = "";
        if ( res.locals.moment().format("M") < 7){
            startRange = "jul"+"-"+res.locals.moment().subtract(1, "year").format('yyyy')
            endRange = "jul"+"-"+res.locals.moment().format('yyyy')
        }else{
            startRange = "jul"+"-"+res.locals.moment().format('yyyy')
            endRange = "jul"+"-"+res.locals.moment().add(1, "year").format('yyyy')
        }

        var totalProduct = 0;
        var totalBitoron = 0;
        var totalMojud = 0;
        monthly_progress.forEach((row) => {
            const productTotalParse = JSON.parse(row.productionTotal);
            const bitoronParse = JSON.parse(row.bitoronTotal);
            const mojudParse = JSON.parse(row.mojud);
            productTotalParse.forEach((prodTotal)=> {
                if (prodTotal.startTime === startRange && prodTotal.endTime === endRange){
                    totalProduct += parseInt(prodTotal.amount)
                }
            })
            bitoronParse.forEach((bitorTotal) => {
                if (bitorTotal.startTime === startRange && bitorTotal.endTime === endRange){
                    totalBitoron += parseInt(bitorTotal.amount)
                }
            })
            mojudParse.forEach((mojuToal) => {
                if ( res.locals.moment( mojuToal.time ).isAfter(startRange) &&  res.locals.moment( mojuToal.time ).isBefore(endRange) ){
                    totalMojud += parseInt(mojuToal.amount)
                }
            })
        })

        res.render('center/dashboard', { title: 'Horticulture Wing Central Management Software',msg:'Welcome' ,totalProduction: totalProduct, totalBitoron: totalBitoron, totalMojud:totalMojud });
    }
    catch (e) {
        console.log(e)
    }
};

//signUp controller
module.exports.centersignup=async(req,res)=>{
    res.render('center/signup', { title: 'Horticulture Wing Central Management Software',msg:'' });
    res.send("log");
};
module.exports.centersignuppost=async(req,res)=>{
    try {
        const{uname,password,confirmPassword}=req.body;

        const data = await center.findAll({ where: {uname: uname} })
        if(data.length > 0){
            res.render('center/signup',{title: 'Horticulture Wing Central Management Software',msg:'ERROR: The center is already enrolled!'})
        }
        else if(password !== confirmPassword){
            return res.render('center/signup',{title: 'Horticulture Wing Central Management Software',msg:'ERROR: Passwords do not match!'})
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword);
            try{
                const createCenter = await center.create({
                    uname: uname,
                    password:hashedPassword,
                    pd_id:1
                    })
                res.render('center/signup',{title: 'Horticulture Wing Central Management Software',msg:'Center Registered Successfully!'})
            }
            catch (err) {
                console.log(err);
            }
            
        }
    }
    catch(error){
        console.log(error);
    } 
};
//signUp controller end

//topSheet controller
module.exports.topSheet=async(req,res)=>{
    console.log("Centerdashboard",res.locals.type);
    await topSheet.findAll({
        where: {center_id: req.session.user_id}
    })
    .then(data => {
        console.log("inside");
        res.render('center/topSheet/topSheet', { title: 'টপশীট',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('center/topSheet/topSheet', { title: 'টপশীট',success:'', records: err });
    })
     
    //  records:result

};

module.exports.topSheetYear=async(req,res)=>{
    await topSheet.findAll({
        where: {year: req.body.year,center_id: req.session.user_id}
    })
    .then(data => {
        res.render('center/topSheet/topSheetTable', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        res.render('center/topSheet/topSheetYear', { title: 'টপশীট',success:'', records: err });
    })

};

module.exports.topSheetForm=async(req,res)=>{
    res.render('center/topSheet/topSheetForm', { title: 'টপশীট',msg:'' ,success:'',user_id: req.session.user_id});
};

module.exports.topSheetFormPost=async(req,res)=>{
    var item= req.body.item;
    var target= req.body.target;
    var lproduction= req.body.lproduction;
    var cproduction= req.body.cproduction;
    var tproduction= req.body.tproduction;
    var year =req.body.year;
    var user_id =req.body.user_id;

    await topSheet.create({
        item: item,
        target:target,
        lproduction:lproduction,
        cproduction:cproduction,
        tproduction:tproduction,
        year:year,
        center_id:user_id

        }).then(data => {
            res.redirect('/center/topSheet');
        }).catch(err => {
            res.render('errorpage',err);
        });
  
};
//topSheet controller end

//center controller
module.exports.center=async(req,res)=>{
    await centerInfo.findAll({
        where: {center_id: req.session.user_id}
    })
    .then(data => {
        console.log("inside");
        res.render('center/centerinfo/center', { title: 'সেন্টারের যোগাযোগ তথ্য',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('center/centerinfo/center', { title: 'সেন্টারের যোগাযোগ তথ্য',success:'', records: err });
    })
     
    //  records:result

};

module.exports.centerYear=async(req,res)=>{
    await centerInfo.findAll({
        where: {year: req.body.year, center_id: req.session.user_id}
    })
    .then(data => {
        res.render('center/centerinfo/centerTable', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        res.render('center/centerinfo/centerYear', { title: 'সেন্টারের যোগাযোগ তথ্য',success:'', records: err });
    })

};

module.exports.centerForm=async(req,res)=>{
    res.render('center/centerinfo/centerForm', { title: 'সেন্টারের যোগাযোগ তথ্য',msg:'' ,success:'',user_id: req.session.user_id});
};

module.exports.centerFormPost=async(req,res)=>{
    var center= req.body.center;
    var kormokorta= req.body.kormokorta;
    var podobi= req.body.podobi;
    var mobile= req.body.mobile;
    var email= req.body.email;
    var year =req.body.year;
    var user_id =req.body.user_id;

    await centerInfo.create({
        center: center,
        kormokorta:kormokorta,
        podobi:podobi,
        mobile:mobile,
        email:email,
        year:year,
        center_id:user_id

        }).then(data => {
            res.redirect('/center/center');
        }).catch(err => {
            res.render('errorpage',err);
        });
  
};
//center controller end

//charaKolom controller
module.exports.charaKolom=async(req,res)=>{
    await charaKolom.findAll({
        where: {center_id: req.session.user_id}
    })
    .then(data => {
        console.log("inside");
        res.render('center/charaKolomPrice/charaKolom/charaKolom', { title: 'হরটিকালচার সেন্টারের চারা/কলমের বিক্রয়মূল্য',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('center/charaKolomPrice/charaKolom/charaKolom', { title: 'হরটিকালচার সেন্টারের চারা/কলমের বিক্রয়মূল্য',success:'', records: err });
    })
     
    //  records:result

};

module.exports.charaKolomYear=async(req,res)=>{
    await charaKolom.findAll({
        where: {year: req.body.year, center_id: req.session.user_id}
    })
    .then(data => {
        res.render('center/charaKolomPrice/charaKolom/charaKolomTable', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        res.render('center/charaKolomPrice/charaKolom/charaKolomYear', { title: 'হরটিকালচার সেন্টারের চারা/কলমের বিক্রয়মূল্য',success:'', records: err });
    })

};

module.exports.charaKolomForm=async(req,res)=>{
    res.render('center/charaKolomPrice/charaKolom/charaKolomForm', { title: 'হরটিকালচার সেন্টারের চারা/কলমের বিক্রয়মূল্য',msg:'' ,success:'',user_id: req.session.user_id});
};

module.exports.charaKolomFormPost=async(req,res)=>{
    var cname= req.body.cname;
    var shotero= req.body.shotero;
    var atharo= req.body.atharo;
    var unish= req.body.unish;
    var parbotto= req.body.parbotto;
    var year =req.body.year;
    var user_id =req.body.user_id;

    await charaKolom.create({
        cname: cname,
        shotero:shotero,
        atharo:atharo,
        unish:unish,
        parbotto:parbotto,
        year:year,
        center_id:user_id

        }).then(data => {
            res.redirect('/center/charaKolom');
        }).catch(err => {
            res.render('errorpage',err);
        });
  
};
//charaKolom controller end

//folMosholla controller
module.exports.folMosholla=async(req,res)=>{
    await folMosholla.findAll({
        where: {center_id: req.session.user_id}
    })
    .then(data => {
        console.log("inside");
        res.render('center/charaKolomPrice/folMosholla/folMosholla', { title: 'হরটিকালচার সেন্টারের ফল/মসলা ও শাক-সবজি বিক্রয় মূল্য',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('center/charaKolomPrice/folMosholla/folMosholla', { title: 'হরটিকালচার সেন্টারের ফল/মসলা ও শাক-সবজি বিক্রয় মূল্য',success:'', records: err });
    })
     
    //  records:result

};

module.exports.folMoshollaYear=async(req,res)=>{
    await folMosholla.findAll({
        where: {year: req.body.year, center_id: req.session.user_id}
    })
    .then(data => {
        res.render('center/charaKolomPrice/folMosholla/folMoshollaTable', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        res.render('center/charaKolomPrice/folMosholla/folMoshollaYear', { title: 'হরটিকালচার সেন্টারের ফল/মসলা ও শাক-সবজি বিক্রয় মূল্য',success:'', records: err });
    })

};

module.exports.folMoshollaForm=async(req,res)=>{
    res.render('center/charaKolomPrice/folMosholla/folMoshollaForm', { title: 'হরটিকালচার সেন্টারের ফল/মসলা ও শাক-সবজি বিক্রয় মূল্য',msg:'' ,success:'',user_id: req.session.user_id});
};

module.exports.folMoshollaFormPost=async(req,res)=>{
    var item= req.body.item;
    var amount= req.body.amount;
    var shotero= req.body.shotero;
    var atharo= req.body.atharo;
    var unish= req.body.unish;
    var year =req.body.year;
    var user_id =req.body.user_id;

    await folMosholla.create({
        item: item,
        amount:amount,
        shotero:shotero,
        atharo:atharo,
        unish:unish,
        year:year,
        center_id:user_id

        }).then(data => {
            res.redirect('/center/folMosholla');
        }).catch(err => {
            res.render('errorpage',err);
        });
  
};
//folMosholla controller end

//otherFlower controller
module.exports.otherFlower=async(req,res)=>{
    await otherFlower.findAll({
        where: {center_id: req.session.user_id}
    })
    .then(data => {
        console.log("inside");
        res.render('center/charaKolomPrice/otherFlower/otherFlower', { title: 'বিভিন্ন ফুল ও সুদৃশ্য গাছের চারা/কলমের বিক্রয় মূল্য',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('center/charaKolomPrice/otherFlower/otherFlower', { title: 'বিভিন্ন ফুল ও সুদৃশ্য গাছের চারা/কলমের বিক্রয় মূল্য',success:'', records: err });
    })
     
    //  records:result

};

module.exports.otherFlowerYear=async(req,res)=>{
    await otherFlower.findAll({
        where: {year: req.body.year, center_id: req.session.user_id}
    })
    .then(data => {
        res.render('center/charaKolomPrice/otherFlower/otherFlowerTable', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        res.render('center/charaKolomPrice/otherFlower/otherFlowerYear', { title: 'বিভিন্ন ফুল ও সুদৃশ্য গাছের চারা/কলমের বিক্রয় মূল্য',success:'', records: err });
    })

};

module.exports.otherFlowerForm=async(req,res)=>{
    res.render('center/charaKolomPrice/otherFlower/otherFlowerForm', { title: 'বিভিন্ন ফুল ও সুদৃশ্য গাছের চারা/কলমের বিক্রয় মূল্য',msg:'' ,success:'',user_id: req.session.user_id});
};

module.exports.otherFlowerFormPost=async(req,res)=>{
    var item= req.body.item;
    var polyshotero= req.body.polyshotero;
    var tobshotero= req.body.tobshotero;
    var polyatharo= req.body.polyatharo;
    var tobatharo= req.body.tobatharo;
    var polyunish= req.body.polyunish;
    var tobunish= req.body.tobunish;
    var year =req.body.year;
    var user_id =req.body.user_id;

    

    await otherFlower.create({
        item: item,
        polyshotero:polyshotero,
        tobshotero:tobshotero,
        polyatharo:polyatharo,
        tobatharo:tobatharo,
        polyunish:polyunish,
        tobunish:tobunish,
        year:year,
        center_id:user_id

        }).then(data => {
            console.log(data)
            res.redirect('/center/otherFlower');
        }).catch(err => {
            console.log(err);
            res.render('errorpage',err);
        });
  
};
//otherFlower controller end

//seasonalFlower controller
module.exports.seasonalFlower=async(req,res)=>{
    await seasonalFlower.findAll({
        where: {center_id: req.session.user_id}
    })
    .then(data => {
        console.log("inside");
        res.render('center/charaKolomPrice/seasonalFlower/seasonalFlower', { title: 'মৌসুমী ফুল ও চারার বিক্রয় মূল্য',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('center/charaKolomPrice/seasonalFlower/seasonalFlower', { title: 'মৌসুমী ফুল ও চারার বিক্রয় মূল্য',success:'', records: err });
    })
     
    //  records:result

};

module.exports.seasonalFlowerYear=async(req,res)=>{
    await seasonalFlower.findAll({
        where: {year: req.body.year, center_id: req.session.user_id}
    })
    .then(data => {
        res.render('center/charaKolomPrice/seasonalFlower/seasonalFlowerTable', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        res.render('center/charaKolomPrice/seasonalFlower/seasonalFlowerYear', { title: 'মৌসুমী ফুল ও চারার বিক্রয় মূল্য',success:'', records: err });
    })

};

module.exports.seasonalFlowerForm=async(req,res)=>{
    res.render('center/charaKolomPrice/seasonalFlower/seasonalFlowerForm', { title: 'মৌসুমী ফুল ও চারার বিক্রয় মূল্য',msg:'' ,success:'',user_id: req.session.user_id});
};

module.exports.seasonalFlowerFormPost=async(req,res)=>{
    var item= req.body.item;
    var poriman= req.body.poriman;
    var polyatharo= req.body.polyatharo;
    var bedatharo= req.body.bedatharo;
    var polyunish= req.body.polyunish;
    var bedunish= req.body.bedunish;
    var year =req.body.year;
    var user_id =req.body.user_id;

    await seasonalFlower.create({
        item: item,
        poriman:poriman,
        polyatharo:polyatharo,
        bedatharo:bedatharo,
        polyunish:polyunish,
        bedunish:bedunish,
        year:year,
        center_id:user_id

        }).then(data => {
            res.redirect('/center/seasonalFlower');
        }).catch(err => {
            res.render('errorpage',err);
        });
  
};
//seasonalFlower controller end

//summerVeg controller
module.exports.summerVeg=async(req,res)=>{
    await summerVeg.findAll({
        where: {center_id: req.session.user_id}
    })
    .then(data => {
        console.log("inside");
        res.render('center/charaKolomPrice/summerVeg/summerVeg', { title: 'গ্রীষ্মকালীন সবজি ও অন্যান্য বীজের/চারার বিক্রয় মূল্য',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('center/charaKolomPrice/summerVeg/summerVeg', { title: 'গ্রীষ্মকালীন সবজি ও অন্যান্য বীজের/চারার বিক্রয় মূল্য',success:'', records: err });
    })
     
    //  records:result

};

module.exports.summerVegYear=async(req,res)=>{
    await summerVeg.findAll({
        where: {year: req.body.year, center_id: req.session.user_id}
    })
    .then(data => {
        res.render('center/charaKolomPrice/summerVeg/summerVegTable', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        res.render('center/charaKolomPrice/summerVeg/summerVegYear', { title: 'গ্রীষ্মকালীন সবজি ও অন্যান্য বীজের/চারার বিক্রয় মূল্য',success:'', records: err });
    })

};

module.exports.summerVegForm=async(req,res)=>{
    res.render('center/charaKolomPrice/summerVeg/summerVegForm', { title: 'গ্রীষ্মকালীন সবজি ও অন্যান্য বীজের/চারার বিক্রয় মূল্য',msg:'' ,success:'',user_id: req.session.user_id});
};

module.exports.summerVegFormPost=async(req,res)=>{
    var item= req.body.item;
    var doshatharo= req.body.doshatharo;
    var ekshoucchoatharo= req.body.ekshoucchoatharo;
    var ekshohybridatharo= req.body.ekshohybridatharo;
    var doshbijunish= req.body.doshbijunish;
    var ekshoucchounish= req.body.ekshoucchounish;
    var ekshohybridunish= req.body.ekshohybridunish;
    var year =req.body.year;
    var user_id =req.body.user_id;

    await summerVeg.create({
        item:item,
        doshatharo:doshatharo,
        ekshoucchoatharo:ekshoucchoatharo,
        ekshohybridatharo:ekshohybridatharo,
        doshbijunish:doshbijunish,
        ekshoucchounish:ekshoucchounish,
        ekshohybridunish:ekshohybridunish,
        year:year,
        center_id:user_id

        }).then(data => {
            res.redirect('/center/summerVeg');
        }).catch(err => {
            res.render('errorpage',err);
        });
  
};
//summerVeg controller end

//winterVeg controller
module.exports.winterVeg=async(req,res)=>{

    await center.findAll({
        where: {center_id: req.session.user_id}
    })
    .then(data => {
        console.log("inside");
        res.render('center/charaKolomPrice/winterVeg/winterVeg', { title: 'শীতকালীন সবজি ও অন্যান্য বীজের/চারার বিক্রয় মূল্য',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('center/charaKolomPrice/winterVeg/winterVeg', { title: 'শীতকালীন সবজি ও অন্যান্য বীজের/চারার বিক্রয় মূল্য',success:'', records: err });
    })
     
    //  records:result

};

module.exports.winterVegYear=async(req,res)=>{
    await winterVeg.findAll({
        where: {year: req.body.year, center_id: req.session.user_id}
    })
    .then(data => {
        res.render('center/charaKolomPrice/winterVeg/winterVegTable', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        res.render('center/charaKolomPrice/winterVeg/winterVegYear', { title: 'শীতকালীন সবজি ও অন্যান্য বীজের/চারার বিক্রয় মূল্য',success:'', records: err });
    })

};

module.exports.winterVegForm=async(req,res)=>{
    res.render('center/charaKolomPrice/winterVeg/winterVegForm', { title: 'শীতকালীন সবজি ও অন্যান্য বীজের/চারার বিক্রয় মূল্য',msg:'' ,success:'',user_id: req.session.user_id});
};

module.exports.winterVegFormPost=async(req,res)=>{
    var item= req.body.item;
    var doshatharo= req.body.doshatharo;
    var ekshoucchoatharo= req.body.ekshoucchoatharo;
    var ekshohybridatharo= req.body.ekshohybridatharo;
    var doshbijunish= req.body.doshbijunish;
    var ekshoucchounish= req.body.ekshoucchounish;
    var ekshohybridunish= req.body.ekshohybridunish;
    var year =req.body.year;
    var user_id =req.body.user_id;

    await winterVeg.create({
        item: item,
        doshatharo:doshatharo,
        ekshoucchoatharo:ekshoucchoatharo,
        ekshohybridatharo:ekshohybridatharo,
        doshbijunish:doshbijunish,
        ekshoucchounish:ekshoucchounish,
        ekshohybridunish:ekshohybridunish,
        year:year,
        center_id:user_id

        }).then(data => {
            res.redirect('/center/winterVeg');
        }).catch(err => {
            res.render('errorpage',err);
        });
  
};
//winterVeg controller end

//regularWorker controller
module.exports.regularWorker=async(req,res)=>{
    console.log("das",req.session.type)
    await regularWorker.findAll({
        where: {center_id: req.session.user_id}
    })
    .then(data => {
        console.log("inside");
        res.render('center/worker/regularWorker/regularWorker', { title: 'নিয়মিত শ্রমিকের তথ্য',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('center/worker/regularWorker/regularWorker', { title: 'নিয়মিত শ্রমিকের তথ্য',success:'', records: err });
    })
     
    //  records:result

};

module.exports.regularWorkerYear=async(req,res)=>{
    await regularWorker.findAll({
        where: {year: req.body.year,center_id: req.session.user_id}
    })
    .then(data => {
        res.render('center/worker/regularWorker/regularWorkerTable', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        res.render('center/worker/regularWorker/regularWorkerYear', { title: 'নিয়মিত শ্রমিকের তথ্য',success:'', records: err });
    })

};

module.exports.regularWorkerForm=async(req,res)=>{
    res.render('center/worker/regularWorker/regularWorkerForm', { title: 'নিয়মিত শ্রমিকের তথ্য',msg:'' ,success:'',user_id: req.session.user_id});
};

module.exports.regularWorkerFormPost=async(req,res)=>{
    var name= req.body.name;
    var date= req.body.date;
    var nid= req.body.nid;
    var year =req.body.year;
    var user_id =req.body.user_id;

    await regularWorker.create({
        name: name,
        date:date,
        nid:nid,
        year:year,
        center_id:user_id

        }).then(data => {
            res.redirect('/center/regularWorker');
        }).catch(err => {
            res.render('errorpage',err);
        });
  
};
//regularWorker controller end

//irregularWorker controller
module.exports.irregularWorker=async(req,res)=>{
    await irregularWorker.findAll({
        where: {center_id: req.session.user_id}
    })
    .then(data => {
        console.log("inside");
        res.render('center/worker/irregularWorker/irregularWorker', { title: 'অনিয়মিত শ্রমিকের তথ্য',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('center/worker/irregularWorker/irregularWorker', { title: 'অনিয়মিত শ্রমিকের তথ্য',success:'', records: err });
    })
     
    //  records:result

};

module.exports.irregularWorkerYear=async(req,res)=>{
    await irregularWorker.findAll({
        where: {year: req.body.year, center_id: req.session.user_id}
    })
    .then(data => {
        res.render('center/worker/irregularWorker/irregularWorkerTable', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        res.render('center/worker/irregularWorker/irregularWorkerYear', { title: 'অনিয়মিত শ্রমিকের তথ্য',success:'', records: err });
    })

};

module.exports.irregularWorkerForm=async(req,res)=>{
    res.render('center/worker/irregularWorker/irregularWorkerForm', { title: 'অনিয়মিত শ্রমিকের তথ্য',msg:'' ,success:'',user_id: req.session.user_id});
};

module.exports.irregularWorkerFormPost=async(req,res)=>{
    var name= req.body.name;
    var date= req.body.date;
    var nid= req.body.nid;
    var year =req.body.year;
    var user_id =req.body.user_id;

    await irregularWorker.create({
        name: name,
        date:date,
        nid:nid,
        year:year,
        center_id:user_id

        }).then(data => {
            res.redirect('/center/irregularWorker');
        }).catch(err => {
            res.render('errorpage',err);
        });
  
};

//irregularWorker controller end

//apa controller
module.exports.apa=async(req,res)=>{
    console.log("Centerdashboard",res.locals.type);
    await apa.findAll({
        where: {center_id: req.session.user_id}
    })
    .then(data => {
        console.log("inside");
        res.render('center/apa/apa', { title: 'এপিএ',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('center/apa/apa', { title: 'এপিএ',success:'', records: err });
    })
     
    //  records:result

};

module.exports.apaYear=async(req,res)=>{
    await apa.findAll({
        where: {year: req.body.year, center_id: req.session.user_id}
    })
    .then(data => {
        res.render('center/apa/apaTable', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        res.render('center/apa/apaYear', { title: 'এপিএ',success:'', records: err });
    })

};

module.exports.apaForm=async(req,res)=>{
    res.render('center/apa/apaForm', { title: 'এপিএ',msg:'' ,success:'',user_id: req.session.user_id});
};

module.exports.apaFormPost=async(req,res)=>{
    var uddessho= req.body.uddessho;
    var maan= req.body.maan;
    var work= req.body.work;
    var shuchok= req.body.shuchok;
    var ekok= req.body.ekok;
    var shuchokMaan= req.body.shuchokMaan;
    var achievement1= req.body.achievement1;
    var achievement2= req.body.achievement2;
    var best= req.body.best;
    var otiUttam= req.body.otiUttam;
    var uttam= req.body.uttam;
    var cholti= req.body.cholti;
    var below= req.body.below;
    var firstThree= req.body.firstThree;
    var secondThree= req.body.secondThree;
    var year =req.body.year;
    var user_id =req.body.user_id;

    await apa.create({
        uddessho: uddessho,
        maan:maan,
        work:work,
        shuchok: shuchok,
        ekok:ekok,
        shuchokMaan:shuchokMaan,
        achievement1: achievement1,
        achievement2:achievement2,
        best:best,
        otiUttam: otiUttam,
        uttam:uttam,
        cholti:cholti,
        below: below,
        firstThree:firstThree,
        secondThree:secondThree,
        year:year,
        center_id:user_id

        }).then(data => {
            res.redirect('/center/apa');
        }).catch(err => {
            res.render('errorpage',err);
        });
  
};

//apa controller end

//loan controller
module.exports.loan=async(req,res)=>{
    await loan.findAll({
        where: {center_id: req.session.user_id}
    })
    .then(data => {
        console.log("inside");
        res.render('center/loan/loan', { title: 'ঋণ বিতরণ ও আদায় এর অগ্রগতির প্রতিবেদন',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('center/loan/loan', { title: 'ঋণ বিতরণ ও আদায় এর অগ্রগতির প্রতিবেদন',success:'', records: err });
    })
     
    //  records:result

};

module.exports.loanYear=async(req,res)=>{
    await loan.findAll({
        where: {year: req.body.year, center_id: req.session.user_id}
    })
    .then(data => {
        res.render('center/loan/loanTable', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        res.render('center/loan/loanYear', { title: 'ঋণ বিতরণ ও আদায় এর অগ্রগতির প্রতিবেদন',success:'', records: err });
    })

};

module.exports.loanForm=async(req,res)=>{
    res.render('center/loan/loanForm', { title: 'ঋণ বিতরণ ও আদায় এর অগ্রগতির প্রতিবেদন',msg:'' ,success:'',user_id: req.session.user_id});
};

module.exports.loanFormPost=async(req,res)=>{
    var boraddo= req.body.boraddo;
    var bitoron1= req.body.bitoron1;
    var aday1= req.body.aday1;
    var left1= req.body.left1;
    var bitoron2= req.body.bitoron2;
    var aday2= req.body.aday2;
    var left2= req.body.left2;
    var comment= req.body.comment;
    var year =req.body.year;
    var user_id =req.body.user_id;

    await loan.create({
        boraddo: boraddo,
        bitoron1:bitoron1,
        aday1:aday1,
        left1: left1,
        bitoron2:bitoron2,
        aday2:aday2,
        left2: left2,
        comment:comment,
        year:year,
        center_id:user_id

        }).then(data => {
            res.redirect('/center/loan');
        }).catch(err => {
            res.render('errorpage',err);
        });
  
};

//apa controller end

//specialCoconut controller
module.exports.specialCoconut=async(req,res)=>{
    await specialCoconut.findAll({
        where: {center_id: req.session.user_id}
    })
    .then(data => {
        console.log("inside");
        res.render('center/specialCoconut/specialCoconut', { title: 'বিশেষ নারিকেল কর্মসূচি',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('center/specialCoconut/specialCoconut', { title: 'বিশেষ নারিকেল কর্মসূচি',success:'', records: err });
    })
     
    //  records:result

};

module.exports.specialCoconutYear=async(req,res)=>{
    await specialCoconut.findAll({
        where: {year: req.body.year, center_id: req.session.user_id}
    })
    .then(data => {
        res.render('center/specialCoconut/specialCoconutTable', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        res.render('center/specialCoconut/specialCoconutYear', { title: 'বিশেষ নারিকেল কর্মসূচি',success:'', records: err });
    })

};

module.exports.specialCoconutForm=async(req,res)=>{
    res.render('center/specialCoconut/specialCoconutForm', { title: 'বিশেষ নারিকেল কর্মসূচি',msg:'' ,success:'',user_id: req.session.user_id});
};

module.exports.specialCoconutFormPost=async(req,res)=>{
    var center= req.body.center;
    var boraddo= req.body.boraddo;
    var target= req.body.target;
    var boughtNarikel= req.body.boughtNarikel;
    var seedProduction= req.body.seedProduction;
    var deadSeed= req.body.deadSeed;
    var salableSeedTarget= req.body.salableSeedTarget;
    var salableSeedAchieved= req.body.salableSeedAchieved;
    var salableSeedPercentage= req.body.salableSeedPercentage;
    var salableSeedNumber= req.body.salableSeedNumber;
    var soldSeed= req.body.soldSeed;
    var soldSeedPrice= req.body.soldSeedPrice;
    var presentMojud= req.body.presentMojud;
    var earnedMoneyDD= req.body.earnedMoneyDD;
    var earnedMoneyDate= req.body.earnedMoneyDate;
    var earnedMoneyHead= req.body.earnedMoneyHead;
    var earnedMoneyLocalBank= req.body.earnedMoneyLocalBank;
    var comment= req.body.comment;
    var year =req.body.year;
    var user_id =req.body.user_id;

    await specialCoconut.create({
        center: center,
        boraddo:boraddo,
        target:target,
        boughtNarikel: boughtNarikel,
        seedProduction:seedProduction,
        deadSeed:deadSeed,
        salableSeedTarget: salableSeedTarget,
        salableSeedAchieved:salableSeedAchieved,
        salableSeedPercentage:salableSeedPercentage,
        salableSeedNumber: salableSeedNumber,
        soldSeed:soldSeed,
        soldSeedPrice:soldSeedPrice,
        presentMojud: presentMojud,
        earnedMoneyDD:earnedMoneyDD,
        earnedMoneyDate:earnedMoneyDate,
        earnedMoneyHead: earnedMoneyHead,
        earnedMoneyLocalBank:earnedMoneyLocalBank,
        comment:comment,
        year:year,
        center_id:user_id

        }).then(data => {
            res.redirect('/center/specialCoconut');
        }).catch(err => {
            res.render('errorpage',err);
        });
  
};

//specialCoconut controller end

//revolvingFund controller
module.exports.revolvingFund=async(req,res)=>{
    await revolvingFund.findAll({
        where: {center_id: req.session.user_id}
    })
    .then(data => {
        console.log("inside");
        res.render('center/revolvingFund/revolvingFund', { title: 'রিভলভিং ফান্ড',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('center/revolvingFund/revolvingFund', { title: 'রিভলভিং ফান্ড',success:'', records: err });
    })
     
    //  records:result

};

module.exports.revolvingFundYear=async(req,res)=>{
    await revolvingFund.findAll({
        where: {year: req.body.year, center_id: req.session.user_id}
    })
    .then(data => {
        res.render('center/revolvingFund/revolvingFundTable', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        res.render('center/revolvingFund/revolvingFundYear', { title: 'রিভলভিং ফান্ড',success:'', records: err });
    })

};

module.exports.revolvingFundForm=async(req,res)=>{
    res.render('center/revolvingFund/revolvingFundForm', { title: 'রিভলভিং ফান্ড',msg:'' ,success:'',user_id: req.session.user_id});
};

module.exports.revolvingFundFormPost=async(req,res)=>{
    var prapti= req.body.prapti;
    var presentOrtho= req.body.presentOrtho;
    var pastOrtho= req.body.pastOrtho;
    var totalOrtho= req.body.totalOrtho;
    var bank= req.body.bank;
    var soldPast= req.body.soldPast;
    var soldPresent= req.body.soldPresent;
    var soldTotal= req.body.soldTotal;
    var chara= req.body.chara;
    var productionTarget= req.body.productionTarget;
    var productionPast= req.body.productionPast;
    var productionPresent= req.body.productionPresent;
    var productionTotal= req.body.productionTotal;
    var bitoronPast= req.body.bitoronPast;
    var bitoronPresent= req.body.bitoronPresent;
    var bitoronDead= req.body.bitoronDead;
    var bitoronTotal= req.body.bitoronTotal;
    var totalMojud= req.body.totalMojud;
    var year =req.body.year;
    var user_id =req.body.user_id;

    await revolvingFund.create({
        prapti: prapti,
        presentOrtho:presentOrtho,
        pastOrtho:pastOrtho,
        totalOrtho: totalOrtho,
        bank:bank,
        soldPast:soldPast,
        soldPresent: soldPresent,
        soldTotal:soldTotal,
        chara: chara,
        productionTarget:productionTarget,
        productionPast:productionPast,
        productionPresent: productionPresent,
        productionTotal:productionTotal,
        bitoronPast:bitoronPast,
        bitoronPresent: bitoronPresent,
        bitoronDead:bitoronDead,
        bitoronTotal: bitoronTotal,
        totalMojud:totalMojud,
        year:year,
        center_id:user_id

        }).then(data => {
            res.redirect('/center/revolvingFund');
        }).catch(err => {
            res.render('errorpage',err);
        });
  
};

//revolvingFund controller end

//specialCoconut controller
module.exports.chak1=async(req,res)=>{
    await chak1.findAll({
        where: {center_id: req.session.user_id}
    })
    .then(data => {
        console.log("inside");
        res.render('center/employee/chak1/employeeChak1', { title: 'ক্যাডার/নন ক্যাডার কর্মকর্তাদের নাম ও পদবী সহ শূন্য পদের তথ্য',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('center/employee/chak1/employeeChak1', { title: 'ক্যাডার/নন ক্যাডার কর্মকর্তাদের নাম ও পদবী সহ শূন্য পদের তথ্য',success:'', records: err });
    })
     
    //  records:result

};

module.exports.chak1Year=async(req,res)=>{
    await chak1.findAll({
        where: {year: req.body.year, center_id: req.session.user_id}
    })
    .then(data => {
        res.render('center/employee/chak1/employeeChak1Table', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        res.render('center/employee/chak1/employeeChak1Year', { title: 'ক্যাডার/নন ক্যাডার কর্মকর্তাদের নাম ও পদবী সহ শূন্য পদের তথ্য',success:'', records: err });
    })

};

module.exports.chak1Form=async(req,res)=>{
    res.render('center/employee/chak1/employeeChak1Form', { title: 'ক্যাডার/নন ক্যাডার কর্মকর্তাদের নাম ও পদবী সহ শূন্য পদের তথ্য',msg:'' ,success:'',user_id: req.session.user_id});
};

module.exports.chak1FormPost=async(req,res)=>{
    var center= req.body.center;
    var porichito= req.body.porichito;
    var kormokorta= req.body.kormokorta;
    var nijDistrict= req.body.nijDistrict;
    var podobi= req.body.podobi;
    var birthDate= req.body.birthDate;
    var firstdate= req.body.firstdate;
    var presentDate= req.body.presentDate;
    var pastWorkstation= req.body.pastWorkstation;
    var comment= req.body.comment;
    var year =req.body.year;
    var user_id =req.body.user_id;

    await chak1.create({
        center: center,
        porichito:porichito,
        kormokorta:kormokorta,
        nijDistrict: nijDistrict,
        podobi:podobi,
        birthDate:birthDate,
        firstdate: firstdate,
        presentDate:presentDate,
        pastWorkstation:pastWorkstation,
        comment: comment,
        year:year,
        center_id:user_id

        }).then(data => {
            res.redirect('/center/chak1');
        }).catch(err => {
            res.render('errorpage',err);
        });
  
};

//chak1 controller end

//chak2 controller
module.exports.chak2=async(req,res)=>{
    await chak2.findAll({
        where: {center_id: req.session.user_id}
    })
    .then(data => {
        console.log("inside");
        res.render('center/employee/chak2/employeeChak2', { title: 'হরটিকালচার সেন্টারের কর্মকতা/কর্মচারীদের মঞ্জুরীকৃত পদ ও শুণ্য পদের সংখ্যা',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('center/employee/chak2/employeeChak2', { title: 'হরটিকালচার সেন্টারের কর্মকতা/কর্মচারীদের মঞ্জুরীকৃত পদ ও শুণ্য পদের সংখ্যা',success:'', records: err });
    })
     
    //  records:result

};

module.exports.chak2Year=async(req,res)=>{
    await chak2.findAll({
        where: {year: req.body.year, center_id: req.session.user_id}
    })
    .then(data => {
        res.render('center/employee/chak2/employeeChak2Table', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        res.render('center/employee/chak2/employeeChak2Year', { title: 'হরটিকালচার সেন্টারের কর্মকতা/কর্মচারীদের মঞ্জুরীকৃত পদ ও শুণ্য পদের সংখ্যা',success:'', records: err });
    })

};

module.exports.chak2Form=async(req,res)=>{
    res.render('center/employee/chak2/employeeChak2Form', { title: 'হরটিকালচার সেন্টারের কর্মকতা/কর্মচারীদের মঞ্জুরীকৃত পদ ও শুণ্য পদের সংখ্যা',msg:'' ,success:'',user_id: req.session.user_id});
};

module.exports.chak2FormPost=async(req,res)=>{
    var name= req.body.name;
    var grade= req.body.grade;
    var pod= req.body.pod;
    var working= req.body.working;
    var shunno= req.body.shunno;
    var comment= req.body.comment;
    var year =req.body.year;
    var user_id =req.body.user_id;

    await chak2.create({
        name: name,
        grade:grade,
        pod:pod,
        working: working,
        shunno:shunno,
        comment:comment,
        year:year,
        center_id:user_id

        }).then(data => {
            res.redirect('/center/chak2');
        }).catch(err => {
            res.render('errorpage',err);
        });
  
};

//chak2 controller end

//rajossho controller
module.exports.rajossho=async(req,res)=>{
    await rajossho.findAll({
        where: {center_id: req.session.user_id}
    })
    .then(data => {
        console.log("inside");
        res.render('center/rajossho/rajossho', { title: 'মাসিক রাজস্ব অর্থ প্রাপ্তির হিসাব',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('center/rajossho/rajossho', { title: 'মাসিক রাজস্ব অর্থ প্রাপ্তির হিসাব',success:'', records: err });
    })
     
    //  records:result

};

module.exports.rajosshoYear=async(req,res)=>{
    await rajossho.findAll({
        where: {year: req.body.year, center_id: req.session.user_id}
    })
    .then(data => {
        res.render('center/rajossho/rajosshoTable', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        res.render('center/rajossho/rajosshoYear', { title: 'মাসিক রাজস্ব অর্থ প্রাপ্তির হিসাব',success:'', records: err });
    })

};

module.exports.rajosshoForm=async(req,res)=>{
    res.render('center/rajossho/rajosshoForm', { title: 'মাসিক রাজস্ব অর্থ প্রাপ্তির হিসাব',msg:'' ,success:'',user_id: req.session.user_id});
};

module.exports.rajosshoFormPost=async(req,res)=>{
    var code= req.body.code;
    var upokhat= req.body.upokhat;
    var july1= req.body.july1;
    var august1= req.body.august1;
    var sept1= req.body.sept1;
    var oct1= req.body.oct1;
    var nov1= req.body.nov1;
    var dec1= req.body.dec1;
    var jan2= req.body.jan2;
    var feb2= req.body.feb2;
    var march2= req.body.march2;
    var apr2= req.body.apr2;
    var may2= req.body.may2;
    var june2= req.body.june2;
    var total= req.body.total;
    var year =req.body.year;
    var user_id =req.body.user_id;

    await rajossho.create({
        code: code,
        upokhat:upokhat,
        july1:july1,
        august1: august1,
        sept1:sept1,
        oct1:oct1,
        nov1: nov1,
        dec1:dec1,
        jan2:jan2,
        feb2: feb2,
        march2:march2,
        apr2: apr2,
        may2:may2,
        june2:june2,
        total: total,
        year:year,
        center_id:user_id

        }).then(data => {
            res.redirect('/center/rajossho');
        }).catch(err => {
            res.render('errorpage',err);
        });
  
};

//rajossho controller end

//expense controller
module.exports.expense=async(req,res)=>{
    await expense.findAll({
        where: {center_id: req.session.user_id}
    })
    .then(data => {
        console.log("inside");
        res.render('center/expense/expense', { title: 'খরচের (বিএস্টেটমেন্ট) হিসাব বিবরণী',success:'', records: data });
    })
    .catch(err => {
        console.log("outside");
        res.render('center/expense/expense', { title: 'খরচের (বিএস্টেটমেন্ট) হিসাব বিবরণী',success:'', records: err });
    })
     
    //  records:result

};

module.exports.expenseYear=async(req,res)=>{
    await expense.findAll({
        where: {year: req.body.year, center_id: req.session.user_id}
    })
    .then(data => {
        res.render('center/expense/expenseTable', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        res.render('center/expense/expenseYear', { title: 'খরচের (বিএস্টেটমেন্ট) হিসাব বিবরণী',success:'', records: err });
    })

};

module.exports.expenseForm=async(req,res)=>{
    res.render('center/expense/expenseForm', { title: 'খরচের (বিএস্টেটমেন্ট) হিসাব বিবরণী',msg:'' ,success:'',user_id: req.session.user_id});
};

module.exports.expenseFormPost=async(req,res)=>{
    var code= req.body.code;
    var khat= req.body.khat;
    var boraddo= req.body.boraddo;
    var july1= req.body.july1;
    var august1= req.body.august1;
    var sept1= req.body.sept1;
    var oct1= req.body.oct1;
    var nov1= req.body.nov1;
    var dec1= req.body.dec1;
    var jan2= req.body.jan2;
    var feb2= req.body.feb2;
    var march2= req.body.march2;
    var apr2= req.body.apr2;
    var may2= req.body.may2;
    var june2= req.body.june2;
    var total= req.body.total;
    var baki= req.body.baki;
    var comment= req.body.comment;
    var year =req.body.year;
    var user_id =req.body.user_id;

    await expense.create({
        code: code,
        khat:khat,
        boraddo:boraddo,
        july1:july1,
        august1: august1,
        sept1:sept1,
        oct1:oct1,
        nov1: nov1,
        dec1:dec1,
        jan2:jan2,
        feb2: feb2,
        march2:march2,
        apr2: apr2,
        may2:may2,
        june2:june2,
        total: total,
        baki:baki,
        comment: comment,
        year:year,
        center_id:user_id

        }).then(data => {
            res.redirect('/center/expense');
        }).catch(err => {
            res.render('errorpage',err);
        });
  
};

//expense controller end

//monthlyProgress controller
module.exports.monthlyProgress=async(req,res)=>{
    res.render('center/monthlyProgress/monthlyProgress', { title: 'মাসিক প্রতিবেদন',success:'' });
    // await monthlyProgress.findAll({
    //     where: {center_id: req.session.user_id}
    // })
    // .then(data => {
    //     res.render('center/monthlyProgress/monthlyProgress', { title: 'মাসিক প্রতিবেদন',success:'', records: data });
    // })
    // .catch(err => {
    //     res.render('center/monthlyProgress/monthlyProgress', { title: 'মাসিক প্রতিবেদন',success:'', records: err });
    // })

};

module.exports.monthlyProgressYear=async(req,res)=>{
    const currentMonth = res.locals.moment().format("MMM-YYYY").toLowerCase()
    await monthlyProgress.findAll({

            // attributes: [
            //     fn('JSON_CONTAINS', col('timeFrame'), cast('{"time": "nov-2020"}', 'CHAR CHARACTER SET utf8'))
            //     // fn('JSON_EXTRACT', col('time'), cast('{"time": "nov-2020"}', 'CHAR CHARACTER SET utf8')),
            // ],
            // raw: true,

            // where : {
            //     timeFrame: {
            //         time : 'nov-2020'
            //     }
            // }

            where:{
                year: req.body.year,
                center_id: req.session.user_id,
            }

            // [Op.and]: db.Sequelize.literal(JSON_CONTAINS(`time`, '{\"time\": nov-2020}')),
            // "time" : currentMonth

            // time: {
            //     [Op.and]: [{time: {[Op.eq]: currentMonth}}]
            // }


    })
    .then(data => {
        console.log(data)
        res.render('center/monthlyProgress/monthlyProgressTable', {records: data} ,function(err, html) {
            res.send(html);
        });
    })
    .catch(err => {
        console.log(err)
        res.render('center/monthlyProgress/monthlyProgressYear', { title: 'মাসিক প্রতিবেদন',success:'', records: err });
    })

};

module.exports.monthlyProgressForm=async(req,res)=>{
    try {
        const categoryList = await cropCategory.findAll();
        res.render('center/monthlyProgress/monthlyProgressForm', { title: 'মাসিক প্রতিবেদন',msg:'' ,success:'',user_id: req.session.user_id,categoryList: categoryList});
    }catch (e) {
        console.log(e)
    }
};

module.exports.fetchSubCategory = async(req,res) => {
    console.log("parent id",req.body.category)
    await cropCategory.findAll({
        where: {parent_id: req.body.category}
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err)
        })
};

module.exports.fetchBiboron = async (req,res) => {
    await cropCategory.findAll({
        where: {parent_id: req.body.subCategory}
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err)
        })
};

module.exports.fetchBreed = async (req,res) => {
    await cropCategory.findAll({
        where: {parent_id: req.body.biboron}
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err)
        })
};

module.exports.monthlyProgressFormPost=async(req,res)=>{
    var category= req.body.category;
    var subCategory= req.body.subCategory;
    var biboron= req.body.biboron;
    var breed= req.body.breed;
    var productionTarget= req.body.productionTarget;
    var productionCurrent= req.body.productionCurrent;
    var productionLast= req.body.productionLast;
    var productionTotal= req.body.productionTotal;
    var daePrapti= req.body.daePrapti;
    var lastYear= req.body.lastYear;
    var grandTotalProduction= req.body.grandTotalProduction;
    var bitoronCurrentMonth= req.body.bitotonCurrentMonth;
    var bitotonLastMonth= req.body.bitotonLastMonth;
    var bitoronTotal= req.body.bitoronTotal;
    var daeProdan= req.body.daeProdan;
    var deadWriteup= req.body.deadWriteup;
    var grandTotalBitoron= req.body.grandTotalBitoron;
    var mojud= req.body.mojud;
    var comment= req.body.comment;
    var year =req.body.year;
    var user_id =req.body.user_id;
    console.log('productionTotal=',res.locals.moment('2014-09-28').format("MMM-YYYY").toLowerCase());
    const currentMonth = res.locals.moment().format("MMM-YYYY").toLowerCase()


    var currentProduction = [];
    var productionObj = {};
    productionObj["time"] =  currentMonth;
    productionObj["amount"] =  productionCurrent;
    currentProduction.push(productionObj)

    var currentDaePraptis = [];
    var daePraptiObj = {};
    daePraptiObj["time"] =  currentMonth;
    daePraptiObj["amount"] =  daePrapti;
    currentDaePraptis.push(daePraptiObj)

    var currentBitoron = [];
    var bitoronObj = {};
    bitoronObj["time"] =  currentMonth;
    bitoronObj["amount"] =  bitoronCurrentMonth;
    currentBitoron.push(bitoronObj)

    var currentDaeProdan = [];
    var daeProdanObj = {};
    daeProdanObj["time"] =  currentMonth;
    daeProdanObj["amount"] =  daeProdan;
    currentDaeProdan.push(daeProdanObj)

    var currentDeadWriteup = [];
    var deadWriteupObj = {};
    deadWriteupObj["time"] =  currentMonth;
    deadWriteupObj["amount"] =  deadWriteup;
    currentDeadWriteup.push(deadWriteupObj)

    var currentMojud = [];
    var mojudObj = {};
    mojudObj["time"] =  currentMonth;
    mojudObj["amount"] =  mojud;
    currentMojud.push(mojudObj)

    var currentComment = [];
    var commentObj = {};
    commentObj["time"] =  currentMonth;
    commentObj["msg"] =  comment;
    currentComment.push(commentObj)

    var time = [];
    var timeObj = {};
    timeObj["time"] =  currentMonth;
    time.push(timeObj)

    var startRange = "";
    var endRange = "";
    if ( res.locals.moment().format("M") < 7){
        startRange = "jul"+"-"+res.locals.moment().subtract(1, "year").format('yyyy')
        endRange = "jul"+"-"+res.locals.moment().format('yyyy')
    }else{
        startRange = "jul"+"-"+res.locals.moment().format('yyyy')
        endRange = "jul"+"-"+res.locals.moment().add(1, "year").format('yyyy')
    }

    var totalProduction = [];
    var totalProducObj = {};
    totalProducObj["startTime"] =  `${startRange}`;
    totalProducObj["endTime"] =  `${endRange}`;
    totalProducObj["amount"] =  productionCurrent;
    totalProduction.push(totalProducObj)

    var totalBitoron = [];
    var totalBitoronObj = {};
    totalBitoronObj["startTime"] =  `${startRange}`;
    totalBitoronObj["endTime"] =  `${endRange}`;
    totalBitoronObj["amount"] =  bitoronCurrentMonth;
    totalBitoron.push(totalBitoronObj)

    const categoryName = await cropCategory.findByPk(category)
    const subCategoryName = await cropCategory.findByPk(subCategory)
    const biboronName = await cropCategory.findByPk(biboron)
    const breedName = await cropCategory.findByPk(breed)

    await monthlyProgress.create({
        category: categoryName.name,
        subCategory: subCategoryName.name,
        biboron: biboronName.name,
        breed: breedName.name,
        productionTarget: productionTarget,
        productionCurrent: JSON.stringify(currentProduction),
        productionTotal: JSON.stringify(totalProduction),
        daePrapti: JSON.stringify(currentDaePraptis),
        bitoronCurrentMonth: JSON.stringify(currentBitoron),
        bitoronTotal: JSON.stringify(totalBitoron),

        daeProdan: JSON.stringify(currentDaeProdan),
        deadWriteup: JSON.stringify(currentDeadWriteup),
        mojud: JSON.stringify(currentMojud),
        comment: JSON.stringify(currentComment),
        timeFrame: time,
        year: year,
        center_id:user_id

    }).then(data => {
        console.log('productionTotal=',productionTotal);
        res.redirect('/center/monthlyProgress');
    }).catch(err => {
        console.log("err",err);
        res.render('errorpage',err);
    });
  
};

module.exports.monthlyProgressEdit = async(req,res) => {
    try{
        const monthProgress = await monthlyProgress.findByPk(req.params.progressId);
        console.log("params",req.params.progressId);
        console.log("target",monthProgress.productionTarget);
        const categoryList = await cropCategory.findAll();
        res.render('center/monthlyProgress/monthlyProgressFormEdit', { title: 'মাসিক প্রতিবেদন',msg:'' ,success:'',user_id: req.session.user_id,categoryList: categoryList, monthProgress:monthProgress });
    }catch (err) {
        console.log(err)
    }
}

module.exports.monthlyProgressUpdate = async(req,res) => {
    var category= req.body.category;
    var subCategory= req.body.subCategory;
    var biboron= req.body.biboron;
    var breed= req.body.breed;
    var productionTarget= req.body.productionTarget;
    var productionCurrent= req.body.productionCurrent;
    var productionLast= req.body.productionLast;
    var productionTotal= req.body.productionTotal;
    var daePrapti= req.body.daePrapti;
    var lastYear= req.body.lastYear;
    var grandTotalProduction= req.body.grandTotalProduction;
    var bitoronCurrentMonth= req.body.bitotonCurrentMonth;
    var bitotonLastMonth= req.body.bitotonLastMonth;
    var bitoronTotal= req.body.bitoronTotal;
    var daeProdan= req.body.daeProdan;
    var deadWriteup= req.body.deadWriteup;
    var grandTotalBitoron= req.body.grandTotalBitoron;
    var mojud= req.body.mojud;
    var comment= req.body.comment;
    var year =req.body.year;
    var user_id =req.body.user_id;
    var editDate = req.body.editDate.toLowerCase();

    console.log('productionTotal=',editDate.toLowerCase());
    const currentMonth = res.locals.moment().format("MMM-YYYY").toLowerCase();

    const progress = await monthlyProgress.findByPk(req.params.progressId)
    const timeFrameParse = JSON.parse(progress.timeFrame)

    var NewDateTime = true;
    for (var i = 0; i<timeFrameParse.length; i++){
        if( timeFrameParse.time === editDate ){
            NewDateTime = false
        }
    }

    if (NewDateTime === true){
        var currentProduction = JSON.parse(progress.productionCurrent);
        var productionObj = {};
        productionObj["time"] =  editDate;
        productionObj["amount"] =  productionCurrent;
        currentProduction.push(productionObj)

        var currentDaePraptis = JSON.parse(progress.daePrapti);
        var daePraptiObj = {};
        daePraptiObj["time"] =  editDate;
        daePraptiObj["amount"] =  daePrapti;
        currentDaePraptis.push(daePraptiObj)

        var currentBitoron = JSON.parse(progress.bitoronCurrentMonth);
        var bitoronObj = {};
        bitoronObj["time"] =  editDate;
        bitoronObj["amount"] =  bitoronCurrentMonth;
        currentBitoron.push(bitoronObj)

        var currentDaeProdan = JSON.parse(progress.daeProdan);
        var daeProdanObj = {};
        daeProdanObj["time"] =  editDate;
        daeProdanObj["amount"] =  daeProdan;
        currentDaeProdan.push(daeProdanObj)

        var currentDeadWriteup = JSON.parse(progress.deadWriteup);
        var deadWriteupObj = {};
        deadWriteupObj["time"] =  editDate;
        deadWriteupObj["amount"] =  deadWriteup;
        currentDeadWriteup.push(deadWriteupObj)

        var currentMojud = JSON.parse(progress.mojud);
        var mojudObj = {};
        mojudObj["time"] =  editDate;
        mojudObj["amount"] =  mojud;
        currentMojud.push(mojudObj)

        var currentComment = JSON.parse(progress.comment);
        var commentObj = {};
        commentObj["time"] =  editDate;
        commentObj["msg"] =  comment;
        currentComment.push(commentObj)

        var time = JSON.parse(progress.timeFrame);
        var timeObj = {};
        timeObj["time"] =  editDate;
        time.push(timeObj)
    }
    else{

    }



    const categoryName = await cropCategory.findByPk(category)
    const subCategoryName = await cropCategory.findByPk(subCategory)
    const biboronName = await cropCategory.findByPk(biboron)
    const breedName = await cropCategory.findByPk(breed)

    await monthlyProgress.update(
        {
            category: categoryName.name,
            subCategory: subCategoryName.name,
            biboron: biboronName.name,
            breed: breedName.name,
            productionTarget: productionTarget,
            productionCurrent: JSON.stringify(currentProduction),
            // productionTotal: JSON.stringify(totalProduction),
            daePrapti: JSON.stringify(currentDaePraptis),
            bitoronCurrentMonth: JSON.stringify(currentBitoron),
            // bitoronTotal: JSON.stringify(totalBitoron),

            daeProdan: JSON.stringify(currentDaeProdan),
            deadWriteup: JSON.stringify(currentDeadWriteup),
            mojud: JSON.stringify(currentMojud),
            comment: JSON.stringify(currentComment),
            timeFrame: time,
            year: year,
            center_id:user_id

        },
        {
            where: {id: req.params.progressId}
        }
    )
    .then(data => {
        console.log('productionTotal=',data);
        res.redirect('/center/monthlyProgress');
    }).catch(err => {
        console.log("err",err);
    });

}
//monthlyProgress controller end