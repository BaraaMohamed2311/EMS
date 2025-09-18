-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: ems_db
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `employee_perms`
--


DROP TABLE IF EXISTS employee_perms;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE employee_perms (
  `perm_id` int NOT NULL,
  `emp_id` int NOT NULL,
  UNIQUE KEY `perm_id` (`perm_id`,`emp_id`),
  KEY `emp_id` (`emp_id`),
  CONSTRAINT `employee_perms_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`emp_id`),
  CONSTRAINT `employee_perms_ibfk_2` FOREIGN KEY (`perm_id`) REFERENCES `perms` (`perm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_perms`
--



INSERT INTO `employee_perms` VALUES (1,1200),(2,1200),(3,1200),(4,1200),(5,1200),(6,1200),(7,1200),(1,1199),(3,1199);



--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `emp_id` int NOT NULL,
  `emp_name` varchar(40) DEFAULT NULL,
  `emp_salary` int NOT NULL DEFAULT 0,
  `emp_abscence` int NOT NULL DEFAULT 0,
  `emp_bonus` int NOT NULL DEFAULT 0,
  `emp_rate` int NOT NULL DEFAULT 0,
  `emp_title` varchar(30) DEFAULT NULL,
  `emp_specialty` varchar(30) DEFAULT NULL,
  `emp_email` varchar(50) DEFAULT NULL,
  `emp_password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`emp_id`),
  UNIQUE KEY `emp_email` (`emp_email`),
  UNIQUE KEY `emp_email_2` (`emp_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--



--
-- Table structure for table `perms`
--

DROP TABLE IF EXISTS `perms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perms` (
  `perm_id` int NOT NULL,
  `perm_name` varchar(255) NOT NULL,
  PRIMARY KEY (`perm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perms`
--



INSERT INTO `perms` VALUES (1,'Modify Data'),(2,'Modify Salary'),(3,'Display Salary'),(4,'Accept Registered'),(5,'Modify Perms'),(6,'Modify Role'),(7,'Delete User');



--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `emp_id` int NOT NULL,
  `emp_email` varchar(50) NOT NULL,
  `role_name` enum('Employee','SuperAdmin','Admin') NOT NULL,
  PRIMARY KEY (`emp_id`,`role_name`),
  CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employees` (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--



INSERT INTO `roles` VALUES (1200,'baraamohamed2311@gmail.com','SuperAdmin'),(1199,'hany.aziz7480@gmail.com','Admin');



--
-- Table structure for table `unregistered_employees`
--

DROP TABLE IF EXISTS `unregistered_employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unregistered_employees` (
  `emp_id` int NOT NULL AUTO_INCREMENT,
  `emp_name` varchar(40) DEFAULT NULL,
  `emp_title` varchar(30) DEFAULT NULL,
  `emp_specialty` varchar(30) DEFAULT NULL,
  `emp_password` varchar(255) DEFAULT NULL,
  `emp_email` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`emp_id`),
  UNIQUE KEY `emp_email` (`emp_email`),
  UNIQUE KEY `emp_email_2` (`emp_email`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unregistered_employees`
--



INSERT INTO `unregistered_employees` (emp_id, emp_name, emp_title, emp_specialty, emp_email, emp_password) VALUES(1,'Ali Hamed','Scientist','Data','ali.hamed2464@gmail.com','$2b$12$XUxExC4fNH59oWlS69ddEOTXSiNhx5DuU7HFYnVhCoOxiY15j0YK2'),(2,'Mostafa Zaki','CEO','Management','mostafa.zaki3353@gmail.com','$2b$12$pLqeAPIdVH9g/WH2p89LfuOc.vtjSErXiYb8TPQKQ0do5XZQNl6ee'),(3,'Zein Yasser','Developer','Front-End','zein.yasser8384@gmail.com','$2b$12$xg6cHBT.woeF6SVUO5n.6Ob6TWwaDR2h80ydMPrWPdrPuzu4j40IW'),(4,'Mai Mahmoud','Nurse','Intensive Care Nursing','mai.mahmoud876@gmail.com','$2b$12$vIRxsbV.D6N6tGiGSdokBeiJw/tUGd3uQgiRg2/mldb6EKEhe5XAa'),(5,'Sara Hany','Surgeon','ENT Surgery','sara.hany7833@gmail.com','$2b$12$XQ.uN2uCitbuEXkyAPJbJ.puHvvfHAupka.wSTexwx/DN5kVGzOqK'),(6,'Youssef Masoud','Cloud Engineer','Cloud','youssef.masoud1354@gmail.com','$2b$12$OiBtxaMKBGIbfMD7DgEpvu2q3p.6wf/y/2KqAgFlGEIjn/YEDFVKi');


/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-26 17:49:51




INSERT INTO `employees` (emp_id, emp_name, emp_title, emp_specialty, emp_email, emp_password) VALUES(1000,'Omar Abdallah','Scientist','Data','omar.abdallah2464@gmail.com','$2b$12$XUxExC4fNH59oWlS69ddEOTXSiNhx5DuU7HFYnVhCoOxiY15j0YK2'),(1001,'Ramy Amin','CEO','Management','ramy.amin3353@gmail.com','$2b$12$pLqeAPIdVH9g/WH2p89LfuOc.vtjSErXiYb8TPQKQ0do5XZQNl6ee'),
(1002,'Ramy Amin','Developer','Front-End','ramy.amin8384@gmail.com','$2b$12$xg6cHBT.woeF6SVUO5n.6Ob6TWwaDR2h80ydMPrWPdrPuzu4j40IW'),
(1003,'Mai Kamal','Nurse','Intensive Care Nursing','mai.kamal876@gmail.com','$2b$12$vIRxsbV.D6N6tGiGSdokBeiJw/tUGd3uQgiRg2/mldb6EKEhe5XAa'),
(1004,'Sara Kamel','Surgeon','ENT Surgery','sara.kamel7833@gmail.com','$2b$12$XQ.uN2uCitbuEXkyAPJbJ.puHvvfHAupka.wSTexwx/DN5kVGzOqK'),
(1005,'Youssef Gamal','Cloud Engineer','Cloud','youssef.gamal1354@gmail.com','$2b$12$OiBtxaMKBGIbfMD7DgEpvu2q3p.6wf/y/2KqAgFlGEIjn/YEDFVKi'),
(1006,'Jessica White','Engineer','Back-End','jessica.white312@gmail.com','$2b$12$4rZHUb4rcLZ4.dgsX7WZruN4i/J0oVwamg7VG45zcnlOvn9vpGXdK'),
(1007,'Jessica White','CEO','Management','jessica.white5130@gmail.com','$2b$12$7ps05h9X1ql67qu012K2/O7b8lymZwvso2gCvyeKqZINCnqXI6F/O'),
(1008,'Youssef Gamal','CEO','Management','youssef.gamal7584@gmail.com','$2b$12$uzVRqESBMD9eYIKhGQKV.OiF1/8ZhS1GdHjNvb8qyx/UUwRja4bZy'),
(1009,'Tarek Ismail','Developer','Front-End','tarek.ismail4486@gmail.com','$2b$12$UifOgRO.CxcSJRelOK.mYObM3fOqgm02PO613VSVgn9vZhvK10/LW'),
(1010,'Khaled Naguib','DevOps Engineer','Automation','khaled.naguib7782@gmail.com','$2b$12$/MtO8.2ZtMJepwnfaWEbLOPbRwtPgDFrfOffrsBbhIYV3YaePsbdS'),
(1011,'Nada Fahmy','CEO','Management','nada.fahmy6580@gmail.com','$2b$12$kzCtlaMfkCZOiP8Do.rIduczo1oIZVRcbIALYdijimrQymH6NIFdq'),
(1012,'Tarek Ismail','Designer','UI/UX','tarek.ismail2571@gmail.com','$2b$12$XkJbyGfq8Mcclfr.cpVHYucZqoXAuAjh9pV0AuyQtt/RvucKx5UEa'),
(1013,'Mariam Kamal','Developer','Full-Stack','mariam.kamal3182@gmail.com','$2b$12$EsZkvOQ2U1fi4SfgaXu.T.5KErRITq.pJQDcPQq0Pmumy56LM.8ya'),
(1014,'Nada Fahmy','Developer','Front-End','nada.fahmy9785@gmail.com','$2b$12$yLKOyAvQLXMc5GFRhVPR/.iOMW46J1WyfyI1dSdUV01RQgNBagw0u'),
(1015,'Tarek Ismail','Scientist','Data','tarek.ismail7558@gmail.com','$2b$12$gcxPdbWjBIhsV//ruzMomuSOta50UclEFS8V4Ex9GFUM2VXBc80xa'),
(1016,'Tarek Ismail','Doctor','Neurology (Brain)','tarek.ismail8613@gmail.com','$2b$12$ybcovZHDUwGZtrv7lqJXuuLk9.Su0np4TrIJvzeqgUWZ9JepePPVi'),
(1017,'Mona Ali','Designer','UI/UX','mona.ali2995@gmail.com','$2b$12$0opkMII0lpS.8M.k7VaGw.KkEGo2H6Jj.jnEjbmsqzgMVESHt073C'),
(1018,'Khaled Naguib','CEO','Management','khaled.naguib2458@gmail.com','$2b$12$2PhjN10hoZ4f9Y/7UaM7YuoJSlw.shMosbxTwqIwC5BMTUzqlMAFS'),
(1019,'Youssef Gamal','CEO','Management','youssef.gamal9400@gmail.com','$2b$12$hL0ofx8XONwKsmE.l5EQT.nhSNpjqcSGfm0q2c7esYSWTCxBIRVYG'),
(1020,'Jane Doe','HR','HR','jane.doe6331@gmail.com','$2b$12$bfyheO2oYzvi/qK5t2ozZOAOm2.HBHHP77iEg6tZ2arLfHEVbm24a'),
(1021,'Ramy Amin','Cloud Engineer','Cloud','ramy.amin9290@gmail.com','$2b$12$CVS7/CpBpBPC3ZzyCAgiqOm1PBcEcmNT8U538I2MELPxCM.AIKbr6'),
(1022,'Ramy Amin','Scientist','Data','ramy.amin6070@gmail.com','$2b$12$MafDu6aVcld7BGPQc9ysy.gPXgUr/SNe94Lxxrrzm6MRIw239GIZ6'),
(1023,'Youssef Gamal','Engineer','Front-End','youssef.gamal8306@gmail.com','$2b$12$Po8r2BlloVbA0kqK8LBBcOehkK3apuqekp9x3HJi6hJTGavDASVgi'),
(1024,'Nada Fahmy','Nurse','Emergency Room Nursing','nada.fahmy598@gmail.com','$2b$12$TQpdIhxAxfSNK9ajpAkWSethLsxD23tAWkNIOCriAyicJOdHzMpwO'),
(1025,'Jessica White','Cloud Engineer','Cloud','jessica.white5866@gmail.com','$2b$12$XZ7YChmJITtcCLnjBQB3HeWiXsBYc5HBugBIeSnS3UGg4dUELLFCS'),
(1026,'Lara Khalil','HR','HR','lara.khalil8735@gmail.com','$2b$12$cQwxaoDy2j5Cj26t20jnNe08As4VvksX0MGOAA//SRq7DaO5YpTKC'),
(1027,'Hany Aziz','Intern','Front-End','hany.aziz9376@gmail.com','$2b$12$YHCw8HKFypCo2R0DphrlaeWYCQ7Mxo7oy0JiTNxP0hP/L6fp3h/N6'),
(1028,'Ramy Amin','Scientist','Data','ramy.amin5758@gmail.com','$2b$12$WOhKeRgFbsgCB.qCKiFwiuCtdSr4r8WQuGNsla.oDmntchpRM2dpy'),
(1029,'Laura Santiago','Surgeon','Brain Surgery','laura.santiago1253@gmail.com','$2b$12$zVM7NpviMdvJaYgdQjJlIuSdJ3dfgkpdCKPwYLhW7tzgvPh4RKI3m'),
(1030,'Youssef Gamal','DevOps Engineer','Automation','youssef.gamal1349@gmail.com','$2b$12$ezKB6bwjlHm4N0UE6APvmej2iR1XPRWCYSReljgQFs7BfaHC1NwNS'),
(1031,'Youssef Gamal','Cloud Engineer','Cloud','youssef.gamal5146@gmail.com','$2b$12$w7AJbHl44anDVUpRSxP7f.zTkG8HIzhII7nr2OIAGeH8HUjjMSKSi'),
(1032,'Hana Saad','Developer','Back-End','hana.saad8023@gmail.com','$2b$12$KVGG8Kbvxry2z5VM6dflpOSkmasr6aUhxmJG2KBq.XctybOXsAztu'),
(1033,'Michael Brown','DevOps Engineer','Automation','michael.brown2901@gmail.com','$2b$12$s8ZNnAeJwNMfI4uFpuhJ1uH5yOEtiziG.bEM1KxbdIY5/HDuTgWf6'),
(1034,'David Wilson','Nurse','Children''s Nursing','david.wilson3424@gmail.com','$2b$12$MjIRlFJDHrcuLhd80AMPM.guwH1usdRUbn9bHuSKVY/pr0AIHDN8y'),
(1035,'Khaled Naguib','Designer','UI/UX','khaled.naguib8739@gmail.com','$2b$12$c9.oyDD1a8rFp9i0Rnc.gOXnAUdGtk2b.LXCKDLsTmE2nsem5pmru'),
(1036,'Omar Abdallah','Engineer','Front-End','omar.abdallah2285@gmail.com','$2b$12$ded494IpSar5S4.FhtMvTu9xCYD.ozBiLK5f6fqBv4X0QRGHgX4Na'),
(1037,'Omar Abdallah','Engineer','Cloud','omar.abdallah430@gmail.com','$2b$12$JXt41.S2d9//D9usIwYJE.DKIzo.IVBkH7Gb7r8jy7XfyBUeLxUMa'),
(1038,'John Smith','DevOps Engineer','Automation','john.smith8487@gmail.com','$2b$12$pnV89PRTJDELFO0f21X3VeCsbGdrf0FuBHwZzmaFhYNuQC2nhAtd2'),
(1039,'Lara Khalil','Nurse','Intensive Care Nursing','lara.khalil9475@gmail.com','$2b$12$BwoHcvxxQy/aUFvEL37q9.jPIvVloVU93DpZHRmU4vcSpmFug/jjG'),
(1040,'Sara Kamel','CEO','Management','sara.kamel1221@gmail.com','$2b$12$DBaC9byL9DakFCDGhDowDewwVu0ROcAkR6RVc/MgCpvwfW9ywsb4.'),
(1041,'Hany Aziz','Scientist','Data','hany.aziz3767@gmail.com','$2b$12$lSUJLH8gcfwHBKnXNExDi.4rTlOsU9KrLyvDpDIktsSxyetCDzEHy'),
(1042,'Hany Aziz','Intern','Back-End','hany.aziz984@gmail.com','$2b$12$wcI7XAWofBqT2l7Pa5cc5.qOr3dhNzj//q6C7UGgffJs99WafwKp6'),
(1043,'Mona Ali','Developer','Front-End','mona.ali430@gmail.com','$2b$12$aKIEKm4oEmd3jKmr6Af8ueaj1FrgySaZCz2upmpcaJtlwtaeMtVGC'),
(1044,'Sara Kamel','Designer','UI/UX','sara.kamel216@gmail.com','$2b$12$eWXPhFJJqF3lytM009mpyOdKifjvZintKylNo5aYlc4UEcJ7mTzIW'),
(1045,'Amr Halim','Doctor','Neurology (Brain)','amr.halim8092@gmail.com','$2b$12$vy8YDjvI2RNFmYaDM9l6NOzDaZMDM2Jmn82bNzhskmp9wXirZvTjW'),
(1046,'Ramy Amin','Surgeon','Brain Surgery','ramy.amin570@gmail.com','$2b$12$PM3AibYQp0S11BV9CQSDE.fOEURhaERxJDaW0cVyTlPmfFarxkNee'),
(1047,'John Smith','Nurse','Intensive Care Nursing','john.smith4040@gmail.com','$2b$12$YuzAfhpLJgBlhjddfWfOs.idM/aZJyHCa5kp2VBVoVoOH/sikiJyK'),
(1048,'Lara Khalil','DevOps Engineer','Automation','lara.khalil7794@gmail.com','$2b$12$xc10pQeFYekahc3zbjqx/uKlBDFthm8q1EZmIlkruyxxQz.5Ect8W'),
(1049,'Fatma Hassan','Intern','Full-Stack','fatma.hassan4093@gmail.com','$2b$12$49Vq3.fJkwM4hcZASIpKfuh8EjPvi4Tj6py..SJHkIHvaumDNINSy'),
(1050,'John Smith','DevOps Engineer','Automation','john.smith2176@gmail.com','$2b$12$RZzPK.nmle.1Zay3YEKj4e90KbFr5QWTiMDXyxXjkAzAs8ZwA.kFG'),
(1051,'Youssef Gamal','DevOps Engineer','Automation','youssef.gamal9968@gmail.com','$2b$12$c010QX0W1CNDZeOrExNnhuBZRppc/pym3GzQrMO1I8bbuDR/atKv2'),
(1052,'Ziad Fouad','Cloud Engineer','Cloud','ziad.fouad6654@gmail.com','$2b$12$1v1hFtDggcnw9irN2FycT.H.iH5tJmOTSjRC220u3q/y7N356FfJu'),
(1053,'Mai Kamal','Engineer','Cloud','mai.kamal1374@gmail.com','$2b$12$4NAG9v51IGduRvktndLrce9KdXTG9UeqMDJb4OV9nogP1PKUeifxi'),
(1054,'Nada Fahmy','DevOps Engineer','Automation','nada.fahmy7371@gmail.com','$2b$12$.8Xil8bAOi0NbELIbR7UDuIo7ORvBOujr4VDS4xZ5spSyHFvwfKPS'),
(1055,'Jane Doe','Intern','Front-End','jane.doe391@gmail.com','$2b$12$xnjidpijhABr1mlSFA52l.FSG/Bo7YmjBHqVgZAFhf6yDT7c/o0UG'),
(1056,'Jessica White','Engineer','Front-End','jessica.white9993@gmail.com','$2b$12$EX4lHwwCfZdJmb2wr9zD6eIRONrEKiQDvcc7BTW1kp.AiiqWEOCA2'),
(1057,'Ramy Amin','Scientist','Data','ramy.amin3699@gmail.com','$2b$12$4YZ2tFSvatVfKZHMkOqVzOmYUS/O7mHX/bw8ZXaCFhlsmUdhjMJ/i'),
(1058,'Mona Ali','Intern','Front-End','mona.ali7128@gmail.com','$2b$12$zK15GRklS/ZNyWx.F.Ogqu97wO3tdtpKoEj9/ikLhv/ydlulPIFAS'),
(1059,'Michael Brown','Scientist','Data','michael.brown2283@gmail.com','$2b$12$ZxMbece8h7aEJt7x5CK49ewpHf.0ACUdiEV.2.eUOc91JTYXWRR2e'),
(1060,'Laura Santiago','DevOps Engineer','Automation','laura.santiago5203@gmail.com','$2b$12$QlqfQXZmXrePOq69lqKWwOkwC5.JF/oUu4SkAJLWRP9blGLtGdGt2'),
(1061,'Hana Saad','Surgeon','Orthopedic Surgery','hana.saad4853@gmail.com','$2b$12$IrfF822qtzyRm8i81700NuOk6ccKjrKzDZuwx8Bd38AoRNCT3Vtba'),
(1062,'Mariam Kamal','Scientist','Data','mariam.kamal7423@gmail.com','$2b$12$NsGoPy9A8qmFMirCI9qINOQwPy9eEMR/Cg4nMv5UOIEwp7VqRCBo6'),
(1063,'John Smith','Cloud Engineer','Cloud','john.smith6991@gmail.com','$2b$12$M82ReIZMJRdXlTmTeHK8uecvbtJDhTYS.pmE9cuZhJWbEu3GJd1uy'),
(1064,'Laura Santiago','CEO','Management','laura.santiago7910@gmail.com','$2b$12$76bCdFQss111pZJBVpeqiefSbowCTePSMlWu7nFYaeciv23bz9TnO'),
(1065,'Omar Abdallah','Doctor','Cardiology (Heart)','omar.abdallah5254@gmail.com','$2b$12$wJVwf96VSu8OECwlLn2apeekgoBtQB3D8BsQcAmsXCvWC3oGirjIm'),
(1066,'John Smith','Designer','UI/UX','john.smith5331@gmail.com','$2b$12$57PHkAtAeVy9gmkxQBfghOxBUPokSgSIdDnqHjgnmINJdkAnHaERm'),
(1067,'Michael Brown','Doctor','Pulmonology (Lungs)','michael.brown2398@gmail.com','$2b$12$eaiwrodX3apIEEHWPMM5XOBOdVtX3PgNvKboX0GFd58KC4MFDvqXm'),
(1068,'Ramy Amin','Nurse','Emergency Room Nursing','ramy.amin2899@gmail.com','$2b$12$2lAhT5pYoo.r5a08gIxHXer0sAtvVcOQEeMuq3B.iAKtp2T1YIXma'),
(1069,'Hana Saad','Nurse','Cancer Nursing','hana.saad443@gmail.com','$2b$12$eF/86X6e2cLEOnzHFqLmG.ptEhnBr0Oct2.JXmsK0WLKDY585dmaS'),
(1070,'Michael Brown','Designer','UI/UX','michael.brown8052@gmail.com','$2b$12$1f3IHn7ByTMfXry65hzSje92jJ5TMHcBNJYJcToKuI.3Oln5OhxgW'),
(1071,'Jane Doe','Cloud Engineer','Cloud','jane.doe9683@gmail.com','$2b$12$KQrgYXTUDGqL7o32JNTHWOkxg0kJ9RgYFman8fj.ztr3upvLBSg7y'),
(1072,'Nada Fahmy','Nurse','Cancer Nursing','nada.fahmy3427@gmail.com','$2b$12$ihfEY5E1/Zz1areJcA2Hme3wctiWZJAvkOWBzp4OV0i8pBy4pQzLu'),
(1073,'Hany Aziz','Designer','UI/UX','hany.aziz2173@gmail.com','$2b$12$lVQA/N3Iqt9pAec/r.0T/.yqZ7v3ymAV7tubxHhFx6DFwUbr3BQYC'),
(1074,'Mai Kamal','HR','HR','mai.kamal1299@gmail.com','$2b$12$JX4xdDEjwrtiRnhbsB.q9.x/DiQ49Es8VikPJgLZZwgveY3oQo3Wu'),
(1075,'Amr Halim','Doctor','Neurology (Brain)','amr.halim9063@gmail.com','$2b$12$X39J8HyZASAFhTsV8L7OEuRx9XXlukP.9PQQj1I7hUI3FqZtIVgXa'),
(1076,'Lara Khalil','DevOps Engineer','Automation','lara.khalil2453@gmail.com','$2b$12$pBzA2RswtPfo6ORVVecV.u5uajZSAHsOlOt8/nC/r8XlF0KC9oVjW'),
(1077,'Hany Aziz','Doctor','Dermatology (Skin)','hany.aziz6618@gmail.com','$2b$12$6vZDvLD8jYuuFZm5qdprpOGvPHNaNltRWYtvtTGOyeAmpYKg3Q9k.'),
(1078,'Sara Kamel','Developer','Full-Stack','sara.kamel3968@gmail.com','$2b$12$N8ImRl1/FyIoBF62z08fS.6LO/Yljdld80Xgxat/RSp5swheYi4O.'),
(1079,'Ziad Fouad','Engineer','Cloud','ziad.fouad3974@gmail.com','$2b$12$P40gjJ0ANvKMwe4ZO47.OuMtiuXMoVxsA4DEXNhAZeC9Kpv0KFUuy'),
(1080,'John Smith','Surgeon','Heart Surgery','john.smith2873@gmail.com','$2b$12$pQ1q/OHwrChdf/YLq7wx6.UF07povU2AJVzKYESQMo5tvJ.strRR2'),
(1081,'Hany Aziz','Doctor','Neurology (Brain)','hany.aziz3663@gmail.com','$2b$12$T2FsGYD1CLfUTTIN72mpQuNHMcf/amy09dnA76YdIzmEjgtBwhqNq'),
(1082,'Fatma Hassan','Designer','UI/UX','fatma.hassan5457@gmail.com','$2b$12$JLwNTQP5vsEYIq7yVQ9naeM94plMHFKZSDJO2Yt4DoYax0eatyEze'),
(1083,'John Smith','Surgeon','Brain Surgery','john.smith7304@gmail.com','$2b$12$IzGNvdrJGIhuvXsmGr2peewDdQ7U1XYX2e5oZaQ6z3L00ARwmjP7S'),
(1084,'Youssef Gamal','Cloud Engineer','Cloud','youssef.gamal9974@gmail.com','$2b$12$K14wyxd.y5KikAfJR6p/d.BMGyKg1seW3XVdJFwplbeOF2KQ5r1DO'),
(1085,'Ramy Amin','HR','HR','ramy.amin7472@gmail.com','$2b$12$cRrXY8YdkhSXEwOVp7iOaOjECHdbrShcjnrdltS5SBx/MOGm3.biS'),
(1086,'John Smith','Developer','Back-End','john.smith6411@gmail.com','$2b$12$pwyoSvEcvgpB50f5irOO9uEJugoQdrpjlF46IZboibzg9DTlxzYPW'),
(1087,'Fatma Hassan','CEO','Management','fatma.hassan1546@gmail.com','$2b$12$Z2OxHIv2NHEG6IgCThJcN./NiVVGwk9GA81ZKuZTcWeXt1SeY2sGK'),
(1088,'John Smith','Doctor','Pulmonology (Lungs)','john.smith4018@gmail.com','$2b$12$4BN6mrmYkxEd8BzzmCyD5e600LtnciKzi/uqaeUnx6A54xsaxGZz6'),
(1089,'Jane Doe','Surgeon','Plastic Surgery','jane.doe5797@gmail.com','$2b$12$br8vTNsOGtVk2Mnd2kf2w.yEbJjDG9H6aDroMCXtoQoA.m5gR.LWq'),
(1090,'Amr Halim','Doctor','Dermatology (Skin)','amr.halim5624@gmail.com','$2b$12$NdjN146Nr.1twRD3pt.0gOSl4x4FpDPkxk/w/7gxqAGJlasNI3OTm'),
(1091,'Lara Khalil','Doctor','Cardiology (Heart)','lara.khalil3754@gmail.com','$2b$12$bO0pBk8YN3hKpxv/xUTo1OfFQUeYcwLY8JnyBqdwGawRLMpdeUunC'),
(1092,'Ramy Amin','Cloud Engineer','Cloud','ramy.amin9421@gmail.com','$2b$12$yviV8koPHTLAYnJ4RjnKC.V3A.zG/60XfeizIbAdx/mB2i0MMyCnO'),
(1093,'Hana Saad','Nurse','Intensive Care Nursing','hana.saad8781@gmail.com','$2b$12$.xHtWuWugD95ro6B1Vnm1Ojj2JqOlzD1hG/AVjdN1XdbVaECZCAna'),
(1094,'Sara Kamel','Scientist','Data','sara.kamel6346@gmail.com','$2b$12$0guOK9O9m9./xMDvzcBviOeDHchUTzUYYNP3UmWo1NPsiEVLLu.XC'),
(1095,'Ramy Amin','Doctor','Dermatology (Skin)','ramy.amin692@gmail.com','$2b$12$pItm2Cv9.MpPAknXGVGnw.VgMAdi4AYcMmqu.yQW0xzpTAe1n8EHW'),
(1096,'Ziad Fouad','Developer','Front-End','ziad.fouad1451@gmail.com','$2b$12$Js.e6GL8gM8C7Un7PHcuyeliFCqBuWgCOKy79Ck0H6QNggxhp0A.a'),
(1097,'Ramy Amin','DevOps Engineer','Automation','ramy.amin354@gmail.com','$2b$12$I5VCdNUzc8Y545QqXbygJOovDFWyJx0U80toEAmcJNvLkuVryDrqG'),
(1098,'Ramy Amin','Intern','Full-Stack','ramy.amin6453@gmail.com','$2b$12$PIuo3ou/Jr4BMcSDN6cGtOozZVCUAJXQADD1z7V3dwoOtk0CH0Suq'),
(1099,'Mona Ali','Surgeon','Heart Surgery','mona.ali5148@gmail.com','$2b$12$T1ho7q9OLtjAguadPN5/AO1ZS7JYY9Kyb42nN.G.n7r6TIBKFqJN2'),
(1100,'Nada Fahmy','Nurse','Intensive Care Nursing','nada.fahmy2622@gmail.com','$2b$12$u8/0xhsKNprB08VQf80Bf.SY.HnE8.Y0xxEZm9N1Ejmo9opBIYTJK'),
(1101,'Ramy Amin','Intern','Back-End','ramy.amin2061@gmail.com','$2b$12$.PgQQkfXHufp.vR.n0S.Het.xhHBgOo7zm6Nvaq/vfTunErQku5y2'),
(1102,'Mariam Kamal','Doctor','Neurology (Brain)','mariam.kamal8159@gmail.com','$2b$12$RUqjEc8NAAjZv8b7YmpKR.20vgQTavMfpFb/c6JYwP0qDgAWVA.ki'),
(1103,'Omar Abdallah','Surgeon','Heart Surgery','omar.abdallah5453@gmail.com','$2b$12$NGgOH0TiXIX8rFZRP0IukOonf5ST.UrRyRqmQDLqZERuhEZiJWdGG'),
(1104,'Ramy Amin','Intern','Back-End','ramy.amin4786@gmail.com','$2b$12$fUhyVKtlByh83XT8jIucRuqhbJRWyfFoi2H/u/OgPPA7kwGQneJjG'),
(1105,'Nada Fahmy','Doctor','Cardiology (Heart)','nada.fahmy6429@gmail.com','$2b$12$WLAacSrF7cpfwLiD1lMjS.i.oRZq4eSCTYTcOOEhre1qtS9ZyMZM.'),
(1106,'Hana Saad','HR','HR','hana.saad4442@gmail.com','$2b$12$3WYLeSP6Smyb/.o38gVdJuDCrEIzQndBd7fk7RNMrIa0omqTN8qyu'),
(1107,'Youssef Gamal','Scientist','Data','youssef.gamal8341@gmail.com','$2b$12$6bIFF.UIfKC/EGxiAvUDCeScggS834WpOZkg6kWafYmtetQAdPHKS'),
(1108,'Youssef Gamal','Nurse','Children''s Nursing','youssef.gamal634@gmail.com','$2b$12$vUhvJxIq8hOjUFyz3ElwAum2kqnyC5Gp9fN0JuwrBIrUVwx7boJPK'),
(1109,'Hany Aziz','Cloud Engineer','Cloud','hany.aziz392@gmail.com','$2b$12$718dwu37rGY1uCooun9AjuTtkebn6caVH0KKogJCSncQGtXmLsmaq'),
(1110,'Amr Halim','Nurse','Emergency Room Nursing','amr.halim3433@gmail.com','$2b$12$5MNPadUmiBjcqlA5TNnqyu93w7aTlkT5Vt3E5oLX/cLEnwqcJpDIu'),
(1111,'Jane Doe','Developer','Full-Stack','jane.doe9444@gmail.com','$2b$12$FaCjVjn7VHO5cXDb6senfeJZLLmQLR9EqnnB.ThHaYsfV29A3CHOm'),
(1112,'Amr Halim','Engineer','Cloud','amr.halim7464@gmail.com','$2b$12$RTtj1nNd4dNMtxBEqIH2KeIuMiwGRqOcULtop.nB8OLHu5VpjDxHq'),
(1113,'Michael Brown','Designer','UI/UX','michael.brown1156@gmail.com','$2b$12$nrz.5i.UHRKTAplw6Narb.ZKdEFXMLvbg/PiZC/WeyE4mvz/57JSy'),
(1114,'Nada Fahmy','Designer','UI/UX','nada.fahmy8731@gmail.com','$2b$12$.AP92YuoYwcR65Go0anpP.2T48bPVlTAj5h6//MX7mPHudnHXOynm'),
(1115,'Amr Halim','CEO','Management','amr.halim2594@gmail.com','$2b$12$6sw9sbojnAHOJ0qsCHaIT.a3.QQIXHs1Y.gp6I2N3fcSArv89jW1K'),
(1116,'Hana Saad','Nurse','Children''s Nursing','hana.saad7756@gmail.com','$2b$12$/Ihwi6j6xGf3JvWMyPssYe6Ea80LwJpev4l3eIWE875gpl3Z3w5WK'),
(1117,'Mariam Kamal','CEO','Management','mariam.kamal7231@gmail.com','$2b$12$sgcWrSbScriM58ACVkAHDeoc5O0QaoAZZ0HFF2eiYsfVyz9bee83q'),
(1118,'Michael Brown','DevOps Engineer','Automation','michael.brown9544@gmail.com','$2b$12$wTANCpz2cSUTI/W65vIygehSYI7vNllCXF1VRcud/6v5p7dZTzqPK'),
(1119,'Laura Santiago','CEO','Management','laura.santiago6989@gmail.com','$2b$12$a/.JMIUPPRBBQtEfiQYXTu/FCCOmaJDGpYzytTH/eNj.2L8rMOE3u'),
(1120,'Michael Brown','Doctor','Oncology (Cancer)','michael.brown6672@gmail.com','$2b$12$SsoqB7rCVxMBwVy1eyDisuSqOYr01Ym8xKDtTA394HkxWYe.mPi66'),
(1121,'John Smith','Designer','UI/UX','john.smith4905@gmail.com','$2b$12$yDWxkElbAlk77fx/bRhGJ.ynM2Zni.pZiGIJuZTZio4GZs1LEiRM2'),
(1122,'Omar Abdallah','Developer','Back-End','omar.abdallah7216@gmail.com','$2b$12$sCVo5RyVrDvd1FZFuTXrc.Mtf7RvN/epiWTmm4TbcCbm786JHoiXK'),
(1123,'Jessica White','Cloud Engineer','Cloud','jessica.white9023@gmail.com','$2b$12$zmMdpSH.OJ4QJTUX4zai4uUpYlmzpVcJBAB1dZMGoDzS9LdQN7Dky'),
(1124,'Khaled Naguib','Doctor','Pulmonology (Lungs)','khaled.naguib954@gmail.com','$2b$12$VE3oob2R6cCzjrkENpIn.OJ3xn6Pms0r5QWFr.Y1FwG/4P/MDHkOC'),
(1125,'Lara Khalil','DevOps Engineer','Automation','lara.khalil7603@gmail.com','$2b$12$BXNolbEllYG5rfvqOWE92uzNq0LTmotl51eerLzi0Npc/XYcZfb6y'),
(1126,'Ramy Amin','Scientist','Data','ramy.amin6347@gmail.com','$2b$12$axb7NntlNvGMBs/NEgmKHeUOXrIgTNby2ePS2y4149vYYli7fVqZS'),
(1127,'Ziad Fouad','Nurse','Cancer Nursing','ziad.fouad803@gmail.com','$2b$12$/UmvS90Vgp6sJiMVncgQceqLLC4iddbYDLktFUjMOXkV7epLEFBAi'),
(1128,'Mariam Kamal','Designer','UI/UX','mariam.kamal6682@gmail.com','$2b$12$7iYbtJGIoDNBt5Ao50V2NObyMWLmC73Nep8iQKmCD6LXPUcjxKqNi'),
(1129,'Lara Khalil','Designer','UI/UX','lara.khalil6513@gmail.com','$2b$12$1AoxAZjTKhfgmdxq3Q7SS.TFWSzmXmCZSzl/DfJ4RdaTgB9HVLDqu'),
(1130,'Mariam Kamal','Designer','UI/UX','mariam.kamal2592@gmail.com','$2b$12$/48GzSAAtXa81atfyKg2xefqiJWHxB7JJeDeI6xnBNmeD3vCNgSIC'),
(1131,'Fatma Hassan','Developer','Full-Stack','fatma.hassan4757@gmail.com','$2b$12$9O70GslR.03SfppbwaN4GuH5bcszkT0luFqoEb4y0aRshKlukbAx2'),
(1132,'Hana Saad','Engineer','Full-Stack','hana.saad1827@gmail.com','$2b$12$/KoNyITSWMh5A2/fKSmLGOu18orcx0d3kp4XV5sf81mw8s7biTKLG'),
(1133,'Hany Aziz','Intern','Full-Stack','hany.aziz8689@gmail.com','$2b$12$i2xuae3N8WVMthd3A721hu4P2ju.m0cH7PfGU3lmErUmrZCeYYt2S'),
(1134,'Omar Abdallah','Doctor','Pulmonology (Lungs)','omar.abdallah2024@gmail.com','$2b$12$xpV9OHIJKyzCRKKp/snu..1VCPGsZvW7PSj8zgUK1odt931hAEnXa'),
(1135,'Ziad Fouad','CEO','Management','ziad.fouad2172@gmail.com','$2b$12$rU3yhsL40m.Glv5RsPQKK.gir28srplfGXeG.1.zC4GjC7FpathXG'),
(1136,'Michael Brown','DevOps Engineer','Automation','michael.brown149@gmail.com','$2b$12$huzJgkhHQXz8jyK57ERrFeOq1CE4ChWIG4DQW96.rZp3uCGV6Fx1K'),
(1137,'Amr Halim','DevOps Engineer','Automation','amr.halim7717@gmail.com','$2b$12$M7yJA4hMtUyL77UQDuwyDOsjzuMgZDut2rmFZCeKBeLIVIkAECHOC'),
(1138,'Ramy Amin','Developer','Full-Stack','ramy.amin3815@gmail.com','$2b$12$o/P71lzcTZlJsSYl1aduzONkApEAWxnNwgCR0AGKywI7H9124inJa'),
(1139,'Youssef Gamal','Developer','Full-Stack','youssef.gamal799@gmail.com','$2b$12$g/y/Jdfbrsj5G16uzMX7r.WV8YRmVZmoSB9TrxztQpbVT1hX38Uru'),
(1140,'Mariam Kamal','CEO','Management','mariam.kamal1557@gmail.com','$2b$12$YDFXe/6Icxm7EFBLt8d4Qe7C68Rlr.0NBOzVH741ptUt1p89tfMxC'),
(1141,'Hana Saad','Engineer','Cloud','hana.saad624@gmail.com','$2b$12$8jDucPnrMTe0w6qW7nVtZuU./sG.thTwGVyRch76OYIXN./tO4WGO'),
(1142,'Hany Aziz','Nurse','Children''s Nursing','hany.aziz2837@gmail.com','$2b$12$u93p2GWSvdfMl5.kJUI/tuR2QhisrABqiIsuau5rQ6InHxjdAiXNK'),
(1143,'Jessica White','DevOps Engineer','Automation','jessica.white1266@gmail.com','$2b$12$3/zi9CZkxuQU5.KvBlAQ8eUq3we4O7fOOag0rxC.N0IrKKkQODgny'),
(1144,'Jane Doe','Developer','Front-End','jane.doe5697@gmail.com','$2b$12$3DQCCuiv5SaLVsXUJE9OKuTA2h4IBw1NDQi1PJNT9f6VWZRwgvsWy'),
(1145,'Ziad Fouad','Designer','UI/UX','ziad.fouad806@gmail.com','$2b$12$zXvfDXTJMPnbFFg10TltD.QZpDGNyPtAg959Agipl3z7hiCJ6Wnw.'),
(1146,'Mai Kamal','DevOps Engineer','Automation','mai.kamal3070@gmail.com','$2b$12$2ke4E2T3YLRpGjDRSg6wXupZKYqdrYKW3bbnPxEu.PasAujXgYDhW'),
(1147,'Lara Khalil','Intern','Full-Stack','lara.khalil5993@gmail.com','$2b$12$rpZxhrB8EOuFdVVd/X9noO9NTEdWunSuwGLz2h7nZWGa6Ckp/5cOa'),
(1148,'Laura Santiago','Doctor','Pulmonology (Lungs)','laura.santiago2755@gmail.com','$2b$12$WORyISanGuo46Msph9HvMexqbQzDBB9hvOAQ0o11Azkxb4PD8Yl1a'),
(1149,'David Wilson','Cloud Engineer','Cloud','david.wilson9623@gmail.com','$2b$12$LpmDTJkzafAibKtF5lxpUeWNyCT3.laemtftcQ4YU7jNDWhRK5ffi'),
(1150,'Sara Kamel','Scientist','Data','sara.kamel2001@gmail.com','$2b$12$FOTbrfh8p8QzOo/yCrwXYepgcZC/X7IGkPyd3wYrshvcxDe.fYZwW'),
(1151,'Tarek Ismail','HR','HR','tarek.ismail5230@gmail.com','$2b$12$PQQhWM5lOx4Gx44iDELLSux/3aDFozf1o5Cki00CyNOSE2Zoz8Bjm'),
(1152,'Amr Halim','DevOps Engineer','Automation','amr.halim4982@gmail.com','$2b$12$3kUdLlBZUZj6kAKNwk2ekejwfuyloYxH8rbfl5cpg0m0J5Gwy26wO'),
(1153,'Sara Kamel','Nurse','Cancer Nursing','sara.kamel5572@gmail.com','$2b$12$PERAlvs/zt9H6KUZ97Sla.qZON68TxOC4WhIJ74aQ5ls8V6.GxLRS'),
(1154,'David Wilson','Engineer','Front-End','david.wilson367@gmail.com','$2b$12$iQUhwi4mYaKUdMbFDP7iouJs7GiNeDhKLAbgtpBvbhlzDjkHX/WvW'),
(1155,'Hany Aziz','Surgeon','Plastic Surgery','hany.aziz7377@gmail.com','$2b$12$1Fb7zRWCNQS8TXlIe/izy.CN0.ZEtsEMRM6oWYs1sFbgugZ0IR58e'),
(1156,'Hana Saad','Doctor','Pediatrics (Kids)','hana.saad1553@gmail.com','$2b$12$XDpweUlacSMd4fSpO5im4eqT4YT.JWBwqHUb7bweOvUvmH0eAoMSm'),
(1157,'Jessica White','Engineer','Front-End','jessica.white7283@gmail.com','$2b$12$SnMuWhmG5DImVaal8aSCduiMzflTIWfRIvC22cYUcQ24PdLKOXnUO'),
(1158,'Lara Khalil','Surgeon','Orthopedic Surgery','lara.khalil4673@gmail.com','$2b$12$tVjxWyaDsR559id39OC/8ObfL1p0x07eBsHTimEXqLuW3l41Htewe'),
(1159,'Mariam Kamal','DevOps Engineer','Automation','mariam.kamal8670@gmail.com','$2b$12$7E3ngFlCisV5/8HeS8It7.c6l59Eiq4Td24mzIixAMIvKBGqc6iia'),
(1160,'Michael Brown','CEO','Management','michael.brown1934@gmail.com','$2b$12$F1o6IVo2YIUVMH6BjJzRUOQDsaXqGncmBPQF.E7enFC0xkwTRq9XK'),
(1161,'Khaled Naguib','Developer','Full-Stack','khaled.naguib767@gmail.com','$2b$12$4xpembFmmkQIaf4Iw/KvyObRxtKUW5HwBQQ6W/jK9iGaJpsuAM4Mi'),
(1162,'Jane Doe','Doctor','Neurology (Brain)','jane.doe7144@gmail.com','$2b$12$wN59AHMduoEMMGkAJveJ0eoxK0Vmdo.96Y05Q/4wJeY/CkEIC4Ue6'),
(1163,'Amr Halim','Intern','Full-Stack','amr.halim4050@gmail.com','$2b$12$oltJ2.AP2T6Fju05FinT6ePpJAqUC0CxhppX1dNnPUbCAfN0IhUDa'),
(1164,'Hany Aziz','Engineer','Back-End','hany.aziz5541@gmail.com','$2b$12$cvRGVeLfJFMU1VHTs7d5k..jBpNUnFHST4LGfMA1uFquUVpiR3gcy'),
(1165,'Nada Fahmy','Designer','UI/UX','nada.fahmy1438@gmail.com','$2b$12$cSI6WlFJr8zhJYi6C7ZZIuMvO3JpiSZnLjfiKrGZETqY1rynUWm.q'),
(1166,'Youssef Gamal','Scientist','Data','youssef.gamal3499@gmail.com','$2b$12$x1TL6zafHHWzNLWzpUcHDOIIz/45PU1.AcN.51zTfqzxQfZ89wWse'),
(1167,'Laura Santiago','Intern','Front-End','laura.santiago1957@gmail.com','$2b$12$hRR7wMMDSvkpZhPfmAWGzupReW6f/VDblcO14vOYo5gYQw.EtbnVS'),
(1168,'Lara Khalil','Nurse','Intensive Care Nursing','lara.khalil3213@gmail.com','$2b$12$/8dm.n3t8sPgxk9BeA347.pBrKHEW7jGbZ1gYN9FVhLH/zYDPk5hK'),
(1169,'Ziad Fouad','HR','HR','ziad.fouad394@gmail.com','$2b$12$uIguW8UHs2e8jnknDJ6z.uYq.ZxQh.IGa0Kc4vpbvL72X44s35pwO'),
(1170,'Mariam Kamal','DevOps Engineer','Automation','mariam.kamal5384@gmail.com','$2b$12$cNkLKOxp75QJHY9.fYgaTu6bvK/N04qJn2pEbJbEVhTKf9lMgu16m'),
(1171,'Amr Halim','HR','HR','amr.halim2136@gmail.com','$2b$12$9jdiU3koAn009OlfW8ZyIeBABsQpPbGxnqtEBrz0LRJw9NLlm63ae'),
(1172,'Hana Saad','Nurse','Children''s Nursing','hana.saad4019@gmail.com','$2b$12$GM/1kXaZi/KKH3NfoVoc7.MkreceEy4HTPDmzthM3G.p9eg5WYLjy'),
(1173,'Mona Ali','Engineer','Back-End','mona.ali4959@gmail.com','$2b$12$2C6NzBcOoLK/mgpn9NLucunn4Fo3NPsRKuX4tsLbNl4axcCsoo39O'),
(1174,'Amr Halim','Scientist','Data','amr.halim6679@gmail.com','$2b$12$cPASPgSsoruM9NRdpo7PbO1G4/B5qGpYF6GQbfbkgqzl6QGloBaiq'),
(1175,'Khaled Naguib','Nurse','Intensive Care Nursing','khaled.naguib9831@gmail.com','$2b$12$klaJYeMSXXYrT3rtdMEhau6nUjQqq6Fbqikie1i.gK.dtC5HZ4ZU2'),
(1176,'Jessica White','Cloud Engineer','Cloud','jessica.white9845@gmail.com','$2b$12$JDPcK6PCRvPP8ibexVsmUu0fPfqSZBg5VhNC5XOmFm3E6hC5nXR7K'),
(1177,'John Smith','Scientist','Data','john.smith1539@gmail.com','$2b$12$Z61Qdm8yr0ZFFn2HF5CFPOUYhJl/roGptLMJ3axDGGqIxe63FQnd.'),
(1178,'Lara Khalil','DevOps Engineer','Automation','lara.khalil2025@gmail.com','$2b$12$0/eXoodaKERReiyrt2KybukU5OwA0Qo8cbdXh/qsTVBLa5oq3lDmO'),
(1179,'Ramy Amin','Surgeon','Brain Surgery','ramy.amin6735@gmail.com','$2b$12$YfwA6XqdETKODZzeC7T/FeFyxTc9WTDmmnPfrZXDyoAWLXiglbB2y'),
(1180,'Hany Aziz','Surgeon','ENT Surgery','hany.aziz2049@gmail.com','$2b$12$IMg0Ks4rIGP5.XvJs.aW9uQBU2Bua8KvgeaPKcTGWUKo91pBHn5U.'),
(1181,'Jessica White','Engineer','Front-End','jessica.white2275@gmail.com','$2b$12$rG3X.HUxRtUlhy53QHaKn.YVRWIkNq6PXH6saujfgWOw8R9a6vq/S'),
(1182,'Lara Khalil','Cloud Engineer','Cloud','lara.khalil3423@gmail.com','$2b$12$YlhilZzDx6NIQhX2yFbH.eud1C5.gQ/ux0O8SkM3Lg5va1iQqqHr2'),
(1183,'Youssef Gamal','Designer','UI/UX','youssef.gamal6915@gmail.com','$2b$12$DJiVyB3XiV4TjbfWXIFydePSV3P3qw3dC9OsDK4QQC6/Zwqu56K8u'),
(1184,'Tarek Ismail','HR','HR','tarek.ismail4959@gmail.com','$2b$12$fcIi17YHQzC9hcx5Cgg4leGOIMZbR1w/hlzMNl0oDU1vl3iJqEfKS'),
(1185,'Ramy Amin','Engineer','Full-Stack','ramy.amin1780@gmail.com','$2b$12$rheruhHWjH7lSzVE3q3yDeo29hAsdsvGiuYgbVoK8vvMEgElBv2l6'),
(1186,'Amr Halim','HR','HR','amr.halim4326@gmail.com','$2b$12$sCW22Lhl5Pn3zyT4ddQaye6cEGrYggkyLvUXG40FMaCl5j2Qdq62.'),
(1187,'Jessica White','Developer','Front-End','jessica.white4861@gmail.com','$2b$12$Dmi36lqEgj9uygoiqmanP.X0e5y6Z8xwmBcZiPErj.jPPFPx3kZU2'),
(1188,'Tarek Ismail','DevOps Engineer','Automation','tarek.ismail2223@gmail.com','$2b$12$rj.wXle5sxKdnVxiLsNq2eRLp6Gn4MoqU1BBminf6eeXd9EWGXtUm'),
(1189,'Mariam Kamal','Developer','Full-Stack','mariam.kamal6318@gmail.com','$2b$12$63JNXPaUgIcTH9bUtvK3tOkqSu82AgUcGw2MFYB76ggBF5EGPdHBq'),
(1190,'Jessica White','Surgeon','Heart Surgery','jessica.white5485@gmail.com','$2b$12$.6GdqVB3dPYAmKiWN/F1oOC7.gcyLmbGmoxFMsLxjqNUBkKcXBWCe'),
(1191,'Khaled Naguib','Intern','Full-Stack','khaled.naguib8049@gmail.com','$2b$12$bFyur8w9XnINkzB/HXyc.O1Fqz3.si5m9yTjnFRQK32leiw7ww70G'),
(1192,'Mai Kamal','Doctor','Dermatology (Skin)','mai.kamal8550@gmail.com','$2b$12$3OuYL84.JrOViM6iwYB7UOsJCpEt6TkGzeYKwnLEHFYskG9OdUoDm'),
(1193,'Khaled Naguib','CEO','Management','khaled.naguib5975@gmail.com','$2b$12$qxRgk8Mnyi82IooYHY.Q2OnGRNs6yrldkbmHyYQKwAIGABqtkH01u'),
(1194,'Mai Kamal','Intern','Back-End','mai.kamal6303@gmail.com','$2b$12$kueVx0HzwtAE7Vkksp9ExOJjt4vvmu2Dvpke6kB70GpmWOwIBHA72'),
(1195,'Jessica White','HR','HR','jessica.white6458@gmail.com','$2b$12$5HdoX7myZXKap8pnPiJa0ed.blPQMy2UHglodWN/KIYhMspaMwhuS'),
(1196,'Nada Fahmy','Nurse','Cancer Nursing','nada.fahmy8569@gmail.com','$2b$12$qBBBvTGgYR5bYZ8tq/byNeuP0qcAQ2X7hsRR9Gg8eyRXSug19qu3G'),
(1197,'Tarek Ismail','CEO','Management','tarek.ismail1671@gmail.com','$2b$12$WT08bsfMdXzwG8LLdn0uN.g7eGigr90LUsJX2fZi4EVMWqN6uf2fu'),
(1198,'John Smith','Engineer','Back-End','john.smith387@gmail.com','$2b$12$xsT11zjNpZ0hbDluAlrESOCgJiPyEITj1X.dDYr28724JrY7nZOsG'),
(1199,'Hany Aziz','Designer','UI/UX','hany.aziz7480@gmail.com','$2b$12$aTPCca0VzllUIkKuKfZidOnylRPmPWO3/z55dRXRp2gpmIHubeZr.'),
(1200,'Baraa Mohamed','Developer','Front-End','baraamohamed2311@gmail.com','$2b$12$xg6cHBT.woeF6SVUO5n.6Ob6TWwaDR2h80ydMPrWPdrPuzu4j40IW');