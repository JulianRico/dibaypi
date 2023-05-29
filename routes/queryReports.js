const express = require('express');
const router = express.Router();
const _ = require('lodash');
const mysqlConnetion = require('../database');

////*** aqui estan todas las api, para realizar los reportes graficos */

///graph
router.get('/queryReportsFromUser/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnetion.query('Select    empleados.empleadosCedula,    empleados.empleadosNombre,empleados.empleadosApellidos,    productos.productosNombre,    subproceso.subProcesoNombre,    productos.tiempoEstandar,    empleados.empleadosCostoMinuto,    productos.tiempoEstandar * empleados.empleadosCostoMinuto As CostoEstandar,    controlrendimiento.controlRendimientoTotalDescuentos,    controlrendimiento.controlrendimientoTiempoDuracion,    controlrendimiento.controlrendimientoTiempoReal,        estado.EstadoNombre,    controlrendimiento.controlrendimientoTiempoReal * empleados.empleadosCostoMinuto As TotalCostoReal,    ((controlrendimiento.controlrendimientoTiempoReal * empleados.empleadosCostoMinuto) -    (productos.tiempoEstandar * empleados.empleadosCostoMinuto)) As DiferenciaCosto,    ((((controlrendimiento.controlrendimientoTiempoReal * empleados.empleadosCostoMinuto) /    ((productos.productosCostoEstandar))) - 1) * 100) As DiferenciaProcentaje,    controlrendimiento.controlRendimientoFechaInicio,    controlrendimiento.controlRendimientoFechaFinal From    controlrendimiento Inner Join    empleados On empleados.idempleados = controlrendimiento.controlRendimientoEmpleadoId Inner Join    productos On controlrendimiento.controlRendimientoProductoCodigo = productos.idproductos Inner Join    subproceso On productos.subProcesoId = subproceso.idsubProceso Inner Join   estado On controlrendimiento.controlRendimientoEstado = estado.idEstado Order By    controlrendimiento.idcontrolRendimiento Desc where empleados.idempleados=?', [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
            console.log('usuario datos')
        } else {
            console.log(err);
        }
    });
});


router.get('/queryReportsFromUsers/', (req, res) => {/*  */
    const { id } = req.params;
    mysqlConnetion.query('Select   controlrendimiento.idcontrolRendimiento as codigoTarea, empleados.empleadosCedula,    empleados.empleadosNombre,empleados.empleadosApellidos,    productos.productosNombre,    subproceso.subProcesoNombre, controlrendimiento.controlrendimientoCantidad,   productos.tiempoEstandar, (controlrendimiento.controlrendimientoCantidad*productos.tiempoEstandar) as TiempoEstimado,    empleados.empleadosCostoMinuto,    productos.tiempoEstandar * empleados.empleadosCostoMinuto As CostoEstandar,    controlrendimiento.controlRendimientoTotalDescuentos,    controlrendimiento.controlrendimientoTiempoDuracion,    controlrendimiento.controlrendimientoTiempoReal,        estado.EstadoNombre,    controlrendimiento.controlrendimientoTiempoReal * empleados.empleadosCostoMinuto As TotalCostoReal,    ((controlrendimiento.controlrendimientoTiempoReal * empleados.empleadosCostoMinuto) -    (productos.tiempoEstandar * empleados.empleadosCostoMinuto)) As DiferenciaCosto,    ((((controlrendimiento.controlrendimientoTiempoReal * empleados.empleadosCostoMinuto)/((productos.tiempoEstandar))) - 1) * 100) As DiferenciaProcentaje,    controlrendimiento.controlRendimientoFechaInicio,    controlrendimiento.controlRendimientoFechaFinal From     controlrendimiento Inner Join     empleados On empleados.idempleados = controlrendimiento.controlRendimientoEmpleadoId Inner Join     productos On controlrendimiento.controlRendimientoProductoCodigo = productos.idproductos Inner Join     subproceso On productos.subProcesoId = subproceso.idsubProceso Inner Join      estado On controlrendimiento.controlRendimientoEstado = estado.idEstado Order By    controlrendimiento.idcontrolRendimiento Desc  ', [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
            console.log('usuario datos')
        } else {
            console.log(err);
        }
    });
});



