// uygulamanın start edildiği boostrap edildiği dosya.

// CommonJS formatında bir web uygulamasında olması gereken required bileşenler tanımlanmış
var createError = require('http-errors');
var express = require('express')
var path = require('path'); // nodejs core module
var cookieParser = require('cookie-parser');
var logger = require('morgan'); // requestleri loglamak için kullanılan bir middleware
var session = require('express-session');

// uygulamanın ana route 
var indexRouter = require('./routes/index');
// users route
var usersRouter = require('./routes/users');

// net core tarafındaki servis.add(); servis collection yapılarını tanımladığımız kısım.
// uygulamanın çalışması için gerekli olan servisler

var app = express();
// var app = services.build(); // uygulama artık build edilip middlewareler uygulama tanıtıldı.

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// uygulamaya viewler views klasöründen okunsun dedik
app.set('view engine', 'hbs');
// express uygulamalarında birden fazla template engine kullanılabilir.
// bunlardan en yaygınları jade ve hbs (handlebars) view engine
// view için jade view engine kullanacağız

app.use(logger('dev')); // developlement modda logla
// morgan ile request arasına girip gelen request hangi http verbs üzerinden istek atıldığını console loglamış olduk.
app.use(express.json()); // uygulama gelen istekleri json formatına çevir
app.use(express.urlencoded({ extended: true })); // formdan gelen istekleri yakalamak bir yöntem uyguladık
// x-wwww-form-urlencoded olarak gönderilen değerşeri json formatında almamı sağlayan middleware
// uygulama genelinde cookie oluşturabiliyoruz.
app.use(cookieParser()); // uygulamada cookie kullan
// set ettiğimiz cookie değerlerini request üzerinden get ederken ilgili değerin parse edilmesini sağlar.

app.use(session({secret:'x-secret'}));
// session middleware aktif hale getir.

// __dirname nodejs current directoryName
// public dosyalarına erişim için bu middleware önemli
app.use(express.static(path.join(__dirname, 'public')));
// app.useStaticFiles(); uygulamanın static dosyalarını public klasörü altında yayınla

// Not: Uygulama öncelikle yaşam döngüsüne göre bazı middleware süreçlerinden geçmeli daha sonra bizim uygulama scope düşmeli.
// bu sebeple uygulama routeları üzerinde çalışırken öncelikle session,cookie, body parsing, querystring gibi işlemlerin middleware tanıtılması lazım. // Eğer kendi middleware yapımız route yönlendirmeden önce çalışacak ise bunu route dosyalarını okumadan önce araya girerek yapabilir.
// 1. middleware ile ara girip ara bir iş akışını yöntemek
// 2. midldeware içerisinde request değerine bir değer ekleyip bu değerin diğer requestlerde taşınması işlemi.
/*
app.use(function (req,res,next) {
  // next ile bir sonraki adıma taşı.
  if(req.method == "GET"){
    // res.json() => request json formatında yazdırı
    // res.send() direk html body send içerisinde gönderilen değeri yazdırır.
    // res.status() response status code tanımı için kullanılır
    // res.render('viewname'); // view render etmek için kullanılır.
    // res.redirect('url'); gelen isteğin yönlendirmesini yapar.
    res.send('GET isteklerine kapalı');
    //res.redirect('/users'); // anadizine istek atınca beni users endpoint yönlendir
  } else {
    next(); // bir sonraki middleware adımına geç.
  }
});
*/
/*
app.use(function (req,res,next) {
  // response içerisinde username denilen bir değişken sakladım.
  // middleware sayesinde response içerisinde bir değer saklayıp başka requestlerde bunu yakalayabilir.
  res.locals.username = 'ali';
  next();
});

// /test linki
app.use('/test', function (req,res,next)   {
    res.send('username from middleware :' + res.locals.username)
});

*/


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // uygulamada bulunmayan routelar için 404 sayfına yönlendir.
  // console.log('404');
  next(createError(404));
});

// error handler middleware
app.use(function(err, req, res, next) {
  // err callbak uygulama içerisinde oluşan hataları yakamamızı sağlar.
  console.log('err', err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
