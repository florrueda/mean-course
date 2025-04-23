const Post = require('../models/post');


exports.createPost = (request, response, next) => {
  const url = request.protocol + '://' + request.get('host');
  const post = new Post({
    title: request.body.title,
    content: request.body.content,
    imagePath: url + '/images/' + request.file.filename,
    creator: request.userData.userId
  });
  post.save().then(createdPost => {
    response.status(201).json({
      message: 'Post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
  })
  .catch(error => {
    response.status(500).json({
      message: 'Creating a post failed!'
    });
  });
}

exports.updatePost = (request, response, next) => {
  let imagePath = request.body.imagePath;
  if(request.file) {
    const url = request.protocol + '://' + request.get('host');
    imagePath = url + '/images/' + request.file.filename;
  }
  const post = new Post({
    _id: request.params.id,
    title: request.body.title,
    content: request.body.content,
    imagePath: imagePath,
    creator: request.userData.userId
  })

  Post.updateOne({_id: request.params.id, creator: request.userData.userId}, post).then(result => {
    if(result.matchedCount > 0) {
      //result.matchedCount
      response.status(200).json({message: 'Update successful!'});
    } else {
      response.status(401).json({message: 'Not authorized!'});
    }
  })
  .catch(error => {
    response.status(500).json({
      message: 'Couldn\'t update post!'
    });
  })
;
}

exports.getPosts = (request, response, next) => {
  const pageSize = +request.query.pagesize;
  const currentPage = +request.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if(pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then(count => {
      response.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      response.status(500).json({
        message: 'Fetching posts failed!'
      });
    });
}

exports.getPost = (request, response, next) => {
  Post.findById(request.params.id).then(post => {
    if(post) {
      response.status(200).json(post);
    } else {
      response.status(404).json({message: 'Post not found!'});
    }
  })
  .catch(error => {
    response.status(500).json({
      message: 'Fetching post failed!'
    });
  });
}

exports.deletePost = (request, response, next) => {
  Post.deleteOne({_id: request.params.id, creator: request.userData.userId}).then(result => {
    if(result.deletedCount > 0) {
      //result.matchedCount
      response.status(200).json({message: 'Post deleted!'});
    } else {
      response.status(401).json({message: 'Not authorized!'});
    }
  })
  .catch(error => {
    response.status(500).json({
      message: 'Delete post failed!'
    });
  });;

}
