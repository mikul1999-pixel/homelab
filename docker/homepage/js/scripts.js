/*!
* Reusing old bootstrap template
*/

/*!
* Start Bootstrap - Stylish Portfolio v6.0.4 (https://startbootstrap.com/theme/stylish-portfolio)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-stylish-portfolio/blob/master/LICENSE)
*/


function scrollbarFunction() {
  // progress bar & circle for scroll
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  var negscrolled = 100-scrolled
  document.getElementById("myBar").style.height = negscrolled + "%";
  document.getElementById("myCircle").style.top = scrolled + "%";

}

// fade in on scroll
const scrollElements = document.querySelectorAll(".js-scroll");
const elementInView = (el, dividend = 1) => {
  const elementTop = el.getBoundingClientRect().top;
  return (
    elementTop <=
    (window.innerHeight || document.documentElement.clientHeight) / dividend
  );
};
const elementOutofView = (el) => {
  const elementTop = el.getBoundingClientRect().top;
  return (
    elementTop > (window.innerHeight || document.documentElement.clientHeight)
  );
};
const displayScrollElement = (element) => {
  element.classList.add("scrolled");
};
const hideScrollElement = (element) => {
  element.classList.remove("scrolled");
};
const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el, 1.25)) {
      displayScrollElement(el);
    } else if (elementOutofView(el)) {
      hideScrollElement(el)
    }
  })
}

// activate functions on scroll
window.onscroll = function() {
  scrollbarFunction();
  handleScrollAnimation();
};



// auto scroll carousel
function Check_next() {
    var wanted = document.getElementsByName("slider");
    for (var i = 0; i < wanted.length; ++i) {
        if (wanted[i].checked == true) {
            if (i == wanted.length - 1)
            {
                wanted[0].checked = true;
            } else {
                wanted[i + 1].checked = true;
            }
            break;
        }
    }
}

setInterval(function () {
    Check_next()
}, 5000);



// server stat fetch & card formatting
fetch('/assets/stats.json')
  .then(r => r.json())
  .then(data => {
    
    // Carousel Title
    document.getElementById('song-title').innerHTML = `
      <p style="font-family: Roboto; font-weight: 400; color: rgb(104,42,233);"> 
      <br> 
      SERVER STATS
      <br>
      TIMESTAMP: ${data.timestamp}
      </p>
    `;

    // Helper: consistent card style
    const cardStyle = `
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%; 
      min-width: 0; 
      max-width: 350px; 
      height: 200px;
      padding: 20px;
      box-sizing: border-box;
      background: black;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    `;

    // Card 1: Disk
    document.getElementById('song-1').setAttribute("style", cardStyle);
    document.getElementById('song-1').innerHTML = `
      <h3>Disk Usage</h3>
      <p style="color: grey;"><span style="color: rgb(104,42,233);">> </span> ${data.disk.used} / ${data.disk.total}</p>
      <p style="color: grey;"><span style="color: rgb(104,42,233);">> </span> Available: ${data.disk.available}</p>
      <div style="background: grey; border-radius: 5px; overflow: hidden; height: 10px; width: 100%; margin-top: 8px;">
        <div style="
          height: 100%;
          background: rgb(104,42,233);
          width: ${(parseFloat(data.disk.used)/parseFloat(data.disk.total))*100}%;
          transition: width 0.5s;
        "></div>
      </div>
    `;

    // Card 2: Memory
    document.getElementById('song-2').setAttribute("style", cardStyle);
    document.getElementById('song-2').innerHTML = `
      <h3>Memory</h3>
      <p style="color: grey;"><span style="color: rgb(104,42,233);">> </span> ${data.memory.used_MB} / ${data.memory.total_MB} MB</p>
      <p style="color: grey;"><span style="color: rgb(104,42,233);">> </span> Available: ${data.memory.available_MB} MB</p>
      <div style="background: grey; border-radius: 5px; overflow: hidden; height: 10px; width: 100%; margin-top: 8px;">
        <div style="
          height: 100%;
          background: rgb(104,42,233);
          width: ${(parseFloat(data.memory.used_MB)/parseFloat(data.memory.total_MB))*100}%;
          transition: width 0.5s;
        "></div>
      </div>
    `;

    // Card 3: System
    document.getElementById('song-3').setAttribute("style", cardStyle);
    document.getElementById('song-3').innerHTML = `
      <h3>System</h3>
      <p style="color: grey;"><span style="color: rgb(104,42,233);">> </span> Uptime: ${data.uptime}</p>
      <p style="color: grey;"><span style="color: rgb(104,42,233);">> </span> Processes: ${data.processes}</p>
      <p style="color: grey;"><span style="color: rgb(104,42,233);">> </span> Containers: ${data.docker.containers_running}</p>
    `;

  });



