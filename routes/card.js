const {Router} = require('express')
const Card = require('../models/Card')
const Course = require('../models/Course')
const router = Router()

router.post('/', async (req, res) => {
    const course = await Course.getById(req.body.id)
    await Card.add(course)
    res.redirect('/card')
})

router.get('/', async (req, res) => {
    const card = await Card.fetch()
    res.render({
        title: 'Корзина',
        card
    })
})

module.exports = router