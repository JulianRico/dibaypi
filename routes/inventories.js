const express = require('express');
const router = express.Router();

const mysqlConnetion = require('../database');


//// funciones a la tabla de inventarios
router.get('/inventories/',(req, res)=>{
    mysqlConnetion.query('SELECT inventario.idinventario,inventario.inventarioCodigo,inventario.inventarioDescripcion,  bodegas.bodegasUbicacion, bodegas.bodegasNombre,      unidades.unidadesValor,    inventario.inventarioCantidad, inventario.inventarioCosto, inventario.inventarioValorTotal,    tipoinventario.tipoinventarioNombre  FROM inventario INNER JOIN    bodegas ON inventario.bodegasID = bodegas.idbodegas INNER JOIN    unidades ON inventario.UnidadMedidadID = unidades.idunidades INNER JOIN    tipoinventario ON tipoinventario.idtipoinventario = inventario.tipInventarioID  ORDER BY bodegas.bodegasNombre',(err,rows,fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    })
});

router.get('/inventories/:id',(req, res)=>{
    const {id} = req.params;
    mysqlConnetion.query('SELECT * from inventario  WHERE idinventario = ?',[id], (err, rows,fields)=>{
       if(!err){
           res.json(rows[0]);
       }else{
           console.log(err);
       }
    });
   });
   
   
   router.post('/inventories/add', (req,res) => {
   const {codigo,descripcion,tipoid,bodegasID,UnidadMedidadID,cantidad,valor,valorTotal} = req.body;
   const query = `CALL AddInventories (?,?,?,?,?,?,?,?);`;   
   mysqlConnetion.query(query,[codigo, descripcion, tipoid, bodegasID, UnidadMedidadID, cantidad, valor, valorTotal], (err,rows,fields) =>{
       if(!err){
           res.json({Status: 'inventario guardado'});
       }else{
           console.log(err);
       }
   
       });    
   });
   
   
   router.put('/inventories/:id', (req,res)=>{
   const { codigo,descripcion,tipoid,bodegasID,UnidadMedidadID,cantidad,valor,valorTotal} = req.body
   const {id} = req.params;
   console.log(req.params)
   
   const query = `CALL editInventories (?,?,?,?,?,?,?,?,?)`;
   
   mysqlConnetion.query(query,[id,codigo,descripcion,tipoid,bodegasID,UnidadMedidadID,cantidad,valor,valorTotal], (err,rows,fields) =>{
       if(!err){
           res.json({Status: 'inventario editado'});
       }else{
           console.log(err);
       }
       });  
   });
   
   router.delete('/inventories/:id', (req, res)=>{
       const {id} = req.params;
       console.log(req.params);
       mysqlConnetion.query('DELETE FROM inventario WHERE inventario.idinventario = ?',[id], (err, rows,fields)=>{
           if(!err){
               res.json('Inventario Eliminado');
           }else{
               console.log(err);
           }
        } )
   
   });
  


///  tipo de inventario

router.get('/typeinventory/',(req, res)=>{
    mysqlConnetion.query('Select    tipoinventario.idtipoinventario,    tipoinventario.tipoinventarioNombre From    tipoinventario ORDER BY tipoinventarioNombre ASC ',(err,rows,fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    })
});

router.get('/typeinventory/:id',(req, res)=>{
    const {id} = req.params;
    mysqlConnetion.query('SELECT * from  tipoinventario WHERE idtipoinventario = ?',[id], (err, rows,fields)=>{
       if(!err){
           res.json(rows[0]);
       }else{
           console.log(err);
       }
    });
   });
   
   
   router.post('/typeinventory/add', (req,res) => {
   const {nombre} = req.body;
   const query = `
   CALL AddTypeinventory (?);
   `;
   
   mysqlConnetion.query(query,[nombre], (err,rows,fields) =>{
       if(!err){
           res.json({Status: 'area guardado'});
       }else{
           console.log(err);
       }
   
       });    
   });
   
   
   router.put('/typeinventory/:id', (req,res)=>{
   const { nombre} = req.body
   const {id} = req.params;
   console.log(req.params)
   
   const query = `CALL editTypeinventory (?,?)`;
   
   mysqlConnetion.query(query,[id,nombre], (err,rows,fields) =>{
       if(!err){
           res.json({Status: 'area editado'});
       }else{
           console.log(err);
       }
       });  
   });
   
   router.delete('/typeinventory/:id', (req, res)=>{
       const {id} = req.params;
       console.log(req.params);
       mysqlConnetion.query('DELETE FROM  tipoinventario WHERE idtipoinventario = ?',[id], (err, rows,fields)=>{
           if(!err){
               res.json('area Eliminado');
           }else{
               console.log(err);
           }
        } )
   
   });





/// Bodegas

router.get('/warehouse/',(req, res)=>{
    mysqlConnetion.query('Select    bodegas.idbodegas,    bodegas.bodegasNombre,    bodegas.bodegasUbicacion From    bodegas ORDER BY bodegasNombre ASC ',(err,rows,fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    })
});

