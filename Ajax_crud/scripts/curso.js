var url = "https://alumnoscurso.azure-mobile.net/Tables/Curso/";
var fila;
function guardarDatos() {
    var obj = {
        nombre: document.getElementById("add_nombre").value,
        duracion: document.getElementById("add_duracion").value
    };


    var ajax = new XMLHttpRequest();
    ajax.open("post", url);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4) {
            if (ajax.status >= 200 && ajax.status < 300) {
                obtenerDatos();
                document.getElementById("add_nombre").value = "";
                document.getElementById("add_duracion").value = "";
            } else {
                alert();
            }
        }
    }
    //se transforma a un JSON en texto
    var data = JSON.stringify(obj);
    ajax.send(data);

}




function obtenerDatos() {
    var ajax = new XMLHttpRequest();

    //inicia la comunicacion
    ajax.open("get", url);

    //cuando cambie el estado ejecuta la funcion (res = respuesta)
    ajax.onreadystatechange = function () {

        if (ajax.readyState === 4) {

            // entre 200 y 300 respuesta  de exito
            if (ajax.status >= 200 && ajax.status < 300) {

                var data = JSON.parse(ajax.responseText);
                var salida = "<table>";
                for (var i = 0; i < data.length; i++) {
                    salida += "<tr data-id='" + data[i].id + "'>";
                    salida += "<td>" + data[i].nombre + "</td>";
                    salida += "<td>" + data[i].duracion + "h</td>";
                    salida += "<td>" + "<i id='btnEdit' onclick='showEditPanel(this)' class='material-icons'>mode_edit</i> <i id='btnRemove' onclick='borrarDatos(this)' class='material-icons'>delete</i> " + "</td>";
                    salida += "</tr>";
                }

                salida += "</table>";
                document.getElementById("data_location").innerHTML = salida;

            } else {
                alert("Error en la peticion");
                console.log(ajax.error);
            }


        }

    };

    ajax.send(null);
}

function borrarDatos(o) {
    //obtenemos la fila del objeto, accediendo al padre del padre del icono de borrado
    fila = o.parentNode.parentNode;

    //recuperamos el atributo personalizado de esta fila para obtener el id del objeto
    var obj = {
        id: fila.getAttribute('data-id')
    };


    var ajax = new XMLHttpRequest();
    //se concatena la url base con el id del objeto para poder ser borrado
    ajax.open("delete", url + "/" + obj.id);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4) {
            if (ajax.status >= 200 && ajax.status < 300) {
                //se borra la fila (accediendo al padre para borrar el hijo)
                fila.parentNode.removeChild(fila);
            } else {
                alert("Fallo gordo");
            }
        }
    }
    //se transforma a un JSON en texto
    //enviar el ID del objeto por aqui es opcional
    var data = JSON.stringify(obj);
    ajax.send(data);

}

function showEditPanel(o) {
    var titulo = document.getElementById("add_title");
    var btnAdd = document.getElementById("btnAdd");

    fila = o.parentNode.parentNode;
    var celdas = fila.getElementsByTagName("TD");
    document.getElementById("edit_id").value = fila.getAttribute('data-id');
    document.getElementById("add_nombre").value = celdas[0].textContent;
    document.getElementById("add_duracion").value = celdas[1].textContent.substring(celdas[1].textContent.length - 1, -2);
    titulo.textContent = "Editar curso";
    btnAdd.textContent = "Editar"
    btnAdd.onclick = editarDatos;
}
function editarDatos() {
    //obtenemos la fila del objeto, accediendo al padre del padre del icono de borrado
    //fila = o.parentNode.parentNode;

    //recuperamos el atributo personalizado de esta fila para obtener el id del objeto
    var obj = {
        id: fila.getAttribute('data-id'),
        nombre: document.getElementById("add_nombre").value,
        duracion: document.getElementById("add_duracion").value
    };


    var ajax = new XMLHttpRequest();
    //se concatena la url base con el id del objeto para poder ser borrado
    ajax.open("PATCH", url + obj.id);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4) {
            if (ajax.status >= 200 && ajax.status < 300) {
                document.getElementById("add_nombre").value = "";
                document.getElementById("add_duracion").value = "";
                document.getElementById("add_title").textContent = "Nuevo curso";
                document.getElementById("btnAdd").textContent = "Crear"
                btnAdd.onclick = guardarDatos;
                obtenerDatos();

            } else {
                alert("Fallo gordo");
            }
        }
    }
    //se transforma a un JSON en texto
    //enviar el ID del objeto por aqui es opcional
    var data = JSON.stringify(obj);
    ajax.send(data);

}




obtenerDatos();

document.getElementById("btnAdd").onclick = guardarDatos;

document.getElementById("btnRefresh").onclick = obtenerDatos;





