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