router.get('/queryTimeReports/', (req, res) => {
    const { id } = req.params;
    mysqlConnetion.query('SELECT controlrendimiento.idcontrolRendimiento AS codigoTarea, empleados.empleadosCedula, empleados.empleadosNombre,empleados.empleadosApellidos, area.areaNombre, productos.productosNombre, subproceso.subProcesoNombre, controlrendimiento.controlrendimientoCantidad, productos.tiempoEstandar AS TiempoEstandar, (controlrendimiento.controlrendimientoCantidad * productos.tiempoEstandar) AS TiempoEstimado, controlrendimiento.controlrendimientoTiempoReal, round(controlrendimiento.controlrendimientoTiempoReal - (productos.tiempoEstandar * controlrendimientoCantidad), 0) AS DiferenciaTiempo, round(((controlrendimiento.controlrendimientoTiempoReal / (productos.tiempoEstandar * controlrendimientoCantidad)) - 1) * 100,0) AS DiferenciaPorcentaje, estado.EstadoNombre, DATE_FORMAT(controlrendimiento.controlRendimientoFechaInicio, "%m/%d/%Y") as controlRendimientoFechaInicio, DATE_FORMAT(controlrendimiento.controlRendimientoFechaFinal, "%m/%d/%Y") as controlRendimientoFechaFinal,controlrendimiento.controlrendimientoNumeroPedido, controlrendimiento.controlrendimientoSucursal FROM  controlrendimiento INNER JOIN  empleados ON empleados.idempleados = controlrendimiento.controlRendimientoEmpleadoId INNER JOIN  productos ON controlrendimiento.controlRendimientoProductoCodigo = productos.idproductos INNER JOIN  subproceso ON productos.subProcesoId = subproceso.idsubProceso INNER JOIN  estado ON controlrendimiento.controlRendimientoEstado = estado.idEstado INNER JOIN  area ON empleados.empleadosAreaId = area.idarea ORDER BY controlrendimiento.idcontrolRendimiento DESC', [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
            console.log('usuario datos')
        } else {
            console.log(err);
        }
    });
});


router.get('/queryReportCosts/', (req, res) => {
    const { id } = req.params;
    mysqlConnetion.query('SELECT controlrendimiento.idcontrolRendimiento AS codigoTarea, empleados.empleadosCedula, empleados.empleadosNombre,empleados.empleadosApellidos, area.areaNombre, productos.productosNombre, subproceso.subProcesoNombre, controlrendimientoCantidad, empleados.empleadosCostoMinuto, productos.tiempoEstandar AS TiempoEstandar, round(controlrendimiento.controlrendimientoTiempoReal, 0) AS TiempoReal, round((productos.tiempoEstandar * controlrendimientoCantidad) * empleados.empleadosCostoMinuto,0) AS CostoEstandar, round(ROUND(controlrendimiento.controlrendimientoTiempoReal, 0) * empleados.empleadosCostoMinuto,0) AS CostoReal, round((ROUND(controlrendimiento.controlrendimientoTiempoReal, 0) * empleados.empleadosCostoMinuto) - ((productos.tiempoEstandar * controlrendimientoCantidad) * empleados.empleadosCostoMinuto),0) AS DiferenciaCostos, round(((ROUND(controlrendimiento.controlrendimientoTiempoReal, 0) / (productos.tiempoEstandar * controlrendimientoCantidad)) - 1) * 100,0) AS DiferenciaPorcentaje, estado.EstadoNombre, DATE_FORMAT(controlrendimiento.controlRendimientoFechaInicio,"%m/%d/%Y") as controlRendimientoFechaInicio, DATE_FORMAT(controlrendimiento.controlRendimientoFechaFinal,"%m/%d/%Y") as controlRendimientoFechaFinal,controlrendimiento.controlrendimientoNumeroPedido, controlrendimiento.controlrendimientoSucursal  FROM  controlrendimiento INNER JOIN  empleados ON empleados.idempleados = controlrendimiento.controlRendimientoEmpleadoId INNER JOIN  productos ON controlrendimiento.controlRendimientoProductoCodigo = productos.idproductos INNER JOIN  subproceso ON productos.subProcesoId = subproceso.idsubProceso INNER JOIN  estado ON controlrendimiento.controlRendimientoEstado = estado.idEstado INNER JOIN  area ON empleados.empleadosAreaId = area.idarea ORDER BY controlrendimiento.idcontrolRendimiento DESC', [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
            console.log('usuario datos')
        } else {
            console.log(err);
        }
    });
});



