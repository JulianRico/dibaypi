const express = require('express');
const router = express.Router();

const mysqlConnetion = require('../database');


//// funciones a la tabla de subproceso
router.get('/areas/',(req, res)=>{
    mysqlConnetion.query('SELECT   idarea,   areaNombre FROM   area ORDER BY areaNombre ASC ',(err,rows,fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    })
});

router.get('/areas/:id',(req, res)=>{
    const {id} = req.params;
    mysqlConnetion.query('SELECT * from  area WHERE idarea = ?',[id], (err, rows,fields)=>{
       if(!err){
           res.json(rows[0]);
       }else{
           console.log(err);
       }
    });
   });
   
   
   router.post('/areas/add', (req,res) => {
   const {nombre} = req.body;
   const query = `
   CALL AddAreas (?);
   `;
   
   mysqlConnetion.query(query,[nombre], (err,rows,fields) =>{
       if(!err){
           res.json({Status: 'area guardado'});
       }else{
           console.log(err);
       }
   
       });    
   });
   
   
   router.put('/areas/:id', (req,res)=>{
   const { nombre} = req.body
   const {id} = req.params;
   console.log(req.params)
   
   const query = `CALL editAreas (?,?)`;
   
   mysqlConnetion.query(query,[id,nombre], (err,rows,fields) =>{
       if(!err){
           res.json({Status: 'area editado'});
       }else{
           console.log(err);
       }
       });  
   });
   
   router.delete('/areas/:id', (req, res)=>{
       const {id} = req.params;
       console.log(req.params);
       mysqlConnetion.query('DELETE FROM  area WHERE idarea = ?',[id], (err, rows,fields)=>{
           if(!err){
               res.json('area Eliminado');
           }else{
               console.log(err);
           }
        } )
   
   });
  

module.exports = router;