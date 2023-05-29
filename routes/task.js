const express = require('express');
const router = express.Router();

const mysqlConnetion = require('../database');

//// total de los descuento por ID
router.get('/performance/detailsDiscounts/total/:id',(req, res)=>{
    const {id} = req.params;
    mysqlConnetion.query('SELECT SUM(totales) as total FROM controlrendimiento_descuentos WHERE controlrendimientoID= ?',[id], (err, rows,fields)=>{
       if(!err){
           res.json(rows);
           console.log('control valido')
       }else{
           console.log(err);
       }
    });
   });



module.exports = router;