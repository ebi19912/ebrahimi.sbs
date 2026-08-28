import os
import sys
import time
import platform
import subprocess
import datetime
import shutil
import json
import re

try:
    import psutil
except ImportError:
    psutil = None

# Network stats cache for calculating speed (KB/s)
LAST_NET_IO = None
LAST_NET_TIME = None

def get_system_metrics():
    """Fetches real-time system metrics (CPU, RAM, Swap, Disk, Network, System Info)."""
    global LAST_NET_IO, LAST_NET_TIME
    
    now = time.time()
    
    # 1. System & OS Info
    uptime_seconds = 0
    boot_time_str = "Unknown"
    if psutil:
        boot_time = psutil.boot_time()
        uptime_seconds = int(now - boot_time)
        boot_time_str = datetime.datetime.fromtimestamp(boot_time).strftime('%Y-%m-%d %H:%M:%S')
    
    uptime_days = uptime_seconds // 86400
    uptime_hours = (uptime_seconds % 86400) // 3600
    uptime_mins = (uptime_seconds % 3600) // 60
    uptime_human = f"{uptime_days}d {uptime_hours}h {uptime_mins}m" if uptime_days > 0 else f"{uptime_hours}h {uptime_mins}m"
    
    # OS Distro / Platform
    os_info = f"{platform.system()} {platform.release()} ({platform.machine()})"
    if hasattr(platform, 'freedesktop_os_release'):
        try:
            os_rel = platform.freedesktop_os_release()
            os_info = f"{os_rel.get('PRETTY_NAME', os_info)}"
        except Exception:
            pass

    # 2. CPU Metrics
    cpu_percent = 0.0
    cpu_cores_logical = os.cpu_count() or 1
    cpu_cores_physical = cpu_cores_logical
    cpu_freq_current = 0
    per_cpu = []
    load_avg = [0.0, 0.0, 0.0]
    
    if psutil:
        cpu_percent = psutil.cpu_percent(interval=None)
        cpu_cores_physical = psutil.cpu_count(logical=False) or cpu_cores_logical
        per_cpu = psutil.cpu_percent(interval=None, percpu=True)
        freq = psutil.cpu_freq()
        if freq:
            cpu_freq_current = int(freq.current)
            
    if hasattr(os, 'getloadavg'):
        try:
            load_avg = [round(x, 2) for x in os.getloadavg()]
        except Exception:
            pass
            
    # 3. RAM & Swap Memory
    ram_total = 0
    ram_used = 0
    ram_free = 0
    ram_percent = 0.0
    ram_cached = 0
    swap_total = 0
    swap_used = 0
    swap_percent = 0.0
    
    if psutil:
        vmem = psutil.virtual_memory()
        ram_total = vmem.total
        ram_used = vmem.used
        ram_free = vmem.available
        ram_percent = vmem.percent
        ram_cached = getattr(vmem, 'cached', 0) or getattr(vmem, 'buffers', 0)
        
        smem = psutil.swap_memory()
        swap_total = smem.total
        swap_used = smem.used
        swap_percent = smem.percent
        
    # 4. Disk Partitions & Usage
    partitions = []
    primary_disk_percent = 0.0
    primary_disk_total = 0
    primary_disk_used = 0
    primary_disk_free = 0
    
    if psutil:
        try:
            parts = psutil.disk_partitions(all=False)
            for p in parts:
                try:
                    usage = psutil.disk_usage(p.mountpoint)
                    partitions.append({
                        'device': p.device,
                        'mountpoint': p.mountpoint,
                        'fstype': p.fstype,
                        'total_gb': round(usage.total / (1024**3), 2),
                        'used_gb': round(usage.used / (1024**3), 2),
                        'free_gb': round(usage.free / (1024**3), 2),
                        'percent': usage.percent
                    })
                    if p.mountpoint in ('/', 'C:\\', 'd:\\'):
                        primary_disk_percent = usage.percent
                        primary_disk_total = usage.total
                        primary_disk_used = usage.used
                        primary_disk_free = usage.free
                except Exception:
                    continue
        except Exception:
            pass
            
    if not primary_disk_total and partitions:
        primary_disk_percent = partitions[0]['percent']
        primary_disk_total = int(partitions[0]['total_gb'] * (1024**3))
        primary_disk_used = int(partitions[0]['used_gb'] * (1024**3))
        primary_disk_free = int(partitions[0]['free_gb'] * (1024**3))
        
    # 5. Network Traffic & Speeds
    net_sent_bytes = 0
    net_recv_bytes = 0
    net_upload_speed_kb = 0.0
    net_download_speed_kb = 0.0
    
    if psutil:
        net_io = psutil.net_io_counters()
        if net_io:
            net_sent_bytes = net_io.bytes_sent
            net_recv_bytes = net_io.bytes_recv
            
            if LAST_NET_IO and LAST_NET_TIME:
                time_diff = max(now - LAST_NET_TIME, 0.1)
                sent_diff = net_sent_bytes - LAST_NET_IO.bytes_sent
                recv_diff = net_recv_bytes - LAST_NET_IO.bytes_recv
                
                net_upload_speed_kb = round((sent_diff / 1024) / time_diff, 1)
                net_download_speed_kb = round((recv_diff / 1024) / time_diff, 1)
                
            LAST_NET_IO = net_io
            LAST_NET_TIME = now

    # 6. Process Count
    process_count = len(psutil.pids()) if psutil else 0

    return {
        'hostname': platform.node(),
        'os_info': os_info,
        'python_version': platform.python_version(),
        'uptime_human': uptime_human,
        'boot_time': boot_time_str,
        'process_count': process_count,
        'cpu': {
            'percent': cpu_percent,
            'cores_logical': cpu_cores_logical,
            'cores_physical': cpu_cores_physical,
            'freq_mhz': cpu_freq_current,
            'per_cpu': per_cpu,
            'load_avg': load_avg
        },
        'ram': {
            'total_gb': round(ram_total / (1024**3), 2),
            'used_gb': round(ram_used / (1024**3), 2),
            'free_gb': round(ram_free / (1024**3), 2),
            'cached_gb': round(ram_cached / (1024**3), 2),
            'percent': ram_percent
        },
        'swap': {
            'total_gb': round(swap_total / (1024**3), 2),
            'used_gb': round(swap_used / (1024**3), 2),
            'percent': swap_percent
        },
        'disk': {
            'primary_percent': primary_disk_percent,
            'total_gb': round(primary_disk_total / (1024**3), 2),
            'used_gb': round(primary_disk_used / (1024**3), 2),
            'free_gb': round(primary_disk_free / (1024**3), 2),
            'partitions': partitions
        },
        'network': {
            'upload_speed_kb': net_upload_speed_kb,
            'download_speed_kb': net_download_speed_kb,
            'sent_mb': round(net_sent_bytes / (1024**2), 2),
            'recv_mb': round(net_recv_bytes / (1024**2), 2)
        }
    }


