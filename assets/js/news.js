const firebaseConfig = {
    apiKey: "AIzaSyAxiXl5E5pDxFkgJFLo59relkrRkBdRv_U",
    authDomain: "final-database-9493d.firebaseapp.com",
    databaseURL: "https://final-database-9493d-default-rtdb.firebaseio.com",
    projectId: "final-database-9493d",
    storageBucket: "final-database-9493d.appspot.com",
    messagingSenderId: "798360016853",
    appId: "1:798360016853:web:b39e41d841cbc3ba4acf5c"
};
const isLoggedIn = sessionStorage.getItem("isLoggedIn");
console.log(isLoggedIn);
if (!isLoggedIn) {
  window.location.href = "index.html";
}

console.log(isLoggedIn);
if (!isLoggedIn) {
  window.location.href = "index.html";
}
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const database = firebase.database();

let files;
let selectedImagesFiles;
const imageDa = document.querySelector("#imagePreview");
const imageDa1 = document.querySelector("#newImagePreview");
const uploadModal = document.getElementById('updateAlert');
const closeSuccessful = document.querySelector('#updateAlert #okayUpdate');

const uploadModalAlert = document.getElementById('alert');
const closeSuccessfulOkay = document.querySelector('#alert #okayButton');

closeSuccessful.addEventListener('click', () => {
    uploadModal.classList.add('hidden');
});

closeSuccessfulOkay.addEventListener('click', () => {
    uploadModalAlert.classList.add('hidden');
});

const getImageData = (e) => {
    files = e.target.files;
    for (let index = 0; index < files.length; index++) {
        const imageData = document.createElement("div");
        imageData.className = "relative imageContainer";

        const image = document.createElement("img");
        image.className = "fileData w-24 h-24 object-cover rounded";
        image.src = URL.createObjectURL(files[index]);
        imageData.appendChild(image);

        const deselectButton = document.createElement("img");
        deselectButton.className = "deselectButton absolute top-0 right-0 w-6 h-6 m-1 cursor-pointer";
        deselectButton.src = '/assets/img/delete1.png';
        deselectButton.onclick = function () {
            imageData.remove();
            URL.revokeObjectURL(image.src);
        };
        imageData.appendChild(deselectButton);

        imageDa.appendChild(imageData);
    }
};

const getImageData1 = (e) => {
    selectedImagesFiles = e.target.files;
    const newImagePreview = document.getElementById("newImagePreview");

    for (let index = 0; index < selectedImagesFiles.length; index++) {
        const imageData = document.createElement("div");
        imageData.className = "relative imageContainer";

        const image = document.createElement("img");
        image.className = "fileData w-24 h-24 object-cover rounded";
        image.src = URL.createObjectURL(selectedImagesFiles[index]);
        imageData.appendChild(image);

        const deselectButton = document.createElement("img");
        deselectButton.className = "deselectButton absolute top-0 right-0 w-6 h-6 m-1 cursor-pointer";
        deselectButton.src = '/assets/img/delete1.png';
        deselectButton.onclick = function () {
            imageData.remove();
            URL.revokeObjectURL(image.src);
        };

        imageData.appendChild(image);
        imageData.appendChild(deselectButton);

        newImagePreview.appendChild(imageData);
    }
};

// Event listener for the new image input
document.getElementById("images1").addEventListener("change", getImageData1);

const selectImage = () => {
    document.querySelector("#images").click();
};

const selectImage1 = () => {
    document.querySelector("#images1").click();
};

function resetForm() {
    addPlantForm.querySelectorAll('input, textarea').forEach(field => {
        field.value = '';
    });
    imageDa.innerHTML = "";
    addPlantForm1.querySelectorAll('input, textarea').forEach(field => {
        field.value = '';
    });
    imageDa1.innerHTML = "";
}

const addPlantForm = document.getElementById('addNews');
document.getElementById('showFormButton').addEventListener('click', function () {
    addPlantForm.classList.remove('hidden');
    resetForm();
});
document.getElementById('close').addEventListener('click', function () {
    addPlantForm.classList.add('hidden');
    resetForm();
});

const addPlantForm1 = document.getElementById('addNews1');
document.getElementById('close3').addEventListener('click', function () {
    addPlantForm1.classList.add('hidden');
    resetForm();
});

