var express = require('express');
var router = express.Router();

// uygulama gelen http istekleri routes dosyası üzerinden request olarak dağılıyor.

/* GET home page. */
router.get('/', function(req, res, next) {
  // req: request nesnesi
  // res: response nesnesi
  // next: middleware arayazılımların uygulanaması için süreci bir sonraki middleware aktarmak amaçlı kullanılan request handler.
  // render komutu
  // netdeki return view() komutunun aynısı
  // render edilecek olan view ismi veriliyor
  // { title: 'Express' } view'e gönderilecek olan modelimiz
  // throw new Error('hata');
  res.render('index', { title: 'Deneme' });
});

router.post('/', function (req, res, next) {

  // body şuan hangi formatta okumak istiyorum
  console.log('request body', req.body);
  
  res.send('Post işlemi gerçekleşti')
});

router.get('/setCookie', function (req,res,next) {
  res.cookie('name','ali',{maxAge:3600000});
  // res.cookie ile cookie değeri oluşturdum.
  // tarayıcıdan document.cookie olarak erişebilmem lazım.
  res.send('cookie set edildi');
});

router.get('/getCookie', function (req,res,next) {
  // req.cookies['keyname'] ile cookie değeri okuduk.
  res.send('cookie get edildi: ' + req.cookies['name']);
});

router.get('/getSession', function (req,res,next) {
  // sessionId değerini sunucu üretir.
  // her sunucu açılan kullanıcı bazlı session için unique bir session değeri üretecektir.
  res.send('session get edildi :' + req.session.id + "custom session :" + req.session['name'].name);
});

router.get('/setSession', function (req,res,next) {
  // session değer set etmek için kullandık
  req.session['name'] = {id:1,name:'ahmet'};
  res.send('session set edildi');
});
// js dosyasını dışarıdan başka bir js dosyasından çağrımak için module.export komutunu kullanıyoruz.
module.exports = router;
