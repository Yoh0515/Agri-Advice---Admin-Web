

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
const Complaints = firestore.collection('Complaints');

$(document).ready(function () {
    const table = $('#example').DataTable({
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

    function hideActionColumn() {
        const column = table.column(-1);
        const columnEvidence = table.column(-6);
        columnEvidence.visible(false);
        column.visible(false);
    }

    function showActionColumn() {
        const column = table.column(-1);
        const columnEvidence = table.column(-6);
        columnEvidence.visible(true);
        column.visible(true);
    }

    $('#exportExcel').click(function () {
        hideActionColumn();
        const wb = XLSX.utils.table_to_book(document.getElementById('example'), { sheet: "Sheet JS" });
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), 'complaints.xlsx');
        showActionColumn();
    });

    $('#exportPDF').click(function () {
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

        doc.save('complaints.pdf');
        showActionColumn();
    });

    const dateFilter = flatpickr("#dateFilter", {
        mode: "multiple",
        dateFormat: "Y-m-d",
        onChange: fetchComplaints
    });

    $('#calendarIcon').click(function () {
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
    $("#example").DataTable().clear().draw();  // Clear the table before adding new data

    const dateFilter = $('#dateFilter').val();
    const selectedDates = dateFilter ? dateFilter.split(',').map(date => date.trim()) : [];

    firestore.collection("Complaints").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const complaintData = doc.data();
            const path = `Complaints/${doc.id}/Chats`;

            firestore.collection(path).orderBy("timestamp", "asc").get().then((querySnapshot) => {
                querySnapshot.forEach((doc1) => {
                    const chatData = doc1.data();
                    if (chatData.subject) {  // Check if the message has a subject
                        const actionsTaken = chatData.actionsTaken || {};
                        const resolvedDate = actionsTaken.dateTimeResolved ? formatTimestamp(actionsTaken.dateTimeResolved.seconds * 1000) : 'N/A';
                        const firstResponseDate = actionsTaken.firstChatAdminDate ? formatTimestamp(actionsTaken.firstChatAdminDate.seconds * 1000) : 'N/A';

                        const date = chatData.timestamp ? formatTimestamp(chatData.timestamp) : null;
                        const complaintDate = chatData.timestamp ? new Date(chatData.timestamp) : null;
                        const dateString = complaintDate ? complaintDate.toISOString().split('T')[0] : 'N/A';

                        if (selectedDates.length > 0 && !selectedDates.includes(dateString)) {
                            return;
                        }

                        const row = `
                            <tr>
                                <td>${chatData.reportId}</td>
                                <td>${chatData.senderName}</td>
                                <td>${chatData.sender}</td>
                                <td>${chatData.subject ? chatData.subject + " " : ""}</td>
                                <td>${chatData.images ? `<img src="${chatData.images[0]}" alt="Evidence" class="w-16 h-16 object-cover">` : 'No Evidence'}</td>
                                <td>${chatData.isResolved || 'Unresolved'}</td>
                                <td>${actionsTaken.actionTaken || ''}</td>
                                <td>${resolvedDate}</td>
                                <td>${firstResponseDate}</td>
                                <td>
                                    <button class="bg-blue-500 text-white px-2 py-1 rounded-lg" onclick="openComplaintModal('${date}','${chatData.reportId}', '${doc1.id}', '${chatData.sender}', '${chatData.senderName}', '${chatData.subject}', '${chatData.message}', '${chatData.images ? chatData.images[0] : ''}', '${chatData.isResolved || 'Unresolved'}', 
                                    '${chatData.actionsTaken ? chatData.actionsTaken.actionTaken : ''}', '${resolvedDate}', '${firstResponseDate}', '${chatData.actionsTaken ? chatData.actionsTaken.daysBeforeResolved : 'N/A'}')">View</button> <br/><br/>
                                    <button class="bg-green-500 text-white px-2 py-1 rounded-lg" onclick="openChatModal('${doc.id}', '${doc1.id}')">Chat</button>
                                </td>
                            </tr>
                        `;
                        $("#example").DataTable().row.add($(row)).draw();  // Add row to DataTable
                    }
                });
            });
        });
    });
}





function openComplaintModal(date, reportId, chatId, sender, senderName, subject, message, images, isResolved, actionTaken, dateResolved, firstResponse, totalProcess) {
    $("#modalComplaintNumber").text(reportId);
    $("#modalCustomer").text(senderName);
    $("#modalEmail").text(sender);
    $("#modalComplaintText").html(subject + ":" + "<br>" + message);
    $("#modalEvidence").attr("src", images || ''); // Set the image source if available
    $("#modalStatus").text(isResolved);
    $("#modalDate").text(date);
    $("#actionTakenView").text(actionTaken || 'No action taken');
    $("#dateResolvedView").text(dateResolved);
    $("#firstResponseView").text(firstResponse);
    $("#totalProcessTimeView").text(totalProcess);

    $("#hiddenField").val(reportId);  // Store reportId in a hidden field
    $("#hiddenChatField").val(chatId);  // Store chatId in a hidden field

    $("#complaintModal").removeClass("hidden").addClass("flex");

    // Debugging: Log values to verify they are set
    console.log("Modal Opened with Report ID:", reportId);
    console.log("Modal Opened with Chat ID:", chatId);
}


