const express = require('express');
const router = express.Router();




const mysqlConnetion = require('../database');


//// funciones a la tabla de descuentos
router.get('/discounts/',(req, res)=>{
    mysqlConnetion.query('SELECT   descuentos.iddescuentos,   descuentos.descuentosNombre,   descuentos.descuentosValor FROM   descuentos',(err,rows,fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    })
});

router.get('/discounts/:id',(req, res)=>{
    const {id} = req.params;
    mysqlConnetion.query('SELECT * from  descuentos WHERE iddescuentos = ?',[id], (err, rows,fields)=>{
       if(!err){
           res.json(rows[0]);
       }else{
           console.log(err);
       }
    });
   });
   
   
   router.post('/discounts/add', (req,res) => {
   const {nombre, valor} = req.body;
   const query = `
   CALL AddDiscounts (?,?);
   `;
   
   mysqlConnetion.query(query,[nombre, valor], (err,rows,fields) =>{
       if(!err){
           res.json({Status: 'descuento guardado'});
       }else{
           console.log(err);
       }
   
       });    
   });
   
   
   router.put('/discounts/:id', (req,res)=>{
   const { nombre, valor} = req.body
   const {id} = req.params;
   console.log(req.params)
   
   const query = `CALL editDiscounts (?,?,?)`;
   
   mysqlConnetion.query(query,[id,nombre, valor], (err,rows,fields) =>{
       if(!err){
           res.json({Status: 'Descuento editado'});
       }else{
           console.log(err);
       }
       });  
   });
   
   router.delete('/discounts/:id', (req, res)=>{
       const {id} = req.params;
       console.log(req.params);
       mysqlConnetion.query('DELETE FROM  descuentos WHERE iddescuentos = ?',[id], (err, rows,fields)=>{
           if(!err){
               res.json('Descuento Eliminado');
           }else{
               console.log(err);
           }
        } )
   
   });
  

///**** aqui estan todas las funciones de las tareas */

//// funciones a la tabla de control


    router.get('/performance/',(req, res)=>{
    mysqlConnetion.query('SELECT   controlrendimiento.idcontrolRendimiento,   controlrendimiento.controlRendimientoEmpleadoId,   controlrendimiento.controlRendimientoProductoCodigo,   productos.productosNombre,   subproceso.subProcesoNombre,   estado.EstadoNombre,   controlrendimiento.controlRendimientoFechaInicio,   controlrendimiento.controlRendimientoFechaPausa,   controlrendimiento.controlRendimientoFechaFinal,    productos.tiempoEstandar,   controlrendimiento.controlRendimientoTotalDescuentos, controlrendimiento.controlrendimientoFechaReinicio, controlrendimiento.controlrendimientoTiempoDuracion FROM   controlrendimiento,   estado,   productos,   subproceso WHERE   controlrendimiento.controlRendimientoEstado =  estado.idEstado AND   controlrendimiento.controlRendimientoProductoCodigo =   productos.idproductos AND   productos.subProcesoId =  subproceso.idsubProceso  ORDER BY   controlrendimiento.idcontrolRendimiento DESC;',(err,rows,fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    })
    });