const progress = document.getElementById('progress');
const percentage = document.getElementById('percentage');

function uploadData() {
    const bar = document.getElementById('uploadBar');
    bar.classList.remove('hidden');

    const title = document.getElementById('identification').value;
    const descrip1 = document.getElementById('descrip').value;
    const input = document.getElementById('images');
    const imageFiles = input.files;

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    const uploadPromises = [];
    const user = firebase.auth().currentUser;

    if (!user) {
        console.error('No user is signed in.');
        return;
    }

    for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i];
        const storageRef = firebase.storage().ref('images/' + imageFile.name);
        const uploadTask = storageRef.put(imageFile);

        uploadTask.on('state_changed',
            function progress(snapshot) {
                const progressPercentage = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                percentage.innerHTML = progressPercentage + "%";
                progress.style.width = progressPercentage + "%";
            },
            function error(error) {
                console.error('Error uploading images: ', error);
            }
        );

        uploadPromises.push(uploadTask);
    }

    Promise.all(uploadPromises).then(function (snapshot) {
        const imageUrls = [];
        snapshot.forEach(function (childSnapshot) {
            childSnapshot.ref.getDownloadURL().then(function (downloadURL) {
                imageUrls.push(downloadURL);
                if (imageUrls.length === imageFiles.length) {
                    firebase.database().ref('Admin/' + user.uid + '/username').once('value').then(function (snapshot) {
                        const username = snapshot.val();

                        const postData = {
                            title: title,
                            descrip: descrip1,
                            imageUrls: imageUrls,
                            uploadDate: formattedDate,
                            uploadTime: formattedTime,
                            userId: user.uid,
                            username: username
                        };

                        const postId = firebase.database().ref().child('News').push().key;
                        firebase.database().ref('News/' + postId).set(postData).then(function () {
                            bar.classList.add('hidden');
                            document.getElementById('alert').classList.remove('hidden');
                            addPlantForm.classList.add('hidden');
                        }).catch(function (error) {
                            console.error('Error uploading data: ', error);
                        });
                    }).catch(function (error) {
                        console.error('Error retrieving username from database: ', error);
                    });
                }
            });
        });
    }).catch(function (error) {
        console.error('Error uploading images: ', error);
    });
}

