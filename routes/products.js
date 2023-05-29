const express = require("express");
const router = express.Router();
const Redis = require("ioredis");



/*
 const redis = new Redis({
  port: 6379, // Redis port
  host: "192.168.1.6", // Redis host
  family: 4, // 4 (IPv4) or 6 (IPv6)
});  // uses defaults unless given configuration object
*/
 const redis = new Redis({
  port: 11280, // Redis port
  host: "redis-11280.c284.us-east1-2.gce.cloud.redislabs.com", // Redis host
  family: 4, // 4 (IPv4) or 6 (IPv6)
  username: "default",
  password: "M7nSCajDQRvB1J8DbaEBttheTtmPtaOH",
}) 

//rediss://red-chodt93hp8u2m2t8b1ig:Vlg3YAiBicer7YvoN2ROLgT6X8xuLYYn@oregon-redis.render.com:6379

//console.log(redis)
//redis.set("foo", "bar"); // returns promise which resolves to string, "OK"
const mysqlConnetion = require("../database");

router.get("/products/:area", async (req, res) => {
  const { area } = req.params;
  const ProductosRedis = await redis.get(`products${area}`);
  if (!ProductosRedis) {
    mysqlConnetion.query(
      'SELECT     productos.productosCodigo,    productos.idproductos,    productos.productosNombre,    subproceso.subProcesoNombre,    productos.tiempoEstandar,    tipoinventario.tipoinventarioNombre, productos.areaId,   area.areaNombre,    productos.actividad,    productos.productosPadre FROM    productos,    subproceso,    tipoinventario,    area WHERE    productos.subProcesoId = subproceso.idsubProceso        AND productos.tipoinventarioId = tipoinventario.idtipoinventario AND productos.areaId = area.idarea     AND productosEstado = "Activo" and  area.areaNombre = ?',
      [area],
      (err, rows, fields) => {
        if (!err) {
          console.log(`productos ${area}`);
          res.json(rows);
          redis.set(`products${area}`, JSON.stringify(rows));
          redis.expire(`products${area}`, 28800000);
        } else {
          console.log(err);
        }
      }
    );
  } else {
    console.log("ingreso en los poductos precargados");
    res.json(JSON.parse(ProductosRedis));
  }
});

router.get("/products", async (req, res) => {
  const allProducts = await redis.get(`allProducts`);
  if (!allProducts) {
    mysqlConnetion.query(
      'SELECT     productos.productosCodigo,    productos.idproductos,    productos.productosNombre,    subproceso.subProcesoNombre,    productos.tiempoEstandar,    tipoinventario.tipoinventarioNombre, productos.areaId,   area.areaNombre,    productos.actividad,    productos.productosPadre FROM    productos,    subproceso,    tipoinventario,    area WHERE    productos.subProcesoId = subproceso.idsubProceso        AND productos.tipoinventarioId = tipoinventario.idtipoinventario AND productos.areaId = area.idarea     AND productosEstado = "Activo" ',
      (err, rows, fields) => {
        if (!err) {
          console.log("cargo todos los productos");
          res.json(rows);
          redis.set(`allProducts`, JSON.stringify(rows));
          redis.expire(`allProducts`, 28800000);
        } else {
          console.log(err);
        }
      }
    );
  } else {
    console.log("ingreso en los poductos precargados");
    res.json(JSON.parse(allProducts));
  }
});

router.get("/productssearch/", async (req, res) => {
  const productsSearch = await redis.get(`productsSearch`);
  if (!productsSearch) {
    mysqlConnetion.query(
      'SELECT     productos.productosCodigo,    productos.idproductos,    productos.productosNombre,    subproceso.subProcesoNombre,    productos.tiempoEstandar,    tipoinventario.tipoinventarioNombre,    area.areaNombre,    productos.actividad,    productos.productosPadre FROM    productos,    subproceso,    tipoinventario,    area WHERE    productos.subProcesoId = subproceso.idsubProceso        AND productos.tipoinventarioId = tipoinventario.idtipoinventario        AND productos.areaId = area.idarea        AND productosEstado = "Activo"',
      (err, rows, fields) => {
        if (!err) {
          res.json(rows);
          redis.set(`productsSearch`, JSON.stringify(rows));
          redis.expire(`productsSearch`, 28800000);
        } else {
          console.log(err);
        }
      }
    );
  } else {
    res.json(JSON.parse(productsSearch));
  }
});

