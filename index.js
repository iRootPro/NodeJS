const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cardRoutes = require('./routes/card')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public'))

app.use(express.urlencoded({extended: true}))

// Register routes with prefix
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)



const PORT = process.env.PORT || 3000

async function start() {
    try {
        const url = `mongodb+srv://minin:jhbvtldcbhb@cluster0.g03e7.mongodb.net/shop?retryWrites=true&w=majority`
        await mongoose.connect(url,{useNewUrlParser: true})
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }
    catch (e) {
        console.log(e)
    }
}
start()

