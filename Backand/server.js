const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors')
const knex=require('knex');
const { response } = require('express');
const bcrypt=require('bcrypt-nodejs');

const db=knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test',
      database : 'smart-brain'
    }
  });

const app=express();

app.use(bodyParser.json());
//a koristi se app.use zato sto kada uzme request prvo prolazi kroz funkciju use gde mi parsiramo podatke u ovom slucaju i tek onda ide get post put idt... 
//6 linija konvertuje request koji dobija(email i password) i posto su email i pass u json on ga konvertuje u JS 
//da nismo koristili parser bila bi greska, zato sto kada primamo podatke iz frontenda i ako su oni json mi moramo prvo da ih konvertujemo jer express ne zna sa cim radi 
app.use(cors());



app.get('/',(req,res)=>{
    res.send('succsess');
});

app.post('/signin',(req,res)=>{
    db.select('email','hash').from('login')
    .where('email','=',req.body.email)
    .then(data=>{
        const isValid=bcrypt.compareSync(req.body.password,data[0].hash)
        if(isValid){
            return db.select('*').from('users')
            .where('email','=',req.body.email)
            .then(user=>{
                res.json(user[0])
            }).catch(res=>res.status(400).json('unable to get user'))
        }else{
            res.status(400).json('wrong infomrations')
        }
    }).catch(res=>res.status(400).json('wrong informations'))
})

app.post('/register',(req,res)=>{
    const {email,password,name}=req.body;
    const hash=bcrypt.hashSync(password);
    db.transaction(trx=>{
        trx.insert({
            hash:hash,
            email:email
        }).into('login')
        .returning('email')
        .then(loginEmail=>{
            return trx('users')
            .returning('*')
            .insert({
                email:loginEmail[0].email,
                name:name,
                joined:new Date()
            }).then(user=>{
                 //ovo res.json je isto u sustini kao res.send
                 //ne zaboravi uvek mora da bude response!!! inace ce biti greska
                res.json(user[0]);
            })
        }).then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err=>res.status(400).json('unable to join'))
   
})

//ovo u 60 liniji :id omogucava da mi ukucamo broj u adresi i onda on po tom broju da trazi  i da nam vrati usera sa tim brojem ako postoji
app.get('/profile/:id',(req,res)=>{
    const {id}=req.params;//ovako uzimamo taj br koji smo mi upisali i smestamo ga u id
    db.select('*').where({
        id:id
    }).from('users').then(user=>{
        if(user.length){
            res.json(user[0])
        }else{
            res.status(400).json('not found')
        }
    }).catch(err=>res.status(400).json('error getting user'))
    // if(!found){
    //     res.status(404).json('this user dont exist')
    // }
})

app.put('/image',(req,res)=>{
    const {id}=req.body;
    db('users')
    .where('id','=',id)
    .increment('entries',1)
    .returning('entries')
    .then(entries=>{
        res.json(entries[0].entries)
    }).catch(err=>res.status(400).json('unable to get count'))

})

app.listen(3000,()=>{
    console.log('app is running on port 3000')
})