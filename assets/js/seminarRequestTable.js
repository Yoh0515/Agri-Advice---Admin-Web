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
const storage = firebase.storage();
const Seminar = firestore.collection('Seminar');

$(document).ready(function() {
    function initializeDataTable() {
        $('#example').DataTable({
            destroy: true, // This is important to allow reinitialization
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Save to Excel',
                    className: 'bg-green-500 text-white px-4 py-2 rounded-lg'
                },
                {
                    extend: 'pdfHtml5',
                    text: 'Save to PDF',
                    className: 'bg-red-500 text-white px-4 py-2 rounded-lg'
                }
            ],
            language: {
                emptyTable: " "  // Set to a single space or a custom message if needed
            }
        });
    }

    function hideActionColumn() {
        const column = table.column(-1);
        column.visible(false);
    }

    function showActionColumn() {
        const column = table.column(-1);
        column.visible(true);
    }

    $('#exportExcel').click(function() {
        hideActionColumn();
        const wb = XLSX.utils.table_to_book(document.getElementById('example'), { sheet: "Sheet JS" });
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'seminarRequest.xlsx');
        showActionColumn();
    });

    $('#exportPDF').click(function() {
        hideActionColumn();
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape');

        doc.autoTable({
            html: '#example',
            theme: 'grid',
            styles: { fontSize: 8 },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto' }
            }
        });

        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text('Prepared by: Agri Advice', 10, doc.internal.pageSize.getHeight() - 10);
        }

        doc.save('seminarRequest.pdf');
        showActionColumn();
    });

    const dateFilter = flatpickr("#dateFilter", {
        mode: "multiple",
        dateFormat: "Y-m-d",
        onChange: fetchComplaints
    });

    $('#calendarIcon').click(function() {
        dateFilter.open();
    });

    fetchComplaints();
});

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
    return date.toLocaleDateString('en-US', options);
}

function fetchComplaints() {
    $("#example tbody").empty();

    const dateFilter = $('#dateFilter').val();
    const selectedDates = dateFilter ? dateFilter.split(',').map(date => date.trim()) : [];

    Seminar.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const seminarData = doc.data();
            const path = `Seminar/${doc.id}/Chats`;

            firestore.collection(path).orderBy("timestamp", "asc").get().then((querySnapshot) => {
                querySnapshot.forEach((doc1) => {
                    const chatData = doc1.data();
                    if (chatData.message === "Request for Seminar - Pending") {
                        const pdfUrl = chatData.pdfUrl ? `<a href="${chatData.pdfUrl}" target="_blank">SeminarForms.pdf</a>` : '';

                        const complaintDate = new Date(chatData.timestamp);
                        const dateString = complaintDate.toISOString().split('T')[0];

                        if (selectedDates.length > 0 && !selectedDates.includes(dateString)) {
                            return;
                        }

                        let acceptButton;
                        let actionButton;

                        if (chatData.requestStatus === 'Accepted') {
                            actionButton = `<button class="bg-blue-500 text-white px-2 py-1 rounded-lg" onclick="openChatModal('${doc.id}', '${doc1.id}')">Chat</button>`;
                            acceptButton = `<button class="bg-yellow-500 text-white px-2 py-1 rounded-lg" onclick="setPending('${doc.id}', '${doc1.id}')">Undo</button>`;
                        } else if (chatData.requestStatus === 'Rejected') {
                            actionButton = `<button class="bg-blue-500 text-white px-2 py-1 rounded-lg" onclick="openChatModal('${doc.id}', '${doc1.id}')">Chat</button>`;
                            acceptButton = `<button class="bg-yellow-500 text-white px-2 py-1 rounded-lg" onclick="setPending('${doc.id}', '${doc1.id}')">Undo</button>`;
                        } else {
                            acceptButton = `<button class="bg-green-500 text-white px-2 py-1 rounded-lg" onclick="acceptRequest('${doc.id}', '${doc1.id}', '${chatData.sender}', '${chatData.senderName}')">Accept</button>`;
                            actionButton = `<button class="bg-red-500 text-white px-2 py-1 rounded-lg" onclick="showDeclineReasonModal('${doc.id}', '${doc1.id}', '${chatData.sender}', '${chatData.senderName}')">Decline</button>`;
                        }

                        const row = `
                            <tr>
                                <td>${chatData.seminarRequestId}</td>
                                <td>${chatData.senderName}</td>
                                <td>${chatData.sender}</td>
                                <td>${pdfUrl}</td>
                                <td>${chatData.requestStatus}</td>
                                <td>
                                    ${acceptButton}
                                    ${actionButton}
                                </td>
                            </tr>
                        `;
                        $("#example tbody").append(row);
                    }
                });
            });
        });
            initializeDataTable(); // Initialize or reinitialize DataTable
    });
}