router.get("/productsEdit/:id", (req, res) => {
  const { id } = req.params;
  mysqlConnetion.query(
    'SELECT * from productos WHERE productosEstado="Activo" and idproductos = ?',
    [id],
    (err, rows, fields) => {
      if (!err) {
        res.json(rows[0]);
      } else {
        console.log(err);
      }
    }
  );
});

router.get("/product/:id", (req, res) => {
  const { id } = req.params;
  mysqlConnetion.query(
    'SELECT * from productos WHERE productosEstado="Activo" and productosCodigo = ?',
    [id],
    (err, rows, fields) => {
      if (!err) {
        console.log("ingreso a leer producto, para editarlo");
        res.json(rows);
      } else {
        console.log(err);
      }
    }
  );
});

router.get("/productCod/:cod", (req, res) => {
  const { cod } = req.params;
  mysqlConnetion.query(
    'SELECT * from productos WHERE productosEstado="Activo" and productosCodigo = ?',
    [cod],
    (err, rows, fields) => {
      if (!err) {
        console.log("ingreso a leer producto, para editarlo");
        res.json(rows);
      } else {
        console.log(err);
      }
    }
  );
});

router.post("/products/add", (req, res) => {
  const {
    codigo,
    nombre,
    idsubproceso,
    tiempoestandar,
    tipoInventarioID,
    actividad,
    areaID,
    padre,
  } = req.body;
  const query = `
CALL AddProducts (?,?,?,?,?,?,?,?);
`;

  mysqlConnetion.query(
    query,
    [
      codigo,
      nombre,
      idsubproceso,
      tiempoestandar,
      tipoInventarioID,
      actividad,
      areaID,
      padre,
    ],
    (err, rows, fields) => {
      if (!err) {
        res.json({ Status: "producto grabado" });
        console.log(`he agregado ${nombre} producto`);
      } else {
        console.log(err);
      }
    }
  );
});

router.put("/products/:id", (req, res) => {
  const {
    codigo,
    nombre,
    idsubproceso,
    tiempoestandar,
    tipoInventarioID,
    actividad,
    areaID,
    padre,
  } = req.body;
  const { id } = req.params;
  console.log(req.params);

  const query = `CALL editProducts (?,?,?,?,?,?,?,?,?)`;

  mysqlConnetion.query(
    query,
    [
      id,
      codigo,
      nombre,
      idsubproceso,
      tiempoestandar,
      tipoInventarioID,
      actividad,
      areaID,
      padre,
    ],
    (err, rows, fields) => {
      if (!err) {
        res.json({ Status: "producto editado" });
        console.log("producto Editado");
      } else {
        console.log(err);
      }
    }
  );
});

router.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  mysqlConnetion.query(
    "DELETE FROM productos WHERE idproductos = ?",
    [id],
    (err, rows, fields) => {
      if (!err) {
        res.json("producto Eliminado");
      } else {
        console.log(err);
      }
    }
  );
});

