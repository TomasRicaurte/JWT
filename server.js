const express = require('express');
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken')

app.use(express.json())

function validarToken(req, res, next) {
    const accessToken = req.headers['authorization']; 
    if (!accessToken) {
        res.status(401).send('Acceso denegado o expirado'); 
    } else {
        jwt.verify(accessToken, 'Secret', (err, user) => {
            if (err) {
                res.status(401).send('Acceso denegado o expirado');
            } else {
                next();
            }
        });
    }
}

app.get('/', validarToken, (req, res) => {
    res.send('<h1>Desde la ruta raiz</h1>')
})

app.post('/auth', (req, res) => {
    const { username, password } = req.body 
    if (username === 'Tomas' && password === 12345) {
        const user = {user: username}
        const accesToken = generarToken(user)
        res.header('autorization', accesToken).json({
            mensaje: 'Usuario autenticado',
            token: accesToken
        })
    } else {
        res.json('Usuario no autorizado')
    }
})

function generarToken (user) {
    return jwt.sign(user, 'secret', {expiresIn: 60000})
}

app.listen(port, () => {
    console.log( `Servidor corriendo en el puerto ${port}`)
})
