const express = require('express');
const router = express.Router();

const mysqlConnetion = require('../database');

router.get('/users/',(req, res)=>{
    mysqlConnetion.query('SELECT empleados.Idempleados,empleados.empleadosCedula,empleados.empleadosNombre,empleados.empleadosApellidos,area.areaNombre, empleados.empleadosCostoMinuto, empleados.empleadosEstado, empleados.cedulaEncargado,  genero.generoNombre,    roles.rolesNombre  FROM    genero  INNER JOIN empleados ON (genero.idgenero = empleados.empleadosGeneroId)    INNER JOIN roles ON ( roles.idroles = empleados.empleadosRolId) INNER JOIN area ON ( area.idarea = empleados.empleadosAreaId) WHERE empleadosEstado = "Activo"',(err,rows,fields)=>{
        if(!err){           
            res.json(rows);
        }else{
            console.log(err);
        }
    })
});

router.post('/login/',(req, res)=>{
    const {id} = req.body;
    mysqlConnetion.query('SELECT empleados.Idempleados,empleados.empleadosCedula, empleados.cedulaEncargado ,empleados.empleadosNombre,empleados.empleadosApellidos,area.areaNombre, empleados.empleadosCostoMinuto, empleados.empleadosEstado,  genero.generoNombre,    roles.rolesNombre  FROM    genero  INNER JOIN empleados ON (genero.idgenero = empleados.empleadosGeneroId)    INNER JOIN roles ON ( roles.idroles = empleados.empleadosRolId) INNER JOIN area ON ( area.idarea = empleados.empleadosAreaId) WHERE empleadosEstado = "Activo" and empleados.empleadosCedula = ?',[id],(err,rows,fields)=>{
        if(!err){            
            //res.json({Status: 'empleado logado'});
            res.header('auth-token', 'token-dibay').json(rows)
              console.log('usuario logado')
        }else{
            console.log(err);
        }
    })
});

router.get('/login/:id',(req, res)=>{
    const {id} = req.params;
    mysqlConnetion.query('SELECT empleados.Idempleados,empleados.empleadosCedula,empleados.empleadosNombre,empleados.empleadosApellidos,empleados.cedulaEncargado,area.areaNombre, empleados.empleadosCostoMinuto, empleados.empleadosEstado,  genero.generoNombre,    roles.rolesNombre  FROM    genero  INNER JOIN empleados ON (genero.idgenero = empleados.empleadosGeneroId)    INNER JOIN roles ON ( roles.idroles = empleados.empleadosRolId) INNER JOIN area ON ( area.idarea = empleados.empleadosAreaId) WHERE empleadosEstado = "Activo" and empleados.empleadosCedula = ?',[id],(err,rows,fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    })
});

router.get('/users/:id',(req, res)=>{
 const {id} = req.params;
 mysqlConnetion.query('SELECT * from empleados WHERE Idempleados = ?',[id], (err, rows,fields)=>{
    if(!err){
        res.json(rows[0]);
    }else{
        console.log(err);
    }
 });
});

router.get('/usersarea/:area',(req, res)=>{
    const {area} = req.params;
    mysqlConnetion.query('Select empleados.idempleados,empleados.empleadosCedula, empleados.empleadosNombre, empleados.empleadosApellidos, area.areaNombre,empleados.cedulaEncargado, empleados.empleadosEstado From empleados Inner Join area On empleados.empleadosAreaId = area.idarea WHERE empleados.empleadosEstado = "Activo" and area.areaNombre= ?',[area],(err,rows,fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    })
});

router.post('/users/add', (req,res) => {
const {cedula, nombre, apellido, area, genero, rol, costominuto, cedulaEncargado} = req.body;
const query = `
CALL AddEmployeed (?,?,?,?,?,?,?,?);
`;

mysqlConnetion.query(query,[cedula, nombre, apellido, area, genero, rol, costominuto,cedulaEncargado], (err,rows,fields) =>{
    if(!err){
        res.json({Status: 'empleado grabado'});
    }else{
        console.log(err);
    }

    });    
});


router.put('/:id', (req,res)=>{
//const {cedula, nombre, apellido, area, genero, rol, costominuto, cedulaEncargado} = req.body
const {id} = req.params;

const query = `CALL editEmployeed (?)`;

mysqlConnetion.query(query,[id], (err,rows,fields) =>{
    if(!err){
        res.json({Status: 'empleado editado'});
    }else{
        console.log(err);
    }
    });  
});

router.delete('/:id', (req, res)=>{
    const {id} = req.params;
    mysqlConnetion.query('DELETE FROM empleados WHERE idempleados = ?',[id], (err, rows,fields)=>{
        if(!err){
            res.json('Empleado Eliminado de la base de datos');
        }else{
            console.log(err);
        }
     } )

});


router.get('/area/',(req, res)=>{
    mysqlConnetion.query('SELECT * from area',(err,rows,fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    })
});

module.exports = router;