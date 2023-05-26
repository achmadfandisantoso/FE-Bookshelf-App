const bukuApps = [];
const RENDER_EVENT = "renderBuku";

const SAVED_BUKU_EVENT = "saved-buku";
const BUKUSTORAGE_KEY = "Buku-Apps";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser Kamu tidak mendukung local Storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const pars = JSON.stringify(bukuApps);
    localStorage.setItem(BUKUSTORAGE_KEY, pars);
    document.dispatchEvent(new Event(SAVED_BUKU_EVENT));
  }
}

function generateBukuId() {
  return +new Date();
}

function generateBukuObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBuku(bukuId) {
  for (bukuItem of bukuApps) {
    if (bukuItem.id === bukuId) {
      return bukuItem;
    }
  }
  return null;
}

function findBukuIndex(bukuId) {
  for (index in bukuApps) {
    if (bukuApps[index].id === bukuId) {
      return index;
    }
  }
  return -1;
}

function buatBuku(bukuObject) {
  const { id, title, author, year, isCompleted } = bukuObject;

  const textTitle = document.createElement("h2");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = author;

  const textYear = document.createElement("p");
  textYear.innerText = year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("action");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("book_item");
  container.append(textContainer);
  container.setAttribute("id", `buku-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.innerText = "Belum Selesai Di Baca";
    undoButton.addEventListener("click", () => {
      undoBukuFromCompleted(id);
    });

    const trashButton1 = document.createElement("button");
    trashButton1.classList.add("red");
    trashButton1.innerText = "Hapus Buku";
    trashButton1.addEventListener("click", () => {
      removeBukuFromCompleted(id);
    });

    textContainer.append(undoButton, trashButton1);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("green");
    checkButton.innerText = "Selesai Dibaca";
    checkButton.addEventListener("click", () => {
      addBukuToCompleted(id);
    });
    const trashButton2 = document.createElement("button");
    trashButton2.classList.add("red");
    trashButton2.innerText = "Hapus Buku";
    trashButton2.addEventListener("click", () => {
      removeBukuFromCompleted(id);
    });
    textContainer.append(checkButton, trashButton2);
  }
  return container;
}

function addBuku() {
  const titleBuku = document.getElementById("inputBookTitle").value;
  const authorBuku = document.getElementById("inputBookAuthor").value;
  const yearBuku = document.getElementById("inputBookYear").value;
  const checkRead = document.getElementById("inputBookIsComplete").checked;
  const generatedID = generateBukuId();
  const bukuObject = generateBukuObject(
    generatedID,
    titleBuku,
    authorBuku,
    yearBuku,
    checkRead
  );
  bukuApps.push(bukuObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBukuToCompleted(bukuId) {
  const bukuTarget = findBuku(bukuId);
  if (bukuTarget == null) return;
  bukuTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBukuFromCompleted(bukuId) {
  const bukuTarget = findBukuIndex(bukuId);
  if (bukuTarget === -1) return;
  bukuApps.splice(bukuTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBukuFromCompleted(bukuId) {
  const bukuTarget = findBuku(bukuId);
  if (bukuTarget == null) return;
  bukuTarget.isCompleted = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function loadBukuFromStorage() {
  const ubahDataBuku = localStorage.getItem(BUKUSTORAGE_KEY);
  let data = JSON.parse(ubahDataBuku);

  if (data !== null) {
    for (const buku of data) {
      bukuApps.push(buku);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBuku();
  });
  if (isStorageExist()) {
    loadBukuFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBukuList = document.getElementById(
    "incompleteBookshelfList"
  );
  const listCompleted = document.getElementById("completeBookshelfList");

  uncompletedBukuList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (bukuItem of bukuApps) {
    const bukuElement = buatBuku(bukuItem);
    if (bukuItem.isCompleted) {
      listCompleted.append(bukuElement);
    } else {
      uncompletedBukuList.append(bukuElement);
    }
  }
});

document.addEventListener(SAVED_BUKU_EVENT, function () {
  console.log(localStorage.getItem(BUKUSTORAGE_KEY));
});