# ==========================================
# Fail2ban Manager
# ==========================================
class Fail2banManager:
    @staticmethod
    def is_available():
        """Checks if fail2ban-client command or socket is available."""
        if shutil.which('fail2ban-client'):
            return True
        if os.path.exists('/var/run/fail2ban/fail2ban.sock'):
            return True
        return False

    @staticmethod
    def get_status():
        """Gets overall status and list of jails from fail2ban."""
        if not Fail2banManager.is_available():
            return {
                'available': False,
                'running': False,
                'jails': [],
                'total_banned': 0,
                'error': 'fail2ban-client is not installed or not accessible'
            }

        try:
            res = subprocess.run(['fail2ban-client', 'status'], capture_output=True, text=True, timeout=5)
            if res.returncode != 0:
                return {
                    'available': True,
                    'running': False,
                    'jails': [],
                    'total_banned': 0,
                    'error': res.stderr.strip() or 'Fail2ban service is stopped'
                }

            # Parse Jail list: `Jail list:	sshd, nginx-botsearch`
            jails = []
            for line in res.stdout.splitlines():
                if 'Jail list:' in line:
                    raw_jails = line.split('Jail list:')[1].strip()
                    if raw_jails:
                        jails = [j.strip() for j in raw_jails.split(',') if j.strip()]

            # Fetch stats for each jail
            jail_details = []
            total_banned_count = 0
            for jail in jails:
                j_stat = Fail2banManager.get_jail_status(jail)
                jail_details.append(j_stat)
                total_banned_count += j_stat.get('currently_banned', 0)

            return {
                'available': True,
                'running': True,
                'jails': jail_details,
                'jail_names': jails,
                'total_banned': total_banned_count,
                'error': None
            }
        except Exception as e:
            return {
                'available': False,
                'running': False,
                'jails': [],
                'total_banned': 0,
                'error': str(e)
            }

    @staticmethod
    def get_jail_status(jail_name):
        """Gets detailed status for a specific jail."""
        try:
            res = subprocess.run(['fail2ban-client', 'status', jail_name], capture_output=True, text=True, timeout=5)
            if res.returncode != 0:
                return {'name': jail_name, 'currently_banned': 0, 'total_banned': 0, 'banned_ips': []}

            curr_banned = 0
            tot_banned = 0
            banned_ips = []
            
            for line in res.stdout.splitlines():
                if 'Currently banned:' in line:
                    try:
                        curr_banned = int(line.split('Currently banned:')[1].strip())
                    except ValueError:
                        pass
                elif 'Total banned:' in line:
                    try:
                        tot_banned = int(line.split('Total banned:')[1].strip())
                    except ValueError:
                        pass
                elif 'Banned IP list:' in line:
                    raw_ips = line.split('Banned IP list:')[1].strip()
                    if raw_ips:
                        banned_ips = [ip.strip() for ip in raw_ips.split() if ip.strip()]

            return {
                'name': jail_name,
                'currently_banned': curr_banned,
                'total_banned': tot_banned,
                'banned_ips': banned_ips
            }
        except Exception:
            return {'name': jail_name, 'currently_banned': 0, 'total_banned': 0, 'banned_ips': []}

    @staticmethod
    def get_all_banned_ips():
        """Aggregates all banned IPs across all active jails."""
        status = Fail2banManager.get_status()
        if not status['running']:
            return []

        all_banned = []
        for jail in status.get('jails', []):
            for ip in jail.get('banned_ips', []):
                all_banned.append({
                    'ip': ip,
                    'jail': jail['name']
                })
        return all_banned

    @staticmethod
    def ban_ip(ip, jail=None):
        """Bans an IP address manually."""
        if not ip or not re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', ip.strip()):
            return {'success': False, 'message': 'Invalid IPv4 address format'}

        ip = ip.strip()
        
        # If no jail specified, find first available jail
        if not jail:
            status = Fail2banManager.get_status()
            jails = status.get('jail_names', [])
            if not jails:
                return {'success': False, 'message': 'No active Fail2ban jails found'}
            jail = jails[0]

        try:
            res = subprocess.run(['fail2ban-client', 'set', jail, 'banip', ip], capture_output=True, text=True, timeout=5)
            if res.returncode == 0:
                return {'success': True, 'message': f'Successfully banned IP {ip} in jail [{jail}]'}
            else:
                return {'success': False, 'message': res.stderr.strip() or f'Failed to ban IP {ip}'}
        except Exception as e:
            return {'success': False, 'message': f'Error executing ban: {str(e)}'}

    @staticmethod
    def unban_ip(ip, jail=None):
        """Unbans an IP address manually."""
        if not ip:
            return {'success': False, 'message': 'IP is required'}

        ip = ip.strip()
        
        try:
            if jail:
                cmd = ['fail2ban-client', 'set', jail, 'unbanip', ip]
            else:
                cmd = ['fail2ban-client', 'unban', ip]

            res = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
            if res.returncode == 0:
                return {'success': True, 'message': f'Successfully unbanned IP {ip}'}
            else:
                # Try unbanning across all jails if single unban failed
                status = Fail2banManager.get_status()
                for j in status.get('jail_names', []):
                    subprocess.run(['fail2ban-client', 'set', j, 'unbanip', ip], capture_output=True, timeout=3)
                return {'success': True, 'message': f'Processed unban request for {ip}'}
        except Exception as e:
            return {'success': False, 'message': f'Error executing unban: {str(e)}'}