router.get('/queryReportDisscounts/', (req, res) => {
    const { id } = req.params;
    mysqlConnetion.query('SELECT controlrendimiento_descuentos.controlrendimientoID, controlrendimiento_descuentos.cantidad, controlrendimiento_descuentos.totales AS Valor, descuentos.descuentosNombre, descuentos.descuentosValor, empleados.empleadosNombre,empleados.empleadosApellidos, empleados.empleadosCedula, area.areaNombre, productos.productosNombre, subproceso.subProcesoNombre, empleados.empleadosCostoMinuto, (empleados.empleadosCostoMinuto * controlrendimiento_descuentos.totales) AS TotalDescuento, (cantidad * descuentosValor) AS TotalMinutosDescuento, DATE_FORMAT(controlrendimiento.controlRendimientoFechaInicio, "%m/%d/%Y") as controlRendimientoFechaInicio, DATE_FORMAT(controlrendimiento.controlRendimientoFechaFinal, "%m/%d/%Y") as controlRendimientoFechaFinal, estado.EstadoNombre,controlrendimiento.controlrendimientoNumeroPedido, controlrendimiento.controlrendimientoSucursal FROM  controlrendimiento_descuentos INNER JOIN  descuentos ON controlrendimiento_descuentos.descuentosID = descuentos.iddescuentos INNER JOIN  controlrendimiento ON controlrendimiento_descuentos.controlrendimientoID = controlrendimiento.idcontrolRendimiento INNER JOIN  empleados ON empleados.idempleados = controlrendimiento.controlRendimientoEmpleadoId INNER JOIN  productos ON productos.idproductos = controlrendimiento.controlRendimientoProductoCodigo INNER JOIN  subproceso ON productos.subProcesoId = subproceso.idsubProceso INNER JOIN  estado ON controlrendimiento.controlRendimientoEstado = estado.idEstado INNER JOIN  area ON empleados.empleadosAreaId = area.idarea ORDER BY controlrendimiento.idcontrolRendimiento DESC', [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
            console.log('usuario datos')
        } else {
            console.log(err);
        }
    });
});

/// FILTER TO DATE INITIAL AND FINAL


router.get('/queryReportfilterCosts/:init/:final/:area', (req, res) => {
    const { init, final, area } = req.params;
    mysqlConnetion.query('SELECT controlrendimiento.idcontrolRendimiento AS codigoTarea, empleados.empleadosCedula, empleados.empleadosNombre,empleados.empleadosApellidos, area.areaNombre, productos.productosNombre, subproceso.subProcesoNombre, controlrendimientoCantidad, empleados.empleadosCostoMinuto, productos.tiempoEstandar AS TiempoEstandar, round(controlrendimiento.controlrendimientoTiempoReal, 0) AS TiempoReal, round((productos.tiempoEstandar * controlrendimientoCantidad) * empleados.empleadosCostoMinuto,0) AS CostoEstandar, round(ROUND(controlrendimiento.controlrendimientoTiempoDuracion, 0) * empleados.empleadosCostoMinuto,0) AS CostoReal, round((ROUND(controlrendimiento.controlrendimientoTiempoReal, 0) * empleados.empleadosCostoMinuto) - ((productos.tiempoEstandar * controlrendimientoCantidad) * empleados.empleadosCostoMinuto),0) AS DiferenciaCostos, round(((ROUND(controlrendimiento.controlrendimientoTiempoReal, 0) / (productos.tiempoEstandar * controlrendimientoCantidad)) - 1) * 100,0) AS DiferenciaPorcentaje, estado.EstadoNombre, DATE_FORMAT(controlrendimiento.controlRendimientoFechaInicio,"%m/%d/%Y %H:%i") as controlRendimientoFechaInicio, DATE_FORMAT(controlrendimiento.controlRendimientoFechaFinal,"%m/%d/%Y %H:%i") as controlRendimientoFechaFinal, DATE_FORMAT(controlrendimiento.controlRendimientoFechaPausa, "%m/%d/%Y %H:%i") as controlRendimientoFechaPausa,DATE_FORMAT(controlrendimiento.controlrendimientoFechaReinicio, "%m/%d/%Y %H:%i") as controlRendimientoFechaReinicio, controlrendimiento.controlrendimientoNumeroPedido, controlrendimiento.controlrendimientoSucursal  FROM  controlrendimiento INNER JOIN  empleados ON empleados.idempleados = controlrendimiento.controlRendimientoEmpleadoId INNER JOIN  productos ON controlrendimiento.controlRendimientoProductoCodigo = productos.idproductos INNER JOIN  subproceso ON productos.subProcesoId = subproceso.idsubProceso INNER JOIN  estado ON controlrendimiento.controlRendimientoEstado = estado.idEstado INNER JOIN  area ON empleados.empleadosAreaId = area.idarea  where controlRendimientoFechaInicio >= ? and controlRendimientoFechaFinal < date_add(?, INTERVAL 1 DAY) and area.areaNombre=? ORDER BY controlrendimiento.idcontrolRendimiento DESC', [init, final, area], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
            console.log('datos filtrados')
        } else {
            console.log(err);
        }
    });
});