function retrieveAndDisplayData() {
    const postsRef = database.ref('News');
    const postsContainer = document.getElementById('postsContainer');

    postsRef.on('value', function (snapshot) {
        postsContainer.innerHTML = '';

        const postsArray = [];
        snapshot.forEach(function (childSnapshot) {
            const postData = childSnapshot.val();
            const postId = childSnapshot.key;
            postsArray.push({
                id: postId,
                data: postData
            });
        });

        postsArray.sort(function (a, b) {
            const dateA = new Date(a.data.uploadDate + ' ' + a.data.uploadTime);
            const dateB = new Date(b.data.uploadDate + ' ' + b.data.uploadTime);
            return dateB - dateA;
        });

        postsArray.forEach(function (postObj) {
            const postData = postObj.data;
            const postId = postObj.id;
            const title = postData.title;
            const imageUrls = postData.imageUrls;

            const postDiv = document.createElement('div');
            postDiv.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md');

            const titleElement = document.createElement('h3');
            titleElement.textContent = title;
            titleElement.classList.add('text-xl', 'font-semibold', 'mb-2');

            const description = document.createElement('p');
            description.textContent = postData.descrip;
            description.classList.add('text-gray-600', 'mb-4');

            const imagesDiv = document.createElement('div');
            imagesDiv.classList.add('grid', 'grid-cols-2', 'gap-2', 'mb-4');

            if (imageUrls) {
                imageUrls.forEach(function (imageUrl) {
                    const imgElement = document.createElement('img');
                    imgElement.src = imageUrl;
                    imgElement.classList.add('w-full', 'h-32', 'object-cover', 'rounded');
                    imagesDiv.appendChild(imgElement);
                });
            }

            const buttonsDiv = document.createElement('div');
            buttonsDiv.classList.add('flex', 'justify-between');

            const editButton = document.createElement('button');
            editButton.textContent = "Edit";
            editButton.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded-lg', 'hover:bg-blue-600');
            editButton.addEventListener('click', function () {
                editNews(postId, postData);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Delete";
            deleteButton.classList.add('bg-red-500', 'text-white', 'px-4', 'py-2', 'rounded-lg', 'hover:bg-red-600');
            deleteButton.addEventListener('click', function () {
                deletePostFromFirebase(postId);
            });

            buttonsDiv.appendChild(editButton);
            buttonsDiv.appendChild(deleteButton);

            postDiv.appendChild(titleElement);
            postDiv.appendChild(description);
            postDiv.appendChild(imagesDiv);
            postDiv.appendChild(buttonsDiv);

            postsContainer.appendChild(postDiv);
        });
    });
}

function editNews(postId, postData) {
    document.getElementById('addNews1').classList.remove('hidden');
    document.getElementById('identification1').value = postData.title;
    document.getElementById('descrip1').value = postData.descrip;

    const currentImagePreview = document.getElementById('currentImagePreview');
    currentImagePreview.innerHTML = "";

    if (postData.imageUrls) {
        postData.imageUrls.forEach((imageURL, index) => {
            const imageData = document.createElement("div");
            imageData.className = "relative imageContainer";
            const image = document.createElement("img");
            image.className = "fileData w-24 h-24 object-cover rounded";
            image.src = imageURL;
            const deselectButton = document.createElement("img");
            deselectButton.className = "deselectButton absolute top-0 right-0 w-6 h-6 m-1 cursor-pointer";
            deselectButton.src = "/assets/img/delete1.png";
            deselectButton.onclick = function () {
                deleteImageFromFirebase(imageURL, imageData);
            };
            imageData.appendChild(image);
            imageData.appendChild(deselectButton);
            currentImagePreview.appendChild(imageData);
        });
    }

    document.getElementById('uploadAlldata1').addEventListener('click', function () {
        const updatedTitle = document.getElementById('identification1').value;
        const updatedDescription = document.getElementById('descrip1').value;
        const newsRef = database.ref('News/' + postId);

        newsRef.update({
            title: updatedTitle,
            descrip: updatedDescription
        }).then(() => {
            if (selectedImagesFiles) {
                const existingImageUrls = postData.imageUrls || [];
                const promises = [];
                for (let i = 0; i < selectedImagesFiles.length; i++) {
                    const file = selectedImagesFiles[i];
                    const storageRef = storage.ref('images/' + file.name);
                    const uploadTask = storageRef.put(file).then((snapshot) => {
                        return snapshot.ref.getDownloadURL();
                    }).then((downloadURL) => {
                        return downloadURL;
                    }).catch((error) => {
                        console.error('Error uploading image:', error);
                    });
                    promises.push(uploadTask);
                }

                Promise.all(promises).then((newImageUrls) => {
                    const allImageUrls = existingImageUrls.concat(newImageUrls);
                    newsRef.update({ imageUrls: allImageUrls });
                }).catch((error) => {
                    console.error('Error updating images:', error);
                });
            }
            document.getElementById('updateAlert').classList.remove('hidden');
            document.getElementById('addNews1').classList.add('hidden');
        }).catch((error) => {
            console.error('Error updating news:', error);
        });
    });
}

// Delete single image from Firebase
function deleteImageFromFirebase(imageURL, imageData) {
    const storageRef = firebase.storage().refFromURL(imageURL);
    storageRef.delete().then(() => {
        imageData.remove();
        console.log('Image deleted successfully!');
    }).catch((error) => {
        console.error('Error deleting image:', error);
    });
}

// Delete post function
function deletePostFromFirebase(postId) {
    database.ref('News/' + postId).remove()
        .then(function () {
            console.log("Post deleted successfully!");
        })
        .catch(function (error) {
            console.error("Error deleting post: ", error);
        });
}

// Initial data retrieval
retrieveAndDisplayData();

function logoutUser() {
    firebase.auth().signOut().then(() => {
        alert("Logout successful!");
        window.location.href = "index.html";
    }).catch((error) => {
        alert("Logout failed: " + error.message);
    });
}

document.getElementById("logoutButton").addEventListener("click", function () {
    logoutUser();
});

function preventBack() {
    history.pushState(null, document.title, location.href);
    window.addEventListener('popstate', function () {
        history.pushState(null, document.title, location.href);
    });
}

window.onload = function () {
    preventBack();
};

document.getElementById("images").addEventListener("change", getImageData);
document.getElementById("images1").addEventListener("change", getImageData1);
