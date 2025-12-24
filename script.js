
function showPage(pageId) {
  const sections = document.querySelectorAll("main section");
  const buttons = document.querySelectorAll("nav button");

  sections.forEach(section => section.classList.remove("active"));
  buttons.forEach(btn => btn.classList.remove("active"));

  document.getElementById(pageId).classList.add("active");

  const btn = Array.from(buttons).find(b =>
    b.textContent.toLowerCase().includes(pageId)
  );
  if (btn) btn.classList.add("active");
}

let familyTree = JSON.parse(localStorage.getItem("familyTree")) || {
  name: "Nabi Muhammad",
  children: [
    { name: "Abdullah (Ayah)" },
    { name: "Aminah binti Wahb (Ibu)" }
  ]
};


function renderTree() {
  const visualSection = document.getElementById("visual");
  if (!visualSection) return;

  let container = document.getElementById("tree");
  if (!container) {
    container = document.createElement("div");
    container.id = "tree";
    visualSection.appendChild(container);
  }

  container.innerHTML = "";
  const total = hitungNode(familyTree);
const info = document.createElement("p");
info.innerHTML = "<b>Total Anggota:</b> " + total;
container.appendChild(info);


  function renderNode(node, level = 0) {
    const div = document.createElement("div");
    if (level === 0) div.style.color = "red";
else if (level === 1) div.style.color = "blue";
else div.style.color = "green";
    let icon = "👶";

if (level === 0) icon = "👳";
else if (level === 1) icon = "👨‍👩‍👦";

div.innerHTML = icon + " " + node.name;
const delBtn = document.createElement("button");
delBtn.textContent = "❌";
delBtn.style.marginLeft = "8px";

delBtn.onclick = () => {
  if (!confirm("Hapus anggota ini?")) return;
  deleteNode(node.name);
};

div.appendChild(delBtn);

    div.style.marginLeft = level * 25 + "px";
    div.style.padding = "5px";
    div.style.borderLeft = "2px solid #444";
    container.appendChild(div);

    if (node.children) {
      node.children.forEach(child =>
        renderNode(child, level + 1)
      );
    }
  }

  renderNode(familyTree);
}

function tambahNode() {
  const nama = document.getElementById("nama").value;
  const peran = document.getElementById("peran").value;

  if (nama === "" || peran === "") {
    alert("Nama dan Peran wajib diisi!");
    return;
  }

  familyTree.children.push({
    name: `${nama} (${peran})`
  });
  localStorage.setItem("familyTree", JSON.stringify(familyTree));

  renderTree();

  document.getElementById("nama").value = "";
  document.getElementById("peran").value = "";
}
document.addEventListener("DOMContentLoaded", () => {
  renderTree();
  localStorage.setItem("familyTree", JSON.stringify(familyTree));
  renderTree();
});

function hitungNode(node) {
  let total = 1; // hitung diri sendiri

  if (node.children) {
    node.children.forEach(child => {
      total += hitungNode(child);
    });
  }

  return total;
}
function deleteNode(name) {
  familyTree.children = familyTree.children.filter(
    (child) => child.name !== name
  );

  localStorage.setItem("familyTree", JSON.stringify(familyTree));
  renderTree();
}