router.get('/queryReportFilterDisscounts/:init/:final', (req, res) => {
    const { init, final } = req.params;
    mysqlConnetion.query('SELECT controlrendimiento_descuentos.controlrendimientoID, controlrendimiento_descuentos.cantidad, controlrendimiento_descuentos.totales AS Valor, descuentos.descuentosNombre, descuentos.descuentosValor, empleados.empleadosNombre,empleados.empleadosApellidos, empleados.empleadosCedula, area.areaNombre, productos.productosNombre, subproceso.subProcesoNombre, empleados.empleadosCostoMinuto, (empleados.empleadosCostoMinuto * controlrendimiento_descuentos.totales) AS TotalDescuento, (cantidad * descuentosValor) AS TotalMinutosDescuento, DATE_FORMAT(controlrendimiento.controlRendimientoFechaInicio, "%m/%d/%Y") as controlRendimientoFechaInicio, DATE_FORMAT(controlrendimiento.controlRendimientoFechaFinal, "%m/%d/%Y") as controlRendimientoFechaFinal, estado.EstadoNombre,controlrendimiento.controlrendimientoNumeroPedido, controlrendimiento.controlrendimientoSucursal FROM  controlrendimiento_descuentos INNER JOIN  descuentos ON controlrendimiento_descuentos.descuentosID = descuentos.iddescuentos INNER JOIN  controlrendimiento ON controlrendimiento_descuentos.controlrendimientoID = controlrendimiento.idcontrolRendimiento INNER JOIN  empleados ON empleados.idempleados = controlrendimiento.controlRendimientoEmpleadoId INNER JOIN  productos ON productos.idproductos = controlrendimiento.controlRendimientoProductoCodigo INNER JOIN  subproceso ON productos.subProcesoId = subproceso.idsubProceso INNER JOIN  estado ON controlrendimiento.controlRendimientoEstado = estado.idEstado INNER JOIN  area ON empleados.empleadosAreaId = area.idarea where controlRendimientoFechaInicio >= ? and controlRendimientoFechaFinal < date_add(?, INTERVAL 1 DAY) ORDER BY controlrendimiento.idcontrolRendimiento DESC', [init, final], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
            console.log('usuario datos')
        } else {
            console.log(err);
        }
    });
});
/*  router.get('/queryReportfilterCosts/:init/:final',(req, res)=>{
  const {init, final} = req.params;
  mysqlConnetion.query(`CALL GetDateFilterCosts (?,?)`,[init,final], (err, rows,fields)=>{
     if(!err){
         res.json(rows);           
         console.log('datos filtrados')
     }else{
         console.log(err);
     }
  });
 }); */