// docker stat fetch & table formatting
fetch('/assets/docker-stats.txt')
    .then(r => r.text())
    .then(text => {
      const lines = text.trim().split('\n');
      const table = document.getElementById('dockerhtml');

      // Header row
      const header = lines[0].trim().split(/\s+/);
      const hideCols = ['CPU','MEMORY']; // hide these columns on mobile

      let headerRow = '<tr>' + header.map(h => {
        const cls = hideCols.includes(h) ? ' class="hide-mobile"' : '';
        return `<th${cls}>${h}</th>`;
      }).join('') + '</tr>';

      table.innerHTML = headerRow;

      // Data rows
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].trim().split(/\s+/);

        // Expected layout:
        // NAME | STATUS | uptime(d h m) | CPU | memory(num unit / limit)
        const name = parts[0];
        const status = parts[1];
        const uptime = parts[2] + " " + parts[3] + " " + parts[4]; // e.g. "0d 15h 54m"
        const cpu = parts[5];
        const memory = parts.slice(6).join(" "); // join rest: "30.67MiB / 7.67GiB"

        let rowClass = status.toLowerCase(); // running/exited/paused
        
        const apps = {
          "nextcloud": {
            url: "#",
            containers: ["nextcloud_server", "nextcloud_postgres"],
            icon: "fas fa-cloud"
          },
          "immich": {
            url: "#",
            containers: ["immich_server","immich_postgres","immich_redis","immich_machine_learning"],
            icon: "fas fa-image"
          },
          "portainer": {
            url: "#",
            containers: ["portainer"],
            icon: "fas fa-database"
          },
          "authentik": {
            url: "#",
            containers: ["authentik_server","authentik_worker","authentik_postgres"],
            icon: "fas fa-key"
          },
          "homeassistant": {
            url: "#",
            containers: ["homeassistant"],
            icon: "fas fa-home"
          }
        };

        let appKey = Object.keys(apps).find(key =>
          apps[key].containers.includes(name)
        );
        let appUrl = appKey ? apps[appKey].url : "#";
        let appIcon = appKey ? apps[appKey].icon : "fab fa-ubuntu";

        // Build the table rows
        let row = `<tr class="${rowClass}">
                     <td><a href="${appUrl}" target="_blank" class="docker-link"><i class="${appIcon}"></i> ${name}</a></td>
                     <td>${status}</td>
                     <td>${uptime}</td>
                     <td class="hide-mobile">${cpu}</td>
                     <td class="hide-mobile">${memory}</td>
                   </tr>`;
        table.innerHTML += row;
      }
    })
    .catch(err => {
      document.getElementById('dockerhtml').innerHTML =
        '<tr><td colspan="5">Error loading stats: ' + err + '</td></tr>';
    });



// // auth api fetch
// fetch('/api/whoami')
//   .then(r => r.json())
//   .then(data => {
//     document.getElementById('user-email').innerHTML = `
//       <h1 class="mb-1" style="font-family: Roboto; font-weight: 100; color:rgb(219,219,219);">
//         Hello, <span style="color: rgb(104,42,233);">${data.username}</span>
//       </h1>
//     `;
//     document.getElementById('user-logout').setAttribute("title", `Click to sign out of ${data.email}`);
//     });

