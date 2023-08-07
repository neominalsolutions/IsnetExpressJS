var express = require('express');
var router = express.Router();

const users = [
  {
    id:1,
    name:'nihat'
  },
  {
    id:2,
    name:'buse'
  },
  {
    id:3,
    name:'guest'
  }
]

/* GET users listing. */
router.get('/', function(req, res, next) {
  // jade model.users
  res.render('user',{
    model: {users:users,title:'deneme'}
  });
});

router.get('/:id/:name', function (req,res,next) {
  // expressJs de params değerleri req.params üzerinden erişilebilir.
  console.log('id',req.params.id,'name', req.params.name);
  const user = users.find(x=> x.id == req.params.id);
  if(!user)
    res.status(404); // Not Found
  else
    res.render('user-detail', {model: user})
});

// querystring üzerinden değer okuma örneği.
router.get('/filters', function (req,res,next) {
  console.log('queryString', req.query['searchText'], req.query['page'], req.query['pageSize']);
  res.render('query', {model:req.query})
});


module.exports = router;
