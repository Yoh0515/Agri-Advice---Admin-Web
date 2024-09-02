const fbConfig = {
    apiKey: "AIzaSyAxiXl5E5pDxFkgJFLo59relkrRkBdRv_U",
    authDomain: "final-database-9493d.firebaseapp.com",
    databaseURL: "https://final-database-9493d-default-rtdb.firebaseio.com",
    projectId: "final-database-9493d",
    storageBucket: "final-database-9493d.appspot.com",
    messagingSenderId: "798360016853",
    appId: "1:798360016853:web:b39e41d841cbc3ba4acf5c"
};

const isLoggedIn = sessionStorage.getItem("isLoggedIn");
if (!isLoggedIn) {
    window.location.href = "index.html";
}

firebase.initializeApp(fbConfig);

const firestore = firebase.firestore();
const database = firebase.database();
const storage = firebase.storage();

document.addEventListener('DOMContentLoaded', () => {
    const addPlantBtn = document.getElementById('addPlantBtn');
    const uploadModal = document.getElementById('uploadModal');
    const closeModalButton = document.querySelector('#uploadModal #closeModalButton');
    const plantModal = document.getElementById('plantModal');
    const closePlantModalButton = document.querySelector('#plantModal #closePlantModalButton');
    const updatePlantModal = document.getElementById('updatePlantModal');
    const closeUpdatePlantModalButton = document.querySelector('#updatePlantModal #closeUpdatePlantModalButton');

    addPlantBtn.addEventListener('click', () => {
        uploadModal.classList.remove('hidden');
    });

    closeModalButton.addEventListener('click', () => {
        uploadModal.classList.add('hidden');
    });

    closePlantModalButton.addEventListener('click', () => {
        plantModal.classList.add('hidden');
    });

    closeUpdatePlantModalButton.addEventListener('click', () => {
        updatePlantModal.classList.add('hidden');
    });

    document.getElementById('pdf-file').addEventListener('change', function (event) {
        const file = event.target.files[0];
        const pdfFrame = document.getElementById('pdf-frame');
        const pdfPreview = document.getElementById('pdf-preview');

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                pdfFrame.src = e.target.result;
                pdfPreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('thumbnail-file').addEventListener('change', function (event) {
        const file = event.target.files[0];
        const thumbnailImg = document.getElementById('thumbnail-img');
        const thumbnailPreview = document.getElementById('thumbnail-preview');

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                thumbnailImg.src = e.target.result;
                thumbnailPreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('pest-disease-file').addEventListener('change', function (event) {
        const files = event.target.files;
        const pestDiseasePreview = document.getElementById('pest-disease-preview');
        const pestDiseaseImages = document.getElementById('pest-disease-images');
        const pestDiseaseTitles = document.getElementById('pest-disease-titles');
        const pestDiseaseTitlesInputs = document.getElementById('pest-disease-titles-inputs');
    
        pestDiseaseImages.innerHTML = '';
        pestDiseaseTitlesInputs.innerHTML = '';
    
        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'w-24 h-24 object-cover rounded';
                pestDiseaseImages.appendChild(img);
    
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'form-control w-full p-2 border rounded';
                input.placeholder = `Title for image ${index + 1}`;
                pestDiseaseTitlesInputs.appendChild(input);
            };
            reader.readAsDataURL(file);
        });
    
        if (files.length > 0) {
            pestDiseasePreview.classList.remove('hidden');
            pestDiseaseTitles.classList.remove('hidden');
        }
    });

    document.getElementById('update-pest-disease-file').addEventListener('change', function (event) {
        const files = event.target.files;
        const pestDiseasePreview = document.getElementById('update-pest-disease-preview');
        const pestDiseaseImages = document.getElementById('update-pest-disease-images');

        pestDiseaseImages.innerHTML = '';

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'w-24 h-24 object-cover rounded';
                pestDiseaseImages.appendChild(img);
            };
            reader.readAsDataURL(file);
        });

        if (files.length > 0) {
            pestDiseasePreview.classList.remove('hidden');
        }
    });

    document.getElementById('update-pdf-file').addEventListener('change', function (event) {
        const file = event.target.files[0];
        const updatePdfFrame = document.getElementById('update-pdf-frame');
        const updatePdfPreview = document.getElementById('update-pdf-preview');

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                updatePdfFrame.src = e.target.result;
                updatePdfPreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('update-thumbnail-file').addEventListener('change', function (event) {
        const file = event.target.files[0];
        const updateThumbnailImg = document.getElementById('update-thumbnail-img');
        const updateThumbnailPreview = document.getElementById('update-thumbnail-preview');

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                updateThumbnailImg.src = e.target.result;
                updateThumbnailPreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('update-pest-disease-file').addEventListener('change', function (event) {
        const files = event.target.files;
        const updatePestDiseasePreview = document.getElementById('update-pest-disease-preview');
        const updatePestDiseaseImages = document.getElementById('update-pest-disease-images');
        const updatePestDiseaseTitles = document.getElementById('update-pest-disease-titles');
        const updatePestDiseaseTitlesInputs = document.getElementById('update-pest-disease-titles-inputs');
    
        updatePestDiseaseImages.innerHTML = '';
        updatePestDiseaseTitlesInputs.innerHTML = '';
    
        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'w-24 h-24 object-cover rounded';
                updatePestDiseaseImages.appendChild(img);
    
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'form-control w-full p-2 border rounded';
                input.placeholder = `Title for image ${index + 1}`;
                updatePestDiseaseTitlesInputs.appendChild(input);
            };
            reader.readAsDataURL(file);
        });
    
        if (files.length > 0) {
            updatePestDiseasePreview.classList.remove('hidden');
            updatePestDiseaseTitles.classList.remove('hidden');
        }
    });
});

