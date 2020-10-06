const {Router} = require('express')
const router = Router()
const Course = require('../models/Course')

router.get('/', async (req, res) => {
    const courses = await Course.getAll()

    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses
    })
})

module.exports = router