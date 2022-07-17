const mongoose = require('mongoose');

// Local conection: mongodb://localhost/db
// To connect to cloud database: mongodb+srv://user:23091994Se_@cluster0-5u7zi.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://user:23091994Se_@cluster0-5u7zi.mongodb.net/test?retryWrites=true&w=majority', {
   useCreateIndex: true,
   useNewUrlParser: true,
   useFindAndModify: false, 
   useUnifiedTopology: true,
})
.then(db => console.log('DB is connected'))
.catch(err => console.error(err));
