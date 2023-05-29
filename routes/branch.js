const express = require('express');
const router = express.Router();
const mysqlConnetion = require('../database');



//// funciones a la tabla de subproceso
router.get('/branch/',(req, res)=>{
    mysqlConnetion.query('SELECT   * FROM  sucursales ORDER BY sucursalesNombre ASC ',(err,rows,fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    })
});

router.get('/branch/:id',(req, res)=>{
    const {id} = req.params;
    mysqlConnetion.query('SELECT * from  sucursales WHERE idsucursales = ?',[id], (err, rows,fields)=>{
       if(!err){
           res.json(rows[0]);
       }else{
           console.log(err);
       }
    });
   });
   
   
   router.post('/branch/add', (req,res) => {
   const {nombre} = req.body;
   const query = `
   CALL AddBranch (?);
   `;
   
   mysqlConnetion.query(query,[nombre], (err,rows,fields) =>{
       if(!err){
           res.json({Status: 'sucursal guardado aqui'});
       }else{
           console.log(err);
       }
   
       });    
   });
   
   
   router.put('/branch/:id', (req,res)=>{
   const { nombre} = req.body
   const {id} = req.params;
   console.log(req.params)
   
   const query = `CALL editBranch (?,?)`;
   
   mysqlConnetion.query(query,[id,nombre], (err,rows,fields) =>{
       if(!err){
           res.json({Status: 'sucursal editado'});
       }else{
           console.log(err);
       }
       });  
   });
   
   router.delete('/branch/:id', (req, res)=>{
       const {id} = req.params;
       console.log(req.params);
       mysqlConnetion.query('DELETE FROM  sucursales WHERE idsucursales = ?',[id], (err, rows,fields)=>{
           if(!err){
               res.json('sucursal Eliminado');
           }else{
               console.log(err);
           }
        } )
   
   });
  

module.exports = router;