function acceptRequest(docId, chatId, receiverForChatsEmail, receiverForChatsName) {
    const timestamp = Date.now();
    firestore.collection("Seminar").doc(docId).collection("Chats").doc(chatId).update({
        requestStatus: "Accepted",
        dateAccepted: timestamp
    }).then(() => {
        console.log("Request accepted.");
        sendStatusMessage(docId, chatId, "Seminar Request has been accepted.", receiverForChatsEmail, receiverForChatsName);
        fetchComplaints(); // Refresh the complaints list to update the button states
    }).catch((error) => {
        console.error("Error accepting request:", error);
    });
}

function showDeclineReasonModal(docId, chatId, receiverForChatsEmail, receiverForChatsName) {
    $("#declineReasonForm").off('submit').on('submit', function(event) {
        event.preventDefault();
        const declineReason = $("#declineReason").val();
        declineRequest(docId, chatId, receiverForChatsEmail, receiverForChatsName, declineReason);
    });

    $("#declineReasonModal").removeClass("hidden").addClass("flex");
}

function declineRequest(docId, chatId, receiverForChatsEmail, receiverForChatsName, declineReason) {
    const timestamp = Date.now();
    firestore.collection("Seminar").doc(docId).collection("Chats").doc(chatId).update({
        requestStatus: "Rejected",
        dateRejected: timestamp,
        declineReason: declineReason
    }).then(() => {
        console.log("Request declined.");
        sendStatusMessage(docId, chatId, `Seminar Request has been rejected. Reason: ${declineReason}`, receiverForChatsEmail, receiverForChatsName);
        fetchComplaints();
        closeModal('declineReasonModal');
    }).catch((error) => {
        console.error("Error rejecting request:", error);
    });
}

function setPending(docId, chatId) {
    firestore.collection("Seminar").doc(docId).collection("Chats").doc(chatId).update({
        requestStatus: "Pending"
    }).then(() => {
        console.log("Request status set to pending.");
        fetchComplaints(); // Refresh the complaints list to update the button states
    }).catch((error) => {
        console.error("Error setting request status to pending:", error);
    });
}

function sendStatusMessage(docId, chatId, message, receiverForChatsEmail, receiverForChatsName) {
    const path = `Seminar/${docId}/Chats`;
    const sender = "agriadvice123@gmail.com";
    const senderName = "Agri Advice";
    const timestamp = Date.now();
    const receiver = receiverForChatsEmail;
    const receiverName = receiverForChatsName;

    firestore.collection(path).add({
        message,
        sender,
        senderName,
        receiver,
        receiverName,
        timestamp
    }).then(() => {
        console.log("Status message sent.");
    }).catch((error) => {
        console.error("Error sending status message:", error);
    });
}

function openChatModal(docId, chatId) {
    $("#hiddenField").val(docId);
    $("#hiddenChatField").val(chatId);

    firestore.collection(`Seminar/${docId}/Chats`).orderBy("timestamp", "asc").get().then((querySnapshot) => {
        let chatBodyHtml = '';

        querySnapshot.forEach((doc) => {
            const chatData = doc.data();
            chatBodyHtml += formatChatMessage(chatData, "agriadvice123@gmail.com");
        });

        $("#chatBody").html(chatBodyHtml);
        $("#chats").removeClass("hidden").addClass("flex");
        $("#chatBodyContainer").scrollTop($("#chatBodyContainer")[0].scrollHeight);
    });
}