// Add Plant
document.getElementById('btnUpload').addEventListener('click', function (event) {
    event.preventDefault();

    if (!checkNewPlantFields()) {
        Swal.fire({
            title: 'Incomplete Details',
            text: 'Fill up all details to add plant',
            icon: 'info',
            confirmButtonText: 'OK'
        });

        resetModal();
        return;
    }

    AddPlant();
    resetModal();
});

// Update Plant
document.getElementById('btnUpdatePlant').addEventListener('click', function (event) {
    event.preventDefault();

    const hiddenPlantId = document.getElementById('hiddenPlantId').value;

    if (!checkUpdateFields()) {
        Swal.fire({
            title: 'No Title',
            text: 'Fill up the Title',
            icon: 'info',
            confirmButtonText: 'OK'
        });

        resetModal();
        return;
    }

    updatePlant(hiddenPlantId);
    resetModal();
});

function checkNewPlantFields() {
    var Title = document.getElementById('pdf-title');
    var pdfFileInput = document.getElementById("pdf-file");
    var thumbnailFileInput = document.getElementById("thumbnail-file");

    if (Title.value.length > 0 && pdfFileInput.files.length > 0 && thumbnailFileInput.files.length > 0) {
        return true;
    }
    return false;
}

function checkUpdateFields() {
    var Title = document.getElementById('update-plant-title');

    if (Title.value.length > 0) {
        return true;
    }
    return false;
}

