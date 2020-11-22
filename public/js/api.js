const baseUrl = "https://api.football-data.org/v2";
const token = "473b76ba39734ad7bd910daba3ea7862";
const idLiga = 2021;
const options = { headers: { "X-Auth-Token": token } };
let teamData;
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(error) {
  console.log("Error : " + error);
}

function getData(endpoint) {
  return fetch(endpoint, options).then(status).then(json);
}

function getTeams() {
  Loader(true);

  getData(`${baseUrl}/competitions/${idLiga}/teams`, options)
    .then(function (data) {
      teamData = data;
      let teamsHTML = "";
      data.teams.forEach(function (team) {
        teamsHTML += `
              <div class="col s12 m6 l4">
                <div class="card">
                  <div class="card-content">
                    <div class="center"><img width="100" height="100" src="${team.crestUrl}" alt="${team.crestUrl}"></div>
                    <div class="center flow-text">${team.name}</div>
                    <div class="center"><a href="${team.website}" target="_blank">Go to website</a></div>
                  </div>
                  <div class="card-action center-align">
                      <a class="waves-effect waves-light btn-small" onclick="savedTeam('${team.id}')">Add to favorite</a>
                  </div>
                </div>
              </div>
            `;
      });
      document.getElementById("teams").innerHTML = teamsHTML;
      Loader(false);
    })
    .catch((error) => {
      Loader(false);
    });
}

function getStandings() {
  Loader(true);

  getData(`${baseUrl}/competitions/${idLiga}/standings`, options)
    .then(function (data) {
      let standingsHTML = "";
      data.standings[0].table.forEach(function (item) {
        standingsHTML += `
                      <tr>
                        <td>${item.position}. ${item.team.name}</td>
                        <td>${item.playedGames}</td>
                        <td>${item.won}</td>
                        <td>${item.draw}</td>
                        <td>${item.lost}</td>
                        <td>${item.goalsAgainst}</td>
                        <td>${item.goalsFor}</td>
                        <td>${item.goalDifference}</td>
                        <td>${item.points}</td>
                        <td>
                        <div class="row">${customForm(item.form)}</div>
                        </td>
                      </tr>
                      `;
      });
      document.getElementById("standings").innerHTML = standingsHTML;
      Loader(false);
    })
    .catch((error) => {
      Loader(false);
    });
}

function getSavedTeams() {
  Loader(true);
  getAll().then(function (teams) {
    // Menyusun komponen card artikel secara dinamis
    let teamsHTML = "";

    teams.forEach(function (team) {
      teamsHTML += `
              <div class="col s12 m6 l4">
                <div class="card">
                  <div class="card-content">
                    <div class="center"><img width="100" height="100" src="${team.crestUrl}" alt="${team.crestUrl}"></div>
                    <div class="center flow-text">${team.name}</div>
                    <div class="center"><a href="${team.website}" target="_blank">Go to website</a></div>
                  </div>
                  <div class="card-action center-align">
                      <a class="waves-effect waves-light btn-small" onclick="deletedTeam('${team.id}')">Delete</a>
                  </div>
                </div>
              </div>
                `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("teams").innerHTML = teamsHTML;
    Loader(false);
  });
}

function savedTeam(id) {
  const team = teamData.teams.filter((el) => el.id == id)[0];
  parseInt(team.id);
  saveForLater(team);
}

function deletedTeam(id) {
  deleteById(parseInt(id));
  getSavedTeams();
}

function customForm(string) {
  const result = string.split(",");
  let newResult = "";
  result.forEach((item) => {
    if (item === "W") {
      newResult += `<span style="border: 1px solid black;" class="badge green">W</span>`;
    } else if (item === "D") {
      newResult += `<span style="border: 1px solid black;" class="badge grey">D</span>`;
    } else {
      newResult += `<span style="border: 1px solid black;" class="badge red">L</span>`;
    }
  });
  return newResult;
}

function Loader(status) {
  let html = `<div class="preloader-wrapper medium active">
              <div class="spinner-layer spinner-green-only">
                <div class="circle-clipper left">
                  <div class="circle"></div>
                </div><div class="gap-patch">
                  <div class="circle"></div>
                </div><div class="circle-clipper right">
                  <div class="circle"></div>
                </div>
              </div>
              </div>`;
  if (status) {
    document.getElementById("loader").innerHTML = html;
  } else {
    document.getElementById("loader").innerHTML = "";
  }
}
