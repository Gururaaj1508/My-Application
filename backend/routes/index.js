import express from "express";
import request from "request";
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  // const url = 'https://warp.emea.lab.corpintra.net/api/apiuser/v1/gettoken/';
  
  // request.get({
  //   url, 
  //   rejectUnauthorized: false,
  //   headers:{ 
  //     'Content-Type':'application/json',
  //     'user_name': 'warp', //process.env.USER_NAME,
  //     'password': 'warpbackend', // process.env.PASSWORD
  //   },
  // }, (err, response, body) => {
  //   if(err){
  //     res.send(err);
  //   }
  //   if(body && JSON.parse(response.body).token !== undefined){
  //     res.send(response.body);
  //   }else{
  //     res.send("Authorization failed!!");
  //   }
  // });
});

module.exports = router;
