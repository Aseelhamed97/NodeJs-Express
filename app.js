const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const { check, validationResult } = require('express-validator')

const app = express()
const port = 5000

const urlencoded = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json());
app.use(urlencoded);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname + '/index.html'));
})

app.post('/formData', [

    check(['fname', 'lname', 'company_name', 'company_website', 'jop_title'])
    .not().isEmpty(),

    check('email', 'email not valid')
    .isEmail(),

    check('phone_number')
    .custom((phone) => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone)),

    check('employees')
    .not().equals('Please select')

], (request, response) => {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({
            errors: errors.array()
        });
    }
    response.status(202).json({
        success: 'ok'
    })
})
app.listen(port, () => console.info(`App listening on port: ${port}`))