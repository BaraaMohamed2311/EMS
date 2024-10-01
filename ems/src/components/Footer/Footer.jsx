import { Link } from "@mui/joy";
import styles from "./footer.module.css"
function Footer(){

    return (
        <footer className={styles.footer}>
  	 <div className={styles.container}>
  	 	<div className={styles.row}>
  	 		<div className={styles["footer-col"]}>
  	 			<h4>company</h4>
  	 			<ul>
  	 				<li><Link href="#">about us</Link></li>
  	 				<li><Link href="#">our services</Link></li>
  	 				<li><Link href="#">privacy policy</Link></li>
  	 				<li><Link href="#">affiliLinkte program</Link></li>
  	 			</ul>
  	 		</div>
  	 		<div className={styles["footer-col"]}>
  	 			<h4>get help</h4>
  	 			<ul>
  	 				<li><Link href="#">FAQ</Link></li>
                    <li><Link href="#">Hot Line: +0332455</Link></li>
                    <li><Link href="#">Support</Link></li>
  	 			</ul>
  	 		</div>
  	 		<div className={styles["footer-col"]}>
  	 			<h4>How It Works?</h4>
  	 			<ul>
  	 				<li><Link href="#">Roles</Link></li>
  	 				<li><Link href="#">Permissions</Link></li>
  	 				<li><Link href="#">Register Staging</Link></li>
  	 			</ul>
  	 		</div>
  	 		<div className={styles["footer-col"]}>
  	 			<h4>follow us</h4>
  	 			<div className={styles["social-links"]}>
  	 				<Link href="#"><ion-icon name="logo-facebook"></ion-icon></Link>
  	 				<Link href="#"><ion-icon name="logo-twitter"></ion-icon></Link>
  	 				<Link href="#"><ion-icon name="logo-instagram"></ion-icon></Link>
  	 				<Link href="#"><ion-icon name="logo-linkedin"></ion-icon></Link>
  	 			</div>
  	 		</div>
  	 	</div>
  	 </div>
  </footer>
    )

}



export default Footer;