/// rest datos de la tarea
    router.get('/performance/userid/:id',(req, res)=>{
    const {id} = req.params;
    mysqlConnetion.query('SELECT   controlrendimiento.idcontrolRendimiento,   controlrendimiento.controlRendimientoEmpleadoId, empleados.empleadosNombre, empleados.empleadosApellidos,  controlrendimiento.controlRendimientoProductoCodigo, empleados.empleadosCedula,  controlrendimiento.controlrendimientoCantidad, productos.productosNombre, productos.actividad,  subproceso.subProcesoNombre,   estado.EstadoNombre,   controlrendimiento.controlRendimientoFechaInicio,   controlrendimiento.controlRendimientoFechaPausa,   controlrendimiento.controlRendimientoFechaFinal,    productos.tiempoEstandar,   controlrendimiento.controlRendimientoTotalDescuentos, controlrendimiento.controlrendimientoFechaReinicio, controlrendimiento.controlrendimientoTiempoDuracion, controlrendimiento.controlrendimientoNumeroPedido, controlrendimiento.controlrendimientoSucursal, productos.productosCodigo  FROM   controlrendimiento,   estado,   productos,   subproceso, empleados WHERE   controlrendimiento.controlRendimientoEstado =  estado.idEstado AND   controlrendimiento.controlRendimientoProductoCodigo =   productos.idproductos AND   productos.subProcesoId =  subproceso.idsubProceso AND estado.EstadoNombre <> "Finalizado" AND controlrendimiento.controlRendimientoEmpleadoId = empleados.idempleados AND controlRendimientoEmpleadoId=? ORDER BY   controlrendimiento.idcontrolRendimiento DESC',[id], (err, rows,fields)=>{
       if(!err){
           res.json(rows);
           console.log('usuario valido')
       }else{
           console.log(err);
       }
    });
   });



   //// mostrar todas las tareas a los coordinadores

   router.get('/performance/coordinators/:area',(req, res)=>{
    const {area} = req.params;
    mysqlConnetion.query('SELECT   controlrendimiento.idcontrolRendimiento,   controlrendimiento.controlRendimientoEmpleadoId, empleados.empleadosNombre, empleados.empleadosCedula,empleados.empleadosApellidos,empleados.empleadosRolId, area.areaNombre, roles.rolesNombre,    controlrendimiento.controlRendimientoProductoCodigo, controlrendimiento.controlrendimientoCantidad,  productos.productosNombre,   subproceso.subProcesoNombre, productos.actividad,   estado.EstadoNombre,   controlrendimiento.controlRendimientoFechaInicio,   controlrendimiento.controlRendimientoFechaPausa,   controlrendimiento.controlRendimientoFechaFinal,    productos.tiempoEstandar,   controlrendimiento.controlRendimientoTotalDescuentos, controlrendimiento.controlrendimientoFechaReinicio, controlrendimiento.controlrendimientoTiempoDuracion,controlrendimiento.controlrendimientoNumeroPedido, controlrendimiento.controlrendimientoSucursal, productos.productosCodigo FROM   controlrendimiento,   estado,   productos,   subproceso, empleados, roles, area WHERE   controlrendimiento.controlRendimientoEstado =  estado.idEstado AND   controlrendimiento.controlRendimientoProductoCodigo =  productos.idproductos AND   productos.subProcesoId =  subproceso.idsubProceso AND controlrendimiento.controlRendimientoEmpleadoId = empleados.idempleados AND empleados.empleadosRolId = roles.idroles AND empleados.empleadosAreaId= area.idarea AND area.areaNombre=? AND  estado.EstadoNombre <> "Finalizado" ORDER BY   controlrendimiento.idcontrolRendimiento DESC',[area], (err, rows,fields)=>{
       if(!err){
           res.json(rows);
           console.log('area valido')
       }else{
           console.log(err);
       }
    });
   });


   router.get('/performance/coordinators/detailsDiscounts/:area',(req, res)=>{
    const {area} = req.params;
    mysqlConnetion.query('SELECT   controlrendimiento_descuentos.id,  controlrendimiento_descuentos.totales,  descuentos.descuentosNombre,   descuentos.descuentosValor,   controlrendimiento_descuentos.cantidad,   controlrendimiento_descuentos.controlrendimientoID,   controlrendimiento_descuentos.descuentosID, controlrendimiento.controlRendimientoEmpleadoId, empleadosAreaId, area.areaNombre FROM   controlrendimiento_descuentos,   descuentos, controlrendimiento, empleados, area WHERE   controlrendimiento_descuentos.descuentosID =  descuentos.iddescuentos AND  controlrendimiento_descuentos.controlrendimientoID = controlrendimiento.idcontrolRendimiento AND controlrendimiento.controlRendimientoEmpleadoId = empleados.idempleados AND empleadosAreaId= area.idarea AND area.areaNombre=?',[area], (err, rows,fields)=>{
       if(!err){
           res.json(rows);
           console.log('control valido')
       }else{
           console.log(err);
       }
    });
   });



