angular.module('johnsList', ['ui.router'])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider/*, $urlRouterProvider*/) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
      postPromise: ['posts', function(posts){
        return posts.getAll();
      }]
      }
    })
    .state('posts', {
    url: '/posts/{id}',
    templateUrl: '/posts.html',
    controller: 'PostsCtrl',
    resolve: {
    post: ['$stateParams', 'posts', function($stateParams, posts) {
      return posts.get($stateParams.id);
      }]
    }
    });

 /* $urlRouterProvider.otherwise('home');*/
}])
.factory('posts', ['$http', function($http){
  var o = {}; /*= {
    posts: [{title:'hello', link:'', upvotes:0}]
  };*/
  o.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.posts);
    });
  }

  o.create = function(post) {
    return $http.post('/posts', post);/*.success(function(data){
      o.posts.push(data);
    });*/
  }

  o.upvote = function(post) {
    return $http.put('/posts/' + post._id + '/upvote')
    .success(function(data){
      post.upvotes += 1;
    });
  }
  o.upvoteComment = function(post, comment) {
  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
    .success(function(data){
      comment.upvotes += 1;
    });
  }
  o.addComment = function(id, comment) {
    return $http.post('/posts/' + id + '/comments', comment);
  }
  o.get = function(id) {
  return $http.get('/posts/' + id).then(function(res){
    return res.data;
  });
  }
  return o;
}])
.controller('MainCtrl', [
'$scope',
'posts',
'postPromise',
function($scope, posts, postPromise){
  	//$scope.test = 'Hello world!';=
  //console.dir(posts.posts);	
  $scope.posts = postPromise.data; 
  console.dir(posts);
  console.dir(postPromise);
  console.dir(postPromise.data);
  console.dir(postPromise.data.post);
  console.dir(postPromise);
  $scope.addPost = function(){
  if($scope.title === '') { return; }
    posts.create({
      title: $scope.title,
      link: $scope.link,
    }).success(function(post) {
      $scope.posts.push(post);
    });
    $scope.title = '';
    $scope.link = '';
  };
	
	/*$scope.incrementUpvotes = function(post) {
  	post.upvotes += 1;
	};*/
  $scope.incrementUpvotes = function(post) {
    posts.upvote(post);
  };
}])
.controller('PostsCtrl', [
'$scope',
'posts',
'post',
function($scope, posts, post){
	$scope.post = post;
	console.dir(post);
  console.dir(posts);
	$scope.addComment = function(){
  if($scope.body === '') { return; }
    posts.addComment(post._id, {
      body: $scope.body,
      author: 'user',
    }).success(function(comment) {
      $scope.post.comments.push(comment);
    });
    $scope.body = '';
  };
  /*
  $scope.incrementUpvotes = function(comment) {
    comment.upvotes += 1;
  };
  */
  $scope.incrementUpvotes = function(comment){
  posts.upvoteComment(post, comment);
  };
}])