// auth api fetch
fetch('/assets/api.json')
  .then(r => r.json())
  .then(data => {
    document.getElementById('user-email').innerHTML = `
      <h1 class="mb-1" style="font-family: Roboto; font-weight: 100; color:rgb(219,219,219);">
        Hello, <span style="color: rgb(104,42,233);">${data.username}</span>
      </h1>
    `;
    document.getElementById('user-logout').setAttribute("title", `Click to sign out of ${data.email}`);
    });



// group apps into tabs
const tabsData = [
  {
    id: "tab2-1",
    label: "All",
    checked: true,
    items: [
      {
        title: "Photo Library",
        description: "Immich application for uploading & categorizing photos + videos. Connected to file library",
        link: "#",
        img: "assets/img/photos_app.png"
      },
      {
        title: "File Library",
        description: "Nextcloud application for uploading files to the server directory. Supports all file types. Connected to photo library",
        link: "#",
        img: "assets/img/docs_app.png"
      },
      {
        title: "Home Automation",
        description: "Home Assistant application for advanced smart home automation across manufacturers.",
        link: "#",
        img: "assets/img/homeassist_app.png"
      },
      {
        title: "Device Syncing_placeholder",
        description: "Syncthing application for live peer-to-peer file sharing between your devices.",
        link: "#",
        img: "assets/img/filesync_app.png"
      },
      {
        title: "Notes_placeholder",
        description: "Standard Notes application for encrypted note-taking across devices.",
        link: "#",
        img: "assets/img/notes_app.png"
      },
      {
        title: "Search for more",
        description: "awesome-selfhosted repository for open-source apps that can be run on a self-hosted server.",
        link: "https://awesome-selfhosted.net",
        img: "assets/img/placeholder_app.png"
      }
    ]
  },
  {
    id: "tab2-2",
    label: "Storage",
    checked: false,
    items: [
      {
        title: "Photo Library",
        description: "Immich application for uploading & categorizing photos + videos. Connected to file library",
        link: "#",
        img: "assets/img/photos_app.png"
      },
      {
        title: "File Library",
        description: "Nextcloud application for uploading files to the server directory. Supports all file types. Connected to photo library",
        link: "#",
        img: "assets/img/docs_app.png"
      },
      {
        title: "Device Syncing_placeholder",
        description: "Syncthing application for live peer-to-peer file sharing between your devices.",
        link: "#",
        img: "assets/img/filesync_app.png"
      },
    ]
  },
  {
    id: "tab2-3",
    label: "Automation",
    checked: false,
    items: [
      {
        title: "Home Automation",
        description: "Home Assistant application for advanced smart home automation across manufacturers.",
        link: "#",
        img: "assets/img/homeassist_app.png"
      }
    ]
  },
  {
    id: "tab2-4",
    label: "Other",
    checked: false,
    items: [
      {
        title: "Notes_placeholder",
        description: "Standard Notes application for encrypted note-taking across devices.",
        link: "#",
        img: "assets/img/notes_app.png"
      },
      {
        title: "Search for more",
        description: "awesome-selfhosted repository for open-source apps that can be run on a self-hosted server.",
        link: "https://awesome-selfhosted.net",
        img: "assets/img/placeholder_app.png"
      }
    ]
  }
];

// Function to generate the HTML
function renderTabs(tabs) {
  const container = document.getElementById("tabs-container");
  container.innerHTML = tabs.map(tab => `
    <div class="tab-2">
      <label for="${tab.id}">${tab.label}</label>
      <input id="${tab.id}" name="tabs-two" type="radio" ${tab.checked ? "checked" : ""}>
      <div>
        <div class="row gx-0">
          ${tab.items.map(item => `
            <div class="col-lg-6">
              <div class="portfolio-item">
                <div class="caption">
                  <div class="caption-content">
                    <div class="h2">${item.title}</div>
                    <p class="mb-3">${item.description}</p>
                    <div><a href="${item.link}" target="_blank">
                      <i class="fas fa-share-square" style="margin-right: 1%;"></i>Click here</a></div>
                  </div>
                </div>
                <img class="img-fluid" src="${item.img}" alt="${item.title}" />
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `).join("");
}

// Call the function
renderTabs(tabsData);
