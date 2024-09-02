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
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    // If user is not logged in, redirect to login page
    if (isLoggedIn == "false") {
        console.log(isLoggedIn);
        window.location.href = "index.html";
        urlred = "index.html";
    }

    const addPlantBtn = document.getElementById('addPlantBtn');
    const addDisBtn = document.getElementById('addDisBtn');
    const uploadModal = document.getElementById('uploadModal');
    const uploadModal2 = document.getElementById('uploadModal2');
    const closeModalButton = document.querySelector('#uploadModal #closeModalButton');
    const closeModalButton2 = document.querySelector('#uploadModal #closeModalButton2');
    const closeModalButton3 = document.querySelector('#uploadModal2 #closeModalButton3');
    const closeModalButton4 = document.querySelector('#uploadModal2 #closeModalButton4');
    const plantModal = document.getElementById('plantModal');
    const plantModal2 = document.getElementById('plantModal2');
    const closePlantModalButton = document.querySelector('#plantModal #closePlantModalButton');
    const updatePlantModal = document.getElementById('updatePlantModal');
    const updatePlantModal2 = document.getElementById('updatePlantModal2');
    const closeUpdatePlantModalButton = document.querySelector('#updatePlantModal #closeUpdatePlantModalButton');
    const closeUpdatePlantModalButton2 = document.querySelector('#updatePlantModal2 #closeUpdatePlantModalButton2');

    addPlantBtn.addEventListener('click', () => {
        uploadModal.classList.remove('hidden');
    });

    addDisBtn.addEventListener('click', () => {
        uploadModal2.classList.remove('hidden');
    });

    closeModalButton.addEventListener('click', () => {
        uploadModal.classList.add('hidden');
    });

    closeModalButton3.addEventListener('click', () => {
        uploadModal2.classList.add('hidden');
    });

    closeModalButton4.addEventListener('click', () => {
        uploadModal2.classList.add('hidden');
    });

    closePlantModalButton.addEventListener('click', () => {
        plantModal.classList.add('hidden');
    });

    closePlantModalButton2.addEventListener('click', () => {
        plantModal2.classList.add('hidden');
    });

    closeUpdatePlantModalButton.addEventListener('click', () => {
        updatePlantModal.classList.add('hidden');
    });

    closeUpdatePlantModalButton2.addEventListener('click', () => {
        updatePlantModal2.classList.add('hidden');
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


});


document.getElementById('pdf-file2').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const pdfFrame = document.getElementById('pdf-frame2');
    const pdfPreview = document.getElementById('pdf-preview2');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            pdfFrame.src = e.target.result;
            pdfPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('thumbnail-file2').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const thumbnailImg = document.getElementById('thumbnail-img2');
    const thumbnailPreview = document.getElementById('thumbnail-preview2');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            thumbnailImg.src = e.target.result;
            thumbnailPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('update-pdf-file2').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const updatePdfFrame = document.getElementById('update-pdf-frame2');
    const updatePdfPreview = document.getElementById('update-pdf-preview2');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            updatePdfFrame.src = e.target.result;
            updatePdfPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('update-thumbnail-file2').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const updateThumbnailImg = document.getElementById('update-thumbnail-img2');
    const updateThumbnailPreview = document.getElementById('update-thumbnail-preview2');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            updateThumbnailImg.src = e.target.result;
            updateThumbnailPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('add-pest-file').addEventListener('change', function (event) {
    const files = event.target.files;
    const pestDiseasePreview = document.getElementById('pest-preview');
    const pestDiseaseImages = document.getElementById('pest-images');
    const pestDiseaseTitles = document.getElementById('add-pest-titles');

    pestDiseaseImages.innerHTML = '';
    pestDiseaseTitles.innerHTML = '';

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
            pestDiseaseTitles.appendChild(input);
        };
        reader.readAsDataURL(file);
    });

    if (files.length > 0) {
        pestDiseasePreview.classList.remove('hidden');
    }
});

