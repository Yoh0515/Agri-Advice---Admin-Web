// Check session storage for login status
const isLoggedIn = sessionStorage.getItem("isLoggedIn");
// If user is not logged in, redirect to login page
console.log(isLoggedIn);
if (!isLoggedIn) {
    window.location.href = "index.html";
}

const firebaseConfig = {
    apiKey: "AIzaSyAxiXl5E5pDxFkgJFLo59relkrRkBdRv_U",
    authDomain: "final-database-9493d.firebaseapp.com",
    databaseURL: "https://final-database-9493d-default-rtdb.firebaseio.com",
    projectId: "final-database-9493d",
    storageBucket: "final-database-9493d.appspot.com",
    messagingSenderId: "798360016853",
    appId: "1:798360016853:web:b39e41d841cbc3ba4acf5c"
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const database = firebase.database();
const storage = firebase.storage();
var markerplaceRef = firebase.database().ref('Marketplace');
var vendorsRef = firebase.database().ref('Vendors');
var paymentRef = firebase.database().ref('Order');
var usersCollectionRef = firestore.collection('Users');


const openModalButton = document.getElementById('openModalButton');
const closeModalButton = document.getElementById('closeModalButton');
const closeModalButtonUser = document.getElementById('closeModalButtonUser');
const videoModal = document.getElementById('videoModal');
const videoPreview = document.getElementById('videoPreview');
const videoSource = document.getElementById('videoSource');
const fileInput = document.getElementById('fileInput');
const uploadVideoButton = document.getElementById('uploadVideoButton');
const uploadProgress = document.getElementById('uploadprogress');

// Open modal
openModalButton.addEventListener('click', () => {
    videoModal.classList.remove('hidden');
    loadCurrentVideo();
});


// Close modal
closeModalButton.addEventListener('click', () => {
    videoModal.classList.add('hidden');
});

closeModalButtonUser.addEventListener('click', () => {
    userViewModal.classList.add('hidden');
});




// Load current video
function loadCurrentVideo() {
    const videoRef = storage.ref('dashboardVideo/dashboard.mp4');
    videoRef.getDownloadURL()
        .then((url) => {
            videoSource.src = url;
            videoPreview.load();
        })
        .catch((error) => {
            console.error('Error loading video:', error);
        });
}

// Upload new video
uploadVideoButton.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (file) {
        const videoRef = storage.ref('dashboardVideo/dashboard.mp4');
        // Delete existing video
        videoRef.delete()
            .then(() => {
                // Upload new video
                const uploadTask = videoRef.put(file);
                uploadTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    uploadProgress.textContent = 'Upload is ' + progress + '% done';
                }, (error) => {
                    console.error('Error uploading video:', error);
                }, () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        videoSource.src = downloadURL;
                        videoPreview.load();
                        uploadProgress.textContent = 'Upload completed successfully!';
                    });
                });
            })
            .catch((error) => {
                console.error('Error deleting previous video:', error);
            });
    } else {
        alert('Please select a video to upload.');
    }
});

function getNodeCounts() {


    markerplaceRef.orderByChild("category").once('value')
        .then(function (markerplaceSnapshot) {
            const total_product = document.getElementById('totalP');
            var markerplaceCount = markerplaceSnapshot.numChildren();
            console.log("Number of nodes in Marketplace with mTitle equal to '2': " + markerplaceCount);
            total_product.textContent = markerplaceCount;
        })
        .catch(function (error) {
            console.error("Error fetching Marketplace data:", error);
        });

    vendorsRef.orderByChild("vendor").equalTo("true").once('value')
        .then(function (vendorsSnapshot) {
            const total_vendors = document.getElementById('totalV');
            var vendorsCount = vendorsSnapshot.numChildren();
            console.log("Number of vendors with value equal to 'true': " + vendorsCount);
            total_vendors.textContent = vendorsCount;
        })
        .catch(function (error) {
            console.error("Error fetching Vendors data:", error);
        });

    paymentRef.orderByChild("recieved").equalTo("true").once('value')
        .then(function (orderSnapshot) {
            const total_order = document.getElementById('totalO');
            var ordersCount = orderSnapshot.numChildren();
            console.log("Number of vendors with value equal to 'true': " + ordersCount);
            total_order.textContent = ordersCount;
        })
        .catch(function (error) {
            console.error("Error fetching Vendors data:", error);
        });
    usersCollectionRef.get()
        .then(function (querySnapshot) {
            const total_users = document.getElementById('totalA');
            var usersCount = querySnapshot.size;
            console.log("Number of documents in Users: " + usersCount);
            total_users.textContent = usersCount;
        })
        .catch(function (error) {
            console.error("Error fetching Users data:", error);
        });
}

getNodeCounts();


const orderRef = firebase.database().ref('Marketplace');
const itemsPerPage = 5;
let currentPage = 1;
let totalItems = 0;

function renderPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('mx-1', 'px-3', 'py-1', 'rounded', 'bg-gray-200', 'hover:bg-gray-300');
        if (i === currentPage) {
            button.classList.add('bg-blue-500', 'text-white');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            sales();
        });
        pagination.appendChild(button);
    }
}

function sales() {
    const salesCon = document.getElementById('container');
    salesCon.innerHTML = '';

    orderRef.once('value', function(snapshot) {
        const salesData = [];
        snapshot.forEach(function(childSnapshot) {
            const postData = childSnapshot.val();
            salesData.push(postData);
        });

        // Sort salesData based on totalItemOrders in descending order
        salesData.sort((a, b) => b.totalItemOrders - a.totalItemOrders);

        totalItems = salesData.length;
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedData = salesData.slice(start, end);

        paginatedData.forEach(function(postData) {
            const row = document.createElement('tr');
            row.classList.add('saleDiv', 'border-b', 'border-gray-200');

            const productCell = document.createElement('td');
            const productImage = document.createElement('img');
            productImage.classList.add('imageM', 'inline-block', 'rounded-full', 'h-20', 'w-20');
            productImage.src = postData.mProduct[0];
            productCell.classList.add('py-3', 'px-4');
            productCell.appendChild(productImage);
            row.appendChild(productCell);

            const titleCell = document.createElement('td');
            titleCell.textContent = postData.title;
            titleCell.classList.add('py-3', 'px-4');
            row.appendChild(titleCell);

            const vendorCell = document.createElement('td');
            vendorCell.textContent = postData.vendor;
            vendorCell.classList.add('py-3', 'px-4');
            row.appendChild(vendorCell);

            const orderNoCell = document.createElement('td');
            orderNoCell.textContent = postData.totalItemOrders;
            orderNoCell.classList.add('py-3', 'px-4');
            row.appendChild(orderNoCell);

            salesCon.appendChild(row);
        });

        renderPagination();
    });
}

sales();


var Users = firestore.collection('Users');
let map;
// Add event listeners to handle the View button click and modal functionality
document.addEventListener('DOMContentLoaded', () => {
    const userViewModal = document.getElementById('userViewModal');
    const closeModalButton = document.getElementById('closeModalButton');
    const userFullName = document.getElementById('userFullName');
    const userEmail = document.getElementById('userEmail');
    const userAddress = document.getElementById('userAddress');
    const userPhoneNumber = document.getElementById('userPhoneNumber');
    const userModalId = 'userModalId';
    const usersPerPage = 5;
    let userCurrentPage = 1;
    let totalUsers = 0;

    // Close modal
    closeModalButton.addEventListener('click', () => {
        userViewModal.classList.add('hidden');
    });

    // Open modal with user information
    document.addEventListener('click', (event) => {
        if (event.target && event.target.id === userModalId) {
            const row = event.target.closest('tr');
            const userData = {
                fullName: row.cells[0].textContent,
                email: row.cells[1].textContent,
                address: row.cells[2].textContent,
                phoneNumber: row.cells[3].textContent
            };
            userFullName.textContent = userData.fullName;
            userEmail.textContent = userData.email;
            userAddress.textContent = userData.address;
            userPhoneNumber.textContent = userData.phoneNumber;

            // Fetch the user's location from the Firestore document
            Users.where("UserEmail", "==", userData.email).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const location = doc.data().Location;
                    const refinedLocation = location.replace(/^[^,]+, /, ''); // Remove the "CX4Q+QF6" part
                    geocodeAddress(refinedLocation); // Geocode the refined address and initialize the map
                });
            });

            userViewModal.classList.remove('hidden');
        }
    });

    function renderUserPagination() {
        const userPagination = document.getElementById('userPagination');
        userPagination.innerHTML = '';
        const totalPages = Math.ceil(totalUsers / usersPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.add('mx-1', 'px-3', 'py-1', 'rounded', 'bg-gray-200', 'hover:bg-gray-300');
            if (i === userCurrentPage) {
                button.classList.add('bg-blue-500', 'text-white');
            }
            button.addEventListener('click', () => {
                userCurrentPage = i;
                userInfo();
            });
            userPagination.appendChild(button);
        }
    }

    function userInfo() {
        var userCon = document.getElementById('userContainer');
        userCon.innerHTML = '';

        Users.get().then((querySnapshot) => {
            const usersData = [];
            querySnapshot.forEach((doc) => {
                usersData.push(doc.data());
            });

            totalUsers = usersData.length;
            const start = (userCurrentPage - 1) * usersPerPage;
            const end = start + usersPerPage;
            const paginatedData = usersData.slice(start, end);

            paginatedData.forEach((usersData) => {
                const row = document.createElement('tr');
                row.classList.add('saleDiv', 'border-b', 'border-gray-200');

                const nameCell = document.createElement('td');
                nameCell.classList.add('py-3', 'px-4');
                nameCell.textContent = usersData.Fullname;
                row.appendChild(nameCell);

                const emailCell = document.createElement('td');
                emailCell.textContent = usersData.UserEmail;
                emailCell.classList.add('py-3', 'px-4');
                row.appendChild(emailCell);

                const addressCell = document.createElement('td');
                addressCell.textContent = usersData.Address;
                addressCell.classList.add('py-3', 'px-4');
                row.appendChild(addressCell);

                const numberCell = document.createElement('td');
                numberCell.textContent = usersData.Number;
                numberCell.classList.add('py-3', 'px-4');
                row.appendChild(numberCell);


                const viewCell = document.createElement('td');
                viewCell.classList.add('py-3', 'px-4');
                const viewButton = document.createElement('button');
                viewButton.textContent = 'View';
                viewButton.id = userModalId;
                viewButton.classList.add('bg-blue-500', 'text-white', 'px-2', 'py-1', 'rounded-lg');
                viewCell.appendChild(viewButton);
                row.appendChild(viewCell);

                userCon.appendChild(row);
            });

            renderUserPagination();
        });
    }

    userInfo();
});