router.get('/warehouse/:id',(req, res)=>{
    const {id} = req.params;
    mysqlConnetion.query('SELECT * from  bodegas WHERE idbodegas = ?',[id], (err, rows,fields)=>{
       if(!err){
           res.json(rows[0]);
       }else{
           console.log(err);
       }
    });
   });
   
   
   router.post('/warehouse/add', (req,res) => {
   const {nombre, ubicacion} = req.body;
   const query = `
   CALL AddWarehouse (?,?);
   `;
   
   mysqlConnetion.query(query,[nombre,ubicacion], (err,rows,fields) =>{
       if(!err){
           res.json({Status: 'area guardado'});
       }else{
           console.log(err);
       }
   
       });    
   });
   
   
   router.put('/warehouse/:id', (req,res)=>{
   const { nombre, ubicacion} = req.body
   const {id} = req.params;
   console.log(req.params)
   
   const query = `CALL editWarehouse (?,?,?)`;
   
   mysqlConnetion.query(query,[id,nombre, ubicacion], (err,rows,fields) =>{
       if(!err){
           res.json({Status: 'area editado'});
       }else{
           console.log(err);
       }
       });  
   });
   
   router.delete('/warehouse/:id', (req, res)=>{
       const {id} = req.params;
       console.log(req.params);
       mysqlConnetion.query('DELETE FROM  bodegas WHERE idbodegas = ?',[id], (err, rows,fields)=>{
           if(!err){
               res.json('area Eliminado');
           }else{
               console.log(err);
           }
        } )
   
   });



/// unidades de medidas

router.get('/units/',(req, res)=>{
    mysqlConnetion.query('Select    unidades.idunidades,    unidades.unidadesValor From    unidades ORDER BY unidadesValor ASC ',(err,rows,fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    })
});

router.get('/units/:id',(req, res)=>{
    const {id} = req.params;
    mysqlConnetion.query('SELECT * from  unidades WHERE idunidades = ?',[id], (err, rows,fields)=>{
       if(!err){
           res.json(rows[0]);
       }else{
           console.log(err);
       }
    });
   });
   
   
   router.post('/units/add', (req,res) => {
   const {nombre} = req.body;
   const query = `
   CALL AddUnits (?);
   `;
   
   mysqlConnetion.query(query,[nombre], (err,rows,fields) =>{
       if(!err){
           res.json({Status: 'area guardado'});
       }else{
           console.log(err);
       }
   
       });    
   });
   
   
   router.put('/units/:id', (req,res)=>{
   const { nombre} = req.body
   const {id} = req.params;
   console.log(req.params)
   
   const query = `CALL editUnits (?,?)`;
   
   mysqlConnetion.query(query,[id,nombre], (err,rows,fields) =>{
       if(!err){
           res.json({Status: 'area editado'});
       }else{
           console.log(err);
       }
       });  
   });
   
   router.delete('/units/:id', (req, res)=>{
       const {id} = req.params;
       console.log(req.params);
       mysqlConnetion.query('DELETE FROM  unidades WHERE idunidades = ?',[id], (err, rows,fields)=>{
           if(!err){
               res.json('area Eliminado');
           }else{
               console.log(err);
           }
        } )
   
   });


/// impostivos

router.get('/tax/',(req, res)=>{
    mysqlConnetion.query('Select    impositivos.idImpositivos,    impositivos.ImpositivosNombre,    impositivos.ImpositivosIVA,    impositivos.ImpositivosICA,    impositivos.ImpositivosRTE From    impositivos ORDER BY  impositivos.ImpositivosNombre ASC ',(err,rows,fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    })
});

router.get('/tax/:id',(req, res)=>{
    const {id} = req.params;
    mysqlConnetion.query('SELECT * from  impositivos WHERE idImpositivos = ?',[id], (err, rows,fields)=>{
       if(!err){
           res.json(rows[0]);
       }else{
           console.log(err);
       }
    });
   });
   
   
   router.post('/tax/add', (req,res) => {
   const {nombre,IVA, ICA, RTE} = req.body;
   const query = `
   CALL AddTax (?,?,?,?);
   `;
   
   mysqlConnetion.query(query,[nombre,IVA, ICA, RTE], (err,rows,fields) =>{
       if(!err){
           res.json({Status: 'area guardado'});
       }else{
           console.log(err);
       }
   
       });    
   });
   
   
   router.put('/tax/:id', (req,res)=>{
    const {nombre,IVA, ICA, RTE} = req.body;
   const {id} = req.params;
   console.log(req.params)
   
   const query = `CALL editTax (?,?,?,?,?)`;
   
   mysqlConnetion.query(query,[id,nombre,IVA, ICA, RTE], (err,rows,fields) =>{
       if(!err){
           res.json({Status: 'area editado'});
       }else{
           console.log(err);
       }
       });  
   });
   
   router.delete('/tax/:id', (req, res)=>{
       const {id} = req.params;
       console.log(req.params);
       mysqlConnetion.query('DELETE FROM  impositivos WHERE idImpositivos = ?',[id], (err, rows,fields)=>{
           if(!err){
               res.json('area Eliminado');
           }else{
               console.log(err);
           }
        } )
   
   });


module.exports = router;