# NodeJS



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

### Создание моделей используя Mongoose. Работа со Schema

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

Чтобы создать значение по умолчанию, следует воспользоваться записью:

```javascript
date: {
    type: Date,
    default: Date.now
}
```

**Важно**, в default не вызывать функцию!

При экспорте указывается название модели - Course и схема - course.

**Связывание моделей (таблиц)**

Например нужно связать модель User и с моделью Course, для этого в схеме указываем поле, например courseId, в котором прописываем:

```javascript
courseId: {
    type: Schema.Types.ObjectID,
    required: true,
    ref: 'Course'
}
```

ObjectID - это строка формата MongoDB, а ref - это ссылка на модель, на которую нужно сослаться.

В модель можно добавить собственные функции с помощью расширения схемы. Поле описания схемы:

```javascript
userSchema.methods.addToCart = function () {
    
}
```

Функцию объявляем с помощью ключеового слова **function**, чтобы была возможность пользоваться **this**.

*Если в коде сравнивается id из mongoDB, то это поле лучше приводить в строку с помощью toString()*

В конце данного метода сделать 

```javascript
return this.save()
```

Далее в объекте (моделе) можно вызывать **res.user.addToCart(course)**, например. 

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

#### Метода работы с базой через mongoose:

Получение всех данных из базы

```javascript
const courses = await Course.find()
```

Получение данных по ID

```javascript
const course = await Course.findById(req.params.id)
```

Получение по ID и обновление. Получаем id из объекта  req, и удаляем из него поле id, так как в MongoDB поле id указывается так: _id. 

```javascript
const {id} = req.body.id
delete req.body.id
await Course.findByIdAndUpdate(id, req.body)
```

Удаление по ID

```javascript
try {
    await Course.deleteOne({_id: req.body.id})
    res.redirect('/courses')
} catch (e) {
    console.log(e)
}
```

Если таблицы связаны, то можно получать в запросе к базе и данные из другой таблицы. Делается это с помощью метода **populate()**

Первый параметр этого метода - поле-ссылка на другую таблицу. А второй это поля, которые необходимо достать, через пробел.

Чтобы получить только некоторые поля из таблицы также есть метод **select()**, в который передаются те поля, которые необходимо достать (через пробел).

Здесь мы раскрываем userId (ссылка на другую таблицу), достаем только email и name.  С помощью select достаем из таблицы Course title, price, img

```javascript
const courses = await Course.find().populate('userId', 'email name').select('title price img')
```

#### Добавление метода в схему ####

Например, нужно отдавать клиенту немного другой контент (с измененным параметром и тд), для этого удобно использовать собственные методы схемы.

Можно писать прямо в файле с самое схемой или вынести в отдельный файл, как в примере:

```javascript
const addMethods = schema => {
  schema.method('toResponse', function () {
    const { _id, ...rest } = this.toJSON();
    delete rest.password;
    delete rest.__v;
    return { id: _id, ...rest };
  });
  schema.method('fromRequest', function () {
    console.log(this);
  });
};
```

Для того, чтобы "привязать" данные методы к схеме, в нужной схеме  перед экспортом нужно:

```javascript
addMethods(User);
```

После этого можно работать с методом, так: **User.toClient()**

### Внимание! Error!

При работе с Handlebars и mongoose может возникнуть проблема такого вида:

> Handlebars: Access has been denied to resolve the property "price" because it is not an "own property" of its parent.

Для её решения необходимо установить: ```yarn add @handlebars/allow-prototype-access```

После, в точке входа (index.js/app.js, etc):

```javascript
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
```

И далее в движок добавить:

```javascript
app.engine('handlebars', expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
```

Ссылка на решение:

https://www.npmjs.com/package/@handlebars/allow-prototype-access

