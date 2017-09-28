var l = console.log.bind(console);
var q = document.querySelector.bind(document);
var qa = document.querySelectorAll.bind(document);

function attachDestroyHandlers() {
  qa(".destroy").forEach(d => {
    d.onclick = e => {
      e.target.parentNode.parentNode.remove();
      if(qa("li").length === 0) {
        q(".main").style.display = "none";
        q(".footer").style.display = "none";
      }
    };
  });
}

function attachToggleHandlers() {
  qa(".toggle").forEach(t => {
    t.onchange = _ => {
      var el = t.parentNode.parentNode;
      el.className = el.className === "" ? "completed" : "";
      var c = qa("li").length - qa(".completed").length;
      q(".todo-count > strong").textContent = c
    };
  });
}

function attachEditHandlers() {
  qa("li").forEach(i => {
    i.ondblclick = _ => {
      var cn = i.className;
      if(cn !== "editing") {
        i.className = "editing";
        i.querySelector(".edit").onkeypress = e => {
          var t = e.target.value;
          if(e.keyCode === 13 && t) {
            i.className = cn;
            i.querySelector("label").textContent = t;
          }
        };
        i.querySelector(".edit").onblur = e => {
          var t = e.target.value;
          if(t) {
            i.className = cn;
            i.querySelector("label").textContent = t;
          }
        };
      };
    }
  });
}

q(".toggle-all").onclick = e => {
  qa(".toggle").forEach(t => {
    var el = t.parentNode.parentNode;
    el.className = e.target.checked ? "completed" : "";
    t.checked = e.target.checked;
    var c = qa("li").length - qa(".completed").length;
    q(".todo-count > strong").textContent = c
  })
};

q(".clear-completed").onclick = _ => {
  qa(".completed").forEach(todo => todo.remove());
  if(qa("li").length === 0) {
    q(".main").style.display = "none";
    q(".footer").style.display = "none";
  }
};

q(".new-todo").onkeypress = e => {
  var t = e.target.value;
  if(e.keyCode === 13 && t) {
    e.target.value = "";
    q(".main").style.display = "block";
    q(".footer").style.display = "block";
    q(".todo-list").insertAdjacentHTML(
      "beforeend",`
      <li>
        <div class="view">
          <input class="toggle" type="checkbox">
          <label>${t}</label>
          <button class="destroy"></button>
        </div>
        <input class="edit" value="${t}">
      </li>
    `);
    var c = qa("li").length - qa(".completed").length;
    q(".todo-count > strong").textContent = c
    attachDestroyHandlers();
    attachToggleHandlers();
    attachEditHandlers();
  }
};

