const {MongoClient} = require('mongodb');

// MongoClient ile mongodb bağlantısı yönetihyoruz.

const connectionString = 'mongodb://127.0.0.1/27017';
const client = new MongoClient(connectionString);
// connection success
const dbname = 'testdb';

// Promiseler (Vaat,Söz) JS de asenkron programalama yapmamızı sağlayan bir sınıf.
// ES 6 ile hayatıma girdi.
// JS tarafında asenkton çalışmak için callback yapıları kullanırdık.
// Promise yapıları reject ve resolve denilen 2 dönüş tipine sahip
// reject (sözünü tutamama, çözülememe, hata verme) => uzak bir kaynağa bağlantı sorunu olduğunda dönen result. Api tarafında alınan her hata aslında reject olarak döner. 401,403,404,400,500
// resolve (sözü tutma, çözülme) => uzak bir kaynağa bağlantı kurulduğunda yapılan işlemin başarılı bir şekilde sonuçlandığında dönen result. 
// 201,200,204 başarı döndüren resultlarımız

// var p = new Promise((resolve,reject) => {
//   var number = 2;

//   if(number == 0){
//     reject('0 a bölünemez')
//   }

//   if(number % 1){
//     resolve('Kalanlı')
//   } else {
//     resolve('Kalansız')
//   }

  
// });

// p.then((dogruSonuc) => {
//   console.log('dogruSonuc', dogruSonuc)
// }).catch((hataliSonuc) => {
//   console.log('hatalı sonuc', hataliSonuc)
// })


client.connect()
.then(()=>{ // başarılı olduğunda dinleyeceğimiz function yani resolve durumunda çalışır. Bu anda sunucundan bize resolve sonucu çözülüp dönmüş olur. try
  console.log('Mongo bağlantısı başarılı')
})
.catch(err => { // hata durumunda dinleyeceğimiz sinyal buda reject olarak çalışır. hata result döner. catch
  console.log('Bağlantı başarısız');
  client.close();
}).finally(()=> {
  // client.close(); // bağlantıyı kapat. // sürekli kapama işlemi yapmadan kaynağa bağlanmak bizi connection hatalarına düşmemize sebep olur.
  // using içerisinde DbContext bağlanmak gibi düşünebilir.
});

const db = client.db(dbname);
// var db = new AppDbContext();

module.exports = db;



