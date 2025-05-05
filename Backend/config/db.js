import mongoose from "mongoose"

const mongoCon = () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("DB Connected")
        })
        .catch(error => {
            console.log(error)
        })
}

export default mongoCon