function formatChatMessage(chatData, user) {
    const isSender = chatData.sender === user;
    const alignmentClass = isSender ? "justify-end" : "justify-start";
    const messageClass = isSender ? "bg-blue-200" : "bg-gray-200";

    let formattedTimestamp = '';
    if (chatData.timestamp) {
        formattedTimestamp = new Date(chatData.timestamp).toLocaleString();
    }

    let imageContent = '';
    if (chatData.images && Array.isArray(chatData.images)) {
        imageContent = chatData.images.map(image => {
            if (getFileNameFromUrl(image).toLowerCase().endsWith('.pdf')) {
                return `<a href="${image}" target="_blank" class="block mt-2">PDF File: ${getFileNameFromUrl(image)}</a>`;
            } else {
                return `<img src="${image}" class="max-w-xs block mt-2">`;
            }
        }).join('');
    }

    return `
        <div class="flex ${alignmentClass} items-start mb-2">
            <div class="${messageClass} rounded-lg p-2 m-2 max-w-xs">
                <p class="text-sm">${chatData.message}</p>
                ${imageContent}
                <span class="text-xs text-gray-500 block mt-2">${formattedTimestamp}</span>
            </div>
        </div>
    `;
}

function closeModal(modalId) {
    $(`#${modalId}`).removeClass("flex").addClass("hidden");
}

$("#sendmessage").click(async () => {
    const docId = $("#hiddenField").val();
    const chatId = $("#hiddenChatField").val();
    const message = $("#message").val();
    const sender = "agriadvice123@gmail.com";
    const senderName = "Agri Advice";
    const timestamp = Date.now();
    const fileInput = document.getElementById("fileInput");
    const files = fileInput.files;
    let fileURLs = [];

    if (files.length > 0) {
        for (const file of files) {
            const fileURL = await uploadFile(file);
            fileURLs.push(fileURL);
        }
    }

    try {
        const path = `Seminar/${docId}/Chats`;

        const chatDoc = await firestore.collection(path).doc(chatId).get();
        if (!chatDoc.exists) {
            console.error("Chat document does not exist.");
            return;
        }

        const chatData = chatDoc.data();
        const receiver = chatData.sender;
        const receiverName = chatData.senderName;

        if (message.trim() !== "" || fileURLs.length > 0) {
            await firestore.collection(path).add({
                message,
                sender,
                senderName,
                receiver,
                receiverName,
                timestamp,
                images: fileURLs
            });

            const chatMessage = formatChatMessage({
                message,
                sender,
                senderName,
                receiver,
                receiverName,
                images: fileURLs,
                timestamp
            }, sender);

            $("#chatBody").append(chatMessage);
            $("#message").val("");
            $("#fileInput").val("");
            $("#attachmentPreview").empty();
            $("#chatBodyContainer").scrollTop($("#chatBodyContainer")[0].scrollHeight);
        }

    } catch (error) {
        console.error("Error processing chat or sending message:", error);
    }
});

function attachFiles() {
    const fileInput = document.getElementById("fileInput");
    const files = fileInput.files;

    if (files.length > 0) {
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const attachmentPreview = document.getElementById("attachmentPreview");

                const imagePreview = document.createElement("div");
                imagePreview.classList.add("attachment-item");

                const image = document.createElement("img");
                image.src = e.target.result;

                const removeButton = document.createElement("button");
                removeButton.innerHTML = "&times;";
                removeButton.classList.add("remove-button");
                removeButton.addEventListener("click", function() {
                    imagePreview.remove();
                });

                imagePreview.appendChild(image);
                imagePreview.appendChild(removeButton);

                attachmentPreview.appendChild(imagePreview);
            };
            reader.readAsDataURL(file);
        }
    }
}

document.getElementById("fileInput").addEventListener("change", attachFiles);