async function AddPlant() {
    try {
        const Title = document.getElementById('pdf-title').value;
        const Category = document.getElementById('category-select').value;
        const pdfFileInput = document.getElementById("pdf-file");
        const thumbnailFileInput = document.getElementById("thumbnail-file");
        const plantDescription = document.getElementById("plantDescription").value;
        const lugarNaPagtataniman = document.getElementById("lugarNaPagtataniman").value;
        const paglilipatNgBinhi = document.getElementById("paglilipatNgBinhi").value;
        const lupangTaniman = document.getElementById("lupangTaniman").value;
        const paglilipatTanim = document.getElementById("paglilipatTanim").value;
        const pangangalaga = document.getElementById("pangangalaga").value;
        const sakitAtPeste = document.getElementById("sakitAtPeste").value;
        const pagaani = document.getElementById("pagaani").value;
        const pestDiseaseFileInput = document.getElementById("pest-disease-file");
        const pestDiseaseTitlesInputs = document.getElementById("pest-disease-titles-inputs").querySelectorAll('input');

        const pdfFileName = pdfFileInput.files[0].name;

        var uploadPromises = [];

        // Upload thumbnail and PDF files
        uploadPromises.push(uploadPlantFile(thumbnailFileInput.files[0]));
        uploadPromises.push(uploadPlantFile(pdfFileInput.files[0]));

        // Prepare pest and disease data
        const pestDiseaseData = Array.from(pestDiseaseFileInput.files).map((file, index) => ({
            file,
            title: pestDiseaseTitlesInputs[index].value
        }));

        // Upload pest and disease files
        uploadPromises.push(...pestDiseaseData.map(data => uploadPlantFile(data.file)));

        var fileURLs = await Promise.all(uploadPromises);

        var plantData = {
            iconUrl: fileURLs[0],
            name: pdfFileName,
            category: Category,
            description: plantDescription,
            pdfUrl: fileURLs[1],
            plantTitle: Title,
            uploadedAt: Date.now(),
            lugarNaPagtataniman: lugarNaPagtataniman,
            paglilipatNgBinhi: paglilipatNgBinhi,
            lupangTaniman: lupangTaniman,
            paglilipatTanim: paglilipatTanim,
            pangangalaga: pangangalaga,
            sakitAtPeste: sakitAtPeste,
            pagaani: pagaani,
            pestDiseaseUrls: fileURLs.slice(2),
            pestDiseaseTitles: pestDiseaseData.map(data => data.title),
        };

        firestore.collection("Plant Pdfs").add(plantData)
            .then((docRef) => {
                Swal.fire({
                    title: 'New Plant Added',
                    text: 'Successfully added new plant.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = window.location.href;
                });
            })
            .catch((error) => {
                Swal.fire({
                    title: 'Error adding document',
                    text: error,
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
            });

    } catch (error) {
        Swal.fire({
            title: 'Error adding document',
            text: error,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

function uploadPlantFile(file) {
    return new Promise(function (resolve, reject) {
        var storageRef = storage.ref('Plant Pdfs/' + file.name);
        var uploadTask = storageRef.put(file);

        uploadTask.on('state_changed',
            function (snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            function (error) {
                reject(error);
            },
            function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    resolve(downloadURL);
                });
            }
        );
    });
}

async function updatePlant(hiddenPlantId) {
    const loader = document.getElementById('loader');
    const toastContainer = document.getElementById('toast-container');

    try {
        loader.classList.remove('hidden');

        const UpdateTitle = document.getElementById('update-plant-title').value;
        const UpdateCategory = document.getElementById('category-select-update').value;
        const UpdatepdfFileInput = document.getElementById("update-pdf-file");
        const UpdatethumbnailFileInput = document.getElementById("update-thumbnail-file");
        const updateLugarNaPagtataniman = document.getElementById("update-lugarNaPagtataniman").value;
        const updatePlantDescription = document.getElementById("update-plantDescription").value;
        const updatePaglilipatNgBinhi = document.getElementById("update-paglilipatNgBinhi").value;
        const updateLupangTaniman = document.getElementById("update-lupangTaniman").value;
        const updatePaglilipatTanim = document.getElementById("update-paglilipatTanim").value;
        const updatePangangalaga = document.getElementById("update-pangangalaga").value;
        const updateSakitAtPeste = document.getElementById("update-sakitAtPeste").value;
        const updatePagaani = document.getElementById("update-pagaani").value;
        const updatePestDiseaseFileInput = document.getElementById("update-pest-disease-file");
        const updatePestDiseaseTitlesInputs = document.getElementById('update-pest-disease-titles-inputs').querySelectorAll('input');

        var plantData = {
            plantTitle: UpdateTitle,
            category: UpdateCategory,
            description: updatePlantDescription,
            lugarNaPagtataniman: updateLugarNaPagtataniman,
            paglilipatNgBinhi: updatePaglilipatNgBinhi,
            lupangTaniman: updateLupangTaniman,
            paglilipatTanim: updatePaglilipatTanim,
            pangangalaga: updatePangangalaga,
            sakitAtPeste: updateSakitAtPeste,
            pagaani: updatePagaani,
            updatedAt: Date.now()
        };

        var uploadPromises = [];

        if (UpdatepdfFileInput.files.length > 0) {
            uploadPromises.push(uploadPlantFile(UpdatepdfFileInput.files[0]));
        }

        if (UpdatethumbnailFileInput.files.length > 0) {
            uploadPromises.push(uploadPlantFile(UpdatethumbnailFileInput.files[0]));
        }

        const pestDiseaseData = Array.from(updatePestDiseaseFileInput.files).map((file, index) => ({
            file,
            title: updatePestDiseaseTitlesInputs[index].value
        }));

        if (pestDiseaseData.length > 0) {
            uploadPromises.push(...pestDiseaseData.map(data => uploadPlantFile(data.file)));
        }

        if (uploadPromises.length > 0) {
            const fileURLs = await Promise.all(uploadPromises);

            let index = 0;
            if (UpdatepdfFileInput.files.length > 0) {
                plantData.pdfUrl = fileURLs[index++];
            }
            if (UpdatethumbnailFileInput.files.length > 0) {
                plantData.iconUrl = fileURLs[index++];
            }
            if (pestDiseaseData.length > 0) {
                plantData.pestDiseaseUrls = fileURLs.slice(index);
                plantData.pestDiseaseTitles = pestDiseaseData.map(data => data.title);
            } else {
                plantData.pestDiseaseTitles = Array.from(updatePestDiseaseTitlesInputs).map(input => input.value);
            }
        } else {
            plantData.pestDiseaseTitles = Array.from(updatePestDiseaseTitlesInputs).map(input => input.value);
        }

        await firestore.collection("Plant Pdfs").doc(hiddenPlantId).update(plantData);

        showToast('Plant Updated Successfully', 'success');
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
    } finally {
        loader.classList.add('hidden');
    }
}


function populateUpdateModal(plantId) {
    firestore.collection("Plant Pdfs").doc(plantId).get().then((doc) => {
        if (doc.exists) {
            const plantData = doc.data();

            document.getElementById('hiddenPlantId').value = plantId;
            document.getElementById('update-plant-title').value = plantData.plantTitle;
            document.getElementById('update-plantDescription').value = plantData.description;
            document.getElementById('update-lugarNaPagtataniman').value = plantData.lugarNaPagtataniman;
            document.getElementById('update-paglilipatNgBinhi').value = plantData.paglilipatNgBinhi;
            document.getElementById('update-lupangTaniman').value = plantData.lupangTaniman;
            document.getElementById('update-paglilipatTanim').value = plantData.paglilipatTanim;
            document.getElementById('update-pangangalaga').value = plantData.pangangalaga;
            document.getElementById('update-sakitAtPeste').value = plantData.sakitAtPeste;
            document.getElementById('update-pagaani').value = plantData.pagaani;
            document.getElementById('category-select-update').value = plantData.category;
            document.getElementById('update-pdf-frame').src = plantData.pdfUrl;
            document.getElementById('update-thumbnail-img').src = plantData.iconUrl;

            const updatePestDiseaseImages = document.getElementById('update-pest-disease-images');
            const updatePestDiseaseTitlesInputs = document.getElementById('update-pest-disease-titles-inputs');
            updatePestDiseaseImages.innerHTML = '';
            updatePestDiseaseTitlesInputs.innerHTML = '';

            plantData.pestDiseaseUrls.forEach((url, index) => {
                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'flex flex-col items-center';

                const img = document.createElement('img');
                img.src = url;
                img.className = 'w-24 h-24 object-cover rounded-full border border-gray-300 p-1';

                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'form-control w-full p-2 border rounded';
                input.value = plantData.pestDiseaseTitles[index];

                imgWrapper.appendChild(img);
                updatePestDiseaseImages.appendChild(imgWrapper);
                updatePestDiseaseTitlesInputs.appendChild(input);
            });

            if (plantData.pestDiseaseUrls.length > 0) {
                document.getElementById('update-pest-disease-preview').classList.remove('hidden');
                document.getElementById('update-pest-disease-titles').classList.remove('hidden');
            }

            document.getElementById('updatePlantModal').classList.remove('hidden');
        }
    });
}

function showToast(message, type) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast');

    if (type === 'success') {
        toast.style.backgroundColor = '#4caf50';
    } else if (type === 'error') {
        toast.style.backgroundColor = '#f44336';
    }

    toast.innerText = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}


function uploadPlantFile(file) {
    return new Promise(function (resolve, reject) {
        var storageRef = storage.ref('Plant Pdfs/' + file.name);
        var uploadTask = storageRef.put(file);

        uploadTask.on('state_changed',
            function (snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            function (error) {
                reject(error);
            },
            function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    resolve(downloadURL);
                });
            }
        );
    });
}

function resetModal() {
    const Title = document.getElementById('pdf-title');
    const pdfFileInput = document.getElementById("pdf-file");
    const thumbnailFileInput = document.getElementById("thumbnail-file");

    Title.value = "";
    pdfFileInput.value = "";
    thumbnailFileInput.value = "";

    Title.focus();
}

function displayPlants() {
    firestore.collection("Plant Pdfs").get().then((querySnapshot) => {
        const plantsContainer = document.getElementById('plants-container');
        plantsContainer.innerHTML = ''; // Clear previous content

        querySnapshot.forEach((plant) => {
            const plantData = plant.data();

            const newPlantDiv = document.createElement('div');
            newPlantDiv.className = 'plantDiv';
            newPlantDiv.style = "margin: 10px";

            newPlantDiv.innerHTML = `
                <div class="card plant-card bg-white shadow-md rounded-lg overflow-hidden">
                    <img src="${plantData.iconUrl}" class="w-full h-32 sm:h-48 object-cover" alt="Plant Icon">
                    <div class="p-4">
                        <h5 class="font-bold text-lg">${plantData.plantTitle}</h5>
                        <h3 class=" text-lg">${plantData.category}</h3>
                        <div class="flex justify-between mt-2">
                            <button class="edit-btn bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
                                Edit
                            </button>
                            <button class="delete-btn bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;


            newPlantDiv.querySelector('.plant-card').addEventListener('click', function () {
                document.getElementById('plantModalLabel').innerText = plantData.plantTitle;
                document.getElementById('view-plantDescription').innerText = plantData.description;
                document.getElementById('view-lugarNaPagtataniman').innerText = plantData.lugarNaPagtataniman;
                document.getElementById('view-paglilipatNgBinhi').innerText = plantData.paglilipatNgBinhi;
                document.getElementById('view-lupangTaniman').innerText = plantData.lupangTaniman;
                document.getElementById('view-paglilipatTanim').innerText = plantData.paglilipatTanim;
                document.getElementById('view-pangangalaga').innerText = plantData.pangangalaga;
                document.getElementById('view-sakitAtPeste').innerText = plantData.sakitAtPeste;
                document.getElementById('view-pagaani').innerText = plantData.pagaani;
                document.getElementById('view-category').innerText = plantData.category;
                
                const pestDiseaseImages = document.getElementById('view-pest-disease-images');
                pestDiseaseImages.innerHTML = '';
                plantData.pestDiseaseUrls.forEach((url, index) => {
                    const imgWrapper = document.createElement('div');
                    imgWrapper.className = 'flex flex-col items-center';

                    const img = document.createElement('img');
                    img.src = url;
                    img.className = 'w-24 h-24 object-cover rounded-full border border-gray-300 p-1';

                    const title = document.createElement('p');
                    title.className = 'text-xs mt-2';
                    title.innerText = plantData.pestDiseaseTitles[index];

                    imgWrapper.appendChild(img);
                    imgWrapper.appendChild(title);
                    pestDiseaseImages.appendChild(imgWrapper);
                });

                document.getElementById('view-pdfContent').src = plantData.pdfUrl;
                plantModal.classList.remove('hidden');
            });

            newPlantDiv.querySelector('.edit-btn').addEventListener('click', function (event) {
                event.stopPropagation();
                populateUpdateModal(plant.id);
            });

            newPlantDiv.querySelector('.delete-btn').addEventListener('click', function (event) {
                event.stopPropagation();
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You are about to delete the plant. This action cannot be undone.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        firestore.collection("Plant Pdfs").doc(plant.id).delete().then(() => {
                            Swal.fire(
                                'Plant successfully deleted!!',
                                `Plant ${plantData.plantTitle} has been deleted.`,
                                'success'
                            );
                            displayPlants();
                        }).catch((error) => {
                            Swal.fire({
                                title: 'Error removing document',
                                text: error.message,
                                icon: 'error',
                                confirmButtonText: 'OK'
                            });
                        });
                    }
                });
            });

            plantsContainer.appendChild(newPlantDiv);
        });
    });
}

displayPlants();

function logoutUser() {
    firebase.auth().signOut().then(() => {
        Swal.fire({
            title: 'Logout successful!',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            sessionStorage.setItem("isLoggedIn", "false");
            window.location.href = "index.html";
        });
    }).catch((error) => {
        Swal.fire({
            title: 'Logout failed',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
}