# ==========================================
# Firewall Manager (UFW / iptables)
# ==========================================
class FirewallManager:
    @staticmethod
    def is_available():
        return shutil.which('ufw') is not None

    @staticmethod
    def get_status():
        """Gets UFW status and list of active rules."""
        if not FirewallManager.is_available():
            return {
                'available': False,
                'active': False,
                'rules': [],
                'error': 'UFW (Uncomplicated Firewall) is not installed'
            }

        try:
            res = subprocess.run(['ufw', 'status', 'numbered'], capture_output=True, text=True, timeout=5)
            output = res.stdout.strip()
            
            is_active = 'Status: active' in output
            rules = []
            
            if is_active:
                for line in output.splitlines():
                    match = re.match(r'\[\s*(\d+)\]\s+([^\s]+)\s+(ALLOW|DENY|REJECT|LIMIT)\s+IN\s+(.*)', line, re.IGNORECASE)
                    if match:
                        rule_num, target, action, from_src = match.groups()
                        rules.append({
                            'number': rule_num,
                            'to': target.strip(),
                            'action': action.upper(),
                            'from': from_src.strip()
                        })

            return {
                'available': True,
                'active': is_active,
                'rules': rules,
                'error': None
            }
        except Exception as e:
            return {
                'available': False,
                'active': False,
                'rules': [],
                'error': str(e)
            }

    @staticmethod
    def add_rule(port, protocol='tcp', action='allow', from_ip='any'):
        """Adds a new UFW rule."""
        if not FirewallManager.is_available():
            return {'success': False, 'message': 'UFW is not installed'}

        port = str(port).strip()
        protocol = protocol.lower().strip()
        action = action.lower().strip()
        from_ip = from_ip.strip()

        if action not in ('allow', 'deny', 'reject', 'limit'):
            action = 'allow'

        cmd = ['ufw', action]
        
        if from_ip and from_ip != 'any':
            cmd.extend(['from', from_ip])
            
        if protocol and protocol != 'any':
            cmd.extend(['proto', protocol, 'to', 'any', 'port', port])
        else:
            cmd.append(port)

        try:
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
            if res.returncode == 0:
                return {'success': True, 'message': f'Successfully added firewall rule: {action.upper()} {port}/{protocol}'}
            else:
                return {'success': False, 'message': res.stderr.strip() or 'Failed to add rule'}
        except Exception as e:
            return {'success': False, 'message': f'Error adding rule: {str(e)}'}

    @staticmethod
    def delete_rule(rule_number):
        """Deletes a UFW rule by number."""
        if not FirewallManager.is_available():
            return {'success': False, 'message': 'UFW is not installed'}

        try:
            res = subprocess.run(['ufw', '--force', 'delete', str(rule_number)], capture_output=True, text=True, timeout=5)
            if res.returncode == 0:
                return {'success': True, 'message': f'Rule #{rule_number} deleted successfully'}
            else:
                return {'success': False, 'message': res.stderr.strip() or 'Failed to delete rule'}
        except Exception as e:
            return {'success': False, 'message': f'Error deleting rule: {str(e)}'}


