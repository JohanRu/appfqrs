const config = {
    apiKey: "AIzaSyDUs3nHrv3tkjTIY-vlJ4kD2Htr0KZAxBg",
    authDomain: "appfoodqr-s.firebaseapp.com",
    databaseURL: "https://appfoodqr-s.firebaseio.com",
    projectId: "appfoodqr-s",
    storageBucket: "appfoodqr-s.appspot.com",
    messagingSenderId: "419385761642",
    appId: "1:419385761642:web:4c8d247cf9a3e182a30f13"
}

firebase.initializeApp(config);

const firestore = firebase.firestore();

const foodcard = document.querySelector("#foodcard");
const platos = document.querySelector("#platos");

const createForm = document.querySelector("#createForm");
const platoSubmit = document.querySelector("#platoSubmit");
let progressBar = document.querySelector("#progressBar");
const progressHandler = document.querySelector("#progressHandler");

const openNav = document.querySelector("#openNav");
const closeNav = document.querySelector("#closeNav");


// obtener los datos de la db e insertar en cards
const getPlatos = async () => {
    let platosArray = [];
    let docs = await firebase.firestore().collection("Platos").get().catch(err => console.log(err));
    docs.forEach(doc => {
        platosArray.push({ "id": doc.id, "data": doc.data()});
    });
    createChildrenPlat(platosArray);
    createActionChindren(platosArray);
}

const createChildrenPlat = async(arr) => {
    if(foodcard != null) {
        arr.map( plato => {


            let fooddiv = document.createElement("div");
            let foodimagediv = document.createElement("div");
            let foodcontentdiv = document.createElement("div");
            let preciospan = document.createElement("span");
            let nombrespan = document.createElement("span");
            let descripcionspan = document.createElement("span");
            let img = document.createElement("img");
            
            img.src = plato.data.cover;
            let precioNode = document.createTextNode(plato.data.precio);
            let nombreNode = document.createTextNode(plato.data.nombre);
            let descripcionspanNode = document.createTextNode(plato.data.descripcion);

            preciospan.appendChild(precioNode);
            nombrespan.appendChild(nombreNode);
            descripcionspan.appendChild(descripcionspanNode);

            fooddiv.classList.add("food-card");
            foodimagediv.classList.add("food-card__imagen");
            foodcontentdiv.classList.add("food-card__contenido");
            nombrespan.classList.add("food-card__nombre");
            preciospan.classList.add("food-card__precio");
            descripcionspan.classList.add("food-card__descripcion");

            foodimagediv.appendChild(img);
            foodcontentdiv.appendChild(preciospan);
            foodcontentdiv.appendChild(nombrespan);
            foodcontentdiv.appendChild(descripcionspan);
            fooddiv.appendChild(foodimagediv);
            fooddiv.appendChild(foodcontentdiv);

            foodcard.appendChild(fooddiv);
            
        });
    }
}

const createActionChindren = async(arr) => {
    if(platos != null) {
        arr.map( plato => {
            let div = document.createElement("div");
            let cover = document.createElement("div");
            let anchor = document.createElement("a");

            let actiondiv = document.createElement("div");
            let editButton = document.createElement("button");
            let deleteButton = document.createElement("button");

            let anchorNode = document.createTextNode(plato.data.nombre);
            let editText = document.createTextNode("Editar");
            let deleteText = document.createTextNode("Borrar");

            anchor.setAttribute("href", "post.html");
            anchor.appendChild(anchorNode);

            cover.style.backgroundImage = "url(" + plato.data.cover + ")";

            editButton.appendChild(editText);
            deleteButton.appendChild(deleteText);

            editButton.id = plato.data.id;
            deleteButton.id = plato.data.id;

            editButton.setAttribute()

            editButton.classList.add("editButton");
            deleteButton.classList.add("deleteButton");
            actiondiv.appendChild(editButton);
            actiondiv.appendChild(deleteButton);

            div.classList.add("plato");
            div.appendChild(cover);
            div.appendChild(anchor);
            div.appendChild(actiondiv);
            platos.appendChild(div);

        });
    }
}

//Lógica del envío del formulario createForm

if(createForm != null) {
    let d;
    createForm.addEventListener("submit", async(e)=>{
        e.preventDefault();
        if(
            document.getElementById("nombre").value != "" &&
            document.getElementById("precio").value != "" &&
            document.getElementById("descripcion").value != "" &&
            document.getElementById("cover").files[0] != "" 
        ){
            let nombre = document.getElementById("nombre").value;
            let precio = document.getElementById("precio").value;
            let descripcion = document.getElementById("descripcion").value;
            let cover = document.getElementById("cover").files[0];

            console.log(cover);
            const storageRef = firebase.storage().ref();
            const storageChild = storageRef.child(cover.name);
            console.log("Subiendo Imágen...");
            const platoCover = storageChild.put(cover);

            await new Promise((resolve) => {
                platoCover.on("state_changed", (snapshot)=> {
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(Math.trunc(progress));
                    if(progressHandler != null) {
                        progressHandler.style.display = true;
                    }
                    if(platoSubmit != null) {
                        platoSubmit.disabled = true;
                    }
                    if(progressBar != null) {
                        progressBar = progress;
                    }
                }, (error) => {
                    console.log(error);
                }, async() => {
                    const downloadURL = await storageChild.getDownloadURL();
                    d = downloadURL;
                    console.log(d);
                    resolve();
                });
            });

            const fileRef = await firebase.storage().refFromURL(d);
            let plato = {
                nombre,
                precio,
                descripcion,
                cover : d,
                fileref : fileRef.location.path
            }
            await firebase.firestore().collection("Platos").add(plato);
            console.log("Plato Añadido!");
            if(platoSubmit != null) {
                window.location.replace("index.html");
                platoSubmit.disabled = false;
            }
        } else {
            console.log("Falta información en el formulario");
        }
    });
} 

// validar si el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", (e) => {
    getPlatos();
});

// funciones del nav
openNav.addEventListener("click", (e) => {
    document.getElementById("nav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
})

closeNav.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("nav").style.width = "0px";
    document.getElementById("main").style.marginLeft = "";
})

