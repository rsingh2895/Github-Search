var finalcontent = document.getElementById("table-data");

//Function to generate the XMLHttpRequest
function generateXMLrequest(url, callB1) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.addEventListener("load", function () {
    var responsedata;
    console.log("Request Status: " + request.status);
    responsedata = JSON.parse(request.responseText);
    callB1(responsedata);
  });
  request.send(null);
}

//Function for finding the searched repositories
function getrepositories(tofind, callB2) {
  var url =
    "https://api.github.com/search/repositories?q=" + tofind + "&order=asc";
  generateXMLrequest(url, function (responsedata) {
    callB2(responsedata);
  });
}

//Function for finding the searched users
function getusers(tofind, callB3) {
  var url = "https://api.github.com/search/users?q=" + tofind + "&order=asc";
  generateXMLrequest(url, function (responsedata) {
    callB3(responsedata);
  });
}

//Function for finding the issues related to the repositories
function findissues(reponame) {
  var url = "https://api.github.com/repos/" + reponame + "/issues";
  generateXMLrequest(url, function (responsedata) {
    var data = responsedata;
    var issuesopen = data.filter(function (item) {
      return item.state === "open";
    });
    displayIssue(issuesopen);
  });
}

//The search function
function search() {
  var tofind = document.getElementById("searchbar").value;

  getrepositories(tofind, function (responsedata) {
    var data = responsedata;
    var reposcount = data.total_count;
    document.getElementById("repocount").innerHTML = reposcount;
  });

  getusers(tofind, function (responsedata) {
    var data = responsedata;
    var userscount = data.total_count;
    document.getElementById("usercount").innerHTML = userscount;
  });
  displayUsers();
}

//Function for displaying repositories
function displayRepositories() {
  var tofind = document.getElementById("searchbar").value;
  getrepositories(tofind, function (responsedata) {
    var data = responsedata;
    finalcontent.innerHTML = "<h3>Repositories</h3>";
    data.items.forEach(function (repo) {
      var repostring = "onclick=\"findissues('" + repo.full_name + "')\">";
      finalcontent.innerHTML +=
        "<tr>" +
        "<td " +
        repostring +
        '<h4 id="tabledoc">' +
        repo.full_name +
        "</h4>" +
        "</td>" +
        "</tr>";
    });
  });
}

//Function for displaying users
function displayUsers() {
  var tofind = document.getElementById("searchbar").value;
  getusers(tofind, function (responsedata) {
    var data = responsedata;
    finalcontent.innerHTML = "<h3>Users</h3>";
    data.items.forEach(function (user) {
      var userstring = "onclick=\"userrepos('" + user.login + "')\">";
      finalcontent.innerHTML +=
        "<tr><td>" +
        "<img src=" +
        user.avatar_url +
        ">" +
        "&nbsp&nbsp&nbsp&nbsp" +
        '<span id="usersfont" ' +
        userstring +
        user.login +
        "</span>" +
        "</td></tr>";
    });
  });
}

//Function for displaying issues which are in open state
function displayIssue(issuesopen) {
  finalcontent.innerHTML = "<h3>Open Issues</h3>";
  issuesopen.forEach(function (issue) {
    var issuestring = '<span class="issuesclass">' + issue.state + "</span>";
    finalcontent.innerHTML +=
      "<tr>" +
      "<td>" +
      issuestring +
      "&nbsp&nbsp&nbsp" +
      '<strong style="font-size:14px">' +
      issue.title +
      "</strong>" +
      "</td>" +
      "</tr>";
    getlabel(issue);
  });
}

//Function to display user's repositories
function userrepos(username) {
  var url = "https://api.github.com/users/" + username + "/repos";
  generateXMLrequest(url, function (responsedata) {
    var data = responsedata;
    displayUserrepos(data);
  });
}

//Function to display user's repositories
function displayUserrepos(responsedata) {
  var data = responsedata;
  finalcontent.innerHTML =
    "<h3>" + data[0].owner.login + "'s " + "repositories" + "<h3>";
  data.forEach(function (repo) {
    var userrepostr = '<span class="userrepo">repo</span>';
    finalcontent.innerHTML +=
      "<tr><td>" +
      userrepostr +
      "&nbsp&nbsp&nbsp&nbsp" +
      '<span class="finalrepo">' +
      repo.name +
      "</span>" +
      "</td></tr>";
  });
}

//Function to get labels tagged in the issues of the repository
function getlabel(issue) {
  issue.labels.forEach(function (label) {
    var labelstring =
      '<span class="ilabel" style="background-color:#' +
      label.color +
      '">' +
      label.name +
      "</span>";
    finalcontent.innerHTML += labelstring;
  });
}
