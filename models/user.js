const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectID,
                    required: true,
                    ref: 'Course'
                }
            }
        ]
    }
})

userSchema.methods.addToCart = function (course) {
    const items = [...this.cart.items]
    const idx = items.findIndex(c => {
        return c.courseId.toString() === course._id.toString()
    })
    if (idx >= 0) {
        items[idx].count += 1
    } else {
        items.push({
            count: 1,
            courseId: course._id
        })
    }
    this.cart = {items}
    return this.save()
}

module.exports = model('User', userSchema)
