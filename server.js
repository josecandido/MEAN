
/**
 * Module dependencies.
 */

var express = require('express');
/*var routes = require('./routes');
var user = require('./routes/user');*/
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 8081);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Conexión a Mongoose.
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/empresa', function(error){
   if(error){
      throw error; 
   }else{
      console.log('Conectado a MongoDB');
   }
});

//Documentos
var ClienteSchema = mongoose.Schema({
	nombre: String,
    apellido: String,
    domicilio: String,
    ciudad: String,
    telefono: String,
    email: String
});
var Cliente = mongoose.model('Cliente', ClienteSchema);

app.get('/', function(req, res){
	res.sendfile('./public/index.html');
});

app.get('/listar', function(req, res){
	Cliente.find({}, function(error, clientes){
      	if(error){
      		res.send('Error.');
      	}else{
        	res.send(clientes);        	
      	}
   })
});

app.get('/recuperar', function(req, res){
	Cliente.findById(req.query._id, function(error, documento){
      	if(error){
         	res.send('Error.');
      	}else{
         	res.send(documento);
      	}
   });
});

app.post('/guardar', function(req, res){
	if(req.query._id == null){
		//Inserta
		var cliente = new Cliente({
		   nombre: req.query.nombre,
		   apellido: req.query.apellido,
		   domicilio: req.query.domicilio,
		   telefono: req.query.telefono,
		   ciudad: req.query.ciudad,
		   email: req.query.email
		});
		cliente.save(function(error, documento){
			if(error){
			 	res.send('Error.');
			}else{
			 	res.send(documento);
			}
	   	});
	}else{
		//Modifica
		Cliente.findById(req.query._id, function(error, documento){
		  	if(error){
				res.send('Error.');
		  	}else{
				var cliente = documento;
				cliente.nombre = req.query.nombre,
			   	cliente.apellido = req.query.apellido,
			   	cliente.domicilio = req.query.domicilio,
			   	cliente.telefono = req.query.telefono,
			   	cliente.ciudad = req.query.ciudad,
			   	cliente.email = req.query.email
				cliente.save(function(error, documento){
			    	if(error){
			       		res.send('Error.');
			    	}else{ 
			       		res.send(documento);
			    	}
			 	});
			}
		});
	}
});

app.post('/eliminar', function(req, res){
	Cliente.remove({_id: req.query._id}, function(error){
		if(error){
			res.send('Error.');
		}else{
			res.send('Ok');
		}
   });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
