const express = require('express');
const router = express.Router();

const mysqlConnetion = require('../database');

////*** aqui estan todas las api, para realizar los reportes graficos */

///graph
router.get('/graph/userid/:id',(req, res)=>{
    const {id} = req.params;
    mysqlConnetion.query('SELECT     controlrendimiento.controlRendimientoEmpleadoId,    controlrendimiento.controlRendimientoFechaInicio,    controlrendimiento.controlRendimientoFechaFinal,    controlrendimiento.controlrendimientoTiempoReal,    (productos.tiempoEstandar * controlrendimiento.controlrendimientoCantidad) AS tiempoEstandar,    productos.productosNombre FROM    controlrendimiento        INNER JOIN    productos ON  productos.idproductos = controlrendimiento.controlRendimientoProductoCodigo WHERE    controlrendimiento.controlRendimientoEstado = 3        AND controlrendimiento.controlRendimientoEmpleadoId =? and controlrendimiento.controlRendimientoFechaFinal > NOW() - INTERVAL 15 DAY ORDER BY controlrendimiento.controlRendimientoFechaFinal ASC',[id], (err, rows,fields)=>{
       if(!err){
           res.json(rows);
           console.log('usuario datos')
       }else{
           console.log(err);
       }
    });
   });


module.exports = router;