var dbPromised = idb.open("premier-league", 1, function (upgradeDb) {
  var teamsObjectStore = upgradeDb.createObjectStore("teams", {
    keyPath: "id",
  });
  teamsObjectStore.createIndex("post_team", "post_team", {
    unique: false,
  });
});

function saveForLater(team) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction("teams", "readwrite");
      var store = tx.objectStore("teams");
      store.add(team);
      return tx.complete;
    })
    .then(function () {
      M.toast({ html: "Data saved successfully." });
    })
    .catch((err) => {
      M.toast({ html: "The data is already in favorites." });
    });
}

function deleteById(id) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction("teams", "readwrite");
      var store = tx.objectStore("teams");
      store.delete(id);
      return tx.complete;
    })
    .then(function () {
      M.toast({ html: "Data has been deleted!" });
    })
    .catch((err) => {
      M.toast({ html: err });
    });
}

function getAll() {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        var tx = db.transaction("teams", "readonly");
        var store = tx.objectStore("teams");
        return store.getAll();
      })
      .then(function (teams) {
        resolve(teams);
      });
  });
}

function getById(id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        var tx = db.transaction("teams", "readonly");
        var store = tx.objectStore("teams");
        return store.get(id);
      })
      .then(function (team) {
        resolve(team);
      });
  });
}
