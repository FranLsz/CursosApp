var url = "https://alumnoscurso.azure-mobile.net/Tables/Curso/";
var fila;
function doAjax(tipo, url, datos, doneFn) {
    var ajax = new XMLHttpRequest();
    ajax.open(tipo, url);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4) {
            if (ajax.status >= 200 && ajax.status < 300)
                doneFn(ajax.responseText);
            else
                alert("Fallo al realizar la operación");
        }
    };
    if (datos == undefined) {
        ajax.send(null);
    } else {
        var datosStr = JSON.stringify(datos);
        ajax.send(datosStr);
    }
}

function guardarDatos() {
    var obj = {
        nombre: document.getElementById("add_nombre").value,
        duracion: document.getElementById("add_duracion").value
    };
    function procesar() {
        obtenerDatos();
        document.getElementById("add_nombre").value = "";
        document.getElementById("add_duracion").value = "";
    };
    doAjax("POST", url, obj, procesar);
}

function obtenerDatos() {
    function procesar(res) {
        var data = JSON.parse(res);
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
    }
    doAjax("GET", url, undefined, procesar);
}

function borrarDatos(o) {
    //obtencion de la fila del objeto, accediendo al padre del padre del icono de borrado
    fila = o.parentNode.parentNode;

    //se recupera el atributo personalizado de esta fila para obtener el id del objeto
    var obj = {
        id: fila.getAttribute("data-id")
    };
    var auxUrl = url + "/" + obj.id;
    function procesar() {
        //se borra la fila (accediendo al padre para borrar el hijo)
        fila.parentNode.removeChild(fila);
    }
    doAjax("DELETE", auxUrl, undefined, procesar);
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
    btnAdd.textContent = "Editar";
    btnAdd.onclick = editarDatos;
}
function editarDatos() {
    //obtenemos la fila del objeto, accediendo al padre del padre del icono de borrado
    //fila = o.parentNode.parentNode;

    //recuperamos el atributo personalizado de esta fila para obtener el id del objeto
    var obj = {
        id: fila.getAttribute("data-id"),
        nombre: document.getElementById("add_nombre").value,
        duracion: document.getElementById("add_duracion").value
    };
    var auxUrl = url + obj.id;

    function procesar() {
        document.getElementById("add_nombre").value = "";
        document.getElementById("add_duracion").value = "";
        document.getElementById("add_title").textContent = "Nuevo curso";
        document.getElementById("btnAdd").textContent = "Crear";
        window.btnAdd.onclick = guardarDatos;
        obtenerDatos();
    }
    doAjax("PATCH", auxUrl, obj, procesar);
}
obtenerDatos();
document.getElementById("btnAdd").onclick = guardarDatos;
document.getElementById("btnRefresh").onclick = obtenerDatos;