function getFileNameFromUrl(url) {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    const fileName = pathname.split('/').pop();
    return decodeURIComponent(fileName.replace('images%2F', ''));
}

function uploadFile(file) {
    return new Promise((resolve, reject) => {
        const storageRef = storage.ref('images/' + file.name);
        const uploadTask = storageRef.put(file);

        uploadTask.on('state_changed',
            function(snapshot) {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            function(error) {
                console.error('Error uploading file: ', error);
                reject(error);
            },
            function() {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
}

const tagUpdateModal = document.getElementById('tagAsResolved');
const closeModalButtonResolve = document.getElementById('closeModalButtonResolve');

closeModalButtonResolve.addEventListener('click', () => {
    tagUpdateModal.classList.add('hidden');
});

document.getElementById('resolved').addEventListener('click', function() {
    tagUpdateModal.classList.remove('hidden');
});

document.getElementById('submitActionResolve').addEventListener('click', async function (event) {
    event.preventDefault();

    const complaintId = document.getElementById('hiddenField').value;
    const chatId = document.getElementById('hiddenChatField').value;
    const complaintRef = firestore.collection('Seminar').doc(complaintId).collection('Chats').doc(chatId);

    const actionTaken = document.getElementById('actionTaken').value;

    try {
        const chatSnapshot = await complaintRef.get();

        let firstChatAdminDate = null;
        const chatData = chatSnapshot.data();

        if (chatData && chatData.sender === 'agriadvice123@gmail.com') {
            firstChatAdminDate = new Date(chatData.timestamp);
        }

        if (firstChatAdminDate) {
            const now = new Date();
            const timeDifference = now - firstChatAdminDate;
            const daysBeforeResolved = formatTimeDifference(timeDifference);

            await complaintRef.update({
                isResolved: "Resolved",
                actionsTaken: {
                    dateTimeResolved: now,
                    actionTaken: actionTaken,
                    firstChatAdminDate: firstChatAdminDate,
                    daysBeforeResolved: daysBeforeResolved,
                }
            });

            console.log('Complaint marked as resolved successfully.');
            window.location.reload();
        } else {
            console.error('No chat found for sender agriadvice123@gmail.com.');
        }
    } catch (error) {
        console.error('Error marking complaint as resolved:', error);
    }
});

function formatTimeDifference(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return `${days} days, ${hours % 24} hours, ${minutes % 60} minutes`;
}

function saveComplaintToPDF() {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF('landscape');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const complaintNumber = $("#modalComplaintNumber").text();
    const customer = $("#modalCustomer").text();
    const email = $("#modalEmail").text();
    const complaintText = $("#modalComplaintText").text();
    const status = $("#modalStatus").text();
    const actionTaken = $("#actionTakenView").text();
    const dateResolved = $("#dateResolvedView").text();
    const firstResponse = $("#firstResponseView").text();
    const totalProcess = $("#totalProcessTimeView").text();
    const evidenceSrc = $("#modalEvidence").attr("src");

    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Customer Complaint Report", pageWidth / 2, 15, { align: 'center' });

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(10, 20, pageWidth - 10, 20);

    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');

    let yPosition = 30;

    doc.text(`Complaint Number: ${complaintNumber}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Customer: ${customer}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Email: ${email}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Complaint:`, 10, yPosition);
    doc.text(complaintText, 40, yPosition, { maxWidth: pageWidth - 50 });
    yPosition += 10;
    doc.text(`Status: ${status}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Action Taken: ${actionTaken}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Date Resolved: ${dateResolved}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Admin First Response Date: ${firstResponse}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Total Process Time: ${totalProcess}`, 10, yPosition);

    if (evidenceSrc) {
        doc.addImage(evidenceSrc, 'JPEG', 10, yPosition + 10, 50, 50);
        yPosition += 60;
    }

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Prepared by: Agri Advice", pageWidth / 2, pageHeight - 10, { align: 'center' });

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    doc.save(`complaint_${complaintNumber}.pdf`);
}