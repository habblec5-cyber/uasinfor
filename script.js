/********************************
 * NAVIGASI HALAMAN (DOSEN)
 ********************************/
function showPage(pageId) {
  const sections = document.querySelectorAll("main section");
  sections.forEach((s) => s.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

/********************************
 * DATA TREE (PERSISTENT)
 * inilah POHON-nya
 ********************************/
let familyTree = JSON.parse(localStorage.getItem("familyTree")) || {
  text: {
    name: "👳‍♂️ Nabi Muhammad ﷺ",
    title: "Nabi"
  },
  role: "nabi",
  HTMLclass: "green",
  children: []
};

/********************************
 * DFS SEARCH (CARI PARENT)
 ********************************/
function findNode(node, name) {
  if (node.text.name.toLowerCase().includes(name.toLowerCase())) {
    return node;
  }

  if (!node.children) return null;

  for (let child of node.children) {
    const found = findNode(child, name);
    if (found) return found;
  }

  return null;
}

/********************************
 * TAMBAH NODE (FORM DOSEN)
 ********************************/
document
  .getElementById("familyForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const role = document.getElementById("role").value.trim().toLowerCase();
    const parentName = document.getElementById("parent").value.trim();

    let emoji = "👤";
    let color = "blue";

    if (role.includes("ayah") || role.includes("ibu")) {
      emoji = "👩‍🦳";
      color = "blue";
    } else if (role.includes("paman")) {
      emoji = "👨";
      color = "red";
    } else if (role.includes("anak")) {
      emoji = "👶";
      color = "green";
    }

    let parentNode = familyTree;

    if (parentName !== "") {
      parentNode = findNode(familyTree, parentName);

      if (!parentNode) {
        alert("Parent tidak ditemukan");
        return;
      }

      if (parentNode.role === "nabi") {
        alert("Nabi Muhammad ﷺ tidak memiliki anak");
        return;
      }
    }

    parentNode.children.push({
      text: {
        name: `${emoji} ${name}`,
        title: role
      },
      role: role,
      HTMLclass: color,
      children: []
    });

    saveAndRender();
    this.reset();
  });

/********************************
 * DELETE NODE (OPSIONAL)
 ********************************/
function deleteRecursive(node, name) {
  if (!node.children) return;

  node.children = node.children.filter(
    (c) => !c.text.name.toLowerCase().includes(name.toLowerCase())
  );

  node.children.forEach((c) => deleteRecursive(c, name));
}

window.deleteByName = function (name) {
  deleteRecursive(familyTree, name);
  saveAndRender();
};

/********************************
 * SIMPAN + RENDER TREE
 ********************************/
function saveAndRender() {
  localStorage.setItem("familyTree", JSON.stringify(familyTree));

  const visualSection = document.getElementById("visual");
  let treeDiv = document.getElementById("tree");

  if (!treeDiv) {
    treeDiv = document.createElement("div");
    treeDiv.id = "tree";
    treeDiv.style.height = "600px";
    visualSection.appendChild(treeDiv);
  }

  treeDiv.innerHTML = "";

  new Treant({
    chart: {
      container: "#tree",
      rootOrientation: "NORTH",
      nodeAlign: "CENTER",
      connectors: { type: "step" },
      node: { HTMLclass: "node" }
    },
    nodeStructure: familyTree
  });
}

document.addEventListener("DOMContentLoaded", saveAndRender);
