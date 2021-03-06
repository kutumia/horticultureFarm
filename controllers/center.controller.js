const db = require("../models");
const Op = db.Sequelize.Op;
const { fn, col, cast } = db.sequelize;
const fs = require("fs");
const path = require("path");

let pdf = require("html-pdf");
let ejs = require("ejs");
const center = db.center;
const charaKolom = db.charaKolom;
const folMosholla = db.folMosholla;
const otherFlower = db.otherFlower;
const seasonalFlower = db.seasonalFlower;
const summerVeg = db.summerVeg;
const winterVeg = db.winterVeg;
const workerInfo = db.workerInfo;
const apa = db.apa;
const apaCode = db.apaCode;
const loan = db.loan;
const specialCoconut = db.specialCoconut;
const revolvingFund = db.revolvingFund;
const chak1 = db.chak1;
const chak2 = db.chak2;
const rajossho = db.rajossho;
const expense = db.expense;
const monthlyProgress = db.monthlyProgress;
const cropCategory = db.cropcategory;
const rajosshoCode = db.rajosshoCode;
const expenseCode = db.expenseCode;
const podobiList = db.podobiList;
const dashImages = db.dashImage;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { request, response } = require("express");
const express = require("express");

module.exports.centertable = async (req, res) => {
  res.json({ message: "hello center" });
};

module.exports.allcenter = async (req, res) => {
  res.json({ message: "hello center" });
};

module.exports.charaKolomFixed = async (req, res) => {
  try {
    const charaKoloms = await charaKolom.findAll();
    const folMoshollas = await folMosholla.findAll();
    const winterVegs = await winterVeg.findAll();
    const otherFlowers = await otherFlower.findAll();
    const seasonalFlowers = await seasonalFlower.findAll();
    const summerVegs = await summerVeg.findAll();
    res.render("charaKolomFixed", {
      title: "হরটিকালচার সেন্টারের চারা/কলমের বিক্রয়মূল্য",
      success: "",
      record1: charaKoloms,
      record2: folMoshollas,
      record3: winterVegs,
      record4: summerVegs,
      record5: otherFlowers,
      record6: seasonalFlowers,
    });
  } catch (err) {
    res.render("charaKolomFixed", {
      title: "হরটিকালচার সেন্টারের চারা/কলমের বিক্রয়মূল্য",
      success: "",
      record1: err,
      record2: err,
      record3: err,
      record4: err,
      record5: err,
      record6: err,
    });
  }
};
module.exports.centerlogin = async (req, res) => {
  res.render("center/login", {
    title: "Horticulture Wing Center Management Software",
    msg: "",
  });
};

