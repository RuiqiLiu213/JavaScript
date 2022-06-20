const express = require("express")
const router = express.Router() 
//The Router works the same with const app = express(), it can do something like .get(), .post()...

router.use(logger) 
//logger is a middleware function which must include next() in it, otherwise the following will not execute

router.get("/", (req, res) => {
  console.log(req.query.name) //
  res.send("User List")
})

// Go to the new page for creating users
router.get("/new", (req, res) => {
  res.render("users/new")
})

// Use post to create user, this post comes from FORM in new.ejs, the post request in created on sumbit button
router.post("/", (req, res) => { //why post on address / ???
  const isValid = true
  if (isValid) {
    users.push({ firstName: req.body.firstName })
    res.redirect(`/users/${users.length - 1}`)
  } else {
    console.log("Error")
    res.render("users/new", { firstName: req.body.firstName }) 
    // it will render users/new.ejs page on /
    // The second parameter of render passes information down to ejs file
    // To access the information in ejs, use<%= firstName %>
    // Or <%= local.firstName %>, it will prints nothing with no error on page, if firstName doesn't exist.
  }
})

router
  .route("/:id")
  // router.route() aggregates methods together with the same url
  // id is used as a dynamic parameter, 
  // So this part should be last one, otherwise if you enter users/new, it will take new as id and go to this route.
  .get((req, res) => {
    console.log(req.user) // req.user comes from middleware function router.param
    res.send(`Get User With ID ${req.params.id}`) 
    // req.params.id pulls information from URL
  })
  .put((req, res) => {
    res.send(`Update User With ID ${req.params.id}`)
  })
  .delete((req, res) => {
    res.send(`Delete User With ID ${req.params.id}`)
  })

const users = [{ name: "Kyle" }, { name: "Sally" }]
// router.param function runs everytime it goes to a router with id parameter
// router.param is a middleware, runs before res.send, res.render, etc...
router.param("id", (req, res, next, id) => {
  req.user = users[id]
  next()
})

function logger(req, res, next) {
  console.log(req.originalUrl)
  next()
}

module.exports = router
