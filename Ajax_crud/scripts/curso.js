var url = "https://alumnoscurso.azure-mobile.net/Tables/Curso/";

function guardarDatos() {
    var obj = {
        nombre: document.getElementById("add_nombre").value,
        duracion: document.getElementById("add_duracion").value,
    };


    var ajax = new XMLHttpRequest();
    ajax.open("post", url);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4) {
            if (ajax.status >= 200 && ajax.status < 300) {
                obtenerDatos();
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

        if (ajax.readyState == 4) {

            // entre 200 y 300 respuesta  de exito
            if (ajax.status >= 200 && ajax.status < 300) {

                var data = JSON.parse(ajax.responseText);
                var salida = "<table>";
                for (var i = 0; i < data.length; i++) {
                    salida += "<tr>";
                    salida += "<td>" + data[i].nombre + "</td>";
                    salida += "<td>" + data[i].duracion + "h</td>";
                    salida += "<td>" + "<i class='material-icons'>mode_edit</i> <i class='material-icons'>delete</i> " + "</td>";
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


obtenerDatos();

document.getElementById("btnAdd").onclick = guardarDatos;

document.getElementById("btnRefresh").onclick = obtenerDatos;

