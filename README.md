# NodeJS  Study



## MongoDb

1. Регистрируемся на [mongodb.com](mongodb.com).
2. Создает Организацию, проект, кластер.
3. Создаем пользователя для БД
4. Добавляем разрешения по IP адресам
5. Переходим к кластеру - connect - connect your application и забираем строку подключения для NodeJS
6. Не забываем заменять <password> на свой пароль
7. Так же в полученной строке вида: `mongodb+srv://<user>:<password>@cluster0.g03e7.mongodb.net/<dbname>?retryWrites=true&w=majority` вместо dynamo необходимо прописать имя Базы данных, которая будет создаваться.

### Mongoose

**Установка и подключение**

Библиотека для работы с MongoDB

Установка: ```yarn add mongoose```

В index.js подключаемся к MongoDB, только после подключения запускаем сервер express. 

Пример кода:

```javascript
async function start() {
    try {
        const url = `ССЫЛКА НА CONNECT`
        await mongoose.connect(url, {useNewUrlParser: true})
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()
```

### Создание моделей используя Mongoose

Пример кода:

```javascript
const {Schema, model} = require('mongoose')

const course = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: String
})

module.exports = model('Course', course)
```

id создается автоматически, руками создавать данное поле не требуется.

При экспорте указывается название модели - Course и схема - course.

### Добавление в БД, пример кода:

В роутах создаем сущность course на основе модели Course. с помощью метода save сохраняем в БД.

```javascript
router.post('/', async (req, res) => {
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.image
    })
    try {
        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})
```

Если перейти в БД в облаке в collection и выбрать необходимую, то там можно увидеть созданную сущность.

