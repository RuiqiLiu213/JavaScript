const express = require("express")
const app = express()
// The project is created using this app object, it creates different routes, passing data, and render pages

app.use(express.static("public")) // render static html in public folder
app.use(express.urlencoded({ extended: true })) // use middlewire
app.use(express.json())

app.set("view engine", "ejs") // use ejs as view engine, ejs is similar as html

const userRouter = require("./routes/users") 
// All the routes are defines in routes/users.js, which is the main part of project
// The code in users.js can also be put here
app.use("/users", userRouter) 
// Define the root address to be /users, and use useRouter in app

app.listen(3000)
