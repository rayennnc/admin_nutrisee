import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDonUK7OTm5SCwrfn4IgWyBBTDTXnRunw",
  authDomain: "aplikasi-nutrisi.firebaseapp.com",
  projectId: "aplikasi-nutrisi",
  storageBucket: "118733362855",
  messagingSenderId: "G-20D1EGMBE9",
  appId: "1:118733362855:web:8ce15c4fc74bffd3cc6d82"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let editId = null;

window.tambahMakanan = async function () {
  const nama = document.getElementById("nama").value;
  const kalori = parseInt(document.getElementById("kalori").value);
  const protein = parseFloat(document.getElementById("protein").value);
  const lemak = parseFloat(document.getElementById("lemak").value);
  const karbohidrat = parseFloat(document.getElementById("karbohidrat").value);
  if (!nama || isNaN(kalori)) return alert("Isi semua kolom");

  if (editId) {
    // Edit mode
    await updateDoc(doc(db, "makanan", editId), { nama, kalori, protein, lemak, karbohidrat });
    alert("Data makanan diperbarui!");
    editId = null;
    document.querySelector("button[onclick='tambahMakanan()']").textContent = "Tambah";
  } else {
    // Tambah mode
    await addDoc(collection(db, "makanan"), { nama, kalori, protein, lemak, karbohidrat });
    alert("Makanan ditambahkan!");
  }
  tampilkanMakanan();
  document.getElementById("nama").value = "";
  document.getElementById("kalori").value = "";
  document.getElementById("protein").value = "";
  document.getElementById("lemak").value = "";
  document.getElementById("karbohidrat").value = "";
};

async function tampilkanMakanan() {
  const daftar = document.getElementById("daftar");
  daftar.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "makanan"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    daftar.innerHTML += `<tr>
      <td>${data.nama}</td>
      <td>${data.kalori} kcal</td>
      <td>${data.protein} g</td>
      <td>${data.lemak} g</td>
      <td>${data.karbohidrat} g</td>
      <td>
        <button onclick="editMakanan('${docSnap.id}')">Edit</button>
        <button onclick="hapusMakanan('${docSnap.id}')">Hapus</button>
      </td>
    </tr>`;
  });
}

window.editMakanan = async function(id) {
  const docRef = doc(db, "makanan", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("nama").value = data.nama;
    document.getElementById("kalori").value = data.kalori;
    document.getElementById("protein").value = data.protein;
    document.getElementById("lemak").value = data.lemak;
    document.getElementById("karbohidrat").value = data.karbohidrat;
    editId = id;
    document.querySelector("button[onclick='tambahMakanan()']").textContent = "Simpan";
  }
};

window.hapusMakanan = async function (id) {
  if (confirm("Apakah Anda ingin menghapus data makanan ini?")) {
    await deleteDoc(doc(db, "makanan", id));
    alert("Makanan dihapus!");
    tampilkanMakanan();
  }
}

window.onload = tampilkanMakanan;