router.get("/recargarproductos", async (req, res) => {
  const KEYS = await redis.keys("*");

  if (KEYS) {
    KEYS.map((k, i) => {
      redis.del(k);
    });
  }

  async function cargarProductos() {
    mysqlConnetion.query(
      'SELECT     productos.productosCodigo,    productos.idproductos,    productos.productosNombre,    subproceso.subProcesoNombre,    productos.tiempoEstandar,    tipoinventario.tipoinventarioNombre, productos.areaId,   area.areaNombre,    productos.actividad,    productos.productosPadre FROM    productos,    subproceso,    tipoinventario,    area WHERE    productos.subProcesoId = subproceso.idsubProceso        AND productos.tipoinventarioId = tipoinventario.idtipoinventario AND productos.areaId = area.idarea     AND productosEstado = "Activo" ',
      (err, rows, fields) => {
        if (!err) {         
          redis.set(`allProducts`, JSON.stringify(rows));
          redis.expire(`allProducts`, 28800000);
          return true;
        } else {
          console.log(err);
          return false;
        }
      }
    );
  }

  const products = await cargarProductos(); //cargamos todos los productos

  

  mysqlConnetion.query(
    "SELECT   idarea,   areaNombre FROM   area ORDER BY areaNombre ASC ",
    (err, rows, fields) => {
      if (!err) {
        rows.map((r, i) => {


const area = r.areaNombre

            mysqlConnetion.query(
                'SELECT     productos.productosCodigo,    productos.idproductos,    productos.productosNombre,    subproceso.subProcesoNombre,    productos.tiempoEstandar,    tipoinventario.tipoinventarioNombre, productos.areaId,   area.areaNombre,    productos.actividad,    productos.productosPadre FROM    productos,    subproceso,    tipoinventario,    area WHERE    productos.subProcesoId = subproceso.idsubProceso        AND productos.tipoinventarioId = tipoinventario.idtipoinventario AND productos.areaId = area.idarea     AND productosEstado = "Activo" and  area.areaNombre = ?',
                [area],
                async (err, rows, fields) => {
                  if (!err) {
                    console.log(`productos ${area}`);
                    if(rows){
                        await redis.set(`products${area}`, JSON.stringify(rows));
                        redis.expire(`products${area}`, 28800000);
                    }
                   
                  
                  } else {
                    console.log(err);
                  }
                }
              );         
        });

        res.json("cargados todos los productos").status(200);
      } else {
        console.log(err);
      }
    }
  );
});

///// llamado a subproceso

router.get("/subprocess/", (req, res) => {
  mysqlConnetion.query("SELECT * FROM subproceso;", (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

//// llamada a tipo de inventario

router.get("/inventorytype/", (req, res) => {
  mysqlConnetion.query("SELECT * FROM tipoinventario;", (err, rows, fields) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

//// productos padre e hijos

router.get("/productsfhaters/", (req, res) => {
  mysqlConnetion.query(
    'SELECT  productos.productosCodigo,  productos.idproductos,  productos.productosNombre,productos.productosPadre,  subproceso.subProcesoNombre, productos.tiempoEstandar, tipoinventario.tipoinventarioNombre FROM  productos,  subproceso, tipoinventario WHERE  productos.subProcesoId = subproceso.idsubProceso and productos.tipoinventarioId = tipoinventario.idtipoinventario and productosEstado="Activo" and productos.productosPadre = 1 order by productos.productosNombre asc',
    (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    }
  );
});

router.get("/productschildrens/", (req, res) => {
  mysqlConnetion.query(
    'SELECT     productos.productosCodigo,    productos.idproductos,    productos.productosNombre,    subproceso.subProcesoNombre,    productos.tiempoEstandar,    productos.productosPadre,    tipoinventario.tipoinventarioNombre,    area.areaNombre FROM    productos,    subproceso,    tipoinventario,    area WHERE    productos.subProcesoId = subproceso.idsubProceso        AND productos.tipoinventarioId = tipoinventario.idtipoinventario  AND productosEstado = "Activo" AND productos.productosPadre = 0',
    (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    }
  );
});

router.get("/productschildrens/:cod", (req, res) => {
  const { cod } = req.params;
  mysqlConnetion.query(
    "SELECT  idproductsPadreHijo, productsCodPadre,productsCodHijo,productsPadreHijoNombre,productsPadreHijoSubProceso from productspadrehijo where  productsCodPadre =? ",
    [cod],
    (err, rows, fields) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    }
  );
});

router.post("/productschildrens/add", (req, res) => {
  const { codPadre, codHijo, nombre, subproceso, codigoHijoFijo } = req.body;
  const query = `
    CALL AddProductsChildren (?,?,?,?,?);
    `;

  mysqlConnetion.query(
    query,
    [codPadre, codHijo, nombre, subproceso, codigoHijoFijo],
    (err, rows, fields) => {
      if (!err) {
        res.json({ Status: "producto guardado" });
      } else {
        console.log(err);
      }
    }
  );
});

router.delete("/productschildrens/:id", (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  mysqlConnetion.query(
    "DELETE FROM productspadrehijo WHERE idproductsPadreHijo = ? ",
    [id],
    (err, rows, fields) => {
      if (!err) {
        res.json("producto Eliminado");
      } else {
        console.log(err);
      }
    }
  );
});

module.exports = router;