# ==========================================
# Docker Container Manager
# ==========================================
class DockerManager:
    @staticmethod
    def is_available():
        if shutil.which('docker'):
            return True
        if os.path.exists('/var/run/docker.sock'):
            return True
        return False

    @staticmethod
    def get_containers():
        """Lists docker containers with status, image, and ports."""
        if not DockerManager.is_available():
            return {
                'available': False,
                'containers': [],
                'error': 'Docker engine is not accessible'
            }

        try:
            format_str = '{{.ID}}|||{{.Names}}|||{{.Image}}|||{{.Status}}|||{{.Ports}}|||{{.State}}'
            res = subprocess.run(['docker', 'ps', '-a', '--format', format_str], capture_output=True, text=True, timeout=5)
            if res.returncode != 0:
                return {
                    'available': True,
                    'containers': [],
                    'error': res.stderr.strip() or 'Could not communicate with Docker daemon'
                }

            containers = []
            for line in res.stdout.splitlines():
                if '|||' in line:
                    parts = line.split('|||')
                    if len(parts) >= 6:
                        cid, name, image, status, ports, state = parts[:6]
                        containers.append({
                            'id': cid.strip()[:12],
                            'full_id': cid.strip(),
                            'name': name.strip(),
                            'image': image.strip(),
                            'status': status.strip(),
                            'ports': ports.strip() or '-',
                            'state': state.strip().lower() # running, exited, paused
                        })

            return {
                'available': True,
                'containers': containers,
                'error': None
            }
        except Exception as e:
            return {
                'available': False,
                'containers': [],
                'error': str(e)
            }

    @staticmethod
    def container_action(container_id, action):
        """Executes start, stop, or restart on a container."""
        if not DockerManager.is_available():
            return {'success': False, 'message': 'Docker is not accessible'}

        action = action.lower().strip()
        if action not in ('start', 'stop', 'restart', 'pause', 'unpause'):
            return {'success': False, 'message': 'Invalid docker action'}

        try:
            res = subprocess.run(['docker', action, container_id], capture_output=True, text=True, timeout=15)
            if res.returncode == 0:
                return {'success': True, 'message': f'Container {action}ed successfully'}
            else:
                return {'success': False, 'message': res.stderr.strip() or f'Failed to {action} container'}
        except Exception as e:
            return {'success': False, 'message': f'Error executing docker {action}: {str(e)}'}

    @staticmethod
    def get_container_logs(container_id, tail=100):
        """Gets last N lines of logs from a container."""
        if not DockerManager.is_available():
            return 'Docker is not accessible'

        try:
            res = subprocess.run(['docker', 'logs', '--tail', str(tail), container_id], capture_output=True, text=True, timeout=10)
            return res.stdout + res.stderr
        except Exception as e:
            return f"Error reading container logs: {str(e)}"


