//Definición de variables
const url = "http://localhost:8080/usuario/";
const contenedor = document.querySelector("tbody");
let resultados = "";

const modalUsuario = new bootstrap.Modal(
  document.getElementById("modalUsuario")
);
const formUsuario = document.querySelector("form");
const nombre = document.getElementById("nombre");
const email = document.getElementById("email");
const prioridad = document.getElementById("prioridad");
const formEmail = document.querySelector("#form_email");
const btnBuscarEmail = document.querySelector("#btnBuscarEmail");
var opcion = "";

btnCrear.addEventListener("click", () => {
  nombre.value = "";
  email.value = "";
  prioridad.value = "";
  modalUsuario.show();
  opcion = "crear";
});

//funcion para mostrar los resultados
const mostrar = (usuarios) => {
  usuarios.forEach((usuario) => {
    resultados += `<tr>
                            <td>${usuario.id}</td>
                            <td>${usuario.nombre}</td>
                            <td>${usuario.email}</td>
                            <td>${usuario.prioridad}</td>
                            <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a><a data-email ="${usuario.email}" class="btnBorrar btn btn-danger">Borrar</a></td>
                       </tr>
                    `;
  });
  contenedor.innerHTML = resultados;
};

/**
 * Funcion para buscar un usuario por correo
 * @author Juan David Rivera
 * @version 1.0.0
 */
btnBuscarEmail.addEventListener("click", (e) => {
  let email = formEmail.value;
  console.log(email);

  fetch(email ? url + "email?email=" + email : url)
    .then((response) => response.json())
    .then((data) => {
      if (data <= 0) {
        //alert("el correo no existe");
        alertify.alert("el correo no existe");
        e.target.value = "";
      } else {
        resultados = "";
        contenedor.innerHTML += " ";
        mostrar(data);
      }
    })
    .catch((error) => console.log(error));
});

//Procedimiento Mostrar
fetch(url)
  .then((response) => response.json())
  .then((data) => mostrar(data))
  .catch((error) => console.log(error));

const on = (element, event, selector, handler) => {
  //console.log(element)
  //console.log(event)
  //console.log(selector)
  //console.log(handler)
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

/**
 * Actualizacion del borrado, pidiendo el correo
 * @author Juan David Rivera
 * @version 1.0.1
 */
//Procedimiento Borrar
on(document, "click", ".btnBorrar", (e) => {
  const fila = e.target.parentNode.parentNode;
  const id = fila.firstElementChild.innerHTML;
  let emailDelete = e.target.dataset.email;
  //console.log(e.target.dataset.email);
  alertify.prompt(
    "Si desea eliminar el usuario con el correo digitelo, si no envie el campo vacio.",
    `${emailDelete}`,
    function (evt, value) {
      //alertify.success("Ok: " + value);
      if (value == emailDelete && value != "") {
        fetch(url + id, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then(() => location.reload());
        //alertify.success('Ok')
        location.reload();
      } else {
        alert("no existe el email");
      }
    },
    function () {
      alertify.error("Cancel");
    }
  );
});

//Procedimiento Editar
let idForm = 0;
on(document, "click", ".btnEditar", (e) => {
  const fila = e.target.parentNode.parentNode;
  idForm = fila.children[0].innerHTML;
  const nombreForm = fila.children[1].innerHTML;
  const emailForm = fila.children[2].innerHTML;
  const prioridadForm = fila.children[3].innerHTML;
  nombre.value = nombreForm;
  email.value = emailForm;
  prioridad.value = prioridadForm;
  opcion = "editar";
  modalUsuario.show();
});

//Procedimiento para Crear y Editar
formUsuario.addEventListener("submit", (e) => {
  e.preventDefault();
  if (opcion == "crear") {
    //console.log('OPCION CREAR')
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nombre.value,
        email: email.value,
        prioridad: prioridad.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const nuevoUsuario = [];
        nuevoUsuario.push(data);
        mostrar(nuevoUsuario);
      });
  }
  if (opcion == "editar") {
    //console.log('OPCION EDITAR')
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: idForm,
        nombre: nombre.value,
        email: email.value,
        prioridad: prioridad.value,
      }),
    })
      .then((response) => response.json())
      .then((response) => location.reload());
  }
  modalUsuario.hide();
});
