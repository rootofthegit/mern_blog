const moment = require('moment')
const Post = require("../models/Post");
const User = require("../models/User")
var ObjectID = require('mongoose').Types.ObjectId

const {
  errorHandler
} = require("../helpers/dbErrorHandler");

exports.read = (req, res) => {
  // req.post.photo = undefined
  console.log(req.post)
  return res.json(req.post)
}

exports.list = (req, res) => {
  const sort = { title: 1 };
  Post.find()
  .select("-photo")
  .sort(sort)
//  .limit(10)
 .exec((err, posts) => {
    if (err) {
      return res.send(err);
    } 
     return res.send(posts) 
  })
}

exports.readById = (req, res) => {
  const id = req.params.id
  Post.findById(id)
    .then(post => res.json(post))
    .catch(err => res.status(400).json('Error: ' + err));
}

exports.create = (req, res) => {
 const {title, body, date } = req.body
  const post = new Post({title, body, date,
    'author.id': req.profile._id, 'author.name': req.profile.name })
  post.save()
  .then(response => {res.send(response)})
    .catch(err => {
      res.send(err)
      })
    }

exports.edit = (req, res) => {
  const id = req.params.id
  if (!ObjectID.isValid(id))
        return res.status(400).send(`No post with given id: ${id}`)
  const {title, body} = req.body

  const updatedPost = {title, body}
  Post.findByIdAndUpdate(id, {
    $set: updatedPost,
  }, {new:true}, (error, data) => {
   // console.log(id)
    if (error) {
      return error
    } else {
      res.send(data)
      console.log(updatedPost)
      // console.log(data)
    }
  })
}
  
exports.deletePost = (req, res) => {
    Post.deleteOne({_id: req.params.id}).then(
      () => {
        console.log(req.params.id)
        res.status(200).json({
          message: 'Deleted!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
}

exports.diamond = (req, res) => {
  Post.findByIdAndUpdate(req.params.id, {
    $push: {diamonds: req.profile._id}
  }, {new: true}).exec((err, result) => {
     console.log(req.params.id)
    if (err) {
      return res.status(422).json({error: err})
    } else {
      return res.json(result)
    }
  })
}