//// END Coordinadores


   router.get('/performance/finish/userid/:id',(req, res)=>{
    const {id} = req.params;
    mysqlConnetion.query('SELECT   controlrendimiento.idcontrolRendimiento,   controlrendimiento.controlRendimientoEmpleadoId,   controlrendimiento.controlRendimientoProductoCodigo,   productos.productosNombre,   subproceso.subProcesoNombre,   estado.EstadoNombre,   controlrendimiento.controlRendimientoFechaInicio,   controlrendimiento.controlRendimientoFechaPausa,   controlrendimiento.controlRendimientoFechaFinal,    productos.tiempoEstandar,   controlrendimiento.controlRendimientoTotalDescuentos, controlrendimiento.controlrendimientoFechaReinicio, controlrendimiento.controlrendimientoTiempoDuracion FROM   controlrendimiento,   estado,   productos,   subproceso WHERE   controlrendimiento.controlRendimientoEstado =  estado.idEstado AND   controlrendimiento.controlRendimientoProductoCodigo =   productos.idproductos AND   productos.subProcesoId =  subproceso.idsubProceso AND estado.EstadoNombre = "Finalizado" AND controlRendimientoEmpleadoId = ? ORDER BY   controlrendimiento.idcontrolRendimiento DESC',[id], (err, rows,fields)=>{
       if(!err){
           res.json(rows);
           console.log('usuario valido')
       }else{
           console.log(err);
       }
    });
   });


//Add tareas

router.post('/performance/add', async (req,res) => {
   
    const {codigo, idEmpledo, fechaInicio, estadoid, cantidad, factura, sucursal,codProducto} = req.body;
    const query = `
    CALL AddPerformance (?,?,?,?,?,?,?,?);
    `;    
    mysqlConnetion.query(query,[codigo,idEmpledo,fechaInicio,estadoid,cantidad,factura,sucursal,codProducto], (err,rows,fields) =>{
        if(!err){
            res.json({Status: 'control grabado'});

        }else{
            console.log(err);
        }
    
        });    
    });

//Edit -- check done y pause
router.put('/performance/:id', async (req,res) => {
    //console.log('paso por aqui')
    const {id} = req.params;
    const {fechaFinal,fechaPausa,estado,duraciontarea,tiemporeal,fechareinicio,idUSer} = req.body;   

    console.log(req.params)
    const query = `
    CALL editPerformance (?,?,?,?,?,?,?);
    `;    
    mysqlConnetion.query(query,[id,fechaFinal, fechaPausa,estado,duraciontarea,tiemporeal,fechareinicio], (err,rows,fields) =>{
        if(!err){
           
            res.json({Status: 'control tarea finalizada'});         

        }else{
            console.log(err);
        }
    
        }); 
   
    
    });


// Reasing task

router.put('/reasign/:id', (req,res) => {
    
    const {userid} = req.body;
    const {id} = req.params;
    console.log(req.params)
    const query = `
    CALL editReasign (?,?);
    `;    
    mysqlConnetion.query(query,[id,userid], (err,rows,fields) =>{
        if(!err){
            res.json({Status: 'control Done'});
        }else{
            console.log(err);
        }
    
        });    
    });


//delete
   router.delete('/performance/:id', async (req, res)=>{
    const {id} = req.params;
    console.log(req.params);

   

    mysqlConnetion.query('DELETE FROM  controlrendimiento WHERE idcontrolRendimiento = ?',[id], (err, rows,fields)=>{
        if(!err){
            res.json('producto Eliminado');           
           

        }else{
            console.log(err);
        }
     } )

    });


    /// agregar los valores de los descuentos

    router.put('/performance/userid/:id', (req,res) => {
        const {valor, estado} = req.body;
        const {id} = req.params;
        console.log(req.params)
        const query = `
        CALL editPerformancewithvalue (?,?,?);
        `;    
        mysqlConnetion.query(query,[id,valor,estado], (err,rows,fields) =>{
            if(!err){
                res.json({Status: 'control Done con valores'});
            }else{
                console.log(err);
            }
        
            });    
        });



   /******* aqui esta todas las api de consultas para los detalles de decuentos y listado de los descuentos */

   /// detalles de descuento

   router.get('/performance/detailsDiscounts/:id',(req, res)=>{
    const {id} = req.params;
    mysqlConnetion.query('SELECT   controlrendimiento_descuentos.id,  controlrendimiento_descuentos.totales,  descuentos.descuentosNombre,   descuentos.descuentosValor,   controlrendimiento_descuentos.cantidad,   controlrendimiento_descuentos.controlrendimientoID,   controlrendimiento_descuentos.descuentosID FROM   controlrendimiento_descuentos,   descuentos WHERE   controlrendimiento_descuentos.descuentosID =  descuentos.iddescuentos AND    controlrendimiento_descuentos.controlrendimientoID= ?',[id], (err, rows,fields)=>{
       if(!err){
           res.json(rows);
           console.log('control valido')
       }else{
           console.log(err);
       }
    });
   });