function geocodeAddress(address) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const location = data[0];
                initMap(location.lat, location.lon);
            } else {
                console.error('Geocode was not successful for the following reason: No results found');
            }
        })
        .catch(error => {
            console.error('Geocode was not successful for the following reason:', error);
        });
}

function initMap(lat, lon) {
    // Remove any existing map instance before creating a new one
    if (map) {
        map.remove();
    }
    map = L.map('map').setView([lat, lon], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.marker([lat, lon]).addTo(map);
}



function logoutUser() {
    firebase.auth().signOut().then(() => {
        alert("Logout successful!");
        sessionStorage.setItem("isLoggedIn", "false");
        window.location.href = "index.html";
    }).catch((error) => {
        alert("Logout failed: " + error.message);
    });
}


function uploadFile(file) {
    return new Promise(function (resolve, reject) {
        var storageRef = storage.ref('dashboardVideo/dashboard.mp4');
        var uploadTask = storageRef.put(file);

        uploadTask.on('state_changed',
            function (snapshot) {
                // Handle progress here
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            function (error) {
                // Handle unsuccessful uploads
                console.error('Error uploading file: ', error);
                reject(error);
            },
            function () {
                // Handle successful uploads on complete
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    resolve(downloadURL);
                });
            }
        );
    });
}

function attachFiles() {
    var fileInput = document.getElementById("fileInput");
    var files = fileInput.files;

    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();

            reader.onload = (function (file) {
                return function (e) {
                    var attachmentPreview = document.getElementById("attachmentPreview");

                    var video = document.createElement("video");
                    video.src = e.target.result;
                    video.style.display = "none"; // Hide the video element
                    attachmentPreview.appendChild(video);

                    video.addEventListener('seeked', function () {
                        var canvas = document.createElement("canvas");
                        var ctx = canvas.getContext("2d");
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                        var imagePreview = document.createElement("div");
                        imagePreview.classList.add("attachment-item");

                        var image = document.createElement("img");
                        image.src = canvas.toDataURL();

                        var removeButton = document.createElement("button");
                        removeButton.innerHTML = "&times;";
                        removeButton.classList.add("remove-button");
                        removeButton.addEventListener("click", function () {
                            imagePreview.remove();
                        });

                        imagePreview.appendChild(image);
                        imagePreview.appendChild(removeButton);

                        attachmentPreview.appendChild(imagePreview);

                        attachmentPreview.removeChild(video);
                    });

                    video.currentTime = 1; // Seek to a second to trigger the seeked event
                };
            })(file);

            reader.readAsDataURL(file);
        }
    }
}

function uploadFile(file) {
    return new Promise(function (resolve, reject) {
        var storageRef = storage.ref('dashboardVideo/dashboard.mp4');
        var uploadTask = storageRef.put(file);

        uploadTask.on('state_changed',
            function (snapshot) {
                // Handle progress here
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                document.getElementById("uploadprogress").innerText = 'Upload is ' + progress + '% done';
                console.log('Upload is ' + progress + '% done');

            },
            function (error) {
                // Handle unsuccessful uploads
                document.getElementById("uploadprogress").innerText = 'Error uploading file: ', error;
                console.error('Error uploading file: ', error);
                reject(error);
            },
            function () {
                // Handle successful uploads on complete
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    resolve(downloadURL);
                });
            }
        );
    });
}



document.getElementById("fileInput").addEventListener("change", function () {
    console.log("testttt");
    attachFiles();
});

document.getElementById("UploadVideo").addEventListener("click", function () {
    console.log("test");
    var fileInput = document.getElementById("fileInput");
    var files = fileInput.files;
    var uploadPromises = [];

    for (var i = 0; i < files.length; i++) {
        uploadPromises.push(uploadFile(files[i]));
    }

});


document.getElementById("logoutButton").addEventListener("click", function () {
    logoutUser();
});
