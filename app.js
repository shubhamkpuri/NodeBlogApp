var express		= require('express'),
	app			= express(),
	bodyParser	= require('body-parser'),
	mongoose 	= require('mongoose'),
	methodOverride = require('method-override'),
	expressSanitizer = require('express-sanitizer');

// mongoose.connect("mongodb://localhost/blogApp");
mongoose.connect("mongodb://Skpuri:Skpuri@ds263988.mlab.com:63988/blogapp");


app.set("view engine" , "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method")); 
app.use(expressSanitizer());
//Blog 
var blogSchema  = new mongoose.Schema({
	title:String,
	image:{
		type:String,
		default: "https://cdn.pixabay.com/photo/2014/05/02/21/50/home-office-336378_960_720.jpg"
		}, 
	body:String,
	created: {
		type:Date,
		default: Date.now
	}
});

var Blog = mongoose.model("Blog" ,blogSchema);

// Blog.create({
// 	title: "Second Blog",
// 	body:" This is the again blog post <h2> I'm excited to see how it is goona look",
// 	image: "https://cdn.pixabay.com/photo/2018/02/27/20/30/fantasy-3186483__340.jpg",
// });


//Restful Routes

// index page
app.get("/",(req,res)=>{
	res.redirect("/blogs");
})
app.get("/blogs",(req, res)=>{
	Blog.find({},(err,blogs)=>{
			if(err){
				console.log("ERROR!");
			}else{
				res.render("index",{
					blogs:blogs
				});
			}
	})
	
});

//New route
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//Create route
app.post("/blogs",(req, res)=>{
	// create blog
	//sanatizing(removing script tags in body of blog)
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog , (err, newBlog)=>{
		if(err){
			res.render("new");
		}else{
			//redirect to index
			res.redirect("/blogs");
		}
	})
});

// Show Route
app.get("/blogs/:id", (req, res)=>{
	Blog.findById(req.params.id , (err, foundBlog)=>{
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{
				blog:foundBlog
			});
		}
	});
	
});
//Edit Route

app.get("/blogs/:id/edit",(req, res)=>{
	Blog.findById(req.params.id,(err, foundBlog)=>{
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit",{
				blog:foundBlog
			});
		}
	})
	
})

//Update Route
app.put("/blogs/:id",(req, res)=>{
	//sanatizing blog[body]
	req.body.blog.body = req.sanitize(req.body.blog.body);
	
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err , UpdatedBlog)=>{
		if(err){
			res.redirect("/");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

//Delete Route
app.delete("/blogs/:id", (req, res)=>{
	//destroy blog 
	Blog.findByIdAndRemove(req.params.id, (err) =>{
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
	
});


app.listen(process.env.PORT || 8000, ()=>{
	console.log("Server is running ");
});