document.getElementById('add-disease-file').addEventListener('change', function (event) {
    const files = event.target.files;
    const diseasePreview = document.getElementById('disease-preview');
    const diseaseImages = document.getElementById('disease-images');
    const diseaseTitles = document.getElementById('add-disease-titles');

    diseaseImages.innerHTML = '';
    diseaseTitles.innerHTML = '';

    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'w-24 h-24 object-cover rounded';
            diseaseImages.appendChild(img);

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control w-full p-2 border rounded';
            input.placeholder = `Title for image ${index + 1}`;
            diseaseTitles.appendChild(input);
        };
        reader.readAsDataURL(file);
    });

    if (files.length > 0) {
        diseasePreview.classList.remove('hidden');
    }
});


document.getElementById('update-pest-file').addEventListener('change', function (event) {
    const files = event.target.files;
    const pestDiseasePreview = document.getElementById('update-pest-preview');
    const pestDiseaseImages = document.getElementById('update-pest-images');
    const pestDiseaseTitles = document.getElementById('update-pest-titles');

    pestDiseaseImages.innerHTML = '';
    pestDiseaseTitles.innerHTML = '';

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
            pestDiseaseTitles.appendChild(input);
        };
        reader.readAsDataURL(file);
    });

    if (files.length > 0) {
        pestDiseasePreview.classList.remove('hidden');
        document.getElementById('update-pest-titles-preview').classList.remove('hidden');
    }
});


document.getElementById('update-disease-file').addEventListener('change', function (event) {
    const files = event.target.files;
    const diseasePreview = document.getElementById('update-disease-preview');
    const diseaseImages = document.getElementById('update-disease-images');
    const diseaseTitles = document.getElementById('update-disease-titles');

    diseaseImages.innerHTML = '';
    diseaseTitles.innerHTML = '';

    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'w-24 h-24 object-cover rounded';
            diseaseImages.appendChild(img);

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control w-full p-2 border rounded';
            input.placeholder = `Title for image ${index + 1}`;
            diseaseTitles.appendChild(input);
        };
        reader.readAsDataURL(file);
    });

    if (files.length > 0) {
        diseasePreview.classList.remove('hidden');
        document.getElementById('update-disease-titles-preview').classList.remove('hidden');
    }
});

// Add Plant
document.getElementById('btnUpload').addEventListener('click', function (event) {
    event.preventDefault();

    if (!checkNewPlantFields()) {
        Swal.fire({
            title: 'Incomplete Details',
            text: 'Fill up all details to add pest',
            icon: 'info',
            confirmButtonText: 'OK'
        });

        resetModal();
        return;
    }

    AddPlant();
    resetModal();
});

