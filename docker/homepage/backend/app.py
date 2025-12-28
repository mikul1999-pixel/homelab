from flask import Flask, jsonify, request
import json
import subprocess
import shutil
import psutil
import socket
from datetime import datetime, timedelta

app = Flask(__name__)

DOCKER_PATH = '/usr/bin/docker'


#-------------------------------------------------#
# Helper Functions
#-------------------------------------------------#

def get_battery_info():
    """Get battery percentage and charging state"""
    try:
        battery = psutil.sensors_battery()
        if battery is None:
            return {
                "battery": None,
                "charging": None,
                "error": "No battery found"
            }
        
        return {
            "battery": f"{battery.percent}%",
            "charging": battery.power_plugged
        }
    except Exception as e:
        return {
            "battery": None,
            "charging": None,
            "error": str(e)
        }


def get_uptime():
    """Get system uptime in human-readable format"""
    try:
        boot_time = psutil.boot_time()
        uptime_seconds = datetime.now().timestamp() - boot_time
        uptime_td = timedelta(seconds=int(uptime_seconds))
        
        days = uptime_td.days
        hours, remainder = divmod(uptime_td.seconds, 3600)
        minutes, _ = divmod(remainder, 60)
        
        return f"up {days} days, {hours} hours, {minutes} minutes"
    except:
        return "unknown"


def parse_docker_uptime(uptime_str):
    """Convert Docker uptime to human-readable format"""
    try:
        if 'days' in uptime_str or 'd' in uptime_str:
            parts = uptime_str.replace('About ', '').split()
            days = int(parts[0]) if parts[0].isdigit() else 0
            return f"{days}d"
        return uptime_str
    except:
        return uptime_str


#-------------------------------------------------#
# Final App Routes
#-------------------------------------------------#

@app.route('/api/system', methods=['GET'])
def get_system_info():
    """Get comprehensive system information"""
    
    # Disk usage
    disk = shutil.disk_usage('/')
    disk_info = {
        "used": f"{disk.used // (2**30)}G",
        "total": f"{disk.total // (2**30)}G",
        "available": f"{disk.free // (2**30)}G"
    }
    
    # Memory usage
    memory = psutil.virtual_memory()
    memory_info = {
        "used_MB": str(int(memory.used / (1024**2))),
        "total_MB": str(int(memory.total / (1024**2))),
        "available_MB": str(int(memory.available / (1024**2)))
    }
    
    # CPU load average
    load_avg = psutil.getloadavg()
    cpu_info = {
        "load_avg": f"{load_avg[0]:.2f}, {load_avg[1]:.2f}, {load_avg[2]:.2f}"
    }
    
    # Docker info
    try:
        docker_ps = subprocess.run(
            [DOCKER_PATH, 'ps', '-q'],
            capture_output=True,
            text=True,
            check=False
        )
        containers_running = len(docker_ps.stdout.strip().split('\n')) if docker_ps.stdout.strip() else 0
        
        docker_images = subprocess.run(
            [DOCKER_PATH, 'images', '-q'],
            capture_output=True,
            text=True,
            check=False
        )
        images_count = len(docker_images.stdout.strip().split('\n')) if docker_images.stdout.strip() else 0
        
        docker_info = {
            "containers_running": str(containers_running),
            "images": str(images_count)
        }
    except FileNotFoundError:
        docker_info = {
            "containers_running": "0",
            "images": "0",
            "error": "Docker not found"
        }
    except Exception as e:
        docker_info = {
            "containers_running": "0",
            "images": "0",
            "error": str(e)
        }
    
    # Network info
    network_info = {
        "hostname": socket.gethostname()
    }
    
    # Compile system info
    sys_info = {
        "disk": disk_info,
        "memory": memory_info,
        "cpu": cpu_info,
        "uptime": get_uptime(),
        "processes": str(len(psutil.pids())),
        "users_logged_in": str(len(psutil.users())),
        "network": network_info,
        "docker": docker_info,
        "timestamp": datetime.now().strftime("%a %b %d %I:%M:%S %p %Z %Y")
    }
    
    return jsonify(sys_info)


@app.route('/api/docker', methods=['GET'])
def get_docker_containers():
    """Get Docker container information"""
    try:
        # Get container stats
        result = subprocess.run(
            [DOCKER_PATH, 'stats', '--no-stream', '--format', 
             '{{.Name}}|{{.CPUPerc}}|{{.MemUsage}}|{{.ID}}'],
            capture_output=True,
            text=True,
            timeout=10,
            check=False
        )
        
        # Check for permission errors
        if result.returncode != 0:
            error_msg = result.stderr.strip() if result.stderr else "Unknown error"
            return jsonify({"error": f"Docker error: {error_msg}"}), 500
        
        containers = []
        
        if result.returncode == 0 and result.stdout:
            lines = result.stdout.strip().split('\n')
            
            for line in lines:
                if not line:
                    continue
                    
                parts = line.split('|')
                if len(parts) >= 4:
                    name = parts[0]
                    cpu = parts[1]
                    mem_usage = parts[2].split('/')[0].strip()  # Get only used memory
                    container_id = parts[3]
                    
                    # Get container uptime
                    uptime_result = subprocess.run(
                        [DOCKER_PATH, 'inspect', '--format', 
                         '{{.State.StartedAt}}', container_id],
                        capture_output=True,
                        text=True
                    )
                    
                    uptime = "0d 0h 0m"
                    if uptime_result.returncode == 0:
                        started_at = uptime_result.stdout.strip()
                        try:
                            start_time = datetime.fromisoformat(started_at.replace('Z', '+00:00'))
                            uptime_delta = datetime.now(start_time.tzinfo) - start_time
                            
                            days = uptime_delta.days
                            hours, remainder = divmod(uptime_delta.seconds, 3600)
                            minutes, _ = divmod(remainder, 60)
                            
                            uptime = f"{days}d {hours}h {minutes}m"
                        except:
                            pass
                    
                    containers.append({
                        "name": name,
                        "uptime": uptime,
                        "cpu": cpu,
                        "memory": mem_usage
                    })
        
        return jsonify(containers)
        
    except FileNotFoundError:
        return jsonify({"error": "Docker command not found in PATH"}), 404
    except subprocess.TimeoutExpired:
        return jsonify({"error": "Docker command timed out"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "ok", "timestamp": datetime.now().isoformat()})


@app.route("/api/whoami")
def whoami():
    """Collect Cloudflare Access headers"""
    headers = {
        "email": request.headers.get("Cf-Access-Authenticated-User-Email")
    }

    # Filter out None values
    clean_headers = {k: v for k, v in headers.items() if v is not None}

    # Add username field: default to "user" if email is None
    if "email" in clean_headers:
        clean_headers["username"] = clean_headers["email"].split("@")[0]
    else:
        clean_headers["username"] = "user"

    return jsonify(clean_headers)


@app.route("/api/battery")
def battery():
    """Write battery json to route"""
    return jsonify(get_battery_info())



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port_nbr, debug=False)