module.exports.centerloginpost = async (req, res) => {
  try {
    const uname = req.body.uname;
    const password = req.body.password;
    center
      .findAll({ where: { uname: uname } })
      .then((data) => {
        if (data.length > 0) {
          bcrypt.compare(password, data[0].password, function (err, result) {
            if (result == true) {
              req.session.type = "center";
              req.session.user_id = data[0].id;
              const id = req.session.user_id;
              res.redirect("/center/dashboard");
            } else {
              return res.status(200).render("center/login", {
                title: "Horticulture Wing Center Management Software",
                msg: "Please provide a username and password",
              });
            }
          });
        } else {
          return res.status(200).render("center/login", {
            title: "Horticulture Wing Center Management Software",
            msg: "Please provide a username and password",
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials.",
        });
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports.centerDashboard = async (req, res) => {
  try {
    const dashImage = await dashImages.findAll({order: [
      ['createdAt', 'DESC'],
  ],
  attributes: ['id', 'title', 'image', 'createdAt', 'updatedAt']})
    const monthly_progress = await monthlyProgress.findAll({
      where: {
        center_id: req.session.user_id,
      },
    });
    const rajosshos = await rajossho.findAll({
      where: {
        center_id: req.session.user_id,
      },
    });

    var startRange = "";
    var endRange = "";
    if (res.locals.moment().format("M") < 7) {
      startRange =
        "jul" + "-" + res.locals.moment().subtract(1, "year").format("yyyy");
      endRange = "jul" + "-" + res.locals.moment().format("yyyy");
    } else {
      startRange = "jul" + "-" + res.locals.moment().format("yyyy");
      endRange =
        "jul" + "-" + res.locals.moment().add(1, "year").format("yyyy");
    }

    var totalProduct = 0;
    var totalBitoron = 0;
    var totalMojud = 0;
    var totalrajossho = 0;

    monthly_progress.forEach((row) => {
      const productTotalParse = JSON.parse(row.productionTotal);
      const bitoronParse = JSON.parse(row.bitoronTotal);
      const mojudParse = JSON.parse(row.mojud);
      productTotalParse.forEach((prodTotal) => {
        if (
          prodTotal.startTime === startRange &&
          prodTotal.endTime === endRange
        ) {
          totalProduct += parseInt(prodTotal.amount);
        }
      });
      bitoronParse.forEach((bitorTotal) => {
        if (
          bitorTotal.startTime === startRange &&
          bitorTotal.endTime === endRange
        ) {
          totalBitoron += parseInt(bitorTotal.amount);
        }
      });
      // mojudParse.forEach((mojuToal) => {
      //     if ( res.locals.moment( mojuToal.time ).isAfter(startRange) &&  res.locals.moment( mojuToal.time ).isBefore(endRange) ){
      //         totalMojud += parseInt(mojuToal.amount)
      //     }
      // })
    });
    rajosshos.forEach((row) => {
      totalrajossho += parseInt(row.total);
    });

    res.render("center/dashboard", {
      title: "Horticulture Wing Center Management Software",
      msg: "Welcome",
      dashImage:dashImage,
      totalrajossho: totalrajossho,
      totalProduction: totalProduct,
      totalBitoron: totalBitoron,
    });
  } catch (e) {
    console.log(e);
  }
};
module.exports.allCenterInfo = async (req, res) => {
  await center
    .findAll()
    .then((data) => {
      res.render("allCenterInfo", {
        title: "সেন্টারের যোগাযোগ তথ্য",
        success: "",
        records: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//signUp controller
module.exports.centersignup = async (req, res) => {
  res.render("center/signup", {
    title: "Horticulture Wing Center Management Software",
    msg: "",
  });
};
module.exports.centersignuppost = async (req, res) => {
  try {
    const { centers, uname, password, confirmPassword } = req.body;

    const data = await center.findAll({
      where: { uname: uname },
    });
    if (data.length > 0) {
      res.render("center/signup", {
        title: "Horticulture Wing Center Management Software",
        msg: "ERROR: The center is already enrolled!",
      });
    } else if (password !== confirmPassword) {
      return res.render("center/signup", {
        title: "Horticulture Wing Center Management Software",
        msg: "ERROR: Passwords do not match!",
      });
    } else {
      // var centers= center;
      // var kormokortas=kormokorta;
      // var podobis= podobi;
      // var mobiles= mobile;
      // var emails=email;
      const hashedPassword = await bcrypt.hash(password, 10);
      try {
        const createCenter = await center.create({
          uname: uname,
          password: hashedPassword,
          center: centers,
          pd_id: 1,
        });
        res.render("center/signup", {
          title: "Horticulture Wing Center Management Software",
          msg: "Center Registered Successfully!",
        });
      } catch (err) {
        console.log(err);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
//signUp controller end

//center controller
module.exports.center = async (req, res) => {
  await center
    .findAll({
      where: { id: req.session.user_id },
    })
    .then((data) => {
      res.render("center/centerInfo/center", {
        title: "সেন্টারের যোগাযোগ তথ্য",
        success: "",
        records: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });

  //  records:result
};
module.exports.centerEdit = async (req, res) => {
  await center
    .findByPk(req.params.id)
    .then((data) => {
      res.render("center/centerInfo/centerEdit", {
        title: "সেন্টারের যোগাযোগ তথ্য ফর্ম",
        msg: "",
        success: "",
        records: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports.centerEditPost = async (req, res) => {
  var kormokorta = req.body.kormokorta;
  var podobi = req.body.podobi;
  var mobile = req.body.mobile;
  var email = req.body.email;

  await center
    .update(
      {
        kormokorta: kormokorta,
        podobi: podobi,
        mobile: mobile,
        email: email,
      },
      {
        where: { id: req.params.id },
      }
    )
    .then((data) => {
      res.redirect("/center/center");
    })
    .catch((err) => {
      res.render("errorpage", err);
    });
};
module.exports.centerDelete = async (req, res) => {
  var centerDelete = await center.findByPk(req.params.id);
  try {
    centerDelete.destroy();
    res.redirect("/center/center");
  } catch {
    res.render("errorpage", err);
  }
};

//topSheet controller
module.exports.topSheet = async (req, res) => {
  res.render("center/topSheet/topSheet", { title: "টপশীট", success: "" });
};

module.exports.topSheetYear = async (req, res) => {
  try {
    const currentMonth = res.locals.moment().format("MMM-YYYY").toLowerCase();
    const selectedDate = req.body.year.toLowerCase();
    const cropCatg = await cropCategory.findAll({
      where: { type: "subCategory" },
    });
    const topSheets = await monthlyProgress.findAll({
      where: { center_id: req.session.user_id },
    });

    if (selectedDate === currentMonth) {
      res.render(
        "center/topSheet/topSheetTable",
        { records: topSheets, cropCatg: cropCatg, selectedDate:selectedDate },
        function (err, html) {
          res.send(html);
        }
      );
    } else {
      res.render(
        "center/topSheet/topSheetCustomTable",
        { records: topSheets, cropCatg: cropCatg, selectedDate: selectedDate },
        function (err, html) {
          res.send(html);
        }
      );
    }

  } catch (e) {
    console.log(e);
  }
};


module.exports.generatePdfTopSheet = async (req,res) => {
  try {
    const currentMonth = res.locals.moment().format("MMM-YYYY").toLowerCase();
    const selectedDate = req.params.selectedDate.toLowerCase();
    const cropCatg = await cropCategory.findAll({
      where: { type: "subCategory" },
    });
    const topSheets = await monthlyProgress.findAll({
      where: { center_id: req.session.user_id },
    });

    if (selectedDate === currentMonth) {

      ejs.renderFile(
          path.join(__dirname, "../views/center/topSheet", "pdf.ejs"),
          { records: topSheets, cropCatg: cropCatg, moment: res.locals.moment, dirname: __dirname },
          (err, data) => {
            if (err) {
              res.send(err);
            } else {
              var assesPath = path.join(__dirname, "../public/");
              assesPath = assesPath.replace(new RegExp(/\\/g), "/");

              var options = {
                height: "11.25in",
                width: "18.5in",
                header: {
                  height: "20mm",
                },
                footer: {
                  height: "20mm",
                },
                base: "file:///" + assesPath,
              };
              res.json({ html: data });
            }
          }
      )

    } else {

      ejs.renderFile(
          path.join(__dirname, "../views/center/topSheet", "customTablePdf.ejs"),
          { records: topSheets, cropCatg: cropCatg, selectedDate: selectedDate , moment: res.locals.moment, dirname: __dirname },
          (err, data) => {
            if (err) {
              res.send(err);
            } else {
              var assesPath = path.join(__dirname, "../public/");
              assesPath = assesPath.replace(new RegExp(/\\/g), "/");

              var options = {
                height: "11.25in",
                width: "18.5in",
                header: {
                  height: "20mm",
                },
                footer: {
                  height: "20mm",
                },
                base: "file:///" + assesPath,
              };
              res.json({ html: data });
            }
          }
      )

    }
  } catch (e) {
    console.log(e);
  }
}
//topSheet controller end


//workerInfo controller
module.exports.workerInfo = async (req, res) => {
  await workerInfo
    .findAll({
      where: { center_id: req.session.user_id },
    })
    .then((data) => {
      res.render("center/worker/workerInfo/workerInfo", {
        title: "শ্রমিকদের তথ্য",
        success: "",
        records: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });

  //  records:result
};

// module.exports.workerInfoYear = async (req, res) => {
//   await workerInfo
//     .findAll({
//       where: { center_id: req.session.user_id },
//     })
//     .then((data) => {
//       res.render(
//         "center/worker/workerInfo/workerInfoTable",
//         { records: data },
//         function (err, html) {
//           res.send(html);
//         }
//       );
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

module.exports.workerInfoForm = async (req, res) => {
  res.render("center/worker/workerInfo/workerInfoForm", {
    title: "শ্রমিকদের তথ্য",
    msg: "",
    success: "",
    user_id: req.session.user_id,
  });
};

module.exports.workerInfoFormPost = async (req, res) => {
  var podobi = req.body.podobi;
  var name = req.body.name;
  var fname = req.body.fname;
  var address = req.body.address;
  var mobile = req.body.mobile;
  var date = req.body.date;
  var nid = req.body.nid;
  var bank = req.body.bank;

  var user_id = req.body.user_id;
  if (podobi === "নিয়মিত") {
    var regularWorker = 1;
    var irregularWorker = 0;
  }
  if (podobi === "অনিয়মিত") {
    var regularWorker = 0;
    var irregularWorker = 1;
  }
  await workerInfo
    .create({
      podobi: podobi,
      name: name,
      fname: fname,
      address: address,
      mobile: mobile,
      date: date,
      nid: nid,
      bank: bank,
      regularWorker: regularWorker,
      irregularWorker: irregularWorker,
      center_id: user_id,
    })
    .then((data) => {
      req.flash("message", "Successfully added");
      res.redirect("/center/workerInfoForm");
    })
    .catch((err) => {
console.log(err);    });
};
module.exports.workerInfoEdit=async(req,res)=>{
  await workerInfo.findByPk(req.params.id)
  .then(data => {
      res.render('center/worker/workerInfo/workerInfoEdit', { title: 'শ্রমিকদের তথ্য',msg:'' ,success:'',records: data});
  })
  .catch(err => {
      console.log("outside",err);
  })
};
module.exports.workerInfoEditPost=async(req,res)=>{
  var center = req.body.center;
  var porichito = req.body.porichito;
  var kormokorta = req.body.kormokorta;
  var nijDistrict = req.body.nijDistrict;
  var podobi = req.body.podobi;
  var birthDate = req.body.birthDate;
  var firstdate = req.body.firstdate;
  var presentDate = req.body.presentDate;
  var pastWorkstation = req.body.pastWorkstation;
  var comment = req.body.comment;
  var user_id = req.body.user_id;
  await workerInfo.update({ 
    center: center,
    porichito: porichito,
    kormokorta: kormokorta,
    nijDistrict: nijDistrict,
    podobi: podobi,
    birthDate: birthDate,
    firstdate: firstdate,
    presentDate: presentDate,
    pastWorkstation: pastWorkstation,
    comment: comment,
  },
  {
      where: {id: req.params.id}
  }).then(data => {
      res.redirect('/center/workerInfo');
  }).catch(err => {
      res.render('errorpage',err);
  });
};
module.exports.workerInfoDelete=async(req,res)=>{
  var workerInfoDelete = await workerInfo.findByPk(req.params.id);
  try {
    workerInfoDelete.destroy();
      res.redirect("/center/workerInfo");
  }
  catch{
      res.render('errorpage',err);
  }
  
};
module.exports.generatePdfworkerInfo = async (req, res) => {
  try {
    var centerNames= await center.findOne({
      where: { id: req.session.user_id },
    })
   var data= await workerInfo
    .findAll({
      where: {center_id: req.session.user_id },
    })
      ejs.renderFile(
          path.join(__dirname, "../views/center/worker/workerInfo", "pdf.ejs"),
          { records: data,centerName:centerNames, },
          (err, data) => {
            if (err) {
              console.log("error", err);
              res.send(err);
            } else {
              var assesPath = path.join(__dirname, "../public/");
              // console.log(assesPath);
              assesPath = assesPath.replace(new RegExp(/\\/g), "/");

              var options = {
                height: "11.25in",
                width: "18.5in",
                header: {
                  height: "20mm",
                },
                footer: {
                  height: "20mm",
                },
                base: "file:///" + assesPath,
              };
              res.json({ html: data });
            }
          }
      )
    
    
  } catch (e) {
    console.log(e);
  }

};                                        
//workerInfo controller end

//workerNum controller
module.exports.workerNum = async (req, res) => {
  await workerInfo
    .findAll({
      where: {
        center_id: req.session.user_id,

      },
    })
    .then((data) => {
      var reg = 0;
      var irreg = 0;
      data.forEach(function (row) {
        if (row.regularWorker !== 0) {
          reg += 1;
        }
      });
      data.forEach(function (row) {
        if (row.irregularWorker !== 0) {
          irreg += 1;
        }
      });
      var total;
      total = reg + irreg;
      res.render("center/worker/workerNum/workerNum", {
        title: "শ্রমিকদের সংখ্যা",
        success: "",
        totals: total,
        regs: reg,
        irregs: irreg,
        records: data,
      });
    })
    .catch((err) => {
      console.log("outside",err);
    });

  //  records:result
};
module.exports.generatePdfworkerNum  = async (req, res) => {
  try {
    var centerNames= await center.findOne({
      where: { id: req.session.user_id },
    })
    var data=await workerInfo.findAll({where: {center_id: req.session.user_id,year: req.body.year,month: req.body.month},})
      var reg = 0;
      var irreg = 0;
      data.forEach(function (row) {
        if (row.regularWorker !== 0) {
          reg += 1;
        }
      });
      data.forEach(function (row) {
        if (row.irregularWorker !== 0) {
          irreg += 1;
        }
      });
      var total = reg + irreg; 
      ejs.renderFile(
          path.join(__dirname, "../views/center/worker/workerNum", "pdf.ejs"),
          { records: data,centerName:centerNames,totals: total,regs: reg,irregs: irreg,dirname: __dirname },
          (err, data) => {
            if (err) {
              console.log("error", err);
              res.send(err);
            } else {
              var assesPath = path.join(__dirname, "../public/");
              // console.log(assesPath);
              assesPath = assesPath.replace(new RegExp(/\\/g), "/");

              var options = {
                height: "11.25in",
                width: "18.5in",
                header: {
                  height: "20mm",
                },
                footer: {
                  height: "20mm",
                },
                base: "file:///" + assesPath,
              };
              res.json({ html: data });
            }
          }
      )
    
    
  } catch (e) {
    console.log(e);
  }

};
//irregularWorker controller end

//apa controller
module.exports.apa = async (req, res) => {
  await apa
    .findAll({
      where: { center_id: req.session.user_id },
    })
    .then((data) => {
      res.render("center/apa/apa", {
        title: "এপিএ",
        success: "",
        records: data,
      });
    })
    .catch((err) => {
      console.log("outside",err);
    });

  //  records:result
};

module.exports.apaYear = async (req, res) => {
  await apa
    .findAll({
      where: { year: req.body.year, center_id: req.session.user_id },
    })
    .then((data) => {
      res.render(
        "center/apa/apaTable",
        { records: data },
        function (err, html) {
          res.send(html);
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.apaForm = async (req, res) => {
  try {
    const apaCodes = await apaCode.findAll();
    res.render("center/apa/apaForm", {
      title: "এপিএ",
      msg: "",
      success: "",
      user_id: req.session.user_id,
      apaCodes: apaCodes,
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports.apaFormPost = async (req, res) => {
  var uddessho = req.body.uddessho;
  var maan = req.body.maan;
  var work = req.body.work;
  var shuchok = req.body.shuchok;
  var ekok = req.body.ekok;
  var shuchokMaan = req.body.shuchokMaan;
  var best = parseFloat(req.body.best);
  var otiUttam = req.body.otiUttam;
  var uttam = req.body.uttam;
  var cholti = req.body.cholti;
  var below = req.body.below;
  var firstThree = parseFloat(req.body.firstThree);
  var secondThree = parseFloat(req.body.secondThree);
  var thirdThree = parseFloat(req.body.thirdThree);
  var fourthThree = parseFloat(req.body.fourthThree);
  var year = req.body.year;
  var user_id = req.body.user_id;
  var totals = firstThree + secondThree + thirdThree + fourthThree;
  var total = totals.toFixed(2);
  var percentages = (total / best) * 100;
  var percentage = percentages.toFixed(2);

  const uddesshoName = await apaCode.findByPk(uddessho);
  const maanName = await apaCode.findByPk(maan);
  const workName = await apaCode.findByPk(work);
  const shuchokName = await apaCode.findByPk(shuchok);
  const ekokName = await apaCode.findByPk(ekok);
  const shuchokMaanName = await apaCode.findByPk(shuchokMaan);

  await apa
    .create({
      uddessho: uddesshoName.name,
      maan: maanName.name,
      work: workName.name,
      shuchok: shuchokName.name,
      ekok: ekokName.name,
      shuchokMaan: shuchokMaanName.name,
      best: best,
      otiUttam: otiUttam,
      uttam: uttam,
      cholti: cholti,
      below: below,
      firstThree: firstThree,
      secondThree: secondThree,
      thirdThree: thirdThree,
      fourthThree: fourthThree,
      year: year,
      total: total,
      percentage: percentage,
      center_id: user_id,
    })
    .then((data) => {
      req.flash("message", "Successfully added");
      res.redirect("/center/apaForm");
    })
    .catch((err) => {
      res.render("errorpage", err);
    });
};
module.exports.fetchMaan = async (req, res) => {
  await apaCode
    .findAll({
      where: { parent_id: req.body.uddessho },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.fetchWork = async (req, res) => {
  await apaCode
    .findAll({
      where: { parent_id: req.body.maan },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.fetchShuchok = async (req, res) => {
  await apaCode
    .findAll({
      where: { parent_id: req.body.work },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports.fetchEkok = async (req, res) => {
  await apaCode
    .findAll({
      where: { parent_id: req.body.shuchok },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.fetchShuchokMaan = async (req, res) => {
  await apaCode
    .findAll({
      where: { parent_id: req.body.shuchok },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports.generatePdfapa = async (req, res) => {
  try {
    var centerNames= await center.findOne({
      where: { id: req.session.user_id },
    })
  var data= await apa.findAll({
      where: { year: req.body.year, center_id: req.session.user_id },
    })
      ejs.renderFile(
          path.join(__dirname, "../views/center/apa/", "pdf.ejs"),
          { records: data,centerName:centerNames,dirname: __dirname },
          (err, data) => {
            if (err) {
              console.log("error", err);
              res.send(err);
            } else {
              var assesPath = path.join(__dirname, "../public/");
              // console.log(assesPath);
              assesPath = assesPath.replace(new RegExp(/\\/g), "/");

              var options = {
                height: "11.25in",
                width: "18.5in",
                header: {
                  height: "20mm",
                },
                footer: {
                  height: "20mm",
                },
                base: "file:///" + assesPath,
              };
              res.json({ html: data });
            }
          }
      )
    
    
  } catch (e) {
    console.log(e);
  }

};
//apa controller end

//loan controller
module.exports.loan = async (req, res) => {
  await loan
    .findAll({
      where: { center_id: req.session.user_id },
    })
    .then((data) => {
      res.render("center/loan/loan", {
        title: "ঋণ বিতরণ ও আদায় এর অগ্রগতির প্রতিবেদন",
        success: "",
        records: data,
      });
    })
    .catch((err) => {
      console.log("outside",err);
    });

  //  records:result
};

module.exports.loanYear = async (req, res) => {
  await loan
    .findAll({
      where: { year: req.body.year, center_id: req.session.user_id },
    })
    .then((data) => {
      res.render(
        "center/loan/loanTable",
        { records: data },
        function (err, html) {
          res.send(html);
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.loanForm = async (req, res) => {
  res.render("center/loan/loanForm", {
    title: "ঋণ বিতরণ ও আদায় এর অগ্রগতির প্রতিবেদন",
    msg: "",
    success: "",
    user_id: req.session.user_id,
  });
};

module.exports.loanFormPost = async (req, res) => {
  var boraddo = req.body.boraddo;
  var bitoron1 = req.body.bitoron1;
  var aday1 = req.body.aday1;
  var left1 = req.body.left1;
  var bitoron2 = req.body.bitoron2;
  var aday2 = req.body.aday2;
  var left2 = req.body.left2;
  var comment = req.body.comment;
  var year = req.body.year;
  var user_id = req.body.user_id;

  await loan
    .create({
      boraddo: boraddo,
      bitoron1: bitoron1,
      aday1: aday1,
      left1: left1,
      bitoron2: bitoron2,
      aday2: aday2,
      left2: left2,
      comment: comment,
      year: year,
      center_id: user_id,
    })
    .then((data) => {
      req.flash("message", "Successfully added");
      res.redirect("/center/loanForm");
    })
    .catch((err) => {
      res.render("errorpage", err);
    });
};
module.exports.generatePdfloan = async (req, res) => {
  try {
    var centerNames= await center.findOne({
      where: { id: req.session.user_id },
    })
  var data= await loan.findAll({
      where: { year: req.body.year, center_id: req.session.user_id },
    })
      ejs.renderFile(
          path.join(__dirname, "../views/center/loan/", "pdf.ejs"),
          { records: data,centerName:centerNames,dirname: __dirname },
          (err, data) => {
            if (err) {
              console.log("error", err);
              res.send(err);
            } else {
              var assesPath = path.join(__dirname, "../public/");
              // console.log(assesPath);
              assesPath = assesPath.replace(new RegExp(/\\/g), "/");

              var options = {
                height: "11.25in",
                width: "18.5in",
                header: {
                  height: "20mm",
                },
                footer: {
                  height: "20mm",
                },
                base: "file:///" + assesPath,
              };
              res.json({ html: data });
            }
          }
      )
    
    
  } catch (e) {
    console.log(e);
  }

};
//apa controller end

//specialCoconut controller
module.exports.specialCoconut = async (req, res) => {
  await specialCoconut
    .findAll({
      where: { center_id: req.session.user_id },
    })
    .then((data) => {
      res.render("center/specialCoconut/specialCoconut", {
        title: "বিশেষ নারিকেল কর্মসূচি",
        success: "",
        records: data,
      });
    })
    .catch((err) => {
      console.log("outside",err);
    });

  //  records:result
};

module.exports.specialCoconutYear = async (req, res) => {
  await specialCoconut
    .findAll({
      where: { year: req.body.year, center_id: req.session.user_id },
    })
    .then((data) => {
      res.render(
        "center/specialCoconut/specialCoconutTable",
        { records: data },
        function (err, html) {
          res.send(html);
        }
      );
    })
    .catch((err) => {
      console.log("outside",err);
    });
};

module.exports.specialCoconutForm = async (req, res) => {
  res.render("center/specialCoconut/specialCoconutForm", {
    title: "বিশেষ নারিকেল কর্মসূচি",
    msg: "",
    success: "",
    user_id: req.session.user_id,
  });
};

module.exports.specialCoconutFormPost = async (req, res) => {
  var center = req.body.center;
  var boraddo = req.body.boraddo;
  var target = req.body.target;
  var boughtNarikel = req.body.boughtNarikel;
  var seedProduction = req.body.seedProduction;
  var deadSeed = req.body.deadSeed;
  var salableSeedTarget = req.body.salableSeedTarget;
  var salableSeedAchieved = req.body.salableSeedAchieved;
  var salableSeedPercentage = req.body.salableSeedPercentage;
  var salableSeedNumber = req.body.salableSeedNumber;
  var soldSeed = req.body.soldSeed;
  var soldSeedPrice = req.body.soldSeedPrice;
  var presentMojud = req.body.presentMojud;
  var earnedMoneyDD = req.body.earnedMoneyDD;
  var earnedMoneyDate = req.body.earnedMoneyDate;
  var earnedMoneyHead = req.body.earnedMoneyHead;
  var earnedMoneyLocalBank = req.body.earnedMoneyLocalBank;
  var comment = req.body.comment;
  var year = req.body.year;
  var user_id = req.body.user_id;

  await specialCoconut
    .create({
      center: center,
      boraddo: boraddo,
      target: target,
      boughtNarikel: boughtNarikel,
      seedProduction: seedProduction,
      deadSeed: deadSeed,
      salableSeedTarget: salableSeedTarget,
      salableSeedAchieved: salableSeedAchieved,
      salableSeedPercentage: salableSeedPercentage,
      salableSeedNumber: salableSeedNumber,
      soldSeed: soldSeed,
      soldSeedPrice: soldSeedPrice,
      presentMojud: presentMojud,
      earnedMoneyDD: earnedMoneyDD,
      earnedMoneyDate: earnedMoneyDate,
      earnedMoneyHead: earnedMoneyHead,
      earnedMoneyLocalBank: earnedMoneyLocalBank,
      comment: comment,
      year: year,
      center_id: user_id,
    })
    .then((data) => {
      req.flash("message", "Successfully added");
      res.redirect("/center/specialCoconutForm");
    })
    .catch((err) => {
      res.render("errorpage", err);
    });
};
module.exports.generatePdfspecialCoconut = async (req, res) => {
  try {
    var centerNames= await center.findOne({
      where: { id: req.session.user_id },
    })
  var data= await specialCoconut.findAll({
      where: { year: req.body.year, center_id: req.session.user_id },
    })
      ejs.renderFile(
          path.join(__dirname, "../views/center/specialCoconut/", "pdf.ejs"),
          { records: data,centerName:centerNames,dirname: __dirname },
          (err, data) => {
            if (err) {
              console.log("error", err);
              res.send(err);
            } else {
              var assesPath = path.join(__dirname, "../public/");
              // console.log(assesPath);
              assesPath = assesPath.replace(new RegExp(/\\/g), "/");

              var options = {
                height: "11.25in",
                width: "18.5in",
                header: {
                  height: "20mm",
                },
                footer: {
                  height: "20mm",
                },
                base: "file:///" + assesPath,
              };
              res.json({ html: data });
            }
          }
      )
    
    
  } catch (e) {
    console.log(e);
  }

};
//specialCoconut controller end

//revolvingFund controller
module.exports.revolvingFund = async (req, res) => {
  await revolvingFund
    .findAll({
      where: { center_id: req.session.user_id },
    })
    .then((data) => {
      res.render("center/revolvingFund/revolvingFund", {
        title: "রিভলভিং ফান্ড",
        success: "",
        records: data,
      });
    })
    .catch((err) => {
      console.log("outside",err);

    });

  //  records:result
};

module.exports.revolvingFundYear = async (req, res) => {
  await revolvingFund
    .findAll({
      where: { year: req.body.year, center_id: req.session.user_id },
    })
    .then((data) => {
      res.render(
        "center/revolvingFund/revolvingFundTable",
        { records: data },
        function (err, html) {
          res.send(html);
        }
      );
    })
    .catch((err) => {
      console.log("outside",err);

    });
};

module.exports.revolvingFundForm = async (req, res) => {
  res.render("center/revolvingFund/revolvingFundForm", {
    title: "রিভলভিং ফান্ড",
    msg: "",
    success: "",
    user_id: req.session.user_id,
  });
};

module.exports.revolvingFundFormPost = async (req, res) => {
  var prapti = req.body.prapti;
  var presentOrtho = req.body.presentOrtho;
  var pastOrtho = req.body.pastOrtho;
  var totalOrtho = req.body.totalOrtho;
  var bank = req.body.bank;
  var soldPast = req.body.soldPast;
  var soldPresent = req.body.soldPresent;
  var soldTotal = req.body.soldTotal;
  var chara = req.body.chara;
  var productionTarget = req.body.productionTarget;
  var productionPast = req.body.productionPast;
  var productionPresent = req.body.productionPresent;
  var productionTotal = req.body.productionTotal;
  var bitoronPast = req.body.bitoronPast;
  var bitoronPresent = req.body.bitoronPresent;
  var bitoronDead = req.body.bitoronDead;
  var bitoronTotal = req.body.bitoronTotal;
  var totalMojud = req.body.totalMojud;
  var year = req.body.year;
  var user_id = req.body.user_id;

  await revolvingFund
    .create({
      prapti: prapti,
      presentOrtho: presentOrtho,
      pastOrtho: pastOrtho,
      totalOrtho: totalOrtho,
      bank: bank,
      soldPast: soldPast,
      soldPresent: soldPresent,
      soldTotal: soldTotal,
      chara: chara,
      productionTarget: productionTarget,
      productionPast: productionPast,
      productionPresent: productionPresent,
      productionTotal: productionTotal,
      bitoronPast: bitoronPast,
      bitoronPresent: bitoronPresent,
      bitoronDead: bitoronDead,
      bitoronTotal: bitoronTotal,
      totalMojud: totalMojud,
      year: year,
      center_id: user_id,
    })
    .then((data) => {
      req.flash("message", "Successfully added");
      res.redirect("/center/revolvingFundForm");
    })
    .catch((err) => {
      res.render("errorpage", err);
    });
};
module.exports.generatePdfrevolvingFund = async (req, res) => {
  try {
    var centerNames= await center.findOne({
      where: { id: req.session.user_id },
    })
  var data= await revolvingFund.findAll({
      where: { year: req.body.year, center_id: req.session.user_id },
    })
      ejs.renderFile(
          path.join(__dirname, "../views/center/revolvingFund/", "pdf.ejs"),
          { records: data,centerName:centerNames,dirname: __dirname },
          (err, data) => {
            if (err) {
              console.log("error", err);
              res.send(err);
            } else {
              var assesPath = path.join(__dirname, "../public/");
              // console.log(assesPath);
              assesPath = assesPath.replace(new RegExp(/\\/g), "/");

              var options = {
                height: "11.25in",
                width: "18.5in",
                header: {
                  height: "20mm",
                },
                footer: {
                  height: "20mm",
                },
                base: "file:///" + assesPath,
              };
              res.json({ html: data });
            }
          }
      )
    
    
  } catch (e) {
    console.log(e);
  }

};
//revolvingFund controller end

//chak1 controller
module.exports.chak1 = async (req, res) => {
  await chak1
    .findAll({
      where: { center_id: req.session.user_id },
    })
    .then((data) => {
      res.render("center/employee/chak1/employeeChak1", {
        title: "ক্যাডার/নন ক্যাডার কর্মকর্তাদের নাম ও পদবী সহ শূন্য পদের তথ্য",
        success: "",
        records: data,
      });
    })
    .catch((err) => {
      console.log("outside",err);

    });

  //  records:result
};

module.exports.chak1Year = async (req, res) => {
    await chak1.findAll({
        where: { center_id: req.session.user_id }
    })
        .then(data => {
            res.render('center/employee/chak1/employeeChak1Table', { records: data }, function (err, html) {
                res.send(html);
            });
        })
        .catch(err => {
          console.log("outside",err);
        })

};

module.exports.chak1Form = async (req, res) => {
  await center.findOne({
    where: { id: req.session.user_id }
})
    .then(data => {
  res.render("center/employee/chak1/employeeChak1Form", {
    title: "ক্যাডার/নন ক্যাডার কর্মকর্তাদের নাম ও পদবী সহ শূন্য পদের তথ্য",
    msg: "",
    success: "",
    centers:data.center,
    user_id: req.session.user_id,
  });
})
.catch(err => {
  console.log("outside",err);
})
};

module.exports.chak1FormPost = async (req, res) => {
  var center = req.body.center;
  var porichito = req.body.porichito;
  var kormokorta = req.body.kormokorta;
  var nijDistrict = req.body.nijDistrict;
  var podobi = req.body.podobi;
  var birthDate = req.body.birthDate;
  var firstdate = req.body.firstdate;
  var presentDate = req.body.presentDate;
  var pastWorkstation = req.body.pastWorkstation;
  var comment = req.body.comment;

  var user_id = req.body.user_id;

  await chak1
    .create({
      center: center,
      porichito: porichito,
      kormokorta: kormokorta,
      nijDistrict: nijDistrict,
      podobi: podobi,
      birthDate: birthDate,
      firstdate: firstdate,
      presentDate: presentDate,
      pastWorkstation: pastWorkstation,
      comment: comment,

      center_id: user_id,
    })
    .then((data) => {
      req.flash("message", "Successfully added");
      res.redirect("/center/chak1Form");
    })
    .catch((err) => {
console.log(err);    });
};
module.exports.chak1Edit=async(req,res)=>{
  await chak1.findByPk(req.params.id)
  .then(data => {
      res.render('center/employee/chak1/employeeChak1Edit', { title: 'ক্যাডার/নন ক্যাডার কর্মকর্তাদের নাম ও পদবী সহ শূন্য পদের তথ্য',msg:'' ,success:'',records: data});
  })
  .catch(err => {
      console.log("outside",err);
  })
};
module.exports.chak1EditPost=async(req,res)=>{
  var center = req.body.center;
  var porichito = req.body.porichito;
  var kormokorta = req.body.kormokorta;
  var nijDistrict = req.body.nijDistrict;
  var podobi = req.body.podobi;
  var birthDate = req.body.birthDate;
  var firstdate = req.body.firstdate;
  var presentDate = req.body.presentDate;
  var pastWorkstation = req.body.pastWorkstation;
  var comment = req.body.comment;
  var user_id = req.body.user_id;
  await chak1.update({ 
    center: center,
    porichito: porichito,
    kormokorta: kormokorta,
    nijDistrict: nijDistrict,
    podobi: podobi,
    birthDate: birthDate,
    firstdate: firstdate,
    presentDate: presentDate,
    pastWorkstation: pastWorkstation,
    comment: comment,
  },
  {
      where: {id: req.params.id}
  }).then(data => {
      res.redirect('/center/chak1');
  }).catch(err => {
      res.render('errorpage',err);
  });
};
module.exports.chak1Delete=async(req,res)=>{
  var chak1Delete = await chak1.findByPk(req.params.id);
  try {
    chak1Delete.destroy();
      res.redirect("/center/chak1");
  }
  catch{
      res.render('errorpage',err);
  }
  
};
module.exports.generatePdfchak1 = async (req, res) => {
  try {
    var centerNames= await center.findOne({
      where: { id: req.session.user_id },
    })
  var data= await chak1.findAll({
      where: { year: req.body.year,month: req.body.month, center_id: req.session.user_id },
    })
      ejs.renderFile(
          path.join(__dirname, "../views/center/employee/chak1/", "pdf.ejs"),
          { records: data,centerName:centerNames,dirname: __dirname },
          (err, data) => {
            if (err) {
              console.log("error", err);
              res.send(err);
            } else {
              var assesPath = path.join(__dirname, "../public/");
              // console.log(assesPath);
              assesPath = assesPath.replace(new RegExp(/\\/g), "/");

              var options = {
                height: "11.25in",
                width: "18.5in",
                header: {
                  height: "20mm",
                },
                footer: {
                  height: "20mm",
                },
                base: "file:///" + assesPath,
              };
              res.json({ html: data });
            }
          }
      )
    
    
  } catch (e) {
    console.log(e);
  }

};


//chak1 controller end

//chak2 controller
module.exports.chak2 = async (req, res) => {
  await chak2
    .findAll({
      where: { center_id: req.session.user_id },
    })
    .then((data) => {
      res.render("center/employee/chak2/employeeChak2", {
        title:
          "হরটিকালচার সেন্টারের কর্মকতা/কর্মচারীদের মঞ্জুরীকৃত পদ ও শুণ্য পদের সংখ্যা",
        success: "",
        records: data,
      });
    })
    .catch((err) => {
      console.log("outside",err);

    });

  //  records:result
};

module.exports.chak2Year = async (req, res) => {
    await chak2.findAll({
        where: { center_id: req.session.user_id}
    })
    .then((data) => {
      res.render(
        "center/employee/chak2/employeeChak2Table",
        { records: data },
        function (err, html) {
          res.send(html);
        }
      );
    })
    .catch((err) => {
      console.log("outside",err);

    });
}; 

module.exports.chak2Form = async (req, res) => {
  try {
    var podobiLists = await podobiList.findAll();
    res.render("center/employee/chak2/employeeChak2Form", {
      title:
        "হরটিকালচার সেন্টারের কর্মকতা/কর্মচারীদের মঞ্জুরীকৃত পদ ও শুণ্য পদের সংখ্যা",
      msg: "",
      success: "",
      user_id: req.session.user_id,
      podobiLists: podobiLists,
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports.chak2FormPost = async (req, res) => {
  var name = req.body.name;
  var grade = req.body.grade;
  var pod = req.body.pod;
  var working = req.body.working;
  var shunno = parseInt(pod)-parseInt(working);
  var comment = req.body.comment;

  var user_id = req.body.user_id;

  await chak2
    .create({
      name: name,
      grade: grade,
      pod: pod,
      working: working,
      shunno: shunno,
      comment: comment,

      center_id: user_id,
    })
    .then((data) => {
      req.flash("message", "Successfully added");
      res.redirect("/center/chak2Form");
    })
    .catch((err) => {
console.log(err);    });
};
module.exports.fetchPodobiList = async (req, res) => {

  await podobiList
    .findOne({
      where: { podobi: req.body.podobi },
    })
    .then((data) => {
    
      var grade = data.grade;
      res.send(grade);
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports.chak2Edit=async(req,res)=>{
  await chak2.findByPk(req.params.id)
  .then(data => {
      res.render('center/employee/chak2/employeeChak2Edit', { title: 'হরটিকালচার সেন্টারের কর্মকতা/কর্মচারীদের মঞ্জুরীকৃত পদ ও শুণ্য পদের সংখ্যা',msg:'' ,success:'',records: data});
  })
  .catch(err => {
      console.log("outside",err);
  })
};
module.exports.chak2EditPost=async(req,res)=>{
  var name = req.body.name;
  var grade = req.body.grade;
  var pod = req.body.pod;
  var working = req.body.working;
  var shunno = parseInt(pod)-parseInt(working);
  var comment = req.body.comment;
  var month = req.body.month;
  var year = req.body.year;
  var user_id = req.body.user_id;
  await chak2.update({ 
    name: name,
    grade: grade,
    pod: pod,
    working: working,
    shunno: shunno,
    comment: comment,
    month: month,
    year: year,
  },
  {
      where: {id: req.params.id}
  }).then(data => {
      res.redirect('/center/chak2');
  }).catch(err => {
      res.render('errorpage',err);
  });
};
module.exports.chak2Delete=async(req,res)=>{
  var chak2Delete = await chak2.findByPk(req.params.id);
  try {
    chak2Delete.destroy();
      res.redirect("/center/chak2");
  }
  catch{
      res.render('errorpage',err);
  }
  
};
module.exports.generatePdfchak2 = async (req, res) => {
  try {
    var centerNames= await center.findOne({
      where: { id: req.session.user_id },
    })
  var data= await chak2.findAll({
      where: { year: req.body.year, month: req.body.month,center_id: req.session.user_id },
    })
      ejs.renderFile(
          path.join(__dirname, "../views/center/employee/chak2/", "pdf.ejs"),
          { records: data,centerName:centerNames,dirname: __dirname },
          (err, data) => {
            if (err) {
              console.log("error", err);
              res.send(err);
            } else {
              var assesPath = path.join(__dirname, "../public/");
              // console.log(assesPath);
              assesPath = assesPath.replace(new RegExp(/\\/g), "/");

              var options = {
                height: "11.25in",
                width: "18.5in",
                header: {
                  height: "20mm",
                },
                footer: {
                  height: "20mm",
                },
                base: "file:///" + assesPath,
              };
              res.json({ html: data });
            }
          }
      )
    
    
  } catch (e) {
    console.log(e);
  }

};
//chak2 controller end

//rajossho controller
module.exports.rajossho = async (req, res) => {
  await rajossho
    .findAll({
      where: { center_id: req.session.user_id },
    })
    .then((data) => {
      res.render("center/rajossho/rajossho", {
        title: "মাসিক রাজস্ব অর্থ প্রাপ্তির হিসাব",
        success: "",
        records: data,
      });
    })
    .catch((err) => {
      console.log("outside",err);

    });

  //  records:result
};

module.exports.rajosshoYear = async (req, res) => {
  await rajossho
    .findAll({
      where: { year: req.body.year, center_id: req.session.user_id },
    })
    .then((data) => {
      res.render(
        "center/rajossho/rajosshoTable",
        { records: data },
        function (err, html) {
          res.send(html);
        }
      );
    })
    .catch((err) => {
      console.log("outside",err);

    });
};

module.exports.rajosshoForm = async (req, res) => {
  try {
    var rajosshoCodes = await rajosshoCode.findAll();
    res.render("center/rajossho/rajosshoForm", {
      title: "মাসিক রাজস্ব অর্থ প্রাপ্তির হিসাব",
      msg: "",
      success: "",
      user_id: req.session.user_id,
      rajosshoCodes: rajosshoCodes,
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports.rajosshoFormPost = async (req, res) => {
  var code = req.body.code;
  var upokhat = req.body.upokhat;
  var july1 = req.body.july1;
  var august1 = req.body.august1;
  var sept1 = req.body.sept1;
  var oct1 = req.body.oct1;
  var nov1 = req.body.nov1;
  var dec1 = req.body.dec1;
  var jan2 = req.body.jan2;
  var feb2 = req.body.feb2;
  var march2 = req.body.march2;
  var apr2 = req.body.apr2;
  var may2 = req.body.may2;
  var june2 = req.body.june2;
  var year = req.body.year;
  var user_id = req.body.user_id;

  const upokhatName = await rajosshoCode.findByPk(upokhat);

  if (july1 == null) {
    july1 = 0;
  }
  if (august1 == null) {
    august1 = 0;
  }
  if (sept1 == null) {
    sept1 = 0;
  }
  if (oct1 == null) {
    oct1 = 0;
  }
  if (nov1 == null) {
    nov1 = 0;
  }
  if (dec1 == null) {
    dec1 = 0;
  }
  if (jan2 == null) {
    jan2 = 0;
  }
  if (feb2 == null) {
    feb2 = 0;
  }
  if (march2 == null) {
    march2 = 0;
  }
  if (apr2 == null) {
    apr2 = 0;
  }
  if (may2 == null) {
    may2 = 0;
  }
  if (june2 == null) {
    june2 = 0;
  }
  var july1 = parseInt(july1);
  var august1 = parseInt(august1);
  var sept1 = parseInt(sept1);
  var oct1 = parseInt(oct1);
  var nov1 = parseInt(nov1);
  var dec1 = parseInt(dec1);
  var jan2 = parseInt(jan2);
  var feb2 = parseInt(feb2);
  var march2 = parseInt(march2);
  var apr2 = parseInt(apr2);
  var may2 = parseInt(may2);
  var june2 = parseInt(june2);
  var total =
    july1 +
    august1 +
    sept1 +
    oct1 +
    nov1 +
    dec1 +
    jan2 +
    feb2 +
    march2 +
    apr2 +
    may2 +
    june2;

  var year = req.body.year;
  var user_id = req.body.user_id;

  await rajossho
    .create({
      code: code,
      upokhat: upokhatName.upokhat,
      july1: july1,
      august1: august1,
      sept1: sept1,
      oct1: oct1,
      nov1: nov1,
      dec1: dec1,
      jan2: jan2,
      feb2: feb2,
      march2: march2,
      apr2: apr2,
      may2: may2,
      june2: june2,
      total: total,
      year: year,
      center_id: user_id,
    })
    .then((data) => {
      req.flash("message", "Successfully added");
      res.redirect("/center/rajosshoForm");
    })
    .catch((err) => {
      res.render("errorpage", err);
    });
};
module.exports.rajosshoAdd = async (req, res) => {
  await rajossho
    .findByPk(req.params.id)
    .then((data) => {
      res.render("center/rajossho/rajosshoAdd", {
        title: "মাসিক রাজস্ব অর্থ প্রাপ্তি",
        msg: "",
        success: "",
        records: data,
      });
    })
    .catch((err) => {
      console.log("outside",err);

    });
};

module.exports.rajosshoAddPost = async (req, res) => {
  try {
    var data = await rajossho.findByPk(req.params.id);
    const m = res.locals.moment();
    var months = m.month();
    var income = parseInt(req.body.income);
    var currentTotal = parseInt(data.total);
    if (months === 0) {
      jan2 = income + parseInt(data.jan2);
      total = income + currentTotal;
      var varib = await rajossho.update(
        {
          jan2: jan2,
          total: total,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 1) {
      feb2 = income + parseInt(data.feb2);
      total = income + currentTotal;
      var varib = await rajossho.update(
        {
          feb2: feb2,
          total: total,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 2) {
      march2 = income + parseInt(data.march2);
      total = income + currentTotal;
      var varib = await rajossho.update(
        {
          march2: march2,
          total: total,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 3) {
      apr2 = income + parseInt(data.apr2);
      total = income + currentTotal;
      var varib = await rajossho.update(
        {
          apr2: apr2,
          total: total,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 4) {
      may2 = income + parseInt(data.may2);
      total = income + currentTotal;
      var varib = await rajossho.update(
        {
          may2: may2,
          total: total,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 5) {
      june2 = income + parseInt(data.june2);
      total = income + currentTotal;
      var varib = await rajossho.update(
        {
          june2: june2,
          total: total,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 6) {
      july1 = income + parseInt(data.july1);
      total = income + currentTotal;
      var varib = await rajossho.update(
        {
          july1: july1,
          total: total,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 7) {
      august1 = income + parseInt(data.august1);
      total = income + currentTotal;
      baki = data.baki - income;
      var varib = await rajossho.update(
        {
          august1: august1,
          total: total,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 8) {
      sept1 = income + parseInt(data.sept1);
      total = income + currentTotal;
      var varib = await rajossho.update(
        {
          sept1: sept1,
          total: total,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 9) {
      oct1 = income + parseInt(data.oct1);
      total = income + currentTotal;
      var varib = await rajossho.update(
        {
          oct1: oct1,
          total: total,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 10) {
      nov1 = income + parseInt(data.nov1);
      total = income + currentTotal;
      var varib = await rajossho.update(
        {
          nov1: nov1,
          total: total,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 11) {
      dec1 = income + parseInt(data.dec1);
      total = income + currentTotal;
      var varib = await rajossho.update(
        {
          dec1: dec1,
          total: total,
        },
        {
          where: { id: req.params.id },
        }
      );
    }
    res.redirect("/center/rajossho");
  } catch (err) {
    res.send(err);
  }
};
module.exports.fetchRajosshoCode = async (req, res) => {
  await rajosshoCode
    .findOne({
      where: { id: req.body.upokhat },
    })
    .then((data) => {
      var code = data.code;
      res.send(code);
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports.generatePdfrajossho= async (req, res) => {
  try {
    var centerNames= await center.findOne({
      where: { id: req.session.user_id },
    });
  var data= await rajossho.findAll({
      where: { year: req.body.year, center_id: req.session.user_id },
    })
      ejs.renderFile(
          path.join(__dirname, "../views/center/rajossho/", "pdf.ejs"),
          { records: data,centerName:centerNames,dirname: __dirname },
          (err, data) => {
            if (err) {
              console.log("error", err);
              res.send(err);
            } else {
              var assesPath = path.join(__dirname, "../public/");
              // console.log(assesPath);
              assesPath = assesPath.replace(new RegExp(/\\/g), "/");

              var options = {
                height: "11.25in",
                width: "18.5in",
                header: {
                  height: "20mm",
                },
                footer: {
                  height: "20mm",
                },
                base: "file:///" + assesPath,
              };
              res.json({ html: data });
            }
          }
      )
    
    
  } catch (e) {
    console.log(e);
  }

};
//rajossho controller end

//expense controller
module.exports.expense = async (req, res) => {
  var codess=await expenseCode.findAll();
  var data=await expense.findAll({where: { center_id: req.session.user_id },});
    try {
      console.log("expense");
      res.render("center/expense/expense", {title: "খরচের (বিএস্টেটমেন্ট) হিসাব বিবরণী",success: "",records: data,codes:codess})
    }
    catch {
      console.log(err);
    };
};
module.exports.expenseYear = async (req, res) => {
  
    try {
      var codess=await expenseCode.findAll();
  var data=await expense.findAll({where: { year: req.body.year, center_id: req.session.user_id }});
      console.log("expenseYear");
      res.render(
        "center/expense/expenseTable",
        { records: data,codes:codess },
        function (err, html) {
          res.send(html);
        }
      );
    }
    catch (err) {
      console.log(err);
    };
};

module.exports.expenseForm = async (req, res) => {
  try {
    var expenseCodes = await expenseCode.findAll();
    res.render("center/expense/expenseForm", {
      title: "খরচের (বিএস্টেটমেন্ট) হিসাব বিবরণী",
      msg: "",
      success: "",
      user_id: req.session.user_id,
      expenseCodes: expenseCodes,
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports.expenseFormPost = async (req, res) => {
  var code = req.body.code;
  var khat = req.body.khat;
  var boraddo = req.body.boraddo;
  var july1 = req.body.july1;
  var august1 = req.body.august1;
  var sept1 = req.body.sept1;
  var oct1 = req.body.oct1;
  var nov1 = req.body.nov1;
  var dec1 = req.body.dec1;
  var jan2 = req.body.jan2;
  var feb2 = req.body.feb2;
  var march2 = req.body.march2;
  var apr2 = req.body.apr2;
  var may2 = req.body.may2;
  var june2 = req.body.june2;
  var comment = req.body.comment;
  var year = req.body.year;
  var user_id = req.body.user_id;
  const khatName = await expenseCode.findByPk(khat);

  if (july1 == null) {
    july1 = 0;
  }
  if (august1 == null) {
    august1 = 0;
  }
  if (sept1 == null) {
    sept1 = 0;
  }
  if (oct1 == null) {
    oct1 = 0;
  }
  if (nov1 == null) {
    nov1 = 0;
  }
  if (dec1 == null) {
    dec1 = 0;
  }
  if (jan2 == null) {
    jan2 = 0;
  }
  if (feb2 == null) {
    feb2 = 0;
  }
  if (march2 == null) {
    march2 = 0;
  }
  if (apr2 == null) {
    apr2 = 0;
  }
  if (may2 == null) {
    may2 = 0;
  }
  if (june2 == null) {
    june2 = 0;
  }
  var boraddo = parseInt(boraddo);
  var july1 = parseInt(july1);
  var august1 = parseInt(august1);
  var sept1 = parseInt(sept1);
  var oct1 = parseInt(oct1);
  var nov1 = parseInt(nov1);
  var dec1 = parseInt(dec1);
  var jan2 = parseInt(jan2);
  var feb2 = parseInt(feb2);
  var march2 = parseInt(march2);
  var apr2 = parseInt(apr2);
  var may2 = parseInt(may2);
  var june2 = parseInt(june2);
  var total =
    july1 +
    august1 +
    sept1 +
    oct1 +
    nov1 +
    dec1 +
    jan2 +
    feb2 +
    march2 +
    apr2 +
    may2 +
    june2;
  var baki = boraddo - total;
 
  await expense
    .create({
      code: code,
      khat: khatName.khat,
      boraddo: boraddo,
      july1: july1,
      august1: august1,
      sept1: sept1,
      oct1: oct1,
      nov1: nov1,
      dec1: dec1,
      jan2: jan2,
      feb2: feb2,
      march2: march2,
      apr2: apr2,
      may2: may2,
      june2: june2,
      total: total,
      baki: baki,
      comment: comment,
      year: year,
      center_id: user_id,
    })
    .then((data) => {
      req.flash("message", "Successfully added");
      res.redirect("/center/expenseForm");
    })
    .catch((err) => {
      res.render("errorpage", err);
    });
};
module.exports.expenseAdd = async (req, res) => {
  await expense
    .findByPk(req.params.id)
    .then((data) => {

      res.render("center/expense/expenseAdd", {
        title: "খরচের (বিএস্টেটমেন্ট) হিসাব বিবরণী",
        msg: "",
        success: "",
        records: data,
      });
    })
    .catch((err) => {
      console.log("outside",err);
    });
};

module.exports.expenseAddPost = async (req, res) => {
 
  try {
    var data = await expense.findByPk(req.params.id);
    const m = res.locals.moment();
    var months = m.month();
    var khoroch = parseInt(req.body.khoroch);
    var currentTotal = parseInt(data.total);
    var currentbaki = parseInt(data.baki);
    if (months === 0) {
      jan2 = khoroch + parseInt(data.jan2);
      total = khoroch + currentTotal;
      baki = currentbaki - khoroch;
      var varib = await expense.update(
        {
          jan2: jan2,
          total: total,
          baki: baki,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 1) {
      feb2 = khoroch + parseInt(data.feb2);
      total = khoroch + currentTotal;
      baki = currentbaki - khoroch;
      var varib = await expense.update(
        {
          feb2: feb2,
          total: total,
          baki: baki,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 2) {
      march2 = khoroch + parseInt(data.march2);
      total = khoroch + data.total;
      baki = data.baki - khoroch;
      var varib = await expense.update(
        {
          march2: march2,
          total: total,
          baki: baki,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 3) {
      apr2 = khoroch + parseInt(data.apr2);
      total = khoroch + currentTotal;
      baki = currentbaki - khoroch;
      var varib = await expense.update(
        {
          apr2: apr2,
          total: total,
          baki: baki,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 4) {
      may2 = khoroch + parseInt(data.may2);
      total = khoroch + currentTotal;
      baki = currentbaki - khoroch;
      var varib = await expense.update(
        {
          may2: may2,
          total: total,
          baki: baki,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 5) {
      june2 = khoroch + parseInt(data.june2);
      total = khoroch + currentTotal;
      baki = currentbaki - khoroch;
      var varib = await expense.update(
        {
          june2: june2,
          total: total,
          baki: baki,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 6) {
      july1 = khoroch + parseInt(data.july1);
      total = khoroch + currentTotal;
      baki = currentbaki - khoroch;
      var varib = await expense.update(
        {
          july1: july1,
          total: total,
          baki: baki,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 7) {
      august1 = khoroch + parseInt(data.august1);
      total = khoroch + currentTotal;
      baki = currentbaki - khoroch;
      var varib = await expense.update(
        {
          august1: august1,
          total: total,
          baki: baki,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 8) {
      sept1 = khoroch + parseInt(data.sept1);
      total = khoroch + currentTotal;
      baki = currentbaki - khoroch;
      var varib = await expense.update(
        {
          sept1: sept1,
          total: total,
          baki: baki,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 9) {
      oct1 = khoroch + parseInt(data.oct1);
      total = khoroch + currentTotal;
      baki = currentbaki - khoroch;
      var varib = await expense.update(
        {
          oct1: oct1,
          total: total,
          baki: baki,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 10) {
     
      nov1 = khoroch + parseInt(data.nov1);
      total = khoroch + currentTotal;
      baki = currentbaki - khoroch;
    
      var varib = await expense.update(
        {
          nov1: nov1,
          total: total,
          baki: baki,
        },
        {
          where: { id: req.params.id },
        }
      );
    } else if (months == 11) {
      dec1 = khoroch + parseInt(data.dec1);
      total = khoroch + currentTotal;
      baki = currentbaki - khoroch;
      var varib = await expense.update(
        {
          dec1: dec1,
          total: total,
          baki: baki,
        },
        {
          where: { id: req.params.id },
        }
      );
    }
    res.redirect("/center/expense");
  } catch (err) {
    res.send(err);
  }
};
module.exports.fetchExpenseCode = async (req, res) => {
  await expenseCode
    .findOne({
      where: { id: req.body.khat },
    })
    .then((data) => {
    
      var code = data.code;
      res.send(code);
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports.generatePdfexpense = async (req, res) => {
  try {
    var centerNames= await center.findOne({
      where: { id: req.session.user_id },
    })
  var data= await expense.findAll({
      where: { year: req.body.year, center_id: req.session.user_id },
    })
      ejs.renderFile(
          path.join(__dirname, "../views/center/expense/", "pdf.ejs"),
          { records: data,centerName:centerNames,dirname: __dirname },
          (err, data) => {
            if (err) {
        
              res.send(err);
            } else {
              var assesPath = path.join(__dirname, "../public/");
              // console.log(assesPath);
              assesPath = assesPath.replace(new RegExp(/\\/g), "/");

              var options = {
                height: "11.25in",
                width: "18.5in",
                header: {
                  height: "20mm",
                },
                footer: {
                  height: "20mm",
                },
                base: "file:///" + assesPath,
              };
              res.json({ html: data });
            }
          }
      )
    
    
  } catch (e) {
    console.log(e);
  }

};
//expense controller end

module.exports.fetchSubCategory = async (req, res) => {
  
  await cropCategory
    .findAll({
      where: { parent_id: req.body.category },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.fetchBiboron = async (req, res) => {
  await cropCategory
    .findAll({
      where: { parent_id: req.body.subCategory },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.fetchBreed = async (req, res) => {
  await cropCategory
    .findAll({
      where: { parent_id: req.body.biboron },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

//monthlyProgress controller
module.exports.monthlyProgress = async (req, res) => {
  res.render("center/monthlyProgress/monthlyProgress", {
    title: "মাসিক প্রতিবেদন",
    success: "",
  });
};

module.exports.monthlyProgressYear = async (req, res) => {
  try {
    const currentMonth = res.locals.moment().format("MMM-YYYY").toLowerCase();
    const selectedDate = req.body.year.toLowerCase();

    var data = [];
    const allMonthlyProgress = await monthlyProgress.findAll({
      where: { center_id: req.session.user_id },
    });
    allMonthlyProgress.map((monthlyProg, key) => {
      const timeList = JSON.parse(monthlyProg.timeFrame);
      timeList.map((eachTime, index) => {
        if (eachTime.time === selectedDate) {
          data.push(monthlyProg);
        }
      });
    });

    if (selectedDate === currentMonth) {
      res.render(
        "center/monthlyProgress/monthlyProgressTable",
        { records: data, selectedDate: currentMonth },
        function (err, html) {
          res.send(html);
        }
      );
    } else {
      res.render(
        "center/monthlyProgress/monthlyProgressTable",
        { records: data, selectedDate: selectedDate },
        function (err, html) {
          res.send(html);
        }
      );
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports.generatePdfMonthlyProgress = async (req, res) => {
  try {
    const currentMonth = res.locals.moment().format("MMM-YYYY").toLowerCase();
    const selectedDate = req.params.selectedDate.toLowerCase();

    var data = [];
    const allMonthlyProgress = await monthlyProgress.findAll({
      where: { center_id: req.session.user_id },
    });
    allMonthlyProgress.map((monthlyProg, key) => {
      const timeList = JSON.parse(monthlyProg.timeFrame);
      timeList.map((eachTime, index) => {
        if (eachTime.time === selectedDate) {
          data.push(monthlyProg);
        }
      });
    });

    if (selectedDate === currentMonth) {
      ejs.renderFile(
          path.join(__dirname, "../views/center/monthlyProgress/", "pdf.ejs"),
          { records: data, selectedDate: currentMonth, moment: res.locals.moment, dirname: __dirname },
          (err, data) => {
            if (err) {
              console.log("error", err);
              res.send(err);
            } else {
              var assesPath = path.join(__dirname, "../public/");
              // console.log(assesPath);
              assesPath = assesPath.replace(new RegExp(/\\/g), "/");

              var options = {
                height: "11.25in",
                width: "18.5in",
                header: {
                  height: "20mm",
                },
                footer: {
                  height: "20mm",
                },
                base: "file:///" + assesPath,
              };
              res.json({ html: data });
            }
          }
      )
    }
    else {
      ejs.renderFile(
          path.join(__dirname, "../views/center/monthlyProgress/", "pdf.ejs"),
          { records: data, selectedDate: selectedDate, moment: res.locals.moment, dirname: __dirname },
          (err, data) => {
            if (err) {
              console.log("error", err);
              res.send(err);
            } else {
              var assesPath = path.join(__dirname, "../public/");
              // console.log(assesPath);
              assesPath = assesPath.replace(new RegExp(/\\/g), "/");

              var options = {
                height: "11.25in",
                width: "18.5in",
                header: {
                  height: "20mm",
                },
                footer: {
                  height: "20mm",
                },
                base: "file:///" + assesPath,
              };
              res.json({ html: data });
            }
          }
      )
    }
  } catch (e) {
    console.log(e);
  }

};

module.exports.monthlyProgressForm = async (req, res) => {
  try {
    const categoryList = await cropCategory.findAll();
    res.render("center/monthlyProgress/monthlyProgressForm", {
      title: "মাসিক প্রতিবেদন",
      msg: "",
      success: "",
      user_id: req.session.user_id,
      categoryList: categoryList,
      currentMonth: res.locals.moment().format("MMM-YYYY").toLowerCase(),
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports.monthlyProgressFormPost = async (req, res) => {
  var category = req.body.category;
  var subCategory = req.body.subCategory;
  var biboron = req.body.biboron;
  var breed = req.body.breed;
  var productionTarget = req.body.productionTarget;
  var productionCurrent = req.body.productionCurrent;
  var productionTotal = req.body.productionTotal;
  var daePrapti = req.body.daePrapti;
  var bitoronCurrentMonth = req.body.bitotonCurrentMonth;
  var daeProdan = req.body.daeProdan;
  var deadWriteup = req.body.deadWriteup;
  var comment = req.body.comment;
  var user_id = req.body.user_id;
  var selectedMonth = req.body.currentMonth;

  const categoryName = await cropCategory.findByPk(category);
  const subCategoryName = await cropCategory.findByPk(subCategory);
  const biboronName = await cropCategory.findByPk(biboron);
  const breedName = await cropCategory.findByPk(breed);
  const centerInfo = await center.findByPk(user_id);

  const progressData = await monthlyProgress.findOne({
    where: {
      category: categoryName.name,
      subCategory: subCategoryName.name,
      biboron: biboronName.name,
      breed: breedName.name,
      center_id: user_id,
    },
  });

  if (!progressData) {
    var currentProduction = [];
    var productionObj = {};
    productionObj["time"] = selectedMonth;
    productionObj["amount"] = productionCurrent;
    currentProduction.push(productionObj);

    var currentDaePraptis = [];
    var daePraptiObj = {};
    daePraptiObj["time"] = selectedMonth;
    daePraptiObj["amount"] = daePrapti;
    currentDaePraptis.push(daePraptiObj);

    var currentBitoron = [];
    var bitoronObj = {};
    bitoronObj["time"] = selectedMonth;
    bitoronObj["amount"] = bitoronCurrentMonth;
    currentBitoron.push(bitoronObj);

    var currentDaeProdan = [];
    var daeProdanObj = {};
    daeProdanObj["time"] = selectedMonth;
    daeProdanObj["amount"] = daeProdan;
    currentDaeProdan.push(daeProdanObj);

    var currentDeadWriteup = [];
    var deadWriteupObj = {};
    deadWriteupObj["time"] = selectedMonth;
    deadWriteupObj["amount"] = deadWriteup;
    currentDeadWriteup.push(deadWriteupObj);

    var currentComment = [];
    var commentObj = {};
    commentObj["time"] = selectedMonth;
    commentObj["msg"] = comment;
    currentComment.push(commentObj);

    var time = [];
    var timeObj = {};
    timeObj["time"] = selectedMonth;
    time.push(timeObj);

    var startRange = "";
    var endRange = "";
    if (res.locals.moment().format("M") < 7) {
      startRange =
        "jul" + "-" + res.locals.moment().subtract(1, "year").format("yyyy");
      endRange = "jul" + "-" + res.locals.moment().format("yyyy");
    } else {
      startRange = "jul" + "-" + res.locals.moment().format("yyyy");
      endRange =
        "jul" + "-" + res.locals.moment().add(1, "year").format("yyyy");
    }

    var totalProduction = [];
    var totalProducObj = {};
    totalProducObj["startTime"] = `${startRange}`;
    totalProducObj["endTime"] = `${endRange}`;
    totalProducObj["amount"] = productionCurrent;
    totalProduction.push(totalProducObj);

    var totalBitoron = [];
    var totalBitoronObj = {};
    totalBitoronObj["startTime"] = `${startRange}`;
    totalBitoronObj["endTime"] = `${endRange}`;
    totalBitoronObj["amount"] = bitoronCurrentMonth;
    totalBitoron.push(totalBitoronObj);

    var productionTargetList = [];
    var productionTargetObj = {};
    productionTargetObj["startTime"] = `${startRange}`;
    productionTargetObj["endTime"] = `${endRange}`;
    productionTargetObj["amount"] = productionTarget;
    productionTargetList.push(productionTargetObj);

    await monthlyProgress
      .create({
        category: categoryName.name,
        subCategory: subCategoryName.name,
        biboron: biboronName.name,
        breed: breedName.name,
        productionTarget: JSON.stringify(productionTargetList),
        productionCurrent: JSON.stringify(currentProduction),
        productionTotal: JSON.stringify(totalProduction),
        daePrapti: JSON.stringify(currentDaePraptis),
        bitoronCurrentMonth: JSON.stringify(currentBitoron),
        bitoronTotal: JSON.stringify(totalBitoron),
        daeProdan: JSON.stringify(currentDaeProdan),
        deadWriteup: JSON.stringify(currentDeadWriteup),
        comment: JSON.stringify(currentComment),
        timeFrame: JSON.stringify(time),
        center_id: user_id,
        pd_id: centerInfo.pd_id,
      })
      .then((data) => {
        req.flash("message", "Successfully added");
        res.redirect("/center/monthlyProgressForm");
      })
      .catch((err) => {
        console.log("err", err);
        // res.render('errorpage',err);
      });
  } else {
    var alreadyExistSelectedMonth = false;
    var timeFrame = JSON.parse(progressData.timeFrame);
    timeFrame.forEach((time) => {
      if (time.time === selectedMonth) {
        alreadyExistSelectedMonth = true;
      }
    });

    if (alreadyExistSelectedMonth === false) {
      var currentProduction = JSON.parse(progressData.productionCurrent);
      var productionObj = {};
      productionObj["time"] = selectedMonth;
      productionObj["amount"] = productionCurrent;
      currentProduction.push(productionObj);

      var currentDaePraptis = JSON.parse(progressData.daePrapti);
      var daePraptiObj = {};
      daePraptiObj["time"] = selectedMonth;
      daePraptiObj["amount"] = daePrapti;
      currentDaePraptis.push(daePraptiObj);

      var currentBitoron = JSON.parse(progressData.bitoronCurrentMonth);
      var bitoronObj = {};
      bitoronObj["time"] = selectedMonth;
      bitoronObj["amount"] = bitoronCurrentMonth;
      currentBitoron.push(bitoronObj);

      var currentDaeProdan = JSON.parse(progressData.daeProdan);
      var daeProdanObj = {};
      daeProdanObj["time"] = selectedMonth;
      daeProdanObj["amount"] = daeProdan;
      currentDaeProdan.push(daeProdanObj);

      var currentDeadWriteup = JSON.parse(progressData.deadWriteup);
      var deadWriteupObj = {};
      deadWriteupObj["time"] = selectedMonth;
      deadWriteupObj["amount"] = deadWriteup;
      currentDeadWriteup.push(deadWriteupObj);

      var currentComment = JSON.parse(progressData.comment);
      var commentObj = {};
      commentObj["time"] = selectedMonth;
      commentObj["msg"] = comment;
      currentComment.push(commentObj);

      var time = JSON.parse(progressData.timeFrame);
      var timeObj = {};
      timeObj["time"] = selectedMonth;
      time.push(timeObj);

      var startRange = "";
      var endRange = "";
      if (res.locals.moment().format("M") < 7) {
        startRange =
          "jul" + "-" + res.locals.moment().subtract(1, "year").format("yyyy");
        endRange = "jul" + "-" + res.locals.moment().format("yyyy");
      } else {
        startRange = "jul" + "-" + res.locals.moment().format("yyyy");
        endRange =
          "jul" + "-" + res.locals.moment().add(1, "year").format("yyyy");
      }

      // const dateMatched = JSON.parse(progressData.timeFrame).filter(e => e.time === 'feb-2021').length > 0
      var selectedDateEconomicYearStart = "";
      var selectedDateEconomicYearEnd = "";
      if (res.locals.moment(selectedMonth).format("M") < 7) {
        selectedDateEconomicYearStart =
          "jul" + "-" + res.locals.moment().subtract(1, "year").format("yyyy");
        selectedDateEconomicYearEnd =
          "jul" + "-" + res.locals.moment().format("yyyy");
      } else {
        selectedDateEconomicYearStart =
          "jul" + "-" + res.locals.moment().format("yyyy");
        selectedDateEconomicYearEnd =
          "jul" + "-" + res.locals.moment().add(1, "year").format("yyyy");
      }

      const dateMatched =
        JSON.parse(progressData.productionTarget).filter(
          (e) =>
            e.startTime === selectedDateEconomicYearStart &&
            e.endTime === selectedDateEconomicYearEnd
        ).length > 0;

      console.log(
        "economic year",
        selectedDateEconomicYearStart,
        selectedDateEconomicYearEnd
      );

      var productionTargetList = JSON.parse(progressData.productionTarget);
      var totalProduction = JSON.parse(progressData.productionTotal);
      var totalBitoron = JSON.parse(progressData.bitoronTotal);

      if (dateMatched) {
        console.log("date matched", dateMatched);

        productionTargetList.forEach((prodTargetTotal, index) => {
          if (
            res.locals
              .moment(selectedMonth)
              .isAfter(prodTargetTotal.startTime) &&
            res.locals.moment(selectedMonth).isBefore(prodTargetTotal.endTime)
          ) {
            productionTargetList[index].amount = parseInt(productionTarget);
          }
        });

        totalProduction.forEach((prodTotal, index) => {
          if (
            res.locals.moment(selectedMonth).isAfter(prodTotal.startTime) &&
            res.locals.moment(selectedMonth).isBefore(prodTotal.endTime)
          ) {
            totalProduction[index].amount =
              parseInt(totalProduction[index].amount) +
              parseInt(productionCurrent);
          }
        });

        totalBitoron.forEach((bitoronTotal, index) => {
          if (
            res.locals.moment(selectedMonth).isAfter(bitoronTotal.startTime) &&
            res.locals.moment(selectedMonth).isBefore(bitoronTotal.endTime)
          ) {
            totalBitoron[index].amount =
              parseInt(totalBitoron[index].amount) +
              parseInt(bitoronCurrentMonth);
            console.log("total 1 ", totalBitoron[index].amount);
          }
        });
        console.log("total 2 ", totalBitoron);
      } else {
        console.log("date unmatched", dateMatched);

        var productionTargetObj = {};
        productionTargetObj["startTime"] = `${startRange}`;
        productionTargetObj["endTime"] = `${endRange}`;
        productionTargetObj["amount"] = productionTarget;
        productionTargetList.push(productionTargetObj);

        var totalProducObj = {};
        totalProducObj["startTime"] = `${startRange}`;
        totalProducObj["endTime"] = `${endRange}`;
        totalProducObj["amount"] = productionCurrent;
        totalProduction.push(totalProducObj);

        var totalBitoronObj = {};
        totalBitoronObj["startTime"] = `${startRange}`;
        totalBitoronObj["endTime"] = `${endRange}`;
        totalBitoronObj["amount"] = bitoronCurrentMonth;
        totalBitoron.push(totalBitoronObj);
      }

      await monthlyProgress
        .update(
          {
            category: categoryName.name,
            subCategory: subCategoryName.name,
            biboron: biboronName.name,
            breed: breedName.name,
            productionTarget: JSON.stringify(productionTargetList),
            productionCurrent: JSON.stringify(currentProduction),
            productionTotal: JSON.stringify(totalProduction),
            daePrapti: JSON.stringify(currentDaePraptis),
            bitoronCurrentMonth: JSON.stringify(currentBitoron),
            bitoronTotal: JSON.stringify(totalBitoron),
            daeProdan: JSON.stringify(currentDaeProdan),
            deadWriteup: JSON.stringify(currentDeadWriteup),
            comment: JSON.stringify(currentComment),
            timeFrame: JSON.stringify(time),
          },
          {
            where: { id: progressData.id },
          }
        )
        .then((data) => {
          req.flash("message", "Successfully added!");
          res.redirect("/center/monthlyProgressForm");
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      req.flash(
        "message",
        "Sorry! Cant add. This data already exist against this month. "
      );
      res.redirect("/center/monthlyProgressForm");
    }
  }
};

module.exports.monthlyProgressEdit = async (req, res) => {
  try {
    const monthProgress = await monthlyProgress.findByPk(req.params.progressId);
    const categoryList = await cropCategory.findAll();
    res.render("center/monthlyProgress/monthlyProgressFormEdit", {
      title: "মাসিক প্রতিবেদন",
      msg: "",
      success: "",
      categoryList: categoryList,
      monthProgress: monthProgress,
      editDate: req.params.editDate,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.monthlyProgressUpdate = async (req, res) => {
  var category = req.body.category;
  var subCategory = req.body.subCategory;
  var biboron = req.body.biboron;
  var breed = req.body.breed;
  var productionTarget = req.body.productionTarget;
  var productionCurrent = req.body.productionCurrent;
  var daePrapti = req.body.daePrapti;
  var bitoronCurrentMonth = req.body.bitotonCurrentMonth;
  var daeProdan = req.body.daeProdan;
  var deadWriteup = req.body.deadWriteup;
  var comment = req.body.comment;
  var editDate = req.body.editDate.toLowerCase();

  const currentMonth = res.locals.moment().format("MMM-YYYY").toLowerCase();

  const progress = await monthlyProgress.findByPk(req.params.progressId);

  /////////
  var startRange = "";
  var endRange = "";
  if (res.locals.moment().format("M") < 7) {
    startRange =
      "jul" + "-" + res.locals.moment().subtract(1, "year").format("yyyy");
    endRange = "jul" + "-" + res.locals.moment().format("yyyy");
  } else {
    startRange = "jul" + "-" + res.locals.moment().format("yyyy");
    endRange = "jul" + "-" + res.locals.moment().add(1, "year").format("yyyy");
  }

  ///////// moment(currentMonth).isAfter(bitorTotal.startTime) &&  moment(currentMonth).isBefore(bitorTotal.endTime)
  var totalProductionTarget = JSON.parse(progress.productionTarget);
  totalProductionTarget.forEach((prodTargetTotal, index) => {
    if (
      res.locals.moment(editDate).isAfter(prodTargetTotal.startTime) &&
      res.locals.moment(editDate).isBefore(prodTargetTotal.endTime)
    ) {
      totalProductionTarget[index].amount = parseInt(productionTarget);
    }
  });

  var currentProduction = JSON.parse(progress.productionCurrent);
  if (productionCurrent) {
    currentProduction.forEach((prodCurrent, index) => {
      if (prodCurrent.time === editDate) {
        currentProduction[index].amount = parseInt(productionCurrent);
      }
    });
  }

  /////// total production sum  ////////
  var currentProductionSum = 0;
  var previousMonthProduction = 0;
  const currentProd = JSON.parse(progress.productionCurrent);
  currentProd.forEach(function (prodCurrent) {
    if (prodCurrent.time === currentMonth) {
      currentProductionSum += parseInt(prodCurrent.amount);
    } else if (
      res.locals.moment(prodCurrent.time).isSameOrAfter(startRange) &&
      res.locals.moment(prodCurrent.time).isSameOrBefore(endRange)
    ) {
      previousMonthProduction += parseInt(prodCurrent.amount);
    }
  });

  var totalProduction = JSON.parse(progress.productionTotal);
  if (productionCurrent) {
    totalProduction.forEach((prodTotal, index) => {
      if (
        res.locals.moment(editDate).isAfter(prodTotal.startTime) &&
        res.locals.moment(editDate).isBefore(prodTotal.endTime)
      ) {
        totalProduction[index].amount =
          previousMonthProduction + parseInt(productionCurrent);
      }
    });
  }
  /////// total production sum  ////////

  var currentDaePraptis = JSON.parse(progress.daePrapti);
  if (daePrapti) {
    currentDaePraptis.forEach((daePraptiCurrent, index) => {
      if (daePraptiCurrent.time === editDate) {
        currentDaePraptis[index].amount = parseInt(daePrapti);
      }
    });
  }

  var currentBitoron = JSON.parse(progress.bitoronCurrentMonth);
  if (bitoronCurrentMonth) {
    currentBitoron.forEach((currentBitoronCurrent, index) => {
      if (currentBitoronCurrent.time === editDate) {
        currentBitoron[index].amount = parseInt(bitoronCurrentMonth);
      }
    });
  }

  ///// total bitoron //////
  var currentBitoronSum = 0;
  var previousMonthBitoronSum = 0;
  const currBitoron = JSON.parse(progress.bitoronCurrentMonth);
  currBitoron.forEach(function (BitoCurrent) {
    if (BitoCurrent.time === currentMonth) {
      currentBitoronSum += parseInt(BitoCurrent.amount);
    } else if (
      res.locals.moment(BitoCurrent.time).isAfter(startRange) &&
      res.locals.moment(BitoCurrent.time).isBefore(endRange)
    ) {
      previousMonthBitoronSum += parseInt(BitoCurrent.amount);
    }
  });
  var totalBitoron = JSON.parse(progress.bitoronTotal);
  if (bitoronCurrentMonth) {
    totalBitoron.forEach((bitoronTotal, index) => {
      if (
        res.locals.moment(editDate).isAfter(bitoronTotal.startTime) &&
        res.locals.moment(editDate).isBefore(bitoronTotal.endTime)
      ) {
        totalBitoron[index].amount =
          previousMonthBitoronSum + parseInt(bitoronCurrentMonth);
      }
    });
  }
  ///// total bitoron /////

  var currentDaeProdan = JSON.parse(progress.daeProdan);
  if (daeProdan) {
    currentDaeProdan.forEach((daeProdanCurrent, index) => {
      if (daeProdanCurrent.time === editDate) {
        currentDaeProdan[index].amount = parseInt(daeProdan);
      }
    });
  }

  var currentDeadWriteup = JSON.parse(progress.deadWriteup);
  if (deadWriteup) {
    currentDeadWriteup.forEach((deadWriteupCurrent, index) => {
      if (deadWriteupCurrent.time === editDate) {
        currentDeadWriteup[index].amount = parseInt(deadWriteup);
      }
    });
  }

  // var currentMojud = JSON.parse(progress.mojud);
  // currentMojud.forEach((mojudCurrent,index) => {
  //     if ( mojudCurrent.time === currentMonth ) {
  //         currentMojud[index].amount = parseInt(currentMojud[index].amount) + parseInt(mojud)
  //     }
  // })

  var currentComment = JSON.parse(progress.comment);
  if (comment) {
    currentComment.forEach((commentCurrent, index) => {
      if (commentCurrent.time === editDate) {
        currentComment[index].msg = comment;
      }
    });
  }

  const categoryName = await cropCategory.findByPk(category);
  const subCategoryName = await cropCategory.findByPk(subCategory);
  const biboronName = await cropCategory.findByPk(biboron);
  const breedName = await cropCategory.findByPk(breed);

  await monthlyProgress
    .update(
      {
        category: categoryName.name,
        subCategory: subCategoryName.name,
        biboron: biboronName.name,
        breed: breedName.name,
        productionTarget: JSON.stringify(totalProductionTarget),
        productionCurrent: JSON.stringify(currentProduction),
        productionTotal: JSON.stringify(totalProduction),
        daePrapti: JSON.stringify(currentDaePraptis),
        bitoronCurrentMonth: JSON.stringify(currentBitoron),
        bitoronTotal: JSON.stringify(totalBitoron),
        daeProdan: JSON.stringify(currentDaeProdan),
        deadWriteup: JSON.stringify(currentDeadWriteup),
        comment: JSON.stringify(currentComment),
        // timeFrame: time,
      },
      {
        where: { id: req.params.progressId },
      }
    )
    .then((data) => {
      console.log("productionTotal=", data);
      res.redirect("/center/monthlyProgress");
    })
    .catch((err) => {
      console.log("err", err);
    });
};

module.exports.monthlyProgressDelete = async (req, res) => {
  const currentMonth = res.locals.moment().format("MMM-YYYY").toLowerCase();
  const selectedDate = req.params.selectedDate;

  const progress = await monthlyProgress.findByPk(req.params.progressId);
  var productionCurrent = "";
  var bitoronCurrentMonth = "";

  /////////
  var startRange = "";
  var endRange = "";
  if (res.locals.moment().format("M") < 7) {
    startRange =
      "jul" + "-" + res.locals.moment().subtract(1, "year").format("yyyy");
    endRange = "jul" + "-" + res.locals.moment().format("yyyy");
  } else {
    startRange = "jul" + "-" + res.locals.moment().format("yyyy");
    endRange = "jul" + "-" + res.locals.moment().add(1, "year").format("yyyy");
  }
  ///////// moment(currentMonth).isAfter(bitorTotal.startTime) &&  moment(currentMonth).isBefore(bitorTotal.endTime)

  var totalProductionTarget = JSON.parse(progress.productionTarget);
  // totalProductionTarget.forEach((prodTargetTotal,index) => {
  //     if ( res.locals.moment(selectedDate).isAfter(prodTargetTotal.startTime) &&  res.locals.moment(selectedDate).isBefore(prodTargetTotal.endTime) ) {
  //         totalProductionTarget.splice(index,1);
  //     }
  // })

  var currentProduction = JSON.parse(progress.productionCurrent);
  console.log("before", currentProduction, selectedDate);
  currentProduction.forEach((prodCurrent, index) => {
    if (prodCurrent.time === selectedDate) {
      productionCurrent = prodCurrent.amount;
      console.log("inside", selectedDate, index);
      currentProduction.splice(index, 1);
      // console.log("inside",currentProduction.splice(index,1));
    }
  });
  console.log("after", currentProduction);

  var totalProduction = JSON.parse(progress.productionTotal);
  totalProduction.forEach((prodTotal, index) => {
    if (
      res.locals.moment(selectedDate).isAfter(prodTotal.startTime) &&
      res.locals.moment(selectedDate).isBefore(prodTotal.endTime)
    ) {
      totalProduction[index].amount -= parseInt(productionCurrent);
    }
  });

  var currentDaePraptis = JSON.parse(progress.daePrapti);
  currentDaePraptis.forEach((daePraptiCurrent, index) => {
    if (daePraptiCurrent.time === selectedDate) {
      currentDaePraptis.splice(index, 1);
    }
  });

  var currentBitoron = JSON.parse(progress.bitoronCurrentMonth);
  currentBitoron.forEach((currentBitoronCurrent, index) => {
    if (currentBitoronCurrent.time === selectedDate) {
      bitoronCurrentMonth = currentBitoronCurrent.amount;
      currentBitoron.splice(index, 1);
    }
  });

  var totalBitoron = JSON.parse(progress.bitoronTotal);
  totalBitoron.forEach((bitoronTotal, index) => {
    if (
      res.locals.moment(selectedDate).isAfter(bitoronTotal.startTime) &&
      res.locals.moment(selectedDate).isBefore(bitoronTotal.endTime)
    ) {
      totalBitoron[index].amount -= parseInt(bitoronCurrentMonth);
    }
  });

  var currentDaeProdan = JSON.parse(progress.daeProdan);
  currentDaeProdan.forEach((daeProdanCurrent, index) => {
    if (daeProdanCurrent.time === selectedDate) {
      currentDaeProdan.splice(index, 1);
    }
  });

  var currentDeadWriteup = JSON.parse(progress.deadWriteup);
  currentDeadWriteup.forEach((deadWriteupCurrent, index) => {
    if (deadWriteupCurrent.time === selectedDate) {
      currentDeadWriteup.splice(index, 1);
    }
  });

  // var currentMojud = JSON.parse(progress.mojud);
  // currentMojud.forEach((mojudCurrent,index) => {
  //     if ( mojudCurrent.time === currentMonth ) {
  //         currentMojud[index].amount = parseInt(currentMojud[index].amount) + parseInt(mojud)
  //     }
  // })

  var currentComment = JSON.parse(progress.comment);
  currentComment.forEach((commentCurrent, index) => {
    if (commentCurrent.time === selectedDate) {
      currentComment.splice(index, 1);
    }
  });

  var totalTimeFrame = JSON.parse(progress.timeFrame);
  totalTimeFrame.forEach((currentTime, index) => {
    if (currentTime.time === selectedDate) {
      totalTimeFrame.splice(index, 1);
    }
  });

  await monthlyProgress
    .update(
      {
        productionTarget: JSON.stringify(totalProductionTarget),
        productionCurrent: JSON.stringify(currentProduction),
        productionTotal: JSON.stringify(totalProduction),
        daePrapti: JSON.stringify(currentDaePraptis),
        bitoronCurrentMonth: JSON.stringify(currentBitoron),
        bitoronTotal: JSON.stringify(totalBitoron),
        daeProdan: JSON.stringify(currentDaeProdan),
        deadWriteup: JSON.stringify(currentDeadWriteup),
        comment: JSON.stringify(currentComment),
        timeFrame: JSON.stringify(totalTimeFrame),
      },
      {
        where: { id: req.params.progressId },
      }
    )
    .then((data) => {
      console.log("productionTotal=", data);
      res.redirect("/center/monthlyProgress");
    })
    .catch((err) => {
      console.log("err", err);
    });
};
//monthlyProgress controller end
