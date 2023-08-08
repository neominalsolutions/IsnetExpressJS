var express = require('express');
var db = require('./../helpers/mongo.client');
const { ObjectId } = require('mongodb');
var router = express.Router();


// endpoint tanımları yaarken base endpoint s takısı almalıdır
// api/todo INVALID
// api/todos VALID

//api/todos
// HTTP STATUS Code 200
// ERROR durumunda 500
// Kayıt bulunamadığında 404 döner
router.get('/', function (req,res, next) {
  // testdb.user kollesiyonuna bağlan.
   db.collection('user')
   .find()
   .toArray()
   .then(response => {
    // başarılı result döndür.
    res.status(200).send(response);
   }).catch(err => {
    // hata döndür
    res.status(500).send(err);
   })
});

// api todos 1
router.get('/:id', function (req,res,next) {
  const id = req.params.id;
  // ObjectId olarak id değerlerini tutar.
  try {
    // eğer id değeri ObjectId formatında değilse MongoDb hata fırlatır bu hatayı kontrol edebilmek için try cacth bloguna aldık.
    let query = {_id: new ObjectId(id)}

    db.collection('user').findOne(query).then(response => {
      if(response){
        // eğer kayıt bulunduysa bulunan kaydı döndürdük.
        res.status(200).send(response);
      } else { // db de olmayan bir id değeri ise bulunamadığı için 404 hatası döndürdük.
        res.status(404).send();
      }
    }).catch(err => {
      res.status(500).send(err);
    })
    
  } catch (error) {
    console.log('error', error);
    res.status(500).send(error.message);
  }
  

  
});

// POST 201 Created Result
router.post('/', function (req,res,next) {
  const param = req.body; // bodyParser ile json formatında okunuyordu.

  if(typeof(param.name) != 'string'){
    res.status(500).send('name metinsel olarak tanımlanmalıdır');
  } else {
    if(param.name == '' || param.name == undefined){
      res.status(500).send('name alanı boş geçilemez');
    } else {

      db.collection('user')
      .insertOne({name:param.name.trim()})
      .then(response => {
        res.status(201).send(response);
      }).catch(err => {
        res.send(err).status(500); // 2. yazım şekli
      });
    }
  }

  // POSTMAN üzerinden test edelim.

});

// Güncelleme işlemlerinde PUT verb kullanılmalıdır. Ve Post işlemine göre daha az maliyetli bir operasyondur.
// 204 No Content
// PUT işlemlerinde response body içerisinde veri döndürmemiz gerek maliyetli bir işlem.
// user ={id:1,name:'ali', surname:'can', friends:["cenk","mustafa"]}
router.put('/:id', function (req,res,next) {

  const collection =  db.collection('user');

  // const count = collection.countDocuments();

  
  collection.findOne({_id:new ObjectId(req.params.id)}).then(response => {
    if(response){
      collection.updateOne({name:response.name},{$set:{name:req.body.name}}).then(updateResponse => {
        res.status(204).send(updateResponse);
      }).catch(err => {
        res.status(500).json({error:err.message}); // mongo dbupdate exception message
      })
    } else {
      res.status(404).send('Kullanıcı bulunamadı');
    }
  }).catch(err => {
    // console.log('err', err.message);
    res.status(500).send(err); // Id parsing hatası
  });

 

  
});

// api/todos/async/1
router.put('/async/:id', async function (req,res,next) {
    // async await

    try {
      // sıralı operasyonları then catch blokları içerisinde yazmak zor olduğundan dolayı async await yapısı ile promiseleri çözmüş olduk.
     const response = await db.collection('user').findOne({_id:new ObjectId(req.params.id)});

     var updateRes = await db.collection('user').updateOne({name:response.name},{$set:{name:req.body.name}});

     res.status(204).send(updateRes);

    } catch (error) {
      res.status(500).send(error.message);
    }
    
})

// api/users/1/friends
// doküman tabanlı sistemlerde nesneler nested iç içe obje olarak tutulduğundan ana nesne altındaki nesnelerde bir modifiye işlemi yapılacağı zaman patch verb tercih edilir.
router.patch('/:id/friends', function (req,res,next) {
  
});

router.delete('/:id', async function (req,res,next) {

  try {

    let query = {_id:new ObjectId (req.params.id)}

    var doc = await db.collection('user').findOne(query);

    if(doc){
      await db.collection('user').deleteOne(query);
  
      // delete kısmında mongo eğer id değerini bulamazsa exception fırmaltmıyor. bu case için delete işlemi gerçekleşmiyor. find ile bulunup eğer silinecek kayıt yoksa 404 fırlatmamız lazım
      res.status(204).send();
    } else {
      res.status(404).send('Kayıt bulunamadı');
    }

    
  } catch (error) {
    res.status(500).send(error);
  }
 
});

// export kodunu unutmayalım
module.exports = router;

