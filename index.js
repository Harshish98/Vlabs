let chemicals = [];
let selectedChemicalId = null;
let isEditMode = false;

fetch("chemicals.json")
  .then((response) => response.json())
  .then((data) => {
    chemicals = data;
    renderTable();
  })
  .catch((error) => console.error("Error loading JSON:", error));

function renderTable() {
  const tableBody = document.getElementById("chemicalData");
  tableBody.innerHTML = "";
  chemicals.forEach((chemical) => {
    let row = `<tr id="row-${chemical.id}" onclick="selectRow(${chemical.id})">
             <td>
                <div id="tickIcon-${chemical.id}" class="tick">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-2"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div></td>
            <td>${chemical.id}</td>
            <td>${chemical.name}</td>
            <td>${chemical.vendor}</td>
            <td class="border-separate">${chemical.density}</td>
            <td class="border-separate">${chemical.viscosity}</td>
            <td>${chemical.packaging}</td>
            <td>${chemical.packSize}</td>
            <td>${chemical.unit}</td>
            <td class="border-separate">${chemical.quantity}</td>
        </tr>`;
    tableBody.innerHTML += row;
  });
  reset();
}

function selectRow(id) {
  document
    .querySelectorAll("tr")
    .forEach((row) => row.classList.remove("selected"));
  document
    .querySelectorAll(".tick")
    .forEach((tick) => tick.classList.remove("tickActive"));
  const selectedRow = document.getElementById(`row-${id}`);
  selectedRow.classList.add("selected");
  const selectedTick = document.getElementById(`tickIcon-${id}`);
  selectedTick.classList.add("tickActive");
  document.getElementById("editBtn").disabled = false;
  document.getElementById("editBtn").classList.add("editActive");
  document.getElementById("deleteBtn").disabled = false;
  document.getElementById("deleteBtn").classList.add("deleteActive");
  if (id < 15) {
    document.getElementById("moveDownBtn").disabled = false;
    document.getElementById("moveDownBtn").classList.add("moveActive");
  }
  if (id > 1) {
    document.getElementById("moveUpBtn").disabled = false;
    document.getElementById("moveUpBtn").classList.add("moveActive");
  }
  selectedChemicalId = id;
}

function openAddForm() {
  isEditMode = false;
  resetForm();
  document.getElementById("formTitle").innerText = "Add New Chemical";
  openModal();
}

function editSelectedRow() {
  if (selectedChemicalId === null) {
    alert("Please select a row to edit.");
    return;
  }
  isEditMode = true;
  const chemical = chemicals.find(
    (chemical) => chemical.id === selectedChemicalId
  );
  if (chemical) {
    document.getElementById("editName").value = chemical.name;
    document.getElementById("editVendor").value = chemical.vendor;
    document.getElementById("editDensity").value = chemical.density;
    document.getElementById("editViscosity").value = chemical.viscosity;
    document.getElementById("editPackaging").value = chemical.packaging;
    document.getElementById("editPackSize").value = chemical.packSize;
    document.getElementById("editUnit").value = chemical.unit;
    document.getElementById("editQuantity").value = chemical.quantity;
    document.getElementById("formTitle").innerText = "Edit Chemical";
    openModal();
  }
}

function saveEdit() {
  const name = document.getElementById("editName").value;
  const vendor = document.getElementById("editVendor").value;
  const density = document.getElementById("editDensity").value;
  const viscosity = document.getElementById("editViscosity").value;
  const packaging = document.getElementById("editPackaging").value;
  const packSize = document.getElementById("editPackSize").value;
  const unit = document.getElementById("editUnit").value;
  const quantity = document.getElementById("editQuantity").value;

  if (isEditMode) {
    const chemical = chemicals.find((c) => c.id === selectedChemicalId);
    chemical.name = name;
    chemical.vendor = vendor;
    chemical.density = density;
    chemical.viscosity = viscosity;
    chemical.packaging = packaging;
    chemical.packSize = packSize;
    chemical.unit = unit;
    chemical.quantity = quantity;
  } else {
    const newId =
      chemicals.length > 0 ? chemicals[chemicals.length - 1].id + 1 : 1;
    chemicals.push({
      id: newId,
      name,
      vendor,
      density,
      viscosity,
      packaging,
      packSize,
      unit,
      quantity,
    });
  }

  closeModal();
  renderTable();
}

function deleteSelectedRow() {
  if (selectedChemicalId === null) {
    alert("Please select a row to delete.");
    return;
  }
  if (confirm("Are you sure you want to delete this chemical?")) {
    chemicals = chemicals.filter(
      (chemical) => chemical.id !== selectedChemicalId
    );
    selectedChemicalId = null;
    renderTable();
  }
}

function resetForm() {
  document.getElementById("chemicalEditForm").reset();
}

function openModal() {
  document.getElementById("modalForm").classList.remove("hidden");
  document.getElementById("modalForm").classList.add("modal");
  document.getElementById("content").classList.add("blur");
}

function closeModal() {
  document.getElementById("modalForm").classList.add("hidden");
  document.getElementById("modalForm").classList.remove("modal");
  document.getElementById("content").classList.remove("blur");
  selectedChemicalId = null;
}

function cancelEdit() {
  closeModal();
}

function sortTable(columnIndex) {
  chemicals.sort((a, b) => {
    let valA = Object.values(a)[columnIndex];
    let valB = Object.values(b)[columnIndex];
    return valA > valB ? 1 : valA < valB ? -1 : 0;
  });
  renderTable();
}

function moveRowUp() {
  if (selectedChemicalId === null) {
    alert("Please select a row to move.");
    return;
  }
  const selectedIndex = chemicals.findIndex((c) => c.id === selectedChemicalId);
  if (selectedIndex > 0) {
    [chemicals[selectedIndex - 1], chemicals[selectedIndex]] = [
      chemicals[selectedIndex],
      chemicals[selectedIndex - 1],
    ];
    renderTable();
    selectRow(chemicals[selectedIndex - 1].id);
  }
}

function moveRowDown() {
  if (selectedChemicalId === null) {
    alert("Please select a row to move.");
    return;
  }

  const selectedIndex = chemicals.findIndex((c) => c.id === selectedChemicalId);
  if (selectedIndex < chemicals.length - 1) {
    [chemicals[selectedIndex + 1], chemicals[selectedIndex]] = [
      chemicals[selectedIndex],
      chemicals[selectedIndex + 1],
    ];
    renderTable();
    selectRow(chemicals[selectedIndex + 1].id);
  }
}

function reset() {
  document.getElementById("editBtn").disabled = true;
  document.getElementById("editBtn").classList.remove("editActive");
  document.getElementById("deleteBtn").disabled = true;
  document.getElementById("deleteBtn").classList.remove("deleteActive");
  document.getElementById("moveDownBtn").disabled = true;
  document.getElementById("moveUpBtn").disabled = true;
  document.getElementById("moveUpBtn").classList.remove("moveActive");
  document.getElementById("moveDownBtn").classList.remove("moveActive");
  document.getElementById("tickIcon").classList.remove("tickActive");
}
