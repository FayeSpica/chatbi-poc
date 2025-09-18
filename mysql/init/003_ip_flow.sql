-- IP Flow table for network traffic monitoring
-- This file should be executed after 001_schema.sql and 002_sample_data.sql

CREATE TABLE IF NOT EXISTS ip_flow (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  ip VARCHAR(45) NOT NULL,  -- Support both IPv4 and IPv6 addresses
  intf VARCHAR(100) NOT NULL,  -- Network interface name
  bps BIGINT NOT NULL,  -- Bits per second
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (ip),
  INDEX (intf),
  INDEX (timestamp),
  INDEX (bps),
  INDEX (ip, intf),
  INDEX (timestamp, intf)
);

-- Insert sample IP flow data
INSERT INTO ip_flow (ip, intf, bps, timestamp) VALUES
('192.168.1.100', 'eth0', 1048576, '2024-01-15 08:00:00'),  -- 1 Mbps
('192.168.1.101', 'eth0', 2097152, '2024-01-15 08:00:30'),  -- 2 Mbps
('10.0.0.50', 'eth1', 5242880, '2024-01-15 08:01:00'),      -- 5 Mbps
('192.168.1.102', 'eth0', 10485760, '2024-01-15 08:01:30'), -- 10 Mbps
('172.16.0.25', 'eth2', 3145728, '2024-01-15 08:02:00'),    -- 3 Mbps
('192.168.1.100', 'eth0', 1572864, '2024-01-15 08:02:30'),  -- 1.5 Mbps
('10.0.0.51', 'eth1', 7340032, '2024-01-15 08:03:00'),      -- 7 Mbps
('192.168.1.103', 'eth0', 4194304, '2024-01-15 08:03:30'),  -- 4 Mbps
('172.16.0.26', 'eth2', 8388608, '2024-01-15 08:04:00'),    -- 8 Mbps
('192.168.1.104', 'eth0', 6291456, '2024-01-15 08:04:30'),  -- 6 Mbps
('10.0.0.52', 'eth1', 12582912, '2024-01-15 08:05:00'),     -- 12 Mbps
('192.168.1.105', 'eth0', 2621440, '2024-01-15 08:05:30'),  -- 2.5 Mbps
('172.16.0.27', 'eth2', 15728640, '2024-01-15 08:06:00'),   -- 15 Mbps
('192.168.1.106', 'eth0', 9437184, '2024-01-15 08:06:30'),  -- 9 Mbps
('10.0.0.53', 'eth1', 11534336, '2024-01-15 08:07:00'),     -- 11 Mbps
-- IPv6 examples
('2001:db8::1', 'eth0', 20971520, '2024-01-15 08:07:30'),   -- 20 Mbps IPv6
('2001:db8::2', 'eth1', 16777216, '2024-01-15 08:08:00'),   -- 16 Mbps IPv6
('fe80::1', 'lo', 1024000, '2024-01-15 08:08:30'),          -- 1 Mbps loopback IPv6
-- High traffic examples
('192.168.1.200', 'eth0', 104857600, '2024-01-15 08:09:00'), -- 100 Mbps
('10.0.0.100', 'eth1', 1073741824, '2024-01-15 08:09:30'),   -- 1 Gbps
-- Low traffic examples
('192.168.1.10', 'eth0', 512000, '2024-01-15 08:10:00'),     -- 512 Kbps
('172.16.0.10', 'eth2', 256000, '2024-01-15 08:10:30'),      -- 256 Kbps
-- Different interfaces
('192.168.2.100', 'wlan0', 5242880, '2024-01-15 08:11:00'),  -- WiFi interface
('192.168.3.100', 'bond0', 52428800, '2024-01-15 08:11:30'), -- Bonded interface
('10.10.10.100', 'tun0', 2097152, '2024-01-15 08:12:00');    -- VPN tunnel interface