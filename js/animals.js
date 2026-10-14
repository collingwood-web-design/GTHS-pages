(function () {
  var list = document.querySelector("[data-pet-list]");
  if (list) {
    var cards = Array.prototype.slice.call(list.children);
    var count = document.querySelector("[data-pet-count]");
    var empty = document.querySelector("[data-pet-empty]");
    var more = document.querySelector("[data-pet-more]");
    var filters = Array.prototype.slice.call(document.querySelectorAll("[data-pet-filter]"));
    var sorts = Array.prototype.slice.call(document.querySelectorAll("[data-pet-sort]"));
    var pageSize = Number(list.getAttribute("data-page-size")) || 6;
    var shown = pageSize;
    var sortKey = "arrived";

    function matches(card) {
      return filters.every(function (select) {
        var key = select.getAttribute("data-pet-filter");
        return !select.value || card.getAttribute("data-" + key) === select.value;
      });
    }

    function compare(a, b) {
      if (sortKey === "name") return a.dataset.name.localeCompare(b.dataset.name);
      if (sortKey === "age") return Number(a.dataset.age) - Number(b.dataset.age);
      return b.dataset.arrived.localeCompare(a.dataset.arrived);
    }

    function update() {
      var visible = cards.filter(matches).sort(compare);
      cards.forEach(function (card) { card.hidden = true; });
      visible.forEach(function (card, i) {
        list.appendChild(card);
        card.hidden = i >= shown;
      });
      count.textContent = visible.length;
      empty.hidden = visible.length > 0;
      more.parentNode.hidden = visible.length <= shown;
    }

    filters.forEach(function (select) {
      select.addEventListener("change", function () {
        shown = pageSize;
        update();
      });
    });

    sorts.forEach(function (button) {
      button.addEventListener("click", function () {
        sortKey = button.getAttribute("data-pet-sort");
        sorts.forEach(function (b) { b.setAttribute("aria-pressed", String(b === button)); });
        update();
      });
    });

    more.addEventListener("click", function () {
      var firstNew = cards.filter(matches).sort(compare)[shown];
      shown += pageSize;
      update();
      if (firstNew) firstNew.querySelector("a").focus();
    });

    update();
  }

  var photo = document.querySelector("[data-pet-photo]");
  var thumbs = Array.prototype.slice.call(document.querySelectorAll("[data-pet-thumb]"));
  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      photo.src = thumb.getAttribute("data-pet-thumb");
      thumbs.forEach(function (t) { t.setAttribute("aria-pressed", String(t === thumb)); });
    });
  });
})();
