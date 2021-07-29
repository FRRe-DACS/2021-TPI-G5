const externalRoutes = require("./externalRoutes");
const ventaRoutes = require("./ventasRoutes");
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const empresaRoutes = require("./empresaRoutes");
const express = require("express");
const router = express();

router.use("/", externalRoutes);
router.use("/", ventaRoutes);

// routes auth
router.use("/", userRoutes)
router.use("/", authRoutes)
router.use("/", empresaRoutes)

//START message
router.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = router;