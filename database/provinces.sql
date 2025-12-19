-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 13, 2025 at 02:27 PM
-- Server version: 8.4.3
-- PHP Version: 8.4.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `usp_master`
--

--
-- Dumping data for table `provinces`
--

INSERT INTO `provinces` (`id`, `name`, `code`, `created_at`, `updated_at`) VALUES
('11', 'Aceh', '11', '2025-10-28 09:05:07', NULL),
('12', 'Sumatera Utara', '12', '2025-10-28 09:05:07', NULL),
('13', 'Sumatera Barat', '13', '2025-10-28 09:05:07', NULL),
('14', 'Riau', '14', '2025-10-28 09:05:07', NULL),
('15', 'Jambi', '15', '2025-10-28 09:05:07', NULL),
('16', 'Sumatera Selatan', '16', '2025-10-28 09:05:07', NULL),
('17', 'Bengkulu', '17', '2025-10-28 09:05:07', NULL),
('18', 'Lampung', '18', '2025-10-28 09:05:07', NULL),
('19', 'Kepulauan Bangka Belitung', '19', '2025-10-28 09:05:07', NULL),
('21', 'Kepulauan Riau', '21', '2025-10-28 09:05:07', NULL),
('31', 'Daerah Khusus Ibukota Jakarta', '31', '2025-10-28 09:05:07', NULL),
('32', 'Jawa Barat', '32', '2025-10-28 09:05:07', NULL),
('33', 'Jawa Tengah', '33', '2025-10-28 09:05:07', NULL),
('34', 'Daerah Istimewa Yogyakarta', '34', '2025-10-28 09:05:07', NULL),
('35', 'Jawa Timur', '35', '2025-10-28 09:05:07', NULL),
('36', 'Banten', '36', '2025-10-28 09:05:07', NULL),
('51', 'Bali', '51', '2025-10-28 09:05:07', NULL),
('52', 'Nusa Tenggara Barat', '52', '2025-10-28 09:05:07', NULL),
('53', 'Nusa Tenggara Timur', '53', '2025-10-28 09:05:07', NULL),
('61', 'Kalimantan Barat', '61', '2025-10-28 09:05:07', NULL),
('62', 'Kalimantan Tengah', '62', '2025-10-28 09:05:07', NULL),
('63', 'Kalimantan Selatan', '63', '2025-10-28 09:05:07', NULL),
('64', 'Kalimantan Timur', '64', '2025-10-28 09:05:07', NULL),
('65', 'Kalimantan Utara', '65', '2025-10-28 09:05:07', NULL),
('71', 'Sulawesi Utara', '71', '2025-10-28 09:05:07', NULL),
('72', 'Sulawesi Tengah', '72', '2025-10-28 09:05:07', NULL),
('73', 'Sulawesi Selatan', '73', '2025-10-28 09:05:07', NULL),
('74', 'Sulawesi Tenggara', '74', '2025-10-28 09:05:07', NULL),
('75', 'Gorontalo', '75', '2025-10-28 09:05:07', NULL),
('76', 'Sulawesi Barat', '76', '2025-10-28 09:05:07', NULL),
('81', 'Maluku', '81', '2025-10-28 09:05:07', NULL),
('82', 'Maluku Utara', '82', '2025-10-28 09:05:07', NULL),
('91', 'Papua', '91', '2025-10-28 09:05:07', NULL),
('92', 'Papua Barat', '92', '2025-10-28 09:05:07', NULL),
('93', 'Papua Selatan', '93', '2025-10-28 09:05:07', NULL),
('94', 'Papua Tengah', '94', '2025-10-28 09:05:07', NULL),
('95', 'Papua Pegunungan', '95', '2025-10-28 09:05:07', NULL),
('96', 'Papua Barat Daya', '96', '2025-10-28 09:05:07', NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
