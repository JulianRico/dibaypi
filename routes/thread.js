const express = require('express');
const router = express.Router();

const mysqlConnetion = require('../database');


//// funciones a la tabla de subproceso
router.get('/thread/',(req, res)=>{
    mysqlConnetion.query('SELECT   idsubProceso,   subProcesoNombre FROM   subproceso ORDER BY subProcesoNombre ASC ',(err,rows,fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    })
});

router.get('/thread/:id',(req, res)=>{
    const {id} = req.params;
    mysqlConnetion.query('SELECT * from  subproceso WHERE idsubProceso = ?',[id], (err, rows,fields)=>{
       if(!err){
           res.json(rows[0]);
       }else{
           console.log(err);
       }
    });
   });
   
   
   router.post('/thread/add', (req,res) => {
   const {nombre} = req.body;
   const query = `
   CALL AddThread (?);
   `;
   
   mysqlConnetion.query(query,[nombre], (err,rows,fields) =>{
       if(!err){
           res.json({Status: 'subproceso guardado'});
       }else{
           console.log(err);
       }
   
       });    
   });
   
   
   router.put('/thread/:id', (req,res)=>{
   const { nombre} = req.body
   const {id} = req.params;
   console.log(req.params)
   
   const query = `CALL editThread (?,?)`;
   
   mysqlConnetion.query(query,[id,nombre], (err,rows,fields) =>{
       if(!err){
           res.json({Status: 'subproceso editado'});
       }else{
           console.log(err);
       }
       });  
   });
   
   router.delete('/thread/:id', (req, res)=>{
       const {id} = req.params;
       console.log(req.params);
       mysqlConnetion.query('DELETE FROM  subproceso WHERE idsubProceso = ?',[id], (err, rows,fields)=>{
           if(!err){
               res.json('subproceso Eliminado');
           }else{
               console.log(err);
           }
        } )
   
   });
  

module.exports = router;