router.get('/queryFilterTimeReports/:init/:final/:area', (req, res) => {
    const { init, final, area } = req.params;
    console.log(init)
    console.log(final)
    mysqlConnetion.query('SELECT controlrendimiento.idcontrolRendimiento AS codigoTarea, empleados.empleadosCedula, empleados.empleadosNombre,empleados.empleadosApellidos, area.areaNombre, productos.productosNombre, subproceso.subProcesoNombre, controlrendimiento.controlrendimientoCantidad, productos.tiempoEstandar AS TiempoEstandar, round((controlrendimiento.controlrendimientoCantidad * productos.tiempoEstandar), 0) AS TiempoEstimado, round(controlrendimiento.controlrendimientoTiempoReal,0) as controlrendimientoTiempoReal, round(controlrendimiento.controlrendimientoTiempoReal - (productos.tiempoEstandar * controlrendimientoCantidad), 0) AS DiferenciaTiempo, round(((controlrendimiento.controlrendimientoTiempoReal / (productos.tiempoEstandar * controlrendimientoCantidad)) - 1) * 100,0) AS DiferenciaPorcentaje, estado.EstadoNombre, DATE_FORMAT(controlrendimiento.controlRendimientoFechaInicio, "%m/%d/%Y %H:%i") as controlRendimientoFechaInicio, DATE_FORMAT(controlrendimiento.controlRendimientoFechaFinal, "%m/%d/%Y %H:%i") as controlRendimientoFechaFinal,DATE_FORMAT(controlrendimiento.controlRendimientoFechaPausa, "%m/%d/%Y %H:%i") as controlRendimientoFechaPausa,DATE_FORMAT(controlrendimiento.controlrendimientoFechaReinicio, "%m/%d/%Y %H:%i") as controlRendimientoFechaReinicio, controlrendimiento.controlrendimientoNumeroPedido, controlrendimiento.controlrendimientoSucursal FROM  controlrendimiento INNER JOIN  empleados ON empleados.idempleados = controlrendimiento.controlRendimientoEmpleadoId INNER JOIN  productos ON controlrendimiento.controlRendimientoProductoCodigo = productos.idproductos INNER JOIN  subproceso ON productos.subProcesoId = subproceso.idsubProceso INNER JOIN  estado ON controlrendimiento.controlRendimientoEstado = estado.idEstado INNER JOIN  area ON empleados.empleadosAreaId = area.idarea where controlRendimientoFechaInicio >= ? and controlRendimientoFechaFinal < date_add(?, INTERVAL 1 DAY) and area.areaNombre=? ORDER BY controlrendimiento.idcontrolRendimiento DESC', [init, final, area], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
            console.log('usuario datos')
        } else {
            console.log(err);
        }
    });
});

/// porcentaje

router.get('/queryPercentsFromUser/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnetion.query('Select    controlrendimiento.controlrendimientoTiempoReal,    estado.EstadoNombre,    controlrendimiento.controlRendimientoFechaFinal,    empleados.empleadosCostoMinuto,    (controlrendimiento.controlrendimientoTiempoReal*empleados.empleadosCostoMinuto) AS TotalCostoReal,        ((controlrendimiento.controlrendimientoTiempoReal*empleados.empleadosCostoMinuto)-(productos.tiempoEstandar*empleados.empleadosCostoMinuto)) As DiferenciaCosto,        ((((controlrendimiento.controlrendimientoTiempoReal*empleados.empleadosCostoMinuto)/((productos.productosCostoEstandar)))-1)*100) As DiferenciaProcentaje From    controlrendimiento Inner Join    empleados On empleados.idempleados = controlrendimiento.controlRendimientoEmpleadoId Inner Join    productos On controlrendimiento.controlRendimientoProductoCodigo = productos.idproductos Inner Join    subproceso On productos.subProcesoId = subproceso.idsubProceso Inner Join    estado On controlrendimiento.controlRendimientoEstado = estado.idEstado Where    estado.EstadoNombre = "Finalizado" and empleados.idempleados=?', [id], (err, rows, fields) => {
        if (!err) {
            res.json(rows);
            console.log('usuario datos')
        } else {
            console.log(err);
        }
    });
});


////cargo todas la tareas 
router.get('/querytimesfortasks/:init/:final/:area/:subproceso/:producto', (req, res) => {
    const { init, final, area, subproceso, producto } = req.params;
    const query = `
    CALL get_timesforuser (?,?,?,?,?);
    `;
    mysqlConnetion.query(query, [init, final, area, subproceso, producto], (err, rows, fields) => {
        if (!err) {
            //console.log(rows)

            res.json(rows);
            console.log('usuario datos get')
        } else {
            console.log(err);
        }
    });
});

//// carga todos lo subprocesos para el reporte de tiempo de todas las tareas.
router.get('/queryallThread/:area', (req, res) => {
    const { area } = req.params;
    const query = `
    SELECT  area.areaNombre,  subproceso.subProcesoNombre FROM  controlrendimiento INNER JOIN  empleados ON empleados.idempleados = controlrendimiento.controlRendimientoEmpleadoId INNER JOIN  productos ON controlrendimiento.controlRendimientoProductoCodigo = productos.idproductos INNER JOIN  subproceso ON productos.subProcesoId = subproceso.idsubProceso INNER JOIN  estado ON controlrendimiento.controlRendimientoEstado = estado.idEstado INNER JOIN  area ON empleados.empleadosAreaId = area.idarea and area.areaNombre=? and estado.EstadoNombre = "Finalizado"  GROUP BY subproceso.subProcesoNombre;
    `;
    mysqlConnetion.query(query, [area], (err, rows, fields) => {
        if (!err) {
            //console.log(rows)

            res.json(rows);
            console.log('usuario datos get')
        } else {
            console.log(err);
        }
    });
});
//// cargo todas los productos de todas la tareas ejecutadas en el rango de fechas.