//// api de modificacion de valores de la tareas para un area


router.put('/performance/change/:id', (req,res) => {
    const {total, duraciontarea, } = req.body;
    const {id} = req.params;
    
    console.log(req.params)
    const query = `
    CALL editPerformanceChangeValues (?,?,?);
    `;    
    mysqlConnetion.query(query,[id,total, duraciontarea], (err,rows,fields) =>{
        if(!err){
            res.json({Status: 'control Done con valores'});
        }else{
            console.log(err);
        }
    
        });    
    });


    
router.put('/performance/changeAllTask/:id', (req,res) => {
    const {item, cantidad, pedido, sucursal } = req.body;
    const {id} = req.params;
    console.log(req.params)
    const query = `
    CALL editPerformanceChangeValuesAllTask (?,?,?,?,?);
    `;    
    mysqlConnetion.query(query,[id,item, cantidad,pedido, sucursal], (err,rows,fields) =>{
        if(!err){
            res.json({Status: 'control Done con valores nuevos'});
        }else{
            console.log(err);
        }
    
        });    
    });

    router.get('/performance/change/:area/:init/:final',(req, res)=>{
        const {area, init,final} = req.params;
        mysqlConnetion.query('SELECT   controlrendimiento.idcontrolRendimiento,   controlrendimiento.controlRendimientoEmpleadoId, empleados.empleadosNombre, empleados.empleadosApellidos,empleados.empleadosRolId, area.areaNombre, roles.rolesNombre,    controlrendimiento.controlRendimientoProductoCodigo, controlrendimiento.controlrendimientoCantidad,  productos.productosNombre,   subproceso.subProcesoNombre,   estado.EstadoNombre,  controlrendimiento.controlRendimientoFechaPausa, productos.tiempoEstandar,   controlrendimiento.controlRendimientoTotalDescuentos, controlrendimiento.controlrendimientoFechaReinicio, controlrendimiento.controlrendimientoTiempoDuracion, round(controlrendimiento.controlrendimientoTiempoDuracion - controlrendimiento.controlRendimientoTotalDescuentos, 0) as TiemposReal, controlrendimiento.controlrendimientoNumeroPedido, controlrendimiento.controlrendimientoSucursal, productos.productosCodigo, DATE_FORMAT(controlrendimiento.controlRendimientoFechaInicio, "%m/%d/%Y") as controlRendimientoFechaInicio, DATE_FORMAT(controlrendimiento.controlRendimientoFechaFinal, "%m/%d/%Y") as controlRendimientoFechaFinal FROM   controlrendimiento,   estado,   productos,   subproceso, empleados, roles, area WHERE   controlrendimiento.controlRendimientoEstado =  estado.idEstado AND   controlrendimiento.controlRendimientoProductoCodigo =   productos.idproductos AND   productos.subProcesoId =  subproceso.idsubProceso AND controlrendimiento.controlRendimientoEmpleadoId = empleados.idempleados AND empleados.empleadosRolId = roles.idroles AND empleados.empleadosAreaId= area.idarea AND area.areaNombre=? AND controlRendimientoFechaInicio >= ?   ORDER BY   controlrendimiento.idcontrolRendimiento DESC',[area, init ], (err, rows,fields)=>{
           if(!err){
               res.json(rows);
               console.log('area valido')
           }else{
               console.log(err);
           }
        });
       });



//Add descuentos

router.post('/discounstPerformance/add', (req,res) => {
    const {idControl, idDescuento, valor, total} = req.body;
    const query = `
    CALL AddDiscountInControl (?,?,?, ?);
    `;    
    mysqlConnetion.query(query,[idControl, idDescuento, valor, total], (err,rows,fields) =>{
        if(!err){
            res.json({Status: 'descuento en control  grabado'});
        }else{
            console.log(err);
        }
    
        });    
    });



    //// Eliminar descuento
    router.delete('/performance/detailsDiscounts/:id/:element', (req, res)=>{
        const {id} = req.params;
        const {element} = req.params;
        console.log(req.params);
        mysqlConnetion.query('DELETE From controlrendimiento_descuentos Where controlrendimientoID=? AND id=?',[id,element], (err, rows,fields)=>{
            if(!err){
                res.json('producto Eliminado');
            }else{
                console.log(err);
            }
         } )
    
        });

module.exports = router;