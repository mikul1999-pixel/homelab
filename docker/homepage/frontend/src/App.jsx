import React, { useState, useEffect, useRef } from "react";


// Images
import dockerLogo from "./assets/docker.png";
import reactLogo from "./assets/reactjs.png";
import immichLogo from "./assets/immich-logo.png";
import nextcloudLogo from "./assets/nextcloud.png";
import haLogo from "./assets/homeassistant.png";
import cfLogo from "./assets/cloudflare.png";
import authentikLogo from "./assets/authentik.png";
import portainerLogo from "./assets/portainer.png";
import gitLogo from "./assets/git.png";
import searchLogo from "./assets/search.svg";


const App = () => {

  
  /* ------- API Fetches ------- */

  // email
  const userEmailState = "user@gmail.com"
  const userNameState = ""
  const [userEmail, setUserEmail] = useState(userEmailState);
  const [userName, setUserName] = useState(userNameState);

  useEffect(() => {
    fetch("/api/whoami")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setUserEmail(data.email);
        setUserName(data.username);
      })
      .catch((err) => {
        console.error("Failed to fetch user info:", err);
      });
  }, []
);

  // system & docker
  const sysInfoState = {
    disk: { used: "1G", total: "100G", available: "99G" },
    memory: { used_MB: "1", total_MB: "100", available_MB: "99" },
    cpu: { load_avg: "0.00, 0.00, 0.00" },
    uptime: "up 1 days, 0 hours, 0 minutes", 
    processes: "0",
    users_logged_in: "0",
    network: {
      hostname: "Loading..."
    },
    docker: { containers_running: "Loading...", images: "0" }
};
  const containersState = [
    { name: "authentik_postgres", uptime: "1d 0h 00m", cpu: "0.00%", memory: "1.00MiB" },
    { name: "authentik_server", uptime: "1d 0h 00m", cpu: "0.00%", memory: "1.00MiB" },
    { name: "authentik_worker", uptime: "1d 0h 00m", cpu: "0.00%", memory: "1.00MiB" },
    { name: "homeassistant", uptime: "1d 0h 00m", cpu: "0.00%", memory: "1.00MiB" },
    { name: "homelab_postgres", uptime: "1d 0h 00m", cpu: "0.00%", memory: "1.00MiB" },
    { name: "homepage_api", uptime: "1d 0h 00m", cpu: "0.00%", memory: "1.00MiB" },
    { name: "homepage", uptime: "1d 0h 00m", cpu: "0.00%", memory: "1.00MiB" },
    { name: "immich_machine_learning", uptime: "1d 0h 00m", cpu: "0.00%", memory: "1.00MiB" },
    { name: "immich_postgres", uptime: "1d 0h 00m", cpu: "0.00%", memory: "1.00MiB" },
    { name: "immich_server", uptime: "1d 0h 00m", cpu: "0.00%", memory: "1.00MiB" },
    { name: "nextcloud_postgres", uptime: "1d 0h 00m", cpu: "0.00%", memory: "1.00MiB" },
    { name: "nextcloud_server", uptime: "1d 0h 00m", cpu: "0.00%", memory: "1.00MiB" },
    { name: "portainer", uptime: "1d 0h 00m", cpu: "0.00%", memory: "1.00MiB" },
    { name: "redis", uptime: "1d 0h 00m", cpu: "0.00%", memory: "1.00MiB" }
];
  const [sysInfo, setSysInfo] = useState(sysInfoState);
  const [containers, setContainers] = useState(containersState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [systemRes, dockerRes] = await Promise.all([
          fetch('/api/system'),
          fetch('/api/docker')
        ]);
        
        const systemData = await systemRes.json();
        const dockerData = await dockerRes.json();
        
        // Sort containers
        const sortedContainers = dockerData.sort((a, b) => a.name.localeCompare(b.name));
        
        setSysInfo(systemData);
        setContainers(sortedContainers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []
);



  // Domain name
  const domainName = "domain"

  // Cloudflare login
  const userLogout = "#"
  

  // Greetings w/ username
  const GREETINGS = {
    morning: [
      "Good morning",
      "Morning",
      "Rise and shine",
    ],
    afternoon: [
      "Hello",
      "Welcome back",
      "Good to see you",
    ],
    evening: [
      "Good evening",
      "Welcome back",
      "Nice to see you",
    ],
    anytime: [
      "Hey there",
      "Howdy",
      "Ready when you are",
    ],
};
  function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
};
  function useRotatingGreeting() {
    const usedRef = React.useRef([]);
    return () => {
      const time = getTimeOfDay();
      const pool = [
        ...GREETINGS.anytime,
        ...GREETINGS[time],
      ];
      const available = pool.filter(
        g => !usedRef.current.includes(g)
      );
      const options = available.length ? available : pool;
      const greeting =
        options[Math.floor(Math.random() * options.length)];
      usedRef.current =
        available.length
          ? [...usedRef.current, greeting]
          : [greeting];
      return greeting;
    };
};
  const getGreeting = useRotatingGreeting();
  const greeting = React.useMemo(
    () => getGreeting(),
    []
  );



  // Format sysInfo
  const makeBar = (used, total, length = 30) => {
    const usedVal = parseFloat(used);   // e.g. "47G" → 47
    const totalVal = parseFloat(total); // e.g. "233G" → 233
    const percent = Math.min(usedVal / totalVal, 1);
    const filled = Math.round(percent * length);
    const empty = length - filled;
    return `[${"#".repeat(filled)}${"-".repeat(empty)}] ${Math.round(percent * 100)}%`;
};

  const SysInfo = ({ info }) => (
    <div>
      <div>{`Containers: ${info.docker.containers_running}`}</div>
      <div>{`Disk (G): ${makeBar(info.disk.used, info.disk.total)}`}</div>
      <div>{`Mem (MB): ${makeBar(info.memory.used_MB, info.memory.total_MB)}`}</div>
      <div>{`CPU Load Avg: ${info.cpu.load_avg}`}</div>
      <div>{`Uptime: ${info.uptime}`}</div>
      <div>{`Processes: ${info.processes}`}</div>
      <div>{`Users Logged In: ${info.users_logged_in}`}</div>
    </div>
);



  // Docker container img paths
  const containerIcons = {
    authentik_postgres: authentikLogo,
    authentik_server: authentikLogo,
    authentik_worker: authentikLogo,
    homeassistant: haLogo,
    homelab_postgres: dockerLogo,
    homepage_api: reactLogo,
    homepage: reactLogo,
    immich_machine_learning: immichLogo,
    immich_postgres: immichLogo,
    immich_server: immichLogo,
    nextcloud_postgres: nextcloudLogo,
    nextcloud_server: nextcloudLogo,
    portainer: portainerLogo,
    redis: dockerLogo
};

  // Container service map
  const containerApps = {
    authentik_postgres: "authentik",
    authentik_server: "authentik",
    authentik_worker: "authentik",
    homeassistant: "ha",
    homelab_postgres: "pl",
    homepage_api: "pl",
    homepage: "pl",
    immich_machine_learning: "photos",
    immich_postgres: "photos",
    immich_server: "photos",
    nextcloud_postgres: "files",
    nextcloud_server: "files",
    portainer: "portainer",
    redis: "pl"
};

  // App icon data
  const iconSections = [
    {
      header: "User",
      items: [
        { icon: immichLogo, link: "#", hoverText: "photos", cmdKey: "photos" },
        { icon: nextcloudLogo, link: "#", hoverText: "files", cmdKey: "files"  },
        { icon: haLogo, link: "#", hoverText: "home assistant", cmdKey: "ha"  },
        { icon: dockerLogo, link: "#", hoverText: "placeholder", cmdKey: "ph"  },
        { icon: dockerLogo, link: "#", hoverText: "placeholder", cmdKey: "ph"  },
        { icon: dockerLogo, link: "#", hoverText: "placeholder", cmdKey: "ph"  },
        { icon: dockerLogo, link: "#", hoverText: "placeholder", cmdKey: "ph"  },
        { icon: searchLogo, link: "#", hoverText: "search for more", cmdKey: "search"  },
      ],
    },
    {
      header: "Admin",
      items: [
        { icon: cfLogo, link: "#", hoverText: "cloudflare", cmdKey: "cloudflare"  },
        { icon: authentikLogo, link: "#", hoverText: "authentik", cmdKey: "authentik"  },
        { icon: portainerLogo, link: "#", hoverText: "portainer", cmdKey: "portainer"  },
        { icon: gitLogo, link: "#", hoverText: "git repo", cmdKey: "git"  },
        { icon: dockerLogo, link: "#", hoverText: "placeholder", cmdKey: "ph"  },
        { icon: dockerLogo, link: "#", hoverText: "placeholder", cmdKey: "ph"  },
        { icon: dockerLogo, link: "#", hoverText: "placeholder", cmdKey: "ph"  },
        { icon: dockerLogo, link: "#", hoverText: "placeholder", cmdKey: "ph"  },
      ],
    },
  ];

  // Flatten icon lookup
  const allIcons = iconSections.flatMap(section => section.items);


  // CLI commands
  const cliCommands = `
> quick start
- ls commands      → list all commands
- ls services      → list all apps
- goto <service>   → jump to app
- stats <service>  → check usage
`.trim();

  // cmd lookups
  const serviceRegistry = Object.fromEntries(
    allIcons
      .filter(item => item.link && item.link !== "#") // skip placeholders
      .map(item => [item.cmdKey.toLowerCase(), item.link])
);

  const friendlyNames = Object.fromEntries(
    allIcons
      .filter(item => item.link && item.link !== "#")
      .map(item => [item.cmdKey.toLowerCase(), item.hoverText])
);

  // Make terminal auto typable
  const textareaRef = useRef(null);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // user starts typing
      if (textareaRef.current && document.activeElement !== textareaRef.current) {
        // trigger --> printable keys
        if (e.key.length === 1 || e.key === "Backspace") {
          textareaRef.current.focus();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);



  // Create commands
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const commands = {
    goto: (args) => {
      const service = args[0]?.toLowerCase();
      if (serviceRegistry[service]) {
        window.open(serviceRegistry[service], "_blank");
        return `Opening ${friendlyNames[service]}...`;
      }
      return `Unknown service: ${service}`;
    },

    stats: (args) => {
      const service = args[0]?.toLowerCase();
      if (!service) return "Usage: stats <service>";
      // containers mapped to the service
      const matched = containers.filter(
        (c) => containerApps[c.name]?.toLowerCase() === service
      );
      if (matched.length === 0) {
        return `No containers found for service: ${service}`;
      }
      let table = `
+----------------------+-----------+-------+-----------+
| Container            | Uptime    | CPU   | Memory    |
+----------------------+-----------+-------+-----------+
`;
      matched.forEach((c) => {
        table += `| ${c.name.padEnd(20)} | ${c.uptime.padEnd(9)} | ${c.cpu.padEnd(
          5
        )} | ${c.memory.padEnd(9)} |\n`;
      });

      table += "+----------------------+-----------+-------+-----------+";
      return table;
    },

    "ls services": () =>
      Object.entries(serviceRegistry)
        .map(([key]) => `- ${friendlyNames[key]} → goto ${key}`)
        .join("\n"),

    "ls commands": () =>
      Object.keys(commands)
        .map((cmd) => `- ${cmd}`)
        .join("\n"),

    clear: () => {
      setOutput([]);
      return "Screen cleared.";
    },
};


  // Handle inputs
  const handleCommand = (cmd) => {
    const normalized = cmd.toLowerCase();
    const [command, ...args] = normalized.split(" ");
    const handler = commands[command] || commands[normalized]; // supports multi-word
    const divider = "~".repeat(70);
    if (handler) {
      const result = handler(args);
      // setOutput([`> ${cmd}`, result]);
      setOutput((prev) => [...prev, `> ${cmd}`, result, divider]);

    } else {
      // setOutput([`> ${cmd}`, "Unknown command"]);
      setOutput((prev) => [...prev, `> ${cmd}`, "Unknown command", divider]);

    }
};

  // shortcut suggestions
  const shortcuts = [
    "goto photos",
    "goto files",
    "ls commands",
    "ls services",
    "clear"
];
  const handleShortcut = (val) => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && shortcuts[num - 1]) {
      setInput(shortcuts[num - 1]);
    }
};



  // autocomplete suggestions (first matching command)
  const [suggestion, setSuggestion] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
    handleShortcut(val);

    if (!val.trim()) {
      // clear if empty
      setSuggestion("");
      return;
    }

    // split input into command + partial arg
    const [cmd, arg] = val.toLowerCase().split(" ");
    if (cmd === "goto" || cmd === "stats") {
      const match = Object.keys(serviceRegistry).find((service) =>
        service.startsWith(arg || "")
      );
      if (match) {
        setSuggestion(`${cmd} ${match}`);
        return;
      }
  }

    // fall back to command suggestions
    const match = Object.keys(commands).find((c) =>
      c.startsWith(val.toLowerCase())
    );
    setSuggestion(match && match !== val.toLowerCase() ? match : "");
};



  // Submit functionality
  const submitCommand = () => {
    handleCommand(input.trim());
    setHistory((prev) => [...prev, input.trim()]);
    setHistoryIndex(-1);
    setInput("");
    setSuggestion("");
};
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitCommand();
    } else if (e.key === "ArrowUp") {  // history
      if (history.length > 0) {
        const newIndex =
          historyIndex <= 0 ? history.length - 1 : historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {  // history
      if (history.length > 0) {
        const newIndex =
          historyIndex >= history.length - 1 ? 0 : historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "Tab") {  // autocomplete (get suggestions)
      e.preventDefault();
      if (suggestion) { 
        setInput(suggestion);
      }
    }
};


  // Mobile styles
  function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isMobile;
};

  const isMobile = useIsMobile();

  // Hover state
  const [hoveredIconKey, setHoveredIconKey] = useState(null);
  const [sendHovered, setSendHovered] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  // Helpers to compute styles on hover
  const getIconStyle = (key) => ({
    ...styles.iconBox,
    ...(hoveredIconKey === key
      ? { opacity: 0.50 }
      : null),
  });

  const getSendButtonStyle = () => ({
    ...styles.sendButton,
    ...(sendHovered ? { opacity: 0.40 } : null),
  });


  return (
    <div style={styles.container}>

      {/* Sidebar */}
      <aside style={{...styles.sidebar,width: isMobile ? "100%" : "320px",}}>
        <h2 style={styles.logo}>{domainName}<span style={styles.accentColor}>.com</span></h2>
        <p style={styles.header}><span style={styles.accentColor}>[</span> Applications <span style={styles.accentColor}>]</span></p>

        {iconSections.map((section, sIdx) => (
          <div key={sIdx} style={styles.section}>
            <h3 style={styles.sectionHeader}>{section.header}</h3>
            <div style={styles.iconGrid}>
              {section.items.map((item, iIdx) => {
                const key = `${sIdx}-${iIdx}`;
                return (
                  <div style={styles.iconContainer}>
                    <a
                      key={key}
                      href={item.link}
                      target="_blank"
                      title={item.hoverText}
                      style={getIconStyle(key)}
                      onMouseEnter={() => setHoveredIconKey(key)}
                      onMouseLeave={() => setHoveredIconKey(null)}
                    >
                      <img src={item.icon} alt={item.hoverText} style={styles.iconImage} />
                    </a> 
                    <p style={styles.iconText}>{item.hoverText}</p>
                  </div>
                  
                );
              })}
            </div>
          </div>
        ))}

        {/* User Profile */}
        <div style={styles.userProfile}>
          <div style={styles.avatar}>{userName.charAt(0).toUpperCase()}</div>
          <div style={styles.userInfo}>
            <p style={styles.userEmail}>{userEmail}</p>
            <a href={userLogout} title={`Click to sign out of ${userEmail}`} style={styles.signOut}>Sign out</a>
          </div>
        </div>

      </aside>

      {/* Main Section */}
      <main style={{...styles.main,display: isMobile ? "none" : "flex",}}>
        <div style={styles.centerContent}>
          <h1 style={styles.title}>{`${greeting}, ${userName}`}</h1>
          {/* <h1 style={styles.title}>Hello, {userName}</h1> */}
          <p style={styles.subtitle}>
            Welcome! Explore apps in the sidebar or try out the terminal
          </p>

          {/* Input area */}
          <div style={styles.inputWrapper}>
            <textarea
              ref={textareaRef}
              value={input}
              // onChange={(e) => setInput(e.target.value)}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={cliCommands}
              style={styles.textarea}
            />
            {suggestion && ( 
              <div style={styles.inputSuggest} > 
                {suggestion} 
              </div>
            )}
            <button
              style={getSendButtonStyle()}
              onMouseEnter={() => setSendHovered(true)}
              onMouseLeave={() => setSendHovered(false)}
              onClick={submitCommand}
            >
             {">_"}

            </button>
          </div>

          {/* Shortcuts */}
          <div style={styles.inputShortcut}>
            {shortcuts.map((s, i) => (
              <div key={i}>
                <span style={styles.accentColor}>[{i + 1}]</span><span style={{marginLeft: "2px",}}>{s}</span>
              </div>
            ))}
          </div>

          {/* Output area */}
          <div style={styles.outputText}>
            {output.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>


          {/* Container table */}
          <div style={styles.tableWrapper}>
            <table style={styles.containerTable}>
              <thead>
                <tr>
                  <th style={styles.thtd}>Name</th>
                  <th style={styles.thtd}>Uptime</th>
                  <th style={styles.thtd}>CPU</th>
                  <th style={styles.thtd}>Memory</th>
                </tr>
              </thead>
              <tbody>
                {containers.map((c, idx) => (
                  <tr
                    key={c.name}
                    style={{
                      ...styles.row,
                      ...(hoveredRow === idx ? styles.rowHover : {})
                    }}
                    onMouseEnter={() => setHoveredRow(idx)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={{ ...styles.thtd, ...styles.nameCell }}>
                      <img
                        src={containerIcons[c.name] || "/icons/default.png"}
                        alt={c.name}
                        style={styles.tableIcon}
                      />
                      {c.name}
                    </td>
                    <td style={styles.thtd}>
                      <div style={styles.uptimeWrapper}>
                        <span style={styles.uptimeCircle}></span>
                        {c.uptime}
                      </div>
                    </td>
                    <td style={styles.thtd}>{c.cpu}</td>
                    <td style={styles.thtd}>{c.memory}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total container count */}
          <div style={styles.footer}>
            <SysInfo info={sysInfo} />
          </div>

        </div>
      </main>
    </div>
  );
};

// CSS styling
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Inter, Source Sans 3, Geist Sans, sans-serif",
    // fontFamily: "Fira Code, JetBrains Mono, monospace",
    backgroundColor: "#262624",
    color: "#aaa8a0",
  },

  sidebar: {
    fontFamily: "JetBrains Mono, Fira Code, IBM Plex Mono, Geist Mono, monospace",
    // width: "320px",
    backgroundColor: "#252523",
    borderRight: "1.5px solid #3c3c38",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    boxSizing: "border-box",
    overflowY: "auto",
  },
  logo: {
    fontSize: "1rem",
    fontWeight: "100",
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "1px solid #3c3c38",
    textAlign: "center",
    color: "#666",
  },
  header: {
    fontSize: "1.5rem",
    fontWeight: "100",
    marginBottom: "20px",
    textAlign: "center",
  },
  accentColor: { 
    color: '#718b5c', 
  }, 
  section: {
    marginBottom: "30px",
  },
  sectionHeader: {
    fontSize: "1rem",
    fontWeight: "300",
    marginBottom: "10px",
    color: "#555",
  },
  iconGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "5px 15px",
  },
  iconBox: {
    backgroundColor: "#30302e",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    padding: "20px",
    cursor: "pointer",
    transition: "opacity 0.2s, background-color 0.2s",
    textDecoration: "none",
    color: "inherit",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "column",
  },
  iconImage: {
    width: "1.5em", 
    height: "1.5em", 
    objectFit: "contain",
  },
  iconText: {
    fontSize: "0.5rem",
    textAlign: "center",
    color: "#aaa8a0",
  },
  userProfile: {
    marginTop: "auto", // push profile to bottom
    display: "flex",
    alignItems: "center",
    paddingTop: "15px",
    borderTop: "1px solid #3c3c38",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#3c3c38",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    marginRight: "10px",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
  },
  userEmail: {
    fontSize: "0.9rem",
    margin: 0,
    color: "#aaa8a0",
  },
  signOut: {
    fontSize: "0.8rem",
    color: "#718b5c",
    textDecoration: "none",
    marginTop: "2px",
  },

  main: {
    flex: 1,
    // display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    boxSizing: "border-box",
  },
  centerContent: {
    textAlign: "center",
    width: "100%",
    maxWidth: "600px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "100",
    marginBottom: "5px",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#666",
    marginBottom: "30px",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  textarea: {
    backgroundColor: "#30302e",
    width: "100%",
    minHeight: "120px",
    padding: "14px 50px 14px 14px", // space for button on the right
    borderRadius: "8px",
    border: "1px solid #3c3c38",
    fontSize: "1rem",
    resize: "none",
    boxSizing: "border-box",
    color: "#aaa8a0",
  },
  sendButton: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#718b5c",
    color: "#ffffffb5",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    opacity: "0.7",
    transition: "opacity 0.2s, background-color 0.2s, color 0.2s",
  },
  inputShortcut: { 
    fontFamily: "monospace",
    color: "#aaa8a0",
    marginTop: "5px",
    marginBottom: "10px",
    display: "flex",
    flexDirection: "row",
    // justifyContent: "center",
    gap: "10px",
    pointerEvents: "none",
    fontSize: "0.8rem",
    whiteSpace: "nowrap",
  },
  outputText: { 
    fontFamily: "JetBrains Mono, Fira Code, IBM Plex Mono, Geist Mono, monospace",
    fontSize: "0.8rem",
    padding: "15px 8px",  
    textAlign: "left", 
    color: "#aaa8a0",
    whiteSpace: "pre-wrap",
    maxHeight: "250px",
    overflowY: "auto",
  },
  inputSuggest: { 
    fontFamily: "monospace",
    color: "#666",
    position: "absolute",
    bottom: "14px",
    left: "14px", 
    pointerEvents: "none",
    fontSize: "0.8rem",
    whiteSpace: "nowrap", // keep suggestion inline
  },

  tableWrapper: {
    fontFamily: "JetBrains Mono, Fira Code, IBM Plex Mono, Geist Mono, monospace",
    maxHeight: "250px",    // scrollable
    overflowY: "auto",
    overflowX: "hidden",   // no horizontal scroll
    borderRadius: "12px",
    border: "1px solid #3c3c38",
    padding: "1rem",
    marginTop: "0px",
    background: "#30302e",
    width: "100%",
    boxSizing: "border-box",
  },
  containerTable: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "auto",
  },
  thtd: {
    padding: "8px 12px",
    fontSize: "0.8rem",
    textAlign: "left",
    color: "#6e6d68",
    borderBottom: "1px solid #555",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  nameCell: {
    display: "flex",
    alignItems: "center",
  },
  tableIcon: {
    width: "1.0em", 
    height: "1.0em", 
    objectFit: "contain",
    marginRight: "8px",
  },
  uptimeWrapper: { 
    display: "flex", 
    alignItems: "center", 
    gap: "6px",
  }, 
  uptimeCircle: { 
    width: "0.5rem", 
    height: "0.5rem", 
    borderRadius: "50%", 
    backgroundColor: "#718b5c", 
    opacity: 0.7,
  }, 
  row: {
    cursor: "default",
  },
  rowHover: {
    opacity: "0.50",
  },
  footer: { 
    fontFamily: "JetBrains Mono, Fira Code, IBM Plex Mono, Geist Mono, monospace",
    fontSize: "0.8rem",
    padding: "15px 8px",
    textAlign: "left",
    color: "#aaa8a0",
  },


};

export default App;