router.get('/queryallproducts/:init/:final/:area/:subproceso/', (req, res) => {
    const { init, final, area, subproceso } = req.params;
    const query = `
    SELECT productos.productosNombre FROM  controlrendimiento INNER JOIN  empleados ON empleados.idempleados = controlrendimiento.controlRendimientoEmpleadoId INNER JOIN  productos ON controlrendimiento.controlRendimientoProductoCodigo = productos.idproductos INNER JOIN  subproceso ON productos.subProcesoId = subproceso.idsubProceso INNER JOIN  estado ON controlrendimiento.controlRendimientoEstado = estado.idEstado INNER JOIN  area ON empleados.empleadosAreaId = area.idarea where controlRendimientoFechaInicio >= ? and controlRendimientoFechaFinal < DATE_ADD(?, INTERVAL 1 DAY) and area.areaNombre=? and subproceso.subProcesoNombre = ? group by  productos.productosNombre;
    `
    mysqlConnetion.query(query, [init, final, area, subproceso], (err, rows, fields) => {
        if (!err) {
            //console.log(rows)

            res.json(rows);
            console.log('usuario productos get')
        } else {
            console.log(err);
        }
    });
});



router.get('/queryReportProducts/:id',(req, res)=>{
    const {id} = req.params;
    mysqlConnetion.query('Select     productos.idproductos,     productos.productosCodigo,     productspadrehijo.productsCodHijo, productspadrehijo.codProductoHijo,  subproceso.subProcesoNombre  From     productos Inner Join     productspadrehijo On  productos.productosCodigo =  productspadrehijo.productsCodPadre Inner Join     subproceso On  subproceso.subProcesoNombre =  productspadrehijo.productsPadreHijoSubProceso   Where     productos.productosPadre = True And     productos.productosEstado = "Activo" And     productos.productosCodigo = ?',[id], (err, rows,fields)=>{
       if(!err){
           res.json(rows);
           console.log('query productos hijos datos')
       }else{
           console.log(err);
       }
    });
   });


   router.get('/queryReportProductsbyTasks/:id/:init/:final',(req, res)=>{
    const {id,init,final} = req.params;
    mysqlConnetion.query('Select     controlrendimiento.idcontrolRendimiento,     controlrendimiento.controlRendimientoFechaFinal,     controlrendimiento.controlRendimientoFechaInicio,     controlrendimiento.controlRendimientoEmpleadoId,     controlrendimiento.controlrendimientoTiempoDuracion,     controlrendimiento.controlrendimientoTiempoReal,     controlrendimiento.controlrendimientoCantidad,     controlrendimiento.controlRendimientoTotalDescuentos,     empleados.empleadosCostoMinuto,    ( controlrendimiento.controlrendimientoTiempoDuracion *  empleados.empleadosCostoMinuto) As manoObra,     area.areaNombre,     controlrendimiento.controlRendimientoProductoCodigo,     controlrendimiento.controlRendimientocSubProceso,     productos.productosNombre,     productos.subProcesoId,     subproceso.subProcesoNombre, DATE_FORMAT(controlrendimiento.controlRendimientoFechaInicio, "%m/%d/%Y") as controlRendimientoFechaInicio, DATE_FORMAT(controlrendimiento.controlRendimientoFechaFinal, "%m/%d/%Y") as controlRendimientoFechaFinal From     controlrendimiento Inner Join     empleados On  controlrendimiento.controlRendimientoEmpleadoId =  empleados.idempleados Inner Join     area On  area.idarea =  empleados.empleadosAreaId Inner Join     productos On  productos.idproductos =  controlrendimiento.controlRendimientoProductoCodigo    Inner Join     subproceso On  subproceso.idsubProceso =  productos.subProcesoId Where   controlRendimientoFechaInicio >= ? and controlRendimientoFechaFinal < date_add(?, INTERVAL 1 DAY) and  controlrendimiento.codProducto = ? Order By     controlrendimiento.idcontrolRendimiento Desc',[init,final,id], (err, rows,fields)=>{
       if(!err){
           res.json(rows);
           console.log('usuario datos')
       }else{
           console.log(err);
       }
    });
   });



module.exports = router;