# ==========================================
# System & Service Log Viewer
# ==========================================
class LogManager:
    LOG_PATHS = {
        'fail2ban': ['/var/log/fail2ban.log'],
        'nginx_access': ['/var/log/nginx/access.log', 'nginx/access.log'],
        'nginx_error': ['/var/log/nginx/error.log', 'nginx/error.log'],
        'syslog': ['/var/log/syslog', '/var/log/messages'],
        'auth': ['/var/log/auth.log', '/var/log/secure']
    }

    @staticmethod
    def get_available_log_sources():
        """Returns list of log sources available on the host."""
        available = ['flask_app']
        for key, paths in LogManager.LOG_PATHS.items():
            for p in paths:
                if os.path.exists(p):
                    available.append(key)
                    break
        return available

    @staticmethod
    def read_log(log_type='fail2ban', lines=100, search_query=None, level=None):
        """Reads and filters log lines."""
        lines = min(max(int(lines), 10), 1000)
        
        candidate_paths = LogManager.LOG_PATHS.get(log_type, [])
        target_file = None
        for p in candidate_paths:
            if os.path.exists(p):
                target_file = p
                break

        if not target_file:
            return [f"Log source '{log_type}' is not found or not accessible at standard locations."]

        try:
            with open(target_file, 'r', encoding='utf-8', errors='ignore') as f:
                all_lines = f.readlines()
                selected_lines = all_lines[-lines:] if len(all_lines) > lines else all_lines
                clean_lines = [l.rstrip('\r\n') for l in selected_lines]
                return LogManager._filter_lines(clean_lines, search_query, level)
        except Exception as e:
            return [f"Error reading {target_file}: {str(e)}"]

    @staticmethod
    def _filter_lines(raw_lines, search_query=None, level=None):
        result = []
        search_lower = search_query.lower() if search_query else None
        level_upper = level.upper() if level and level != 'ALL' else None

        for line in raw_lines:
            if search_lower and search_lower not in line.lower():
                continue
            if level_upper and level_upper not in line.upper():
                continue
            result.append(line)
        return result