// Add Disease
document.getElementById('btnUpload2').addEventListener('click', function (event) {
    event.preventDefault();

    if (!checkNewPlantFields2()) {
        Swal.fire({
            title: 'Incomplete Details',
            text: 'Fill up all details to add pest',
            icon: 'info',
            confirmButtonText: 'OK'
        });

        resetModal2();
        return;
    }

    AddDisease();
    resetModal2();
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

// Update Disease
document.getElementById('btnUpdatePlant2').addEventListener('click', function (event) {
    event.preventDefault();

    const hiddenPlantId = document.getElementById('hiddenPlantId2').value;

    if (!checkUpdateFields2()) {
        Swal.fire({
            title: 'No Title',
            text: 'Fill up the Title',
            icon: 'info',
            confirmButtonText: 'OK'
        });

        resetModal();
        return;
    }

    updatePlant2(hiddenPlantId);
    resetModal2();
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

function checkNewPlantFields2() {
    var Title = document.getElementById('pdf-title2');
    var pdfFileInput = document.getElementById("pdf-file2");
    var thumbnailFileInput = document.getElementById("thumbnail-file2");

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

function checkUpdateFields2() {
    var Title = document.getElementById('update-plant-title2');

    if (Title.value.length > 0) {
        return true;
    }
    return false;
}

async function AddPlant() {
    try {
        const Title = document.getElementById('pdf-title').value;
        const scientificName = document.getElementById('scientificName').value;
        const insectCharacteristics = document.getElementById('insectCharacteristics').value;
        const damageSymptoms = document.getElementById('damageSymptoms').value;
        const controlMeasures = document.getElementById('controlMeasures').value;
        const pdfFileInput = document.getElementById("pdf-file");
        const thumbnailFileInput = document.getElementById("thumbnail-file");
        const addPestImages = document.getElementById("add-pest-file");
        const addPestTitles = document.getElementById('add-pest-titles').querySelectorAll('input');

        const pdfFileName = pdfFileInput.files[0].name;

        var uploadPromises = [];

        uploadPromises.push(uploadPlantFile(thumbnailFileInput.files[0]));
        uploadPromises.push(uploadPlantFile(pdfFileInput.files[0]));

        const pestImages = [];
        const pestImageTitles = [];

        if (addPestImages.files.length > 0) {
            Array.from(addPestImages.files).forEach((file, index) => {
                uploadPromises.push(uploadPlantFile(file));
                pestImageTitles.push(addPestTitles[index].value);
            });
        }

        const fileURLs = await Promise.all(uploadPromises);

        var plantData = {
            iconUrl: fileURLs[0],
            scientificName: scientificName,
            insectCharacteristics: insectCharacteristics,
            damageSymptoms: damageSymptoms,
            controlMeasures: controlMeasures,
            name: pdfFileName,
            pdfUrl: fileURLs[1],
            plantTitle: Title,
            uploadedAt: Date.now(),
            pestImages: fileURLs.slice(2),
            pestImageTitles: pestImageTitles
        };

        firestore.collection("Pest Pdfs").add(plantData)
            .then((docRef) => {
                Swal.fire({
                    title: 'New Pest Added',
                    text: 'Successfully added new pest.',
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


async function AddDisease() {
    try {
        const Title = document.getElementById('pdf-title2').value;
        const diseaseDescription = document.getElementById('diseaseDescription').value;
        const symptoms = document.getElementById('symptoms').value;
        const diseaseDevelopment = document.getElementById('diseaseDevelopment').value;
        const culturalControl = document.getElementById('culturalControl').value;
        const chemicalControl = document.getElementById('chemicalControl').value;
        const biologicalControl = document.getElementById('biologicalControl').value;
        const pdfFileInput = document.getElementById("pdf-file2");
        const thumbnailFileInput = document.getElementById("thumbnail-file2");
        const addDiseaseImages = document.getElementById("add-disease-file");
        const addDiseaseTitles = document.getElementById('add-disease-titles').querySelectorAll('input');

        const pdfFileName = pdfFileInput.files[0].name;

        var uploadPromises = [];

        uploadPromises.push(uploadPlantFile(thumbnailFileInput.files[0]));
        uploadPromises.push(uploadPlantFile(pdfFileInput.files[0]));

        const diseaseImages = [];
        const diseaseImageTitles = [];

        if (addDiseaseImages.files.length > 0) {
            Array.from(addDiseaseImages.files).forEach((file, index) => {
                uploadPromises.push(uploadPlantFile(file));
                diseaseImageTitles.push(addDiseaseTitles[index].value);
            });
        }

        const fileURLs = await Promise.all(uploadPromises);

        var plantData = {
            iconUrl: fileURLs[0],
            diseaseDescription: diseaseDescription,
            symptoms: symptoms,
            diseaseDevelopment: diseaseDevelopment,
            culturalControl: culturalControl,
            chemicalControl: chemicalControl,
            biologicalControl: biologicalControl,
            name: pdfFileName,
            pdfUrl: fileURLs[1],
            plantTitle: Title,
            uploadedAt: Date.now(),
            diseaseImages: fileURLs.slice(2),
            diseaseImageTitles: diseaseImageTitles
        };

        firestore.collection("Disease Pdfs").add(plantData)
            .then((docRef) => {
                Swal.fire({
                    title: 'New Disease Added',
                    text: 'Successfully added new disease.',
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


async function updatePlant2(hiddenPlantId2) {
    try {
        const UpdateTitle = document.getElementById('update-plant-title2').value;
        const updateDiseaseDescription = document.getElementById('update-diseaseDescription').value;
        const updateSymptoms = document.getElementById('update-symptoms').value;
        const updateDiseaseDevelopment = document.getElementById('update-diseaseDevelopment').value;
        const updateCulturalControl = document.getElementById('update-culturalControl').value;
        const updateChemicalControl = document.getElementById('update-chemicalControl').value;
        const updateBiologicalControl = document.getElementById('update-biologicalControl').value;
        const UpdatepdfFileInput = document.getElementById("update-pdf-file2");
        const UpdatethumbnailFileInput = document.getElementById("update-thumbnail-file2");
        const updateDiseaseImages = document.getElementById("update-disease-file");
        const updateDiseaseTitles = document.getElementById('update-disease-titles').querySelectorAll('input');

        var plantData = {
            plantTitle: UpdateTitle,
            diseaseDescription: updateDiseaseDescription,
            symptoms: updateSymptoms,
            diseaseDevelopment: updateDiseaseDevelopment,
            culturalControl: updateCulturalControl,
            chemicalControl: updateChemicalControl,
            biologicalControl: updateBiologicalControl,
            updatedAt: Date.now()
        };

        if (UpdatepdfFileInput.files.length > 0) {
            pdfUrl = await uploadPlantFile(UpdatepdfFileInput.files[0]);
            plantData.pdfUrl = pdfUrl;
        }

        if (UpdatethumbnailFileInput.files.length > 0) {
            iconUrl = await uploadPlantFile(UpdatethumbnailFileInput.files[0]);
            plantData.iconUrl = iconUrl;
        }

        if (updateDiseaseImages.files.length > 0) {
            const diseaseImages = [];
            const diseaseImageTitles = [];
            const files = Array.from(updateDiseaseImages.files);
            for (let index = 0; index < files.length; index++) {
                const file = files[index];
                const imageUrl = await uploadPlantFile(file);
                diseaseImages.push(imageUrl);
                diseaseImageTitles.push(updateDiseaseTitles[index].value);
            }
            plantData.diseaseImages = diseaseImages;
            plantData.diseaseImageTitles = diseaseImageTitles;
        }

        await firestore.collection("Disease Pdfs").doc(hiddenPlantId2).update(plantData);

        Swal.fire({
            title: 'Disease Updated',
            text: 'Successfully updated disease.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.href = window.location.href;
        });

    } catch (error) {
        Swal.fire({
            title: 'Error updating document',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}



async function updatePlant2(hiddenPlantId2) {
    try {
        const UpdateTitle = document.getElementById('update-plant-title2').value;
        const updateDiseaseDescription = document.getElementById('update-diseaseDescription').value;
        const updateSymptoms = document.getElementById('update-symptoms').value;
        const updateDiseaseDevelopment = document.getElementById('update-diseaseDevelopment').value;
        const updateCulturalControl = document.getElementById('update-culturalControl').value;
        const updateChemicalControl = document.getElementById('update-chemicalControl').value;
        const updateBiologicalControl = document.getElementById('update-biologicalControl').value;
        const UpdatepdfFileInput = document.getElementById("update-pdf-file2");
        const UpdatethumbnailFileInput = document.getElementById("update-thumbnail-file2");
        const updateDiseaseImages = document.getElementById("update-disease-file");

        var plantData = {
            plantTitle: UpdateTitle,
            diseaseDescription: updateDiseaseDescription,
            symptoms: updateSymptoms,
            diseaseDevelopment: updateDiseaseDevelopment,
            culturalControl: updateCulturalControl,
            chemicalControl: updateChemicalControl,
            biologicalControl: updateBiologicalControl,
            updatedAt: Date.now()
        };

        if (UpdatepdfFileInput.files.length > 0) {
            pdfUrl = await uploadPlantFile(UpdatepdfFileInput.files[0]);
            plantData.pdfUrl = pdfUrl;
        }

        if (UpdatethumbnailFileInput.files.length > 0) {
            iconUrl = await uploadPlantFile(UpdatethumbnailFileInput.files[0]);
            plantData.iconUrl = iconUrl;
        }

        if (updateDiseaseImages.files.length > 0) {
            const diseaseImages = [];
            const files = Array.from(updateDiseaseImages.files).slice(0, 2); // Limit to 2 images
            for (const file of files) {
                const imageUrl = await uploadPlantFile(file);
                diseaseImages.push(imageUrl);
            }
            plantData.diseaseImages = diseaseImages;
        }

        await firestore.collection("Disease Pdfs").doc(hiddenPlantId2).update(plantData);

        Swal.fire({
            title: 'Disease Updated',
            text: 'Successfully updated disease.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.href = window.location.href;
        });

    } catch (error) {
        Swal.fire({
            title: 'Error updating document',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

function uploadPlantFile(file) {
    return new Promise(function (resolve, reject) {
        var storageRef = storage.ref('Pest Pdfs/' + file.name);
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

function uploadPlantFile2(file) {
    return new Promise(function (resolve, reject) {
        var storageRef = storage.ref('Disease Pdfs/' + file.name);
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

function resetModal2() {
    const Title = document.getElementById('pdf-title2');
    const pdfFileInput = document.getElementById('pdf-file2');
    const thumbnailFileInput = document.getElementById('thumbnail-file2');

    Title.value = "";
    pdfFileInput.value = "";
    thumbnailFileInput.value = "";

    Title.focus();
}

let pestData = [];
let diseaseData = [];

function displayPlants() {
    firestore.collection("Pest Pdfs").get().then((querySnapshot) => {
        const plantsContainer = document.getElementById('plants-container');
        plantsContainer.innerHTML = ''; // Clear previous content
        pestData = []; // Clear previous data

        querySnapshot.forEach((plant) => {
            const plantData = plant.data();
            pestData.push({
                id: plant.id,
                ...plantData
            });

            const newPlantDiv = document.createElement('div');
            newPlantDiv.className = 'plantDiv';
            newPlantDiv.style = "margin: 10px";

            newPlantDiv.innerHTML = `
                <div class="card plant-card bg-white shadow-md rounded-lg overflow-hidden">
                    <img src="${plantData.iconUrl}" class="w-full h-32 sm:h-48 object-cover" alt="Plant Icon">
                    <div class="p-4">
                        <h5 class="font-bold text-lg plant-title">${plantData.plantTitle}</h5>
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
                document.getElementById('pestModalLabel').innerText = plantData.plantTitle;
                document.getElementById('view-scientificName').innerText = plantData.scientificName;
                document.getElementById('view-insectCharacteristics').innerText = plantData.insectCharacteristics;
                document.getElementById('view-damageSymptoms').innerText = plantData.damageSymptoms;
                document.getElementById('view-controlMeasures').innerText = plantData.controlMeasures;
                
                const pestImagesContainer = document.getElementById('view-pest-images');
                pestImagesContainer.innerHTML = '';
                plantData.pestImages.forEach((url, index) => {
                    const imgWrapper = document.createElement('div');
                    const img = document.createElement('img');
                    img.src = url;
                    img.className = 'w-24 h-24 object-cover rounded-full border border-gray-300 p-1';
                    imgWrapper.appendChild(img);

                    const title = document.createElement('p');
                    title.innerText = plantData.pestImageTitles[index];
                    imgWrapper.appendChild(title);

                    pestImagesContainer.appendChild(imgWrapper);
                });

                document.getElementById('view-pdfContent').src = plantData.pdfUrl;
                document.getElementById('pestModal').classList.remove('hidden');
            });

            document.getElementById('closePestModalButton').addEventListener('click', function () {
                document.getElementById('pestModal').classList.add('hidden');
            });

            document.getElementById('closeUpdatePlantModalButton').addEventListener('click', function () {
                document.getElementById('updatePlantModal').classList.add('hidden');
            });

            newPlantDiv.querySelector('.edit-btn').addEventListener('click', function (event) {
                event.stopPropagation();
                document.getElementById('hiddenPlantId').value = plant.id;
                document.getElementById('update-plant-title').value = plantData.plantTitle;
                document.getElementById('update-pdf-file').src = plantData.pdfUrl;
                document.getElementById('update-thumbnail-file').src = plantData.iconUrl;
                document.getElementById('update-scientificName').value = plantData.scientificName;
                document.getElementById('update-insectCharacteristics').value = plantData.insectCharacteristics;
                document.getElementById('update-damageSymptoms').value = plantData.damageSymptoms;
                document.getElementById('update-controlMeasures').value = plantData.controlMeasures;

                const updatePestTitlesContainer = document.getElementById('update-pest-titles');
                updatePestTitlesContainer.innerHTML = '';
                plantData.pestImageTitles.forEach(title => {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = title;
                    input.className = 'form-control w-full p-2 border rounded';
                    updatePestTitlesContainer.appendChild(input);
                });

                updatePlantModal.classList.remove('hidden');
            });

            newPlantDiv.querySelector('.delete-btn').addEventListener('click', function (event) {
                event.stopPropagation();
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You are about to delete the pest. This action cannot be undone.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        firestore.collection("Pest Pdfs").doc(plant.id).delete().then(() => {
                            Swal.fire(
                                'Pest successfully deleted!!',
                                `Pest ${plantData.plantTitle} has been deleted.`,
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

function displayPlants2() {
    firestore.collection("Disease Pdfs").get().then((querySnapshot) => {
        const plantsContainer = document.getElementById('plants-container2');
        plantsContainer.innerHTML = ''; // Clear previous content
        diseaseData = []; // Clear previous data

        querySnapshot.forEach((plant) => {
            const plantData = plant.data();
            diseaseData.push({
                id: plant.id,
                ...plantData
            });

            const newPlantDiv = document.createElement('div');
            newPlantDiv.className = 'plantDiv';
            newPlantDiv.style = "margin: 10px";

            newPlantDiv.innerHTML = `
                <div class="card plant-card2 bg-white shadow-md rounded-lg overflow-hidden">
                    <img src="${plantData.iconUrl}" class="w-full h-32 sm:h-48 object-cover" alt="Plant Icon">
                    <div class="p-4">
                        <h5 class="font-bold text-lg plant-title">${plantData.plantTitle}</h5>
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

            function populateDiseaseDetails(diseaseData) {
                document.getElementById('plantModalLabel2').innerText = diseaseData.plantTitle;
                document.getElementById('view-diseaseDescription').innerText = diseaseData.diseaseDescription;
                document.getElementById('view-symptoms').innerText = diseaseData.symptoms;
                document.getElementById('view-diseaseDevelopment').innerText = diseaseData.diseaseDevelopment;
                document.getElementById('view-culturalControl').innerText = diseaseData.culturalControl;
                document.getElementById('view-chemicalControl').innerText = diseaseData.chemicalControl;
                document.getElementById('view-biologicalControl').innerText = diseaseData.biologicalControl;
                
                const diseaseImagesContainer = document.getElementById('view-disease-images');
                diseaseImagesContainer.innerHTML = '';
                diseaseData.diseaseImages.forEach((url, index) => {
                    const imgWrapper = document.createElement('div');
                    const img = document.createElement('img');
                    img.src = url;
                    img.className = 'w-24 h-24 object-cover rounded-full border border-gray-300 p-1';
                    imgWrapper.appendChild(img);

                    const title = document.createElement('p');
                    title.innerText = diseaseData.diseaseImageTitles[index];
                    imgWrapper.appendChild(title);

                    diseaseImagesContainer.appendChild(imgWrapper);
                });

                document.getElementById('view-pdfContent2').src = diseaseData.pdfUrl;
                document.getElementById('plantModal2').classList.remove('hidden');
            }

            newPlantDiv.querySelector('.plant-card2').addEventListener('click', function () {
                populateDiseaseDetails(plantData);
            });

            document.getElementById('closePlantModalButton2').addEventListener('click', function () {
                document.getElementById('plantModal2').classList.add('hidden');
            });

            document.getElementById('closeUpdatePlantModalButton2').addEventListener('click', function () {
                document.getElementById('updatePlantModal2').classList.add('hidden');
            });

            newPlantDiv.querySelector('.edit-btn').addEventListener('click', function (event) {
                event.stopPropagation();
                document.getElementById('hiddenPlantId2').value = plant.id;
                document.getElementById('update-plant-title2').value = plantData.plantTitle;
                document.getElementById('update-pdf-file2').src = plantData.pdfUrl;
                document.getElementById('update-thumbnail-file2').src = plantData.iconUrl;
                document.getElementById('update-diseaseDescription').value = plantData.diseaseDescription;
                document.getElementById('update-symptoms').value = plantData.symptoms;
                document.getElementById('update-diseaseDevelopment').value = plantData.diseaseDevelopment;
                document.getElementById('update-culturalControl').value = plantData.culturalControl;
                document.getElementById('update-chemicalControl').value = plantData.chemicalControl;
                document.getElementById('update-biologicalControl').value = plantData.biologicalControl;

                const updateDiseaseTitlesContainer = document.getElementById('update-disease-titles');
                updateDiseaseTitlesContainer.innerHTML = '';
                plantData.diseaseImageTitles.forEach(title => {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = title;
                    input.className = 'form-control w-full p-2 border rounded';
                    updateDiseaseTitlesContainer.appendChild(input);
                });

                updatePlantModal2.classList.remove('hidden');
            });

            newPlantDiv.querySelector('.delete-btn').addEventListener('click', function (event) {
                event.stopPropagation();
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You are about to delete the disease. This action cannot be undone.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        firestore.collection("Disease Pdfs").doc(plant.id).delete().then(() => {
                            Swal.fire(
                                'Disease successfully deleted!!',
                                `Disease ${plantData.plantTitle} has been deleted.`,
                                'success'
                            );
                            displayPlants2();
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


document.getElementById('searchInputPest').addEventListener('input', function () {
    const searchValue = this.value.toLowerCase();
    const filteredPests = pestData.filter(pest => pest.plantTitle.toLowerCase().includes(searchValue));
    updatePlantsContainer(filteredPests, 'plants-container');
});

document.getElementById('searchInputDisease').addEventListener('input', function () {
    const searchValue = this.value.toLowerCase();
    const filteredDiseases = diseaseData.filter(disease => disease.plantTitle.toLowerCase().includes(searchValue));
    updatePlantsContainer(filteredDiseases, 'plants-container2');
});

function updatePlantsContainer(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous content

    data.forEach((plant) => {
        const newPlantDiv = document.createElement('div');
        newPlantDiv.className = 'plantDiv';
        newPlantDiv.style = "margin: 10px";

        newPlantDiv.innerHTML = `
            <div class="card plant-card bg-white shadow-md rounded-lg overflow-hidden">
                <img src="${plant.iconUrl}" class="w-full h-32 sm:h-48 object-cover" alt="Plant Icon">
                <div class="p-4">
                    <h5 class="font-bold text-lg plant-title">${plant.plantTitle}</h5>
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
            document.getElementById('plantModalLabel').innerText = plant.plantTitle;
            document.getElementById('pdfContent').src = plant.pdfUrl;
            document.getElementById(containerId === 'plants-container' ? 'plantModal' : 'plantModal2').classList.remove('hidden');
        });

        newPlantDiv.querySelector('.edit-btn').addEventListener('click', function (event) {
            event.stopPropagation();
            document.getElementById(containerId === 'plants-container' ? 'hiddenPlantId' : 'hiddenPlantId2').value = plant.id;
            document.getElementById(containerId === 'plants-container' ? 'update-plant-title' : 'update-plant-title2').value = plant.plantTitle;
            document.getElementById(containerId === 'plants-container' ? 'update-pdf-file' : 'update-pdf-file2').src = plant.pdfUrl;
            document.getElementById(containerId === 'plants-container' ? 'update-thumbnail-file' : 'update-thumbnail-file2').src = plant.iconUrl;
            document.getElementById(containerId === 'plants-container' ? 'updatePlantModal' : 'updatePlantModal2').classList.remove('hidden');
        });

        newPlantDiv.querySelector('.delete-btn').addEventListener('click', function (event) {
            event.stopPropagation();
            Swal.fire({
                title: 'Are you sure?',
                text: `You are about to delete the ${containerId === 'plants-container' ? 'pest' : 'disease'}. This action cannot be undone.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    firestore.collection(containerId === 'plants-container' ? 'Pest Pdfs' : 'Disease Pdfs').doc(plant.id).delete().then(() => {
                        Swal.fire(
                            `${containerId === 'plants-container' ? 'Pest' : 'Disease'} successfully deleted!!`,
                            `${containerId === 'plants-container' ? 'Pest' : 'Disease'} ${plant.plantTitle} has been deleted.`,
                            'success'
                        );
                        if (containerId === 'plants-container') {
                            displayPlants();
                        } else {
                            displayPlants2();
                        }
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

        container.appendChild(newPlantDiv);
    });
}

displayPlants();
displayPlants2();


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
