/********************************
 * NAVIGASI (DOSEN)
 ********************************/
function showPage(pageId) {
  document
    .querySelectorAll("main section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

/********************************
 * DATA TREE (TREE3 → DIKEMBANGKAN)
 ********************************/
let familyTree = JSON.parse(localStorage.getItem("familyTree")) || {
  text: { name: "👳‍♂️ Nabi Muhammad ﷺ", title: "Nabi" },
  HTMLclass: "green",
  children: []
};

/********************************
 * DFS – CARI NODE
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
 * TAMBAH NODE (FITUR 1–3)
 ********************************/
document.getElementById("familyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const role = document.getElementById("role").value.trim().toLowerCase();
  const parentName = document.getElementById("parent").value.trim();

  let emoji = "👤";
  let color = "blue";

  if (role.includes("ayah")) {
    emoji = "👨";
    color = "blue";
  } else if (role.includes("ibu")) {
    emoji = "👩";
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
  }

  parentNode.children.push({
    text: {
      name: `${emoji} ${name}`,
      title: role
    },
    HTMLclass: color,
    children: []
  });

  saveAndRender();
  this.reset();
});

/********************************
 * DELETE NODE (FITUR 5)
 ********************************/
function deleteRecursive(node, name) {
  if (!node.children) return;

  node.children = node.children.filter(
    (c) => !c.text.name.toLowerCase().includes(name.toLowerCase())
  );

  node.children.forEach((c) => deleteRecursive(c, name));
}

// bisa dipanggil manual dari console:
// deleteByName("Abdullah")
window.deleteByName = function (name) {
  deleteRecursive(familyTree, name);
  saveAndRender();
};

/********************************
 * SIMPAN + RENDER (FITUR 4)
 ********************************/
function saveAndRender() {
  localStorage.setItem("familyTree", JSON.stringify(familyTree));

  const visual = document.getElementById("visual");
  let treeDiv = document.getElementById("tree");

  if (!treeDiv) {
    treeDiv = document.createElement("div");
    treeDiv.id = "tree";
    visual.appendChild(treeDiv);
  }

  treeDiv.innerHTML = "";

  new Treant({
    chart: {
      container: "#tree",
      rootOrientation: "NORTH",
      connectors: { type: "step" },
      node: { HTMLclass: "node" }
    },
    nodeStructure: familyTree
  });
}

document.addEventListener("DOMContentLoaded", saveAndRender);
