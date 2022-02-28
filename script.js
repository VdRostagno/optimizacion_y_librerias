//DOM
console.dir(document);
console.dir(document.head);
console.dir(document.body);

//get element by id
const titulo = document.getElementById("titulo");
console.log(titulo);
console.log(titulo.innerHTML);

const footer = document.getElementById ("footer");
console.log(footer);
console.log(footer.innerHTML);


const formulariodecontacto =document.getElementById("formulariodecontacto");
console.log(formulariodecontacto);
console.log(formulariodecontacto.innerHTML);


document.addEventListener('DOMContentLoaded', () => {
    // Variables
    const baseDeDatos = [
        {
            id:1,
            nombre:'Creacion de logos',
            precio:1000,
            imagen: "imagenes/creacion_logos.jpg",
        }, 
        {
            id: 2,
            nombre: 'Desarrollo web',
            precio: 5000,
            imagen: "imagenes/desarrollo_web.png"
        },
        {
            id: 3,
            nombre: 'Diseño de sitio',
            precio: 5000,
            imagen: "imagenes/diseño_sitio.jpg"
        },
        {
            id: 4,
            nombre: 'Presupuesto',
            precio: 1000,
            imagen: "imagenes/generacion_presupuesto.jpg"
        },
        {
            id: 5,
            nombre: 'Manejo de hosting y dominio',
            precio: 1000,
            imagen: "imagenes/hosting_dominio.png"
        },
        {
            id: 6,
            nombre: 'Seo y analityc',
            precio: 1000,
            imagen: "imagenes/seo_analityc.jpg"
        },
        {
            id: 7,
            nombre: 'Servicios de CM',
            precio: 1000,
            imagen: "imagenes/servicio_cm.jpg"
        }
    ];

    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar')
    const DOMbotonComprar = document.querySelector('#boton-comprar');

    // Funciones

    /**
    * Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
    */
    function renderizarProductos() {
        baseDeDatos.forEach((info) => {
            // Estructura
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');
            // Body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            // Titulo
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;
            // Imagen
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);
            // Precio
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${info.precio}${divisa}`;
            // Boton 
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = '+';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
            // Insertamos
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

    /**
    * Evento para añadir un producto al carrito de la compra
    */
    function anyadirProductoAlCarrito(evento) {
        // Anyadimos el Nodo a nuestro carrito
        carrito.push(evento.target.getAttribute('marcador'))
        // Actualizamos el carrito 
        renderizarCarrito();

    }

    /**
    * Dibuja todos los productos guardados en el carrito
    */
    function renderizarCarrito() {
        // Vaciamos todo el html
        DOMcarrito.textContent = '';
        // Quitamos los duplicados
        const carritoSinDuplicados = [...new Set(carrito)];
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach((item) => {
            // Obtenemos el item que necesitamos de la variable base de datos
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                // ¿Coincide las id? Solo puede existir un caso
                return itemBaseDatos.id === parseInt(item);
            });
            // Cuenta el número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                return itemId === item ? total += 1 : total;
            }, 0);
            // Creamos el nodo del item del carrito
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
            // Boton de borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mezclamos nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
       // Renderizamos el precio total en el HTML
       DOMtotal.textContent = calcularTotal();
    }

    /**
    * Evento para borrar un elemento del carrito
    */
    function borrarItemCarrito(evento) {
        // Obtenemos el producto ID que hay en el boton pulsado
        const id = evento.target.dataset.item;
        // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        // volvemos a renderizar
        renderizarCarrito();
    }

    /**
     * Calcula el precio total teniendo en cuenta los productos repetidos
     */
    function calcularTotal() {
        // Recorremos el array del carrito 
        return carrito.reduce((total, item) => {
            // De cada elemento obtenemos su precio
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            // Los sumamos al total
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    /**
    * Varia el carrito y vuelve a dibujarlo
    */
    function vaciarCarrito() {
        // Limpiamos los productos guardados
        carrito = [];
        // Renderizamos los cambios
        renderizarCarrito();
    }

    function comprar (){
        // Limpiamos los productos guardados
        carrito = [];
        // Renderizamos los cambios
        renderizarCarrito();
    }

    // Eventos
    DOMbotonComprar.addEventListener('click', () =>{
        Swal.fire({
            icon: 'success',
            title: 'Compra existosa',
            text: 'Has realizado tu compra con exito!',
          })
    }
    );
    DOMbotonVaciar.addEventListener('click', () =>{
        Swal.fire({
            title: 'Está seguro de vaciar el carrito?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, seguro',
            cancelButtonText: 'No, no quiero'
        }).then((result) => {
    console.log(result);
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Borrado!',
                    icon: 'success',
                    text: 'El archivo ha sido borrado'
                })
            }
        })
    })
    

    // Inicio
    renderizarProductos();
    renderizarCarrito();
  });




  const formulariodecontacto =["Nombre","Apellido","Mail","Servicio"]
class Usuario {
    constructor(Nombre, Apellido, Mail, Servicio) {
        this.Nombre  = Nombre.toUpperCase();
        this.Apellido = Apellido.toUpperCase();
        this.Mail = Mail.toUpperCase();
        this.Servicio = Servicio.toUpperCase();
    }}

//Creacion de usuario por medio de funcion
function Usuario (Nombre,Apellido,Mail,Servicio){
    this.Nombre = Nombre;
    this.Apeliido = Apellido;
    this.Mail= Mail;
    this.Servicio; 
} 

//Formulario que va a estar conectado con el formulario de contacto de la pagina

let preguntarNombre = prompt ("Nombre")
let preguntarApellido= prompt ("Apellido")
let preguntarMail= prompt ("Celular")
let preguntarServicio= prompt ("Servicio")

const nuevoUsuario1 = new Usuario (preguntarNombre, preguntarApellido, preguntarMail, preguntarServicio);

console.log(nuevoUsuario1)

//Establezco DOM en botones
const DOMbotonEnviar = document.querySelector('#boton-enviar')
const DOMbotonBorrar = document.querySelector('#boton-borrar');

//AGREGANDO EVENTOS - FORMULARIO DE CONTACTO 

let formulariodecontacto = document.getElementById("formulariodecontacto");
formulariodecontacto.addEventListener("submit", validarFormulario);
    
function validarFormulario(e){
   e.preventDefault();
   console.log("Formulario Enviado");    
}
let miFormulario      = document.getElementById("formulariodecontacto");
miFormulario.addEventListener("submit", validarFormulario);

function validarFormulario(e){
    //Cancelamos el comportamiento del evento
    e.preventDefault();
    //Obtenemos el elemento desde el cual se disparó el evento
    let formulariodecontacto = e.target
    //Obtengo el valor del primero hijo <input type="text">
    console.log(formulariodecontacto.children[0].value); 
    //Obtengo el valor del segundo hijo <input type="number"> 
    console.log(formulariodecontacto.children[1].value); 
}
 // Eventos
 DOMbotonEnviar.addEventListener('click', () =>{
    Swal.fire({
        icon: 'success',
        title: 'Tus datos se han cargado',
        text: 'Tus datos se han enviado con exito!',
      })
}
);
DOMbotonBorrar.addEventListener('click', () =>{
    Swal.fire({
        title: 'Está seguro de borrar tus datos?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, seguro',
        cancelButtonText: 'No, no quiero'
    }).then((result) => {
console.log(result);
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Borrado!',
                icon: 'success',
                text: 'Tus datos han sido borrado'
            })
        }
    })
})