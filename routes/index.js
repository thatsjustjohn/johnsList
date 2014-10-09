var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');



/*puts & updates votes on posts*/
router.put('/posts/:post/upvote', function(req, res, next) {
  console.dir(req);
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

/*puts & updates votes on comments*/
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next) {
  console.dir(req);
  req.comment.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});


/*populate*/
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error("can't find post")); }

    req.post = post;
    return next();
  });
});


router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error("can't find comment")); }

    req.comment = comment;
    return next();
  });
});

/*gets information from DB for posts*/
router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    res.json(post);
  });
});

router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});

/*posts infortion into the DB for posts*/
router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});


/*puts comments links to post*/
/*router.get('/posts/:post/:comments', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    res.json(post);
  });
});*/

router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});