function openChatModal(id, chatId) {
    $("#hiddenField").val(id);
    $("#hiddenChatField").val(chatId);  // Store chatId in a hidden field

    firestore.collection(`Complaints/${id}/Chats`).orderBy("timestamp", "asc").get().then((querySnapshot) => {
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
        if (chatData.timestamp.seconds) {
            // Firestore Timestamp object
            formattedTimestamp = new Date(chatData.timestamp.seconds * 1000).toLocaleString();
        } else {
            // Assume it is in milliseconds since epoch
            formattedTimestamp = new Date(chatData.timestamp).toLocaleString();
        }
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
    const id = $("#hiddenField").val();
    const message = $("#message").val();
    const sender = "agriadvice123@gmail.com";
    const senderName = "Agri Advice";
    const timestamp = Date.now(); // Get current timestamp in milliseconds
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
        // Update unresolved complaints
        const complaintsSnapshot = await firestore.collection("Complaints").get();
        for (const doc of complaintsSnapshot.docs) {
            const complaintData = doc.data();
            if (complaintData.isResolved === null || typeof complaintData.isResolved === "undefined") {
                await firestore.collection("Complaints").doc(doc.id).update({
                    isResolved: "Unresolved"
                });
                console.log("Document successfully updated with isResolved field.");
            }
        }

        // Get the first chat document
        const path = `Complaints/${id}/Chats`;
        const chatSnapshot = await firestore.collection(path).orderBy("timestamp", "asc").limit(1).get();
        const firstChatDoc = chatSnapshot.docs[0];
        const chatData = firstChatDoc.data();

        const receiver = chatData.sender;
        const receiverName = chatData.senderName;

        // Send the message
        if (message.trim() !== "" || fileURLs.length > 0) {
            await firestore.collection(`Complaints/${id}/Chats`).add({
                message,
                sender,
                senderName,
                receiver,
                receiverName,
                timestamp, // Store the timestamp in milliseconds
                images: fileURLs
            });

            const chatMessage = formatChatMessage({
                message,
                sender,
                senderName,
                receiver,
                receiverName,
                images: fileURLs,
                timestamp: timestamp // Pass the timestamp in milliseconds
            }, sender);

            $("#chatBody").append(chatMessage);
            $("#message").val("");
            $("#fileInput").val("");
            $("#attachmentPreview").empty();
            $("#chatBodyContainer").scrollTop($("#chatBodyContainer")[0].scrollHeight);
        }

    } catch (error) {
        console.error("Error processing complaints or sending message:", error);
    }
});

function attachFiles() {
    const fileInput = document.getElementById("fileInput");
    const files = fileInput.files;

    if (files.length > 0) {
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const attachmentPreview = document.getElementById("attachmentPreview");

                const imagePreview = document.createElement("div");
                imagePreview.classList.add("attachment-item");

                const image = document.createElement("img");
                image.src = e.target.result;

                const removeButton = document.createElement("button");
                removeButton.innerHTML = "&times;";
                removeButton.classList.add("remove-button");
                removeButton.addEventListener("click", function () {
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
            function (snapshot) {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            function (error) {
                console.error('Error uploading file: ', error);
                reject(error);
            },
            function () {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
}

const tagUpdateModal = document.getElementById('tagAsResolved');
const closeModalButtonResolve = document.getElementById('closeModalButtonResolve');



document.getElementById('resolved').addEventListener('click', function () {
    tagUpdateModal.classList.remove('hidden');
});


document.getElementById('submitActionResolve').addEventListener('click', async function (event) {
    event.preventDefault();

    const reportId = document.getElementById('hiddenField').value;
    const chatId = document.getElementById('hiddenChatField').value;

    if (!reportId) {
        console.error('Missing reportId');
        return;
    }
    if (!chatId) {
        console.error('Missing chatId');
        return;
    }

    const complaintRef = firestore.collection('Complaints').doc(reportId);
    const chatRef = complaintRef.collection('Chats').doc(chatId);

    const actionTaken = document.getElementById('actionTaken').value;

    try {
        // Fetch the specific chat message
        const chatDoc = await chatRef.get();
        if (chatDoc.exists) {
            const chatData = chatDoc.data();
            const reportTimestamp = chatData.timestamp;  // Timestamp is already in milliseconds in the screenshot

            // Find the first admin response after the user's message
            const path = `Complaints/${reportId}/Chats`;
            const chatSnapshot = await firestore.collection(path).orderBy("timestamp", "asc").get();
            let firstAdminResponseDate = null;

            for (const doc of chatSnapshot.docs) {
                const messageData = doc.data();
                if (messageData.sender === 'agriadvice123@gmail.com' && messageData.timestamp > reportTimestamp) {
                    firstAdminResponseDate = new Date(messageData.timestamp);
                    break;
                }
            }

            if (!firstAdminResponseDate) {
                console.error('No admin response found after the user report.');
                return;
            }

            const now = new Date();
            const timeDifference = now - firstAdminResponseDate;
            const daysBeforeResolved = formatTimeDifference(timeDifference);

            await chatRef.update({
                isResolved: "Resolved",
                actionsTaken: {
                    dateTimeResolved: now,
                    actionTaken: actionTaken,
                    firstChatAdminDate: firstAdminResponseDate,
                    daysBeforeResolved: daysBeforeResolved,
                }
            });

            console.log('Complaint marked as resolved successfully.');
            window.location.reload();
        } else {
            console.error('No chat found for the given id.');
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

    // Add header
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Customer Complaint Report", pageWidth / 2, 15, { align: 'center' });

    // Add a horizontal line
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(10, 20, pageWidth - 10, 20);

    // Add content
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

    // Add evidence image
    if (evidenceSrc) {
        doc.addImage(evidenceSrc, 'JPEG', 10, yPosition + 10, 50, 50);
        yPosition += 60;
    }

    // Add "Prepared by: Agri Advice" at the bottom of the page
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Prepared by: Agri Advice", pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Draw border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // Save the PDF
    doc.save(`complaint_${complaintNumber}.pdf`);
}