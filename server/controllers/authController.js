const db = require("../models/sequelize");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

const signup = (req, res) => {

  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "El usuario se ha registrado exitosamente!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "El usuario se ha registrado exitosamente!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}


const signin = (req, res) => {

  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Contraseña invalida!"
        });
      }

      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 3600 // 1 horas
      });

      let authorities = [];
      user.getRoles().then(roles => {
        roles.forEach(rol => {
          authorities.push(`ROL_${rol.name.toUpperCase()}`);
        });
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

const recovery = (req, res) => {
  const password = bcrypt.hashSync(req.body.password, 8);
  const email = req.body.email;

  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Usuario no encontrado" });
      }

      let passwordSame = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      console.log(passwordSame)
      if (passwordSame) {
        return res.status(400).send({
          message: "No se pueden usar contraseñas anteriores"
        });
      }

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });


  User.update(
    { password: password },
    { where: { email: email, username: req.body.username } })
    .then(user => {
      if (user == 1) {
        res.send({
          message: "La contraseña se actualizó correctamente"
        });
      } else {
        res.send({
          message: `No se pudo actualizar el usuario con el email: ${email}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error al actualizar el usuario con el email: ${email}`
      });
    });
}

module.exports = {
  signin,
  signup,
  recovery
};