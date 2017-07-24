var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require("mongoose");


// Setting up mongoose and setting the default file format to ejs

mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine", "ejs");

// Serving a custom stylesheet, using body-parser and method-override
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// Setting up schema and a model
var blogSchema = new mongoose.Schema ({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs){
        if(err) {
            console.log(err);
        }else {
            res.render("index", {blogs:blogs});
        }
    });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res) {
    res.render("new", {currentUser: req.user});
});

// CREATE ROUTE
app.post("/blogs", function(req, res) {
    // Create a blog
    Blog.create(req.body.blog, function(err, newBlog) {
        if(err){
            console.log(err);
        }else {
            // redirect to the index
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
       if(err) {
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err) {
            console.log(err);
        } else {
            res.render("edit", {blog:foundBlog});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DESTROY ROUTE
app.delete("/blogs/:id", function(req, res) {
   Blog.findByIdAndRemove(req.params.id, function(err) {
       if(err) {
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   });
});

// Listener
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is running");
});
